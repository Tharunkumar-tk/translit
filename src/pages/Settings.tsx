import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Globe, Volume2, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [defaultScript, setDefaultScript] = useState("english");
  const [autoTransliterate, setAutoTransliterate] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState([1]);
  const [fontSize, setFontSize] = useState([16]);
  const [highContrast, setHighContrast] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [cameraQuality, setCameraQuality] = useState("high");
  const [culturalNotes, setCulturalNotes] = useState(true);
  const { toast } = useToast();

  const scripts = [
    { value: "english", label: "English (Roman)", sample: "Hello" },
    { value: "hindi", label: "Hindi (देवनागरी)", sample: "नमस्ते" },
    { value: "tamil", label: "Tamil (தமிழ்)", sample: "வணக்கம்" },
    { value: "bengali", label: "Bengali (বাংলা)", sample: "নমস্কার" },
    { value: "gujarati", label: "Gujarati (ગુજરાતી)", sample: "નમસ્તે" },
    { value: "marathi", label: "Marathi (मराठी)", sample: "नमस्कार" },
    { value: "punjabi", label: "Punjabi (ਪੰਜਾਬੀ)", sample: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
    { value: "kannada", label: "Kannada (ಕನ್ನಡ)", sample: "ನಮಸ್ಕಾರ" },
    { value: "malayalam", label: "Malayalam (മലയാളം)", sample: "നമസ്കാരം" },
    { value: "telugu", label: "Telugu (తెలుగు)", sample: "నమస్కారం" }
  ];

  const saveSettings = () => {
    // Save settings to localStorage or backend
    const settings = {
      defaultScript,
      autoTransliterate,
      voiceEnabled,
      speechRate: speechRate[0],
      fontSize: fontSize[0],
      highContrast,
      offlineMode,
      cameraQuality,
      culturalNotes
    };
    
    localStorage.setItem('translit-settings', JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully."
    });
  };

  const resetSettings = () => {
    setDefaultScript("english");
    setAutoTransliterate(true);
    setVoiceEnabled(true);
    setSpeechRate([1]);
    setFontSize([16]);
    setHighContrast(false);
    setOfflineMode(false);
    setCameraQuality("high");
    setCulturalNotes(true);
    
    localStorage.removeItem('translit-settings');
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            Settings & Preferences
          </h1>
          <p className="text-lg text-muted-foreground">
            Customize TransLIT to match your preferences and needs
          </p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="camera">Camera</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>General Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Default Familiar Script</label>
                  <Select value={defaultScript} onValueChange={setDefaultScript}>
                    <SelectTrigger>
                      <SelectValue />
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
                  <p className="text-xs text-muted-foreground mt-1">
                    All text will be automatically converted to this script
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auto-Transliterate</label>
                    <p className="text-xs text-muted-foreground">
                      Automatically convert detected text to your familiar script
                    </p>
                  </div>
                  <Switch checked={autoTransliterate} onCheckedChange={setAutoTransliterate} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Offline Mode</label>
                    <p className="text-xs text-muted-foreground">
                      Use downloaded script packs when internet is unavailable
                    </p>
                  </div>
                  <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Accessibility Options</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Voice Assistance</label>
                    <p className="text-xs text-muted-foreground">
                      Enable text-to-speech for all transliterated content
                    </p>
                  </div>
                  <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speech Rate: {speechRate[0]}x
                  </label>
                  <Slider
                    value={speechRate}
                    onValueChange={setSpeechRate}
                    max={2}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                    disabled={!voiceEnabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Size: {fontSize[0]}px
                  </label>
                  <Slider
                    value={fontSize}
                    onValueChange={setFontSize}
                    max={24}
                    min={12}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">High Contrast Mode</label>
                    <p className="text-xs text-muted-foreground">
                      Enhanced visibility with high contrast colors
                    </p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="camera" className="space-y-6">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Camera Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Camera Quality</label>
                  <Select value={cameraQuality} onValueChange={setCameraQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Faster processing)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Better accuracy)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher quality improves text recognition but uses more battery
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Camera Tips</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• Hold device steady for 2-3 seconds</p>
                    <p>• Ensure good lighting conditions</p>
                    <p>• Keep text parallel to camera</p>
                    <p>• Avoid shadows and reflections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cultural" className="space-y-6">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Cultural Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Cultural Notes</label>
                    <p className="text-xs text-muted-foreground">
                      Show cultural context and meanings for religious and heritage terms
                    </p>
                  </div>
                  <Switch checked={culturalNotes} onCheckedChange={setCulturalNotes} />
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-medium mb-2 text-primary">Cultural Sensitivity</h4>
                  <p className="text-sm text-muted-foreground">
                    TransLIT respects the cultural significance of Indian languages and scripts. 
                    Cultural notes help visitors understand the deeper meaning behind terms and show 
                    appropriate respect at religious and heritage sites.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Supported Cultural Contexts</h4>
                  <div className="grid gap-2">
                    <Badge variant="outline">🕉️ Temple Architecture</Badge>
                    <Badge variant="outline">🏛️ Heritage Monuments</Badge>
                    <Badge variant="outline">🎭 Festival Terms</Badge>
                    <Badge variant="outline">🚶‍♂️ Pilgrimage Routes</Badge>
                    <Badge variant="outline">🏪 Traditional Markets</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button onClick={saveSettings} variant="default" size="lg">
            Save Settings
          </Button>
          <Button onClick={resetSettings} variant="outline" size="lg">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;