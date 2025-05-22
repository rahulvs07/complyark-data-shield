
import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import { useAuth } from "@/contexts/AuthContext";
import db from "@/services/mockDatabase";
import { toast } from "@/hooks/use-toast";
import { Grievance } from "@/types/models";
import {
  CalendarClock,
  ClipboardCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const Grievances = () => {
  const { user, isOrgAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  // For a real application, this would come from API calls
  // For now, we'll use the mock database
  const requestStatuses = [
    { id: 1, name: "Submitted", count: 4 },
    { id: 2, name: "In Progress", count: 3 },
    { id: 3, name: "Awaiting Info", count: 1 },
    { id: 4, name: "Reassigned", count: 0 },
    { id: 5, name: "Escalated", count: 2 },
    { id: 6, name: "Closed", count: 6 },
  ];

  // Function to handle grievance status change
  const handleStatusChange = (grievanceId: number, newStatusId: number) => {
    // In a real app, this would call an API endpoint
    toast({
      title: "Status Updated",
      description: `Grievance #${grievanceId} status changed successfully.`,
    });
  };

  // Function to handle grievance assignment
  const handleAssignGrievance = (grievanceId: number, userId: number) => {
    // In a real app, this would call an API endpoint
    toast({
      title: "Grievance Assigned",
      description: `Grievance #${grievanceId} assigned successfully.`,
    });
  };

  // Function to view grievance details
  const handleViewGrievance = (grievanceId: number) => {
    // In a real app, this would navigate to a details page
    console.log("View grievance details for:", grievanceId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Grievances</h2>
          <p className="text-muted-foreground">
            Manage and track grievances submitted by data subjects
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card 
            className={`cursor-pointer ${activeTab === "all" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("all")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <ClipboardCheck className="h-6 w-6 mb-2 text-muted-foreground" />
              <p className="text-md font-medium">All Grievances</p>
              <p className="text-2xl font-bold">{requestStatuses.reduce((acc, status) => acc + status.count, 0)}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "submitted" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("submitted")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Clock className="h-6 w-6 mb-2 text-blue-500" />
              <p className="text-md font-medium">Submitted</p>
              <p className="text-2xl font-bold">{requestStatuses.find(s => s.name === "Submitted")?.count || 0}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "in-progress" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("in-progress")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <CalendarClock className="h-6 w-6 mb-2 text-amber-500" />
              <p className="text-md font-medium">In Progress</p>
              <p className="text-2xl font-bold">{requestStatuses.find(s => s.name === "In Progress")?.count || 0}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "awaiting-info" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("awaiting-info")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Clock className="h-6 w-6 mb-2 text-purple-500" />
              <p className="text-md font-medium">Awaiting Info</p>
              <p className="text-2xl font-bold">{requestStatuses.find(s => s.name === "Awaiting Info")?.count || 0}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "escalated" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("escalated")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <AlertCircle className="h-6 w-6 mb-2 text-red-500" />
              <p className="text-md font-medium">Escalated</p>
              <p className="text-2xl font-bold">{requestStatuses.find(s => s.name === "Escalated")?.count || 0}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "closed" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("closed")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <CheckCircle2 className="h-6 w-6 mb-2 text-green-500" />
              <p className="text-md font-medium">Closed</p>
              <p className="text-2xl font-bold">{requestStatuses.find(s => s.name === "Closed")?.count || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grievances List</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={[
                {
                  id: 1,
                  name: "Priya Sharma",
                  email: "priya.sharma@example.com",
                  phone: "+91 98765 43210",
                  assignedTo: "Sarah Smith",
                  createdDate: "2023-05-20",
                  lastUpdateDate: "2023-05-22",
                  status: "In Progress",
                },
                {
                  id: 2,
                  name: "Rahul Kumar",
                  email: "rahul.kumar@example.com",
                  phone: "+91 87654 32109",
                  assignedTo: "Mike Johnson",
                  createdDate: "2023-05-18",
                  lastUpdateDate: "2023-05-21",
                  status: "Submitted",
                },
                {
                  id: 3,
                  name: "Anil Reddy",
                  email: "anil.reddy@example.com",
                  phone: "+91 76543 21098",
                  assignedTo: "Sarah Smith",
                  createdDate: "2023-05-15",
                  lastUpdateDate: "2023-05-23",
                  status: "Escalated",
                },
              ]}
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Name", accessor: "name" },
                { 
                  header: "Contact", 
                  accessor: "email",
                  render: (row) => (
                    <div>
                      <div>{row.email}</div>
                      <div className="text-xs text-muted-foreground">{row.phone}</div>
                    </div>
                  )
                },
                { header: "Assigned To", accessor: "assignedTo" },
                { header: "Created Date", accessor: "createdDate" },
                { 
                  header: "Status", 
                  accessor: "status",
                  render: (row) => {
                    let badgeClass = "bg-gray-100 text-gray-800";
                    
                    switch(row.status) {
                      case "Submitted":
                        badgeClass = "bg-blue-100 text-blue-800";
                        break;
                      case "In Progress":
                        badgeClass = "bg-amber-100 text-amber-800";
                        break;
                      case "Awaiting Info":
                        badgeClass = "bg-purple-100 text-purple-800";
                        break;
                      case "Escalated":
                        badgeClass = "bg-red-100 text-red-800";
                        break;
                      case "Closed":
                        badgeClass = "bg-green-100 text-green-800";
                        break;
                    }
                    
                    return (
                      <Badge className={badgeClass}>
                        {row.status}
                      </Badge>
                    );
                  }
                },
                { header: "Last Update", accessor: "lastUpdateDate" },
              ]}
              onView={(row) => handleViewGrievance(row.id)}
              onEdit={isOrgAdmin ? (row) => console.log("Edit grievance", row) : undefined}
              onDelete={undefined}
              pagination={true}
              searchEnabled={true}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Grievances;
