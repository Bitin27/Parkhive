// // components/dashboard/dashboard-stats.jsx
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Users, Car, Check, Clock } from "lucide-react"

// export function DashboardStats() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
//           <Users className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">24</div>
//           <p className="text-xs text-muted-foreground">
//             +2 from last month
//           </p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
//           <Car className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">145</div>
//           <p className="text-xs text-muted-foreground">
//             +12 from last month
//           </p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
//           <Check className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">78</div>
//           <p className="text-xs text-muted-foreground">
//             53% occupancy rate
//           </p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
//           <Clock className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">9</div>
//           <p className="text-xs text-muted-foreground">
//             Needs approval
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// components/dashboard/dashboard-stats.jsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Car, Check, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalManagers: 0,
    totalSlots: 0,
    availableSlots: 0,
    pendingVerifications: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total managers
        const { data: managers, error: managersError } = await supabase
          .from('parkingmanagers')
          .select('managerid, verificationstatus')
        
        if (managersError) throw managersError

        // Get slots
        const { data: slots, error: slotsError } = await supabase
          .from('parking_slots')
          .select('id, status')
        
        if (slotsError) throw slotsError

        setStats({
          totalManagers: managers?.length || 0,
          pendingVerifications: managers?.filter(m => m.verificationstatus === 'Pending')?.length || 0,
          totalSlots: slots?.length || 0,
          availableSlots: slots?.filter(s => s.status === 'Available')?.length || 0
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return <div>Loading dashboard stats...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Managers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalManagers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSlots}</div>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
          <Check className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.availableSlots}</div>
          {stats.totalSlots > 0 && (
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.availableSlots / stats.totalSlots) * 100)}% availability rate
            </p>
          )}
        </CardContent>
      </Card> */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
          {stats.pendingVerifications > 0 && (
            <p className="text-xs text-muted-foreground">
              Needs approval
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}