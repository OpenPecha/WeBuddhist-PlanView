import { Routes, Route, Navigate } from "react-router-dom"
import { PlanViewer } from "@/pages/PlanViewer"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/:planId/:date" element={<PlanViewer />} />
        <Route path="*" element={<Navigate to="/c837a407-079e-4924-ac7a-13e20512dfed/2026-05-06" replace />} />
      </Routes>
    </div>
  )
}

export default App
