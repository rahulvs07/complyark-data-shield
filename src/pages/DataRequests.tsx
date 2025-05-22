import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/DataTable";
import { useAuth } from "@/contexts/AuthContext";
import db from "@/services/mockDatabase";
import { toast } from "@/hooks/use-toast";
import { DPRequest } from "@/types/models";
import {
  CalendarClock,
  ClipboardCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const DataRequests = () => {
  const { user, isOrgAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [dataRequests, setDataRequests] = useState<DPRequest[]>([]);

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

  // Function to handle data request status change
  const handleStatusChange = (requestId: number, newStatusId: number) => {
    // In a real app, this would call an API endpoint
    toast({
      title: "Status Updated",
      description: `Request #${requestId} status changed successfully.`,
    });
  };

  // Function to handle data request assignment
  const handleAssignRequest = (requestId: number, userId: number) => {
    // In a real app, this would call an API endpoint
    toast({
      title: "Request Assigned",
      description: `Request #${requestId} assigned successfully.`,
    });
  };

  // Function to view data request details
  const handleViewRequest = (requestId: number) => {
    // In a real app, this would navigate to a details page
    console.log("View request details for:", requestId);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Data Principal Requests</h2>
          <p className="text-muted-foreground">
            Manage and track data principal requests submitted by users
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
              <p className="text-md font-medium">All Requests</p>
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
            <CardTitle>Data Principal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={[
                {
                  id: 1,
                  name: "John Doe",
                  email: "john.doe@example.com",
                  phone: "+1 555-123-4567",
                  requestType: "Access",
                  assignedTo: "Jane Smith",
                  status: "In Progress",
                  actionDate: "2023-05-25",
                },
                {
                  id: 2,
                  name: "Alice Johnson",
                  email: "alice.johnson@example.com",
                  phone: "+1 555-987-6543",
                  requestType: "Correction",
                  assignedTo: "Bob Williams",
                  status: "Submitted",
                  actionDate: "2023-05-22",
                },
                {
                  id: 3,
                  name: "Bob Williams",
                  email: "bob.williams@example.com",
                  phone: "+1 555-456-7890",
                  requestType: "Erasure",
                  assignedTo: "Jane Smith",
                  status: "Escalated",
                  actionDate: "2023-05-28",
                },
              ]}
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Name", accessor: "name" },
                { 
                  header: "Contact", 
                  accessor: "email",
                  cell: (row) => (
                    <div>
                      <div>{row.email}</div>
                      <div className="text-xs text-muted-foreground">{row.phone}</div>
                    </div>
                  )
                },
                { header: "Request Type", accessor: "requestType" },
                { header: "Assigned To", accessor: "assignedTo" },
                { 
                  header: "Status", 
                  accessor: "status",
                  cell: (row) => {
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
                { 
                  header: "Action Required By", 
                  accessor: "actionDate",
                  cell: (row) => {
                    const date = new Date(row.actionDate);
                    const formattedDate = date.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                    return <div>{formattedDate}</div>;
                  }
                },
              ]}
              onView={(row) => handleViewRequest(row.id)}
              onEdit={isOrgAdmin ? (row) => console.log("Edit request", row) : undefined}
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

export default DataRequests;
