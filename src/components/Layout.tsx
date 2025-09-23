import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Languages, Navigation, Download, Accessibility, Info, Camera, Mic, Globe, Settings } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigationItems = [
    { to: "/", label: "Home", icon: Languages },
    { to: "/transliterate", label: "Transliterate", icon: Languages },
    { to: "/camera", label: "Camera", icon: Camera },
    { to: "/voice", label: "Voice", icon: Mic },
    { to: "/navigate", label: "Navigate", icon: Navigation },
    { to: "/offline", label: "Offline", icon: Download },
    { to: "/accessibility", label: "Accessibility", icon: Accessibility },
    { to: "/cultural", label: "Cultural", icon: Globe },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/about", label: "About", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary p-2">
              <Languages className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TransLIT</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map(({ to, label, icon: Icon }) => (
              <Button
                key={to}
                variant={location.pathname === to ? "secondary" : "ghost"}
                asChild
                className={location.pathname === to ? "text-secondary-foreground" : "text-foreground hover:text-foreground"}
              >
                <Link to={to} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 TransLIT. Breaking script barriers, empowering every traveler in India.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;