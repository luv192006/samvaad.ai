import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, List, RotateCcw } from "lucide-react";

interface SuggestionChipsProps {
  onSuggestionClick: (action: string) => void;
}

export function SuggestionChips({ onSuggestionClick }: SuggestionChipsProps) {
  const { t } = useLanguage();

  const suggestions = [
    { action: "check_another", label: t.checkAnotherScheme, icon: RefreshCw },
    { action: "change_age", label: t.changeAgeGroup, icon: Calendar },
    { action: "view_all", label: t.viewAllSchemes, icon: List },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.action}
          variant="ghost"
          size="sm"
          onClick={() => onSuggestionClick(suggestion.action)}
          className="flex items-center gap-1.5 rounded-full text-xs bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary"
        >
          <suggestion.icon className="h-3 w-3" />
          {suggestion.label}
        </Button>
      ))}
    </div>
  );
}
