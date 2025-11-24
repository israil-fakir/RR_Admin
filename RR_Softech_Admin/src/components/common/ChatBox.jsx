import React, { useEffect, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { fetchChatting, postChatting } from "../../api/UserDashboard/chatting";

export default function ChatBox({
  currentUser = "CUSTOMER",
  orderId,
  chatUser = null,
  divHeight = "h-[670px]",
  isCustomerView = false,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [sending, setSending] = useState(false);
  

  const messageEndRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    messageEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const loadMessages = async (opts = { force: false }) => {
    if (!orderId) return;
    try {
      setLoading(true);
      const data = await fetchChatting();

      const list = Array.isArray(data) ? data : [];

      const filterData = list
        .filter((d) => d && d.order === orderId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const latest = filterData.length
        ? filterData[filterData.length - 1].timestamp
        : null;

      if (!opts.force && lastFetchedAt && latest === lastFetchedAt) {
        setLoading(false);
        return;
      }

      setMessages(filterData);
      setLastFetchedAt(latest);
      setLoading(false);
    } catch (err) {
      console.error("Chat load failed:", err);
      setLoading(false);
    }
  };


  useEffect(() => {
    loadMessages({ force: true });
    const interval = setInterval(() => loadMessages(), 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);


  useEffect(() => {
    if (messages.length) scrollToBottom(true);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;
    setSending(true);

    const payload = {
      message: input.trim(),
      order: orderId,
      // optionally include author info if your API expects it
      // author_role: currentUser
    };

    try {
      await postChatting(payload);
      setInput("");
      setFile(null);
      await loadMessages({ force: true });
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Correct bubble side logic (matches your spec):
   *
   * - If the message is from me -> right
   * - If I'm CUSTOMER -> show ALL other roles on left
   * - If I'm EMPLOYEE or OWNER -> CUSTOMER messages on left, others on right
   */
  const bubbleSide = (msgRoleRaw) => {
    const me = (currentUser || "CUSTOMER").toUpperCase();
    const msgRole = (msgRoleRaw || "").toUpperCase();
    if (!["CUSTOMER", "EMPLOYEE", "OWNER"].includes(msgRole)) {
      return "justify-start";
    }

    if (msgRole === me) return "justify-end";

    if (me === "CUSTOMER") {
      return "justify-start";
    }

    if (msgRole === "CUSTOMER") return "justify-start";
    return "justify-end";
  };

  const bubbleColor = (msgRoleRaw) => {
    const me = (currentUser || "CUSTOMER").toUpperCase();
    const msgRole = (msgRoleRaw || "").toUpperCase();
    const isMine = msgRole === me;
    return isMine ? "bg-blue-100 text-gray-900" : "bg-white text-gray-900";
  };

  return (
    <div className={`flex flex-col bg-white rounded-lg overflow-hidden ${divHeight}`}>
      {!isCustomerView && chatUser && (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300 bg-white">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
            style={{
              backgroundColor: `hsl(${(chatUser.id * 47) % 360} 60% 50%)`,
            }}
          >
            {chatUser.first_name?.[0] || "U"}
          </div>

          <div className="flex-1">
            <div className="font-semibold text-sm">
              {chatUser.first_name} {chatUser.last_name}
            </div>
            <div className="text-xs text-gray-500">{chatUser.email}</div>
          </div>

          <div className="text-xs text-gray-400 capitalize">
            {chatUser.role?.toLowerCase()}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 sm:p-6">
        {loading && messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No messages yet. Say hi 👋</div>
        ) : (
          messages.map((msg) => {
            // Normalize role from API
            const roleRaw = msg.author?.role || msg.role || "UNKNOWN";
            const role = (roleRaw || "UNKNOWN").toUpperCase();

            // Debugging tip: uncomment to inspect incoming messages & roles
            // console.log("msg:", msg.id, "role:", role, "currentUser:", currentUser);

            const side = bubbleSide(role);
            const color = bubbleColor(role);

            const time = msg.timestamp ? new Date(msg.timestamp) : new Date();
            const formattedTime = time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={msg.id || `${msg.timestamp}-${Math.random()}`} className={`flex ${side}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${color}`}>
                  <div className="text-sm whitespace-pre-wrap">{msg.message}</div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400">{formattedTime}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs capitalize text-gray-500">from {role.toLowerCase()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messageEndRef} />
      </div>

      <div className="border-t border-gray-300 p-3 bg-white flex items-center gap-3">

        <div className="flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a messages..."
            className="w-full resize-none h-10 sm:h-12 rounded border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300"
          />

          {file && (
            <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
              <div className="truncate max-w-xs">{file.name}</div>
              <button onClick={() => setFile(null)} className="text-xs text-blue-600 underline" type="button">
                Remove
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-[#0095FF] hover:bg-blue-600 text-white p-3 rounded flex items-center justify-center"
          aria-label="Send message"
          type="button"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
