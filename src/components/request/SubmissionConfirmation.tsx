
import React from "react";
import { Button } from "@/components/ui/button";

interface SubmissionConfirmationProps {
  onLogout: () => void;
}

const SubmissionConfirmation: React.FC<SubmissionConfirmationProps> = ({ onLogout }) => {
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        <p>
          Thank you for your submission. Your request has been received and
          will be processed.
        </p>
        <p className="mt-2">
          A confirmation has been sent to your email address.
        </p>
      </div>
      <div className="flex justify-center">
        <Button onClick={onLogout}>Submit Another Request</Button>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;
