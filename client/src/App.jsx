import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/layout/Layout'

const AboutPage         = lazy(() => import('./pages/AboutPage'))
const ProjectsPage      = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const FacesPage         = lazy(() => import('./pages/FacesPage'))
const FaceDetailPage    = lazy(() => import('./pages/FaceDetailPage'))
const PhotosPage        = lazy(() => import('./pages/PhotosPage'))
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'))

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="t-label">Loading</span>
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
          <Route path="/people"        element={<FacesPage />} />
          <Route path="/people/:id"    element={<FaceDetailPage />} />
          <Route path="/faces"         element={<Navigate to="/people" replace />} />
          <Route path="/photos"        element={<PhotosPage />} />
          <Route path="*"              element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
