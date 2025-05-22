
import React from "react";
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
import { Button } from "@/components/ui/button";

interface RequestFormProps {
  requestType: "dp-request" | "grievance";
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  dpRequestType: string;
  setDpRequestType: (value: string) => void;
  comments: string;
  setComments: (value: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const RequestForm: React.FC<RequestFormProps> = ({
  requestType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  dpRequestType,
  setDpRequestType,
  comments,
  setComments,
  isLoading,
  handleSubmit,
}) => {
  return (
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
            <Select value={dpRequestType} onValueChange={setDpRequestType}>
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
};

export default RequestForm;
