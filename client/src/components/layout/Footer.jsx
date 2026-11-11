import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      className="mt-auto page-px py-8 md:py-10"
      style={{ borderTop: '1px solid #1f1f1f', background: '#0a0a0a' }}
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
        {/* 좌측 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-body">UIA 특별관</span>
          </div>
          <div className="flex items-center gap-4">
          </div>
          <p className="text-xs text-text-muted font-body">
            2026 대학임팩트얼라이언스(UIA) 학생 기획단
          </p>
        </div>

        {/* 우측 */}
        <div className="flex flex-col gap-1 md:items-end md:text-right">
          <p className="text-xs text-text-muted font-body">제8회 대한민국 사회연대경제박람회</p>
          <p className="text-xs text-text-muted font-body">2026.11.27 - 11.29 고양 킨텍스</p>
          <p className="text-xs text-text-muted font-body">
            웹사이트 제작/수정 문의 주현호
            <a href="mailto:h20222583@glab.hallym.ac.kr" className="ml-1 hover:text-text-primary transition-colors">
              (h20222583@glab.hallym.ac.kr)
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
