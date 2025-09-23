import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Heart, Globe, Users, Award, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const About = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon."
    });
    
    setName("");
    setEmail("");
    setMessage("");
  };

  const team = [
    {
      name: "Thanushrie Satishkumar",
      role: "Team Lead",
      expertise: "Project Management, Team Coordination",
      description: "Leading the TransLIT project with expertise in cross-functional team management"
    },
    {
      name: "Tharun Kumar C",
      role: "Technical Lead",
      expertise: "AI/ML, Natural Language Processing",
      description: "Expert in machine learning and transliteration algorithms"
    },
    {
      name: "Dharani K",
      role: "Design Lead",
      expertise: "Visual Design, Design Systems",
      description: "Creating cohesive design experiences across the platform"
    },
    {
      name: "Ratheesh T",
      role: "UI/UX Designer",
      expertise: "Accessibility Design, User Research",
      description: "Passionate about inclusive design for diverse users"
    },
    {
      name: "Baivari A",
      role: "Content Lead",
      expertise: "Content Strategy, Technical Writing",
      description: "Crafting clear and engaging content for diverse audiences"
    },
    {
      name: "Anbu Thamizhachi",
      role: "Market Lead",
      expertise: "Market Research, User Acquisition",
      description: "Driving market strategy and user engagement initiatives"
    }
  ];

  const stats = [
    { icon: Globe, value: "22+", label: "Indian Languages Supported" },
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: Award, value: "99.5%", label: "Accuracy Rate" },
    { icon: Target, value: "24/7", label: "Offline Availability" }
  ];

  return (
    <div className="min-h-screen bg-gradient-card py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4 lg:text-4xl">
            About TransLIT
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Breaking script barriers, empowering every traveler in India through innovative 
            technology and inclusive design.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 shadow-card-hover">
          <CardContent className="p-8 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              TransLIT was born from the vision of making India's incredible linguistic diversity 
              an asset rather than a barrier for travelers. We believe technology should bridge 
              cultural gaps, not create them. Our platform empowers every person to navigate 
              India's rich tapestry of languages with confidence and respect.
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-card-hover transition-smooth">
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Project Story */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <Card className="shadow-card-hover">
            <CardHeader>
              <CardTitle>The Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                India is home to 22 official languages and hundreds of dialects, each with its 
                own script and cultural significance. For travelers, this linguistic diversity 
                can be overwhelming—from reading street signs to asking for directions.
              </p>
              <p className="text-muted-foreground">
                Traditional translation apps focus on meaning but ignore the crucial aspect of 
                pronunciation and script recognition that travelers desperately need in real-world situations.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card-hover">
            <CardHeader>
              <CardTitle>Our Solution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                TransLIT bridges this gap with real-time transliteration—converting text between 
                scripts while preserving pronunciation. Whether you're reading a Tamil sign or 
                writing Hindi in English letters, our AI-powered engine ensures accuracy.
              </p>
              <p className="text-muted-foreground">
                Combined with offline capabilities and accessibility-first design, TransLIT 
                works everywhere, for everyone, at any time.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-foreground mb-8">Meet Our Team</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-card-hover transition-smooth">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-3">{member.expertise}</p>
                  <p className="text-xs text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <Card className="shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Get in Touch</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  placeholder="Tell us about your experience, suggestions, or questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="flex justify-center">
                <Button type="submit" variant="default" size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-muted-foreground mb-4">
                Join our mission to make India's linguistic diversity accessible to all travelers
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  Email: hello@translit.app
                </Button>
                <Button variant="outline" size="sm">
                  Support: support@translit.app
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;