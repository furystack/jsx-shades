import { expect } from "chai";
import { Component, isComponentClass, isComponentInstance } from "../src/Component";

class MockComponent extends Component<undefined> {

}

/**
 * Component Tests
 */
export const componentTests = describe("ComponentTests", () => {
    describe("isComponentClass", () => {
        it("Should return true for component classes", () => {
            expect(isComponentClass(MockComponent)).to.be.eq(true);
        });

        it("Should return false for non-component classes", () => {
            expect(isComponentClass(Number)).to.be.eq(false);
        });
    });

    describe("isComponentInstance", () => {
        it("Should return true for component classes", () => {
            expect(isComponentInstance(new MockComponent(undefined))).to.be.eq(true);
        });

        it("Should return false for non-component classes", () => {
            expect(isComponentInstance(new Date())).to.be.eq(false);
        });
    });

    describe("onPropsChange", () => {
        it("Should be fired when the properties changes", (done: MochaDone) => {

            // tslint:disable-next-line:max-classes-per-file
            class Test2 extends Component<{ prop: any }> {
                public onPropsChanged = () => done();
            }

            const initialProps = { prop: 1 };

            const t2 = new Test2(initialProps);

            expect(t2.props).to.be.eq(initialProps);
            t2.props = { prop: 3 };
        });

    });
});
