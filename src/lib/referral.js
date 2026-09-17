export const setRef = (code) => {
  localStorage.setItem('st_ref', JSON.stringify({ code, expires: Date.now() + 30 * 24 * 60 * 60 * 1000 }))
}

export const getRef = () => {
  try {
    const raw = localStorage.getItem('st_ref')
    if (!raw) return null
    const { code, expires } = JSON.parse(raw)
    if (Date.now() > expires) { localStorage.removeItem('st_ref'); return null }
    return code
  } catch { return null }
}
