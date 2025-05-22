
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import db from "@/services/mockDatabase";

interface UseRequestPageProps {
  orgIdEncoded: string | undefined;
}

interface UseRequestPageReturn {
  orgId: number | null;
  orgName: string;
  requestType: "dp-request" | "grievance" | null;
  isLoggedIn: boolean;
  isSubmitted: boolean;
  isLoading: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dpRequestType: string;
  comments: string;
  setRequestType: (type: "dp-request" | "grievance" | null) => void;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
  setDpRequestType: (value: string) => void;
  setComments: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleLogout: () => void;
}

export function useRequestPage({ orgIdEncoded }: UseRequestPageProps): UseRequestPageReturn {
  const navigate = useNavigate();
  const [orgId, setOrgId] = useState<number | null>(null);
  const [orgName, setOrgName] = useState("");
  const [requestType, setRequestType] = useState<"dp-request" | "grievance" | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    setIsLoading(true);

    // Simple login validation
    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoggedIn(true);
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "You are now logged in to submit a request.",
      });
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgId) return;
    
    setIsLoading(true);

    // Form validation
    if (!firstName || !lastName || !email || !phone || !comments) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      if (requestType === "dp-request") {
        // Calculate completion date (7 days from now)
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + 7);

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
          assignedTo: 0, // Will be assigned to org admin 
          completionDate: completionDate.toISOString(),
          completedOnTime: false,
          dpr_RequestStatusId: 1, // Submitted status
          closureComments: "",
          closureDateTime: "",
        };
        
        // Add request to mock database
        const savedRequest = db.addDPRequest(newRequest);
        
        // Add history entry
        db.addDPRequestHistory({
          dpRequestId: savedRequest.dpRequestId,
          statusId: 1,
          statusName: "Submitted",
          assignedTo: 0,
          assignedToName: "Organization Admin",
          updatedBy: 0,
          updatedByName: `${firstName} ${lastName} (Requester)`,
          updatedAt: new Date().toISOString(),
          comments: "Request created by data principal",
          organisationId: orgId
        });

        console.log("Created DP request:", savedRequest);
      } else {
        // Calculate completion date (7 days from now)
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + 7);

        // Submit grievance
        const newGrievance = {
          firstName,
          lastName,
          email,
          phone,
          organisationId: orgId,
          grievanceComments: comments,
          createdAt: new Date().toISOString(),
          assignedTo: 0, // Will be assigned to org admin
          completionDate: completionDate.toISOString(),
          completedOnTime: false,
          requestStatusId: 1, // Submitted status
          closureComments: "",
          closedDateTime: "",
        };
        
        // Add grievance to mock database
        const savedGrievance = db.addGrievance(newGrievance);
        
        // Add history entry
        db.addGrievanceHistory({
          grievanceId: savedGrievance.grievanceId,
          statusId: 1,
          statusName: "Submitted",
          assignedTo: 0,
          assignedToName: "Organization Admin",
          updatedBy: 0,
          updatedByName: `${firstName} ${lastName} (Requester)`,
          updatedAt: new Date().toISOString(),
          comments: "Grievance created by user",
          organisationId: orgId
        });

        console.log("Created grievance:", savedGrievance);
      }
      
      setTimeout(() => {
        setIsSubmitted(true);
        setIsLoading(false);
        toast({
          title: "Request Submitted",
          description: "Your request has been submitted successfully.",
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to submit request:", error);
      setIsLoading(false);
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
    // Reset form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setComments("");
    setDpRequestType("Access");
  };

  return {
    orgId,
    orgName,
    requestType,
    isLoggedIn,
    isSubmitted,
    isLoading,
    firstName,
    lastName,
    email,
    phone,
    dpRequestType,
    comments,
    setRequestType,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setDpRequestType,
    setComments,
    handleLogin,
    handleSubmit,
    handleLogout
  };
}
