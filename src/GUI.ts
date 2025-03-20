import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import type { Lifecycle } from '~/core'
import type { App } from '~/App'

export class GUI extends Pane implements Lifecycle {
  public app: App
  public fpsGraph: EssentialsPlugin.FpsGraphBladeApi

  public get container(): HTMLElement {
    return <HTMLElement>this.element.parentNode
  }

  public constructor(app: App) {
    super({
      container: document.createElement('div')
    })

    this.registerPlugin(EssentialsPlugin)
    this.app = app

    this.fpsGraph = <EssentialsPlugin.FpsGraphBladeApi>this.addBlade({
      view: 'fpsgraph',
      label: '',
      rows: 2
    })

    this.app.loop.tick = () => {
      this.fpsGraph.begin()
      this.app.tick()
      this.fpsGraph.end()
    }

    const lifecycleMethods = ['start', 'stop', 'dispose'] as const

    ;(<EssentialsPlugin.ButtonGridApi>this.addBlade({
      view: 'buttongrid',
      size: [lifecycleMethods.length, 1],
      cells: (x: number) => ({ title: lifecycleMethods[x] }),
      label: ''
    })).on('click', (event: any) => {
      this.app[lifecycleMethods[event.index[0]]]()
      this.toggleFpsGraph(this.app.loop.running)
    })

    this.applyStyle()
  }

  public start(): void {
    this.app.renderer.gl.canvas.parentElement?.appendChild(this.container)
  }

  public stop(): void {
    this.container.remove()
  }

  public dispose(): void {
    this.app.loop.tick = this.app.tick
    this.stop()
    super.dispose()
  }

  private applyStyle(): void {
    this.container.style.width = '300px'
    this.container.style.top = '20px'
    this.container.style.right = '20px'
    this.container.style.position = 'absolute'

    this.element.style.textAlign = 'right'
    this.element.style.setProperty('--tp-base-background-color', '#000')
    this.element.style.setProperty('--tp-base-shadow-color', 'rgba(0, 0, 0, 0)')
    this.element.style.setProperty('--bld-vw', '190px')
  }

  private toggleFpsGraph(enabled: boolean): void {
    this.fpsGraph.disabled = !enabled

    const stopwatch = (<any>this.fpsGraph.controller.valueController).stopwatch_

    if (!stopwatch.baseCalculateFps_) {
      stopwatch.baseCalculateFps_ = stopwatch.calculateFps_
    }

    stopwatch.calculateFps_ = enabled ? stopwatch.baseCalculateFps_ : () => 0

    if (!enabled) {
      stopwatch.fps_ = 0
    }
  }
}
