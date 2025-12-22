"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Kanban, Settings, Layers, LogOut } from "lucide-react" // <--- Added LogOut
import { ModeToggle } from "@/components/toggleButton"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logout } from "@/actions/logout" // <--- Added logout action

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: Kanban,
  },
  {
    title: "Timeline",
    href: "/timeline",
    icon: Layers,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-screen w-64 border-r bg-background flex flex-col fixed left-0 top-0 z-30 hidden md:flex">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold tracking-tight">FreeDeck</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              pathname === item.href && "bg-secondary"
            )}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        ))}
      </nav>

      {/* Footer / Toggle Area */}
      <div className="p-4 border-t flex items-center justify-between">
        {/* LOGOUT BUTTON */}
        <form action={logout}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
            </Button>
        </form>

        <ModeToggle />
      </div>
    </aside>
  )
}