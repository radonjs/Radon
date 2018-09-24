class ConstructorNode {
  constructor(name, parentName = null) {
    this.name = name; 
    this.state = {};
    this.parent = parentName;
    
    this.initializeState = this.initializeState.bind(this);
    this.initializeModifiers = this.initializeModifiers.bind(this);
  }

  initializeState(initialState) {
    // make sure that the input is an object
    if (typeof this.state !== 'object') throw new Error('Input must be an object');
    // loop through the state variables
    Object.keys(initialState).forEach(newVariableInState => {
      this.state[newVariableInState] = {
        value: initialState[newVariableInState],
        //accounts for itializeModifers being called prior to initializeState. 
        modifiers: this.state[newVariableInState] ? this.state[newVariableInState].modifiers : null
      }
    });
  }

  initializeModifiers(initialModifiers) {
    // make sure that the input is an object
    if (typeof initialModifiers !== 'object') throw new Error('Input must be an object');
    // loop through the state modifiers
    Object.keys(initialModifiers).forEach(newModifiersInState => {
      this.state[newModifiersInState] = {
        //accounts for initializeState being called prior to initializeState. 
        value: this.state[newModifiersInState] ? this.state[newModifiersInState].value : null,
        modifiers: initialModifiers[newModifiersInState]
      }
    });
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set parent(parent) {
    this._parent = parent;
  }

  get parent() {
    return this._parent;
  }

  set state(state) {
    this._state = state;
  }

  get state() {
    return this._state;
  }
}

// export default ConstructorNode;
module.exports = ConstructorNode;

// developer side example

// import State from _____

// const AppState = new ConstructorNode('AppState', 'ParendNode');
// // AppState.name = 'AppState'; -> optional if not set in constructor
// // AppState.parent = 'ParentNode'; -> optional if not set in constructor

// AppState.initializeState({
//   name: 'Han',
//   age: 25,
//   cart: []
// })

// AppState.initializeModifiers({
//   name: {
//     updateName: (current, payload) => {
//       return payload + current;
//     },
//     resetName: (current, payload) => {
//       return null;
//     }
//   },
//   age: {
//     incrementAge: (current, payload) => {
//       return current + 1;
//     },
//     decrementAge: (current, payload) => {
//       return current - 1;
//     }
//   },
//   cart: {
//     incrementShirts: (current, index, payload) => {
//       return ++current;
//     },
//     addItem: (current, payload) => {
//       return current.push(payload);
//     }
//   }
// });