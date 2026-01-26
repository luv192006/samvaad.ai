import { Menu, Plus, MessageSquare, Trash2, LogOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Conversation } from "@/hooks/useConversations";
import { cn } from "@/lib/utils";

interface MobileSidebarNewProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onSignOut: () => void;
  userName?: string;
  onReset: () => void;
}

export function MobileSidebarNew({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onSignOut,
  userName,
  onReset,
}: MobileSidebarNewProps) {
  const { t } = useLanguage();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-full flex-col">
          <div className="p-4 border-b">
            <h1 className="text-lg font-bold">{t.appName}</h1>
          </div>

          <div className="p-3 space-y-2">
            <Button onClick={onNewChat} className="w-full justify-start gap-2" variant="outline">
              <Plus className="h-4 w-4" />
              {t.newChat}
            </Button>
            <Button onClick={onReset} className="w-full justify-start gap-2" variant="ghost">
              <RotateCcw className="h-4 w-4" />
              {t.resetChat}
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer",
                    currentConversationId === conv.id ? "bg-accent" : "hover:bg-accent/50"
                  )}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate text-sm">{conv.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">{userName || "User"}</span>
              <Button variant="ghost" size="icon" onClick={onSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
