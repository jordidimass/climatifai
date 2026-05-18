import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/advisor/results");
}
