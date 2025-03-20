import { Lifecycle } from './Lifecycle'

export class Clock implements Lifecycle {
  public time: number = 0
  public elapsed: number = 0
  public delta: number = 0

  public update(): void {
    this.delta = -this.time + (this.time = Date.now())
    this.elapsed += this.delta
  }

  public start(): void {
    this.time = Date.now()
    this.delta = 0
  }
}
