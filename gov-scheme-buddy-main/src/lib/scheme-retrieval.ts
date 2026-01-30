import { supabase } from "@/integrations/supabase/client";

export async function fetchSchemesFromDB(
  category: string,
  ageGroup: string,
  status?: string
) {
  let query = supabase
    .from("schemes")
    .select("*")
    .eq("category", category)
    .eq("age_group", ageGroup);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase fetch error:", error);
    throw error;
  }

  return data;
}
