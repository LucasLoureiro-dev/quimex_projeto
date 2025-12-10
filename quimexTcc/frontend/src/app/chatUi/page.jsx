import { ChatList } from "@/components/chatList/chatList";
import { ChatMessage } from "@/components/chatMessage/chatMessage";
import { ChatInput } from "@/components/chatInput/chatInput";

export default function Chat() {
  return (
    <>
      <div className="flex flex-row space-y-8 animate-in fade-in duration-500 min-h-screen bg-background ">
        <div>
          <ChatList />
        </div>
        <main className="w-full max-w-4xl p-4 lg:p-8 pt-16 lg:pt-8 lg:pl-64">
          <div className="p-4 lg:p-8 pt-16 lg:pt-8 space-y-6">
            <h1>Página chat ui (:</h1>
            <ChatMessage />
            <ChatInput />
          </div>
        </main>
      </div>
    </>
  );
}
