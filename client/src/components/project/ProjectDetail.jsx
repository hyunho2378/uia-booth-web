import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Maximize, X } from 'lucide-react'
import BackLink from '../ui/BackLink'

const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 문장 끝(다. 요. 까?)에서만 줄을 나눠 한 줄에 한 사실이 보이게 한다
function splitLines(text) {
  if (Array.isArray(text)) return text
  return String(text).split(/(?<=[다요까]\.)\s+|(?<=\?)\s+/).map(t => t.trim()).filter(Boolean)
}

function detailOf(src) {
  if (!src || !src.startsWith('/works/')) return src
  return `/works/detail/${src.split('/').pop()}`
}

export default function ProjectDetail({ work, fromSubject = 'all' }) {
  const [posterHovered, setPosterHovered] = useState(false)
  const [pageIdx, setPageIdx] = useState(0)
  const [magIdx, setMagIdx] = useState(0)
  const [mainDetailFailed, setMainDetailFailed] = useState(() => new Set())
  const [magThumbFailed, setMagThumbFailed] = useState(() => new Set())
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [hasLeftOnce, setHasLeftOnce] = useState(false)
  const [popupBlocked, setPopupBlocked] = useState(false)
  const hasLinks = work.links && work.links.length > 0
  const isMagazine = work.layout === 'magazine'
  const pages = work.pages ?? []
  const mainSrc = isMagazine ? pages[0] : pages[pageIdx]
  const magPages = isMagazine ? pages.slice(1) : []

  const backTo = fromSubject && fromSubject !== 'all'
    ? `/projects?subject=${fromSubject}`
    : '/projects'

  useEffect(() => {
    if (!magPages.length) return
    const t = setInterval(() => setMagIdx(i => (i + 1) % magPages.length), 3500)
    return () => clearInterval(t)
  }, [magPages.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = e => { if (e.key === 'Escape') setLightboxOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen])

  const membersLen = work.members?.length ?? 0
  const renderMembers = () => {
    if (membersLen <= 1) return null
    return (
      <ul className="flex flex-col gap-1.5 pt-1">
        {work.members.map((m, i) => (
          <li key={i} className="flex flex-col">
            <span className="text-xs font-semibold text-text-primary font-ui">{m.name}</span>
            <span className="text-xs text-text-muted font-ui">{m.studentId}, {m.major}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <BackLink to={backTo}>프로젝트 목록</BackLink>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* 이미지 */}
        <div className="lg:w-[60%]">
          <div
            onClick={() => setLightboxOpen(true)}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1 / 1.414',
              background: 'transparent',
              border: 'none',
              overflow: 'hidden',
              transform: posterHovered ? 'scale(1.22)' : 'scale(1)',
              boxShadow: posterHovered
                ? '0 40px 100px rgba(0,0,0,0.85)'
                : '0 0 0 rgba(0,0,0,0)',
              transition: posterHovered
                ? 'transform 280ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms ease, border-color 180ms ease'
                : 'transform 480ms cubic-bezier(0.22,1,0.36,1), box-shadow 480ms ease, border-color 350ms ease',
              cursor: posterHovered ? 'zoom-out' : 'zoom-in',
            }}
          >
            {mainSrc && (
              <img
                key={mainSrc}
                src={mainDetailFailed.has(mainSrc) ? mainSrc : detailOf(mainSrc)}
                alt={`${work.author} - ${work.title}`}
                loading="lazy"
                decoding="async"
                onError={() => setMainDetailFailed(s => { const n = new Set(s); n.add(mainSrc); return n })}
                style={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}

            {/* 일반 레이아웃 캐러셀 내비 */}
            {!isMagazine && pages.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); setPageIdx(i => (i - 1 + pages.length) % pages.length) }}
                className="icon-btn on-image" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 'var(--sp-2)' }}
                aria-label="이전 이미지"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            {!isMagazine && pages.length > 1 && (
              <button
                onClick={e => { e.stopPropagation(); setPageIdx(i => (i + 1) % pages.length) }}
                className="icon-btn on-image" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 'var(--sp-2)' }}
                aria-label="다음 이미지"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {!isMagazine && pages.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPageIdx(i)}
                  style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    padding: 0, border: 'none',
                    background: i === pageIdx ? 'var(--y)' : 'var(--surface-2)',
                    cursor: 'pointer',
                    transition: 'background 200ms ease',
                  }}
                  aria-label={`${i + 1}번 페이지`}
                />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-2)', marginTop: 'var(--sp-3)' }}>
            <button
              onClick={() => setLightboxOpen(true)}
              className="link"
              aria-label="크게 보기"
            >
              <Maximize size={18} />
              크게 보기
            </button>
            <button
              onClick={() => {
                if (!mainSrc) return
                const newTab = window.open(detailOf(mainSrc), '_blank', 'noopener,noreferrer')
                if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                  setPopupBlocked(true)
                  setTimeout(() => setPopupBlocked(false), 5000)
                }
              }}
              className="link"
              aria-label="전체 화면 보기"
            >
              <ExternalLink size={18} />
              전체 화면 보기
            </button>
          </div>
          {popupBlocked && (
            <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '.85rem', color: 'var(--mute)', fontFamily: 'Pretendard Variable, sans-serif' }}>
              팝업이 차단됐습니다. 주소창 우측의 팝업 허용 아이콘을 클릭해주세요.
            </p>
          )}
        </div>

        {/* 정보 */}
        <div
          className="lg:w-[40%] flex flex-col gap-4"
          style={{
            filter: posterHovered ? 'blur(5px)' : 'blur(0px)',
            opacity: posterHovered ? 0.35 : 1,
            pointerEvents: posterHovered ? 'none' : 'auto',
            transition: posterHovered
              ? 'filter 280ms ease, opacity 280ms ease'
              : 'filter 480ms ease, opacity 480ms ease',
          }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary font-body leading-snug" style={{ wordBreak: 'keep-all' }}>
            {work.title}
          </h1>
          {membersLen === 1 ? (
            <p className="text-base font-body">
              <span className="font-semibold text-text-primary">{work.members[0].name}</span>
              <span className="text-text-muted">{' / '}{work.members[0].studentId}, {work.members[0].major}</span>
            </p>
          ) : (
            <p className="text-base text-text-muted font-body">{work.author}</p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <p className="font-bold font-ui tracking-wider uppercase text-text-primary" style={{ fontSize: '21px' }}>{work.subjectName}</p>
            {work.award && (
              <span style={{
                border: 'none',
                color: 'var(--ink)',
                background: 'transparent',
                padding: 0,
                borderRadius: 0,
                fontSize: '.8rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                display: 'inline-block',
                flexShrink: 0,
                fontFamily: "'SUIT Variable', 'SUIT', sans-serif",
              }}>
                {work.awardLabel}
              </span>
            )}
          </div>

          {hasLinks && (
            <div className="flex flex-row flex-wrap gap-2">
              {work.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {link.label}
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          )}

          {work.description && (
            <p className="text-sm text-text-primary font-body leading-relaxed" style={{ wordBreak: 'keep-all' }}>
              {work.description}
            </p>
          )}

          {renderMembers()}

          {work.details?.length ? (
            <div className="proj-sections">
              {work.details.map((d) => (
                <section key={d.h}>
                  <h2 className="proj-sec-h">{d.h}</h2>
                  <div className="proj-sec-p">
                    {splitLines(d.p).map((t, i) => <p key={i}>{t}</p>)}
                  </div>
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* 매거진 캐러셀 (layout === 'magazine' && pages > 1) */}
      {isMagazine && magPages.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <div style={{
            width: '1px', height: '1px',
            background: 'linear-gradient(to right, transparent, var(--surface-2), transparent)',
            marginBottom: '32px',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            {/* 캐러셀 뷰어 */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {/* 이전 버튼 */}
              <button
                onClick={() => setMagIdx(i => (i - 1 + magPages.length) % magPages.length)}
                className="icon-btn" style={{ flexShrink: 0, marginRight: 'var(--sp-2)' }}
                aria-label="이전 페이지"
              >
                <ChevronLeft size={16} />
              </button>

              {/* 이미지 */}
              <div style={{
                aspectRatio: '1 / 1.414',
                maxWidth: '220px',
                width: '100%',
                background: 'var(--surface)',
                border: 'none',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {magPages[magIdx] && (
                  <img
                    key={magIdx}
                    src={magThumbFailed.has(magIdx) ? magPages[magIdx] : detailOf(magPages[magIdx])}
                    alt={`${work.title} 매거진 ${magIdx + 1}페이지`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setMagThumbFailed(s => new Set(s).add(magIdx))}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                  />
                )}
              </div>

              {/* 다음 버튼 */}
              <button
                onClick={() => setMagIdx(i => (i + 1) % magPages.length)}
                className="icon-btn" style={{ flexShrink: 0, marginLeft: 'var(--sp-2)' }}
                aria-label="다음 페이지"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* 페이지 카운터 + 도트 */}
            <p style={{ fontSize: '.8rem', color: 'var(--mute)', letterSpacing: '0.1em', userSelect: 'none' }}>
              {magIdx + 1} / {magPages.length}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '5px', maxWidth: '320px' }}>
              {magPages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMagIdx(i)}
                  style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    padding: 0, border: 'none',
                    background: i === magIdx ? 'var(--y)' : 'var(--surface-2)',
                    cursor: 'pointer',
                    transition: 'background 200ms ease',
                  }}
                  aria-label={`매거진 ${i + 1}페이지`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 라이트박스 */}
      {lightboxOpen && mainSrc && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,10,10,0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: reducedMotion ? 'none' : 'lightbox-in 0.3s ease-out',
          }}
        >
          <button
            onClick={e => { e.stopPropagation(); setLightboxOpen(false) }}
            className="icon-btn on-image" style={{ position: 'absolute', top: 'var(--sp-3)', right: 'var(--sp-3)' }}
            aria-label="닫기"
          >
            <X size={18} />
          </button>
          <img
            src={mainDetailFailed.has(mainSrc) ? mainSrc : detailOf(mainSrc)}
            alt={`${work.author} - ${work.title}`}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '95vw', maxHeight: '95vh',
              objectFit: 'contain', display: 'block',
            }}
          />
        </div>
      )}
    </div>
  )
}
