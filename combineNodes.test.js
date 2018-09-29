const ConstructorNode = require('./constructorNode.js');
const combineNodes = require('./combineNodes.js');

describe('Initialize State', () => {
    const PersonState = new ConstructorNode('PersonState', 'ColorState');
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

    const haveBirthday = jest.fn((payload, previous) => {
        return previous + 1;
    })

    PersonState.initializeModifiers({
        age: {
            haveBirthday: haveBirthday
        }
    })

    // const BlimpState = new ConstructorNode('HelenState', 'ColorState')
    // BlimpState.initializeState({
    //     take:{a:{ride:{in:{my:{blimp: 'its a', very:{strong:'blimp'}}}}}}
    // })

    let silo = combineNodes(PersonState, ColorState,/*BlimpState*/);

    let vSilo = silo.virtualSilo;

    test('ID\'s should represent the lineage of the node in the silo', () => {
        expect(silo['ColorState'].value['red'].value['red_2'].id).toBe('ColorState.red.red_2')
        expect(silo['ColorState'].value['blue'].value['blue_0'].id).toBe('ColorState.blue.blue_0')
        expect(silo['ColorState'].value['PersonState'].value['name'].id).toBe('ColorState.PersonState.name')
    })

    test('Modifiers on silo nodes should be exposed in their virtual silo counterparts', () => {
        const temp = vSilo['ColorState.PersonState.age']

        expect(temp.haveBirthday).toEqual(silo['ColorState'].value['PersonState'].value['age'].modifiers.haveBirthday);
        vSilo['ColorState.PersonState.age'].haveBirthday();

        expect(haveBirthday).toHaveBeenCalled();
    })

    test('Silo Nodes should point to their Virtual Silo Node Counterparts', () => {
        const temp = vSilo['ColorState.PersonState.age'];

        expect(temp).toEqual(silo['ColorState'].value['PersonState'].value['age'].virtualNode);
    })

    console.log(silo['ColorState'].getState())





})



