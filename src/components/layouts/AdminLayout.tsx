
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building, Users, FileText, Layout, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToMain = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-md p-1">
            <span className="text-primary font-bold text-xl">C</span>
          </div>
          <span className="font-bold text-lg">ComplyArk Admin</span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={goToMain}
            className="hidden md:flex"
          >
            Go to Main Application
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center">
                  {user?.firstName?.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <div className="font-medium">{user?.firstName}</div>
                  <div className="text-xs opacity-80">System Admin</div>
                </div>
                <ChevronDown className="h-4 w-4 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>System Admin</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={goToMain}>
                Go to Main Application
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

      <div className="flex-grow flex flex-col">
        <div className="border-b bg-card">
          <div className="container py-2">
            <Tabs
              defaultValue="organisations"
              value={location.pathname.split("/")[2] || "organisations"}
              className="w-full"
              onValueChange={(value) => navigate(`/admin/${value}`)}
            >
              <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="organisations" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden md:inline">Organisations</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden md:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="industries" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  <span className="hidden md:inline">Industries</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden md:inline">Templates</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
