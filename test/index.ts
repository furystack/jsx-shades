/** Main entry point for tests */

// tslint:disable

declare var global: any;

global.HTMLElement = class {

}

global.MutationObserver = class implements MutationObserver {
    disconnect(): void {
    }

    observe(target: Node, options: MutationObserverInit): void {
    }
    takeRecords(): MutationRecord[] {
        throw new Error("Method not implemented.");
    }
}

global.customElements = new class implements CustomElementRegistry {
    private store = new Map<string, any>()
    define(name: string, constructor: Function, options?: ElementDefinitionOptions): void {
        this.store.set(name, constructor);
    }
    get(name: string) {
        return this.store.get(name)
    }
    whenDefined(name: string): PromiseLike<void> {
        throw new Error("Method not implemented.");
    }
}
// tslint:enable

export * from "./ComponentTests";
export * from "./ComponentFactoryTests";
