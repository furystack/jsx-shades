/** Main entry point for tests */

// tslint:disable

declare let global: any

global.HTMLElement = class {}

global.MutationObserver = class implements MutationObserver {
  public disconnect(): void {
    /** */
  }

  public observe(_target: Node, _options: MutationObserverInit): void {
    /** */
  }
  public takeRecords(): MutationRecord[] {
    throw new Error('Method not implemented.')
  }
}

global.customElements = new (class implements CustomElementRegistry {
  private store = new Map<string, any>()
  public define(name: string, constructor: Function, _options?: ElementDefinitionOptions): void {
    this.store.set(name, constructor)
  }
  public get(name: string) {
    return this.store.get(name)
  }
  public whenDefined(_name: string): Promise<void> {
    return Promise.reject('Method not implemented.')
  }
  public upgrade(_root: Node) {
    /** */
  }
})()
// tslint:enable

export * from './ComponentTests'
export * from './ComponentFactoryTests'
