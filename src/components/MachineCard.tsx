import { Machine } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Calendar, Eye, IndianRupee, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface MachineCardProps {
  machine: Machine;
}

const MachineCard = ({ machine }: MachineCardProps) => {
  const navigate = useNavigate();

  const getConditionStyles = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800";
      case "Good":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800";
      case "Fair":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return <Award className="h-3 w-3" />;
      case "Good":
        return <Star className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="group overflow-hidden border-border/50 hover-lift bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-muted">
        <img
          src={machine.image}
          alt={machine.machineName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Unavailable overlay */}
        {!machine.availability && (
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="secondary" className="text-base px-6 py-2 font-semibold">
              Currently Unavailable
            </Badge>
          </div>
        )}
        
        {/* Condition badge */}
        <Badge 
          className={cn(
            "absolute top-4 right-4 border font-semibold gap-1.5 shadow-lg",
            getConditionStyles(machine.condition)
          )}
        >
          {getConditionIcon(machine.condition)}
          {machine.condition}
        </Badge>

        {/* Category badge */}
        <Badge 
          variant="secondary"
          className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm font-semibold shadow-lg"
        >
          {machine.category}
        </Badge>

        {/* Quick action overlay */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            onClick={() => navigate(`/machines/${machine.id}`)}
            className="w-full bg-white/90 text-gray-900 hover:bg-white font-semibold shadow-lg"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {machine.machineName}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">{machine.type}</p>
        </div>
      </CardHeader>

      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
          {machine.description}
        </p>
        
        {/* Pricing */}
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Purchase Price</span>
              <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                <IndianRupee className="h-5 w-5" />
                <span>{machine.price.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rental from</span>
              <span className="font-semibold text-secondary">₹{machine.rentalPricing.perDay}/day</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4 border-t border-border/50">
        {machine.availability ? (
          <>
            <Button
              size="sm"
              className="flex-1 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
              onClick={() => navigate(`/machines/${machine.id}?action=buy`)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-4 border-2 hover:bg-secondary/10 hover:border-secondary transition-all duration-300"
              onClick={() => navigate(`/machines/${machine.id}?action=rent`)}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/machines/${machine.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MachineCard;
