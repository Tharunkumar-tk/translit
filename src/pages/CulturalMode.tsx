import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Info, Volume2, Star, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CulturalMode = () => {
  const [selectedRegion, setSelectedRegion] = useState("temples");
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const regions = [
    { value: "temples", label: "Temples & Religious Sites", icon: "🕉️" },
    { value: "heritage", label: "Heritage Monuments", icon: "🏛️" },
    { value: "markets", label: "Traditional Markets", icon: "🏪" },
    { value: "festivals", label: "Festival Locations", icon: "🎭" },
    { value: "pilgrimage", label: "Pilgrimage Routes", icon: "🚶‍♂️" }
  ];

  const culturalData = {
    temples: [
      {
        original: "गर्भगृह",
        transliterated: "Garbhagriha",
        meaning: "Sanctum Sanctorum - The innermost chamber where the deity resides",
        cultural_note: "This is the most sacred part of a Hindu temple. Devotees offer prayers here.",
        pronunciation: "gar-bha-gri-ha",
        category: "Architecture"
      },
      {
        original: "प्रदक्षिणा",
        transliterated: "Pradakshina",
        meaning: "Circumambulation - Walking around the deity clockwise",
        cultural_note: "A ritual practice showing respect and devotion to the deity.",
        pronunciation: "pra-dak-shi-na",
        category: "Ritual"
      }
    ],
    heritage: [
      {
        original: "शिखर",
        transliterated: "Shikhar",
        meaning: "Spire or Tower - The crowning element of temple architecture",
        cultural_note: "Represents the cosmic mountain and connection between earth and heaven.",
        pronunciation: "shi-khar",
        category: "Architecture"
      }
    ]
  };

  const handleTransliterate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to get cultural context.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get cultural data for selected region
    const regionData = culturalData[selectedRegion as keyof typeof culturalData] || culturalData.temples;
    setResults(regionData);
    
    setIsProcessing(false);
    toast({
      title: "Cultural Context Found",
      description: `Found ${regionData.length} cultural terms and meanings`
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const popularTerms = [
    { term: "मंदिर", meaning: "Temple", region: "temples" },
    { term: "दर्शन", meaning: "Sacred viewing", region: "temples" },
    { term: "आरती", meaning: "Prayer ceremony", region: "temples" },
    { term: "किला", meaning: "Fort", region: "heritage" },
    { term: "महल", meaning: "Palace", region: "heritage" }
  ];

  return (
    <div className="min-h-screen bg-gradient-card py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            Cultural Context Mode
          </h1>
          <p className="text-base md:text-lg text-muted-foreground px-4">
            Discover the cultural significance and meanings behind Indian scripts and terms
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 xl:grid-cols-3">
          {/* Input Section */}
          <div className="xl:col-span-1">
            <Card className="shadow-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <MapPin className="h-5 w-5" />
                  <span>Cultural Context</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Context Type</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region.value} value={region.value}>
                          <span className="flex items-center space-x-2">
                            <span>{region.icon}</span>
                            <span>{region.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Enter Text or Term</label>
                  <Input
                    placeholder="Enter text in any script..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="text-base md:text-lg"
                  />
                </div>

                <Button
                  onClick={handleTransliterate}
                  variant="default"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Analyzing..." : "Get Cultural Context"}
                </Button>

                {/* Quick Terms */}
                <div>
                  <h4 className="font-medium mb-3">Popular Terms</h4>
                  <div className="space-y-2">
                    {popularTerms.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => setInputText(item.term)}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{item.term}</span>
                          <span className="text-xs text-muted-foreground">{item.meaning}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto">
                <TabsTrigger value="results">Cultural Results</TabsTrigger>
                <TabsTrigger value="guide">Cultural Guide</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-6">
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <Card key={index} className="shadow-card-hover">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg md:text-xl">
                            {result.original} → {result.transliterated}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{result.category}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakText(result.original)}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6 space-y-4">
                        <div>
                          <h4 className="font-medium text-primary mb-2">Meaning</h4>
                          <p className="text-sm md:text-base text-foreground">{result.meaning}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-accent mb-2">Cultural Significance</h4>
                          <p className="text-sm md:text-base text-muted-foreground">{result.cultural_note}</p>
                        </div>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <h4 className="font-medium mb-2">Pronunciation</h4>
                            <div className="flex items-center space-x-2">
                              <code className="bg-muted px-2 py-1 rounded text-sm">
                                {result.pronunciation}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => speakText(result.transliterated)}
                              >
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Category</h4>
                            <Badge variant="secondary">{result.category}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="shadow-card-hover">
                    <CardContent className="py-8 md:py-12 text-center">
                      <Info className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-base md:text-lg font-medium mb-2">No Results Yet</h3>
                      <p className="text-sm md:text-base text-muted-foreground">
                        Enter a term or phrase to discover its cultural context and significance
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="guide" className="space-y-6">
                <Card className="shadow-card-hover">
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Cultural Context Guide</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <span className="mr-2">🕉️</span>
                        Temple Architecture
                      </h4>
                      <div className="grid gap-2 text-xs md:text-sm">
                        <p><strong>Garbhagriha:</strong> The innermost sanctum where the main deity resides</p>
                        <p><strong>Mandapa:</strong> Pillared hall for gatherings and ceremonies</p>
                        <p><strong>Shikhara:</strong> Tower or spire representing cosmic mountain</p>
                        <p><strong>Pradakshina:</strong> Clockwise circumambulation path</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <span className="mr-2">🎭</span>
                        Ritual Terms
                      </h4>
                      <div className="grid gap-2 text-xs md:text-sm">
                        <p><strong>Darshan:</strong> Sacred viewing or audience with deity</p>
                        <p><strong>Aarti:</strong> Prayer ceremony with lamps and incense</p>
                        <p><strong>Prasad:</strong> Blessed food offering distributed to devotees</p>
                        <p><strong>Puja:</strong> Worship ritual with offerings and prayers</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center">
                        <span className="mr-2">🏛️</span>
                        Heritage Terms
                      </h4>
                      <div className="grid gap-2 text-xs md:text-sm">
                        <p><strong>Qila:</strong> Fort or fortified palace complex</p>
                        <p><strong>Mahal:</strong> Palace or grand residence</p>
                        <p><strong>Haveli:</strong> Traditional ornate mansion</p>
                        <p><strong>Chhatri:</strong> Elevated dome-shaped pavilion</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <h4 className="font-medium mb-2 text-primary">Cultural Sensitivity</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Understanding these terms helps visitors show proper respect and appreciation 
                        for India's rich cultural heritage. Each term carries deep spiritual and 
                        historical significance beyond its literal translation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalMode;