const viewer = document.querySelector('.rz-viewer')
const routeLinks = [...document.querySelectorAll('.rz-route a')]
if (routeLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const active = entries.find(entry => entry.isIntersecting)
    if (!active) return
    routeLinks.forEach(link => {
      if (link.hash === `#${active.target.id}`) link.setAttribute('aria-current', 'location')
      else link.removeAttribute('aria-current')
    })
  }, { rootMargin: '-15% 0px -55% 0px' })
  routeLinks.forEach(link => {
    const chapter = document.querySelector(link.hash)
    if (chapter) observer.observe(chapter)
  })
}
let opener
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-screen]')
  if (!link || !viewer || typeof viewer.showModal !== 'function') return
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  opener = link
  viewer.querySelector('img').src = link.href
  viewer.querySelector('img').alt = link.dataset.screen
  viewer.querySelector('.rz-viewer-head p').textContent = link.dataset.screen
  viewer.showModal()
})
viewer?.querySelector('button').addEventListener('click', () => viewer.close())
viewer?.addEventListener('close', () => opener?.focus())
viewer?.addEventListener('click', event => {
  if (event.target !== viewer) return
  const box = viewer.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) viewer.close()
})
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)))
    let count = 0
    document.querySelectorAll('[data-category]').forEach(item => {
      item.hidden = button.dataset.filter !== 'all' && item.dataset.category !== button.dataset.filter
      if (!item.hidden) count++
    })
    const status = document.querySelector('[data-count]')
    if (status) status.textContent = `Показано экранов: ${count}`
  })
})
