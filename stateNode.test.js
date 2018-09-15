let StateNode = require('./stateNode.js');

describe('State Node Class', () => {
    let testNode = new StateNode('test');
    test('State Node should construct State Node Objects', () => {
        
        expect(testNode instanceof StateNode).toBeTruthy();
    })

    describe('State nodes Methods', () => {
        test('initializeState should put state in state nodes', () => {
            const testObject = {
                rising: 'up, back to the streets',
                took: 'my time, took my chances',
                went: 'the distance, now Im back on my feet',
                just: 'a man and his will to survive',
                itsthe: ''
            }
            
            testNode.initializeState(testObject);

            expect(testNode.state['rising'].value).toBe('up, back to the streets')
            expect(testNode.state['took'].value).not.toBe('up, back to the streets')
            expect(testNode.state['went'].value).toBe('the distance, now Im back on my feet')
            expect(testNode.state['just'].value).toBe('a man and his will to survive')
        })
        
        test('initializeModifiers should put modifiers into state nodes', () => {

            /**/
            const testModifiers = {
                itsthe: {
                    append: (payload, previous, updateTo) => {
                        updateTo(previous + payload);
                    }
                }
            }

            testNode.initializeModifiers(testModifiers);

            expect(testNode.state['itsthe'].modifiers.append).toEqual(testModifiers.itsthe.append);

            
        })
        
        test('Modifiers modify state', () => {

            testNode.state['itsthe'].modifiers.append('eye of the tiger, its the thrill of the fight');

            expect(testnode.state.itsthe.value).toBe('eye of the tiger, its the thrill of the fight');
        
        })

        
    })
})