import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://tnwfnziaigrgtkcbdpvi.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRud2ZuemlhaWdyZ3RrY2JkcHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1OTU4MDAsImV4cCI6MjEwMzE3MTgwMH0.tsNK4ZPL-SkUa1VgYf99vYU6KuBf4jj6nEjv1B5Aihg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)