import { supabase } from "@/supabase";
import { useState, useCallback } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { MobileSidebar } from "@/components/chat/MobileSidebar";
import { LanguageSelector } from "@/components/chat/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { streamChat, type Message } from "@/lib/chat-stream";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {

  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Try to get saved language preference from localStorage
    return localStorage.getItem("samvadd-language") || "en";
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

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem("samvadd-language", language);
  };

  const handleSendMessage = useCallback(async (input: string) => {
    if (!user) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);

    // Create conversation if needed
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

    // Save user message
    await saveMessage(conversationId, "user", input);

    // Update title if first message
    if (messages.length === 0) {
      await updateConversationTitle(conversationId, input.slice(0, 50));
    }

    let assistantContent = "";
    const allMessages = [...messages, userMessage];

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
      setIsTyping(false);
    };

    try {
      await streamChat({
        messages: allMessages,
        language: selectedLanguage,
        onDelta: updateAssistant,
        onDone: async () => {
          setIsLoading(false);
          // Save assistant message
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
    } catch (error) {
      setIsLoading(false);
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  }, [user, currentConversationId, messages, setMessages, createConversation, saveMessage, updateConversationTitle, toast, selectedLanguage]);

  const handleSignOut = async () => {
    await signOut();
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0];

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={loadConversation}
          onNewChat={startNewChat}
          onDeleteConversation={deleteConversation}
          onSignOut={handleSignOut}
          userName={userName}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between gap-2 border-b p-3 md:hidden">
          <div className="flex items-center gap-2">
            <MobileSidebar
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={loadConversation}
              onNewChat={startNewChat}
              onDeleteConversation={deleteConversation}
              onSignOut={handleSignOut}
              userName={userName}
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
            <span className="font-semibold">Samvadd AI</span>
          </div>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            compact
          />
        </div>

        <ChatArea
          messages={messages}
          isLoading={isLoading}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          languageCode={selectedLanguage}
        />
      </div>
    </div>
  );
}
