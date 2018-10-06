// import state class for instanceof check
import ConstructorNode from './constructorNode.js';
import SiloNode from './siloNode.js';
import * as types from './constants.js'
import virtualNode from './virtualNode.js'

const silo = {};
const virtualSilo = {};

/**
 * Takes all of the constructorNodes created by the developer
 * @param  {...ConstructorNode} args - A list of constructor Nodes
 */

function combineNodes(...args) {
  if (args.length === 0) throw new Error('combineNodes function takes at least one constructorNode');

  // hastable accounts for passing in constructorNodes in any order. 
  // hashtable organizes all nodes into parent-child relationships
  const hashTable = {};
  args.forEach(constructorNode => {
    if (!constructorNode || constructorNode.constructor.name !== 'ConstructorNode') throw new Error('Only constructorNodes can be passed to combineNodes');
    else if (constructorNode.parent === null) {
      // this is the root node, only one constructorNode can have a parent of null
      if (!hashTable.root) hashTable.root = [constructorNode];
      else throw new Error('Only one constructor node can have null parent');
    } else {
      if (!hashTable[constructorNode.parent]) hashTable[constructorNode.parent] = [constructorNode];
      // if parent already exists, and node being added will append to the array of children
      else hashTable[constructorNode.parent].push(constructorNode);
    }
  }) 

  // ensure there is a defined root
  if (!hashTable.root) throw new Error('At least one constructor node must have a null parent');

  // recursive function that will create siloNodes and return them to a parent
  function mapToSilo(constructorNode = 'root', parentConstructorNode = null) {
    const constructorNodeName = (constructorNode === 'root') ? 'root' : constructorNode.name;

    // recursive base case, we only continue if the constructorNode has constructorNode children
    if (!hashTable[constructorNodeName]) return;

    const children = {};

    // loop through the children of constructorNode
    hashTable[constructorNodeName].forEach(currConstructorNode => {
      const valuesOfCurrSiloNode = {};
      children[currConstructorNode.name] = new SiloNode(currConstructorNode.name, valuesOfCurrSiloNode, parentConstructorNode, {}, types.CONTAINER);
      
      // abstract some variables
      const currSiloNode = children[currConstructorNode.name];
      const stateOfCurrConstructorNode = currConstructorNode.state;

      // create SiloNodes for all the variables in the currConstructorNode
      Object.keys(stateOfCurrConstructorNode).forEach(varInConstructorNodeState => {
        // creates siloNodes for object variables
        if (typeof stateOfCurrConstructorNode[varInConstructorNodeState].value === 'object') {
          valuesOfCurrSiloNode[varInConstructorNodeState] = currSiloNode.deconstructObjectIntoSiloNodes(varInConstructorNodeState, stateOfCurrConstructorNode[varInConstructorNodeState], currSiloNode, true);
        }
        // creates siloNodes for primitive variables
        else {
          valuesOfCurrSiloNode[varInConstructorNodeState] = new SiloNode(varInConstructorNodeState, stateOfCurrConstructorNode[varInConstructorNodeState].value, currSiloNode, stateOfCurrConstructorNode[varInConstructorNodeState].modifiers);
          valuesOfCurrSiloNode[varInConstructorNodeState].linkModifiers();
        }
      })

      // recursively check to see if the current constructorNode/siloNode has any children 
      const siloNodeChildren = mapToSilo(currConstructorNode, currSiloNode);
      if (siloNodeChildren) { 
        Object.keys(siloNodeChildren).forEach(siloNode => {
          valuesOfCurrSiloNode[siloNode] = siloNodeChildren[siloNode];
        })
      }
    })
    return children;
  }

  // rootState
  const wrappedRootSiloNode = mapToSilo();

  
  // will always only be a single key (the root) that is added into the silo
  Object.keys(wrappedRootSiloNode).forEach(rootSiloNode => {
    silo[rootSiloNode] = wrappedRootSiloNode[rootSiloNode];
  });
  
  function identify () {
    //each node's ID is a snake_case string that represents a 
    //route to that node from the top of the silo by name
    forEachSiloNode(node => {
      node.issueID()
    });
  }

  identify();

  function virtualize () { //runs through each node in the tree, turns it into a virtual node in the vSilo
    forEachSiloNode(node => {
      if(!virtualSilo[node.id]){
        virtualSilo[node.id] = node.virtualNode;
      }
    })
  }

    virtualize();
      
    
    forEachSiloNode(node => {
      // apply keySubscribe only to object and array silo nodes
      if (node.type === 'OBJECT' || node.type === "ARRAY") {
        node.modifiers.keySubscribe = (key, renderFunc) => {
          const name = node.name + "_" + key;
          const subscribedAtIndex = node.value[name].pushToSubscribers(renderFunc);
          node.value[name].notifySubscribers();
          return () => {node.removeFromSubscribersAtIndex(subscribedAtIndex)}
        }
      }})
    
    

  
  silo.virtualSilo = virtualSilo;
  return silo;
}

/**
 * Applies the callback to every siloNode in the silo
 * @param {function} callback - A function that accepts a siloNode as its parameter
 */

// callbacks have to accept a SILONODE
function forEachSiloNode(callback) {
  // accessing the single root in the silo
  Object.keys(silo).forEach(siloNodeRootKey => {
    inner(silo[siloNodeRootKey], callback);
  })

  // recursively navigate to every siloNode
  function inner(head, callback) {
    if (head.constructor.name === 'SiloNode') {
      callback(head);
      if (head.type === types.PRIMITIVE) return; // recursive base case
      
      else {
        Object.keys(head.value).forEach(key => {
          if (head.value[key].constructor.name === 'SiloNode') {
            inner(head.value[key], callback);
          }
        })
      }
    }
  }
}

/**
 * Subscribes components to siloNodes in the silo
 * @param  {function} renderFunction - Function to be appended to subscribers array
 * @param {string} name - Name of the relevant component with 'State' appended
 */

silo.subscribe = (renderFunction, name) => {
  if (!name) {
    if (!!renderFunction.prototype) {
      name = renderFunction.prototype.constructor.name + 'State';
    } else {
      throw new Error('You can\'t use an anonymous function in subscribe without a name argument.');
    }
  }

  let foundNode;
  let subscribedAtIndex;
  const foundNodeChildren = [];

  forEachSiloNode(node => {
    if(node.name === name){
      subscribedAtIndex = node.pushToSubscribers(renderFunction)
      foundNode = node
      foundNodeChildren.push({node: foundNode, index: subscribedAtIndex});
    }
  })

  function unsubscribe() {
    let ob;
    Object.keys(foundNodeChildren).forEach(key => {
      ob = foundNodeChildren[key]; 
      ob.node.removeFromSubscribersAtIndex(ob.index)
    })
  }
  
  if (!!foundNode) {
    
    if (foundNode.value) {
      Object.keys(foundNode.value).forEach(key => {
        let node = foundNode.value[key];
        if(node.type !== 'CONTAINER'){
          subscribedAtIndex = node.pushToSubscribers(renderFunction);
          foundNodeChildren.push({node: node, index: subscribedAtIndex});
  
        }
      })
    }
    foundNode.notifySubscribers();
  } else {
    console.error(new Error('You are trying to subscribe to something that isn\'t in the silo.'));
  }

  return unsubscribe;
}

export default combineNodes;