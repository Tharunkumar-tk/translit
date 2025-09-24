import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Languages, 
  Camera, 
  Mic, 
  Copy, 
  Volume2, 
  RotateCcw, 
  CameraOff, 
  MicOff, 
  Scan,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect } from "react";

const Transliterate = () => {
  // Common state
  const [sourceScript, setSourceScript] = useState("hindi");
  const [targetScript, setTargetScript] = useState("english");
  const { toast } = useToast();

  // Text mode state
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isTextProcessing, setIsTextProcessing] = useState(false);

  // Camera mode state
  const [isStreaming, setIsStreaming] = useState(false);
  const [multiScript, setMultiScript] = useState(false);
  const [arMode, setArMode] = useState(true);
  const [detectedTexts, setDetectedTexts] = useState<any[]>([]);
  const [isCameraProcessing, setIsCameraProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Voice mode state
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [transliteratedText, setTransliteratedText] = useState("");
  const [isVoiceProcessing, setIsVoiceProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<any>(null);

  const scripts = [
    { value: "hindi", label: "Hindi (देवनागरी)", sample: "नमस्ते" },
    { value: "english", label: "English", sample: "Hello" },
    { value: "tamil", label: "Tamil (தமிழ்)", sample: "வணக்கம்" },
    { value: "bengali", label: "Bengali (বাংলা)", sample: "নমস্কার" },
    { value: "gujarati", label: "Gujarati (ગુજરાતી)", sample: "નમસ્તે" },
    { value: "marathi", label: "Marathi (मराठी)", sample: "नमस्कार" },
    { value: "punjabi", label: "Punjabi (ਪੰਜਾਬੀ)", sample: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
    { value: "kannada", label: "Kannada (ಕನ್ನಡ)", sample: "ನಮಸ್ಕಾರ" },
    { value: "malayalam", label: "Malayalam (മലയാളം)", sample: "നമസ്കാരം" },
    { value: "telugu", label: "Telugu (తెలుగు)", sample: "నమస్కారం" }
  ];

  const languages = [
    { value: "english", label: "English", code: "en-US" },
    { value: "hindi", label: "Hindi", code: "hi-IN" },
    { value: "tamil", label: "Tamil", code: "ta-IN" },
    { value: "bengali", label: "Bengali", code: "bn-IN" },
    { value: "gujarati", label: "Gujarati", code: "gu-IN" },
    { value: "marathi", label: "Marathi", code: "mr-IN" }
  ];

  const sampleTransliterations = {
    "hindi-english": { input: "नमस्ते, मैं दिल्ली जाना चाहता हूं", output: "Namaste, main Delhi jaana chahta hun" },
    "english-hindi": { input: "Hello, I want to go to Delhi", output: "नमस्ते, मैं दिल्ली जाना चाहता हूं" },
    "tamil-english": { input: "வணக்கம், நான் சென்னை செல்ல வேண்டும்", output: "Vanakkam, naan Chennai sella vendum" },
    "english-tamil": { input: "Hello, I need to go to Chennai", output: "வணக்கம், நான் சென்னை செல்ல வேண்டும்" }
  };

  const multiScriptOutputs = [
    { script: "english", text: "Railway Station" },
    { script: "hindi", text: "रेलवे स्टेशन" },
    { script: "tamil", text: "ரயில் நிலையம்" }
  ];

  // Text mode functions
  const handleTextTransliterate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to transliterate.",
        variant: "destructive"
      });
      return;
    }

    setIsTextProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const key = `${sourceScript}-${targetScript}`;
    const sample = sampleTransliterations[key as keyof typeof sampleTransliterations];
    
    if (sample && inputText.toLowerCase().includes(sample.input.toLowerCase().split(' ')[0])) {
      setOutputText(sample.output);
    } else {
      setOutputText(`Transliterated text from ${sourceScript} to ${targetScript}: ${inputText}`);
    }
    
    setIsTextProcessing(false);
    toast({
      title: "Transliteration Complete",
      description: "Text has been successfully transliterated."
    });
  };

  // Camera mode functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        toast({
          title: "Camera Started",
          description: "Point your camera at text to transliterate"
        });
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setDetectedTexts([]);
  };

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCameraProcessing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockDetections = [
      {
        id: 1,
        original: "रेलवे स्टेशन",
        transliterated: "Railway Station",
        x: 150,
        y: 200,
        width: 200,
        height: 40,
        confidence: 0.95
      },
      {
        id: 2,
        original: "प्रवेश द्वार",
        transliterated: "Entrance",
        x: 100,
        y: 300,
        width: 150,
        height: 35,
        confidence: 0.88
      }
    ];
    
    setDetectedTexts(mockDetections);
    setIsCameraProcessing(false);
    
    toast({
      title: "Text Detected",
      description: `Found ${mockDetections.length} text regions`
    });
  };

  // Voice mode functions
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const selectedLang = languages.find(l => l.value === sourceScript);
    recognitionRef.current.lang = selectedLang?.code || 'en-US';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setSpokenText("");
      setTransliteratedText("");
      toast({
        title: "Listening...",
        description: "Speak now to convert to script"
      });
    };

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          setConfidence(event.results[i][0].confidence);
        } else {
          interimTranscript += transcript;
        }
      }

      setSpokenText(finalTranscript || interimTranscript);
      
      if (finalTranscript) {
        processVoiceTransliteration(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      setIsListening(false);
      toast({
        title: "Speech Recognition Error",
        description: `Error: ${event.error}`,
        variant: "destructive"
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processVoiceTransliteration = async (text: string) => {
    setIsVoiceProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockTransliterations: { [key: string]: string } = {
      "english-hindi": "नमस्ते, मैं दिल्ली जाना चाहता हूं",
      "english-tamil": "வணக்கம், நான் சென்னை செல்ல வேண்டும்",
      "hindi-english": "Namaste, main Delhi jaana chahta hun",
      "tamil-english": "Vanakkam, naan Chennai sella vendum"
    };
    
    const key = `${sourceScript}-${targetScript}`;
    const result = mockTransliterations[key] || `Transliterated: ${text}`;
    
    setTransliteratedText(result);
    setIsVoiceProcessing(false);
    
    toast({
      title: "Transliteration Complete",
      description: "Voice converted to script successfully"
    });
  };

  // Common functions
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard."
    });
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const swapScripts = () => {
    setSourceScript(targetScript);
    setTargetScript(sourceScript);
    setInputText(outputText);
    setOutputText(inputText);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-card py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            TransLIT - All Modes
          </h1>
          <p className="text-base md:text-lg text-muted-foreground px-4">
            Text, Camera, and Voice transliteration in one unified interface
          </p>
        </div>

        {/* Global Script Selection */}
        <Card className="mb-6 md:mb-8 shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <Settings className="h-5 w-5" />
              <span>Script Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid gap-4 items-center">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <Select value={sourceScript} onValueChange={setSourceScript}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source script" />
                  </SelectTrigger>
                  <SelectContent>
                    {scripts.map(script => (
                      <SelectItem key={script.value} value={script.value}>
                        <div className="flex flex-col">
                          <span>{script.label}</span>
                          <span className="text-xs text-muted-foreground">{script.sample}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-center md:order-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={swapScripts}
                  className="rounded-full"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <Select value={targetScript} onValueChange={setTargetScript}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target script" />
                  </SelectTrigger>
                  <SelectContent>
                    {scripts.map(script => (
                      <SelectItem key={script.value} value={script.value}>
                        <div className="flex flex-col">
                          <span>{script.label}</span>
                          <span className="text-xs text-muted-foreground">{script.sample}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mode Tabs */}
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="text" className="flex items-center space-x-2">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Text</span>
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Camera</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Voice</span>
            </TabsTrigger>
          </TabsList>

          {/* Text Mode */}
          <TabsContent value="text" className="space-y-6">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Text Transliteration</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Input Text</label>
                    <Textarea
                      placeholder="Enter text to transliterate..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[150px] md:min-h-[200px] text-base md:text-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                      <span>Transliterated Text</span>
                      {outputText && (
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleSpeak(outputText)}>
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(outputText)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </label>
                    <Textarea
                      placeholder="Transliterated text will appear here..."
                      value={outputText}
                      readOnly
                      className="min-h-[150px] md:min-h-[200px] text-base md:text-lg bg-muted"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleTextTransliterate}
                    variant="default"
                    size="lg"
                    disabled={isTextProcessing}
                    className="min-w-[200px]"
                  >
                    {isTextProcessing ? "Transliterating..." : "Transliterate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Camera Mode */}
          <TabsContent value="camera" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-1">
                <Card className="shadow-card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Camera Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-6">
                    <div className="flex justify-center">
                      {!isStreaming ? (
                        <Button onClick={startCamera} variant="default" size="lg" className="w-full sm:w-auto">
                          <Camera className="h-5 w-5 mr-2" />
                          Start Camera
                        </Button>
                      ) : (
                        <Button onClick={stopCamera} variant="destructive" size="lg" className="w-full sm:w-auto">
                          <CameraOff className="h-5 w-5 mr-2" />
                          Stop Camera
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Multi-Script Output</label>
                        <Switch checked={multiScript} onCheckedChange={setMultiScript} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">AR Overlay Mode</label>
                        <Switch checked={arMode} onCheckedChange={setArMode} />
                      </div>
                    </div>

                    {isStreaming && (
                      <Button 
                        onClick={captureAndProcess} 
                        variant="accent" 
                        className="w-full"
                        disabled={isCameraProcessing}
                      >
                        <Scan className="h-4 w-4 mr-2" />
                        {isCameraProcessing ? "Processing..." : "Scan Text"}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {multiScript && detectedTexts.length > 0 && (
                  <Card className="mt-6 shadow-card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">Multi-Script Output</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      <div className="space-y-3">
                        {multiScriptOutputs.map((output, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <Badge variant="outline" className="mb-1">
                                {scripts.find(s => s.value === output.script)?.label}
                              </Badge>
                              <p className="font-medium">{output.text}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSpeak(output.text)}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="xl:col-span-2">
                <Card className="shadow-card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                      <span>Live Camera Feed</span>
                      {isStreaming && (
                        <Badge variant="default" className="animate-pulse">
                          Live
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      {isStreaming ? (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          
                          {arMode && detectedTexts.map((detection) => (
                            <div
                              key={detection.id}
                              className="absolute bg-primary/90 text-primary-foreground px-2 py-1 rounded text-sm font-medium shadow-lg"
                              style={{
                                left: `${(detection.x / 640) * 100}%`,
                                top: `${(detection.y / 480) * 100}%`,
                                transform: 'translate(-50%, -100%)'
                              }}
                            >
                              {detection.transliterated}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/90"></div>
                            </div>
                          ))}
                          
                          {isCameraProcessing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="bg-card p-4 rounded-lg text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                <p className="text-sm">Processing image...</p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <div className="text-center">
                            <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Camera not active</p>
                            <p className="text-sm">Start camera to begin transliteration</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <canvas ref={canvasRef} className="hidden" />
                  </CardContent>
                </Card>

                {!arMode && detectedTexts.length > 0 && (
                  <Card className="mt-6 shadow-card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">Detected Text</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      <div className="space-y-3">
                        {detectedTexts.map((detection) => (
                          <div key={detection.id} className="p-3 md:p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">
                                Confidence: {(detection.confidence * 100).toFixed(0)}%
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSpeak(detection.transliterated)}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid gap-2">
                              <div>
                                <span className="text-sm text-muted-foreground">Original:</span>
                                <p className="font-medium text-base md:text-lg">{detection.original}</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Transliterated:</span>
                                <p className="font-medium text-base md:text-lg text-primary">{detection.transliterated}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Voice Mode */}
          <TabsContent value="voice" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-1">
                <Card className="shadow-card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Voice Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-6">
                    <div className="flex justify-center">
                      {!isListening ? (
                        <Button onClick={startListening} variant="default" size="lg" className="rounded-full w-16 h-16 md:w-20 md:h-20">
                          <Mic className="h-6 w-6 md:h-8 md:w-8" />
                        </Button>
                      ) : (
                        <Button onClick={stopListening} variant="destructive" size="lg" className="rounded-full w-16 h-16 md:w-20 md:h-20 animate-pulse">
                          <MicOff className="h-6 w-6 md:h-8 md:w-8" />
                        </Button>
                      )}
                    </div>

                    {isListening && (
                      <div className="text-center">
                        <Badge variant="default" className="animate-pulse">
                          Listening...
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          Speak clearly into your microphone
                        </p>
                      </div>
                    )}

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Voice Tips</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>• Speak clearly and at moderate pace</p>
                        <p>• Ensure microphone permissions</p>
                        <p>• Use quiet environments</p>
                        <p>• Try common phrases first</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="xl:col-span-2 space-y-6">
                <Card className="shadow-card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                      <span>What You Said</span>
                      {confidence > 0 && (
                        <Badge variant="outline">
                          {(confidence * 100).toFixed(0)}% confident
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="min-h-[100px] p-4 bg-muted/50 rounded-lg">
                      {spokenText ? (
                        <p className="text-base md:text-lg">{spokenText}</p>
                      ) : (
                        <p className="text-sm md:text-base text-muted-foreground italic">
                          Your spoken words will appear here...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg md:text-xl">
                      <span>Script Output</span>
                      {transliteratedText && (
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleSpeak(transliteratedText)}>
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(transliteratedText)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="min-h-[100px] p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      {isVoiceProcessing ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                          <span className="text-sm md:text-base text-muted-foreground">Converting to script...</span>
                        </div>
                      ) : transliteratedText ? (
                        <p className="text-base md:text-lg font-medium text-primary">{transliteratedText}</p>
                      ) : (
                        <p className="text-sm md:text-base text-muted-foreground italic">
                          Transliterated text will appear here...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Transliterate;