import { currentUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const user = await currentUser();
  return <div>Hello {user?.name}</div>;
}
