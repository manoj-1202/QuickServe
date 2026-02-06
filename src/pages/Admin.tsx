import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, RefreshCw, Search, MessageCircle, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BookingCardSkeleton from "@/components/BookingCardSkeleton";

interface Booking {
  id: string;
  customer_name: string;
  phone_number: string;
  service: string;
  location: string;
  preferred_date: string | null;
  preferred_time: string | null;
  problem_description: string | null;
  status: string;
  created_at: string;
}

type StatusFilter = "all" | "new" | "in_progress" | "completed" | "cancelled";

const STATUS_TABS: { value: StatusFilter; label: string; color: string }[] = [
  { value: "all", label: "All", color: "bg-muted text-muted-foreground" },
  { value: "new", label: "New", color: "bg-blue-100 text-blue-700" },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-100 text-yellow-700" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

const Admin = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/");
      return;
    }

    const { data: roleData, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (error || !roleData) {
      toast({
        title: "Access denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchBookings();
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings.",
        variant: "destructive",
      });
    } else {
      setBookings(data || []);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Status updated",
        description: `Booking marked as ${newStatus}.`,
      });
      fetchBookings();
    }
  };

  // Filter and search bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const matchesSearch = searchQuery === "" || 
        booking.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.phone_number.includes(searchQuery) ||
        booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(b => new Date(b.created_at).toDateString() === today);
    const newCount = bookings.filter(b => b.status === "new").length;
    const inProgressCount = bookings.filter(b => b.status === "in_progress").length;
    const completedCount = bookings.filter(b => b.status === "completed").length;
    
    return {
      today: todayBookings.length,
      new: newCount,
      inProgress: inProgressCount,
      completed: completedCount,
    };
  }, [bookings]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-700";
      case "in_progress": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`Hi ${name}, this is QuickServe. We're reaching out regarding your service request.`);
    window.open(`https://wa.me/91${phone}?text=${message}`, "_blank");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchBookings} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.today}</p>
                <p className="text-xs text-muted-foreground">Today's Bookings</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.new}</p>
                <p className="text-xs text-muted-foreground">New</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                  statusFilter === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label}
                {tab.value !== "all" && (
                  <span className="ml-1.5 text-xs">
                    ({bookings.filter(b => b.status === tab.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, phone, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Bookings List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Bookings ({filteredBookings.length})
            {statusFilter !== "all" && ` — ${STATUS_TABS.find(t => t.value === statusFilter)?.label}`}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {searchQuery || statusFilter !== "all" 
              ? "No bookings match your filters." 
              : "No bookings found."}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold">{booking.customer_name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(booking.status)}`}>
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        <strong>Phone:</strong>{" "}
                        <a href={`tel:${booking.phone_number}`} className="text-primary hover:underline">
                          {booking.phone_number}
                        </a>
                      </p>
                      <p><strong>Service:</strong> {booking.service}</p>
                      <p><strong>Location:</strong> {booking.location}</p>
                      {booking.preferred_date && (
                        <p>
                          <strong>Date:</strong> {booking.preferred_date}
                          {booking.preferred_time && ` at ${booking.preferred_time}`}
                        </p>
                      )}
                      {booking.problem_description && (
                        <p><strong>Issue:</strong> {booking.problem_description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(booking.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      onClick={() => openWhatsApp(booking.phone_number, booking.customer_name)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                    {booking.status !== "in_progress" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(booking.id, "in_progress")}
                      >
                        In Progress
                      </Button>
                    )}
                    {booking.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateStatus(booking.id, "completed")}
                      >
                        Complete
                      </Button>
                    )}
                    {booking.status !== "cancelled" && booking.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => updateStatus(booking.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
