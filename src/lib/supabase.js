import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://ydggumbexytbsqgodljo.supabase.co'
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZ2d1bWJleHl0YnNxZ29kbGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NzA0MDYsImV4cCI6MjEwMTQ0NjQwNn0.iO0652aId5cTWhzutuZ1u0cM9_fISN5N3IxoD5yDcns'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)