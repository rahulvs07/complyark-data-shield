
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  FileText,
  TicketCheck,
  MessageCircleWarning,
  FolderOpen,
  User,
  LogOut,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout, organisationName, isOrgAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar defaultIsOpen={isExpanded}>
          <SidebarHeader className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 px-2">
              <div className="bg-complyark-primary rounded-md p-1">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-lg">ComplyArk</span>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="flex flex-col flex-grow">
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              
              <SidebarMenu>
                <SidebarMenuItem active={isActive("/dashboard")}>
                  <SidebarMenuButton asChild>
                    <Link to="/dashboard">
                      <Home />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem active={isActive("/notices")}>
                  <SidebarMenuButton asChild>
                    <Link to="/notices">
                      <FileText />
                      <span>Notices</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem active={isActive("/data-requests")}>
                  <SidebarMenuButton asChild>
                    <Link to="/data-requests">
                      <TicketCheck />
                      <span>Data Requests</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem active={isActive("/grievances")}>
                  <SidebarMenuButton asChild>
                    <Link to="/grievances">
                      <MessageCircleWarning />
                      <span>Grievances</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem active={isActive("/documents")}>
                  <SidebarMenuButton asChild>
                    <Link to="/documents">
                      <FolderOpen />
                      <span>Documents</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {isOrgAdmin && (
                  <SidebarMenuItem active={isActive("/users")}>
                    <SidebarMenuButton asChild>
                      <Link to="/users">
                        <User />
                        <span>Users</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              
              <div className="text-sm text-sidebar-foreground/70">
                {organisationName}
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex flex-col flex-grow">
          <header className="bg-background border-b h-16 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-xl font-semibold">
                {location.pathname === "/dashboard" && "Dashboard"}
                {location.pathname.startsWith("/notices") && "Notices"}
                {location.pathname.startsWith("/data-requests") && "Data Principal Requests"}
                {location.pathname.startsWith("/grievances") && "Grievances"}
                {location.pathname.startsWith("/documents") && "Documents"}
                {location.pathname.startsWith("/users") && "Users"}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {user?.firstName?.charAt(0)}
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-muted-foreground">{user?.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          
          <main className="flex-grow p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
