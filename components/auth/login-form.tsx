"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/lib/store/features/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/lib/store/store";
import { Spinner } from "../ui/spinner";

export default function LoginForm() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const { status } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login({ username, password }) as any);

      if (login.fulfilled.match(resultAction)) {
        setTimeout(() => router.push("/manage-todo"), 0);
        toast({
          title: "Success",
          description: "Login Successful",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
    }
  };

  const renderButtonContent = () => {
    return (
      <>
        {status === "loading" && <Spinner size="small" />}
        <span>{status === "loading" ? " Signing In..." : "Sign In"}</span>
      </>
    );
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading"}
          >
            {renderButtonContent()}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Use: emilys / emilyspass
        </div>
      </CardContent>
    </Card>
  );
}
