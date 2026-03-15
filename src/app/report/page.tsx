'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, MessageCircle, HeartHandshake, ShieldAlert } from 'lucide-react'

// Mock Data
const MOCK_WORKER_REPORT = {
  empathicMessage: '這份合約看起來有些地方對您不太有利，特別是工時和違約金的部分。別擔心，我們幫您準備了可以跟老闆討論的說法。',
  negotiationScript: [
    '老闆您好，關於合約上的上班時間，我希望能寫得更清楚一點，保障雙方權益。',
    '另外，違約金的部分，我是不是能了解一下計算方式？'
  ]
}

export default function WorkerReport() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-amber-50 text-slate-800 p-6 font-sans selection:bg-amber-200">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between pt-4">
          <Button 
            variant="ghost" 
            className="text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 gap-2 -ml-4"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-4 h-4" />
            返回儀表板
          </Button>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-800">C端勞工報告體驗</span>
          </div>
        </header>

        {/* Welcome / Empathic Message */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldAlert className="w-32 h-32" />
            </div>
            <div className="relative z-10 max-w-xl space-y-4">
              <h1 className="text-3xl font-bold">您的專屬權益分析</h1>
              <p className="text-amber-50 text-lg leading-relaxed">
                {MOCK_WORKER_REPORT.empathicMessage}
              </p>
            </div>
          </div>
        </section>

        {/* Negotiation Scripts */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both">
          <div className="flex items-center gap-3 px-2">
            <MessageCircle className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-slate-800">建議的溝通說法</h2>
          </div>
          <p className="px-2 text-slate-600">
            您可以參考以下文本，用溫和堅定的態度與雇主進行協商：
          </p>

          <div className="grid gap-4">
            {MOCK_WORKER_REPORT.negotiationScript.map((script, idx) => (
              <Card key={idx} className="border-amber-200 shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur">
                <CardHeader className="pb-3 border-b border-amber-100 bg-amber-50/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <CardTitle className="text-base text-amber-900">溝通建議 {idx + 1}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-5">
                  <p className="text-slate-700 text-lg leading-relaxed">
                    &quot;{script}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Action Call */}
        <div className="pt-8 pb-12 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <Button size="lg" className="bg-slate-800 hover:bg-slate-900 text-white rounded-full px-8 shadow-lg shadow-slate-900/20">
            下載完整白話文報告
          </Button>
        </div>

      </div>
    </div>
  )
}
