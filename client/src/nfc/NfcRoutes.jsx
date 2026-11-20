import { Routes, Route } from 'react-router-dom'
import NfcEnroll from './NfcEnroll'
import NfcSurvey from './NfcSurvey'
import NfcGraduate from './NfcGraduate'
import NfcGuide from './NfcGuide'

export default function NfcRoutes() {
  return (
    <Routes>
      <Route path="1" element={<NfcEnroll />} />
      <Route path="2" element={<NfcSurvey />} />
      <Route path="3" element={<NfcGraduate />} />
      <Route path="*" element={<NfcGuide />} />
    </Routes>
  )
}
