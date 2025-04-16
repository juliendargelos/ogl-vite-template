import { Renderer, Camera, Orbit } from 'ogl'
import { Clock, Loop, Viewport, type Lifecycle } from '~/core'
import type { GUI } from '~/GUI'
import { Composer } from '~/Composer'
import { ExampleScene } from '~/scenes/ExampleScene'

export interface AppOptions {
  canvas?: HTMLCanvasElement
  debug?: boolean
}

export class App implements Lifecycle {
  public debug: boolean
  public renderer: Renderer
  public composer: Composer
  public camera: Camera
  public loop: Loop
  public clock: Clock
  public viewport: Viewport
  public scene: ExampleScene
  public orbit: Orbit
  public gui?: GUI

  public constructor({
    canvas,
    debug = false
  }: AppOptions = {}) {
    this.debug = debug
    this.clock = new Clock()

    this.renderer = new Renderer({
      canvas,
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      depth: true
    })

    this.camera = new Camera(this.renderer.gl)

    this.viewport = new Viewport({
      maximumDpr: 2,
      element: this.renderer.gl.canvas,
      resize: this.resize
    })

    this.scene = new ExampleScene(this.renderer.gl, {
      viewport: this.viewport,
      camera: this.camera,
      clock: this.clock
    })

    this.composer = new Composer(this.renderer.gl, {
      viewport: this.viewport,
      clock: this.clock,
      scene: this.scene,
      camera: this.camera
    })

    this.loop = new Loop({
      tick: this.tick
    })

    this.orbit = new Orbit(this.camera, {
      element: this.renderer.gl.canvas,
      enabled: false
    })
  }

  /**
   * Load the app with its components and assets
   */
  public async load(): Promise<void> {
    await Promise.all([
      this.composer.load(),
      this.scene.load()
    ])

    if (this.debug) {
      this.gui = new (await import('./GUI')).GUI(this)
    }
  }

  /**
   * Start the app rendering loop
   */
  public start(): void {
    this.viewport.start()
    this.clock.start()
    this.loop.start()
    this.gui?.start()

    this.orbit.enabled = true
  }

  /**
   * Stop the app rendering loop
   */
  public stop(): void {
    this.viewport.stop()
    this.loop.stop()

    this.orbit.enabled = false
  }

  /**
   * Update the app state, called each loop tick
   */
  public update(): void {
    this.clock.update()
    this.viewport.update()
    this.orbit.update()
    this.scene.update()
    this.composer.update()
  }

  /**
   * Render the app with its current state, called each loop tick
   */
  public render(): void {
    this.composer.render()
  }

  /**
   * Stop the app and dispose of used resourcess
   */
  public dispose(): void {
    this.viewport.dispose()
    this.loop.dispose()
    this.scene.dispose()
    this.composer.dispose()
    this.orbit.remove()
    this.gui?.dispose()
  }

  /**
   * Tick handler called by the loop
   */
  public tick = (): void => {
    this.update()
    this.render()
  }

  /**
   * Resize handler called by the viewport
   */
  public resize = (): void => {
    this.composer.resize()
    this.scene.resize()
  }

  /**
   * Create, load and start an app instance with the given options
   */
  public static async mount(options: AppOptions): Promise<App> {
    const app = new this(options)
    await app.load()
    app.start()

    return app
  }
}
