import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
                    supabaseAnonKey && 
                    supabaseUrl !== 'your_supabase_url' && 
                    supabaseAnonKey !== 'your_supabase_anon_key' &&
                    !supabaseUrl.includes('placeholder');

if (!isConfigured) {
  console.warn('Supabase configuration missing - using placeholder values');
  console.warn('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_anon_key'
);

export const isSupabaseConfigured = () => isConfigured;

export type PandaProfile = {
  id: string;
  name: string;
  mood?: string;
  created_at: string;
  has_purchased?: boolean;
};

export type StripeSubscription = {
  customer_id: string;
  subscription_id: string | null;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  status: string;
};