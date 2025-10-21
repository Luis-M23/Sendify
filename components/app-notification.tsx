"use client";

import { useAuth } from "@/components/auth-provider";
import React, { useEffect } from "react";

export function AppNotification({ children }: { children: React.ReactNode }) {
  const { loading, user, setHasUnread } = useAuth();

  useEffect(() => {
    if (user) {
      setHasUnread(true);
    }
  }, [user, setHasUnread]);

  return <>{children}</>;
}
