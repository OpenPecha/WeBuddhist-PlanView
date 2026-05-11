import { Routes, Route } from "react-router-dom"
import { PlanViewer } from "@/pages/plan-view/PlanViewer"
import Homepage from "@/pages/home-page/Homepage"
import PlanListing from "@/pages/plan-listing/PlanListing"

function App() {
  return (
    <div className="bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/plans" element={<PlanListing />} />
        <Route path="/:planId/:date" element={<PlanViewer />} />
        <Route path="/:planId" element={<PlanViewer />} />
      </Routes>
    </div>
  )
}

export default App
