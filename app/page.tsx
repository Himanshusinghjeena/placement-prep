import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase.from("test").select("*");
  console.log("DATA:", data);
  console.log("ERROR:", error);

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Placement Prep Platform 🚀
      </h1>
      <Button>Click me</Button>

    </main>
  );
}