let ConstructorNode = require('./constructorNode.js');

describe('Constructor Node Class', () => {
  let testNode;
  let testObject;
  let testModifiers;
  let stateObj;

  beforeAll(() => {
    testNode = new ConstructorNode('test');
    testObject = {
      rising: 'up, back to the streets',
      took: 'my time, took my chances',
      went: 'the distance, now Im back on my feet',
      just: 'a man and his will to survive',
      itsthe: ''
    }
    testModifiers = {
      itsthe: {
        appendLyrics: (current, payload) => {
          return current += payload;
        }
      }
    }
  })

  it('Constructor Node should construct Constructor Node Objects', () => {
    expect(testNode instanceof ConstructorNode).toBeTruthy();
  })

  describe('Adding Variables Before Modifiers', () => {
    it('initializeState should put state in Constructor Nodes', () => {
      testNode.initializeState(testObject);
      expect(testNode.state['rising'].value).toBe('up, back to the streets')
      expect(testNode.state['took'].value).not.toBe('up, back to the streets')
      expect(testNode.state['went'].value).toBe('the distance, now Im back on my feet')
      expect(testNode.state['just'].value).toBe('a man and his will to survive')
    })
    
    it('initializeModifiers should put modifiers into Constructor Nodes', () => {
      testNode.initializeModifiers(testModifiers);
      expect(testNode.state['itsthe'].modifiers.append).toEqual(testModifiers.itsthe.append);
      stateObj = testNode.state;
    })
  })

  describe('Adding Modifiers Before Variables', () => {
    testNode = new ConstructorNode('test');

    it('initializeModifiers should put modifiers into Constructor Nodes', () => {
      testNode.initializeModifiers(testModifiers);
      expect(testNode.state['itsthe'].modifiers.appendLyrics).toEqual(testModifiers.itsthe.appendLyrics);
    })

    it('initializeState should put state in Constructor Nodes', () => {
      testNode.initializeState(testObject);
      expect(testNode.state['rising'].value).toBe('up, back to the streets')
      expect(testNode.state['took'].value).not.toBe('up, back to the streets')
      expect(testNode.state['went'].value).toBe('the distance, now Im back on my feet')
      expect(testNode.state['just'].value).toBe('a man and his will to survive')
    })

    it('State from adding mods first vs vars first should be identical', () => {
      expect(JSON.stringify(testNode.state)).toBe(JSON.stringify(stateObj));
    })
  })
})