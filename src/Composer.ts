import {
  Post,
  type OGLRenderingContext,
  type Transform,
  type Camera
} from 'ogl'

import type {
  Clock,
  Viewport,
  Lifecycle
} from '~/core'

export interface ComposerOptions  {
  viewport: Viewport
  clock: Clock
  scene?: Transform
  camera?: Camera
}

export class Composer implements Lifecycle {
  public gl: OGLRenderingContext
  public clock: Clock
  public viewport: Viewport
  public scene?: Transform
  public camera?: Camera
  public scenePost: Post

  public sceneRenderParameters: {
    scene?: Transform
    camera?: Camera
  }

  public constructor(gl: OGLRenderingContext, {
    viewport,
    clock,
    scene,
    camera
  }: ComposerOptions) {
    this.gl = gl
    this.clock = clock
    this.viewport = viewport
    this.scene = scene
    this.camera = camera
    this.scenePost = new Post(gl)

    this.sceneRenderParameters = {
      scene,
      camera
    }
  }

  public async load(): Promise<void> {

  }

  public update(): void {

  }

  public resize(): void {
    this.gl.renderer.dpr = this.viewport.dpr
    this.gl.renderer.setSize(this.viewport.size.x, this.viewport.size.y)

    this.camera?.perspective({
      aspect: this.viewport.size.x / this.viewport.size.y
    })

    this.scenePost.resize({
      width: this.viewport.size.x,
      height: this.viewport.size.y,
      dpr: this.viewport.dpr
    })
  }

  public render(): void {
    this.scenePost.render(this.sceneRenderParameters)
  }

  public dispose(): void {

  }
}
