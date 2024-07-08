const url = new URL('http://localhost:8000')

const r1 = await fetch(url, {
  method: 'POST',
  body: JSON.stringify({ foo: 'bar' }),
})

const s1 = await r1.json()
console.log(s1)
