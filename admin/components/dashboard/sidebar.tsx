// components/dashboard/sidebar.jsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Users, CarFront, HomeIcon, Settings 
} from "lucide-react"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    title: "Parking Managers",
    href: "/dashboard/managers",
    icon: Users,
  },
  {
    title: "Parking Slots",
    href: "/dashboard/slots",
    icon: CarFront,
  },
 
  {
    title: "Revenue Report",
    href: "/dashboard/revenue",
    icon: CarFront,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="w-64 border-r bg-muted/40 h-full">
      <div className="flex flex-col h-full">
        <div className="py-4 px-6 border-b">
          <h2 className="text-xl font-bold">Parking Admin</h2>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}



