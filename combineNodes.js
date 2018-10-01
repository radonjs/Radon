// import state class for instanceof check
const ConstructorNode = require('./constructorNode.js');
const SiloNode = require('./siloNode.js');
const types = require('./constants.js');
const VirtualNode = require('./virtualNode.js')




const silo = {};
const virtualSilo = {};

function combineNodes(...args) {
  if (args.length === 0) throw new Error('combineNodes function takes at least one constructorNode');

  // hastable accounts for passing in constructorNodes in any order. 
  // hashtable organizes all nodes into parent-child relationships
  const hashTable = {};
  args.forEach(constructorNode => {
    if (constructorNode.parent === null) {
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
    applyToSilo(node => {
      node.issueID()
    });
  }

  identify();

  function virtualize () { //runs through each node in the tree, turns it into a virtual node in the vSilo
    applyToSilo(node => {
      if(!virtualSilo[node.id]){
        const vNode = new VirtualNode;
        node.virtualNode = vNode;

        //each node is indexed in the virtualSilo at its ID

        virtualSilo[node.id] = vNode;
        
        if(node.type === types.CONTAINER){
          const parentHolder = node.parent;
          node.parent = null;
          vNode.value = node.unsheatheChildren();
          node.parent = parentHolder;
          Object.keys(vNode.value).forEach(key => {
            vNode[key] = vNode.value[key];
          })
          delete vNode.value;
        } else {
          //FIND NEAREST CONTAINER NODE
          let context = node;
          while(context.type !== types.CONTAINER){
            context = context.parent;
          }
          
          vNode.updateTo = (data) => {
            const route = node.id.split(context.name)[1].split('.')
            route.splice(0, 1);
            
            // const route = node.id.split(context.name)[1].join().split('.'); //all the shit after the route to the context 
            let pointer = context.virtualNode;
            let final = route[route.length-1];
            if(final.includes('_')) final = final.split('_')[1]
            route.splice(route.length-1, 1);

            route.forEach(item => {
              if(item.includes('_')){
                pointer = pointer[item.split('_')[1]];
              } else {
                pointer = pointer[item];
              }
            })

            pointer[final] = data;
          };
        }
        
        //each node points to its parent in the virtual silo
        if(node.parent !== null) {
          vNode.parent = virtualSilo[node.parent.id]
        }
      }
    })
  }
  
  virtualize();



  
  silo.virtualSilo = virtualSilo;
  return silo;
}

function applyToSilo(callback) {
  // accessing the single root in the silo
  Object.keys(silo).forEach(siloNodeRootKey => {
    inner(silo[siloNodeRootKey], callback);
  })

  function inner (head, callback) {
    if(head.constructor.name === 'SiloNode'){
      callback(head);
      if (head.type === types.PRIMITIVE) return; // recursive base case
      
      else {
        Object.keys(head.value).forEach(key => {
          if(head.value[key].constructor.name === 'SiloNode'){
            inner(head.value[key], callback);
          }
        })
      }
    }
  }
}



silo.subscribe = (renderFunction, name) => { //renderFunction

  if(!name){
    if(!!renderFunction.prototype){
      name = renderFunction.prototype.constructor.name + 'State';
    } else {
      throw new Error('You can\'t use an anonymous function in subscribe without a name argument.'); //use new
    }
  }

  let foundNode;
  let subscribedAtIndex;

  applyToSilo(node => {
    if(node.name === name){
      subscribedAtIndex = node.pushToSubscribers(renderFunction)
      foundNode = node
    }
  })

  function unsubscribe () {
    foundNode.removeFromSubscribersAtIndex(subscribedAtIndex);
  }

  if(!!foundNode){
    renderFunction(foundNode.getState())
  } else {
    console.error(new Error('You are trying to subscribe to something that isn\'t in the silo.'));
  }

  return unsubscribe;
}

// export default combineNodes;
module.exports = combineNodes;