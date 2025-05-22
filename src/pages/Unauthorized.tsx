
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="text-destructive mb-6">
        <AlertTriangle className="h-24 w-24" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Unauthorized Access</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        You do not have permission to access this page. Please contact your
        administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login">Log In Again</Link>
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
