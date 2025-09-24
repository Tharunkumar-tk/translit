import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Languages, Navigation, Download, Accessibility, Info, Globe, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { to: "/", label: "Home", icon: Languages },
    { to: "/transliterate", label: "Transliterate", icon: Languages },
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
        <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary p-1.5 md:p-2">
              <Languages className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
            </div>
            <span className="text-lg md:text-xl font-bold text-foreground">TransLIT</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map(({ to, label, icon: Icon }) => (
              <Button
                key={to}
                variant={location.pathname === to ? "secondary" : "ghost"}
                asChild
                size="sm"
                className={location.pathname === to ? "text-secondary-foreground" : "text-foreground hover:text-foreground"}
              >
                <Link to={to} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </nav>
          
          {/* Mobile Navigation */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="rounded-lg bg-primary p-1.5">
                    <Languages className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold">TransLIT</span>
                </div>
              </div>
              
              <nav className="flex flex-col space-y-2">
                {navigationItems.map(({ to, label, icon: Icon }) => (
                  <Button
                    key={to}
                    variant={location.pathname === to ? "secondary" : "ghost"}
                    asChild
                    className={`justify-start h-12 ${location.pathname === to ? "text-secondary-foreground" : "text-foreground hover:text-foreground"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to={to} className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span className="text-base">{label}</span>
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base text-muted-foreground">
            © 2024 TransLIT. Breaking script barriers, empowering every traveler in India.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;