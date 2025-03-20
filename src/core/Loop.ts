import { Lifecycle } from './Lifecycle'

export interface LoopParameters {
  tick?: () => void
}

export class Loop implements Lifecycle {
  public tick: () => void
  public frameRequest?: number

  public constructor({
    tick
  }: LoopParameters = {}) {
    this.tick = tick || (() => {})
  }

  public get running(): boolean {
    return this.frameRequest !== undefined
  }

  public start(): void {
    this.running || this.run()
  }

  public stop(): void {
    this.running && cancelAnimationFrame(this.frameRequest!)
    this.frameRequest = undefined
  }

  private run = () => {
    this.tick()
    this.frameRequest = requestAnimationFrame(this.run)
  }

  public dispose(): void {
    this.stop()
  }
}
