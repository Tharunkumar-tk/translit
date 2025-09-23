import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Languages, Navigation, Download, Accessibility, Camera, Map, Mic, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-scripts.jpg";

const Home = () => {
  const features = [
    {
      icon: Languages,
      title: "Real-time Transliteration",
      description: "Convert text between multiple Indian scripts instantly with AI-powered accuracy.",
      link: "/transliterate"
    },
    {
      icon: Camera,
      title: "AR Camera Mode",
      description: "Point your camera at text for real-time overlay transliteration with cultural context.",
      link: "/camera"
    },
    {
      icon: Mic,
      title: "Voice to Script",
      description: "Speak in your language and see it written in any Indian script instantly.",
      link: "/voice"
    },
    {
      icon: Navigation,
      title: "Smart Navigation",
      description: "Get directions in your preferred script with location-aware translations.",
      link: "/navigate"
    },
    {
      icon: Download,
      title: "Offline Support",
      description: "Download script packs for seamless use without internet connectivity.",
      link: "/offline"
    },
    {
      icon: Globe,
      title: "Cultural Context",
      description: "Discover cultural meanings and significance behind Indian scripts and terms.",
      link: "/cultural"
    },
    {
      icon: Accessibility,
      title: "Accessibility First",
      description: "Voice assistance, high contrast, and adaptive interfaces for everyone.",
      link: "/accessibility"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/60" />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground lg:text-6xl">
            TransLIT
          </h1>
          <p className="mb-8 text-xl text-primary-foreground lg:text-2xl max-w-3xl mx-auto">
            Breaking script barriers, empowering every traveler in India.
          </p>
          <p className="mb-10 text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Navigate India confidently with real-time transliteration across multiple scripts, 
            smart navigation, and accessibility-first design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link to="/camera" className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Try AR Camera</span>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/voice" className="flex items-center space-x-2">
                <Mic className="h-5 w-5" />
                <span>Voice Mode</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 lg:text-4xl">
              Powerful Features for Every Traveler
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to make traveling across India's linguistic landscape seamless and accessible.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-card-hover transition-smooth cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-smooth">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <Button asChild variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      <Link to={feature.link}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-card py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Break Language Barriers?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of travelers already using TransLIT to navigate India with confidence.
          </p>
          <Button asChild variant="default" size="lg">
            <Link to="/transliterate">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;