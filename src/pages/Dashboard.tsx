
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import DataTable from "@/components/DataTable";
import MainLayout from "@/components/layouts/MainLayout";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DPRequest, Grievance, RequestStatus } from "@/types/models";
import db from "@/services/mockDatabase";

interface StatusCount {
  name: string;
  value: number;
  color: string;
}

interface TaskData {
  id: number;
  name: string;
  requestType: string;
  status: string;
  assignedTo: string;
  dueDate: string;
}

const Dashboard = () => {
  const { organisationId } = useAuth();
  const [dpRequests, setDpRequests] = useState<DPRequest[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [requestStatuses, setRequestStatuses] = useState<RequestStatus[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);

  useEffect(() => {
    // Fetch actual data
    const fetchData = async () => {
      const statuses = db.getRequestStatuses();
      setRequestStatuses(statuses);
      
      const dpRequestsData = db.getDPRequests(organisationId);
      const grievancesData = db.getGrievances(organisationId);
      
      setDpRequests(dpRequestsData);
      setGrievances(grievancesData);
      
      // For demo, create mock status counts
      const mockStatusCounts: StatusCount[] = [
        { name: "Submitted", value: 12, color: "#0088FE" },
        { name: "In Progress", value: 8, color: "#00C49F" },
        { name: "Awaiting Info", value: 5, color: "#FFBB28" },
        { name: "Escalated", value: 3, color: "#FF8042" }
      ];
      setStatusCounts(mockStatusCounts);
      
      // For demo, create mock tasks
      const combinedTasks: TaskData[] = [
        ...dpRequestsData.map(req => ({
          id: req.dpRequestId,
          name: `${req.firstName} ${req.lastName}`,
          requestType: req.requestType,
          status: statuses.find(s => s.requestStatusId === req.dpr_RequestStatusId)?.requestStatus || "Unknown",
          assignedTo: "Admin",
          dueDate: new Date(req.completionDate).toLocaleDateString()
        })),
        ...grievancesData.map(g => ({
          id: g.grievanceId,
          name: `${g.firstName} ${g.lastName}`,
          requestType: "Grievance",
          status: statuses.find(s => s.requestStatusId === g.requestStatusId)?.requestStatus || "Unknown",
          assignedTo: "Admin",
          dueDate: new Date(g.completionDate).toLocaleDateString()
        }))
      ];
      
      setTasks(combinedTasks);
    };
    
    fetchData();
  }, [organisationId]);

  const taskColumns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Request Type", accessor: "requestType" },
    { header: "Status", accessor: "status" },
    { header: "Assigned To", accessor: "assignedTo" },
    { header: "Due Date", accessor: "dueDate" },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

  // Mock data for demo charts
  const requestTypeData = [
    { name: "Access", value: 10 },
    { name: "Correction", value: 5 },
    { name: "Nomination", value: 3 },
    { name: "Erasure", value: 7 },
  ];

  const weeklyData = [
    { name: "Mon", requests: 4, grievances: 2 },
    { name: "Tue", requests: 3, grievances: 1 },
    { name: "Wed", requests: 5, grievances: 3 },
    { name: "Thu", requests: 2, grievances: 2 },
    { name: "Fri", requests: 6, grievances: 4 },
    { name: "Sat", requests: 1, grievances: 0 },
    { name: "Sun", requests: 0, grievances: 1 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome to your compliance management dashboard.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dpRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Grievances</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{grievances.length}</div>
              <p className="text-xs text-muted-foreground">
                +10.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Escalated</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +7% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="requests" fill="#8884d8" name="Data Requests" />
                  <Bar dataKey="grievances" fill="#82ca9d" name="Grievances" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>
                Current request status distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
            <TabsTrigger value="escalated">Escalated</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Due</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4">
            <DataTable
              data={tasks.filter(task => task.status !== "Closed")}
              columns={taskColumns}
              pagination={true}
              itemsPerPage={5}
              onView={(row) => console.log("View task", row)}
            />
          </TabsContent>
          <TabsContent value="escalated" className="space-y-4">
            <DataTable
              data={tasks.filter(task => task.status === "Escalated")}
              columns={taskColumns}
              pagination={true}
              itemsPerPage={5}
              onView={(row) => console.log("View task", row)}
            />
          </TabsContent>
          <TabsContent value="upcoming" className="space-y-4">
            <DataTable
              data={tasks}
              columns={taskColumns}
              pagination={true}
              itemsPerPage={5}
              onView={(row) => console.log("View task", row)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
