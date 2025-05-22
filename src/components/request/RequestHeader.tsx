
import React from "react";
import { Button } from "@/components/ui/button";

interface RequestHeaderProps {
  orgName: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ orgName, isLoggedIn, onLogout }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-primary rounded-md p-1">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <span className="font-bold text-lg">ComplyArk</span>
      </div>
      {isLoggedIn && (
        <Button variant="ghost" onClick={onLogout}>
          Logout
        </Button>
      )}
    </div>
  );
};

export default RequestHeader;
