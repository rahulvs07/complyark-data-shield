
import React from "react";
import { Button } from "@/components/ui/button";

interface RequestTypeSelectorProps {
  setRequestType: (type: "dp-request" | "grievance") => void;
}

const RequestTypeSelector: React.FC<RequestTypeSelectorProps> = ({ setRequestType }) => {
  return (
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
  );
};

export default RequestTypeSelector;
