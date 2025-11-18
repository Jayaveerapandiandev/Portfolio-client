// src/pages/AdminMessages.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAllMessages,
  markMessageAsSeen,
  deleteMessageById,
} from "../api/UserApi";
import { useTheme } from "../context/ThemeContext";
import {
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  User,
  Mail,
  Calendar,
  X,
  Check,
} from "lucide-react";

/*
  Refactored AdminMessages:
   - Slide-up bottom sheet preview (unique UI)
   - Keyboard navigation (ArrowUp / ArrowDown) to change selection
   - Star / Favorite (local, persisted in localStorage)
   - Infinite scroll (progressive reveal of already fetched messages)
   - Multi-select bulk delete
   - Mark read/unread via eye icon toggle
   - Uses same API functions: getAllMessages, markMessageAsSeen, deleteMessageById
*/

const PAGE_CHUNK = 12; // number of items revealed per infinite scroll fetch (local chunking)

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const STORAGE_FAVORITES_KEY = "admin_messages_favorites_v1";

const AdminMessages = () => {
  const { theme } = useTheme();

  // raw messages fetched from API (full set)
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // UI: progressive reveal for infinite scroll
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK);
  const listContainerRef = useRef(null);

  // selection & preview
  const [selectedId, setSelectedId] = useState(null); // id of currently previewed message
  const [sheetOpen, setSheetOpen] = useState(false);

  // filters / search
  const [filter, setFilter] = useState("all"); // all / unread / read / starred
  const [search, setSearch] = useState("");

  // busy ids for single actions or delete operations
  const [busyIds, setBusyIds] = useState(new Set());

  // bulk selection
  const [selectedMap, setSelectedMap] = useState({}); // {id: true}
  const anySelected = useMemo(() => Object.keys(selectedMap).length > 0, [selectedMap]);

  // favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // --- Fetch messages once (we keep same API usage) ---
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getAllMessages();
      if (res && res.success && Array.isArray(res.data)) {
        // Sort newest first (same as previous behavior)
        const sorted = res.data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllMessages(sorted);
        // reset visible count & selection
        setVisibleCount(PAGE_CHUNK);
        setSelectedId(null);
        setSheetOpen(false);
      } else {
        setAllMessages([]);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
      setFetchError("Failed to load messages");
      setAllMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    // cleanup keyboard listener on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist favorites whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // --- Derived list based on filter + search ---
  const filtered = useMemo(() => {
    let arr = allMessages.slice();

    if (filter === "unread") arr = arr.filter((m) => !m.isSeen);
    else if (filter === "read") arr = arr.filter((m) => m.isSeen);
    else if (filter === "starred") arr = arr.filter((m) => favorites[m.id]);

    if (search && search.trim().length > 0) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q) ||
          (m.message || "").toLowerCase().includes(q) ||
          (m.purpose || m.category || "").toLowerCase().includes(q)
      );
    }

    return arr;
  }, [allMessages, filter, search, favorites]);

  // items currently revealed via infinite scroll
  const visibleItems = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const hasMore = visibleCount < filtered.length;

  // --- Helpers to manage busyIds ---
  const addBusy = (id) => setBusyIds((s) => new Set(s).add(id));
  const removeBusy = (id) =>
    setBusyIds((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });

  const isBusy = (id) => busyIds.has(id);

  // --- Toggle favorite ---
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const copy = { ...(prev || {}) };
      if (copy[id]) delete copy[id];
      else copy[id] = true;
      return copy;
    });
  };

  // --- Toggle mark seen/unseen ---
  const toggleSeen = async (id, currentlySeen) => {
    addBusy(id);
    // optimistic update
    setAllMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isSeen: !currentlySeen } : m)));
    try {
      const res = await markMessageAsSeen(id);
      if (!res || !res.success) {
        // revert if backend failed
        setAllMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isSeen: currentlySeen } : m)));
        console.error("markMessageAsSeen failed", res);
      }
    } catch (err) {
      // revert
      setAllMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isSeen: currentlySeen } : m)));
      console.error(err);
    } finally {
      removeBusy(id);
    }
  };

  // --- Delete single message ---
  const deleteSingle = async (id) => {
    addBusy(id);
    try {
      const res = await deleteMessageById(id);
      if (res && res.success) {
        setAllMessages((prev) => prev.filter((m) => m.id !== id));
        // cleanup selection/favorites/selectedMap
        setSelectedId((cur) => (cur === id ? null : cur));
        setSelectedMap((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        setFavorites((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      } else {
        console.error("deleteMessageById failed", res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      removeBusy(id);
    }
  };

  // --- Bulk delete ---
  const bulkDelete = async () => {
    const ids = Object.keys(selectedMap);
    if (ids.length === 0) return;
    // mark all as busy
    ids.forEach(addBusy);
    try {
      // sequentially delete (to reuse existing API). Could be parallel but safer sequentially.
      for (const id of ids) {
        try {
          const res = await deleteMessageById(id);
          if (res && res.success) {
            setAllMessages((prev) => prev.filter((m) => m.id !== id));
            setFavorites((prev) => {
              const copy = { ...prev };
              delete copy[id];
              return copy;
            });
          } else {
            console.error("delete failed for", id, res);
          }
        } catch (err) {
          console.error("delete error for", id, err);
        } finally {
          removeBusy(id);
        }
      }
      // clear selection map
      setSelectedMap({});
      setSelectedId(null);
    } finally {
      // ensure busy clears
      ids.forEach(removeBusy);
    }
  };

  // --- Selection helpers ---
  const toggleSelect = (id, e) => {
    // prevent parent onClick when clicking checkbox
    if (e) e.stopPropagation();
    setSelectedMap((prev) => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id];
      else copy[id] = true;
      return copy;
    });
  };

  const selectAllVisible = () => {
    const newMap = {};
    visibleItems.forEach((m) => {
      newMap[m.id] = true;
    });
    setSelectedMap(newMap);
  };

  const clearSelection = () => setSelectedMap({});

  // --- Open preview bottom sheet ---
  const openPreview = (id) => {
    setSelectedId(id);
    setSheetOpen(true);
    // if item exists outside visible viewport, scroll to it
    setTimeout(() => {
      const el = document.getElementById(`msg-row-${id}`);
      if (el && listContainerRef.current) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 60);
  };

  const closePreview = () => {
    setSheetOpen(false);
    // keep selectedId if you want; here we keep it so keyboard nav still works
  };

  // --- Keyboard navigation (ArrowUp / ArrowDown) ---
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        // find index in filtered array
        const list = filtered;
        if (!list.length) return;
        let idx = list.findIndex((m) => m.id === selectedId);
        if (idx === -1) {
          // if nothing selected, pick first (down) or last (up)
          idx = e.key === "ArrowDown" ? 0 : list.length - 1;
        } else {
          idx = e.key === "ArrowDown" ? Math.min(list.length - 1, idx + 1) : Math.max(0, idx - 1);
        }
        const next = list[idx];
        if (next) {
          // ensure visible count includes next index
          const need = idx + 1;
          if (need > visibleCount) setVisibleCount((v) => Math.min(filtered.length, need));
          setSelectedId(next.id);
          setSheetOpen(true);
          // scroll into view
          setTimeout(() => {
            const el = document.getElementById(`msg-row-${next.id}`);
            if (el && listContainerRef.current) el.scrollIntoView({ block: "center", behavior: "smooth" });
          }, 30);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filtered, selectedId, visibleCount]);

  // --- Infinite scroll handler (local progressive reveal) ---
  useEffect(() => {
    const el = listContainerRef.current;
    if (!el) return;

    const onScroll = () => {
      if (loading) return;
      // if near bottom, reveal more
      const threshold = 250; // px from bottom
      if (el.scrollHeight - el.scrollTop - el.clientHeight < threshold) {
        if (hasMore) {
          setVisibleCount((v) => Math.min(filtered.length, v + PAGE_CHUNK));
        }
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, filtered.length, loading]);

  // --- Utilities ---
  const getById = (id) => allMessages.find((m) => m.id === id) || null;

  // --- UI pieces ---
  const TopBar = () => (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4`}>
      <div>
        <h1 className={`text-2xl font-bold ${theme.accent}`}>Messages</h1>
        <p className="text-sm opacity-80">
          {allMessages.length} total · {allMessages.filter((m) => !m.isSeen).length} unread
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="flex items-center gap-2 border rounded-md px-3 py-2">
          <input
            placeholder="Search name, email, message..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // reset visible count on new search
              setVisibleCount(PAGE_CHUNK);
            }}
            className={`bg-transparent outline-none ${theme.text}`}
          />
        </div>

        {/* Filters */}
        <div className={`flex items-center gap-2 border px-2 py-2 rounded-md ${theme.border}`}>
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "read", label: "Read" },
            { key: "starred", label: "Starred" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setVisibleCount(PAGE_CHUNK);
              }}
              className={`px-3 py-1 rounded-md ${filter === f.key ? "font-semibold" : "opacity-70"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button
          onClick={fetchMessages}
          className={`px-3 py-2 rounded-md border ${theme.border}`}
          title="Refresh"
        >
          Refresh
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="p-8 text-center opacity-70">
      {loading ? "Loading messages..." : "No messages match your filters."}
    </div>
  );

  // main list item — compact stacked card style
  const ListRow = ({ m, index }) => {
    const isSelected = selectedId === m.id;
    const favorited = !!favorites[m.id];
    return (
      <div
        id={`msg-row-${m.id}`}
        key={m.id}
        onClick={() => openPreview(m.id)}
        className={`cursor-pointer p-4 border-b ${theme.border} flex gap-3 items-start transition
            ${isSelected ? "bg-black/5 dark:bg-white/5" : ""}
          `}
      >
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {/* checkbox for bulk select */}
              <input
                type="checkbox"
                checked={!!selectedMap[m.id]}
                onChange={(e) => toggleSelect(m.id, e)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4"
              />

              <div className="flex items-center gap-2">
                {/* star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(m.id);
                  }}
                  title={favorited ? "Unstar" : "Star"}
                  className="opacity-90"
                >
                  {favorited ? <Star size={16} /> : <StarOff size={16} />}
                </button>

                <div className="flex flex-col">
                  <div className={`font-medium ${m.isSeen ? "opacity-80" : ""}`}>
                    {m.name || "—"}
                    <span className="text-xs opacity-60 ml-2">{m.category || m.purpose || ""}</span>
                  </div>
                  <div className="text-xs opacity-70">{m.email}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs opacity-70">{formatDate(m.createdAt)}</div>

              {/* mark seen/unseen icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isBusy(m.id)) toggleSeen(m.id, m.isSeen);
                }}
                disabled={isBusy(m.id)}
                title={m.isSeen ? "Mark as unread" : "Mark as read"}
                className="p-1 rounded"
              >
                {m.isSeen ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              {/* single delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // confirm quickly — using window.confirm for simplicity
                  const ok = window.confirm("Delete this message? This cannot be undone.");
                  if (ok) deleteSingle(m.id);
                }}
                disabled={isBusy(m.id)}
                title="Delete"
                className="p-1 rounded"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="text-sm opacity-90 truncate">{m.message}</div>
        </div>
      </div>
    );
  };

  // preview bottom sheet content
  const PreviewSheet = () => {
    const m = getById(selectedId);
    if (!m) return null;

    const favorited = !!favorites[m.id];

    return (
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 flex justify-center`}
        aria-hidden={!sheetOpen}
      >
        <div
          className={`w-full md:w-3/4 lg:w-2/3 rounded-t-xl shadow-xl p-4 border-t ${theme.border} ${theme.bg} ${theme.text}`}
          style={{
            // slight lifted look for desktop
            transform: sheetOpen ? "translateY(0)" : "translateY(100%)",
            transition: "transform 220ms ease",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <User />
              <div>
                <div className="font-semibold">{m.name || "—"}</div>
                <div className="text-xs opacity-80">{m.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(m.id)}
                title={favorited ? "Unstar" : "Star"}
                className="p-2 rounded"
              >
                {favorited ? <Star size={18} /> : <StarOff size={18} />}
              </button>

              <button
                onClick={() => toggleSeen(m.id, m.isSeen)}
                disabled={isBusy(m.id)}
                title={m.isSeen ? "Mark as unread" : "Mark as read"}
                className="p-2 rounded"
              >
                {m.isSeen ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <button
                onClick={() => {
                  const ok = window.confirm("Delete this message? This cannot be undone.");
                  if (ok) deleteSingle(m.id);
                }}
                disabled={isBusy(m.id)}
                className={`p-2 rounded ${theme.btn}`}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() => setSheetOpen(false)}
                className="p-2 rounded"
                title="Close preview"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="text-xs opacity-80 mb-3 flex gap-4">
            <div className="flex items-center gap-2"><Mail size={14} />{m.email}</div>
            <div className="flex items-center gap-2"><Calendar size={14} />{formatDate(m.createdAt)}</div>
            <div className="opacity-80">IP: {m.ipAddress || "—"}</div>
          </div>

          <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.message}</div>
        </div>
      </div>
    );
  };

  // show top bulk action bar when selection present
  const BulkBar = () =>
    anySelected ? (
      <div className={`fixed left-0 right-0 top-16 z-40 flex justify-center`}>
        <div className={`w-full md:w-3/4 lg:w-2/3 p-3 rounded shadow ${theme.bg} border ${theme.border}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">{Object.keys(selectedMap).length} selected</div>
              <button
                onClick={() => {
                  // quick bulk mark read/unread based on whether majority selected are read
                  const selectedIds = Object.keys(selectedMap);
                  const majorityRead = selectedIds.filter((id) => {
                    const m = getById(id);
                    return m?.isSeen;
                  }).length >= selectedIds.length / 2;
                  // toggle to opposite
                  selectedIds.forEach((id) => toggleSeen(id, majorityRead));
                }}
                className="px-3 py-1 rounded border"
              >
                Toggle Read
              </button>

              <button
                onClick={() => {
                  // bulk star/unstar: if any unstarred -> star all, else unstar all
                  const selectedIds = Object.keys(selectedMap);
                  const anyUnstarred = selectedIds.some((id) => !favorites[id]);
                  const newFavs = { ...favorites };
                  selectedIds.forEach((id) => {
                    if (anyUnstarred) newFavs[id] = true;
                    else delete newFavs[id];
                  });
                  setFavorites(newFavs);
                }}
                className="px-3 py-1 rounded border"
              >
                Toggle Star
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={clearSelection} className="px-3 py-1 rounded border">Clear</button>
              <button
                onClick={() => {
                  const ok = window.confirm(`Delete ${Object.keys(selectedMap).length} messages? This cannot be undone.`);
                  if (ok) bulkDelete();
                }}
                disabled={Object.keys(selectedMap).some((id) => isBusy(id))}
                className={`px-3 py-1 rounded ${theme.btn}`}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null;

  // --- Render ---
  return (
    <div className={`min-h-screen p-6 ${theme.bg} ${theme.text}`}>
      <div className="max-w-7xl mx-auto">

        {/* Top header + controls */}
        <TopBar />

        {/* Bulk action bar */}
        <BulkBar />

        {/* Main list container (centered floating module) */}
        <div
          ref={listContainerRef}
          className="mx-auto w-full md:w-3/4 lg:w-2/3 rounded-xl shadow-sm border overflow-auto"
          style={{ maxHeight: "72vh" }}
        >
          {/* header for list module */}
          <div className={`p-3 border-b flex items-center justify-between ${theme.border}`}>
            <div className="flex items-center gap-3">
              <Check />
              <div className="font-medium">Inbox</div>
              <div className="text-sm opacity-70 ml-2">{filtered.length} items</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // select all visible
                  selectAllVisible();
                }}
                className="px-3 py-1 rounded border"
              >
                Select visible
              </button>

              <button
                onClick={() => {
                  // clear selection
                  clearSelection();
                }}
                className="px-3 py-1 rounded border"
              >
                Clear selection
              </button>
            </div>
          </div>

          {/* list */}
          <div>
            {loading ? (
              <EmptyState />
            ) : visibleItems.length === 0 ? (
              <EmptyState />
            ) : (
              visibleItems.map((m, idx) => <ListRow key={m.id} m={m} index={idx} />)
            )}
          </div>

          {/* loader / more indicator */}
          <div className="p-4 text-center opacity-70">
            {hasMore ? "Scroll to load more..." : filtered.length === 0 ? "" : "No more messages"}
          </div>
        </div>

        {/* Preview bottom sheet */}
        {sheetOpen && <PreviewSheet />}

        {/* small footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm opacity-70">Showing {visibleItems.length} of {filtered.length} (loaded)</div>
          <div className="flex items-center gap-3">
            <button onClick={fetchMessages} className="px-3 py-1 rounded border">Refresh</button>
            <button
              onClick={() => {
                // Quick helper: open first visible message (useful)
                if (visibleItems.length) openPreview(visibleItems[0].id);
              }}
              className="px-3 py-1 rounded border"
            >
              Open first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
