import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CreditCard, Smartphone, Banknote, Building2, IndianRupee, CheckCircle, Clock } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rental: any;
  onPaymentSuccess: () => void;
}

const PaymentDialog = ({ open, onOpenChange, rental, onPaymentSuccess }: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: "",
    upiId: "",
    cardLast4: "",
    notes: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Don't render if rental is null
  if (!rental) {
    return null;
  }

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI Payment",
      icon: Smartphone,
      description: "Pay using UPI apps like PhonePe, GPay, Paytm",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay using your credit or debit card",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building2,
      description: "Direct bank transfer or NEFT/RTGS",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      id: "cash",
      name: "Cash Payment",
      icon: Banknote,
      description: "Pay in cash during equipment delivery",
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
    }
  ];

  const handlePayment = async () => {
    console.log("Payment button clicked - processing with backend");
    console.log("Rental data:", rental);
    console.log("Payment method:", paymentMethod);
    
    if (!rental) {
      toast.error("Rental data not found");
      return;
    }

    // Validate required fields based on payment method
    if (paymentMethod === "upi" && (!paymentDetails.upiId || !paymentDetails.transactionId)) {
      toast.error("Please enter UPI ID and Transaction ID");
      return;
    }
    
    if (paymentMethod === "card" && (!paymentDetails.cardLast4 || !paymentDetails.transactionId)) {
      toast.error("Please enter card details and Transaction ID");
      return;
    }
    
    if (paymentMethod === "bank_transfer" && !paymentDetails.transactionId) {
      toast.error("Please enter Transaction ID");
      return;
    }

    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const paymentData = {
        paymentMethod,
        paymentAmount: rental?.total_price || 0,
        transactionId: paymentDetails.transactionId || `${paymentMethod.toUpperCase()}_${Date.now()}`,
        upiId: paymentDetails.upiId,
        cardLast4: paymentDetails.cardLast4,
        notes: paymentDetails.notes
      };

      console.log("Sending payment data to backend:", paymentData);

      const response = await fetch(`${API_BASE_URL}/rentals/${rental?.id}/payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment processing failed');
      }

      const result = await response.json();
      console.log("Payment response:", result);
      
      toast.success("Payment processed successfully!");
      
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      }
      
      console.log("Payment process completed");
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            Complete Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rental Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Rental Summary</h3>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approved
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Equipment</p>
                  <p className="font-semibold">{rental?.machine_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-semibold">{rental?.rental_duration || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Customer</p>
                  <p className="font-semibold">{rental?.user_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹{rental?.total_price?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Select Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="relative">
                      <RadioGroupItem
                        value={method.id}
                        id={method.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={method.id}
                        className="flex flex-col p-4 border-2 border-muted rounded-xl cursor-pointer hover:border-primary peer-checked:border-primary peer-checked:bg-primary/5 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${method.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Payment Details Form */}
          {selectedMethod && (
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <selectedMethod.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{selectedMethod.name} Details</h3>
                </div>

                <div className="space-y-4">
                  {paymentMethod === "upi" && (
                    <>
                      <div className="space-y-2">
                        <Label>UPI ID *</Label>
                        <Input
                          placeholder="yourname@paytm / yourname@phonepe"
                          value={paymentDetails.upiId}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Transaction ID *</Label>
                        <Input
                          placeholder="Enter UPI transaction ID after payment"
                          value={paymentDetails.transactionId}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                        />
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Payment Instructions:</strong><br />
                          1. Open your UPI app (PhonePe, GPay, Paytm)<br />
                          2. Send ₹{rental?.total_price?.toLocaleString() || '0'} to our UPI ID: <strong>mediequip@paytm</strong><br />
                          3. Enter the transaction ID above after successful payment
                        </p>
                      </div>
                    </>
                  )}

                  {paymentMethod === "card" && (
                    <>
                      <div className="space-y-2">
                        <Label>Last 4 digits of Card *</Label>
                        <Input
                          placeholder="1234"
                          maxLength={4}
                          value={paymentDetails.cardLast4}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cardLast4: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Transaction ID *</Label>
                        <Input
                          placeholder="Enter transaction ID from your bank statement"
                          value={paymentDetails.transactionId}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                        />
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Payment Instructions:</strong><br />
                          1. Use our secure payment gateway<br />
                          2. Enter card details and complete payment<br />
                          3. Note down the transaction ID for reference
                        </p>
                      </div>
                    </>
                  )}

                  {paymentMethod === "bank_transfer" && (
                    <>
                      <div className="space-y-2">
                        <Label>Transaction ID *</Label>
                        <Input
                          placeholder="Enter NEFT/RTGS reference number"
                          value={paymentDetails.transactionId}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                        />
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Bank Details:</strong><br />
                          Account Name: MediEquip Solutions<br />
                          Account Number: 1234567890<br />
                          IFSC Code: HDFC0001234<br />
                          Bank: HDFC Bank, Andheri Branch
                        </p>
                      </div>
                    </>
                  )}

                  {paymentMethod === "cash" && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        <strong>Cash Payment:</strong><br />
                        You can pay ₹{rental?.total_price?.toLocaleString() || '0'} in cash when our team delivers the equipment to your location. 
                        Please keep the exact amount ready.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Additional Notes (Optional)</Label>
                    <Textarea
                      placeholder="Any additional information about the payment"
                      value={paymentDetails.notes}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Payment
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;