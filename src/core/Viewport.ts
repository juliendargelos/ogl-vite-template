import { Vec2 } from 'ogl'
import { Lifecycle } from './Lifecycle'

export interface ViewportOptions {
  element: Element
  maximumDpr?: number
  resize?: () => void
}

export class Viewport implements Lifecycle {
  public element: Element
  public maximumDpr: number
  public size = new Vec2(1, 1)
  public ratio = 1
  public dpr = 1
  public resize: () => void
  public needsUpdate = false
  private resizeObserver?: ResizeObserver

  public get container(): Element | null {
    return <Element>this.element.parentNode
  }

  public constructor({
    element,
    resize,
    maximumDpr = Infinity
  }: ViewportOptions) {
    this.element = element
    this.maximumDpr = maximumDpr
    this.resize = resize || (() => {})
  }

  public update(): void {
    if (!this.needsUpdate) {
      return
    }

    this.needsUpdate = false
    this.resize()
  }

  public start(): void {
    this.stop()

    if (!this.container) {
      return
    }

    this.set(this.container.getBoundingClientRect())

    this.resizeObserver = new ResizeObserver(this.resizeObserverCallback)
    this.resizeObserver.observe(this.container)
  }

  public stop(): void {
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
  }

  public dispose(): void {
    this.stop()
  }

  public set(
    size: { width: number, height: number },
    dpr: number = window.devicePixelRatio || 1
  ): void {
    this.size.set(size.width, size.height)
    this.ratio = size.width / size.height
    this.dpr = Math.min(dpr, this.maximumDpr)
    this.needsUpdate = true
  }

  private resizeObserverCallback = ([entry]: ResizeObserverEntry[]) => {
    this.set(entry.contentRect)
  }
}
