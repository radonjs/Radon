//========> FOR TESTING ONLY <=========\\
// class State {
//   constructor(name) {
//     this.name = name;
//     this.state = {};
//     this.parent = null;

//     this.initializeState = this.initializeState.bind(this);
//     this.initializeModifiers = this.initializeModifiers.bind(this);
//     this.setName = this.setName.bind(this);
//     this.getname = this.getName.bind(this);
//     this.setParent = this.setParent.bind(this);
//     this.getParent = this.getParent.bind(this);
//     this.getState = this.getState.bind(this);
//   }

//   initializeState(initialState) {
//     if (typeof this.state !== 'object') throw new Error('input must be an object');
//     Object.keys(initialState).forEach(key => {
//       this.state[key] = {
//         value: initialState[key],
//         modifiers: this.state[key] ? this.state[key].modifiers : null // could be undefined
//       }
//     });
//   }

//   initializeModifiers(modifiers) {
//     if (typeof modifiers !== 'object') throw new Error('input must be an object');
//     Object.keys(modifiers).forEach(key => {
//       this.state[key] = {
//         value: this.state[key] ? this.state[key].value : null, // could be undefined
//         modifiers: modifiers[key]
//       }
//     });
//   }

//   setName(name) {
//     this.name = name;
//   }

//   getName() {
//     return this.name;
//   }

//   setParent(parent) {
//     this.parent = parent;
//   }

//   getParent() {
//     return this.parent;
//   }

//   getState() {
//     return this.state;
//   }
// }

// // export default State;

// // developer side ============

// const AppState = new State('AppState');
// // AppState.setName('AppState') -> optional if not set in constructor
// // AppState.setParent(null);

// AppState.initializeState({
//   name: 'Han',
//   age: 25,
//   cart: []
// })

// AppState.initializeModifiers({
//   age: {
//     incrementAge: (payload, current, next) => {
//       next(current + 1);
//     }
//   }
// });

// const NavState = new State('NavState');
// NavState.setParent('AppState');

// NavState.initializeState({
//   name: 'Han',
//   age: 25,
//   cart: []
// })

// NavState.initializeModifiers({
//   age: {
//     incrementAge: (payload, current, next) => {
//       next(current + 1);
//     }
//   }
// });

// const ButtState = new State('ButtState');
// ButtState.setParent('NavState');

// ButtState.initializeState({
//   name: 'Han',
//   age: 25,
//   cart: []
// })

// ButtState.initializeModifiers({
//   age: {
//     incrementAge: (payload, current, next) => {
//       next(current + 1);
//     }
//   }
// });

//========> TESTING CONTENT ENDED <=========\\







// my actual shit is below, will delete everything above this point ^
// PROB: wanting a stateless root??

// import state class!!! for instanceof check

const silo = {};

/*export*/ combineNodes = (...args) => {
  // you called this function without passing stuff? Weird
  if (args.length === 0) return;

  // maps the state nodes into hashtable
  const hashTable = {};
  args.forEach(node => {
    // all nodes must be an instance of state node (must import state class)
    if (!(node instanceof State)) throw new Error('only state objects can be passed into combineNodes');

    if (node.getParent() === null) {
      // only one node can be the root
      if (!hashTable.root) hashTable.root = [node];
      else throw new Error('only one state node can have null parent');
    } else {
      if (!hashTable[node.getParent()]) hashTable[node.getParent()] = [node];
      else hashTable[node.getParent()].push(node);
    }
  }) 

  // build silo object
  if (!hashTable.root) {
    //problem we must address... 
    throw new Error('at least one state node must have a null parent');
  }

  // recursively map to the silo
  function mapToSilo(state) {
    // if a piece of state has no children: base case
    if (!hashTable[state]) return;

    const allChildren = {};
    
    // inspect all children of the current state node
    hashTable[state].forEach(child => {

      // add child to the return object
      allChildren[child.getName()] = {
        value: child.getState(),
        methods: {}
      }

      //recurse to look for grandchildren
      const grandChild = mapToSilo(child.getName());
      if (grandChild) {
        Object.keys(grandChild).forEach(key => {
          allChildren[child.getName()].value[key] = grandChild[key];
        })
      }

    })
    return allChildren;
  }

  const temp = mapToSilo('root');
  // should only be a single key
  Object.keys(temp).forEach(key => {
    silo[key] = temp[key];
  });
}

// combineNodes(ButtState, NavState, AppState); //testing purposes

// export store;