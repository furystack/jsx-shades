import { Component, isComponentClass, isComponentInstance } from '../src/Component'

class MockComponent extends Component<undefined> {}

/**
 * Component Tests
 */
export const componentTests = describe('ComponentTests', () => {
  describe('isComponentClass', () => {
    it('Should return true for component classes', () => {
      expect(isComponentClass(MockComponent)).toBe(true)
    })

    it('Should return false for non-component classes', () => {
      expect(isComponentClass(Number)).toBe(false)
    })
  })

  describe('isComponentInstance', () => {
    it('Should return true for component classes', () => {
      expect(isComponentInstance(new MockComponent(undefined))).toBe(true)
    })

    it('Should return false for non-component classes', () => {
      expect(isComponentInstance(new Date())).toBe(false)
    })
  })

  describe('onPropsChange', () => {
    it('Should be fired when the properties changes', done => {
      class Test2 extends Component<{ prop: any }> {
        public onPropsChanged = () => done()
      }

      const initialProps = { prop: 1 }

      const t2 = new Test2(initialProps)

      expect(t2.props).toBe(initialProps)
      t2.props = { prop: 3 }
    })
  })
})
