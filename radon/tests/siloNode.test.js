import SiloNode from '../siloNode.js';
import ConstructorNode from '../constructorNode.js';
import combineNodes from '../combineNodes.js';

describe('SiloNode', () => {
  let AppState, NavState, silo;
  const cart = {one: 1, array: [1,2,3, {test: 'test'}]};
  const mockAddItem = jest.fn((current, payload) => {
    Object.keys(payload).forEach(key => {
      current[key] = payload[key];
    })
    return current;
  })

  beforeEach(() => {
    AppState = new ConstructorNode('AppState');
    AppState.initializeState({
      name: 'App',
      age: 25
    })
    AppState.initializeModifiers({
      age: {
        incrementAge: jest.fn((current, payload) => {
          return current + payload;
        })
      }
    });

    NavState = new ConstructorNode('NavState', 'AppState');
    NavState.initializeState({
      name: 'Nav',
      cart: JSON.parse(JSON.stringify(cart))
    })
    NavState.initializeModifiers({
      cart: {
        updateCartItem: jest.fn((current, index, payload) => {
          return ++current;
        }),
        addItem: mockAddItem
      }
    });

    silo = combineNodes(AppState, NavState);
  })

  describe('Constructor makes correct initializations', () => {
    it('expects name to be a string', () => {
      expect(new SiloNode('AppState', 5)).toBeTruthy();
      expect(() => new SiloNode(7, 5)).toThrowError('Name is required and should be a string');
      expect(() => new SiloNode()).toThrowError('Name is required and should be a string');
    })
    it('expects parent to be a siloNode or null', () => {
      expect(new SiloNode('AppState', 5)).toBeTruthy();
      expect(new SiloNode('AppState', 5, new SiloNode('Test', 5))).toBeTruthy();
      expect(() => new SiloNode('AppState', 5, 'Parent')).toThrowError('Parent must be null or a siloNode');
    })
    it('expects modifiers to be an object', () => {
      expect(new SiloNode('AppState', 5, null, {})).toBeTruthy();
      expect(new SiloNode('AppState', 5, null)).toBeTruthy();
      expect(() => new SiloNode('AppState', 5, null, 0)).toThrowError('Modifiers must be a plain object');
    })
    it('expects type to be a string', () => {
      expect(new SiloNode('AppState', 5, null, {})).toBeTruthy();
      expect(() => new SiloNode('AppState', 5, null, {}, 'hey')).toThrowError('Type must be an available constant');
      expect(() => new SiloNode('AppState', 5, null, {}, 0)).toThrowError('Type must be an available constant');
    })
    it('Type should match value', () => {
      expect(silo.AppState.type).toBe('CONTAINER');
      expect(silo.AppState.value.name.type).toBe('PRIMITIVE');
      expect(silo.AppState.value.NavState.type).toBe('CONTAINER');
      expect(silo.AppState.value.NavState.value.cart.type).toBe('OBJECT');
      expect(silo.AppState.value.NavState.value.cart.value.cart_array.type).toBe('ARRAY');
    })
  })

  describe('Objects should reconstruct', () => {
    it('Returns a correctly assembled object', () => {
      expect(typeof silo.AppState.value.NavState.getState()).toBe('object');
      expect(silo.AppState.value.NavState.getState().cart).toEqual(cart);
    })
    it('Returns a correctly assembled object into modifiers', () => {
      cart.puppy = 'puppy';
      silo.AppState.value.NavState.getState().addItem({puppy: 'puppy'});
      expect(mockAddItem.mock.calls[0][0]).toEqual(cart);
      expect(mockAddItem.mock.calls.length).toBe(1);
    })
  })
})