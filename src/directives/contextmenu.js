/* eslint-disable no-underscore-dangle */
export default {
  inserted(el, binding, vnode) {
    el.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      const menuDict = binding.value
      let key = [...event.target.classList].find((c) => menuDict[c])
      if (!key && menuDict.__default) {
        key = '__default'
      }

      const menuList = menuDict[key] ? menuDict[key].list : []
      const oldBox = document.getElementById('contextmenuBox')
      if (oldBox) { oldBox.parentNode.removeChild(oldBox) }
      if (!key) { return }
      const menuBox = document.createElement('DIV')
      menuBox.id = 'contextmenuBox'
      menuBox.style.cssText = `position: fixed; top: ${event.y}px; left: ${event.x}px;`
      menuList.forEach((item) => {
        const menuItem = document.createElement('DIV')
        menuItem.className = 'contextmenuItem'
        menuItem.innerHTML = item.label
        menuItem.addEventListener('click', () => item.handler(event.target, el, vnode.context, event), { once: true })
        menuBox.appendChild(menuItem)
      })
      document.addEventListener('click', () => menuBox.parentNode && menuBox.parentNode.removeChild(menuBox), { once: true })
      document.body.appendChild(menuBox)
    })
  },
}
