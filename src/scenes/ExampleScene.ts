import {
  Transform,
  Mesh,
  Torus,
  NormalProgram,
  Camera,
  type OGLRenderingContext
} from 'ogl'

import type {
  Viewport,
  Clock,
  Lifecycle
} from '~/core'

export interface MainSceneOptions {
  clock: Clock
  camera: Camera
  viewport: Viewport
}

export class ExampleScene extends Transform implements Lifecycle {
  public clock: Clock
  public camera: Camera
  public viewport: Viewport
  public torus: Mesh<Torus, NormalProgram>

  public constructor(gl: OGLRenderingContext, {
    clock,
    camera,
    viewport
  }: MainSceneOptions) {
    super()

    this.clock = clock
    this.camera = camera
    this.viewport = viewport

    this.torus = new Mesh(gl, {
      geometry: new Torus(gl, {
        radius: 0.5,
        tube: 0.2,
        radialSegments: 40,
        tubularSegments: 80
      }),
      program: new NormalProgram(gl)
    })

    this.camera.position.set(0, 0, -3)
    this.camera.lookAt([0, 0, 0])

    this.addChild(this.torus)
  }

  public async load(): Promise<void> {

  }

  public update(): void {
    this.torus.rotation.x += 0.0002 * this.clock.delta
    this.torus.rotation.y += 0.0002 * this.clock.delta
  }

  public resize(): void {
    this.camera.aspect = this.viewport.ratio
    this.camera.updateProjectionMatrix()
  }

  public dispose(): void {
    this.torus.geometry.remove()
    this.torus.program.remove()
  }
}
