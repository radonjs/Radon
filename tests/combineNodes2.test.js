import combineNodes from '../radon/combineNodes';
import ConstructorNode from '../radon/constructorNode';

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

    const haveBirthday = jest.fn((previous, payload) => {
        console.log('some stuff', previous + 1);
        return previous + 1;
    })

    PersonState.initializeModifiers({
        age: {
            haveBirthday: haveBirthday
        }
    })

    // const BlimpState = new ConstructorNode('BlimpState', 'ColorState')
    // BlimpState.initializeState({
    //     take:{a:{ride:{in:{my:{blimp: 'its a', very:{strong:'blimp'}}}}}}
    // })

    let silo = combineNodes(PersonState, ColorState);

    let vSilo = silo.virtualSilo;

    test('ID\'s should represent the lineage of the node in the silo', () => {
        expect(silo['ColorState'].value['red'].value['red_2'].id).toBe('ColorState.red.red_2')
        expect(silo['ColorState'].value['blue'].value['blue_0'].id).toBe('ColorState.blue.blue_0')
        expect(silo['ColorState'].value['PersonState'].value['name'].id).toBe('ColorState.PersonState.name')
    })

    test('Modifiers on silo nodes should be exposed in their virtual silo counterparts', () => {
        const temp = vSilo['ColorState.PersonState']

        expect(temp.haveBirthday).toEqual(silo['ColorState'].value['PersonState'].value['age'].modifiers.haveBirthday);
        vSilo['ColorState.PersonState'].haveBirthday();
        
        expect(haveBirthday).toHaveBeenCalled();
    })
    
    test('Silo Nodes should have an update function which changes the data in their container node', () => {
        const temp = vSilo['ColorState.PersonState.name.name_0'];
        temp.updateTo('Mike');

        expect(vSilo['ColorState.PersonState']['name'][0]).toEqual('Mike');
    })


    test('Silo Node modifiers should update their virtual silo counterparts', () => {
        const temp = vSilo['ColorState.PersonState'];

        const valueBefore = temp['age'];

        temp.haveBirthday();

        const valueAfter = temp['age'];


        expect(valueAfter).toBe(valueBefore+1)
    })
})



