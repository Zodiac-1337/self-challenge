import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// null если переменные не заданы — приложение работает без синхронизации
export const supabase = url && key ? createClient(url, key) : null;
