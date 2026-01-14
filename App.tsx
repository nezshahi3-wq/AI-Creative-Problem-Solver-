
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PlusCircle, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  Sparkles,
  RefreshCcw,
  ArrowRight,
  Target,
  Cpu,
  Zap,
  Layers,
  Copy,
  Check,
  Share2,
  Download,
  Info,
  ExternalLink,
  Star,
  BrainCircuit,
  LayoutGrid,
  Wand2,
  Bot,
  HelpCircle,
  Coffee,
  Globe,
  Rocket,
  ShieldCheck,
  Trophy,
  Brain,
  X,
  AlertCircle,
  Search,
  Atom
} from 'lucide-react';
import { TechniqueType, TECHNIQUES, FinalSolution } from './types';
import { analyzeAndSolve } from './services/geminiService';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const PREDEFINED_EXAMPLES = [
  { id: 1, text: "كيف نقلل البلاستيك في المقاهي؟", icon: <Coffee size={14} /> },
  { id: 2, text: "زيادة تفاعل الطلاب في التعلم عن بعد.", icon: <Globe size={14} /> },
  { id: 3, text: "مشروع ناشئ لخدمة كبار السن.", icon: <Rocket size={14} /> },
  { id: 4, text: "نظام نقل ذكي لتقليل الازدحام.", icon: <Zap size={14} /> }
];

const LOADING_MESSAGES = [
  "جاري تحليل سياق المشكلة...",
  "مسح موسوعة تقنيات التفكير الإبداعي...",
  "اختيار استراتيجية الابتكار الأنسب...",
  "توليد مسارات حل غير تقليدية...",
  "هندسة الحلول واختبار منطقيتها...",
  "صياغة المخرجات النهائية بذكاء..."
];

const App: React.FC = () => {
  const [problemInput, setProblemInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [results, setResults] = useState<{
    problem: string;
    technique: typeof TECHNIQUES[keyof typeof TECHNIQUES];
    analysis: string;
    solutions: FinalSolution[];
  } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let interval: number;
    if (loading) {
      interval = window.setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const startInnovation = async (customText?: string) => {
    const textToAnalyze = customText || problemInput;
    if (!textToAnalyze.trim()) {
      addToast('يرجى إدخال وصف للتحدي أولاً', 'info');
      return;
    }
    
    setLoading(true);
    setResults(null);
    try {
      const data = await analyzeAndSolve(textToAnalyze);
      setResults({
        problem: textToAnalyze,
        technique: TECHNIQUES[data.techniqueId as TechniqueType] || TECHNIQUES.SCAMPER,
        analysis: data.analysis,
        solutions: data.solutions
      });
      addToast('تم توليد الحلول الابتكارية بنجاح!', 'success');
    } catch (error) {
      console.error(error);
      addToast('حدث خطأ أثناء محاولة الابتكار. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setProblemInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('تم بدء جلسة جديدة', 'info');
  };

  const handleCopy = (sol: FinalSolution, idx: number) => {
    navigator.clipboard.writeText(`${sol.title}\n${sol.text}`);
    setCopiedIndex(idx);
    addToast('تم نسخ الحل بنجاح', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = () => {
    addToast('ميزة المشاركة ستتوفر قريباً', 'info');
  };

  const handleDownload = () => {
    addToast('جاري تحضير ملف النتائج...', 'info');
  };

  const filteredTechniques = useMemo(() => {
    return Object.values(TECHNIQUES).filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (results) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center font-['Cairo'] relative overflow-x-hidden">
        <header className="w-full max-w-6xl p-4 md:p-8 lg:mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in duration-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
                <Trophy size={24} className="md:hidden" />
                <Trophy size={32} className="hidden md:block" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">مبتكر AI</h1>
                <p className="text-slate-500 font-bold text-[10px] md:text-sm">حلولك الابتكارية جاهزة</p>
              </div>
            </div>
            <button 
              onClick={reset}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl md:rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 text-sm md:text-base"
            >
              <RefreshCcw size={16} />
              تحدي جديد
            </button>
          </div>
        </header>

        <main className="w-full max-w-6xl px-4 md:px-8 space-y-6 md:space-y-8 pb-20">
          {/* Analysis Banner */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-xl shadow-blue-900/5 border border-slate-100 flex flex-col lg:flex-row gap-6 md:gap-10 items-stretch relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none -rotate-12">
              <Brain size={120} className="md:w-[180px] md:h-[180px]" />
            </div>
            
            <div className="flex-1 flex flex-col justify-center relative z-10 text-center md:text-right">
              <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] md:text-[10px] font-black rounded-full uppercase tracking-widest">التحدي</span>
              </div>
              <h2 className="text-lg md:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4 md:mb-6">"{results.problem}"</h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xl">{results.technique.icon}</span>
                    <span className="font-bold text-slate-700 text-xs md:text-sm">{results.technique.name}</span>
                 </div>
              </div>
            </div>
            
            <div className="w-full lg:w-[420px] bg-indigo-50/50 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 border border-indigo-100/50 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Bot size={20} className="text-indigo-600" />
                <h3 className="font-black text-indigo-900 text-sm md:text-base uppercase tracking-tight">منطق الاختيار</h3>
              </div>
              <p className="text-xs md:text-base leading-relaxed text-indigo-800 font-medium">
                {results.analysis}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2 px-2">
            <div className="h-px flex-1 bg-slate-200"></div>
            <h3 className="text-slate-400 font-black text-[9px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">النتائج المستخلصة</h3>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          {/* Solutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {results.solutions.map((sol, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-8 overflow-hidden relative"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-2xl md:text-4xl flex items-center justify-center rounded-xl md:rounded-2xl shadow-inner group-hover:scale-105 transition-transform duration-500">
                    {sol.emoji}
                  </div>
                  <button 
                    onClick={() => handleCopy(sol, idx)}
                    className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all transform active:scale-90 shadow-sm"
                  >
                    {copiedIndex === idx ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                
                <span className="inline-block self-start px-2 py-0.5 md:px-3 md:py-1 bg-blue-50 text-blue-600 rounded-full text-[8px] md:text-[10px] font-black mb-3 md:mb-4 uppercase tracking-wider relative z-10">
                  {sol.category}
                </span>
                
                <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-3 md:mb-4 group-hover:text-blue-600 transition-colors relative z-10">
                  {sol.title}
                </h3>
                
                <p className="text-slate-600 text-[13px] md:text-base leading-relaxed mb-6 md:mb-8 flex-1 relative z-10 font-medium">
                  {sol.text}
                </p>
                
                <div className="pt-4 md:pt-6 border-t border-slate-50 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-green-500 md:w-3.5 md:h-3.5" />
                    <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">موثوق</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => <Star key={i} size={8} className="fill-blue-600 text-blue-600 md:w-2.5 md:h-2.5" />)}
                  </div>
                </div>
              </div>
            ))}

            {/* AI Summary Card */}
            <div className="lg:col-span-1 bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] p-8 md:p-10 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group border border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50" />
              <div className="relative z-10">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 backdrop-blur-md border border-white/5">
                  <Wand2 size={20} className="text-blue-300 md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl md:text-3xl font-black mb-4 md:mb-6 leading-tight">كيف وصلنا لهذه الحلول؟</h3>
                <p className="text-slate-400 leading-relaxed text-[13px] md:text-base font-medium mb-8">
                  بناءً على مبادئ <span className="text-blue-400 font-bold">{results.technique.name}</span> قمنا بربط تحديك بأنماط الابتكار الأكثر نجاحاً عالمياً.
                </p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                 <button 
                  onClick={handleDownload}
                  className="flex-1 py-3.5 bg-white text-slate-900 font-black rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg text-sm"
                 >
                   حفظ <Download size={16} />
                 </button>
                 <button 
                  onClick={handleShare}
                  className="flex-1 py-3.5 bg-slate-800 text-white font-black rounded-xl md:rounded-2xl border border-slate-700 transition-all flex items-center justify-center gap-2 active:scale-95 hover:bg-slate-700 text-sm"
                 >
                   مشاركة <Share2 size={16} />
                 </button>
              </div>
            </div>
          </div>
        </main>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center selection:bg-blue-100 selection:text-blue-900 font-['Cairo'] relative overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-100/30 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-70" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-100/30 rounded-full blur-[70px] md:blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-70" />
      </div>

      <div className="w-full max-w-7xl px-4 md:px-6 pt-10 md:pt-24 pb-20 flex flex-col items-center relative">
        {/* Intelligence Badge */}
        <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative">
            <Sparkles size={14} className="text-blue-600 md:w-[18px] md:h-[18px]" />
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-20"></div>
          </div>
          <span className="text-[8px] md:text-xs font-black text-slate-500 uppercase tracking-[0.1em] md:tracking-[0.2em]">نظام التفكير الإبداعي الآلي</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-5xl mb-12 md:mb-16 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 md:mb-8 tracking-tighter leading-[1.15] md:leading-[1.1]">
            حول التحديات إلى <br className="hidden sm:block" />
            <span className="gradient-text">حلول مبتكرة</span>
          </h1>
          <p className="text-sm md:text-xl lg:text-2xl text-slate-500 leading-relaxed font-bold max-w-3xl mx-auto px-2 md:px-4 opacity-80">
            أدخل مشكلتك، وسيقوم "مبتكر" بتحليلها واختيار المنهجية الابتكارية الأنسب (سكامبر، تريز، أو القبعات الست) لهندسة حلول عبقرية.
          </p>
        </div>

        {/* Interaction Area */}
        <div className="w-full max-w-4xl mb-24 md:mb-32 px-2">
          <div className="bg-white p-2 md:p-4 rounded-[2rem] md:rounded-[4rem] shadow-2xl shadow-blue-900/10 border border-slate-100 focus-within:ring-4 md:focus-within:ring-[12px] focus-within:ring-blue-100/50 transition-all duration-500 bg-white/80 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4">
              <textarea
                className="flex-1 px-4 md:px-10 py-5 md:py-8 text-base md:text-2xl lg:text-3xl text-slate-700 placeholder:text-slate-300 outline-none resize-none h-36 md:h-32 leading-tight font-black bg-transparent"
                placeholder="ما هو التحدي الذي تواجهه؟"
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
              />
              <button 
                onClick={() => startInnovation()}
                disabled={loading || !problemInput.trim()}
                className="h-14 md:h-auto md:w-60 lg:w-64 bg-slate-900 hover:bg-black disabled:bg-slate-200 rounded-[1.2rem] md:rounded-[3.5rem] text-white font-black text-base md:text-xl lg:text-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-slate-300 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    ابتكر الآن
                    <ArrowRight size={20} className="md:w-7 md:h-7" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Trial Chips */}
          <div className="mt-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 px-4">
              <Lightbulb size={16} className="text-yellow-500" />
              <span className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.1em] md:tracking-[0.2em]">أمثلة للتجربة السريعة</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {PREDEFINED_EXAMPLES.map((example) => (
                <button
                  key={example.id}
                  onClick={() => startInnovation(example.text)}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-600 hover:text-white border border-slate-100 rounded-full text-[10px] md:text-sm font-black text-slate-600 transition-all shadow-sm hover:shadow-lg active:scale-95 group"
                >
                  <span className="text-blue-500 group-hover:text-white transition-colors">{example.icon}</span>
                  {example.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Creative Techniques Encyclopedia */}
        <div className="w-full max-w-6xl mb-32">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 px-2">
              <div className="text-center md:text-right">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">موسوعة أدوات الابتكار</h2>
                <p className="text-slate-500 font-bold md:text-lg">اكتشف المنهجيات العالمية التي يعتمد عليها "مبتكر" في توليد الحلول.</p>
              </div>
              <div className="w-full md:w-80 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="ابحث عن أداة..."
                  className="w-full pr-12 pl-4 py-4 bg-white rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-100 outline-none font-bold text-sm shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
              {filteredTechniques.map((tech) => (
                <div 
                  key={tech.id}
                  className="group bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all"></div>
                  <div className="w-16 h-16 bg-slate-50 text-4xl flex items-center justify-center rounded-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                    {tech.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-bold opacity-80">
                    {tech.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-slate-50 w-full flex justify-center">
                    <button 
                      onClick={() => {
                        setProblemInput(`باستخدام ${tech.name}: `);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                        addToast(`تم اختيار ${tech.name}، أكمل وصف مشكلتك`, 'info');
                      }}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-2"
                    >
                      استخدم هذه الأداة <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredTechniques.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-bold">لم نجد أداة بهذا الاسم، جرب كلمات أخرى.</p>
                </div>
              )}
           </div>
        </div>

        {/* Feature Cards Summary */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-20 md:mb-32 px-2">
          <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/40 border border-slate-200/50 backdrop-blur-md text-center group hover:bg-white transition-all duration-500">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner group-hover:scale-110 transition-transform"><Target size={24} className="md:w-8 md:h-8" /></div>
            <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-3 md:mb-4">دقة الاختيار</h3>
            <p className="text-xs md:text-base text-slate-500 leading-relaxed font-bold">يحلل النظام طبيعة التحدي ويختار الأداة الإبداعية التي تضمن أفضل مخرجات ممكنة.</p>
          </div>
          <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/40 border border-slate-200/50 backdrop-blur-md text-center group hover:bg-white transition-all duration-500">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 text-indigo-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner group-hover:scale-110 transition-transform"><BrainCircuit size={24} className="md:w-8 md:h-8" /></div>
            <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-3 md:mb-4">تطبيق ذكي</h3>
            <p className="text-xs md:text-base text-slate-500 leading-relaxed font-bold">لا حاجة لتعلم المنهجيات المعقدة؛ "مبتكر" يطبق الخطوات نيابة عنك في ثوانٍ.</p>
          </div>
          <div className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white/40 border border-slate-200/50 backdrop-blur-md text-center group hover:bg-white transition-all duration-500">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 text-green-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner group-hover:scale-110 transition-transform"><Zap size={24} className="md:w-8 md:h-8" /></div>
            <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-3 md:mb-4">نتائج ملموسة</h3>
            <p className="text-xs md:text-base text-slate-500 leading-relaxed font-bold">احصل على 5 حلول مهيكلة وقابلة للتنفيذ الفوري، بدلاً من مجرد أفكار عشوائية.</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-slate-200 py-10 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 opacity-60 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-lg md:rounded-xl flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm md:text-base">مبتكر AI</p>
              <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest">مستقبل الابتكار</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
             <div className="flex flex-col items-center md:items-end">
                <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">التقنية المستخدمة</span>
                <span className="text-xs md:text-sm font-black text-slate-900">Gemini 3.0 Pro Advanced</span>
             </div>
             <div className="hidden md:block h-8 w-px bg-slate-300"></div>
             <div className="flex gap-3">
               {[BrainCircuit, Target, Globe].map((Icon, i) => (
                 <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                   <Icon size={14} className="md:w-5 md:h-5" />
                 </div>
               ))}
             </div>
          </div>
        </footer>
      </div>

      {/* Modern AI Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#020617] z-[100] flex flex-col items-center justify-center text-white text-center p-8 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-blue-500/20 rounded-full animate-pulse-glow"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-blue-500/10 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-500/5 rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Particle Effects */}
          {[...Array(15)].map((_, i) => (
             <div 
               key={i} 
               className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float-particle" 
               style={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%`,
                 '--tw-translate-x': `${(Math.random() - 0.5) * 200}px`,
                 '--tw-translate-y': `${(Math.random() - 0.5) * 200}px`,
                 animationDelay: `${Math.random() * 3}s`
               } as any}
             />
          ))}
          
          <div className="relative mb-16 md:mb-24 scale-75 md:scale-100">
            {/* Orbital Rings */}
            <div className="w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center">
               {/* Orbital Icons */}
               <div className="absolute inset-0 animate-orbit">
                  <div className="bg-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/50">
                    <Lightbulb size={20} />
                  </div>
               </div>
               <div className="absolute inset-0 animate-orbit-reverse" style={{ animationDuration: '7s' }}>
                  <div className="bg-indigo-500 p-2 rounded-lg shadow-lg shadow-indigo-500/50">
                    <Zap size={20} />
                  </div>
               </div>
               <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '10s' }}>
                  <div className="bg-purple-500 p-2 rounded-lg shadow-lg shadow-purple-500/50">
                    <Sparkles size={20} />
                  </div>
               </div>

               {/* Core Brain */}
               <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] border-4 border-blue-400/30 animate-pulse">
                 <Brain size={48} className="md:w-16 md:h-16 text-white" />
                 {/* Neural Lines Animation */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Atom className="text-white/20 animate-spin" size={100} style={{ animationDuration: '3s' }} />
                 </div>
               </div>
            </div>
          </div>
          
          <div className="relative z-20 max-w-2xl px-4">
             <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-white">
               {LOADING_MESSAGES[loadingMsgIdx]}
             </h2>
             <div className="flex flex-col items-center gap-4">
                <p className="text-blue-200/50 text-xs md:text-sm font-bold uppercase tracking-[0.3em] animate-pulse">
                  System Processing • Innovation Engine V3
                </p>
                <div className="flex justify-center gap-1.5 h-1 w-48 md:w-64 bg-white/5 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out"
                     style={{ width: `${((loadingMsgIdx + 1) / LOADING_MESSAGES.length) * 100}%` }}
                   ></div>
                </div>
             </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[], removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] flex flex-col gap-2 md:gap-3 w-[90%] md:w-full max-w-sm">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`
            p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl flex items-center justify-between gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300
            ${toast.type === 'success' ? 'bg-green-600 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-600 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-600 text-white' : ''}
          `}
        >
          <div className="flex items-center gap-2 md:gap-3">
            {toast.type === 'success' && <CheckCircle2 size={16} className="md:w-5 md:h-5" />}
            {toast.type === 'error' && <AlertCircle size={16} className="md:w-5 md:h-5" />}
            {toast.type === 'info' && <Info size={16} className="md:w-5 md:h-5" />}
            <span className="text-[11px] md:text-sm font-bold">{toast.message}</span>
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors shrink-0"
          >
            <X size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
