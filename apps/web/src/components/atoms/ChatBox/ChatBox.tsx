import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

export function ChatBox() {
  return (
    <div className="fixed flex flex-col gap-y-4 right-0 bottom-0 h-2/5 w-96 border mr-8 mb-6 rounded-md bg-background p-4">
      <ChatMessages />
      <ChatInput/>
    </div>
  )
}