# ContractGenix - 你的專屬 AI 合約法務與心理顧問

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/AI_Engine-Google_Gemini_1.5-blue?style=flat&logo=google)

>  **Hackathon 專案聲明：** > 本專案為黑客松 MVP 展示版本。為確保 Demo 流暢度與體驗完整性，目前 OCR 辨識與部分 Chatbot 流程採用前端 Mock (假狀態) 實作展示概念，核心法理分析則已準備對接真實 **Google Gemini API**。

##  痛點與解法 (Why ContractGenix?)
在現今高度同質化的人力銀行市場中，多數平台僅提供「職缺媒合」，卻忽略了求職者在最後一哩路——「簽署勞務合約」時面臨的資訊不對等與焦慮。
ContractGenix 是一款結合**法理分析**與**情緒支持**的對話式合約避險系統，賦能求職者勇敢捍衛自身權益。

##  核心功能與展示 (Features)
1. **極簡影像匯入 (Mock Showcase)：** 支援合約圖檔上傳概念，鎖定簽約當下「隨手拍照」的真實情境。
2. **AI 風險儀表板 (AI Integration)：** 採用 System Prompt 矩陣，精準揪出「假委任」、「違法扣薪」與「高額違約金」。
3. **口袋法務諮商室 (State Management)：** 內建合約小精靈，將冷硬法律轉為溫暖白話文，並自動生成談判對話稿。

##  系統架構 (Architecture)
- **Frontend:** Next.js (App Router), React SPA 狀態切換
- **Styling:** Tailwind CSS, shadcn/ui
- **Optimization:** 捨棄傳統笨重向量資料庫，採用 Long-Context 實現「AI 輕量化」，可輕易以 API/SDK 形式授權嵌入大型求職 APP (如 104、小雞上工)。
