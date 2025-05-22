
import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);

  // Fetch data requests
  useEffect(() => {
    const fetchRequests = () => {
      setLoading(true);
      try {
        const requests = db.getDPRequests(user?.organisationId);
        setDataRequests(requests);
      } catch (error) {
        console.error("Failed to fetch data requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.organisationId]);

  // Get all request statuses
  const requestStatuses = db.getRequestStatuses();

  // Map status count
  const statusCounts = {
    all: dataRequests.length,
    submitted: dataRequests.filter(r => r.dpr_RequestStatusId === 1).length,
    "in-progress": dataRequests.filter(r => r.dpr_RequestStatusId === 2).length,
    "awaiting-info": dataRequests.filter(r => r.dpr_RequestStatusId === 3).length,
    escalated: dataRequests.filter(r => r.dpr_RequestStatusId === 5).length,
    closed: dataRequests.filter(r => r.dpr_RequestStatusId === 6).length,
  };

  // Filter requests based on active tab
  const filteredRequests = activeTab === "all" 
    ? dataRequests
    : dataRequests.filter(r => {
        const status = requestStatuses.find(s => s.requestStatusId === r.dpr_RequestStatusId);
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

  // Function to handle data request status change
  const handleStatusChange = (request: any, newStatusId: number) => {
    setLoading(true);
    
    try {
      const requestToUpdate = db.getDPRequestById(request.id);
      
      if (requestToUpdate) {
        // Update request status
        const updatedRequest = {
          ...requestToUpdate,
          dpr_RequestStatusId: newStatusId,
        };
        
        if (newStatusId === 6) { // If closing the request
          updatedRequest.closureDateTime = new Date().toISOString();
        }
        
        db.updateDPRequest(updatedRequest);
        
        // Add history entry
        const status = requestStatuses.find(s => s.requestStatusId === newStatusId);
        db.addDPRequestHistory({
          dpRequestId: request.id,
          statusId: newStatusId,
          statusName: status?.requestStatus || "Unknown",
          assignedTo: requestToUpdate.assignedTo,
          assignedToName: request.assignedTo,
          updatedBy: user?.userId || 0,
          updatedByName: `${user?.firstName} ${user?.lastName}`,
          updatedAt: new Date().toISOString(),
          comments: `Status changed to ${status?.requestStatus || "Unknown"}`,
          organisationId: user?.organisationId || 0
        });
        
        // Refresh data
        setDataRequests(prev => 
          prev.map(r => r.dpRequestId === request.id 
            ? { ...r, dpr_RequestStatusId: newStatusId } 
            : r
          )
        );
        
        toast({
          title: "Status Updated",
          description: `Request #${request.id} status changed to ${status?.requestStatus || "Unknown"}`,
        });
      }
    } catch (error) {
      console.error("Failed to update request status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update the request status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <CardTitle>Data Principal Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredRequests.map(request => {
                const status = requestStatuses.find(s => s.requestStatusId === request.dpr_RequestStatusId);
                const assignedUser = db.getUserById(request.assignedTo);
                
                return {
                  id: request.dpRequestId,
                  name: `${request.firstName} ${request.lastName}`,
                  email: request.email,
                  phone: request.phone,
                  requestType: request.requestType,
                  assignedTo: assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : "Unassigned",
                  status: status ? status.requestStatus : "Unknown",
                  actionDate: request.completionDate,
                  statusId: request.dpr_RequestStatusId,
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
                { header: "Request Type", accessor: "requestType" },
                { header: "Assigned To", accessor: "assignedTo" },
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
                { 
                  header: "Action Required By", 
                  accessor: "actionDate",
                  cell: (value, row) => {
                    const date = new Date(value);
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

export default DataRequests;
