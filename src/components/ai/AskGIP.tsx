"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, Sidebar } from "lucide-react"

import { useChat } from "@ai-sdk/react"

export function AskGIP() {
  const [isOpen, setIsOpen] = React.useState(false)
  // @ts-expect-error - Type mismatch between ai and @ai-sdk/react versions
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/ai/chat",
    initialMessages: [
      { id: "welcome", role: "assistant", content: "I am GIP.OS Intelligence. How can I assist with your investigation today?" } as any
    ]
  } as any)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 size-14 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center z-50 border border-blue-400/30"
      >
        <Sparkles className="size-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-96 h-[500px] rounded-3xl border border-white/10 bg-[#0A1423]/90 backdrop-blur-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-blue-600/10">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <Bot className="size-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tighter">Ask GIP Intelligence</h4>
                  <p className="text-[10px] text-blue-400 font-mono">GEMINI-1.5-PRO · ONLINE</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m: any, i: number) => (
                <motion.div
                  initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={m.id || i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.role === "user" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white/5 text-slate-300 border border-white/5"
                  }`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center gap-2">
                    <Loader2 className="size-3 text-blue-400 animate-spin" />
                    <span className="text-[10px] text-slate-500 font-mono">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-white/2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask about an entity or risk factor..."
                  value={input}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  <Send className="size-3" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
