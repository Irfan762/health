import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { machines } from "@/data/machines";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [purchase, setPurchase] = useState<any>(null);

  // Get machine details from purchase data or fallback to static data
  const machine = purchase ? 
    machines.find((m) => m.id === purchase.machineId) || {
      id: purchase.machineId,
      machineName: purchase.machineName,
      price: purchase.price,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80",
      type: "Medical Equipment",
      condition: "Good"
    } : null;

  useEffect(() => {
    const fetchPurchase = async () => {
      if (!user || !id) return;
      
      try {
        const token = localStorage.getItem('authToken');
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${API_BASE_URL}/purchases/my-purchases`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const purchases = await response.json();
          // Find the purchase by ID
          const foundPurchase = purchases.find((p: any) => p._id === id);
          
          if (!foundPurchase) {
            toast.error("Purchase not found");
            navigate("/machines");
            return;
          }
          setPurchase(foundPurchase);
        } else {
          throw new Error('Failed to fetch purchase');
        }
      } catch (error) {
        console.error("Error fetching purchase:", error);
        toast.error("Failed to load purchase details");
      }
    };

    fetchPurchase();
  }, [user, id, navigate]);

  if (!machine || !purchase) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/purchases/${purchase._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'confirmed',
          paymentStatus: 'paid' 
        }),
      });

      if (response.ok) {
        toast.success("Payment successful!");
        navigate(`/payment-success?orderId=${purchase._id}`);
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/machines")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Machines
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-muted-foreground">Review your order and proceed to payment</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex gap-6">
                <img
                  src={machine.image}
                  alt={machine.machineName}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{machine.machineName}</h2>
                  <p className="text-sm text-muted-foreground mb-1">{machine.type}</p>
                  <p className="text-sm text-muted-foreground">Condition: {machine.condition}</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Machine Price</span>
                  <span className="font-medium">₹{machine.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-medium">₹0</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">₹{machine.price.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure Payment</h3>
                    <p className="text-sm text-muted-foreground">Your payment information is encrypted</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay ₹${machine.price.toLocaleString()} Now`}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our terms and conditions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
