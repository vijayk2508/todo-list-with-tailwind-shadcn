"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/store/features/authSlice";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";
import { LogOut, User } from "lucide-react";

export function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">Todo Management</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 mt-2 md:mt-0">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="text-sm md:text-base">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-sm md:text-base"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
