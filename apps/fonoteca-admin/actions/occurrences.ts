"use server"

import { createFonotecaServer } from "@/utils/supabase/fonoteca/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { OccurrenceInput, occurrenceSchema } from "@/lib/validations/fonoteca";
import { Occurrence } from "@/types/fonoteca";

export async function getOccurrences({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("occurrences")
    .select("*, taxa(*), locations(*)", { count: "exact" });

  if (search) {
    query = query.or(`occurrenceID.ilike.%${search}%,recordedBy.ilike.%${search}%,catalogNumber.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("error fetching occurrences:", error);
    return { data: [] as Occurrence[], count: 0, error: error.message };
  }

  // Map supabase structure to our expected nested structure
  const formattedData = (data || []).map((item: any) => ({
    ...item,
    taxon: item.taxa,
    location: item.locations,
  })) as Occurrence[];

  return {
    data: formattedData,
    count: count || 0,
  };
}

export async function getOccurrence(id: string) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { data, error } = await supabase
    .from("occurrences")
    .select("*, taxa(*), locations(*)")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  const formattedData = {
    ...data,
    taxon: data.taxa,
    location: data.locations,
  } as Occurrence;

  return { data: formattedData };
}

export async function createOccurrence(input: OccurrenceInput) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  // Get current user profile ID to link correctly
  const { data: { user } } = await supabase.auth.getUser();
  let profileId = "00000000-0000-0000-0000-000000000000"; // Fallback

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", user.id)
      .single();
    if (profile) profileId = profile.id;
  }

  // Inject real profile ID BEFORE validation
  const dataToValidate = {
    ...input,
    profile_id: profileId,
  };

  const parsed = occurrenceSchema.safeParse(dataToValidate);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("occurrences")
    .insert([parsed.data])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/occurrences");
  return { success: true, data: (data as any) as Occurrence };
}

export async function updateOccurrence(id: string, input: OccurrenceInput) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const parsed = occurrenceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("occurrences")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/occurrences");
  revalidatePath(`/dashboard/occurrences/${id}`);
  return { success: true, data: (data as any) as Occurrence };
}

export async function deleteOccurrence(id: string) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { error } = await supabase
    .from("occurrences")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/occurrences");
  return { success: true };
}

export async function bulkCreateOccurrences(inputs: any[]) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  let profileId = "00000000-0000-0000-0000-000000000000";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("id").eq("auth_id", user.id).single();
    if (profile) profileId = profile.id;
  }

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const input of inputs) {
    const dataToValidate = { ...input, profile_id: profileId };
    const parsed = occurrenceSchema.safeParse(dataToValidate);
    
    if (!parsed.success) {
      errorCount++;
      errors.push(`ID ${input.occurrenceID || '?'}: Error validación de campos`);
      continue;
    }

    const { error } = await supabase.from("occurrences").insert([parsed.data]);
    if (error) {
      errorCount++;
      errors.push(`ID ${input.occurrenceID || '?'}: ${error.message}`);
    } else {
      successCount++;
    }
  }

  revalidatePath("/dashboard/occurrences");
  return { success: true, successCount, errorCount, errors };
}
