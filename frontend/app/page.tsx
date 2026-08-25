import { api } from "@/lib/api-server";
import { Header } from "@/components/web/header";
import { Hero } from "@/components/web/hero";

async function getProtectedData() {
  try {
    return await api.get<{
      user: { id: string; emailAddresses: Array<{ emailAddress: string }> };
    }>("/protected");
  } catch {
    return null;
  }
}

export default async function Home() {

  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
}
