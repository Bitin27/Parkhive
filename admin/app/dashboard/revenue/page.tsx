// app/dashboard/reports/revenue/page.jsx
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
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface RevenueData {
  date: string;
  revenue: number;
  transactions: number;
  avgDuration: number;
}

interface ZoneRevenue {
  zoneName: string;
  revenue: number;
  percentage: number;
}

interface PaymentMethodData {
  method: string;
  revenue: number;
  percentage: number;
}

export default function RevenueReportPage() {
  const [timeRange, setTimeRange] = useState("week")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [zoneRevenue, setZoneRevenue] = useState<ZoneRevenue[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalBookings, setTotalBookings] = useState(0)
  const [averageRevenue, setAverageRevenue] = useState(0)

  useEffect(() => {
    // Adjust date range based on selection
    if (timeRange === "week") {
      setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      setEndDate(new Date())
    } else if (timeRange === "month") {
      setStartDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      setEndDate(new Date())
    } else if (timeRange === "year") {
      setStartDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))
      setEndDate(new Date())
    }
  }, [timeRange])

  useEffect(() => {
    if (startDate && endDate) {
      fetchRevenueData()
      fetchZoneRevenue()
      fetchPaymentMethods()
    }
  }, [startDate, endDate])

  async function fetchRevenueData() {
    try {
      setIsLoading(true)
      
      // Format dates for SQL query
      const start = startDate?.toISOString()
      const end = endDate?.toISOString()
      
      // Direct query for daily revenue data
      const { data, error } = await supabase
        .from('bookings')
        .select('created_at, total_amount, additional_charges')
        .gte('created_at', start)
        .lte('created_at', end)
        .not('total_amount', 'is', null)
      
      if (error) throw error
      
      // Process the raw data to get daily summaries
      const dailyData: Record<string, RevenueData> = {}
      
      data.forEach(booking => {
        const date = new Date(booking.created_at).toLocaleDateString()
        const amount = parseFloat(booking.total_amount || 0) + parseFloat(booking.additional_charges || 0)
        
        if (!dailyData[date]) {
          dailyData[date] = {
            date,
            revenue: amount,
            transactions: 1,
            avgDuration: 0 // Will calculate this separately
          }
        } else {
          dailyData[date].revenue += amount
          dailyData[date].transactions += 1
        }
      })
      
      // Calculate durations in a separate query for better performance
      const { data: durationData, error: durationError } = await supabase
        .from('bookings')
        .select('created_at, actual_end_time, estimated_end_time')
        .gte('created_at', start)
        .lte('created_at', end)
        .not('total_amount', 'is', null)
      
      if (durationError) throw durationError
      
      // Process duration data
      const dateDurations: Record<string, number[]> = {}
      
      durationData.forEach(booking => {
        const date = new Date(booking.created_at).toLocaleDateString()
        const endTime = booking.actual_end_time || booking.estimated_end_time
        
        if (endTime) {
          const durationHours = (new Date(endTime).getTime() - new Date(booking.created_at).getTime()) / (1000 * 60 * 60)
          
          if (!dateDurations[date]) {
            dateDurations[date] = [durationHours]
          } else {
            dateDurations[date].push(durationHours)
          }
        }
      })
      
      // Add durations to revenue data
      Object.keys(dateDurations).forEach(date => {
        if (dailyData[date]) {
          const durations = dateDurations[date]
          const avgDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length
          dailyData[date].avgDuration = avgDuration
        }
      })
      
      // Convert to array and sort by date
      const revenueArray = Object.values(dailyData).sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      // Calculate totals
      const total = revenueArray.reduce((sum, day) => sum + day.revenue, 0)
      const totalTransactions = revenueArray.reduce((sum, day) => sum + day.transactions, 0)
      
      setTotalRevenue(total)
      setTotalBookings(totalTransactions)
      setAverageRevenue(totalTransactions > 0 ? total / totalTransactions : 0)
      setRevenueData(revenueArray)
      
    } catch (error) {
      console.error("Error fetching revenue data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchZoneRevenue() {
    try {
      const start = startDate?.toISOString()
      const end = endDate?.toISOString()
      
      // Query for zone data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('zone_id, total_amount, additional_charges')
        .gte('created_at', start)
        .lte('created_at', end)
        .not('total_amount', 'is', null)
      
      if (bookingsError) throw bookingsError
      
      // Get zone names
      const { data: zonesData, error: zonesError } = await supabase
        .from('parkingzones')
        .select('id, name')
      
      if (zonesError) throw zonesError
      
      // Create a map of zone IDs to names
      const zoneNames: Record<string, string> = {}
      zonesData.forEach(zone => {
        zoneNames[zone.id] = zone.name
      })
      
      // Process the raw data to get zone revenue
      const zoneData: Record<string, { zoneName: string, revenue: number }> = {}
      
      bookingsData.forEach(booking => {
        const zoneId = booking.zone_id
        const zoneName = zoneNames[zoneId] || 'Unknown Zone'
        const amount = parseFloat(booking.total_amount || 0) + parseFloat(booking.additional_charges || 0)
        
        if (!zoneData[zoneId]) {
          zoneData[zoneId] = {
            zoneName,
            revenue: amount
          }
        } else {
          zoneData[zoneId].revenue += amount
        }
      })
      
      // Calculate total for percentages
      const totalZoneRevenue = Object.values(zoneData).reduce((sum, zone) => sum + zone.revenue, 0)
      
      // Convert to array with percentages
      const zoneArray = Object.values(zoneData).map(zone => ({
        ...zone,
        percentage: (zone.revenue / totalZoneRevenue) * 100
      }))
      
      // Sort by revenue
      zoneArray.sort((a, b) => b.revenue - a.revenue)
      
      setZoneRevenue(zoneArray)
      
    } catch (error) {
      console.error("Error fetching zone revenue:", error)
    }
  }

  async function fetchPaymentMethods() {
    try {
      const start = startDate?.toISOString()
      const end = endDate?.toISOString()
      
      // Direct query for payment method data
      const { data, error } = await supabase
        .from('bookings')
        .select('payment_method, total_amount, additional_charges')
        .gte('created_at', start)
        .lte('created_at', end)
        .not('total_amount', 'is', null)
      
      if (error) throw error
      
      // Process the raw data to get payment method revenue
      const paymentData: Record<string, { method: string, revenue: number }> = {}
      
      data.forEach(booking => {
        const method = booking.payment_method || 'Unknown'
        const amount = parseFloat(booking.total_amount || 0) + parseFloat(booking.additional_charges || 0)
        
        if (!paymentData[method]) {
          paymentData[method] = {
            method,
            revenue: amount
          }
        } else {
          paymentData[method].revenue += amount
        }
      })
      
      // Calculate total for percentages
      const totalPaymentRevenue = Object.values(paymentData).reduce((sum, payment) => sum + payment.revenue, 0)
      
      // Convert to array with percentages
      const paymentArray = Object.values(paymentData).map(payment => ({
        ...payment,
        percentage: (payment.revenue / totalPaymentRevenue) * 100
      }))
      
      // Sort by revenue
      paymentArray.sort((a, b) => b.revenue - a.revenue)
      
      setPaymentMethods(paymentArray)
      
    } catch (error) {
      console.error("Error fetching payment methods:", error)
    }
  }

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Revenue Report</h1>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 365 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          {timeRange === "custom" && (
            <div className="flex items-center space-x-2">
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                placeholderText="Start date"
              />
              <span>to</span>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                placeholderText="End date"
              />
            </div>
          )}
        </div>
      </div>

      {/* Revenue Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Average: ${averageRevenue.toFixed(2)} per booking
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / (revenueData.length || 1)).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {revenueData.length} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different charts */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Daily Revenue</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue</CardTitle>
              <CardDescription>
                Revenue trend from {startDate?.toLocaleDateString()} to {endDate?.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">Loading data...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                      <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Daily Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Avg Duration (hours)</TableHead>
                      <TableHead>Avg Revenue per Booking</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.map((day, i) => (
                      <TableRow key={i}>
                        <TableCell>{day.date}</TableCell>
                        <TableCell>${day.revenue.toFixed(2)}</TableCell>
                        <TableCell>{day.transactions}</TableCell>
                        <TableCell>{day.avgDuration.toFixed(2)}</TableCell>
                        <TableCell>
                          ${(day.revenue / day.transactions).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="zones" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Parking Zone</CardTitle>
                <CardDescription>
                  Distribution of revenue across different parking zones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={zoneRevenue}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                        nameKey="zoneName"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {zoneRevenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Zone Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zoneRevenue.map((zone, i) => (
                      <TableRow key={i}>
                        <TableCell>{zone.zoneName}</TableCell>
                        <TableCell>${zone.revenue.toFixed(2)}</TableCell>
                        <TableCell>{zone.percentage.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payment" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payment Method</CardTitle>
                <CardDescription>
                  Distribution of revenue across different payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethods}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                        nameKey="method"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method, i) => (
                      <TableRow key={i}>
                        <TableCell>{method.method}</TableCell>
                        <TableCell>${method.revenue.toFixed(2)}</TableCell>
                        <TableCell>{method.percentage.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}