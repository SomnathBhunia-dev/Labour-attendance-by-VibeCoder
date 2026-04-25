"use client";
import { useState } from "react";
import PageLayout from "@/component/PageLayout";
import Dashboard from "@/component/Dashboard";

export default function DashboardPage() {
  const [actionButton, setActionButton] = useState(null);

  return (
    <PageLayout title="Dashboard" actionButton={actionButton} showProfile={true}>
      <Dashboard setActionButton={setActionButton} />
    </PageLayout>
  );
}