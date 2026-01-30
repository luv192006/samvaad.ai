import { useRef, useEffect } from "react";
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
  onGuidedSelection: (
    type: "age" | "category" | "status",
    value: string,
    displayText: string
  ) => void;
  onSuggestionAction: (action: string) => void;
}

export function ChatAreaNew({
  messages,
  isLoading,
  isTyping,
  onSendMessage,
  conversationStep,
  onGuidedSelection,
  onSuggestionAction,
}: ChatAreaNewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /* ---------------- MESSAGE RENDER ---------------- */

  const renderMessageContent = (message: Message, index: number) => {
    if (message.role === "assistant") {
      if (message.content === "__GUIDED_AGE__") {
        return (
          <div className="space-y-2">
            <ChatMessageNew role="assistant" content={t.selectAgeGroup} />
            <div className="pl-10">
              <GuidedButtons
                type="age"
                onSelect={(value, label) =>
                  onGuidedSelection("age", value, label)
                }
              />
            </div>
          </div>
        );
      }

      if (message.content === "__GUIDED_CATEGORY__") {
        return (
          <div className="space-y-2">
            <ChatMessageNew
              role="assistant"
              content={t.selectSchemeCategory}
            />
            <div className="pl-10">
              <GuidedButtons
                type="category"
                onSelect={(value, label) =>
                  onGuidedSelection("category", value, label)
                }
              />
            </div>
          </div>
        );
      }

      if (message.content === "__GUIDED_STATUS__") {
        return (
          <div className="space-y-2">
            <ChatMessageNew
              role="assistant"
              content={t.selectEmploymentStatus}
            />
            <div className="pl-10">
              <GuidedButtons
                type="status"
                onSelect={(value, label) =>
                  onGuidedSelection("status", value, label)
                }
              />
            </div>
          </div>
        );
      }
    }

    return (
      <ChatMessageNew
        key={index}
        role={message.role}
        content={message.content}
      />
    );
  };

  /* ---------------- SUGGESTIONS ---------------- */

  const showSuggestions =
    conversationStep === "chat" &&
    messages.length > 0 &&
    !isLoading &&
    !isTyping &&
    messages[messages.length - 1]?.role === "assistant" &&
    !messages[messages.length - 1]?.content.startsWith("__GUIDED_");

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-4 pt-20">

          {messages.map((message, index) => (
            <div key={index}>{renderMessageContent(message, index)}</div>
          ))}

          {isTyping && <TypingIndicator />}

          {showSuggestions && (
            <SuggestionChips onSuggestionClick={onSuggestionAction} />
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="sticky bottom-0 border-t bg-background p-4">
        <ChatInput
          onSend={onSendMessage}
          isLoading={isLoading}
          disabled={conversationStep !== "chat" && messages.length > 0}
        />
      </div>
    </div>
  );
}
