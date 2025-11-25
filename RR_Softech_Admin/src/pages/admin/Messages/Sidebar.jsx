import React, { useEffect, useState } from "react";
import { User, Search, Menu } from "lucide-react";
import { fetchChatting } from "../../../api/UserDashboard/chatting";

/**
 * Sidebar with sticky header + smooth mobile drawer
 */
export default function Sidebar({ onSelectConversation, setParentLoading }) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [unreadMap, setUnreadMap] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await fetchChatting();
      const map = new Map();

      data.forEach((m) => {
        if (!m?.author?.id) return;
        if (m.author.role !== "CUSTOMER") return;

        const id = m.author.id;

        if (!map.has(id)) {
          map.set(id, {
            ...m.author,
            lastMessage: m.message,
            lastMessageTime: m.timestamp,
            orders: m.order ? [m.order] : [],
          });
        } else {
          const cur = map.get(id);

          if (m.order && !cur.orders.includes(m.order)) cur.orders.push(m.order);

          if (new Date(m.timestamp) > new Date(cur.lastMessageTime)) {
            cur.lastMessage = m.message;
            cur.lastMessageTime = m.timestamp;
          }

          map.set(id, cur);
        }
      });

      const arr = Array.from(map.values()).sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );

      setUsers(arr);

      const unreadObj = {};
      arr.forEach((u) => {
        const key = `chat_last_seen_${u.id}`;
        const seen = localStorage.getItem(key);

        unreadObj[u.id] =
          seen && new Date(seen) >= new Date(u.lastMessageTime) ? 0 : 1;
      });

      setUnreadMap(unreadObj);
    } catch (err) {
      console.error("Failed to load sidebar:", err);
    }
  };

  useEffect(() => {
    // Initial load with fullscreen spinner
    const loadInitial = async () => {
      if (setParentLoading) setParentLoading(true);
      await loadUsers();
      if (setParentLoading) setParentLoading(false);
    };

    loadInitial();

    // Polling without touching parent loading
    const interval = setInterval(loadUsers, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (user) => {
    localStorage.setItem(`chat_last_seen_${user.id}`, new Date().toISOString());
    setUnreadMap((p) => ({ ...p, [user.id]: 0 }));

    const latestOrder =
      user.orders?.length ? user.orders[user.orders.length - 1] : null;

    onSelectConversation && onSelectConversation({ user, latestOrder });

    // Auto close drawer on mobile
    setMobileOpen(false);
  };

  const filtered = users.filter((u) =>
    `${u.first_name} ${u.last_name} ${u.email} ${u.lastMessage}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <>
      {/* Mobile top bar button */}
      <div className="md:hidden p-3 border-b flex items-center bg-white shadow-sm">
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="ml-3 font-semibold text-lg">Conversations</div>
      </div>

      {/* Overlay (mobile only) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 bg-white h-full md:h-[85vh] 
          w-72 md:w-80 border-r border-gray-300
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-30 border-b border-gray-300">
          <div className="flex items-center gap-3 px-4 py-3 mt-4">
            <div className="text-lg font-semibold">Customer Conversations</div>
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto text-sm text-gray-500 md:hidden"
            >
              Close
            </button>
          </div>

          {/* Sticky Search */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search contacts or messages"
                className="w-full pl-10 pr-3 py-2 rounded border border-gray-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="overflow-y-auto h-[calc(100%-120px)] px-2 py-2">
          {filtered.length === 0 ? (
            <div className="text-gray-400 text-sm px-3 py-6">
              No conversations yet
            </div>
          ) : (
            filtered.map((u) => (
              <div
                key={u.id}
                onClick={() => select(u)}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: `hsl(${(u.id * 37) % 360} 60% 45%)` }}
                >
                  {u.first_name?.[0] || "U"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm truncate">
                      {u.first_name} {u.last_name}
                    </div>
                    <div className="text-xs text-gray-400 ml-2">
                      {u.lastMessageTime
                        ? new Date(u.lastMessageTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-gray-500 truncate max-w-40">
                      {u.lastMessage || "—"}
                    </div>

                    {unreadMap[u.id] > 0 && (
                      <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                        {unreadMap[u.id]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
