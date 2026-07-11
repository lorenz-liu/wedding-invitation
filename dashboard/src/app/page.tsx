import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, getExpectedAuthToken } from "@/lib/auth";
import { Dashboard } from "@/components/Dashboard";

export default async function HomePage() {
  const expected = getExpectedAuthToken();
  if (expected) {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (token !== expected) {
      redirect("/login");
    }
  }

  return <Dashboard />;
}
