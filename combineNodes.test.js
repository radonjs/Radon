const ConstructorNode = require('./constructorNode.js');
const combineNodes = require('./combineNodes.js');

describe('Initialize State', () => {
    const PersonState = new ConstructorNode('AppState', 'ColorState');
    PersonState.initializeState({
        name: ["Michael", "Laythe"],
        age: 19
    })

    const ColorState = new ConstructorNode('ColorState');
    ColorState.initializeState({
        red: ['crimson', 'ruby', 'scarlet', 'cherry'],
        blue: ['sapphire', 'navy', 'sky', 'baby'],
        green: ['chartreuse', 'ivy', 'teal', 'emerald']
    })

    // const HelenState = new ConstructorNode('HelenState', 'ColorState')
    // HelenState.initializeState({
    //     take:{a:{ride:{in:{my:{blimp: 'its a', very:{strong:'blimp'}}}}}}
    // })

    let silo = combineNodes(PersonState, ColorState);

    // console.log(silo['ColorState'].value)

    test('ID\'s should represent the lineage of the node in the silo', () => {
        expect(silo['ColorState'].value['red'].value['red_2'].id).toBe('ColorState.red.red_2')
        expect(silo['ColorState'].value['blue'].value['blue_0'].id).toBe('ColorState.blue.blue_0')
        expect(silo['ColorState'].value['AppState'].value['name'].id).toBe('ColorState.AppState.name')
    })



})



