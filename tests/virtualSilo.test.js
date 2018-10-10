import ConstructorNode from '../radon/constructorNode';
import combineNodes from '../radon/combineNodes';

describe('Initialize State', () => {
  const PersonState = new ConstructorNode('PersonState', 'ColorState');
  PersonState.initializeState({
    name: ["Michael", "Laythe"],
    age: {19: 19}
  })

  const ColorState = new ConstructorNode('ColorState');
  ColorState.initializeState({
    red: ['crimson', 'ruby', 'scarlet', 'cherry'],
    blue: ['sapphire', 'navy', 'sky', 'baby'],
    green: ['chartreuse', 'ivy', 'teal', 'emerald']
  })

  ColorState.initializeModifiers({
    blue: {
      test: (payload, previous) => {
        console.log('running');
      }
    }
  });

  PersonState.initializeModifiers({
    age: {
      haveBirthday: (payload, previous) => {
        return previous + 1;
      }
    }
  })

  let silo = combineNodes(PersonState, ColorState/*BlimpState*/);

  test('ID\'s should represent the lineage of the node in the silo', () => {
    expect(silo['ColorState'].value['red'].value['red_2'].id).toBe('ColorState.red.red_2')
    expect(silo['ColorState'].value['blue'].value['blue_0'].id).toBe('ColorState.blue.blue_0')
    expect(silo['ColorState'].value['PersonState'].value['name'].id).toBe('ColorState.PersonState.name')
  })
})



