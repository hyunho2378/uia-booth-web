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

  const labelOf = p => {
    const ev = events.find(e => e.id === p.event)
    const al = ev.albums.find(a => a.id === p.album)
    return { en: ev.en + ', ' + al.en, ko: ev.ko + ', ' + al.ko }
  }

  const pickEvent = id => { setEventId(id); setAlbumId('all'); setOpen(-1) }
  const tab = (active) => ({ color: active ? 'var(--ink)' : 'var(--mute)', transition: 'color .25s var(--ease)', paddingBlock: '.4rem' })

  return (
    <div style={{ paddingBottom: 'clamp(4rem, 8vw, 10rem)' }}>
      <PageHeader title="Photos" ko="현장 사진" subtitle="임팩톤@춘천, 사회적가치 페스타, 경주 포럼의 현장 사진입니다." />

      <div className="flex flex-wrap" style={{ gap: '.4rem 2rem', marginBottom: '.6rem' }}>
        <button type="button" onClick={() => pickEvent('all')} className="t-label" style={tab(eventId === 'all')}>All <span style={{ fontWeight: 500, marginLeft: '.3em' }}>전체</span></button>
        {events.map(e => (
          <button key={e.id} type="button" onClick={() => pickEvent(e.id)} className="t-label" style={tab(eventId === e.id)}>
            {e.en} <span style={{ fontWeight: 500, marginLeft: '.3em' }}>{e.ko}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap" style={{ gap: '.4rem 1.6rem', marginBottom: 'clamp(2rem, 3vw, 4rem)', minHeight: '2.4rem' }}>
        {event && (
          <>
            <button type="button" onClick={() => { setAlbumId('all'); setOpen(-1) }} className="t-label" style={tab(albumId === 'all')}>All <span style={{ fontWeight: 500, marginLeft: '.3em' }}>전체</span></button>
            {event.albums.map(a => (
              <button key={a.id} type="button" onClick={() => { setAlbumId(a.id); setOpen(-1) }} className="t-label" style={tab(albumId === a.id)}>
                {a.en} <span style={{ fontWeight: 500, marginLeft: '.3em' }}>{a.ko}</span>
              </button>
            ))}
          </>
        )}
      </div>

      <div className="photo-cols">
        {list.map((p, i) => (
          <figure key={p.src} className="photo-item">
            <button type="button" onClick={() => setOpen(i)} className="photo-btn" style={{ aspectRatio: String(p.r) }} aria-label={labelOf(p).en}>
              <img src={p.thumb} alt={labelOf(p).en} loading="lazy" decoding="async" />
            </button>
          </figure>
        ))}
      </div>

      {open >= 0 && list[open] && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          <img src={list[open].src} alt={labelOf(list[open]).en} onClick={e => e.stopPropagation()} />
          <p className="lightbox-cap" onClick={e => e.stopPropagation()}>
            <span className="t-label" style={{ color: '#f2f2f2', display: 'block' }}>{labelOf(list[open]).en}</span>
            <span className="t-ko" style={{ color: '#adaeae' }}>{labelOf(list[open]).ko}</span>
          </p>
          <button type="button" className="lb-btn lb-close" onClick={close} aria-label="Close"><X size={24} /></button>
          <button type="button" className="lb-btn lb-prev" onClick={e => { e.stopPropagation(); step(-1) }} aria-label="Previous"><ChevronLeft size={32} /></button>
          <button type="button" className="lb-btn lb-next" onClick={e => { e.stopPropagation(); step(1) }} aria-label="Next"><ChevronRight size={32} /></button>
        </div>
      )}
    </div>
  )
}
