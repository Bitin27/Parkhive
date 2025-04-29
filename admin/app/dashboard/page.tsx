"use client"
import DashboardStats  from "@/components/dashboard/dashboard-stats"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardStats />
    </div>
  )
}