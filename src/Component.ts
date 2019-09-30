import './jsx'

/**
 * Abstact class that defines a component
 */
export abstract class Component<TAttributes> extends HTMLElement {
  /**
   * Returns the component props
   */
  public get props(): TAttributes {
    return this._props
  }

  /**
   * Sets the component props
   */
  public set props(v: TAttributes) {
    this._props = v
    this.onPropsChanged && this.onPropsChanged(v)
  }

  /**
   * Optional callback that will be fired when the component is (re)attached
   */
  public onAttached?: () => void
  /**
   * Optional callback that will be fired when the component is detached from the DOM
   */
  public onDetached?: () => void
  /**
   * Optional callback that will be fired when the props changes
   */
  public onPropsChanged?: (newProps: TAttributes) => void

  private _props!: TAttributes

  constructor(props: TAttributes) {
    super()
    this._props = props
  }
}

/**
 * Type guard that checks if a given object is Component Class definition
 * @param obj The object (constructor) to check
 */
export const isComponentClass = <TProps>(obj: any): obj is { new (props: TProps): Component<TProps> } => {
  // ToDo: Check this
  // eslint-disable-next-line no-prototype-builtins
  return Component.isPrototypeOf(obj)
}

/**
 * Type guard that checks if the given object is an instance of a component
 * @param obj The object to check
 */
export const isComponentInstance = <TProps>(obj: any): obj is Component<TProps> => {
  return obj instanceof Component
}
