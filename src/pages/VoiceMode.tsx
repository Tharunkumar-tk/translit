import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, Copy, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VoiceMode = () => {
  const [isListening, setIsListening] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetScript, setTargetScript] = useState("hindi");
  const [spokenText, setSpokenText] = useState("");
  const [transliteratedText, setTransliteratedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const languages = [
    { value: "english", label: "English", code: "en-US" },
    { value: "hindi", label: "Hindi", code: "hi-IN" },
    { value: "tamil", label: "Tamil", code: "ta-IN" },
    { value: "bengali", label: "Bengali", code: "bn-IN" },
    { value: "gujarati", label: "Gujarati", code: "gu-IN" },
    { value: "marathi", label: "Marathi", code: "mr-IN" }
  ];

  const scripts = [
    { value: "english", label: "English (Roman)", sample: "Hello" },
    { value: "hindi", label: "Hindi (देवनागरी)", sample: "नमस्ते" },
    { value: "tamil", label: "Tamil (தமிழ்)", sample: "வணக்கம்" },
    { value: "bengali", label: "Bengali (বাংলা)", sample: "নমস্কার" },
    { value: "gujarati", label: "Gujarati (ગુજરાતી)", sample: "નમસ્તે" },
    { value: "marathi", label: "Marathi (मराठी)", sample: "नमस्कार" }
  ];

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
    
    const selectedLang = languages.find(l => l.value === sourceLanguage);
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
        processTransliteration(finalTranscript);
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

  const processTransliteration = async (text: string) => {
    setIsProcessing(true);
    
    // Simulate transliteration processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock transliteration based on source and target
    const mockTransliterations: { [key: string]: string } = {
      "english-hindi": "नमस्ते, मैं दिल्ली जाना चाहता हूं",
      "english-tamil": "வணக்கம், நான் சென்னை செல்ல வேண்டும்",
      "hindi-english": "Namaste, main Delhi jaana chahta hun",
      "tamil-english": "Vanakkam, naan Chennai sella vendum"
    };
    
    const key = `${sourceLanguage}-${targetScript}`;
    const result = mockTransliterations[key] || `Transliterated: ${text}`;
    
    setTransliteratedText(result);
    setIsProcessing(false);
    
    toast({
      title: "Transliteration Complete",
      description: "Voice converted to script successfully"
    });
  };

  const speakTransliterated = () => {
    if ('speechSynthesis' in window && transliteratedText) {
      const utterance = new SpeechSynthesisUtterance(transliteratedText);
      const targetLang = languages.find(l => l.value === targetScript);
      if (targetLang) {
        utterance.lang = targetLang.code;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transliteratedText);
    toast({
      title: "Copied!",
      description: "Transliterated text copied to clipboard"
    });
  };

  const swapLanguages = () => {
    const tempSource = sourceLanguage;
    setSourceLanguage(targetScript);
    setTargetScript(tempSource);
    setSpokenText("");
    setTransliteratedText("");
  };

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            Voice to Script
          </h1>
          <p className="text-lg text-muted-foreground">
            Speak in your language and see it written in any Indian script
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Voice Controls */}
          <div className="lg:col-span-1">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="h-5 w-5" />
                  <span>Voice Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Speak In</label>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={swapLanguages}
                    className="rounded-full"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Convert To</label>
                  <Select value={targetScript} onValueChange={setTargetScript}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scripts.map(script => (
                        <SelectItem key={script.value} value={script.value}>
                          {script.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  {!isListening ? (
                    <Button onClick={startListening} variant="default" size="lg" className="rounded-full w-20 h-20">
                      <Mic className="h-8 w-8" />
                    </Button>
                  ) : (
                    <Button onClick={stopListening} variant="destructive" size="lg" className="rounded-full w-20 h-20 animate-pulse">
                      <MicOff className="h-8 w-8" />
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
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spoken Text */}
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>What You Said</span>
                  {confidence > 0 && (
                    <Badge variant="outline">
                      {(confidence * 100).toFixed(0)}% confident
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[100px] p-4 bg-muted/50 rounded-lg">
                  {spokenText ? (
                    <p className="text-lg">{spokenText}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Your spoken words will appear here...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Transliterated Text */}
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Script Output</span>
                  {transliteratedText && (
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={speakTransliterated}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-[100px] p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  {isProcessing ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                      <span className="text-muted-foreground">Converting to script...</span>
                    </div>
                  ) : transliteratedText ? (
                    <p className="text-lg font-medium text-primary">{transliteratedText}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      Transliterated text will appear here...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Usage Tips */}
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle>Voice Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Speak clearly and at a moderate pace for best results</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Ensure your microphone has permission to access audio</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Works best in quiet environments with minimal background noise</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p>Try speaking common phrases like greetings or directions first</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMode;