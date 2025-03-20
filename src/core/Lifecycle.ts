export interface Lifecycle {
  /**
   * Load resources and component dependencies
   */
  load?(): Promise<void>

  /**
   * Start or enable component
   */
  start?(): void

  /**
   * Stop or enable component
   */
  stop?(): void

  /**
   * Update component state, called each loop tick
   */
  update?(): void

  /**
   * Resize component, called when the viewport is updated
   */
  resize?(): void

  /**
   * Stop component and release used resourcess
   */
  dispose?(): void
}
