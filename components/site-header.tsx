"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, LayoutDashboard, Search, UserPlus, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { getSession, logoutUser } from "@/actions/auth"

const navItems = [
  { href: "/", label: "Discover", icon: Search },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create-profile", label: "Become a Mentor", icon: UserPlus },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { userRole, setUserRole } = useAppStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null)

  useEffect(() => {
    getSession().then(res => setUser(res))
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
            SkillHub
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2",
                    isActive && "bg-secondary text-secondary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground mr-2">Hello, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={async () => {
                await logoutUser();
                window.location.href = '/';
              }}>
                Log out
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center rounded-lg border border-border bg-muted p-0.5">
                <button
                  onClick={() => setUserRole("learner")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    userRole === "learner"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Learner
                </button>
                <button
                  onClick={() => setUserRole("mentor")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    userRole === "mentor"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Mentor
                </button>
              </div>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
          {user ? (
            <div className="mt-4 flex flex-col gap-2">
              <div className="text-sm font-medium text-foreground px-4 py-2 bg-muted/50 rounded-lg">
                Logged in as {user.name}
              </div>
              <Button variant="outline" className="w-full text-destructive" onClick={async () => {
                await logoutUser();
                window.location.href = '/';
              }}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex items-center rounded-lg border border-border bg-muted p-0.5">
              <button
                onClick={() => setUserRole("learner")}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  userRole === "learner"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Learner
              </button>
              <button
                onClick={() => setUserRole("mentor")}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  userRole === "mentor"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Mentor
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
