
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  onLogin: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ email, setEmail, isLoading, onLogin }) => {
  return (
    <form onSubmit={onLogin} className="space-y-4">
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
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : "Continue with Email"}
      </Button>
    </form>
  );
};

export default LoginForm;
