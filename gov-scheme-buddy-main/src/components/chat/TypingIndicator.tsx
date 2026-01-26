import { Shield } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-fade-in">
      {/* Bot Avatar */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
        <Shield className="h-4 w-4 text-primary-foreground" />
      </div>
      
      {/* Typing Bubble */}
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-muted px-5 py-4 shadow-sm">
        <span 
          className="h-2.5 w-2.5 rounded-full bg-muted-foreground/60 animate-pulse-dot" 
          style={{ animationDelay: "0ms" }} 
        />
        <span 
          className="h-2.5 w-2.5 rounded-full bg-muted-foreground/60 animate-pulse-dot" 
          style={{ animationDelay: "200ms" }} 
        />
        <span 
          className="h-2.5 w-2.5 rounded-full bg-muted-foreground/60 animate-pulse-dot" 
          style={{ animationDelay: "400ms" }} 
        />
      </div>
    </div>
  );
}