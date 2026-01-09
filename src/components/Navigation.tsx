import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Activity, Home, Package, Calendar, Settings, LogOut, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/machines", label: "Machines", icon: Package },
    // Only show Rentals link for clinic users, not admin users
    ...(userRole !== "admin" ? [{ to: "/rentals", label: "Rentals", icon: Calendar }] : []),
    ...(userRole === "admin" ? [{ to: "/admin", label: "Admin", icon: Settings }] : []),
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => mobile && setMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
              mobile ? "w-full justify-start" : "",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "text-primary-foreground")} />
            <span>{link.label}</span>
            {isActive && !mobile && (
              <div className="ml-auto w-2 h-2 rounded-full bg-primary-foreground" />
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 font-bold text-xl group transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-foreground text-2xl">
              Medi<span className="text-primary font-extrabold">Equip</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-full">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">Welcome back!</p>
                    <p className="text-xs text-muted-foreground">
                      {userRole === "admin" ? "Administrator" : "Healthcare Provider"}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-border/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-4 py-6 space-y-4">
          <NavLinks mobile />
          
          <div className="pt-6 mt-6 border-t border-border">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Welcome back!</p>
                    <p className="text-sm text-muted-foreground">
                      {userRole === "admin" ? "Administrator" : "Healthcare Provider"}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full gap-2 text-muted-foreground hover:text-destructive justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  className="w-full shadow-lg bg-gradient-to-r from-primary to-primary/90"
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
