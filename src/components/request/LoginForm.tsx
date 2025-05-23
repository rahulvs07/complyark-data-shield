
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  onLogin: (e: React.FormEvent) => void;
  showOTP: boolean;
  otp: string;
  setOTP: (otp: string) => void;
  onVerifyOTP: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  email, 
  setEmail, 
  isLoading, 
  onLogin,
  showOTP,
  otp,
  setOTP,
  onVerifyOTP
}) => {
  if (showOTP) {
    return (
      <form onSubmit={onVerifyOTP} className="space-y-4">
        <div className="space-y-2 text-center">
          <p>Enter the verification code sent to your email</p>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <div className="flex justify-center py-4">
          <InputOTP 
            maxLength={6}
            value={otp}
            onChange={setOTP}
            render={({ slots }) => (
              <InputOTPGroup>
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} />
                ))}
              </InputOTPGroup>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
        <div className="text-center">
          <Button type="button" variant="link" onClick={() => window.location.reload()}>
            Use a different email
          </Button>
        </div>
      </form>
    );
  }

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
