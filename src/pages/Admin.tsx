import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { machines as initialMachines } from "@/data/machines";
import { Machine } from "@/types";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Package, CheckCircle, XCircle, Clock, Eye, User, Phone, MapPin, Calendar, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [rentalRequests, setRentalRequests] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Machine>>({
    machineName: "",
    type: "",
    category: "",
    condition: "Good",
    description: "",
    price: 0,
    image: "",
    availability: true,
    repairHistory: [],
    sparePartsReplaced: [],
    warrantyInfo: "",
    rentalPricing: { perDay: 0, perWeek: 0, perMonth: 0 },
  });

  // Helper function to get machine details by ID or name
  const getMachineDetails = (request: any) => {
    if (request.machine_id) {
      const machine = machines.find(m => m.id === request.machine_id);
      if (machine) return machine;
    }
    
    const machine = machines.find(m => 
      m.machineName.toLowerCase().includes(request.machine_name.toLowerCase()) ||
      request.machine_name.toLowerCase().includes(m.machineName.toLowerCase())
    );
    
    return machine || null;
  };

  // Fetch rental requests and purchases
  useEffect(() => {
    fetchRentalRequests();
    fetchPurchases();
  }, []);

  const fetchRentalRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/rentals/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched rental requests:", data);
        
        // Transform backend data to match frontend expectations
        const transformedData = data.map((request: any) => ({
          ...request,
          id: request._id,
          admin_status: request.adminStatus,
          payment_status: request.paymentStatus,
          payment_method: request.paymentMethod,
          user_name: request.userName,
          machine_name: request.machineName,
          rental_duration: request.rentalDuration,
          total_price: request.totalPrice,
          village_name: request.villageName,
          created_at: request.createdAt
        }));
        
        setRentalRequests(transformedData || []);
      } else {
        console.error("Failed to fetch rental requests:", response.status);
      }
    } catch (error) {
      console.error("Error fetching rental requests:", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/rentals/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminStatus: 'approved' }),
      });

      if (response.ok) {
        toast.success("Request approved");
        fetchRentalRequests();
      } else {
        throw new Error('Failed to approve request');
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/rentals/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminStatus: 'rejected' }),
      });

      if (response.ok) {
        toast.success("Request rejected");
        fetchRentalRequests();
      } else {
        throw new Error('Failed to reject request');
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("adminMachines");
    if (stored) {
      setMachines(JSON.parse(stored));
    }
  }, []);

  const saveMachines = (updatedMachines: Machine[]) => {
    setMachines(updatedMachines);
    localStorage.setItem("adminMachines", JSON.stringify(updatedMachines));
  };

  const handleSubmit = () => {
    if (!formData.machineName || !formData.type || !formData.category || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingMachine) {
      const updatedMachines = machines.map((m) =>
        m.id === editingMachine.id ? { ...formData, id: editingMachine.id } as Machine : m
      );
      saveMachines(updatedMachines);
      toast.success("Machine updated successfully");
    } else {
      const newMachine: Machine = {
        ...formData,
        id: Date.now().toString(),
        repairHistory: formData.repairHistory || [],
        sparePartsReplaced: formData.sparePartsReplaced || [],
      } as Machine;
      saveMachines([...machines, newMachine]);
      toast.success("Machine added successfully");
    }

    setShowDialog(false);
    resetForm();
  };

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setFormData(machine);
    setShowDialog(true);
  };

  const handleDelete = (id: string) => {
    const updatedMachines = machines.filter((m) => m.id !== id);
    saveMachines(updatedMachines);
    toast.success("Machine deleted successfully");
  };

  const resetForm = () => {
    setEditingMachine(null);
    setFormData({
      machineName: "",
      type: "",
      category: "",
      condition: "Good",
      description: "",
      price: 0,
      image: "",
      availability: true,
      repairHistory: [],
      sparePartsReplaced: [],
      warrantyInfo: "",
      rentalPricing: { perDay: 0, perWeek: 0, perMonth: 0 },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Manage your medical equipment platform</p>
          </div>
        </div>

        <Tabs defaultValue="machines" className="space-y-6">
          <TabsList>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="rental-requests">Rental Requests</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
          </TabsList>

          <TabsContent value="machines" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => { resetForm(); setShowDialog(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Machine
              </Button>
            </div>

            <div className="grid gap-4">
          {machines.map((machine) => (
            <Card key={machine.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <img
                    src={machine.image}
                    alt={machine.machineName}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{machine.machineName}</h3>
                        <p className="text-sm text-muted-foreground">{machine.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={machine.availability ? "default" : "secondary"}>
                          {machine.availability ? "Available" : "Unavailable"}
                        </Badge>
                        <Badge className={
                          machine.condition === "Excellent" ? "bg-success" :
                          machine.condition === "Good" ? "bg-primary" : "bg-secondary"
                        }>
                          {machine.condition}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{machine.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-4 text-sm">
                        <span className="font-medium">Price: ₹{machine.price.toLocaleString()}</span>
                        <span className="text-muted-foreground">
                          Rental: ₹{machine.rentalPricing.perDay}/day
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(machine)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(machine.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          </TabsContent>

          <TabsContent value="rental-requests" className="space-y-6">
            {/* Pending Requests Section */}
            <Card className="shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    Pending Rental Requests
                  </CardTitle>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {rentalRequests.filter(r => r.admin_status === "pending").length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {rentalRequests.filter(r => r.admin_status === "pending").length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
                    <p className="text-muted-foreground">All rental requests have been processed.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {rentalRequests.filter(r => r.admin_status === "pending").map((request) => {
                      const machineDetails = getMachineDetails(request);
                      
                      return (
                        <Card key={request.id} className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Machine Image */}
                              <div className="lg:w-48 flex-shrink-0">
                                <div className="relative h-36 rounded-xl overflow-hidden bg-muted">
                                  {machineDetails ? (
                                    <>
                                      <img
                                        src={machineDetails.image}
                                        alt={request.machine_name}
                                        className="w-full h-full object-cover"
                                      />
                                      <Badge 
                                        className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white"
                                      >
                                        {machineDetails.condition}
                                      </Badge>
                                    </>
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                {machineDetails && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2 text-xs"
                                    onClick={() => navigate(`/machines/${machineDetails.id}`)}
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Details
                                  </Button>
                                )}
                              </div>

                              {/* Request Details */}
                              <div className="flex-1 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-1">{request.machine_name}</h3>
                                    {machineDetails && (
                                      <p className="text-muted-foreground font-medium">{machineDetails.type}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Requested: {new Date(request.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 gap-1.5 text-base px-3 py-1">
                                    <Clock className="h-4 w-4" />
                                    Pending Review
                                  </Badge>
                                </div>

                                {/* Customer Information */}
                                <div className="grid sm:grid-cols-3 gap-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                      <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Customer</p>
                                      <p className="font-semibold">{request.user_name}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                                      <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Phone</p>
                                      <p className="font-semibold">{request.phone}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                                      <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Location</p>
                                      <p className="font-semibold">{request.village_name}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Rental Details */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-xl">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                      <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                      <p className="text-xl font-bold text-foreground">{request.rental_duration}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                      <IndianRupee className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        ₹{request.total_price.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                                  <Button 
                                    size="lg" 
                                    onClick={() => handleApproveRequest(request.id)}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                  >
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Approve Request
                                  </Button>
                                  <Button 
                                    size="lg" 
                                    variant="destructive"
                                    onClick={() => handleRejectRequest(request.id)}
                                    className="flex-1 shadow-lg hover:shadow-xl transition-all duration-300"
                                  >
                                    <XCircle className="h-5 w-5 mr-2" />
                                    Reject Request
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approved Requests Awaiting Payment */}
            <Card className="shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <IndianRupee className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Approved - Awaiting Payment
                  </CardTitle>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {rentalRequests.filter(r => r.admin_status === "approved" && (!r.payment_status || r.payment_status === "pending")).length} Awaiting Payment
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {rentalRequests.filter(r => r.admin_status === "approved" && (!r.payment_status || r.payment_status === "pending")).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">All Payments Complete</h3>
                    <p className="text-muted-foreground">No approved requests are awaiting payment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rentalRequests.filter(r => r.admin_status === "approved" && (!r.payment_status || r.payment_status === "pending")).map((request) => {
                      const machineDetails = getMachineDetails(request);
                      
                      return (
                        <Card key={request.id} className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Small Machine Image */}
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {machineDetails ? (
                                  <img
                                    src={machineDetails.image}
                                    alt={request.machine_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-bold text-lg">{request.machine_name}</h3>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <p>Customer: {request.user_name} • Duration: {request.rental_duration}</p>
                                      <p>Total: ₹{request.total_price.toLocaleString()} • Approved: {new Date(request.created_at).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </Badge>
                                    <Badge variant="outline" className="border-orange-500/50 text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Payment Pending
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Paid Rentals - Active */}
            <Card className="shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    Active Rentals (Paid)
                  </CardTitle>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {rentalRequests.filter(r => r.admin_status === "approved" && r.payment_status === "paid").length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {rentalRequests.filter(r => r.admin_status === "approved" && r.payment_status === "paid").length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Active Rentals</h3>
                    <p className="text-muted-foreground">No paid rentals are currently active.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rentalRequests.filter(r => r.admin_status === "approved" && r.payment_status === "paid").map((request) => {
                      const machineDetails = getMachineDetails(request);
                      
                      return (
                        <Card key={request.id} className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Small Machine Image */}
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {machineDetails ? (
                                  <img
                                    src={machineDetails.image}
                                    alt={request.machine_name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-bold text-lg">{request.machine_name}</h3>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <p>Customer: {request.user_name} • Duration: {request.rental_duration}</p>
                                      <p>Total: ₹{request.total_price.toLocaleString()} • Payment: {request.payment_method?.toUpperCase() || "N/A"}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Active Rental
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                                      <IndianRupee className="h-3 w-3 mr-1" />
                                      Payment Complete
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Requests History */}
            <Card className="shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  All Requests History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rentalRequests.map((request) => {
                    const machineDetails = getMachineDetails(request);
                    
                    return (
                      <Card key={request.id} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Small Machine Image */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              {machineDetails ? (
                                <img
                                  src={machineDetails.image}
                                  alt={request.machine_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-lg">{request.machine_name}</h3>
                                  <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Customer: {request.user_name} • Duration: {request.rental_duration}</p>
                                    <p>Total: ₹{request.total_price.toLocaleString()} • {new Date(request.created_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <Badge variant={
                                  request.admin_status === "approved" ? "default" :
                                  request.admin_status === "rejected" ? "destructive" : "secondary"
                                } className="capitalize">
                                  {request.admin_status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                {purchases.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No purchases yet</p>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <Card key={purchase.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-bold text-lg">{purchase.machine_name}</h3>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>Price: ₹{purchase.price.toLocaleString()}</p>
                                <p>Date: {new Date(purchase.created_at).toLocaleDateString()}</p>
                                <Badge>{purchase.status}</Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMachine ? "Edit Machine" : "Add New Machine"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Machine Name *</Label>
                <Input
                  value={formData.machineName}
                  onChange={(e) => setFormData({ ...formData, machineName: e.target.value })}
                  placeholder="e.g., Digital X-Ray Machine"
                />
              </div>
              <div className="space-y-2">
                <Label>Type *</Label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Imaging Equipment"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Radiology"
                />
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value: any) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the machine"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Purchase Price (₹)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rental Pricing (₹)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="Per Day"
                  value={formData.rentalPricing?.perDay}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentalPricing: { ...formData.rentalPricing!, perDay: parseInt(e.target.value) || 0 },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Per Week"
                  value={formData.rentalPricing?.perWeek}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentalPricing: { ...formData.rentalPricing!, perWeek: parseInt(e.target.value) || 0 },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Per Month"
                  value={formData.rentalPricing?.perMonth}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentalPricing: { ...formData.rentalPricing!, perMonth: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Warranty Info</Label>
              <Input
                value={formData.warrantyInfo}
                onChange={(e) => setFormData({ ...formData, warrantyInfo: e.target.value })}
                placeholder="e.g., 12 months comprehensive warranty"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="availability"
                checked={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="availability">Available for purchase/rent</Label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {editingMachine ? "Update Machine" : "Add Machine"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
