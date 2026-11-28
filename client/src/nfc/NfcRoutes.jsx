import { Routes, Route, Navigate } from 'react-router-dom'
import NfcOne from './NfcOne'
import NfcShare from './NfcShare'
import NfcAdmin from './NfcAdmin'
import NfcSheet from './NfcSheet'

export default function NfcRoutes() {
  return (
    <Routes>
      <Route path="1" element={<NfcOne />} />
      <Route path="2" element={<NfcOne />} />
      <Route path="3" element={<NfcOne />} />
      <Route path="s" element={<NfcShare />} />
      <Route path="s/:token" element={<NfcShare />} />
      <Route path="admin" element={<NfcAdmin />} />
      <Route path="admin/list" element={<NfcSheet />} />
      <Route path="*" element={<Navigate to="/nfc/1" replace />} />
    </Routes>
  )
}
