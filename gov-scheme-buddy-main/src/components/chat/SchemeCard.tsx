import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FileText, Gift, ClipboardList, ExternalLink } from "lucide-react";

interface SchemeCardProps {
  scheme: {
    name: string;
    nameHindi?: string;
    category: string;
    description: string;
    eligibility: string[];
    benefits: string[];
    documents: string[];
    applicationProcess?: string;
    website?: string;
    isEligible?: boolean;
  };
}

export function SchemeCard({ scheme }: SchemeCardProps) {
  const { t, language } = useLanguage();

  const displayName = language === "hi" && scheme.nameHindi ? scheme.nameHindi : scheme.name;

  return (
    <Card className="w-full border-primary/20 bg-gradient-to-br from-card to-muted/20 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold text-foreground leading-tight">
            {displayName}
          </CardTitle>
          {scheme.isEligible !== undefined && (
            <Badge
              variant={scheme.isEligible ? "default" : "destructive"}
              className="shrink-0 flex items-center gap-1"
            >
              {scheme.isEligible ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  {t.eligible}
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  {t.notEligible}
                </>
              )}
            </Badge>
          )}
        </div>
        <Badge variant="outline" className="w-fit text-xs">
          {scheme.category}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{scheme.description}</p>

        {/* Eligibility */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <ClipboardList className="h-4 w-4 text-primary" />
            {t.eligibility}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            {scheme.eligibility.map((item, i) => (
              <li key={i} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Gift className="h-4 w-4 text-primary" />
            {t.benefits}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            {scheme.benefits.map((item, i) => (
              <li key={i} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Documents */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <FileText className="h-4 w-4 text-destructive" />
            {t.requiredDocuments}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1 ml-6">
            {scheme.documents.map((item, i) => (
              <li key={i} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Application Process */}
        {scheme.applicationProcess && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              {t.applicationProcess}
            </h4>
            <p className="text-sm text-muted-foreground">{scheme.applicationProcess}</p>
          </div>
        )}

        {/* Website */}
        {scheme.website && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => window.open(scheme.website, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {t.visitWebsite}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
