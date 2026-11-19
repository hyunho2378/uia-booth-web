import { useEffect } from 'react'
import { asset } from '../utils/asset'
import './nfc.css'

export default function NfcShell({ step, title, children }) {
  useEffect(() => {
    window.scrollTo(0, 0)
    if (title) document.title = title + ' | UIA 대학교'
  }, [title])
  return (
    <div className="nfc">
      <span className="nfc-orb a" />
      <span className="nfc-orb b" />
      <div className="nfc-inner">
        <div className="nfc-top">
          <img src={asset('/brand/uia-logo-official.svg')} alt="UIA" />
          {step && <span className="nfc-step">{step} / 3</span>}
        </div>
        {children}
      </div>
    </div>
  )
}
