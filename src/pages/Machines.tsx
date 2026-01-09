import { useState, useMemo } from "react";
import Navigation from "@/components/Navigation";
import MachineCard from "@/components/MachineCard";
import { machines } from "@/data/machines";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const Machines = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 70000]);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = ["all", ...Array.from(new Set(machines.map((m) => m.category)))];
  const conditions = ["all", "Excellent", "Good", "Fair"];

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const matchesSearch =
        machine.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "all" || machine.category === categoryFilter;
      const matchesCondition = conditionFilter === "all" || machine.condition === conditionFilter;
      const matchesPrice = machine.price >= priceRange[0] && machine.price <= priceRange[1];
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && machine.availability) ||
        (availabilityFilter === "unavailable" && !machine.availability);

      return matchesSearch && matchesCategory && matchesCondition && matchesPrice && matchesAvailability;
    });
  }, [searchQuery, categoryFilter, conditionFilter, priceRange, availabilityFilter]);

  const hasActiveFilters = categoryFilter !== "all" || conditionFilter !== "all" || availabilityFilter !== "all" || priceRange[0] > 0 || priceRange[1] < 70000;

  const clearFilters = () => {
    setCategoryFilter("all");
    setConditionFilter("all");
    setAvailabilityFilter("all");
    setPriceRange([0, 70000]);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search - Mobile Only */}
      <div className="space-y-2 lg:hidden">
        <Label className="text-sm font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Category</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Condition</Label>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((cond) => (
              <SelectItem key={cond} value={cond}>
                {cond === "all" ? "All Conditions" : cond}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={70000}
          step={1000}
          className="mt-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Availability</Label>
        <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Medical Equipment Catalog</h1>
          <p className="text-muted-foreground">Browse and filter our collection of refurbished medical devices</p>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between gap-4 mb-6 lg:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="default" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                !
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile Filters Drawer */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 mb-6",
          showMobileFilters ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <FilterContent />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Desktop */}
          <Card className="hidden lg:block lg:col-span-1 h-fit sticky top-20 border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FilterContent />
            </CardContent>
          </Card>

          {/* Machines Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredMachines.length}</span> of {machines.length} machines
                </span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="gap-1">
                    Filtered
                  </Badge>
                )}
              </div>
            </div>

            {filteredMachines.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-16 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">No machines found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMachines.map((machine, index) => (
                  <div 
                    key={machine.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                  >
                    <MachineCard machine={machine} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Machines;
