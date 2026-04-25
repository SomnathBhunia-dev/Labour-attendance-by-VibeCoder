"use client";
import { useState } from "react";
import Attendance from "@/component/AttendancePage";
import PageLayout from "@/component/PageLayout";

export default function AttendancePage() {
  const [actionButton, setActionButton] = useState(null);

  return (
    <PageLayout title="Attendance" subtitle="Track your team's attendance and time logs" actionButton={actionButton}>
      <Attendance setActionButton={setActionButton} />
    </PageLayout>
  );
}