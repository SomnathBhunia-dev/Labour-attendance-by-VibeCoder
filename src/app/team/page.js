"use client";
import { useState } from "react";
import TeamsPage from "@/component/TeamList";
import PageLayout from "@/component/PageLayout";

export default function TeamListPage() {
  const [actionButton, setActionButton] = useState(null);

  return (
    <PageLayout title="Teams" actionButton={actionButton}>
      <TeamsPage setActionButton={setActionButton} />
    </PageLayout>
  );
}