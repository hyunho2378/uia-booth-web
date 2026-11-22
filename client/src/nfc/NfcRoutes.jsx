import { Routes, Route, Navigate } from 'react-router-dom'
import NfcEnroll from './NfcEnroll'
import NfcSurvey from './NfcSurvey'
import NfcGraduate from './NfcGraduate'
import NfcShare from './NfcShare'
import NfcAdmin from './NfcAdmin'

export default function NfcRoutes() {
  return (
    <Routes>
      <Route path="1" element={<NfcEnroll />} />
      <Route path="2" element={<NfcSurvey />} />
      <Route path="3" element={<NfcGraduate />} />
      <Route path="s/:token" element={<NfcShare />} />
      <Route path="admin" element={<NfcAdmin />} />
      <Route path="*" element={<Navigate to="/nfc/1" replace />} />
    </Routes>
  )
}
