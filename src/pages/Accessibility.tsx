import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  Volume2, 
  Eye, 
  Type, 
  Contrast, 
  VolumeX, 
  Headphones,
  MousePointer,
  Keyboard,
  Accessibility as AccessibilityIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Accessibility = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [textSize, setTextSize] = useState([16]);
  const [speechRate, setSpeechRate] = useState([1]);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const { toast } = useToast();

  const handleVoiceTest = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        "TransLIT accessibility features help everyone navigate India's diverse languages with ease."
      );
      utterance.rate = speechRate[0];
      window.speechSynthesis.speak(utterance);
      
      toast({
        title: "Voice Assistant Active",
        description: "Reading sample text aloud."
      });
    } else {
      toast({
        title: "Voice Not Available",
        description: "Speech synthesis is not supported in this browser.",
        variant: "destructive"
      });
    }
  };

  const features = [
    {
      icon: Volume2,
      title: "Voice Assistance",
      description: "Text-to-speech for all transliterated content and navigation instructions",
      enabled: voiceEnabled,
      toggle: setVoiceEnabled
    },
    {
      icon: Contrast,
      title: "High Contrast Mode",
      description: "Enhanced visibility with high contrast colors and bold text",
      enabled: highContrast,
      toggle: setHighContrast
    },
    {
      icon: Type,
      title: "Large Text Display",
      description: "Increased font sizes for better readability",
      enabled: largeText,
      toggle: setLargeText
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard access for all interface elements",
      enabled: keyboardNavigation,
      toggle: setKeyboardNavigation
    },
    {
      icon: Headphones,
      title: "Screen Reader Support",
      description: "Optimized for NVDA, JAWS, and VoiceOver compatibility",
      enabled: screenReader,
      toggle: setScreenReader
    }
  ];

  return (
    <div className={`min-h-screen py-4 md:py-8 ${highContrast ? 'bg-black text-white' : 'bg-gradient-card'}`}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className={`text-3xl font-bold mb-4 lg:text-4xl ${
            largeText ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'
          } ${highContrast ? 'text-white' : 'text-foreground'}`}>
            Accessibility Features
          </h1>
          <p className={`text-lg ${
            largeText ? 'text-lg md:text-xl' : 'text-base md:text-lg'
          } ${highContrast ? 'text-gray-200' : 'text-muted-foreground'}`}>
            Inclusive design ensuring TransLIT works for everyone
          </p>
        </div>

        {/* Quick Settings Panel */}
        <Card className={`mb-6 md:mb-8 ${highContrast ? 'bg-gray-900 border-white' : ''}`}>
          <CardHeader>
            <CardTitle className={`flex items-center space-x-2 text-lg md:text-xl ${
              highContrast ? 'text-white' : ''
            }`}>
              <AccessibilityIcon className="h-6 w-6" />
              <span>Quick Accessibility Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-6">
            {/* Voice Controls */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  highContrast ? 'text-white' : ''
                }`}>
                  Speech Rate: {speechRate[0]}x
                </label>
                <Slider
                  value={speechRate}
                  onValueChange={setSpeechRate}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  highContrast ? 'text-white' : ''
                }`}>
                  Text Size: {textSize[0]}px
                </label>
                <Slider
                  value={textSize}
                  onValueChange={setTextSize}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Voice Test Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleVoiceTest}
                variant={highContrast ? "outline" : "default"}
                size="lg"
                disabled={!voiceEnabled}
                className={highContrast ? 'border-white text-white hover:bg-white hover:text-black' : ''}
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Test Voice Assistant
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <div className="grid gap-4 md:gap-6 mb-6 md:mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className={`${
                highContrast ? 'bg-gray-900 border-white' : 'hover:shadow-card-hover'
              } transition-all duration-300`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3 md:space-x-4 flex-1">
                      <div className={`rounded-lg p-3 ${
                        highContrast 
                          ? 'bg-white text-black' 
                          : feature.enabled 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                        <h3 className={`text-base md:text-lg font-semibold ${
                          highContrast ? 'text-white' : 'text-foreground'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm ${
                        <p className={`text-xs md:text-sm ${
                          highContrast ? 'text-gray-200' : 'text-muted-foreground'
                        } ${largeText ? 'text-base' : ''}`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={feature.toggle}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demonstration Section */}
        <Card className={highContrast ? 'bg-gray-900 border-white' : ''}>
          <CardHeader>
            <CardTitle className={`text-lg md:text-xl ${highContrast ? 'text-white' : ''}`}>
              Accessibility in Action
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-6">
            {/* Sample transliteration with accessibility features */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className={`p-4 rounded-lg border ${
                highContrast ? 'border-white bg-black' : 'bg-muted/50'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  largeText ? 'text-base md:text-lg' : 'text-sm'
                } ${highContrast ? 'text-white' : ''}`}>
                  Original Text
                </h4>
                <p className={`${
                  largeText ? 'text-lg md:text-xl' : 'text-base md:text-lg'
                } ${highContrast ? 'text-white font-bold' : ''}`}
                style={{ fontSize: `${textSize[0]}px` }}>
                  रेलवे स्टेशन कहाँ है?
                </p>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                highContrast ? 'border-white bg-black' : 'bg-muted/50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    largeText ? 'text-base md:text-lg' : 'text-sm'
                  } ${highContrast ? 'text-white' : ''}`}>
                    Transliterated
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVoiceTest()}
                    disabled={!voiceEnabled}
                    className={highContrast ? 'text-white hover:bg-white hover:text-black' : ''}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className={`${
                  largeText ? 'text-lg md:text-xl' : 'text-base md:text-lg'
                } ${highContrast ? 'text-white font-bold' : ''}`}
                style={{ fontSize: `${textSize[0]}px` }}>
                  Railway station kahan hai?
                </p>
              </div>
            </div>

            {/* Keyboard shortcuts */}
            <div className={`p-4 rounded-lg border ${
              highContrast ? 'border-white bg-gray-800' : 'bg-muted/30'
            }`}>
              <h4 className={`font-medium mb-3 ${
                largeText ? 'text-base md:text-lg' : 'text-sm'
              } ${highContrast ? 'text-white' : ''}`}>
                Keyboard Shortcuts
              </h4>
              <div className="grid gap-2 sm:grid-cols-2 text-xs md:text-sm">
                <div className={`flex justify-between ${
                  highContrast ? 'text-gray-200' : 'text-muted-foreground'
                }`}>
                  <span>Speak Text:</span>
                  <kbd className={`px-2 py-1 rounded ${
                    highContrast ? 'bg-white text-black' : 'bg-background'
                  }`}>Ctrl + S</kbd>
                </div>
                <div className={`flex justify-between ${
                  highContrast ? 'text-gray-200' : 'text-muted-foreground'
                }`}>
                  <span>Toggle Contrast:</span>
                  <kbd className={`px-2 py-1 rounded ${
                    highContrast ? 'bg-white text-black' : 'bg-background'
                  }`}>Ctrl + Alt + C</kbd>
                </div>
                <div className={`flex justify-between ${
                  highContrast ? 'text-gray-200' : 'text-muted-foreground'
                }`}>
                  <span>Navigate Scripts:</span>
                  <kbd className={`px-2 py-1 rounded ${
                    highContrast ? 'bg-white text-black' : 'bg-background'
                  }`}>Tab</kbd>
                </div>
                <div className={`flex justify-between ${
                  highContrast ? 'text-gray-200' : 'text-muted-foreground'
                }`}>
                  <span>Activate Button:</span>
                  <kbd className={`px-2 py-1 rounded ${
                    highContrast ? 'bg-white text-black' : 'bg-background'
                  }`}>Enter</kbd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accessibility;