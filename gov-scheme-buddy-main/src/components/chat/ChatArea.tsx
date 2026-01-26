import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "@/lib/chat-stream";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  languageCode: string;
}

export function ChatArea({ messages, isLoading, isTyping, onSendMessage, languageCode }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-1 flex-col">
      {messages.length === 0 ? (
        <WelcomeScreen onSuggestionClick={onSendMessage} languageCode={languageCode} />
      ) : (
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="mx-auto max-w-3xl space-y-6 p-6">
            {messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        </ScrollArea>
      )}

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl p-4">
          <ChatInput onSend={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
