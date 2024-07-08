import './islands/counter'

// crate a helper to prefetch all the <a> tags with [data-prefetch] attribute

document.addEventListener('DOMContentLoaded', () => {
  const prefetchLinks = new Map<string, Promise<Response>>()

  function prefetch(url: string) {
    if (prefetchLinks.has(url)) return
    prefetchLinks.set(url, fetch(url))
  }

  document.querySelectorAll('a[data-prefetch]').forEach(($a) => {
    console.log($a)

    const url = $a.getAttribute('href')!

    $a.addEventListener('click', (e) => {
      e.preventDefault()
      if (prefetchLinks.has(url)) {
        prefetchLinks
          .get(url)!
          .then((res) => res.text().then((html) => apply(html, url)))
      } else {
        fetch(url).then((res) => res.text().then((html) => apply(html, url)))
      }
    })

    $a.addEventListener('mouseover', () => {
      prefetch(url)
    })
  })

  function apply(html: string, url: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    document.body.innerHTML = doc.body.innerHTML
    // document.title = doc.title
    document.head.innerHTML = doc.head.innerHTML
    history.pushState({}, '', url)

    /* doc.querySelectorAll('script').forEach(($script) => {
      const script = document.createElement('script')
      script.src = $script.src
      script.textContent = $script.textContent
      document.body.appendChild(script)
    }) */
  }
})
