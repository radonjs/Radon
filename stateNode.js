class State {
  constructor(name) {
    this.name = name;
    this.state = {};
    this.parent = null;

    this.initializeState = this.initializeState.bind(this);
    this.initializeModifiers = this.initializeModifiers.bind(this);
    this.setName = this.setName.bind(this);
    this.getname = this.getName.bind(this);
    this.setParent = this.setParent.bind(this);
    this.getParent = this.getParent.bind(this);
    this.getState = this.getState.bind(this);
  }

  initializeState(initialState) {
    if (typeof this.state !== 'object') throw new Error('input must be an object');
    Object.keys(initialState).forEach(key => {
      this.state[key] = {
        value: initialState[key],
        modifiers: this.state[key] ? this.state[key].modifiers : null // could be undefined
      }
    });
  }

  initializeModifiers(modifiers) {
    if (typeof modifiers !== 'object') throw new Error('input must be an object');
    Object.keys(modifiers).forEach(key => {
      this.state[key] = {
        value: this.state[key] ? this.state[key].value : null, // could be undefined
        modifiers: modifiers[key]
      }
    });
  }

  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setParent(parent) {
    if (parent instanceof State) {
      this.parent = parent;
    } else throw new Error('input must be an instance of class State');
  }

  getParent() {
    return this.parent;
  }

  getState() {
    return this.state;
  }
}

export default State;

// developer side

// import State from _____
// import ParentNode from ____

// const AppState = new State('AppState');
// AppState.setName('AppState') -> optional if not set in constructor
// AppState.setParent('ParentNode');

// AppState.initializeState({
//   name: 'Han',
//   age: 25,
//   cart: []
// })

// AppState.initializeModifiers({
//   name: {
//     updateName: (payload, previous, next) => {
//       next(payload);
//     },
//     resetName: (payload, previous, next) => {
//       next(null);
//     }
//   },
//   age: {
//     incrementAge: (payload, current, next) => {
//       next(current + 1);
//     },
//     decrementAge: (payload, current, next) => {
//       next(current - 1);
//     }
//   },
//   cart: {
//     incrementShirts: (payload, index, current, next) => {
//       next(payload);
//     }
//   }
// });