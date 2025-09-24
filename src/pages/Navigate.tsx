import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Navigation, Route, Clock, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Navigate = () => {
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [preferredScript, setPreferredScript] = useState("english");
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeInstructions, setRouteInstructions] = useState<any[]>([]);
  const { toast } = useToast();

  const scripts = [
    { value: "english", label: "English" },
    { value: "hindi", label: "Hindi (देवनागरी)" },
    { value: "tamil", label: "Tamil (தமிழ்)" },
    { value: "bengali", label: "Bengali (বাংলা)" },
    { value: "gujarati", label: "Gujarati (ગુજરાતી)" },
    { value: "marathi", label: "Marathi (मराठी)" },
  ];

  const sampleDirections = {
    english: [
      "Head north on Main Road toward Central Square",
      "Turn right at the traffic light onto Station Road",
      "Continue for 2.5 km until you reach the railway station",
      "Your destination will be on the left"
    ],
    hindi: [
      "मुख्य सड़क पर उत्तर की ओर केंद्रीय चौराहे की ओर जाएं",
      "ट्रैफिक लाइट पर दाएं मुड़कर स्टेशन रोड पर जाएं", 
      "रेलवे स्टेशन तक पहुंचने तक 2.5 किमी तक जारी रखें",
      "आपका गंतव्य बाईं ओर होगा"
    ],
    tamil: [
      "மத்திய சதுக்கத்தை நோக்கி பிரதான சாலையில் வடக்கு நோக்கி செல்லுங்கள்",
      "ட்ராஃபிக் லைட்டில் வலதுபுறம் திரும்பி ஸ்டேஷன் ரோடுக்குச் செல்லுங்கள்",
      "ரயில் நிலையத்தை அடையும் வரை 2.5 கிமீ தொடரவும்",
      "உங்கள் இலக்கு இடதுபுறத்தில் இருக்கும்"
    ]
  };

  const handleStartNavigation = async () => {
    if (!startLocation.trim() || !destination.trim()) {
      toast({
        title: "Locations Required",
        description: "Please enter both start and destination locations.",
        variant: "destructive"
      });
      return;
    }

    setIsNavigating(true);
    
    // Simulate route calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const directions = sampleDirections[preferredScript as keyof typeof sampleDirections] || sampleDirections.english;
    
    setRouteInstructions(directions.map((instruction, index) => ({
      id: index + 1,
      instruction,
      distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
      time: `${Math.floor(Math.random() * 10 + 2)} min`
    })));
    
    setIsNavigating(false);
    toast({
      title: "Route Calculated",
      description: `Navigation instructions generated in ${scripts.find(s => s.value === preferredScript)?.label || 'English'}`
    });
  };

  return (
    <div className="min-h-screen py-8 relative">
      {/* Google Maps Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/2422915/pexels-photo-2422915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
        }}
      />
      <div className="absolute inset-0 bg-background/80" />
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            Smart Navigation
          </h1>
          <p className="text-lg text-muted-foreground">
            Get directions in your preferred script with location-aware translations
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Navigation Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-card-hover relative z-10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5" />
                  <span>Route Planning</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter starting location..."
                      value={startLocation}
                      onChange={(e) => setStartLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter destination..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Script</label>
                  <Select value={preferredScript} onValueChange={setPreferredScript}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select script for directions" />
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

                <Button
                  onClick={handleStartNavigation}
                  variant="default"
                  className="w-full"
                  disabled={isNavigating}
                >
                  {isNavigating ? "Calculating Route..." : "Start Navigation"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Map and Route Instructions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Simulation */}
            <Card className="shadow-card-hover relative z-10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Route className="h-5 w-5" />
                  <span>Route Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="aspect-video rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-cover bg-center relative"
                  style={{ 
                    backgroundImage: `url('/src/assets/Screenshot 2025-09-24 061912.png')`
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-white mx-auto mb-4 relative z-10" />
                    <p className="text-lg font-medium text-white relative z-10">Interactive Map</p>
                    <p className="text-sm text-white/80 relative z-10">Route will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route Instructions */}
            {routeInstructions.length > 0 && (
              <Card className="shadow-card-hover relative z-10">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Navigation className="h-5 w-5" />
                      <span>Route Instructions</span>
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>~15 min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Car className="h-4 w-4" />
                        <span>8.2 km</span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {routeInstructions.map((instruction) => (
                      <div key={instruction.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {instruction.id}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{instruction.instruction}</p>
                          <div className="flex space-x-4 mt-1 text-xs text-muted-foreground">
                            <span>{instruction.distance}</span>
                            <span>{instruction.time}</span>
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

export default Navigate;