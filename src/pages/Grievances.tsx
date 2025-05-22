
import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);

  // Fetch grievances
  useEffect(() => {
    const fetchGrievances = () => {
      setLoading(true);
      try {
        const fetchedGrievances = db.getGrievances(user?.organisationId);
        setGrievances(fetchedGrievances);
      } catch (error) {
        console.error("Failed to fetch grievances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, [user?.organisationId]);

  // Get all request statuses
  const requestStatuses = db.getRequestStatuses();

  // Map status count
  const statusCounts = {
    all: grievances.length,
    submitted: grievances.filter(g => g.requestStatusId === 1).length,
    "in-progress": grievances.filter(g => g.requestStatusId === 2).length,
    "awaiting-info": grievances.filter(g => g.requestStatusId === 3).length,
    escalated: grievances.filter(g => g.requestStatusId === 5).length,
    closed: grievances.filter(g => g.requestStatusId === 6).length,
  };

  // Filter grievances based on active tab
  const filteredGrievances = activeTab === "all" 
    ? grievances
    : grievances.filter(g => {
        const status = requestStatuses.find(s => s.requestStatusId === g.requestStatusId);
        if (!status) return false;
        
        switch (activeTab) {
          case "submitted": return status.requestStatus === "Submitted";
          case "in-progress": return status.requestStatus === "InProgress";
          case "awaiting-info": return status.requestStatus === "AwaitingInfo";
          case "escalated": return status.requestStatus === "Escalated";
          case "closed": return status.requestStatus === "Closed";
          default: return true;
        }
      });

  // Function to handle grievance status change
  const handleStatusChange = (grievance: any, newStatusId: number) => {
    setLoading(true);
    
    try {
      const grievanceToUpdate = db.getGrievanceById(grievance.id);
      
      if (grievanceToUpdate) {
        // Update grievance status
        const updatedGrievance = {
          ...grievanceToUpdate,
          requestStatusId: newStatusId,
        };
        
        if (newStatusId === 6) { // If closing the grievance
          updatedGrievance.closedDateTime = new Date().toISOString();
        }
        
        db.updateGrievance(updatedGrievance);
        
        // Add history entry
        const status = requestStatuses.find(s => s.requestStatusId === newStatusId);
        db.addGrievanceHistory({
          grievanceId: grievance.id,
          statusId: newStatusId,
          statusName: status?.requestStatus || "Unknown",
          assignedTo: grievanceToUpdate.assignedTo,
          assignedToName: grievance.assignedTo,
          updatedBy: user?.userId || 0,
          updatedByName: `${user?.firstName} ${user?.lastName}`,
          updatedAt: new Date().toISOString(),
          comments: `Status changed to ${status?.requestStatus || "Unknown"}`,
          organisationId: user?.organisationId || 0
        });
        
        // Refresh data
        setGrievances(prev => 
          prev.map(g => g.grievanceId === grievance.id 
            ? { ...g, requestStatusId: newStatusId } 
            : g
          )
        );
        
        toast({
          title: "Status Updated",
          description: `Grievance #${grievance.id} status changed to ${status?.requestStatus || "Unknown"}`,
        });
      }
    } catch (error) {
      console.error("Failed to update grievance status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update the grievance status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <p className="text-2xl font-bold">{statusCounts.all}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "submitted" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("submitted")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Clock className="h-6 w-6 mb-2 text-blue-500" />
              <p className="text-md font-medium">Submitted</p>
              <p className="text-2xl font-bold">{statusCounts.submitted}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "in-progress" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("in-progress")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <CalendarClock className="h-6 w-6 mb-2 text-amber-500" />
              <p className="text-md font-medium">In Progress</p>
              <p className="text-2xl font-bold">{statusCounts["in-progress"]}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "awaiting-info" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("awaiting-info")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Clock className="h-6 w-6 mb-2 text-purple-500" />
              <p className="text-md font-medium">Awaiting Info</p>
              <p className="text-2xl font-bold">{statusCounts["awaiting-info"]}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "escalated" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("escalated")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <AlertCircle className="h-6 w-6 mb-2 text-red-500" />
              <p className="text-md font-medium">Escalated</p>
              <p className="text-2xl font-bold">{statusCounts.escalated}</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer ${activeTab === "closed" ? "border-primary" : ""}`} 
            onClick={() => setActiveTab("closed")}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <CheckCircle2 className="h-6 w-6 mb-2 text-green-500" />
              <p className="text-md font-medium">Closed</p>
              <p className="text-2xl font-bold">{statusCounts.closed}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Grievances List</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredGrievances.map(grievance => {
                const status = requestStatuses.find(s => s.requestStatusId === grievance.requestStatusId);
                const assignedUser = db.getUserById(grievance.assignedTo);
                
                return {
                  id: grievance.grievanceId,
                  name: `${grievance.firstName} ${grievance.lastName}`,
                  email: grievance.email,
                  phone: grievance.phone,
                  assignedTo: assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : "Unassigned",
                  createdDate: grievance.createdAt,
                  lastUpdateDate: grievance.createdAt, // Using creation date as last update for now
                  status: status ? status.requestStatus : "Unknown",
                  statusId: grievance.requestStatusId,
                };
              })}
              columns={[
                { header: "ID", accessor: "id" },
                { header: "Name", accessor: "name" },
                { 
                  header: "Contact", 
                  accessor: "email",
                  cell: (value, row) => (
                    <div>
                      <div>{value}</div>
                      <div className="text-xs text-muted-foreground">{row.phone}</div>
                    </div>
                  )
                },
                { header: "Assigned To", accessor: "assignedTo" },
                { header: "Created Date", accessor: "createdDate" },
                { 
                  header: "Status", 
                  accessor: "status",
                  cell: (value, row) => {
                    let badgeClass = "bg-gray-100 text-gray-800";
                    
                    switch(value) {
                      case "Submitted":
                        badgeClass = "bg-blue-100 text-blue-800";
                        break;
                      case "InProgress":
                        badgeClass = "bg-amber-100 text-amber-800";
                        break;
                      case "AwaitingInfo":
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
                        {value}
                      </Badge>
                    );
                  }
                },
                { header: "Last Update", accessor: "lastUpdateDate" },
              ]}
              onView={(row) => handleViewGrievance(row.id)}
              onEdit={isOrgAdmin ? (row) => console.log("Edit grievance", row) : undefined}
              onDelete={undefined}
              onStatusChange={(row, statusId) => handleStatusChange(row, statusId)}
              statusOptions={requestStatuses.map(status => ({
                id: status.requestStatusId,
                name: status.requestStatus
              }))}
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
