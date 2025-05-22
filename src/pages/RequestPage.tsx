
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import db from "@/services/mockDatabase";

const RequestPage = () => {
  const { orgIdEncoded } = useParams<{ orgIdEncoded: string }>();
  const navigate = useNavigate();
  const [orgId, setOrgId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState("");
  const [requestType, setRequestType] = useState<"dp-request" | "grievance" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dpRequestType, setDpRequestType] = useState("Access");
  const [comments, setComments] = useState("");
  
  useEffect(() => {
    if (orgIdEncoded) {
      try {
        const decoded = atob(orgIdEncoded);
        const orgParam = new URLSearchParams(decoded).get("org");
        
        if (orgParam) {
          const id = parseInt(orgParam);
          setOrgId(id);
          
          // Get organization name
          const org = db.getOrganisationById(id);
          if (org) {
            setOrgName(org.businessName);
          } else {
            toast({
              title: "Error",
              description: "Invalid organization",
              variant: "destructive",
            });
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Failed to decode parameters:", error);
        navigate("/");
      }
    }
  }, [orgIdEncoded, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple login validation
    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoggedIn(true);
    toast({
      title: "Login Successful",
      description: "You are now logged in to submit a request.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgId) return;
    
    try {
      if (requestType === "dp-request") {
        // Submit data principal request
        const newRequest = {
          firstName,
          lastName,
          email,
          phone,
          requestType: dpRequestType as "Access" | "Correction" | "Nomination" | "Erasure",
          requestComment: comments,
          organisationId: orgId,
          createdAt: new Date().toISOString(),
          assignedTo: 0, // Will be set to org admin in the backend
          completionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          completedOnTime: false,
          dpr_RequestStatusId: 1, // Submitted status
          closureComments: "",
          closureDateTime: "",
        };
        
        db.addDPRequest(newRequest);
      } else {
        // Submit grievance
        const newGrievance = {
          firstName,
          lastName,
          email,
          phone,
          organisationId: orgId,
          grievanceComments: comments,
          createdAt: new Date().toISOString(),
          assignedTo: 0, // Will be set to org admin in the backend
          completionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          completedOnTime: false,
          requestStatusId: 1, // Submitted status
          closureComments: "",
          closedDateTime: "",
        };
        
        db.addGrievance(newGrievance);
      }
      
      setIsSubmitted(true);
      toast({
        title: "Request Submitted",
        description: "Your request has been submitted successfully.",
      });
    } catch (error) {
      console.error("Failed to submit request:", error);
      toast({
        title: "Submission Failed",
        description: "An error occurred while submitting your request.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRequestType(null);
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30 p-6">
      <header className="w-full max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-lg">ComplyArk</span>
          </div>
          {isLoggedIn && (
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl">
          {!isLoggedIn ? (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Welcome to {orgName}</CardTitle>
                <CardDescription>
                  Please log in to submit a request or grievance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Continue with Email
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : !requestType && !isSubmitted ? (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Select Request Type</CardTitle>
                <CardDescription>
                  Please select the type of request you would like to submit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center"
                    onClick={() => setRequestType("dp-request")}
                  >
                    <div className="text-3xl mb-2">📋</div>
                    <div className="font-medium">Data Principal Request</div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center"
                    onClick={() => setRequestType("grievance")}
                  >
                    <div className="text-3xl mb-2">⚠️</div>
                    <div className="font-medium">Grievance Logging</div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : isSubmitted ? (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Request Submitted</CardTitle>
                <CardDescription>
                  Your request has been successfully submitted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <p>
                    Thank you for your submission. Your request has been received and
                    will be processed by {orgName}.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button onClick={handleLogout}>Submit Another Request</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {requestType === "dp-request"
                    ? "Data Principal Request"
                    : "Grievance Logging"}
                </CardTitle>
                <CardDescription>
                  Please fill out the form below to submit your request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>

                    {requestType === "dp-request" && (
                      <div className="space-y-2 col-span-full">
                        <Label htmlFor="requestType">Request Type</Label>
                        <Select
                          value={dpRequestType}
                          onValueChange={setDpRequestType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select request type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Access">Access</SelectItem>
                            <SelectItem value="Correction">Correction</SelectItem>
                            <SelectItem value="Nomination">Nomination</SelectItem>
                            <SelectItem value="Erasure">Erasure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2 col-span-full">
                      <Label htmlFor="comments">
                        {requestType === "dp-request"
                          ? "Request Comments"
                          : "Grievance Comments"}
                      </Label>
                      <Textarea
                        id="comments"
                        placeholder={
                          requestType === "dp-request"
                            ? "Please provide details about your request"
                            : "Please describe your grievance in detail"
                        }
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        rows={5}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default RequestPage;
