import { useState, useCallback } from "react";
import { fetchSchemesFromDB } from "@/lib/scheme-retrieval";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LANGUAGE_OPTIONS } from "@/lib/localization";

function ChatContent() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const {
    language,
    setLanguage,
    lockLanguage,
    filters,
    setFilter,
    resetAll,
    t,
  } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] =
    useState<"welcome" | "age" | "category" | "status" | "chat">("welcome");

  const [showLanguageSelection, setShowLanguageSelection] = useState(
    !localStorage.getItem("samvaad-language-locked")
  );

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

  /* ---------------- LANGUAGE ---------------- */

  const handleLanguageSelect = (code: string) => {
    setLanguage(code as any);
    lockLanguage();
    setShowLanguageSelection(false);
    setConversationStep("age");

    setMessages([
      {
        role: "assistant",
        content: "__GUIDED_AGE__",
      },
    ]);
  };

  /* ---------------- GUIDED FLOW ---------------- */

  const handleGuidedSelection = async (
    type: "age" | "category" | "status",
    value: string,
    displayText: string
  ) => {
    setMessages((prev) => [...prev, { role: "user", content: displayText }]);

    if (type === "age") {
      setFilter("ageGroup", value);
      setConversationStep("category");
      setMessages((prev) => [...prev, { role: "assistant", content: "__GUIDED_CATEGORY__" }]);
    }

    if (type === "category") {
      setFilter("schemeCategory", value);

      if (["employment", "education"].includes(value)) {
        setConversationStep("status");
        setMessages((prev) => [...prev, { role: "assistant", content: "__GUIDED_STATUS__" }]);
      } else {
        setConversationStep("chat");
        await fetchSchemes(value);
      }
    }

    if (type === "status") {
      setFilter("employmentStatus", value);
      setConversationStep("chat");
      await fetchSchemes(filters.schemeCategory || "");
    }
  };

  /* ---------------- FETCH SCHEMES ---------------- */

  const fetchSchemes = async (category: string) => {
    setIsLoading(true);
    setIsTyping(true);

    try {
      const schemes = await fetchSchemesFromDB(
        category,
        filters.ageGroup || "",
        filters.employmentStatus
      );

      if (!schemes || schemes.length === 0) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ No schemes found." },
        ]);
        return;
      }

      const response = schemes
        .map(
          (s: any, i: number) =>
            `✅ **Scheme ${i + 1}**\nCategory: ${s.category}\nAge: ${s.age_group}\nStatus: ${s.status}`
        )
        .join("\n\n");

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to fetch schemes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  /* ---------------- CHAT SEND ---------------- */

  const handleSendMessage = useCallback(
    async (input: string) => {
      if (!user) return;

      const userMsg: Message = { role: "user", content: input };
      setMessages((prev) => [...prev, userMsg]);

      let conversationId = currentConversationId;
      if (!conversationId) {
        conversationId = await createConversation(input.slice(0, 50));
      }
      if (!conversationId) return;

      await saveMessage(conversationId, "user", input);

      let assistantContent = "";

      await streamChat({
        messages: [...messages, userMsg],
        language,
        onDelta: (chunk) => {
          assistantContent += chunk;
          setMessages((prev) => [...prev.filter(m => m.role !== "assistant"), { role: "assistant", content: assistantContent }]);
        },
        onDone: async () => {
          await saveMessage(conversationId!, "assistant", assistantContent);
        },
        onError: (err) => {
          toast({ title: "Error", description: err, variant: "destructive" });
        },
      });
    },
    [user, messages, language]
  );

  /* ---------------- RESET / LOGOUT ---------------- */

  const handleReset = () => {
    resetAll();
    setShowLanguageSelection(true);
    setConversationStep("welcome");
    startNewChat();
  };

  if (!user) return null;

  if (showLanguageSelection) {
    return <LanguageSelectionScreen onLanguageSelect={handleLanguageSelect} />;
  }

  const userName = user.user_metadata?.full_name || user.email;

  return (
    <div className="flex h-screen overflow-hidden">
  {/* LEFT SIDEBAR */}
  <div className="hidden md:block">
    <ChatSidebarNew
      conversations={conversations}
      currentConversationId={currentConversationId}
      onSelectConversation={loadConversation}
      onNewChat={handleReset}
      onDeleteConversation={deleteConversation}
      onSignOut={signOut}
      userName={userName}
    />
  </div>

  {/* CENTER CHAT */}
  <div className="flex flex-1 flex-col overflow-hidden">
    <ChatAreaNew
      messages={messages}
      isLoading={isLoading}
      isTyping={isTyping}
      onSendMessage={handleSendMessage}
      conversationStep={conversationStep}
      onGuidedSelection={handleGuidedSelection}
      onSuggestionAction={() => {}}
    />
  </div>

  {/* RIGHT FILTERS PANEL */}
  <div className="hidden lg:flex w-80 flex-col border-l bg-background">
    <FiltersPanel onReset={handleReset} />
  </div>
</div>

  );
}

/* ---------------- EXPORT ---------------- */

export default function Chat() {
  return (
    <LanguageProvider>
      <ChatContent />
    </LanguageProvider>
  );
}
