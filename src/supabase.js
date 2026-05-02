import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wthqllslfcavpqtymtqc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0aHFsbHNsZmNhdnBxdHltdHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NDk0MjQsImV4cCI6MjA5MzIyNTQyNH0.8k_orCidRWWXIb9hHEsgpieoTPaIcPqjJwMxndjeNPE";

export const supabase = createClient(supabaseUrl, supabaseKey);