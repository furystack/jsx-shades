import "../render-engine/jsx";

/**
 * Service that observes the DOM and triggers callbacks (like attached / detached)
 */
export class DomObserverService {

    /**
     * Ensures that the service is up and running
     */
    public static EnsureStarted() {
        if (!this._isRunning) {
            this.mutationObserver.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
            this._isRunning = true;
        }
    }

    private static _isRunning = false;

    private static mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((n) => {
                const children = (n as HTMLElement).querySelectorAll("*");
                children.forEach((child) => DomObserverService.attachJsxElement(child));
                DomObserverService.attachJsxElement(n);
            });
            mutation.removedNodes.forEach((n) => {
                const children = (n as HTMLElement).querySelectorAll("*");
                children.forEach((child) => DomObserverService.detachJsxElement(child));
                DomObserverService.detachJsxElement(n);
            });
        });
    });

    private static attachJsxElement(n: Node) {
        const jsxElement: JSX.Element = n as JSX.Element;
        jsxElement.onAttached && jsxElement.onAttached();
    }

    private static detachJsxElement(n: Node) {
        const jsxElement: JSX.Element = n as JSX.Element;
        jsxElement.onDetached && jsxElement.onDetached();
    }
}
