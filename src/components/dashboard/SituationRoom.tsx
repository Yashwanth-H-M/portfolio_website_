"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Activity, X, Globe, TrendingUp, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Newspaper, 
  RefreshCcw, ShieldAlert
} from "lucide-react"
import { DataFeedService } from "@/lib/services/DataFeedService"

const ICE = "#0EA5E9"
const RED = "#EF4444"
const GREEN = "#22C55E"
const AMBER = "#F59E0B"

interface SituationRoomProps {
  isOpen: boolean
  onClose: () => void
}

export function SituationRoom({ isOpen, onClose }: SituationRoomProps) {
  const [news, setNews] = React.useState<any[]>([])
  const [market, setMarket] = React.useState<any[]>([])
  const [alerts, setAlerts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchData = React.useCallback(async () => {
    setLoading(true)
    try {
      const [newsData, marketData, alertData] = await Promise.all([
        DataFeedService.getLiveNews(),
        DataFeedService.getMarketPulse(),
        DataFeedService.getSanctionsAlerts()
      ])
      setNews(newsData)
      setMarket(marketData)
      setAlerts(alertData)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen, fetchData])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#020617]/80 backdrop-blur-[40px] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl flex items-center justify-center bg-blue-500/20 border border-blue-500/30">
                  <Activity className="size-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-mono">Situation Room</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Unified Intel Hub</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchData}
                  className="size-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <RefreshCcw className={`size-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button 
                  onClick={onClose}
                  className="size-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                  <X className="size-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Content Swiper / Scroll */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 custom-scrollbar">
              
              {/* Global Sanctions Alerts */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldAlert className="size-3.5 text-red-500" />
                  Real-Time Risk Radar
                </div>
                <div className="space-y-3">
                  {loading && news.length === 0 ? (
                    [0,1].map(i => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)
                  ) : alerts.map((a, i) => (
                    <div key={i} className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-5"><ShieldAlert className="size-12" /></div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-red-400 uppercase">{a.type}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(a.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{a.entity}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">{a.regime} Sanctions Designation</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Market Movers */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <TrendingUp className="size-3.5 text-blue-500" />
                  Live Market Pulse
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {loading && market.length === 0 ? (
                    <div className="h-20 bg-white/5 rounded-xl animate-pulse" />
                  ) : market.map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${m.isDown ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                          {m.isDown ? <ArrowDownRight className="size-4 text-red-400" /> : <ArrowUpRight className="size-4 text-green-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{m.symbol}</div>
                          <div className="text-[10px] text-slate-500 uppercase tracking-tighter">Global Index Proxy</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-white text-3xl">${Number(m.price).toFixed(2)}</div>
                        <div className={`text-[11px] font-bold ${m.isDown ? 'text-red-400' : 'text-green-400'}`}>
                          {m.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Geopolitical News Feed */}
              <section className="space-y-4 pb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Newspaper className="size-3.5 text-amber-500" />
                  Intel Wire (NewsAPI)
                </div>
                <div className="space-y-4">
                  {loading && news.length === 0 ? (
                    [0,1,2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)
                  ) : news.map((n, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                        {n.urlToImage && (
                          <div className="size-16 rounded-lg bg-slate-800 shrink-0 overflow-hidden border border-white/5">
                            <img src={n.urlToImage} alt="" className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">{n.title}</h4>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{n.source?.name}</span>
                            <span className="text-[10px] text-slate-600 font-mono italic">{new Date(n.publishedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer / CTA */}
            <div className="p-6 border-t border-white/5 bg-black/20">
              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Globe className="size-3.5" /> Full Intelligence Briefing
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
