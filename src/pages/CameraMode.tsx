import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Scan, Volume2, Download, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CameraMode = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [targetScript, setTargetScript] = useState("english");
  const [multiScript, setMultiScript] = useState(false);
  const [arMode, setArMode] = useState(true);
  const [detectedTexts, setDetectedTexts] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const scripts = [
    { value: "english", label: "English", sample: "Hello" },
    { value: "hindi", label: "Hindi (देवनागरी)", sample: "नमस्ते" },
    { value: "tamil", label: "Tamil (தமிழ்)", sample: "வணக்கம்" },
    { value: "bengali", label: "Bengali (বাংলা)", sample: "নমস্কার" },
    { value: "gujarati", label: "Gujarati (ગુજરાતી)", sample: "નમસ્તે" },
    { value: "marathi", label: "Marathi (मराठी)", sample: "नमस्कार" }
  ];

  const multiScriptOutputs = [
    { script: "english", text: "Railway Station" },
    { script: "hindi", text: "रेलवे स्टेशन" },
    { script: "tamil", text: "ரயில் நிலையம்" }
  ];

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
    
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0);
    
    // Simulate OCR processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock detected text with positions
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
    setIsProcessing(false);
    
    toast({
      title: "Text Detected",
      description: `Found ${mockDetections.length} text regions`
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            AR Camera Mode
          </h1>
          <p className="text-lg text-muted-foreground">
            Point your camera at text for real-time transliteration overlay
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Camera Controls */}
          <div className="lg:col-span-1">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Camera Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  {!isStreaming ? (
                    <Button onClick={startCamera} variant="default" size="lg">
                      <Camera className="h-5 w-5 mr-2" />
                      Start Camera
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="destructive" size="lg">
                      <CameraOff className="h-5 w-5 mr-2" />
                      Stop Camera
                    </Button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Script</label>
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
                    disabled={isProcessing}
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Scan Text"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Multi-Script Results */}
            {multiScript && detectedTexts.length > 0 && (
              <Card className="mt-6 shadow-card-hover">
                <CardHeader>
                  <CardTitle>Multi-Script Output</CardTitle>
                </CardHeader>
                <CardContent>
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
                          onClick={() => speakText(output.text)}
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

          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Camera Feed</span>
                  {isStreaming && (
                    <Badge variant="default" className="animate-pulse">
                      Live
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                      
                      {/* AR Overlays */}
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
                      
                      {/* Processing Overlay */}
                      {isProcessing && (
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

            {/* Detection Results */}
            {!arMode && detectedTexts.length > 0 && (
              <Card className="mt-6 shadow-card-hover">
                <CardHeader>
                  <CardTitle>Detected Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {detectedTexts.map((detection) => (
                      <div key={detection.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">
                            Confidence: {(detection.confidence * 100).toFixed(0)}%
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(detection.transliterated)}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid gap-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Original:</span>
                            <p className="font-medium text-lg">{detection.original}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Transliterated:</span>
                            <p className="font-medium text-lg text-primary">{detection.transliterated}</p>
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
      </div>
    </div>
  );
};

export default CameraMode;