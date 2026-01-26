import { Sparkles, Globe, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LANGUAGE_OPTIONS } from "@/lib/localization";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface LanguageSelectionScreenProps {
  onLanguageSelect: (code: string) => void;
}

// Language flags mapping
const languageFlags: Record<string, string> = {
  en: "🇬🇧",
  hi: "🇮🇳",
  bn: "🇮🇳",
  mr: "🇮🇳",
  te: "🇮🇳",
  ta: "🇮🇳",
};

export function LanguageSelectionScreen({ onLanguageSelect }: LanguageSelectionScreenProps) {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (code: string) => {
    setSelectedLang(code);
    setIsAnimating(true);
    
    // Smooth transition animation
    setTimeout(() => {
      onLanguageSelect(code);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-tricolor-gradient opacity-80" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-saffron/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-green-india/5 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-saffron animate-bounce-subtle" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-green-india animate-bounce-subtle" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Main Content */}
      <div className={`relative z-10 w-full max-w-lg transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Logo & Branding */}
        <div className="mb-8 text-center animate-fade-in">
          <div className="mx-auto mb-6 relative">
            {/* Glowing ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-saffron/20 via-transparent to-green-india/20 blur-xl animate-glow-pulse" />
            
            {/* Main logo container */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl">
              <Shield className="h-12 w-12 text-primary-foreground" />
              
              {/* Decorative corners */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-saffron rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-saffron rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-green-india rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-green-india rounded-br-lg" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            SAMVAAD
          </h1>
          <p className="text-lg text-saffron font-medium mt-1">
            संवाद AI
          </p>
          <p className="mt-3 text-muted-foreground text-sm max-w-xs mx-auto">
            Your trusted guide to Government Schemes
          </p>
          
          {/* Government badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border">
            <CheckCircle className="h-4 w-4 text-green-india" />
            <span className="text-xs font-medium text-muted-foreground">Official Government Portal</span>
          </div>
        </div>

        {/* Language Selection Card */}
        <Card className="glass-card animate-slide-up border-0 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Select Your Language</h2>
                <p className="text-xs text-muted-foreground">अपनी भाषा चुनें</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGE_OPTIONS.map((lang, index) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  className={`
                    relative flex flex-col items-center gap-2 h-auto py-4 px-3
                    transition-all duration-300 border-2 group
                    hover:border-saffron hover:bg-saffron/5 hover:shadow-lg
                    ${selectedLang === lang.code 
                      ? 'border-saffron bg-saffron/10 shadow-lg' 
                      : 'border-border hover:scale-[1.02]'
                    }
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => handleSelect(lang.code)}
                >
                  {/* Flag */}
                  <span className="text-2xl">{languageFlags[lang.code] || "🇮🇳"}</span>
                  
                  {/* Language name */}
                  <span className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lang.name}
                  </span>
                  
                  {/* Tricolor underline on hover */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-tricolor-gradient transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b" />
                  
                  {/* Selection indicator */}
                  {selectedLang === lang.code && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-india rounded-full flex items-center justify-center animate-fade-in-scale">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span>🇮🇳</span>
            <span>Serving Citizens Across India</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground/60">
            Powered by AI • Verified Information • 24/7 Available
          </p>
        </div>
      </div>
    </div>
  );
}

interface GuidedWelcomeScreenProps {
  onStartConversation: () => void;
}

export function GuidedWelcomeScreen({ onStartConversation }: GuidedWelcomeScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          {t.welcomeTitle}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          {t.welcomeSubtitle}
        </p>
      </div>

      <Button
        size="lg"
        onClick={onStartConversation}
        className="px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all btn-ripple"
      >
        {t.send} →
      </Button>

      <p className="mt-8 text-sm text-muted-foreground text-center">
        {t.welcomeFooter}
      </p>
    </div>
  );
}