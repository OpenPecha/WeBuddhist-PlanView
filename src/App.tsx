import { Routes, Route } from "react-router-dom"
import { PlanViewer } from "@/pages/plan-view/PlanViewer"
import Homepage from "@/pages/Homepage"

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/:planId/:date" element={<PlanViewer />} />
        <Route path="/:planId" element={<PlanViewer />} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </div>
  )
}

export default App
