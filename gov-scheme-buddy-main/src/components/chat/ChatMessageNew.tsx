import { cn } from "@/lib/utils";
import { User, Shield } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageNewProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessageNew({ role, content }: ChatMessageNewProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse mt-2" : "mt-6"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform hover:scale-105 mt-1",
          isUser
            ? "bg-gradient-to-br from-saffron to-saffron/80"
            : "bg-gradient-to-br from-primary to-primary/80"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Shield className="h-4 w-4 text-primary-foreground" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl shadow-sm transition-all",
          isUser
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-md px-4 py-3"
            : "bg-card text-foreground rounded-tl-md border border-border/50 px-5 py-4"
        )}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-1 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-4 mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-4 mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="mb-0.5">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-foreground">
                    {children}
                  </strong>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mb-2 text-foreground">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold mb-2 text-foreground">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold mb-1 text-foreground">
                    {children}
                  </h3>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-saffron hover:text-saffron/80 underline underline-offset-2 transition-colors"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-saffron pl-4 italic text-muted-foreground my-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

