"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard'); // Redirect to dashboard by default
  }, [router]);

  return null; // This page will just redirect
}