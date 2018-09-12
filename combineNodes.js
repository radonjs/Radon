// import state class for instanceof check
const StateNode = require('./stateNode.js');

// ==================> FOR TESTING ONLY <=================== \\

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

//==================> TESTING CONTENT ENDED <===================\\


// PROB: wanting a stateless root??

const silo = {};

combineNodes = (...args) => {
  // you called this function without passing stuff? Weird
  if (args.length === 0) return;

  // maps the state nodes into hashtable
  const hashTable = {};
  args.forEach(node => {
    // all nodes must be an instance of state node (must import state class)
    if (!(node instanceof StateNode)) throw new Error('only state objects can be passed into combineNodes');

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

// combineNodes(ButtState, NavState, AppState); // testing purposes

module.exports = {
  silo,
  combineNodes
}