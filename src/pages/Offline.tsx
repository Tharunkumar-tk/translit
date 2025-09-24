import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Download, HardDrive, Wifi, WifiOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Offline = () => {
  const [selectedPacks, setSelectedPacks] = useState<string[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  const [downloadedPacks, setDownloadedPacks] = useState<string[]>(["hindi-pack"]);
  const { toast } = useToast();

  const scriptPacks = [
    {
      id: "hindi-pack",
      name: "Hindi Script Pack",
      description: "Complete Hindi (Devanagari) transliteration support",
      size: "45 MB",
      languages: ["Hindi", "Marathi", "Sanskrit"],
      script: "देवनागरी"
    },
    {
      id: "tamil-pack", 
      name: "Tamil Script Pack",
      description: "Tamil script transliteration and navigation support",
      size: "38 MB",
      languages: ["Tamil"],
      script: "தமிழ்"
    },
    {
      id: "bengali-pack",
      name: "Bengali Script Pack", 
      description: "Bengali script with full transliteration capabilities",
      size: "42 MB",
      languages: ["Bengali", "Assamese"],
      script: "বাংলা"
    },
    {
      id: "gujarati-pack",
      name: "Gujarati Script Pack",
      description: "Gujarati script support for Western India",
      size: "35 MB", 
      languages: ["Gujarati"],
      script: "ગુજરાતી"
    },
    {
      id: "punjabi-pack",
      name: "Punjabi Script Pack",
      description: "Gurmukhi script for Punjabi language support",
      size: "33 MB",
      languages: ["Punjabi"],
      script: "ਪੰਜਾਬੀ"
    },
    {
      id: "kannada-pack",
      name: "Kannada Script Pack",
      description: "Kannada script for South Indian navigation",
      size: "40 MB",
      languages: ["Kannada"],
      script: "ಕನ್ನಡ"
    },
    {
      id: "malayalam-pack",
      name: "Malayalam Script Pack",
      description: "Malayalam script support for Kerala",
      size: "44 MB",
      languages: ["Malayalam"],
      script: "മലയാളം"
    },
    {
      id: "telugu-pack",
      name: "Telugu Script Pack",
      description: "Telugu script for Andhra Pradesh & Telangana",
      size: "41 MB",
      languages: ["Telugu"],
      script: "తెలుగు"
    }
  ];

  const handlePackSelect = (packId: string) => {
    if (downloadedPacks.includes(packId)) return;
    
    setSelectedPacks(prev => 
      prev.includes(packId) 
        ? prev.filter(id => id !== packId)
        : [...prev, packId]
    );
  };

  const handleDownloadSelected = async () => {
    if (selectedPacks.length === 0) {
      toast({
        title: "No Packs Selected",
        description: "Please select at least one script pack to download.",
        variant: "destructive"
      });
      return;
    }

    for (const packId of selectedPacks) {
      setDownloadProgress(prev => ({ ...prev, [packId]: 0 }));
      
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDownloadProgress(prev => ({ ...prev, [packId]: i }));
      }
      
      setDownloadedPacks(prev => [...prev, packId]);
      setDownloadProgress(prev => {
        const { [packId]: removed, ...rest } = prev;
        return rest;
      });
    }
    
    setSelectedPacks([]);
    toast({
      title: "Download Complete",
      description: `Successfully downloaded ${selectedPacks.length} script pack(s) for offline use.`
    });
  };

  const totalDownloadedSize = downloadedPacks.reduce((total, packId) => {
    const pack = scriptPacks.find(p => p.id === packId);
    return total + parseInt(pack?.size || "0");
  }, 0);

  const totalSelectedSize = selectedPacks.reduce((total, packId) => {
    const pack = scriptPacks.find(p => p.id === packId);
    return total + parseInt(pack?.size || "0");
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-card py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            Offline Script Packs
          </h1>
          <p className="text-base md:text-lg text-muted-foreground px-4">
            Download script packs for seamless use without internet connectivity
          </p>
        </div>

        {/* Storage Overview */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <HardDrive className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-sm md:text-base font-semibold">Storage Used</h3>
              <p className="text-xl md:text-2xl font-bold text-primary">{totalDownloadedSize} MB</p>
              <p className="text-xs md:text-sm text-muted-foreground">of 500 MB available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <Download className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-accent" />
              <h3 className="text-sm md:text-base font-semibold">Packs Installed</h3>
              <p className="text-xl md:text-2xl font-bold text-accent">{downloadedPacks.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground">of {scriptPacks.length} available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 md:p-6 text-center">
              <WifiOff className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2 text-secondary" />
              <h3 className="text-sm md:text-base font-semibold">Offline Ready</h3>
              <p className="text-xl md:text-2xl font-bold text-secondary">Yes</p>
              <p className="text-xs md:text-sm text-muted-foreground">Works without internet</p>
            </CardContent>
          </Card>
        </div>

        {/* Download Actions */}
        {selectedPacks.length > 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {selectedPacks.length} pack(s) selected ({totalSelectedSize} MB)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ready to download for offline use
                  </p>
                </div>
                <Button onClick={handleDownloadSelected} variant="accent" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download Selected
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Script Packs Grid */}
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scriptPacks.map((pack) => {
            const isDownloaded = downloadedPacks.includes(pack.id);
            const isSelected = selectedPacks.includes(pack.id);
            const isDownloading = downloadProgress[pack.id] !== undefined;
            
            return (
              <Card 
                key={pack.id}
                className={`cursor-pointer transition-all duration-300 ${
                  isDownloaded 
                    ? 'border-accent bg-accent/5' 
                    : isSelected 
                    ? 'border-primary bg-primary/5 shadow-primary' 
                    : 'hover:shadow-card-hover'
                }`}
                onClick={() => handlePackSelect(pack.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base md:text-lg flex items-center space-x-2">
                        <span>{pack.name}</span>
                        {isDownloaded && (
                          <CheckCircle className="h-5 w-5 text-accent" />
                        )}
                      </CardTitle>
                      <p className="text-xl md:text-2xl font-bold text-primary mt-1">
                        {pack.script}
                      </p>
                    </div>
                    {!isDownloaded && (
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handlePackSelect(pack.id)}
                        className="mt-1"
                      />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 md:p-6">
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">
                    {pack.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="font-medium">Languages:</span>
                      <span>{pack.languages.join(", ")}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="font-medium">Size:</span>
                      <span>{pack.size}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="font-medium">Status:</span>
                      <span className={
                        isDownloaded 
                          ? 'text-accent font-medium' 
                          : isDownloading
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      }>
                        {isDownloaded ? 'Downloaded' : isDownloading ? 'Downloading...' : 'Available'}
                      </span>
                    </div>
                    
                    {isDownloading && (
                      <div className="mt-3">
                        <Progress value={downloadProgress[pack.id]} className="h-2" />
                        <p className="text-xs text-center mt-1 text-muted-foreground">
                          {downloadProgress[pack.id]}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Offline Benefits */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Offline Benefits</h2>
          <div className="grid gap-4 md:gap-6 sm:grid-cols-1 md:grid-cols-3">
            <Card>
              <CardContent className="p-4 md:p-6 text-center">
                <WifiOff className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-primary" />
                <h3 className="text-sm md:text-base font-semibold mb-2">No Internet Required</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Use TransLIT even in remote areas without connectivity
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 md:p-6 text-center">
                <CheckCircle className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-accent" />
                <h3 className="text-sm md:text-base font-semibold mb-2">Instant Response</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Faster transliteration without network delays
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 md:p-6 text-center">
                <HardDrive className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 text-secondary" />
                <h3 className="text-sm md:text-base font-semibold mb-2">Local Storage</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  All data stored securely on your device
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offline;