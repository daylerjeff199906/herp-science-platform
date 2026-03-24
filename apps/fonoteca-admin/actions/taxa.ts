"use server"

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { TaxonInput, taxonSchema } from "@/lib/validations/fonoteca";
import { Taxon } from "@/types/fonoteca";
import { createFonotecaServer } from "@/utils/supabase/fonoteca/server";

export async function getTaxa({
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
    .from("taxa")
    .select("*, genus:genera(*, family:families(*))", { count: "exact" });

  if (search) {
    query = query.or(`scientificName.ilike.%${search}%,vernacularName.ilike.%${search}%`);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("error fetching taxa:", error);
    return { data: [] as Taxon[], count: 0, error: error.message };
  }

  return {
    data: (data as any) as Taxon[],
    count: count || 0,
  };
}

export async function getTaxon(id: string) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { data, error } = await supabase
    .from("taxa")
    .select("*, genus:genera(*, family:families(*))")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: (data as any) as Taxon };
}

export async function getGenera() {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { data, error } = await supabase
    .from("genera")
    .select("*, family:families(name)")
    .order("name");

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: data || [] };
}


export async function createTaxon(input: TaxonInput) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const parsed = taxonSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("taxa")
    .insert([parsed.data])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/taxa");
  return { success: true, data: (data as any) as Taxon };
}

export async function updateTaxon(id: string, input: TaxonInput) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const parsed = taxonSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("taxa")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/taxa");
  revalidatePath(`/dashboard/taxa/${id}`);
  return { success: true, data: (data as any) as Taxon };
}

export async function deleteTaxon(id: string) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { error } = await supabase
    .from("taxa")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/taxa");
  return { success: true };
}
