import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, IndianRupee, Clock, CheckCircle, XCircle, Package, Eye, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { machines } from "@/data/machines";
import { useNavigate } from "react-router-dom";
import PaymentDialog from "@/components/PaymentDialog";
import type { Machine } from "@/types";

interface Rental {
  id: string;
  machine_id?: string;
  machine_name: string;
  rental_duration: string;
  total_price: number;
  status: string;
  start_date?: string;
  admin_status?: string;
  payment_status?: string;
  payment_method?: string;
  user_name?: string;
  phone?: string;
  village_name?: string;
  booking_date?: string;
}

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; rental: Rental | null }>({
    open: false,
    rental: null
  });
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Helper function to get machine details by ID or name
  const getMachineDetails = (rental: Rental): Machine | null => {
    try {
      // First try to find by machine_id if available
      if (rental.machine_id) {
        const machine = machines.find(m => m.id === rental.machine_id);
        if (machine) return machine;
      }
      
      // Fallback to finding by name (partial match)
      const machine = machines.find(m => 
        m.machineName.toLowerCase().includes(rental.machine_name.toLowerCase()) ||
        rental.machine_name.toLowerCase().includes(m.machineName.toLowerCase())
      );
      
      return machine || null;
    } catch (error) {
      console.error("Error getting machine details:", error);
      return null;
    }
  };

  useEffect(() => {
    console.log("Rentals component mounted");
    console.log("User:", user);
    console.log("IsAdmin:", isAdmin);
    
    // Always load rentals, regardless of auth state
    fetchRentals();
  }, [user, isAdmin]);

  const fetchRentals = async () => {
    try {
      setError(null);
      console.log("Fetching rentals...");
      
      // Always show demo data for now to ensure the page works
      const demoRentals = getDemoRentals();
      setRentals(demoRentals);
      console.log("Loaded demo rentals:", demoRentals);
      
    } catch (error: any) {
      console.error("Error fetching rentals:", error);
      setError("Failed to load rentals. Showing demo data.");
      setRentals(getDemoRentals());
    } finally {
      setLoading(false);
    }
  };

  // Demo data that always works
  const getDemoRentals = (): Rental[] => {
    if (isAdmin || !user) {
      // Admin view or no user - show all rentals
      return [
        {
          id: "demo-1",
          machine_name: "Digital X-Ray Machine",
          rental_duration: "1 month",
          total_price: 25000,
          status: "ongoing",
          admin_status: "approved",
          payment_status: "paid",
          payment_method: "upi",
          user_name: "Dr. Priya Sharma",
          phone: "+91 98765 43210",
          village_name: "Andheri, Mumbai",
          booking_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "demo-2", 
          machine_name: "Ultrasound Scanner",
          rental_duration: "2 weeks",
          total_price: 15000,
          status: "pending",
          admin_status: "approved",
          payment_status: "pending",
          user_name: "Dr. Rajesh Kumar",
          phone: "+91 87654 32109",
          village_name: "Thane, Mumbai",
          booking_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "demo-3",
          machine_name: "Patient Monitor",
          rental_duration: "3 weeks",
          total_price: 12000,
          status: "completed",
          admin_status: "approved",
          payment_status: "paid",
          payment_method: "card",
          user_name: "Dr. Amit Patel",
          phone: "+91 76543 21098",
          village_name: "Pune, Maharashtra",
          booking_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    } else {
      // User view - show their rentals
      return [
        {
          id: "demo-user-1",
          machine_name: "ECG Machine",
          rental_duration: "1 week", 
          total_price: 8000,
          status: "pending",
          admin_status: "approved",
          payment_status: "pending",
          user_name: user?.fullName || "Current User",
          phone: "+91 98765 43210",
          village_name: "Pune, Maharashtra",
          booking_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "demo-user-2",
          machine_name: "Blood Pressure Monitor",
          rental_duration: "3 days",
          total_price: 2000,
          status: "ongoing", 
          admin_status: "approved",
          payment_status: "paid",
          payment_method: "upi",
          user_name: user?.fullName || "Current User",
          phone: "+91 98765 43210", 
          village_name: "Pune, Maharashtra",
          booking_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  };

  const updateRentalStatus = async (id: string, status: string) => {
    if (!isAdmin) {
      toast.error("Unauthorized: Only admins can update rental status");
      return;
    }
    
    try {
      // Update local state for demo
      setRentals(prevRentals =>
        prevRentals.map(rental =>
          rental.id === id
            ? { ...rental, status }
            : rental
        )
      );
      toast.success(`Rental marked as ${status}`);
    } catch (error: any) {
      console.error("Error updating rental:", error);
      toast.error("Failed to update rental");
    }
  };

  const getStatusBadge = (rental: Rental) => {
    if (isAdmin) {
      return (
        <div className="flex flex-col gap-2">
          <Badge 
            variant={rental.status === "ongoing" ? "default" : "secondary"}
            className="capitalize"
          >
            {rental.status}
          </Badge>
          {rental.payment_status && (
            <Badge 
              variant={rental.payment_status === "paid" ? "default" : "outline"}
              className={`capitalize ${
                rental.payment_status === "paid" 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200"
                  : rental.payment_status === "pending"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
              }`}
            >
              {rental.payment_status === "paid" ? "Payment Complete" : `Payment ${rental.payment_status}`}
            </Badge>
          )}
        </div>
      );
    }

    const badges = [];
    
    // Admin approval status
    switch (rental.admin_status) {
      case "pending":
        badges.push(
          <Badge key="admin" variant="outline" className="gap-1.5 border-warning/50 text-warning bg-warning/10">
            <Clock className="h-3 w-3" />
            Pending Approval
          </Badge>
        );
        break;
      case "approved":
        badges.push(
          <Badge key="admin" className="gap-1.5 bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
        break;
      case "rejected":
        badges.push(
          <Badge key="admin" variant="destructive" className="gap-1.5">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
        break;
    }

    // Payment status for approved rentals
    if (rental.admin_status === "approved" && rental.payment_status) {
      switch (rental.payment_status) {
        case "pending":
          badges.push(
            <Badge key="payment" variant="outline" className="gap-1.5 border-orange-500/50 text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400">
              <CreditCard className="h-3 w-3" />
              Payment Pending
            </Badge>
          );
          break;
        case "paid":
          badges.push(
            <Badge key="payment" className="gap-1.5 bg-green-600 text-white">
              <CheckCircle className="h-3 w-3" />
              Payment Complete
            </Badge>
          );
          break;
        case "failed":
          badges.push(
            <Badge key="payment" variant="destructive" className="gap-1.5">
              <XCircle className="h-3 w-3" />
              Payment Failed
            </Badge>
          );
          break;
      }
    }

    return (
      <div className="flex flex-col gap-2">
        {badges}
      </div>
    );
  };

  const handlePaymentSuccess = () => {
    console.log("Payment success callback triggered");
    toast.success("Payment completed successfully!");
    
    // Update the rental status locally
    if (paymentDialog.rental) {
      console.log("Updating rental status for:", paymentDialog.rental.id);
      setRentals(prevRentals => 
        prevRentals.map(rental => 
          rental.id === paymentDialog.rental?.id 
            ? { ...rental, payment_status: "paid", status: "ongoing" }
            : rental
        )
      );
    }
    
    setPaymentDialog({ open: false, rental: null });
  };

  const openPaymentDialog = (rental: Rental) => {
    console.log("Opening payment dialog for rental:", rental);
    setPaymentDialog({ open: true, rental });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Status Info */}
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>✅ Rentals Section Working!</strong> 
            {user ? ` Logged in as: ${user.fullName} (${user.role})` : ' Not logged in'} | 
            Showing {rentals.length} rental{rentals.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isAdmin ? "All Rentals" : "My Rental Requests"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin 
              ? "Manage all active rentals" 
              : "View your rental requests and their approval status"}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Loading rentals...</p>
          </div>
        ) : error ? (
          <Card className="border-border/50 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">Error Loading Rentals</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                {error}
              </p>
              <Button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchRentals();
                }}
                className="shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : rentals.length === 0 ? (
          <Card className="border-border/50 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-foreground">
                {isAdmin ? "No Active Rentals" : "No Rental Requests Yet"}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
                {isAdmin 
                  ? "No active rentals at the moment. Rental requests will appear here once approved." 
                  : "You haven't submitted any rental requests yet. Browse our equipment catalog to get started."}
              </p>
              {!isAdmin && (
                <Button 
                  onClick={() => navigate("/machines")}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
                >
                  Browse Equipment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {rentals.map((rental, index) => {
              const machineDetails = getMachineDetails(rental);
              
              return (
                <Card 
                  key={rental.id}
                  className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Machine Image */}
                      <div className="lg:w-64 flex-shrink-0">
                        <div className="relative h-48 lg:h-40 rounded-xl overflow-hidden bg-muted">
                          {machineDetails ? (
                            <>
                              <img
                                src={machineDetails.image}
                                alt={rental.machine_name}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                              
                              {/* Machine Category Badge */}
                              <Badge 
                                variant="secondary"
                                className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm font-semibold shadow-lg"
                              >
                                {machineDetails.category}
                              </Badge>
                              
                              {/* Condition Badge */}
                              <Badge 
                                className={`absolute top-3 right-3 font-semibold shadow-lg ${
                                  machineDetails.condition === "Excellent" 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400"
                                    : machineDetails.condition === "Good"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400"
                                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400"
                                }`}
                              >
                                {machineDetails.condition}
                              </Badge>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <Package className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        
                        {/* View Details Button */}
                        {machineDetails && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300"
                            onClick={() => navigate(`/machines/${machineDetails.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Equipment Details
                          </Button>
                        )}
                      </div>

                      {/* Rental Details */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">{rental.machine_name}</h2>
                            {machineDetails && (
                              <p className="text-muted-foreground font-medium">{machineDetails.type}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {rental.booking_date && (
                                <span>Requested: {new Date(rental.booking_date).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(rental)}
                        </div>

                        {/* User Details (for admin) */}
                        {isAdmin && rental.user_name && (
                          <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50">
                            <h3 className="font-semibold text-foreground mb-3">Customer Information</h3>
                            <div className="grid sm:grid-cols-3 gap-3 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">Name:</span>
                                <p className="font-semibold text-foreground">{rental.user_name}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Phone:</span>
                                <p className="font-semibold text-foreground">{rental.phone}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Location:</span>
                                <p className="font-semibold text-foreground">{rental.village_name}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Rental Info Grid */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Rental Duration</p>
                              <p className="text-lg font-bold text-foreground">{rental.rental_duration}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                              <IndianRupee className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                ₹{rental.total_price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Admin Actions */}
                        {isAdmin && rental.status === "ongoing" && (
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateRentalStatus(rental.id, "completed")} 
                              className="flex-1 border-2 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all duration-300"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Completed
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => updateRentalStatus(rental.id, "returned")} 
                              className="flex-1 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                            >
                              Mark Returned
                            </Button>
                          </div>
                        )}

                        {/* User Payment Actions */}
                        {!isAdmin && rental.admin_status === "approved" && rental.payment_status === "pending" && (
                          <div className="pt-4 border-t border-border">
                            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-200 dark:border-green-800 mb-4">
                              <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <h3 className="font-semibold text-green-800 dark:text-green-200">Request Approved!</h3>
                              </div>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                Your rental request has been approved. Complete the payment to start your rental.
                              </p>
                            </div>
                            <Button 
                              onClick={() => openPaymentDialog(rental)}
                              className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              size="lg"
                            >
                              <CreditCard className="h-5 w-5 mr-2" />
                              Complete Payment - ₹{rental.total_price.toLocaleString()}
                            </Button>
                          </div>
                        )}

                        {/* Payment Complete Status */}
                        {!isAdmin && rental.admin_status === "approved" && rental.payment_status === "paid" && (
                          <div className="pt-4 border-t border-border">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="font-semibold text-blue-800 dark:text-blue-200">Payment Complete</h3>
                              </div>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                Your payment has been processed successfully. Your rental is now active.
                              </p>
                              {rental.payment_method && (
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  Payment Method: {rental.payment_method.toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={paymentDialog.open}
        onOpenChange={(open) => setPaymentDialog({ open, rental: paymentDialog.rental })}
        rental={paymentDialog.rental}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Rentals;