import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageNew } from "./ChatMessageNew";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { GuidedButtons } from "./GuidedButtons";
import { SuggestionChips } from "./SuggestionChips";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Message } from "@/lib/chat-stream";

interface ChatAreaNewProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  conversationStep: "welcome" | "age" | "category" | "status" | "chat";
  onGuidedSelection: (type: "age" | "category" | "status", value: string, displayText: string) => void;
  onSuggestionAction: (action: string) => void;
}

export function ChatAreaNew({ 
  messages, 
  isLoading, 
  isTyping, 
  onSendMessage, 
  conversationStep,
  onGuidedSelection,
  onSuggestionAction 
}: ChatAreaNewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const renderMessageContent = (message: Message, index: number) => {
    // Check for guided prompts
    if (message.role === "assistant") {
      if (message.content === "__GUIDED_AGE__") {
        return (
          <div className="space-y-2">
            <ChatMessageNew role="assistant" content={t.selectAgeGroup} />
            <div className="ml-12">
              <GuidedButtons 
                type="age" 
                onSelect={(value, label) => onGuidedSelection("age", value, label)} 
              />
            </div>
          </div>
        );
      }
      if (message.content === "__GUIDED_CATEGORY__") {
        return (
          <div className="space-y-2">
            <ChatMessageNew role="assistant" content={t.selectSchemeCategory} />
            <div className="ml-12">
              <GuidedButtons 
                type="category" 
                onSelect={(value, label) => onGuidedSelection("category", value, label)} 
              />
            </div>
          </div>
        );
      }
      if (message.content === "__GUIDED_STATUS__") {
        return (
          <div className="space-y-2">
            <ChatMessageNew role="assistant" content={t.selectEmploymentStatus} />
            <div className="ml-12">
              <GuidedButtons 
                type="status" 
                onSelect={(value, label) => onGuidedSelection("status", value, label)} 
              />
            </div>
          </div>
        );
      }
    }

    return <ChatMessageNew key={index} role={message.role} content={message.content} />;
  };

  // Check if we should show suggestions (after scheme results)
  const showSuggestions = 
    conversationStep === "chat" && 
    messages.length > 0 && 
    !isLoading && 
    !isTyping &&
    messages[messages.length - 1]?.role === "assistant" &&
    !messages[messages.length - 1]?.content.startsWith("__GUIDED_");

  return (
    <div className="flex flex-1 flex-col">
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="mx-auto max-w-3xl space-y-6 p-6">
          {messages.map((message, index) => (
            <div key={index}>
              {renderMessageContent(message, index)}
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          
          {showSuggestions && (
            <SuggestionChips onSuggestionClick={onSuggestionAction} />
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl p-4">
          <ChatInput 
            onSend={onSendMessage} 
            isLoading={isLoading} 
            disabled={conversationStep !== "chat" && messages.length > 0}
          />
        </div>
      </div>
    </div>
  );
}
