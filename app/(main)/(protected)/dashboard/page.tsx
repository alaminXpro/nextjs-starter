"use client";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function DashboardPage() {
  const user = useCurrentUser();
  return (
    <div className="flex flex-col gap-y-4">
      <h1>Dashboard</h1>
      <p> {user?.name}</p>
    </div>
  );
}
