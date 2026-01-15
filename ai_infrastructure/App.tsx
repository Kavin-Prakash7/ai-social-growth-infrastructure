import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, TrendingUp, Users, DollarSign, Search, Sparkles, Settings, Bell, 
  Clock, BarChart2, Zap, ChevronRight, PlayCircle, Activity, Mail, Megaphone, 
  Command, ArrowRight, Eye, FileText, Circle, Target, Sword, BrainCircuit, PenTool
} from 'lucide-react';
import { fetchYouTubeData } from './services/youtubeService';
import { analyzeChannelData } from './services/geminiService';
import { DashboardData, AnalysisResult } from './types';
import StatCard from './components/StatCard';
import VideoChart from './components/VideoChart';
import RecentVideoList from './components/RecentVideoList';
import AnalyticsView from './components/AnalyticsView';
import PerformanceListView from './components/PerformanceListView';
import PerformanceDetailView from './components/PerformanceDetailView';
import EmailAgentView from './components/EmailAgentView';
import TemplateAgentView from './components/TemplateAgentView';
import ScriptAgentView from './components/ScriptAgentView';
import PromotionView from './components/PromotionView';
import CompetitorView from './components/CompetitorView';
import BlueWaveBackground from './components/BlueWaveBackground';

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
};

interface MenuItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
  color: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, active, onClick, badge, color }) => (
    <div 
        onClick={onClick}
        className={`flex items-center justify-between px-5 py-3.5 rounded-3xl cursor-pointer transition-all duration-500 mb-2 group relative overflow-hidden ${
        active 
            ? 'bg-white/[0.08] text-white border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md' 
            : 'text-white/30 hover:bg-white/[0.03] hover:text-white border border-transparent'
    }`}>
        {active && (
            <div className={`absolute inset-y-0 left-0 w-1 shadow-[0_0_20px_rgba(255,255,255,0.8)]`} style={{ backgroundColor: color }}></div>
        )}
        <div className="flex items-center gap-4 relative z-10">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border border-white/5 ${
                active ? 'bg-white/10 opacity-100' : 'bg-white/[0.02] group-hover:bg-white/5 opacity-60'
            }`} style={{ color: color, boxShadow: active ? `0 0 15px ${color}44` : 'none' }}>
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            </div>
            <span className={`text-[12px] tracking-tight ${active ? 'font-black uppercase' : 'font-bold'}`}>{label}</span>
        </div>
        {badge && (
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md relative z-10 ${active ? 'bg-white text-black' : 'bg-white/10 text-white/30'}`}>
                {badge}
            </span>
        )}
    </div>
);

export default function App() {
  const [startupStage, setStartupStage] = useState<'splash' | 'ready'>('splash');
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'content' | 'analytics' | 'performance' | 'benchmarks' | 'email_agent' | 'template_agent' | 'script_agent' | 'promotion'>('settings');
  const [channelId, setChannelId] = useState<string>(''); 
  const [competitorId, setCompetitorId] = useState<string>(''); 
  const [data, setData] = useState<DashboardData | null>(null);
  const [competitorData, setCompetitorData] = useState<DashboardData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [compLoading, setCompLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerformanceVideoId, setSelectedPerformanceVideoId] = useState<string | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStartupStage('ready'), 2200);
    return () => { clearTimeout(t1); };
  }, []);

  const emptyData: DashboardData = {
    channel: {
        id: '', title: 'UNLINKED_CORE', subscriberCount: 0, videoCount: 0, viewCount: 0, 
        avgViewsLifetime: 0, watchTimeHours: 0, engagementRate: 0, avgLikesPerVideo: 0, 
        avgCommentsPerVideo: 0, topOutlierScore: 0, uploadConsistency: 'Irregular', 
        avgDurationLabel: '0m', estimatedRevenue: 0, avatarUrl: 'https://ui-avatars.com/api/?name=?&background=6b21a8&color=fff'
    },
    videos: [], comments: [], mockStrategies: [
        { type: 'START', title: 'Sync Required', description: 'Enter a valid channel handle (@name) or ID to generate neural growth vectors.', impactScore: 0 }
    ]
  };

  const dashboardData = data || emptyData;

  const handleLoadData = async () => {
    if (!channelId.trim()) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await fetchYouTubeData(channelId.trim());
      setData(result);
      setCurrentView('dashboard');
      setLoading(false); 

      // Background heavy analysis
      analyzeChannelData(result).then(aiResult => {
        setAnalysis(aiResult);
      }).catch(aiErr => {
        console.warn("Background AI Analysis failed:", aiErr);
      });
      
    } catch (err: any) { 
      setError(err.message || "Connection failed.");
      setCurrentView('settings');
      setLoading(false);
    }
  };

  const handleLoadCompetitor = async () => {
    if (!competitorId.trim()) return;
    setCompLoading(true);
    try {
      const result = await fetchYouTubeData(competitorId.trim());
      setCompetitorData(result);
    } catch (err) { console.error(err); }
    finally { setCompLoading(false); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-black">
      <BlueWaveBackground />
      
      {startupStage === 'splash' && (
        <div className="ZODZY-loader">
          <div className="shutter shutter-top"></div>
          <div className="shutter shutter-bottom"></div>
          <div className="zodzy-text pulse">ZODZY</div>
        </div>
      )}

      {startupStage === 'ready' && (
        <div className={`w-full max-w-[1700px] z-10 transition-all duration-1000 opacity-100 scale-100`}>
          <div className="glass-container flex min-h-[920px] overflow-hidden">
            
            <aside className="w-[300px] flex flex-col border-r border-white/5 p-8 bg-transparent">
              <div className="flex items-center gap-5 mb-16 px-2">
                 <div className="w-12 h-12 rounded-[1.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/20 flex items-center justify-center shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
                   <Sparkles size={24} className="text-white" />
                 </div>
                 <span className="font-black text-2xl text-white tracking-tighter italic font-manrope">ZODZY</span>
              </div>

              <nav className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
                  <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em] mb-8 px-4">CORE INTERFACE</p>
                  <MenuItem color="#3b82f6" icon={LayoutGrid} label="Overview" active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} />
                  <MenuItem color="#f59e0b" icon={PlayCircle} label="Content" active={currentView === 'content'} onClick={() => setCurrentView('content')} />
                  <MenuItem color="#a855f7" icon={BarChart2} label="Algorithm" active={currentView === 'analytics'} onClick={() => setCurrentView('analytics')} />
                  <MenuItem color="#10b981" icon={Activity} label="Performance" active={currentView === 'performance'} onClick={() => { setSelectedPerformanceVideoId(null); setCurrentView('performance'); }} />
                  <MenuItem color="#ef4444" icon={Sword} label="Benchmarks" active={currentView === 'benchmarks'} onClick={() => setCurrentView('benchmarks')} />
                  
                  <div className="pt-12">
                    <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em] mb-8 px-4">GROWTH AGENTS</p>
                    <MenuItem color="#fbbf24" icon={Mail} label="Email Core" active={currentView === 'email_agent'} onClick={() => setCurrentView('email_agent')} badge="BETA" />
                    <div className="pl-3 py-1 space-y-1">
                        <MenuItem color="#8b5cf6" icon={FileText} label="Templates" active={currentView === 'template_agent'} onClick={() => setCurrentView('template_agent')} />
                        <MenuItem color="#f97316" icon={PenTool} label="Scripts" active={currentView === 'script_agent'} onClick={() => setCurrentView('script_agent')} />
                    </div>
                    <MenuItem color="#ec4899" icon={Megaphone} label="Promotion" active={currentView === 'promotion'} onClick={() => setCurrentView('promotion')} />
                  </div>
              </nav>
              
              <div className="mt-auto pt-10 border-t border-white/5">
                  <MenuItem color="#94a3b8" icon={Settings} label="System Config" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
              </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-transparent">
              <div className="h-20 border-b border-white/5 flex items-center justify-between px-12 bg-white/[0.02] backdrop-blur-3xl">
                 <div className="flex items-center gap-8">
                   <div className="window-dots flex gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/30"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30"></div>
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/30"></div>
                   </div>
                   <div className="h-6 w-px bg-white/10"></div>
                   <div className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 flex items-center gap-4 italic">
                     <Circle size={8} fill="currentColor" className="text-blue-500 animate-pulse" />
                     SYS_BRIDGE::{currentView.toUpperCase().replace('_', ' ')}
                   </div>
                 </div>
                 <div className="flex items-center gap-8">
                   <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 px-6 py-2.5 rounded-[1.5rem] backdrop-blur-xl shadow-2xl">
                     <img src={dashboardData.channel.avatarUrl} className="w-8 h-8 rounded-full border-2 border-blue-500/50" alt="" />
                     <span className="text-[10px] font-black text-white/70 tracking-widest uppercase italic">{dashboardData.channel.title}</span>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                      <Bell size={20} />
                   </div>
                 </div>
              </div>

              <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-8">
                    <div className="w-20 h-20 border-[6px] border-blue-950 border-t-blue-500 rounded-full animate-spin shadow-[0_0_60px_rgba(59,130,246,0.3)]"></div>
                    <div className="text-center">
                      <p className="text-[14px] font-black uppercase tracking-[1em] text-blue-400 animate-pulse">Syncing Neural Core</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[1450px] mx-auto h-full">
                    {currentView === 'settings' && (
                      <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in duration-700">
                        <div className="text-center mb-16">
                          <div className="w-28 h-28 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 rounded-[3rem] border border-white/10 flex items-center justify-center mb-8 shadow-2xl mx-auto backdrop-blur-3xl">
                            <Settings className="text-white" size={42} />
                          </div>
                          <h2 className="text-5xl font-black mb-4 tracking-tighter italic font-manrope text-white">System Config</h2>
                          <p className="text-white/30 text-sm font-bold uppercase tracking-[0.4em]">Calibrate neural growth vectors</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="tracker-card p-10 border-blue-500/20 bg-gradient-to-br from-blue-600/5 to-transparent">
                            <div className="flex items-center gap-5 mb-10">
                              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-xl">
                                 <Users size={24} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Primary Bridge</h3>
                              </div>
                            </div>
                            <div className="relative group mb-6">
                              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-blue-400 transition-colors" size={20} />
                              <input 
                                value={channelId} 
                                onChange={(e) => setChannelId(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleLoadData()}
                                placeholder="Enter @handle" 
                                className="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] pl-16 pr-6 py-6 text-sm font-bold text-white placeholder:text-white/5 focus:outline-none focus:border-blue-500/50 transition-all font-manrope italic"
                              />
                            </div>
                            <button onClick={handleLoadData} className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/40 border border-white/10">Initialize Sync</button>
                            {error && <p className="mt-6 text-[10px] text-red-500 font-black uppercase tracking-[0.4em] text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20 animate-bounce">{error}</p>}
                          </div>

                          <div className="tracker-card p-10 border-orange-500/20 bg-gradient-to-br from-orange-600/5 to-transparent">
                            <div className="flex items-center gap-5 mb-10">
                              <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-xl">
                                 <Target size={24} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Rival Node</h3>
                              </div>
                            </div>
                            <div className="relative group mb-6">
                              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-orange-400 transition-colors" size={20} />
                              <input 
                                value={competitorId} 
                                onChange={(e) => setCompetitorId(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleLoadCompetitor()}
                                placeholder="Enter Rival @handle" 
                                className="w-full bg-white/[0.02] border border-white/5 rounded-[1.5rem] pl-16 pr-6 py-6 text-sm font-bold text-white placeholder:text-white/5 focus:outline-none focus:border-orange-500/50 transition-all font-manrope italic"
                              />
                            </div>
                            <button onClick={handleLoadCompetitor} disabled={compLoading} className="w-full py-6 bg-orange-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-orange-500 transition-all shadow-2xl shadow-orange-600/40 border border-white/10">
                              {compLoading ? "Handshaking..." : "Link Rival"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentView === 'dashboard' && (
                      <div className="space-y-12 pb-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                          <StatCard label="Reach Velocity" value={formatNumber(dashboardData.channel.viewCount)} icon={Eye} trend="neutral" subValue="0%" />
                          <StatCard label="Session Gravity" value={formatNumber(dashboardData.channel.watchTimeHours)} icon={Clock} trend="neutral" subValue="0%" />
                          <StatCard label="Growth Pulse" value={formatNumber(dashboardData.channel.subscriberCount)} icon={Users} trend="neutral" subValue="0" />
                          <StatCard label="Yield Index" value={`$${formatNumber(dashboardData.channel.estimatedRevenue)}`} icon={DollarSign} trend="neutral" subValue="0%" />
                        </div>

                        <div className="grid grid-cols-12 gap-10">
                          <div className="col-span-12 xl:col-span-8 tracker-card p-12 h-[600px] flex flex-col">
                             <div className="flex justify-between items-center relative z-10 mb-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-2xl">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                       <span className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Algorithm Pulse</span>
                                       <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em] mt-3">Neural reach across temporal vectors</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8 bg-black/40 px-8 py-3 rounded-3xl border border-white/10 backdrop-blur-3xl">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Efficiency</span>
                                        <span className="text-sm font-black text-emerald-400 italic">94.2%</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10"></div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-black text-white/70 uppercase tracking-widest">Active Link</span>
                                    </div>
                                </div>
                             </div>
                             <div className="flex-1 relative z-10">
                                {dashboardData.videos.length > 0 ? (
                                    <VideoChart data={dashboardData.videos} />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-white/5 border border-dashed border-white/5 rounded-[3rem]">
                                        <BarChart2 size={100} className="mb-8 opacity-5" strokeWidth={1} />
                                        <p className="text-[11px] font-black uppercase tracking-[1em]">Establishing Link</p>
                                    </div>
                                )}
                             </div>
                          </div>
                          
                          <div className="col-span-12 xl:col-span-4 tracker-card p-12 h-[600px] flex flex-col justify-between">
                              <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-2xl">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                       <span className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Strategic Core</span>
                                    </div>
                                </div>
                             </div>
                             <div className="mt-10 relative z-10 flex-1 flex flex-col justify-center">
                                 <p className="text-[10px] font-black text-orange-400/50 uppercase tracking-[0.5em] mb-6">Priority Growth Vector</p>
                                 <div className="p-10 bg-orange-600/5 border border-orange-500/20 rounded-[3rem] backdrop-blur-3xl relative overflow-hidden group min-h-[160px] flex items-center justify-center">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[60px] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000"></div>
                                     {analysis ? (
                                         <div className="relative z-10 w-full animate-in fade-in duration-1000">
                                             <h4 className="text-3xl font-black text-white italic tracking-tighter mb-4 leading-tight uppercase">{(analysis.strategies || [])[0]?.title || "Compute Complete"}</h4>
                                             <p className="text-sm text-white/40 font-bold italic leading-relaxed line-clamp-4">{(analysis.strategies || [])[0]?.description || "Neural analysis complete."}</p>
                                         </div>
                                     ) : (
                                         <div className="relative z-10 flex flex-col items-center gap-4 text-white/20">
                                             <div className="w-8 h-8 border-2 border-white/10 border-t-orange-500 rounded-full animate-spin"></div>
                                             <p className="text-[10px] font-black uppercase tracking-widest">Synthesizing Intelligence...</p>
                                         </div>
                                     )}
                                 </div>
                             </div>
                             <button className="relative z-10 w-full bg-white text-black py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all duration-500 mt-6 shadow-2xl shadow-white/5 border border-white/10 group">
                                 Execute Vector <ArrowRight size={16} className="inline ml-3 group-hover:translate-x-2 transition-transform" />
                             </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentView === 'content' && <RecentVideoList videos={dashboardData.videos} />}
                    {currentView === 'analytics' && <AnalyticsView videos={dashboardData.videos} competitorsData={competitorData ? [competitorData] : []} />}
                    {currentView === 'performance' && (
                      !selectedPerformanceVideoId ? (
                        <PerformanceListView videos={dashboardData.videos} onSelectVideo={setSelectedPerformanceVideoId} avgChannelViews={dashboardData.channel.avgViewsLifetime} />
                      ) : (
                        <PerformanceDetailView video={dashboardData.videos.find(v => v.id === selectedPerformanceVideoId)!} onBack={() => setSelectedPerformanceVideoId(null)} avgChannelViews={dashboardData.channel.avgViewsLifetime} />
                      )
                    )}
                    {currentView === 'benchmarks' && <CompetitorView userData={dashboardData} competitorData={competitorData} />}
                    {currentView === 'email_agent' && <EmailAgentView data={dashboardData} url="https://c1fd699f8c05.ngrok-free.app/webhook/145728ae-87b9-4d06-87c8-c08971e56971/chat" />}
                    {currentView === 'template_agent' && <TemplateAgentView data={dashboardData} url="https://c1fd699f8c05.ngrok-free.app/webhook/a57d2651-a2c9-4020-af59-d5639de58092/chat" />}
                    {currentView === 'script_agent' && <ScriptAgentView data={dashboardData} />}
                    {currentView === 'promotion' && <PromotionView />}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}