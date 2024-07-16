console.log('Client Router Loaded')

interface CacheRecord {
  value: Promise<string>
  createdAt: number
}

const kv = new Map<string, CacheRecord>() // path: html

const TTL = 5 * 60 * 1000 // 5 minutes

function isValid(record: CacheRecord) {
  return Date.now() - record.createdAt < TTL
}

const cache = {
  get: (key: string) => {
    const record = kv.get(key)
    if (!record) return

    if (!isValid(record)) {
      kv.delete(key)
      return
    }
    return record.value
  },
  set: (key: string, value: Promise<string>) => {
    kv.set(key, { value, createdAt: Date.now() })
  },
}

const getContent = (path: string) => fetch(path).then((res) => res.text())

function prefetch(path: string) {
  if (path === location.pathname || cache.get(path)) {
    return
  }
  console.log('prefetching:', path)
  cache.set(path, getContent(path))
}

async function navigate(path: string) {
  const html = await (cache.get(path) ?? getContent(path))
  const doc = new DOMParser().parseFromString(html, 'text/html')

  setTimeout(() => {
    document.title = doc.title
    document.body.replaceWith(doc.body)

    history.pushState({}, '', path)

    onLoad()
  }, 200)
}

function setupNavigation() {
  document
    .querySelectorAll<HTMLAnchorElement>('a[data-prefetch]')
    .forEach(($a) => {
      const path = $a.getAttribute('href')!

      $a.addEventListener('mouseover', () => prefetch(path), { once: true })

      $a.addEventListener('click', (e) => {
        e.preventDefault()
        navigate(path)
      })
    })
}

export function onLoad() {
  setupNavigation()
  window.App.hydrate()
}

export function initRouter() {
  console.log('INIT', document.location)

  // document.body.style.transition = 'opacity 0.2s ease-in-out'

  // window.addEventListener('popstate', async () => {
  //   console.log('popstate', location)
  //   const html = await getContent(location.pathname)
  //   replace(html, location.pathname)
  // })
}
