import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, RotateCcw, Copy, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Transliterate = () => {
  const [sourceScript, setSourceScript] = useState("hindi");
  const [targetScript, setTargetScript] = useState("english");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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

  const sampleTransliterations = {
    "hindi-english": { input: "नमस्ते, मैं दिल्ली जाना चाहता हूं", output: "Namaste, main Delhi jaana chahta hun" },
    "english-hindi": { input: "Hello, I want to go to Delhi", output: "नमस्ते, मैं दिल्ली जाना चाहता हूं" },
    "tamil-english": { input: "வணக்கம், நான் சென்னை செல்ல வேண்டும்", output: "Vanakkam, naan Chennai sella vendum" },
    "english-tamil": { input: "Hello, I need to go to Chennai", output: "வணக்கம், நான் சென்னை செல்ல வேண்டும்" }
  };

  const handleTransliterate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to transliterate.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const key = `${sourceScript}-${targetScript}`;
    const sample = sampleTransliterations[key as keyof typeof sampleTransliterations];
    
    if (sample && inputText.toLowerCase().includes(sample.input.toLowerCase().split(' ')[0])) {
      setOutputText(sample.output);
    } else {
      // Generate a mock transliteration
      setOutputText(`Transliterated text from ${sourceScript} to ${targetScript}: ${inputText}`);
    }
    
    setIsProcessing(false);
    toast({
      title: "Transliteration Complete",
      description: "Text has been successfully transliterated."
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied!",
      description: "Transliterated text copied to clipboard."
    });
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window && outputText) {
      const utterance = new SpeechSynthesisUtterance(outputText);
      window.speechSynthesis.speak(utterance);
      toast({
        title: "Speaking",
        description: "Reading transliterated text aloud."
      });
    }
  };

  const swapScripts = () => {
    setSourceScript(targetScript);
    setTargetScript(sourceScript);
    setInputText(outputText);
    setOutputText(inputText);
  };

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            Real-time Transliteration
          </h1>
          <p className="text-lg text-muted-foreground">
            Convert text between Indian scripts instantly with AI-powered accuracy
          </p>
        </div>

        <Card className="shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Script Transliteration</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Script Selection */}
            <div className="grid gap-4 md:grid-cols-3 items-center">
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
              
              <div className="flex justify-center">
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

            {/* Text Areas */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">Input Text</label>
                <Textarea
                  placeholder="Enter text to transliterate..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Transliterated Text</span>
                  {outputText && (
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" onClick={handleSpeak}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </label>
                <Textarea
                  placeholder="Transliterated text will appear here..."
                  value={outputText}
                  readOnly
                  className="min-h-[200px] text-lg bg-muted"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleTransliterate}
                variant="default"
                size="lg"
                disabled={isProcessing}
                className="min-w-[200px]"
              >
                {isProcessing ? "Transliterating..." : "Transliterate"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Examples */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Quick Example 1</h3>
              <p className="text-sm text-muted-foreground mb-2">Hindi to English</p>
              <p className="text-sm"><strong>Input:</strong> नमस्ते, मैं दिल्ली जाना चाहता हूं</p>
              <p className="text-sm"><strong>Output:</strong> Namaste, main Delhi jaana chahta hun</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Quick Example 2</h3>
              <p className="text-sm text-muted-foreground mb-2">Tamil to English</p>
              <p className="text-sm"><strong>Input:</strong> வணக்கம், நான் சென்னை செல்ல வேண்டும்</p>
              <p className="text-sm"><strong>Output:</strong> Vanakkam, naan Chennai sella vendum</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Transliterate;