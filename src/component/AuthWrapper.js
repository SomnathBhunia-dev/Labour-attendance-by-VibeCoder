"use client";

import { usePathname, useRouter } from "next/navigation";
import { useStateValue } from "@/context/context";
import { useEffect } from "react";
import ProfileSetupModal from "./ProfileSetupModal";

export default function AuthWrapper({ children }) {
  const { isAuthenticated, loading, user } = useStateValue();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated && pathname !== "/signin") {
      router.push("/signin");
    } else if (isAuthenticated && pathname === "/signin") {
      router.push("/");
    }
  }, [isAuthenticated, loading, pathname, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      {isAuthenticated && user?.isNewUser && <ProfileSetupModal />}
      {children}
    </>
  );
}
