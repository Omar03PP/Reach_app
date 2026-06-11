"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { markAsRead } from "@/lib/actions/notifications";

type Notification = {
  id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
};

type NavbarProps = {
  user: {
    id: string;
    name: string;
    role: "CLIENT" | "FREELANCER";
    photoUrl?: string | null;
  };
  notifications: Notification[];
  unreadCount: number;
};

export function Navbar({ user, notifications, unreadCount }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [localNotifs, setLocalNotifs] = useState(notifications);
  const [localUnread, setLocalUnread] = useState(unreadCount);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const dashboardHref =
    user.role === "CLIENT" ? "/dashboard/client" : "/dashboard/freelancer";

  async function handleMarkAsRead(notifId: string) {
    await markAsRead(notifId);
    setLocalNotifs((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)),
    );
    setLocalUnread((prev) => Math.max(0, prev - 1));
  }

  const typeStyles: Record<string, string> = {
    PROPOSAL_RECEIVED: "border-l-coral",
    PROPOSAL_ACCEPTED: "border-l-mint",
    PROPOSAL_REJECTED: "border-l-coral",
    PROJECT_COMPLETED: "border-l-mint",
  };

  return (
    <nav className="border-b border-ink/10 bg-white/80 shadow-soft backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-black tracking-tight text-ink">
          REACH
        </Link>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-md border border-ink/15 p-2 transition hover:border-ink/35"
            >
              <svg
                className="h-5 w-5 text-ink"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {localUnread > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-[10px] font-bold text-white">
                  {localUnread > 9 ? "9+" : localUnread}
                </span>
              ) : null}
            </button>

            {notifOpen && (
              <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-ink/10 bg-white py-2 shadow-soft">
                <p className="px-4 pb-2 text-sm font-bold text-ink/55 uppercase tracking-wide">
                  Notificaciones
                </p>
                {localNotifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-ink/45">
                    No tienes notificaciones.
                  </p>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {localNotifs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleMarkAsRead(n.id)}
                        className={`w-full border-l-4 px-4 py-3 text-left transition hover:bg-ink/5 ${
                          n.read ? "opacity-60" : ""
                        } ${typeStyles[n.type] ?? "border-l-ink/20"}`}
                      >
                        <p className="text-sm font-semibold text-ink">
                          {n.message}
                        </p>
                        <p className="mt-0.5 text-xs text-ink/45">
                          {new Intl.DateTimeFormat("es-ES", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(n.createdAt))}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-md border border-ink/15 px-3 py-2 transition hover:border-ink/35"
            >
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-sm font-bold text-white">
                  {initials}
                </div>
              )}
              <span className="text-sm font-bold text-ink">{user.name}</span>
              <svg
                className={`h-4 w-4 text-ink/55 transition ${profileOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-ink/10 bg-white py-2 shadow-soft">
                <Link
                  href="/dashboard/profile"
                  className="block px-4 py-3 text-sm font-semibold text-ink transition hover:bg-ink/5"
                  onClick={() => setProfileOpen(false)}
                >
                  Mi perfil
                </Link>
                <Link
                  href={dashboardHref}
                  className="block px-4 py-3 text-sm font-semibold text-ink transition hover:bg-ink/5"
                  onClick={() => setProfileOpen(false)}
                >
                  Dashboard
                </Link>
                <hr className="my-1 border-ink/10" />
                <form action="/api/auth/signout" method="POST" className="block">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-left text-sm font-semibold text-coral transition hover:bg-ink/5"
                  >
                    Cerrar sesion
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
