import { useState, useCallback, useRef, useEffect } from "react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { ChatSidebarNew } from "@/components/chat/ChatSidebarNew";
import { ChatAreaNew } from "@/components/chat/ChatAreaNew";
import { FiltersPanel } from "@/components/chat/FiltersPanel";
import { LanguageSelectionScreen } from "@/components/chat/LanguageSelectionScreen";
import { MobileSidebarNew } from "@/components/chat/MobileSidebarNew";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { streamChat, type Message } from "@/lib/chat-stream";
import { useToast } from "@/hooks/use-toast";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_OPTIONS } from "@/lib/localization";

function ChatContent() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { 
    language, 
    setLanguage, 
    lockLanguage, 
    isLanguageLocked, 
    t, 
    filters, 
    setFilter, 
    resetAll 
  } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState<"welcome" | "age" | "category" | "status" | "chat">("welcome");
  const [showLanguageSelection, setShowLanguageSelection] = useState(() => {
    return !localStorage.getItem("samvaad-language-locked");
  });

  const {
    conversations,
    currentConversationId,
    messages,
    setMessages,
    loadConversation,
    createConversation,
    saveMessage,
    updateConversationTitle,
    deleteConversation,
    startNewChat,
  } = useConversations(user?.id);

  const handleLanguageSelect = (code: string) => {
    setLanguage(code as any);
    lockLanguage();
    setShowLanguageSelection(false);
    setConversationStep("age");
    
    // Add initial bot message asking for age
    const ageMessage: Message = {
      role: "assistant",
      content: `__GUIDED_AGE__`,
    };
    setMessages([ageMessage]);
  };

  const handleGuidedSelection = async (type: "age" | "category" | "status", value: string, displayText: string) => {
    // Add user's selection as a message
    const userMessage: Message = { role: "user", content: displayText };
    setMessages((prev) => [...prev, userMessage]);

    // Update filters
    if (type === "age") {
      setFilter("ageGroup", value);
      setConversationStep("category");
      
      setTimeout(() => {
        const categoryMessage: Message = {
          role: "assistant",
          content: `__GUIDED_CATEGORY__`,
        };
        setMessages((prev) => [...prev, categoryMessage]);
      }, 300);
    } else if (type === "category") {
      setFilter("schemeCategory", value);
      
      // For some categories, ask employment status
      if (["employment", "education"].includes(value)) {
        setConversationStep("status");
        setTimeout(() => {
          const statusMessage: Message = {
            role: "assistant",
            content: `__GUIDED_STATUS__`,
          };
          setMessages((prev) => [...prev, statusMessage]);
        }, 300);
      } else {
        // Fetch schemes directly
        setConversationStep("chat");
        await fetchSchemesForUser(value);
      }
    } else if (type === "status") {
      setFilter("employmentStatus", value);
      setConversationStep("chat");
      await fetchSchemesForUser(filters.schemeCategory || "");
    }
  };

  const fetchSchemesForUser = async (category: string) => {
    setIsLoading(true);
    setIsTyping(true);

    // Create conversation if needed
    let conversationId = currentConversationId;
    if (!conversationId && user) {
      conversationId = await createConversation(`${category} schemes`);
    }

    const userProfile = {
      ageGroup: filters.ageGroup,
      category: category,
      employmentStatus: filters.employmentStatus,
    };

    const prompt = `Show me ${category} government schemes for someone in the ${filters.ageGroup || "18to35"} age group${filters.employmentStatus ? ` who is ${filters.employmentStatus}` : ""}. List all eligible schemes with full details.`;

    let assistantContent = "";
    const allMessages = [...messages, { role: "user" as const, content: prompt }];

    await streamChat({
      messages: allMessages,
      language,
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content.startsWith("__GUIDED_")) {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
        setIsTyping(false);
      },
      onDone: async () => {
        setIsLoading(false);
        if (assistantContent && conversationId) {
          await saveMessage(conversationId, "assistant", assistantContent);
        }
      },
      onError: (error) => {
        setIsLoading(false);
        setIsTyping(false);
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      },
    });
  };

  const handleSendMessage = useCallback(async (input: string) => {
    if (!user) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = await createConversation(input.slice(0, 50));
      if (!conversationId) {
        toast({
          title: "Error",
          description: "Failed to create conversation",
          variant: "destructive",
        });
        setIsLoading(false);
        setIsTyping(false);
        return;
      }
    }

    await saveMessage(conversationId, "user", input);

    if (messages.length === 0) {
      await updateConversationTitle(conversationId, input.slice(0, 50));
    }

    let assistantContent = "";
    const allMessages = [...messages, userMessage];

    try {
      await streamChat({
        messages: allMessages,
        language,
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && !last.content.startsWith("__GUIDED_")) {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: assistantContent } : m
              );
            }
            return [...prev, { role: "assistant", content: assistantContent }];
          });
          setIsTyping(false);
        },
        onDone: async () => {
          setIsLoading(false);
          if (assistantContent && conversationId) {
            await saveMessage(conversationId, "assistant", assistantContent);
          }
        },
        onError: (error) => {
          setIsLoading(false);
          setIsTyping(false);
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
        },
      });
    } catch {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [user, currentConversationId, messages, setMessages, createConversation, saveMessage, updateConversationTitle, toast, language]);

  const handleSuggestionAction = (action: string) => {
    if (action === "check_another") {
      setConversationStep("category");
      const categoryMessage: Message = {
        role: "assistant",
        content: `__GUIDED_CATEGORY__`,
      };
      setMessages((prev) => [...prev, categoryMessage]);
    } else if (action === "change_age") {
      setConversationStep("age");
      const ageMessage: Message = {
        role: "assistant",
        content: `__GUIDED_AGE__`,
      };
      setMessages((prev) => [...prev, ageMessage]);
    } else if (action === "view_all") {
      handleSendMessage("Show me all available government schemes");
    }
  };

  const handleReset = () => {
    resetAll();
    setShowLanguageSelection(true);
    setConversationStep("welcome");
    startNewChat();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0];
  const currentLang = LANGUAGE_OPTIONS.find((l) => l.code === language);

  // Show language selection screen first
  if (showLanguageSelection) {
    return <LanguageSelectionScreen onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ChatSidebarNew
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={loadConversation}
          onNewChat={() => {
            startNewChat();
            setConversationStep("age");
            const ageMessage: Message = { role: "assistant", content: `__GUIDED_AGE__` };
            setMessages([ageMessage]);
          }}
          onDeleteConversation={deleteConversation}
          onSignOut={handleSignOut}
          userName={userName}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between gap-2 border-b p-3 md:hidden">
          <div className="flex items-center gap-2">
            <MobileSidebarNew
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={loadConversation}
              onNewChat={() => {
                startNewChat();
                setConversationStep("age");
                const ageMessage: Message = { role: "assistant", content: `__GUIDED_AGE__` };
                setMessages([ageMessage]);
              }}
              onDeleteConversation={deleteConversation}
              onSignOut={handleSignOut}
              userName={userName}
              onReset={handleReset}
            />
            <span className="font-semibold">{t.appName}</span>
          </div>
          <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
            <SelectTrigger className="w-auto gap-1">
              <Globe className="h-4 w-4" />
              <SelectValue>{currentLang?.nativeName}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <ChatAreaNew
            messages={messages}
            isLoading={isLoading}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            conversationStep={conversationStep}
            onGuidedSelection={handleGuidedSelection}
            onSuggestionAction={handleSuggestionAction}
          />

          {/* Desktop Filters Panel */}
          <div className="hidden lg:block border-l bg-muted/30">
            <FiltersPanel onReset={handleReset} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <LanguageProvider>
      <ChatContent />
    </LanguageProvider>
  );
}
