'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, ShieldCheck, AlertCircle, Search, ArrowRight, UploadCloud, FileText, User, Sparkles, Home, Send } from 'lucide-react'

// --- Mock Data for Pre-filling ---
const MOCK_BAD_CONTRACT = `一、合約屬性
本合約為委任性質，乙方受甲方委任執行專案開發業務。
二、工作時間
乙方應配合甲方之營業時間，每日09:00至18:00於甲方辦公室提供勞務。
三、考核與懲戒
乙方若單月遲到超過三次，或遭客戶客訴，甲方得逕自於當月委任報酬中扣除新台幣5,000元作為懲罰性違約金。
四、提前終止約定
若乙方未滿一年即單方面終止本合約，應賠償甲方新台幣十萬元作為訓練與營運損失違約金。`;

type Message = {
  role: 'user' | 'assistant';
  content: string;
}

export default function AppFlow() {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // --- Step 1 State ---
  const [contractText, setContractText] = useState('')
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showTextInput, setShowTextInput] = useState(false)

  // --- Step 2 State ---
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Define a basic interface for the analysis result
  interface AnalysisResult {
    riskLevel?: 'high' | 'medium' | 'low';
    riskScore?: number;
    employerReport?: {
      issues?: Array<{
        clause: string;
        violation: string;
        suggestion: string;
      }>;
    };
    workerReport?: {
      empathicMessage: string;
      negotiationScript: string;
    };
  }
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  // --- Step 3 State ---
  const initialMessages: Message[] = [
    {
      role: 'assistant',
      content: "哈囉！我是合約小精靈 🧚。根據剛剛的報告，合約裡有高額違約金與扣薪的陷阱。建議您可以要求修改。有什麼我可以幫你的嗎？"
    }
  ]
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (step === 3 && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, step, isTyping])

  // --- Global Handlers ---
  const handleReset = () => {
    setStep(1);
    setContractText('');
    setShowTextInput(false);
    setAnalysisResult(null);
    setMessages(initialMessages);
    setChatInput('');
    setIsTyping(false);
  }

  // --- Step 1 Handlers ---
  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShowTextInput(false);
      setIsSimulatingUpload(true);
      
      // Simulate OCR processing time
      setTimeout(() => {
        setContractText(MOCK_BAD_CONTRACT);
        setIsSimulatingUpload(false);
        setStep(2);
        triggerAnalysis(MOCK_BAD_CONTRACT); // Automatically trigger analysis after "OCR" is done
      }, 2000);
    }
  }

  const handleManualInputSubmit = () => {
    if (!contractText.trim()) return;
    setStep(2);
    triggerAnalysis(contractText);
  }

  // --- Step 2 Handlers ---
  const triggerAnalysis = async (textToAnalyze: string) => {
    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const response = await fetch('/api/analyze-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractText: textToAnalyze }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }
      
      setAnalysisResult(data);
    } catch (error) {
      console.error('Error analyzing contract:', error);
      alert('分析失敗，請檢查合約內容或稍後再試。');
      setStep(1); // Go back if error
    } finally {
      setIsAnalyzing(false);
    }
  }

  // --- Step 3 Handlers ---
  const handleQuickReply = (userMsg: string, assistantReply: string) => {
    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMsg },
      { role: 'assistant', content: assistantReply }
    ])
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: chatInput.trim() }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "我完全理解你的擔憂！這部分的細節確實需要多加留意。建議你可以先參考上面的對話稿跟人資溝通看看，勇敢踩穩我們的底線！如果有新的合約版本，隨時再傳給我幫你把關喔！💪" 
        }
      ]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans flex flex-col">
      {/* Global Header */}
      <header className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/80 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
               <ShieldCheck className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-xl font-bold tracking-tight text-slate-100">ContractGenix</h1>
               <p className="text-xs text-blue-400 font-medium">求職護身符 - 勞動合約審查管家</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Progress Indicators */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Badge variant={step >= 1 ? "default" : "outline"} className={step >= 1 ? "bg-blue-600" : "text-slate-500 border-slate-700"}>1. 輸入</Badge>
              <div className={`w-4 border-t ${step >= 2 ? "border-blue-600" : "border-slate-700"}`}></div>
              <Badge variant={step >= 2 ? "default" : "outline"} className={step >= 2 ? "bg-blue-600" : "text-slate-500 border-slate-700"}>2. 報告</Badge>
              <div className={`w-4 border-t ${step >= 3 ? "border-blue-600" : "border-slate-700"}`}></div>
              <Badge variant={step === 3 ? "default" : "outline"} className={step === 3 ? "bg-blue-600" : "text-slate-500 border-slate-700"}>3. 諮詢</Badge>
            </div>
            
            {/* Reset / Home Button for Demo Loop */}
            {step > 1 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset} 
                className="gap-2 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="返回首頁重新測試"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">重新分析</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-4xl mx-auto">
        
        {/* ========================================== */}
        {/* STEP 1: INPUT                              */}
        {/* ========================================== */}
        {step === 1 && (
          <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-slate-100">保護你的工作權益，從合約開始</h2>
              <p className="text-slate-400 max-w-lg mx-auto">請提供您的勞動或委任合約，我們的 AI 將為您揪出潛在法規陷阱，確保您的權益不被剝削。</p>
            </div>

            {isSimulatingUpload ? (
              <Card className="bg-slate-800/50 border-slate-700 py-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-xl pointer-events-none"></div>
                <CardContent className="flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin"></div>
                    <Search className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">AI 努力辨識中...</h3>
                    <p className="text-slate-400 mt-2">正在透過 OCR 萃取合約文字與分析條文</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-8">
                {/* Upload Button */}
                <Card className="bg-slate-800/80 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group flex flex-col items-center justify-center text-center p-8 h-64 shadow-xl"
                      onClick={() => fileInputRef.current?.click()}>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleSimulateUpload}
                  />
                  <div className="w-16 h-16 rounded-full bg-slate-700/50 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-colors">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 mb-2">📄 上傳合約圖檔</h3>
                  <p className="text-sm text-slate-400">(自動 OCR 辨識)</p>
                </Card>

                {/* Paste Text Button / Area */}
                {!showTextInput ? (
                  <Card className="bg-slate-800/80 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group flex flex-col items-center justify-center text-center p-8 h-64 shadow-xl"
                        onClick={() => setShowTextInput(true)}>
                    <div className="w-16 h-16 rounded-full bg-slate-700/50 group-hover:bg-blue-500/20 flex items-center justify-center mb-4 transition-colors">
                      <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-200 mb-2">✍️ 貼上合約純文字</h3>
                    <p className="text-sm text-slate-400">(直接丟進 AI 引擎)</p>
                  </Card>
                ) : (
                  <Card className="bg-slate-800 border-blue-500/50 h-64 flex flex-col overflow-hidden shadow-xl ring-1 ring-blue-500/20">
                    <Textarea
                      autoFocus
                      placeholder="請在此貼上勞動合約的純文字內容..."
                      className="flex-grow bg-slate-900 border-0 focus-visible:ring-0 rounded-none p-4 text-slate-200 resize-none"
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                    />
                    <div className="p-3 bg-slate-800 border-t border-slate-700 flex justify-end gap-2">
                       <Button variant="ghost" size="sm" onClick={() => setShowTextInput(false)} className="text-slate-400 hover:text-slate-200">取消</Button>
                       <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!contractText.trim()} onClick={handleManualInputSubmit}>
                         開始分析 <ArrowRight className="w-4 h-4 ml-1" />
                       </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* STEP 2: REPORT ANALYSIS                    */}
        {/* ========================================== */}
        {step === 2 && (
          <div className="w-full h-full flex flex-col space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
                <AlertCircle className="w-6 h-6 text-blue-500" />
                合約健康度檢查報告
              </h2>
            </div>
            
            {isAnalyzing ? (
              <Card className="bg-slate-800/80 border-slate-700 w-full mt-4 flex-grow p-8 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="relative flex justify-center items-center">
                    <div className="w-24 h-24 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin"></div>
                    <Sparkles className="w-8 h-8 text-amber-500 absolute animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-200">法務 AI 深度掃描中...</h3>
                    <p className="text-slate-400 max-w-sm">正在比對勞動基準法與歷年判決，幫您找出所有不平等的隱藏條款，請稍候。</p>
                 </div>
                 <div className="w-full max-w-md space-y-3 mt-4">
                    <Skeleton className="h-4 w-full bg-slate-700" />
                    <Skeleton className="h-4 w-5/6 bg-slate-700" />
                    <Skeleton className="h-4 w-4/6 bg-slate-700" />
                 </div>
              </Card>
            ) : analysisResult ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative pb-20">
                {/* Score Column */}
                <div className="md:col-span-1 flex flex-col gap-4">
                  <Card className="bg-slate-800 border-slate-700 flex-grow text-center flex flex-col items-center justify-center py-10 px-6">
                     <h3 className="text-sm font-semibold text-slate-400 mb-6 uppercase tracking-wider">危險分數 (滿分100)</h3>
                     <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full border-[6px] border-slate-700 flex items-center justify-center bg-slate-900 shadow-inner">
                          <span className="text-5xl font-black text-amber-500">{analysisResult.riskScore || 85}</span>
                        </div>
                        {/* Decorative ring */}
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-amber-500" strokeDasharray={`${((analysisResult.riskScore || 85) / 100) * 283} 283`}></circle>
                        </svg>
                     </div>
                     <Badge variant="outline" className="border-amber-500 text-amber-400 bg-amber-500/10 px-4 py-1.5 text-sm">
                       {analysisResult.riskLevel === 'high' ? '高風險合約，請小心' : '中度風險合約'}
                     </Badge>
                     <p className="text-sm text-slate-400 mt-6 max-w-[200px]">分數越高代表對勞工越不利，陷阱越多。</p>
                  </Card>
                </div>

                {/* Issues Column */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-slate-200">⚠️ 發現 {analysisResult.employerReport?.issues?.length || 0} 個嚴重陷阱</h3>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {analysisResult.employerReport?.issues?.map((issue: { violation: string; clause: string; suggestion: string }, idx: number) => (
                      <Card key={idx} className="bg-slate-800/80 border-slate-700 overflow-hidden break-inside-avoid">
                        <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex gap-3 items-start">
                          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <h4 className="font-bold text-amber-400 text-lg leading-tight">{issue.violation}</h4>
                          </div>
                        </div>
                        <CardContent className="p-5 space-y-4">
                           <div>
                              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">合約原文：</p>
                              <div className="p-3 bg-slate-900 rounded-md border border-slate-700/50 text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                &quot;{issue.clause}&quot;
                              </div>
                           </div>
                           <div>
                              <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">法務分析與建議：</p>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {issue.suggestion}
                              </p>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Floating CTA Button for Step 3 */}
                 <div className="fixed bottom-8 right-8 z-50 animate-bounce">
                    <Button 
                      onClick={() => setStep(3)}
                      className="rounded-full h-16 px-8 shadow-2xl shadow-fuchsia-500/30 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-lg gap-3 border border-fuchsia-400/30 transition-all hover:scale-105"
                    >
                      <Sparkles className="w-6 h-6 text-fuchsia-200" />
                      呼叫合約小精靈 (求救)
                    </Button>
                 </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ========================================== */}
        {/* STEP 3: MOCK CHAT ROOM                     */}
        {/* ========================================== */}
        {step === 3 && (
          <div className="w-full h-[85vh] bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
             {/* Chat Header */}
             <div className="px-6 py-4 bg-slate-900 border-b border-slate-700 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-inner relative">
                    <Sparkles className="w-6 h-6 text-white" />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full"></span>
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-slate-100">合約小精靈 🧚</h3>
                   <p className="text-xs text-green-400 flex items-center gap-1">
                     <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> 在線支援中
                   </p>
                 </div>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-slate-400 hover:text-white">
                  返回報告
               </Button>
             </div>

             {/* Chat Messages Area */}
             <div className="flex-grow p-6 overflow-y-auto space-y-6 scroll-smooth custom-scrollbar">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                       
                       {/* Avatar */}
                       <div className="flex-shrink-0 mt-1">
                         {msg.role === 'user' ? (
                           <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                             <User className="w-5 h-5 text-slate-300" />
                           </div>
                         ) : (
                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                             <Sparkles className="w-4 h-4 text-white" />
                           </div>
                         )}
                       </div>

                       {/* Bubble */}
                       <div className={`p-4 rounded-2xl ${
                         msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-slate-700 text-slate-100 rounded-tl-sm border border-slate-600'
                       }`}>
                          <p className="text-sm shadow-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                       </div>

                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex w-full justify-start">
                    <div className="flex gap-3 max-w-[85%] sm:max-w-[75%] flex-row">
                       <div className="flex-shrink-0 mt-1">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                           <Sparkles className="w-4 h-4 text-white" />
                         </div>
                       </div>
                       <div className="p-4 rounded-2xl bg-slate-700 rounded-tl-sm border border-slate-600 flex items-center gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                       </div>
                    </div>
                  </div>
                )}
                
                {/* Invisible element to auto-scroll to */}
                <div ref={chatEndRef} />
             </div>

             {/* Quick Replies Buttons */}
             <div className="px-4 py-2 bg-slate-900 border-t border-slate-700">
               <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar snap-x">
                 <button 
                   onClick={() => handleQuickReply(
                     "法規太難了，可以白話一點解釋嗎？", 
                     "沒問題！簡單來說，老闆不能因為你提早離職就罰你 5 萬元，這在勞基法上是無效的（參考民法252條與勞基法26條），法院也不會認可喔！別被唬住了。"
                   )}
                   className="flex-shrink-0 snap-start bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-300 transition-colors whitespace-nowrap"
                 >
                   👉 白話文解釋
                 </button>
                 
                 <button 
                   onClick={() => handleQuickReply(
                     "我要怎麼跟老闆開口？求對話稿！", 
                     "你可以這樣傳 Line 給人資或主管：\n\n『您好，關於合約中提及的五萬元違約金與客訴扣薪條款，因為與現行勞動法規有些出入，我想進一步討論這部分的合規性。如果可以調整為符合勞基法的規範，我會更安心地投入工作，謝謝！』"
                   )}
                   className="flex-shrink-0 snap-start bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-300 transition-colors whitespace-nowrap"
                 >
                   👉 求對話稿
                 </button>
                 
                 <button 
                   onClick={() => handleQuickReply(
                     "好煩躁，好怕失去這份工作，想直接妥協了...", 
                     "🫂 (拍拍) 找工作真的很有壓力，我完全懂！但你要知道，簽下不平等的合約，未來可能會讓你賠上更多錢跟身心健康。你現在能發現問題已經很棒了！我們一起勇敢踩穩底線，好嗎？你可以試著用上面那段比較委婉的話去談看看。"
                   )}
                   className="flex-shrink-0 snap-start bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-300 transition-colors whitespace-nowrap"
                 >
                   👉 覺得心累好想放棄
                 </button>
               </div>
             </div>
             
             {/* Chat Input Area */}
             <div className="p-4 bg-slate-900 border-t border-slate-800">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-2 items-end"
                >
                  <Textarea
                    placeholder="還有其他關於合約的疑問嗎？..."
                    className="flex-grow min-h-[50px] max-h-[120px] bg-slate-800 border-slate-700 focus-visible:ring-blue-500 rounded-xl p-3 resize-none text-sm leading-relaxed text-slate-200"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    disabled={!chatInput.trim() || isTyping}
                    className="h-[50px] w-[50px] rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </Button>
                </form>
             </div>
          </div>
        )}
      </main>
      
      {/* Global CSS for custom scrollbar hidden in text, can be applied globally via globals.css but placed inline for quick styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 20px; }
      `}} />
    </div>
  )
}

