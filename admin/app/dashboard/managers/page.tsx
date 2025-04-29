// app/dashboard/managers/page.jsx
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
// import { toast } from "@/components/ui/use-toast"

export default function ParkingManagersPage() {
  const [managers, setManagers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    async function fetchManagers() {
      try {
        setIsLoading(true)
        let query = supabase
          .from('parkingmanagers')
          .select('*')
        
        if (statusFilter !== "all") {
          query = query.eq('verificationstatus', statusFilter)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        setManagers(data || [])
      } catch (error) {
        console.error("Error fetching managers:", error)
        toast({
          title: "Error",
          description: "Failed to load parking managers",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchManagers()
  }, [statusFilter])

  async function handleStatusChange(managerId, newStatus) {
    try {
      const { data, error } = await supabase
        .from('parkingmanagers')
        .update({ verificationstatus: newStatus })
        .eq('managerid', managerId)
        .select()
      
      if (error) throw error
      
      // Update the local state
      setManagers(managers.map(manager => 
        manager.managerid === managerId 
          ? { ...manager, verificationstatus: newStatus }
          : manager
      ))
      
      toast({
        title: "Success",
        description: "Manager verification status updated successfully",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Parking Managers</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Managers List</CardTitle>
          <CardDescription>
            Manage verification status for parking managers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading managers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.length > 0 ? (
                  managers.map((manager) => (
                    <TableRow key={manager.managerid}>
                      <TableCell>{manager.managerid}</TableCell>
                      <TableCell>
                        {manager.firstname} {manager.lastname}
                      </TableCell>
                      <TableCell>{manager.email}</TableCell>
                      <TableCell>{manager.phone || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(manager.verificationstatus)}</TableCell>
                      <TableCell>
                        {manager.verificationstatus === "Pending" ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleStatusChange(manager.managerid, "Approved")}
                          >
                            Approve
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleStatusChange(manager.managerid, "Pending")}
                          >
                            Set to Pending
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No managers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}