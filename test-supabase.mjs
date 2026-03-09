import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase URL or Anon Key in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function runTest() {
  console.log(`🔌 Testing connection to: ${supabaseUrl}`)
  
  // 1. Test basic connectivity (Ping)
  console.log("\n--- Step 1: Basic Ping ---")
  const { data, error } = await supabase.from('profiles').select('id').limit(1)
  
  if (error) {
    if (error.code === '42P01') {
      console.log("❌ Error: The 'profiles' table does not exist. The SQL script did not run successfully.")
    } else if (error.message.includes('permission denied') || error.message.includes('row-level security')) {
      console.log("✅ Success: Reached the database! (RLS blocked the read, which is expected for unauthenticated users).")
    } else {
      console.log("⚠️ Warning during ping:", error.message)
    }
  } else {
     console.log("✅ Success: Reached the database and read the profiles table.")
  }

  // 2. Test Auth Service
  console.log("\n--- Step 2: Auth Service Check ---")
  const email = `test.${Date.now()}@example.com`
  const password = "SecurePassword123!"
  
  console.log(`Attempting to sign up dummy user: ${email}`)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: "Script Test Agent",
        organization_type: "Test"
      }
    }
  })

  if (authError) {
    console.error("❌ Auth Error:", authError.message)
    if (authError.message.toLowerCase().includes('rate limit')) {
      console.log("👉 Note: This means the backend is perfectly connected, but Supabase is rate-limiting the creation of new users on your IP/Account.")
    }
  } else {
    console.log("✅ Auth Success! User created.")
    console.log("User ID:", authData.user?.id)
  }
}

runTest()
