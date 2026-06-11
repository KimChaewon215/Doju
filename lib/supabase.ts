import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ── Users ──────────────────────────────────────────────
export async function upsertUser(
  userId: string,
  nickname: string,
  character: string
) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .upsert({ id: userId, nickname, character }, { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ── Escapes ────────────────────────────────────────────
export async function createEscape(payload: {
  user_id: string;
  task_name: string;
  task_difficulty: number;
  days_escaped: number;
  current_status: string;
  status_coefficient: number;
  distance_km: number;
  wanted_level: string;
  penalty: string;
  location: string;
}) {
  if (!supabase) return payload;

  const { data, error } = await supabase
    .from("escapes")
    .insert({ ...payload, is_captured: false })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function captureEscape(escapeId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("escapes")
    .update({
      is_captured: true,
      captured_at: new Date().toISOString(),
    })
    .eq("id", escapeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserEscapes(userId: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("escapes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getWeeklyRanking() {
  if (!supabase) return [];

  const weekAgo = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data, error } = await supabase
    .from("escapes")
    .select("user_id, distance_km, users(nickname, character)")
    .gte("created_at", weekAgo)
    .order("distance_km", { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

// ── Verdicts ───────────────────────────────────────────
export async function createVerdict(payload: {
  escape_id: string;
  interrogation_answer: string;
  verdict_text: string;
  sentence: string;
}) {
  if (!supabase) return payload;

  const { data, error } = await supabase
    .from("verdicts")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}