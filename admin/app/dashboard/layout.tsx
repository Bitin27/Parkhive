import Sidebar from "@/components/dashboard/sidebar"
import { UserNav } from "@/components/dashboard/user-nav"

export default function DashboardLayout({ children } : any) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}