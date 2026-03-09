"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { GlassNav } from "@/components/layout/GlassNav"
import { Eye, EyeOff, Lock, Network, Shield } from "lucide-react"

// ── Supabase client ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── Tiny helpers ─────────────────────────────────────────────────────────────
const ICE = "#0EA5E9"
const RED = "#EF4444"

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  children,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  children?: React.ReactNode
}) {
  return (
    <div>
      <label
        style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => {
            e.target.style.border = `1px solid ${ICE}55`
            e.target.style.boxShadow = `0 0 0 1px ${ICE}30`
          }}
          onBlur={(e) => {
            e.target.style.border = "1px solid rgba(255,255,255,0.1)"
            e.target.style.boxShadow = "none"
          }}
        />
        {children}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"signin" | "register">("signin")

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [orgType, setOrgType] = useState("")
  const [showPw, setShowPw] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // ── SIGN IN ────────────────────────────────────────────────────────────────
  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return setError("Email and password are required.")
    setLoading(true)
    setError("")
    setMessage("")

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push("/dashboard")
  }

  // ── SIGN UP ────────────────────────────────────────────────────────────────
  async function signUp(e: React.FormEvent) {
    e.preventDefault()

    if (!fullName.trim()) return setError("Full name is required.")
    if (!email.trim()) return setError("Email address is required.")
    if (password.length < 6) return setError("Password must be at least 6 characters.")
    if (!orgType) return setError("Please select your organization type.")

    setLoading(true)
    setError("")
    setMessage("")

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName.trim(), organization_type: orgType },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // If email confirmation is OFF → user is logged in immediately
    if (data.session) {
      router.push("/dashboard")
      return
    }

    // If email confirmation is ON → tell user to check inbox
    setMessage("Account created! Check your email for a confirmation link, then sign in.")
    setMode("signin")
  }

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <GlassNav />

      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "20%", left: "15%", width: 500, height: 500, background: `radial-gradient(circle, ${ICE}12 0%, transparent 70%)`, borderRadius: "50%", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 24px 48px" }}>
        <div
          style={{
            width: "100%", maxWidth: 448,
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s, transform 0.5s",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", width: 56, height: 56, alignItems: "center", justifyContent: "center", borderRadius: 16, background: `${ICE}18`, border: `1px solid ${ICE}35`, marginBottom: 16 }}>
              <Network size={28} color={ICE} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "monospace", letterSpacing: "0.1em", margin: 0 }}>
              GIP<span style={{ color: ICE }}>.</span>OS
            </h1>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Global Intelligence Platform</p>
          </div>

          {/* Card */}
          <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.06)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.1)" }}>

            {/* Tab switcher */}
            <div style={{ display: "flex", padding: "12px 12px 0", gap: 4 }}>
              {(["signin", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); setMessage("") }}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s",
                    background: mode === m ? `${ICE}22` : "transparent",
                    color: mode === m ? ICE : "#64748b",
                    outline: mode === m ? `1px solid ${ICE}40` : "none",
                  }}
                >
                  {m === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={mode === "signin" ? signIn : signUp} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Error */}
              {error && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: `${RED}15`, border: `1px solid ${RED}30`, color: RED, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                  <Shield size={14} />
                  {error}
                </div>
              )}

              {/* Success message */}
              {message && (
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: 13 }}>
                  {message}
                </div>
              )}

              {/* Register-only fields */}
              {mode === "register" && (
                <InputField label="Full Name" value={fullName} onChange={setFullName} placeholder="Your full name" required />
              )}

              <InputField label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" required />

              {/* Password with eye toggle */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
                  {mode === "signin" && <span style={{ fontSize: 12, color: ICE, cursor: "pointer" }}>Forgot password?</span>}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    style={{ width: "100%", padding: "12px 44px 12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => { e.target.style.border = `1px solid ${ICE}55`; e.target.style.boxShadow = `0 0 0 1px ${ICE}30` }}
                    onBlur={(e) => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none" }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Register-only org type */}
              {mode === "register" && (
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Organization Type
                  </label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                    required
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,20,35,0.8)", color: "#cbd5e1", fontSize: 14, outline: "none" }}
                  >
                    <option value="">Select organization type…</option>
                    <option>Investigative Journalist</option>
                    <option>Law Firm</option>
                    <option>Compliance / KYC Team</option>
                    <option>Private Equity / Hedge Fund</option>
                    <option>Government / Regulator</option>
                    <option>Academic Researcher</option>
                    <option>NGO / Anti-Corruption</option>
                  </select>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer",
                  background: `linear-gradient(135deg, ${ICE}, #38BDF8)`,
                  boxShadow: `0 0 24px ${ICE}50`,
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.2s, transform 0.1s",
                }}
              >
                {loading
                  ? (mode === "signin" ? "Signing in…" : "Creating account…")
                  : (mode === "signin" ? "Sign In to Platform" : "Create Account")
                }
              </button>

              {/* Trust badges */}
              <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#475569" }}>
                  <Lock size={11} /> End-to-end encrypted
                </div>
                <div style={{ width: 1, background: "#334155" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#475569" }}>
                  <Shield size={11} /> Zero-knowledge storage
                </div>
              </div>
            </form>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#475569", marginTop: 24 }}>
            By continuing you agree to our Terms of Service and Editorial Standards.
          </p>
        </div>
      </div>
    </div>
  )
}
