"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  BookOpen,
  ShoppingBasket,
  CalendarDays,
  ChartNoAxesCombined,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Brand } from "../ui/brand";
import { Modal } from "../ui/common";
import { useKingdom } from "./provider";
import { api } from "@/lib/api/client";
import { useUI } from "@/store/ui";
const navigation = [
  { href: "/dashboard", name: "Kingdom Overview", icon: LayoutDashboard },
  { href: "/royal-vault", name: "Royal Vault", icon: Leaf },
  { href: "/ancient-cookbook", name: "Ancient Cookbook", icon: BookOpen },
  { href: "/market-quest", name: "Market Quests", icon: ShoppingBasket },
  { href: "/royal-feast", name: "Royal Feast Planner", icon: CalendarDays },
  { href: "/analytics", name: "Kingdom Ledger", icon: ChartNoAxesCombined },
  { href: "/settings", name: "Settings", icon: Settings },
];
export function KingdomShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { data, mutate } = useKingdom();
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const notify = useUI((s) => s.notify);
  async function logout() {
    try {
      await api("auth/logout", "POST");
      router.replace("/");
      router.refresh();
    } catch (e) {
      notify(e instanceof Error ? e.message : "Please try again");
    }
  }
  return (
    <div className="kingdom-app">
      {menu && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={`sidebar ${menu ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-button mobile-only"
            aria-label="Close navigation"
            onClick={() => setMenu(false)}
          >
            <X size={19} />
          </button>
        </div>
        <div className="kingdom-label">
          <span className="status-dot" /> YOUR ENCHANTED KITCHEN
        </div>
        <nav aria-label="Kingdom navigation">
          {navigation.map(({ href, name, icon: Icon }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenu(false)}
              className={`${path.startsWith(href) ? "active" : ""} ${i === 6 ? "settings-nav" : ""}`}
            >
              <Icon size={19} />
              <span>{name}</span>
              {href === "/royal-vault" && (
                <small>{data.ingredients.length}</small>
              )}
            </Link>
          ))}
        </nav>
        <div className="keeper-note">
          <Sparkles size={23} />
          <h3>Small acts. Real magic.</h3>
          <p>Every ingredient you save is a little kindness to your kingdom.</p>
          <Link href="/ancient-cookbook">
            Find something to cook <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="sidebar-profile">
          <Link href="/settings" className="profile-link">
            <span className="avatar">
              {data.user.name.charAt(0).toUpperCase()}
            </span>
            <span>
              <strong>{data.user.name}</strong>
              <small>Kitchen Keeper</small>
            </span>
          </Link>
          <button
            onClick={logout}
            aria-label="Sign out"
            className="icon-button"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-header">
          <div className="app-breadcrumb">
            <button
              className="icon-button mobile-only"
              onClick={() => setMenu(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <span>The kingdom</span>
            <span>/</span>
            <strong>
              {navigation.find((n) => path.startsWith(n.href))?.name ??
                "Your kitchen"}
            </strong>
          </div>
          <div className="header-right">
            <span className="today-date">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <button
              className="notification-button icon-button"
              onClick={() => setNotifications(true)}
              aria-label={`Notifications, ${data.notifications.filter((n) => !n.read).length} unread`}
            >
              <Bell size={20} />
              {data.notifications.some((n) => !n.read) && <i />}
            </button>
            <Link
              href="/settings"
              className="avatar small-avatar"
              aria-label="Your profile"
            >
              {data.user.name.charAt(0).toUpperCase()}
            </Link>
          </div>
        </header>
        <main className="dashboard-main">
          {children}
          <footer className="app-footer">
            <span>Made with care. Seasoned with a little magic.</span>
            <Leaf size={14} />
            <span>MealTale · Your enchanted kitchen</span>
          </footer>
        </main>
      </div>
      {notifications && (
        <Modal
          title="Whispers from your pantry"
          close={() => setNotifications(false)}
        >
          <div className="notification-list">
            {data.notifications.length ? (
              data.notifications.map((n) => (
                <div key={n.id} className={n.read ? "read" : ""}>
                  <Bell size={17} />
                  <p>{n.message}</p>
                  {!n.read && <span className="status-dot" />}
                </div>
              ))
            ) : (
              <p>
                All is well in your kitchen. Freshness alerts will appear here.
              </p>
            )}
          </div>
          <button
            className="button button-forest"
            onClick={() =>
              void mutate(
                "notifications/read",
                "POST",
                {},
                "All whispers marked as read.",
              )
            }
          >
            Mark all as read
          </button>
        </Modal>
      )}
    </div>
  );
}
