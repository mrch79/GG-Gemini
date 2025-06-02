import { NextResponse } from "next/server"
import { fetchFromSupabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    // Check if we have the required environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Supabase environment variables",
          vars: {
            supabaseUrl: !!supabaseUrl,
            supabaseKey: !!supabaseKey,
            SUPABASE_URL: !!process.env.SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          },
        },
        { status: 500 },
      )
    }

    // Try to fetch some data from Supabase
    try {
      const data = await fetchFromSupabase("properties", { limit: 1 })
      return NextResponse.json({
        success: true,
        message: "Supabase connection successful",
        data,
        env: {
          supabaseUrl: supabaseUrl.substring(0, 10) + "...",
          supabaseKey: supabaseKey.substring(0, 5) + "...",
        },
      })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          env: {
            supabaseUrl: supabaseUrl.substring(0, 10) + "...",
            supabaseKey: supabaseKey.substring(0, 5) + "...",
          },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
