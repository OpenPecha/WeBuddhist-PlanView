import { Routes, Route } from "react-router-dom"
import { PlanIdRedirect } from "@/pages/plan-view/PlanIdRedirect"
import Homepage from "@/pages/home-page/Homepage"
import PlanListing from "@/pages/plan-listing/PlanListing"
import SeriesView from "./pages/series-view/SeriesView"
import SeriesListing from "./pages/series-listing/SeriesListing"
import PlanDayView from "./pages/plan-day-view/PlanDayView"
import { PlanViewer } from "./pages/plan-view/PlanViewer"

function App() {
  return (
    <div className="bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/plan/:planId" element={<PlanViewer />} />
        <Route path="/series/plans" element={<PlanListing />} />
        <Route path="/series" element={<SeriesListing />} />
        <Route path="/series/:seriesId" element={<SeriesView />} />
        <Route path="/series/:seriesId/plan-day" element={<PlanDayView />} />
        <Route path="/:planId" element={<PlanIdRedirect />} />
      </Routes>
    </div>
  )
}

export default App
