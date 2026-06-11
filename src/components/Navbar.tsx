"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type NavbarProps = {
  user: {
    name: string;
    role: "CLIENT" | "FREELANCER";
    photoUrl?: string | null;
  };
};

export function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
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

  return (
    <nav className="border-b border-ink/10 bg-white/80 shadow-soft backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-black tracking-tight text-ink">
          REACH
        </Link>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
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
              className={`h-4 w-4 text-ink/55 transition ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-ink/10 bg-white py-2 shadow-soft">
              <Link
                href="/dashboard/profile"
                className="block px-4 py-3 text-sm font-semibold text-ink transition hover:bg-ink/5"
                onClick={() => setOpen(false)}
              >
                Mi perfil
              </Link>
              <Link
                href={dashboardHref}
                className="block px-4 py-3 text-sm font-semibold text-ink transition hover:bg-ink/5"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <hr className="my-1 border-ink/10" />
              <form
                action="/api/auth/signout"
                method="POST"
                className="block"
              >
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
    </nav>
  );
}
