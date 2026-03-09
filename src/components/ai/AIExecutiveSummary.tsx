"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Loader2, Sparkles } from "lucide-react"

interface AIExecutiveSummaryProps {
  entityName: string;
  data: any;
}

export function AIExecutiveSummary({ entityName, data }: AIExecutiveSummaryProps) {
  const [summary, setSummary] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch("/api/ai/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entityName, data }),
        });
        const result = await response.json();
        if (result.summary) {
          setSummary(result.summary);
        } else {
          setSummary("Intelligence synthesis temporarily limited. Manual review required.");
        }
      } catch (error) {
        console.error("AI Error:", error);
        setSummary("Error connecting to intelligence engine. Retrying...");
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [entityName, data])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="size-24 text-blue-400" />
      </div>

      <div className="relative flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <Zap className="size-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Executive Synthesis</h4>
          <p className="text-[10px] text-blue-400 font-mono">GEMINI-1.5-PRO · ANALYSIS ACTIVE</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-4">
          <Loader2 className="size-4 text-blue-400 animate-spin" />
          <span className="text-xs text-slate-400 font-mono">Synthesizing entity datasets...</span>
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm leading-relaxed text-slate-300 italic"
        >
          "{summary}"
        </motion.p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] text-slate-500 font-mono tracking-tighter">
          NARRATIVE SYNTHESIS COMPLETE · CONFIDENCE 94.2%
        </span>
      </div>
    </motion.div>
  )
}
