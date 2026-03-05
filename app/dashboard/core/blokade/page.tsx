import { redirect } from "next/navigation";
export default function Page() {
  redirect("/dashboard/core/obligations?view=blokade");
}
