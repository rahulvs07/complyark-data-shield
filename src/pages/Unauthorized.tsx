
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, LogIn } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md shadow-lg border-destructive/20">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto text-destructive">
            <AlertTriangle className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Unauthorized Access</CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            You do not have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Log In Again
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
