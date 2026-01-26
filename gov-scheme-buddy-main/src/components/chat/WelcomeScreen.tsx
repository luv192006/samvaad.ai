import { FileText, Users, Home, Heart, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
  languageCode: string;
}

const getLocalizedContent = (languageCode: string) => {
  const translations: Record<string, {
    title: string;
    subtitle: string;
    suggestions: Array<{
      icon: typeof FileText;
      title: string;
      description: string;
      query: string;
    }>;
    footer: string;
    languageNote: string;
  }> = {
    en: {
      title: "Samvadd AI",
      subtitle: "संवाद AI - Your guide to government schemes",
      suggestions: [
        {
          icon: FileText,
          title: "PM Kisan Yojana",
          description: "Check eligibility for farmer support scheme",
          query: "Am I eligible for PM Kisan Samman Nidhi? What are the requirements and documents needed?",
        },
        {
          icon: Heart,
          title: "Ayushman Bharat",
          description: "Health insurance coverage details",
          query: "How can I check if I'm eligible for Ayushman Bharat health card? What documents do I need?",
        },
        {
          icon: Home,
          title: "PM Awas Yojana",
          description: "Housing scheme for all",
          query: "What are the eligibility criteria for PM Awas Yojana housing scheme? List all required documents.",
        },
        {
          icon: Users,
          title: "Pension Schemes",
          description: "Atal Pension & NPS details",
          query: "Tell me about Atal Pension Yojana, its benefits and documents required to apply",
        },
      ],
      footer: "Ask about any central or state government scheme",
      languageNote: "Multilingual support available",
    },
    hi: {
      title: "संवाद AI",
      subtitle: "Samvadd AI - सरकारी योजनाओं के लिए आपका मार्गदर्शक",
      suggestions: [
        {
          icon: FileText,
          title: "पीएम किसान योजना",
          description: "किसान सहायता योजना की पात्रता जांचें",
          query: "क्या मैं पीएम किसान सम्मान निधि के लिए पात्र हूं? इसके लिए कौन से दस्तावेज चाहिए?",
        },
        {
          icon: Heart,
          title: "आयुष्मान भारत",
          description: "स्वास्थ्य बीमा कवरेज विवरण",
          query: "आयुष्मान भारत हेल्थ कार्ड के लिए पात्रता कैसे जांचें? कौन से दस्तावेज जरूरी हैं?",
        },
        {
          icon: Home,
          title: "पीएम आवास योजना",
          description: "सभी के लिए आवास योजना",
          query: "पीएम आवास योजना की पात्रता मानदंड क्या हैं? सभी आवश्यक दस्तावेजों की सूची दें।",
        },
        {
          icon: Users,
          title: "पेंशन योजनाएं",
          description: "अटल पेंशन और NPS विवरण",
          query: "अटल पेंशन योजना के बारे में बताएं, इसके लाभ और आवेदन के लिए जरूरी दस्तावेज",
        },
      ],
      footer: "किसी भी केंद्र या राज्य सरकार की योजना के बारे में पूछें",
      languageNote: "बहुभाषी समर्थन उपलब्ध है",
    },
  };

  return translations[languageCode] || translations.en;
};

export function WelcomeScreen({ onSuggestionClick, languageCode }: WelcomeScreenProps) {
  const content = getLocalizedContent(languageCode);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">
          {content.title}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {content.subtitle}
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {content.suggestions.map((suggestion) => (
          <button
            key={suggestion.title}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-accent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <suggestion.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">{suggestion.title}</p>
              <p className="text-sm text-muted-foreground">
                {suggestion.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>{content.footer}</p>
        <p className="mt-1">🌐 {content.languageNote}</p>
      </div>
    </div>
  );
}
