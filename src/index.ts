import { App } from '~/App'

App
  .mount({
    debug: true,
    canvas: document.querySelector('canvas')!
  })
  .then(() => {
    document.body.classList.add('loaded')
  })
