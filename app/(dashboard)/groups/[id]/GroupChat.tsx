"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import Link from "next/link";

export default function GroupChat({
  group,
  initialMessages,
  currentUser,
}: {
  group: any;
  initialMessages: any[];
  currentUser: { id: string; clerkId: string; name: string; role: string };
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`group-${group.id}`);
    channel.bind("new-message", (data: any) => {
      setMessages((prev) => {
        // Temp message replace karo
        const filtered = prev.filter((m) => !m.id.startsWith("temp-"));
        const exists = filtered.find((m) => m.id === data.id);
        if (exists) return prev;
        return [...filtered, data];
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`group-${group.id}`);
    };
  }, [group.id]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);

    const tempMessage = {
      id: `temp-${Date.now()}`,
      message: input.trim(),
      createdAt: new Date().toISOString(),
      user: {
        name: currentUser.name,
        role: currentUser.role,
        clerkId: currentUser.clerkId,
      },
    };

    // Turant dikhao — optimistic update
    setMessages((prev) => [...prev, tempMessage]);
    const sentInput = input.trim();
    setInput("");

    await fetch(`/api/groups/${group.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: sentInput }),
    });

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-900">
        <Link
          href="/groups"
          className="text-gray-400 hover:text-white transition-colors"
        >
          ←
        </Link>
        <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center font-bold text-blue-400">
          {group.company.name[0]}
        </div>
        <div>
          <h2 className="font-semibold text-white text-sm">{group.name}</h2>
          <p className="text-gray-400 text-xs">
            {group._count.members} members
          </p>
        </div>
        <Link
          href={`/companies/${group.company.id}`}
          className="ml-auto text-blue-400 text-xs hover:underline"
        >
          View Drive →
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-3">💬</p>
            <p>No messages yet — start the conversation!</p>
          </div>
        )}
        {messages.map((msg, index) => {
          const isMe = msg.user.clerkId === currentUser.clerkId;
          const prevMsg = messages[index - 1];
          const showDate =
            !prevMsg ||
            formatDate(msg.createdAt) !== formatDate(prevMsg.createdAt);

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="text-gray-500 text-xs bg-gray-900 px-3 py-1 rounded-full">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              )}
              <div
                className={`flex ${isMe ? "justify-end" : "justify-start"} mb-1`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col`}
                >
                  {!isMe && (
                    <div className="flex items-center gap-1.5 mb-1 ml-1">
                      <span className="text-xs font-medium text-gray-300">
                        {msg.user.name}
                      </span>
                      {msg.user.role === "admin" && (
                        <span className="text-xs bg-blue-900 text-blue-400 px-1.5 py-0.5 rounded font-medium">
                          TPO
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : msg.user.role === "admin"
                          ? "bg-purple-900 border border-purple-700 text-white rounded-bl-sm"
                          : "bg-gray-800 text-gray-100 rounded-bl-sm"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-gray-600 text-xs mt-0.5 mx-1">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800 bg-gray-900">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-blue-500 resize-none transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            ➤
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-1.5 ml-1">
          Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
