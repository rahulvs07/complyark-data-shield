
import React from "react";
import { Button } from "@/components/ui/button";

interface RequestHeaderProps {
  orgName: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  requestType?: "dp-request" | "grievance" | null;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ 
  orgName, 
  isLoggedIn, 
  onLogout, 
  requestType 
}) => {
  const getHeaderTitle = () => {
    if (!requestType) return '';
    return requestType === 'dp-request' 
      ? 'Data Request Form' 
      : 'Grievance Form';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary rounded-md p-1">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <div>
          <span className="font-bold text-lg">ComplyArk</span>
          {requestType && (
            <p className="text-sm text-muted-foreground">{getHeaderTitle()}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {orgName && (
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            Organization: {orgName}
          </span>
        )}
        {isLoggedIn && (
          <Button variant="ghost" onClick={onLogout}>
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default RequestHeader;
