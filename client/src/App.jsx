import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/layout/Layout'

const AboutPage         = lazy(() => import('./pages/AboutPage'))
const ProjectsPage      = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const FacesPage         = lazy(() => import('./pages/FacesPage'))
const AnnualReport      = lazy(() => import('./pages/annual/AnnualReport'))
const PanelsPage        = lazy(() => import('./pages/PanelsPage'))
const VideosPage        = lazy(() => import('./pages/VideosPage'))
const StampPage         = lazy(() => import('./pages/StampPage'))
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-xs text-text-muted font-ui tracking-widest uppercase">Loading</span>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/"              element={<AboutPage />} />
          <Route path="/projects"      element={<ProjectsPage />} />
          <Route path="/projects/:id"  element={<ProjectDetailPage />} />
          <Route path="/faces"         element={<FacesPage />} />
          <Route path="/annual-report" element={<AnnualReport />} />
          <Route path="/panels"        element={<PanelsPage />} />
          <Route path="/videos"        element={<VideosPage />} />
          <Route path="/stamp"         element={<StampPage />} />
          <Route path="/stamp/:id"     element={<StampPage />} />
          <Route path="*"              element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
