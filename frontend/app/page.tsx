import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@clerk/nextjs/server";
import { api } from "@/lib/api-server";

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
  const data = await getProtectedData();

  if (!data) {
    return (
      <div className="p-4 text-red-600">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>Failed to fetch protected data. Are you signed in?</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      ali Raza
      <ThemeToggle />
      {/*<pre>{ JSON.stringify(aut, null, 2)}</pre>*/}
      <div className="max-w-4xl mx-auto">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
