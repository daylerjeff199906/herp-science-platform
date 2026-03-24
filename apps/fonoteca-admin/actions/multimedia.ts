"use server"

import { createFonotecaServer } from "@/utils/supabase/fonoteca/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { MultimediaInput, multimediaSchema } from "@/lib/validations/fonoteca";
import { Multimedia } from "@/types/fonoteca";

export async function getMultimediaList({
  page = 1,
  limit = 10,
  occurrence_id = "",
  type = "",
}: {
  page?: number;
  limit?: number;
  occurrence_id?: string;
  type?: string;
}) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("multimedia")
    .select("*, occurrences(*, taxa(*))", { count: "exact" });

  if (occurrence_id) {
    query = query.eq("occurrence_id", occurrence_id);
  }

  if (type) {
    query = query.eq("type", type);
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("error fetching multimedia:", error);
    return { data: [] as Multimedia[], count: 0, error: error.message };
  }

  const formattedData = (data || []).map((item: any) => ({
    ...item,
    occurrence: item.occurrences ? {
      ...item.occurrences,
      taxon: item.occurrences.taxa
    } : undefined
  })) as Multimedia[];

  return {
    data: formattedData,
    count: count || 0,
  };
}

export async function getMultimedia(id: string) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { data, error } = await supabase
    .from("multimedia")
    .select("*, occurrences(*, taxa(*))")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  const formattedData = {
    ...data,
    occurrence: data.occurrences ? {
      ...data.occurrences,
      taxon: data.occurrences.taxa
    } : undefined
  } as Multimedia;

  return { data: formattedData };
}

export async function createMultimedia(input: MultimediaInput) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const parsed = multimediaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("multimedia")
    .insert([parsed.data])
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/multimedia");
  return { success: true, data: (data as any) as Multimedia };
}

export async function updateMultimedia(id: string, input: MultimediaInput) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const parsed = multimediaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { data, error } = await supabase
    .from("multimedia")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/multimedia");
  revalidatePath(`/dashboard/multimedia/${id}`);
  return { success: true, data: (data as any) as Multimedia };
}

export async function deleteMultimedia(id: string) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { error } = await supabase
    .from("multimedia")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/multimedia");
  return { success: true };
}

export async function bulkUpdateMultimediaIndexes(updates: { id: string; order_index: number }[]) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  for (const update of updates) {
    await supabase
      .from("multimedia")
      .update({ order_index: update.order_index })
      .eq("id", update.id);
  }

  revalidatePath("/dashboard/multimedia");
  return { success: true };
}

export async function updateMultimediaSpectrogram(id: string, spectrogram_url: string) {
  const cookieStore = await cookies();
  const supabase = await createFonotecaServer(cookieStore);

  const { error } = await supabase
    .from("multimedia")
    .update({ spectrogram_url })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/multimedia");
  return { success: true };
}
