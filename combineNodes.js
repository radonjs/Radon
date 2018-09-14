// import state class for instanceof check
const StateNode = require('./stateNode.js');

// ==================> FOR TESTING ONLY <=================== \\

// const AppState = new StateNode('AppState');
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

// const NavState = new StateNode('NavState');
// NavState.setParent('AppState');

// NavState.initializeState({
//   nav: 'Nav'
// })

// NavState.initializeModifiers({
//   nav: {
//     incrementAge: (payload, current, next) => {
//       next(current + 1);
//     }
//   }
// });

// const ButtState = new StateNode('ButtState');
// ButtState.setParent('NavState');

// ButtState.initializeState({
//   butt: 'Butt'
// })

// ButtState.initializeModifiers({
//   butt: {
//     incrementAge: (payload, current, next) => {
//       next(current + 1);
//     }
//   }
// });

//==================> TESTING CONTENT ENDED <===================\\

class siloNode {
  constructor(val, parent = null, modifiers = {}) {
    this.value = val;
    this.modifiers = modifiers;
    this.subscribers = [];
    this.parent = parent; // silo node
  }
}

// PROB: wanting a stateless root??

const silo = {};

// combineNodes takes all of the stateNodes created by the developer. It then creates siloNodes from the
// stateNodes and organizes them into a single nested object, the silo

combineNodes = (...args) => {
  // you called this function without passing stuff? Weird
  if (args.length === 0) return;

  // maps the state nodes into a hashtable
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

  // now we can more easily build the silo object
  if (!hashTable.root) {
    //problem we must address... 
    throw new Error('at least one state node must have a null parent');
  }

  // recursively map to the silo
  function mapToSilo(node = 'root', parent) {

    // determine if node variable is a string or siloNode
    let nodeName;
    if (node === 'root') nodeName = node;
    else nodeName = node.getName();

    // if a piece of state has no children: recursive base case
    if (!hashTable[nodeName]) return;

    const allChildren = {};

    // inspect all children of the current state node
    hashTable[nodeName].forEach(child => {

      const nodeVal = {};
      allChildren[child.getName()] = new siloNode(nodeVal, node === 'root' ? null : parent);
      const thisStateNode = child;
      const thisSiloNode = allChildren[child.getName()];
      const stateObj = child.getState();

      // create siloNodes for all the variables in the child state node
      Object.keys(stateObj).forEach(varName => {
        nodeVal[varName] = new siloNode(stateObj[varName].value, thisSiloNode, stateObj[varName].modifiers);
      })

      // recurse for grandbabiessss
      const babies = mapToSilo(thisStateNode, thisSiloNode);
      if (babies) {
        Object.keys(babies).forEach(baby => {
          nodeVal[baby] = babies[baby];
        })
      }
    })
    return allChildren;
  }

  // initiate recurse function
  const temp = mapToSilo();

  // will always only be a single key (the root) that is added into the silo
  Object.keys(temp).forEach(key => {
    silo[key] = temp[key];
  });
}

// combineNodes(ButtState, NavState, AppState); // testing purposes
// console.log(silo.AppState);

module.exports = {
  silo,
  combineNodes
}