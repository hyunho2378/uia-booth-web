import { useCallback, useEffect, useState } from 'react'
import { getVisitor, findByCode } from './db'
import { loadVisitor, saveVisitor, clearVisitor } from './storage'

// status: loading, none, ready, error
export function useVisitor() {
  const [status, setStatus] = useState('loading')
  const [visitor, setVisitor] = useState(null)
  const [id, setId] = useState(null)

  const load = useCallback(async (vid) => {
    setStatus('loading')
    try {
      const v = await getVisitor(vid)
      if (!v) { clearVisitor(); setVisitor(null); setId(null); setStatus('none'); return }
      setId(vid); setVisitor(v); setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    const s = loadVisitor()
    if (!s || !s.id) { setStatus('none'); return }
    load(s.id)
  }, [load])

  const attach = useCallback(async (code) => {
    setStatus('loading')
    try {
      const vid = await findByCode(code)
      if (!vid) { setStatus('none'); return false }
      saveVisitor({ id: vid })
      await load(vid)
      return true
    } catch {
      setStatus('error')
      return false
    }
  }, [load])

  const adopt = useCallback(async (vid) => { saveVisitor({ id: vid }); await load(vid) }, [load])
  const reset = useCallback(() => { clearVisitor(); setVisitor(null); setId(null); setStatus('none') }, [])

  return { status, visitor, id, attach, adopt, reset, reload: () => id && load(id) }
}
