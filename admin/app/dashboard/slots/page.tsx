// app/dashboard/slots/page.jsx
"use client"

// app/dashboard/slots/page.jsx
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ParkingSlot {
  id: string | number;
  name: string;
  status: string;
  vehicle_type: string;
  price_per_hour: number;
  updated_at: string;
  section_id: string | number;
  parking_sections?: {
    id: string | number;
    name: string;
  } | null;
}

export default function ParkingSlotsPage() {
  const [allSlots, setAllSlots] = useState<ParkingSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all")

  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    async function fetchSlots() {
      try {
        setIsLoading(true)
        
       
        const statusCheckQuery = await supabase
          .from('parking_slots')
          .select('status')
          .is('status', 'not.null')
        
        setDebugInfo(prev => ({ 
          ...prev, 
          statusCheck: statusCheckQuery.data?.map(item => item.status)
        }))
        
        // Get all slots
        let query = supabase
          .from('parking_slots')
          .select(`
            *,
            parking_sections:section_id(id, name)
          `)
        
        if (vehicleTypeFilter !== "all") {
          query = query.eq('vehicle_type', vehicleTypeFilter)
        }
        
        const { data, error } = await query
        
        if (error) throw error
        
        console.log("Raw data from database:", data)
        setDebugInfo(prev => ({ ...prev, rawData: data }))
        
        // Normalize status values to ensure consistency
        const normalizedData = data?.map(slot => ({
          ...slot,
          // Ensure status has proper capitalization and is not null
          status: slot.status ? normalizeStatus(slot.status) : "Available"
        })) || []
        
        setAllSlots(normalizedData)
      } catch (error) {
        console.error("Error fetching slots:", error)
        setDebugInfo(prev => ({ ...prev, error }))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlots()
  }, [vehicleTypeFilter])

  // Helper function to normalize status values
  const normalizeStatus = (status: string): string => {
    status = status.trim()
    
    // Map common variations to the exact values we want
    const statusMap: Record<string, string> = {
      "available": "Available",
      "occupied": "Occupied", 
      "under review": "Under Review",
      "underreview": "Under Review",
      "under_review": "Under Review"
    }
    
    return statusMap[status.toLowerCase()] || status
  }

  // Filter slots based on active tab
  const filteredSlots = allSlots.filter(slot => {
    if (activeTab === "all") return true;
    return slot.status === activeTab;
  })

  // Slot stats summary
  const slotStats = {
    total: allSlots.length,
    available: allSlots.filter(slot => slot.status === "Available").length,
    occupied: allSlots.filter(slot => slot.status === "Occupied").length,
    underReview: allSlots.filter(slot => slot.status === "Under Review").length,
  }

  async function handlePriceChange(slotId: string | number, newPrice: number) {
    try {
      const { data, error } = await supabase
        .from('parking_slots')
        .update({ 
          price_per_hour: newPrice, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', slotId)
        .select()
      
      if (error) throw error
      
      // Update the local state
      setAllSlots(allSlots.map(slot => 
        slot.id === slotId 
          ? { ...slot, price_per_hour: newPrice, updated_at: new Date().toISOString() }
          : slot
      ))
    } catch (error) {
      console.error("Error updating price:", error)
    }
  }

  // Also add function to update status if needed
  async function handleStatusChange(slotId: string | number, newStatus: string) {
    try {
      const { data, error } = await supabase
        .from('parking_slots')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', slotId)
        .select()
      
      if (error) throw error
      
      // Update the local state
      setAllSlots(allSlots.map(slot => 
        slot.id === slotId 
          ? { ...slot, status: newStatus, updated_at: new Date().toISOString() }
          : slot
      ))
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge className="bg-green-500">Available</Badge>
      case "Occupied":
        return <Badge className="bg-red-500">Occupied</Badge>
      case "Under Review":
        return <Badge className="bg-yellow-500">Under Review</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Parking Slots</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slotStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slotStats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slotStats.occupied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{slotStats.underReview}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Available">Available</TabsTrigger>
          <TabsTrigger value="Occupied">Occupied</TabsTrigger>
          <TabsTrigger value="Under Review">Under Review</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end my-4">
          <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Car">Car</SelectItem>
              <SelectItem value="Motorcycle">Motorcycle</SelectItem>
              <SelectItem value="Truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="mt-0">
          <SlotTable 
            slots={filteredSlots} 
            isLoading={isLoading} 
            handlePriceChange={handlePriceChange}
            handleStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="Available" className="mt-0">
          <SlotTable 
            slots={filteredSlots} 
            isLoading={isLoading} 
            handlePriceChange={handlePriceChange}
            handleStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="Occupied" className="mt-0">
          <SlotTable 
            slots={filteredSlots} 
            isLoading={isLoading} 
            handlePriceChange={handlePriceChange}
            handleStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="Under Review" className="mt-0">
          <SlotTable 
            slots={filteredSlots} 
            isLoading={isLoading} 
            handlePriceChange={handlePriceChange}
            handleStatusChange={handleStatusChange}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>
      
      {/* Debugging section - remove in production */}
      {process.env.NODE_ENV === 'development' && debugInfo && (
        <div className="mt-8 p-4 border rounded bg-slate-50">
          <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
          <p>Active Tab: {activeTab}</p>
          <p>Vehicle Filter: {vehicleTypeFilter}</p>
          <p>Total Slots: {allSlots.length}</p>
          <p>Filtered Slots: {filteredSlots.length}</p>
          <p>Status Counts: Available={slotStats.available}, Occupied={slotStats.occupied}, Under Review={slotStats.underReview}</p>
          {debugInfo.statusCheck && (
            <div>
              <p>Status Values in DB:</p>
              <pre>{JSON.stringify(debugInfo.statusCheck, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface SlotTableProps {
  slots: ParkingSlot[];
  isLoading: boolean;
  handlePriceChange: (slotId: string | number, newPrice: number) => Promise<void>;
  handleStatusChange: (slotId: string | number, newStatus: string) => Promise<void>;
  getStatusBadge: (status: string) => JSX.Element;
}

function SlotTable({ slots, isLoading, handlePriceChange, handleStatusChange, getStatusBadge }: SlotTableProps) {
  const [editingPrice, setEditingPrice] = useState<{id: string | number; price: string} | null>(null);
  const [editingStatus, setEditingStatus] = useState<{id: string | number; status: string} | null>(null);

  const startEditing = (slot: ParkingSlot) => {
    setEditingPrice({ id: slot.id, price: slot.price_per_hour.toString() });
  };

  const savePrice = async () => {
    if (editingPrice) {
      await handlePriceChange(editingPrice.id, parseFloat(editingPrice.price));
      setEditingPrice(null);
    }
  };

  const startEditingStatus = (slot: ParkingSlot) => {
    setEditingStatus({ id: slot.id, status: slot.status });
  };

  const saveStatus = async () => {
    if (editingStatus) {
      await handleStatusChange(editingStatus.id, editingStatus.status);
      setEditingStatus(null);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex justify-center p-8">Loading parking slots...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Price/Hour</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{slot.id}</TableCell>
                    <TableCell>{slot.name}</TableCell>
                    <TableCell>{slot.parking_sections?.name || 'N/A'}</TableCell>
                    <TableCell>{slot.vehicle_type}</TableCell>
                    <TableCell>
                      {editingPrice && editingPrice.id === slot.id ? (
                        <div className="flex items-center space-x-2">
                          <Input 
                            type="number" 
                            value={editingPrice.price}
                            onChange={(e) => setEditingPrice({...editingPrice, price: e.target.value})}
                            className="w-20"
                            step="0.01"
                          />
                          <Button size="sm" onClick={savePrice}>Save</Button>
                        </div>
                      ) : (
                        <>${slot.price_per_hour}</>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStatus && editingStatus.id === slot.id ? (
                        <div className="flex items-center space-x-2">
                          <Select 
                            value={editingStatus.status}
                            onValueChange={(value) => setEditingStatus({...editingStatus, status: value})}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue>{editingStatus.status}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Available">Available</SelectItem>
                              <SelectItem value="Occupied">Occupied</SelectItem>
                              <SelectItem value="Under Review">Under Review</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={saveStatus}>Save</Button>
                        </div>
                      ) : (
                        getStatusBadge(slot.status)
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEditing(slot)}
                        >
                          Edit Price
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEditingStatus(slot)}
                        >
                          Edit Status
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No parking slots found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}