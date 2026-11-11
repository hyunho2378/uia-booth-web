import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { events, photos } from '../data/photos'

const FILTERS = [{ id: 'all', en: 'All', ko: '전체' }, ...events]

export default function PhotosPage() {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(-1)
  const list = useMemo(() => (filter === 'all' ? photos : photos.filter(p => p.event === filter)), [filter])

  useEffect(() => { document.title = 'Photos | UIA 특별관' }, [])

  const close = useCallback(() => setOpen(-1), [])
  const step = useCallback(d => setOpen(i => (i < 0 ? i : (i + d + list.length) % list.length)), [list.length])
  useEffect(() => {
    if (open < 0) return
    const onKey = e => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, close, step])

  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="Photos" ko="현장 사진" subtitle="임팩톤@춘천, 사회적가치 페스타, 경주 포럼의 현장 사진입니다." />

      <div className="flex flex-wrap" style={{ gap: '.4rem 2rem', marginBottom: 'clamp(2rem, 3vw, 4rem)' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            type="button"
            onClick={() => { setFilter(f.id); setOpen(-1) }}
            className="t-label"
            style={{ color: filter === f.id ? 'var(--ink)' : 'var(--mute)', transition: 'color .25s var(--ease)', paddingBlock: '.4rem' }}
          >
            {f.en} <span style={{ fontWeight: 500, marginLeft: '.3em' }}>{f.ko}</span>
          </button>
        ))}
      </div>

      <div className="photo-cols">
        {list.map((p, i) => (
          <figure key={p.src} className="photo-item">
            <button type="button" onClick={() => setOpen(i)} className="photo-btn" style={{ aspectRatio: String(p.r) }} aria-label={p.en}>
              <img src={p.src} alt={p.en} loading="lazy" decoding="async" />
            </button>
            <figcaption>
              <span className="t-label" style={{ color: 'var(--ink)', display: 'block' }}>{p.en}</span>
              <span className="t-ko" style={{ display: 'block', fontSize: '.9rem' }}>{p.ko}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {open >= 0 && list[open] && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          <img src={list[open].src} alt={list[open].en} onClick={e => e.stopPropagation()} />
          <p className="lightbox-cap" onClick={e => e.stopPropagation()}>
            <span className="t-label" style={{ color: '#f2f2f2', display: 'block' }}>{list[open].en}</span>
            <span className="t-ko" style={{ color: '#adaeae' }}>{list[open].ko}</span>
          </p>
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label="Close"><X size={24} /></button>
          <button type="button" className="lb-btn lb-prev" onClick={e => { e.stopPropagation(); step(-1) }} aria-label="Previous"><ChevronLeft size={32} /></button>
          <button type="button" className="lb-btn lb-next" onClick={e => { e.stopPropagation(); step(1) }} aria-label="Next"><ChevronRight size={32} /></button>
        </div>
      )}
    </div>
  )
}
