import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Heart, Wheat, Users, Wallet, Home, LucideIcon } from "lucide-react";

interface GuidedButtonsProps {
  type: "age" | "category" | "status";
  onSelect: (value: string, displayText: string) => void;
}

interface OptionWithIcon {
  value: string;
  label: string;
  icon?: LucideIcon;
}

export function GuidedButtons({ type, onSelect }: GuidedButtonsProps) {
  const { t } = useLanguage();

  const ageOptions: OptionWithIcon[] = [
    { value: "below18", label: t.ageBelow18 },
    { value: "18to35", label: t.age18to35 },
    { value: "36to60", label: t.age36to60 },
    { value: "above60", label: t.ageAbove60 },
  ];

  const categoryOptions: OptionWithIcon[] = [
    { value: "education", label: t.educationSchemes, icon: GraduationCap },
    { value: "employment", label: t.employmentSchemes, icon: Briefcase },
    { value: "health", label: t.healthSchemes, icon: Heart },
    { value: "agriculture", label: t.farmerSchemes, icon: Wheat },
    { value: "women", label: t.womenSchemes, icon: Users },
    { value: "pension", label: t.pensionSchemes, icon: Wallet },
    { value: "housing", label: t.housingSchemes, icon: Home },
  ];

  const statusOptions: OptionWithIcon[] = [
    { value: "student", label: t.student },
    { value: "employed", label: t.employed },
    { value: "unemployed", label: t.unemployed },
    { value: "self_employed", label: t.selfEmployed },
  ];

  const options = type === "age" ? ageOptions : type === "category" ? categoryOptions : statusOptions;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {options.map((option) => {
        const IconComponent = option.icon;
        return (
          <Button
            key={option.value}
            variant="outline"
            size="sm"
            onClick={() => onSelect(option.value, option.label)}
            className="flex items-center gap-2 rounded-full border-primary/30 bg-background hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
