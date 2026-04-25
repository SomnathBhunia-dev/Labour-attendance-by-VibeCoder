"use client";
import { useState } from "react";
import SiteList from "@/component/SiteList";
import PageLayout from "@/component/PageLayout";

export default function SiteListPage() {
  const [actionButton, setActionButton] = useState(null);

  return (
    <PageLayout title="Sites" actionButton={actionButton}>
      <SiteList setActionButton={setActionButton} />
    </PageLayout>
  );
}