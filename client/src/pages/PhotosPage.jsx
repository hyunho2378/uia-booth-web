import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import { useSearchParams } from 'react-router-dom'
import { events, photos } from '../data/photos'

export default function PhotosPage() {
  const [params] = useSearchParams()
  const startEvent = events.some(e => e.id === params.get('event')) ? params.get('event') : 'all'
  const [eventId, setEventId] = useState(startEvent)
  const [albumId, setAlbumId] = useState('all')
  const [open, setOpen] = useState(-1)

  const event = events.find(e => e.id === eventId)
  const list = useMemo(
    () => photos.filter(p => (eventId === 'all' || p.event === eventId) && (albumId === 'all' || p.album === albumId)),
    [eventId, albumId]
  )

  useEffect(() => { document.title = 'Photo | UIA' }, [])

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

  const labelOf = p => {
    const ev = events.find(e => e.id === p.event)
    const al = ev.albums.find(a => a.id === p.album)
    return { en: ev.en + ', ' + al.en, ko: ev.ko + ', ' + al.ko }
  }

  const pickEvent = id => { setEventId(id); setAlbumId('all'); setOpen(-1) }
  const tab = (active) => 'tab' + (active ? ' is-on' : '')

  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="Photo" />

      <div className="flex flex-wrap" style={{ gap: 'var(--sp-1) var(--sp-4)', marginBottom: 'var(--sp-1)' }}>
        <button type="button" onClick={() => pickEvent('all')} className={tab(eventId === 'all')}>전체</button>
        {events.map(e => (
          <button key={e.id} type="button" onClick={() => pickEvent(e.id)} className={tab(eventId === e.id)}>
            {e.ko}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap" style={{ gap: 'var(--sp-1) var(--sp-4)', marginBottom: 'var(--sp-4)', minHeight: 'var(--btn-h)' }}>
        {event && (
          <>
            <button type="button" onClick={() => { setAlbumId('all'); setOpen(-1) }} className={tab(albumId === 'all')}>전체</button>
            {event.albums.map(a => (
              <button key={a.id} type="button" onClick={() => { setAlbumId(a.id); setOpen(-1) }} className={tab(albumId === a.id)}>
                {a.ko}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="photo-cols">
        {list.map((p, i) => (
          <figure key={p.src} className="photo-item">
            <button type="button" onClick={() => setOpen(i)} className="photo-btn" aria-label={labelOf(p).ko}>
              <img src={p.thumb} alt={labelOf(p).ko} loading={i < 12 ? 'eager' : 'lazy'} decoding="async" />
            </button>
          </figure>
        ))}
      </div>

      {open >= 0 && list[open] && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          <img src={list[open].src} alt={labelOf(list[open]).ko} onClick={e => e.stopPropagation()} />
          <p className="lightbox-cap" onClick={e => e.stopPropagation()}>
            <span className="t-label" style={{ color: '#f2f2f2', display: 'block' }}>{labelOf(list[open]).ko}</span>
            </p>
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label="닫기"><X size={24} /></button>
          <button type="button" className="lb-btn lb-prev" onClick={e => { e.stopPropagation(); step(-1) }} aria-label="이전 사진"><ChevronLeft size={32} /></button>
          <button type="button" className="lb-btn lb-next" onClick={e => { e.stopPropagation(); step(1) }} aria-label="다음 사진"><ChevronRight size={32} /></button>
        </div>
      )}
    </div>
  )
}
