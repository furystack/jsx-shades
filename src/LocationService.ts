/**
 * Type definition for location change callbacks
 */
export type LocationChangedCallbackType = (data: any, title?: string, url?: string) => any

/**
 * Service class for wrapping and observins url location changes
 */
export class LocationService {
  /**
   * Registers a callback for a location change
   * @param callback The callback to be fired
   */
  public static OnStateChanged(callback: LocationChangedCallbackType) {
    this.subscribers.push(callback)
  }

  /**
   * Wraps the native history.pushState method and fires the callback to the subscribers
   * @param data history.pushState data
   * @param title history.pushState title
   * @param url history.pushState url
   */
  public static PushState(data: any, title?: string, url?: string) {
    history.pushState(data, title || '', url)
    for (const subscriber of this.subscribers) {
      subscriber(data, title, url)
    }
  }

  /**
   * Wraps the native history.replaceState method and fires the callback to the subscribers
   * @param data history.replaceState data
   * @param title history.replaceState title
   * @param url history.replaceState url
   */
  public static ReplaceState(data: any, title?: string, url?: string) {
    history.replaceState(data, title || '', url)
    for (const subscriber of this.subscribers) {
      subscriber(data, title, url)
    }
  }

  /**
   * Notify the subscribers if a popState event has been occured.
   * @param state the new state
   */
  public static PopState(state: any) {
    for (const subscriber of this.subscribers) {
      subscriber(state)
    }
  }

  /**
   * Returns a normalized current Path object
   */
  public static GetPath() {
    return location.hash
      .split('/')
      .filter(s => s.length > 0 && s !== '#')
      .join('/')
  }
  private static subscribers: LocationChangedCallbackType[] = []
}

window.onpopstate = (ev: PopStateEvent) => {
  LocationService.PopState(ev.state)
}
