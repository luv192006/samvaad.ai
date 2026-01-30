import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Filter, Calendar, Layers, Briefcase, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_OPTIONS } from "@/lib/localization";

interface FiltersPanelProps {
  onReset: () => void;
}

export function FiltersPanel({ onReset }: FiltersPanelProps) {
  const { t, language, setLanguage, filters, resetFilters } = useLanguage();

  const handleReset = () => {
    resetFilters();
    onReset();
  };

  const ageLabels: Record<string, string> = {
    below18: t.ageBelow18,
    "18to35": t.age18to35,
    "36to60": t.age36to60,
    above60: t.ageAbove60,
  };

  const categoryLabels: Record<string, string> = {
    education: t.educationSchemes,
    employment: t.employmentSchemes,
    health: t.healthSchemes,
    agriculture: t.farmerSchemes,
    women: t.womenSchemes,
    pension: t.pensionSchemes,
    housing: t.housingSchemes,
  };

  const statusLabels: Record<string, string> = {
    student: t.student,
    employed: t.employed,
    unemployed: t.unemployed,
    self_employed: t.selfEmployed,
  };

  const hasFilters = filters.ageGroup || filters.schemeCategory || filters.employmentStatus;
  const currentLang = LANGUAGE_OPTIONS.find((l) => l.code === language);

  return (
    <div className="h-full p-4 space-y-4 overflow-y-auto">
      {/* Language Selector */}
      <Card className="border-primary/20">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            {t.changeLanguage}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {currentLang?.nativeName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="font-medium">{lang.nativeName}</span>
                  <span className="text-muted-foreground text-xs ml-2">({lang.name})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Active Filters */}
      <Card className="border-primary/20">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            {t.activeFilters}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          {!hasFilters ? (
            <p className="text-xs text-muted-foreground italic">{t.noFiltersSelected}</p>
          ) : (
            <div className="space-y-2">
              {filters.ageGroup && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{t.ageGroup}:</span>
                  <Badge variant="secondary" className="text-xs">
                    {ageLabels[filters.ageGroup] || filters.ageGroup}
                  </Badge>
                </div>
              )}
              {filters.schemeCategory && (
                <div className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{t.schemeType}:</span>
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabels[filters.schemeCategory] || filters.schemeCategory}
                  </Badge>
                </div>
              )}
              {filters.employmentStatus && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{t.status}:</span>
                  <Badge variant="secondary" className="text-xs">
                    {statusLabels[filters.employmentStatus] || filters.employmentStatus}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleReset}
        className="w-full flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        {t.resetChat}
      </Button>
    </div>
  );
}
