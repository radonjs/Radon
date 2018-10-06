import * as types from './constants.js';
import VirtualNode from './virtualNode.js'


class SiloNode {
  constructor(name, value, parent = null, modifiers = {}, type = types.PRIMITIVE) {
    this.name = name;
    this.value = value;
    this.modifiers = modifiers;
    this.queue = [];
    this.subscribers = [];
    this.parent = parent; // circular silo node
    this.type = type;
    // bind
    this.linkModifiers = this.linkModifiers.bind(this);
    this.runModifiers = this.runModifiers.bind(this);
    this.notifySubscribers = this.notifySubscribers.bind(this); 
    this.getState = this.getState.bind(this);
    this.reconstructArray = this.reconstructArray.bind(this);
    this.reconstructObject = this.reconstructObject.bind(this);
    this.deconstructObjectIntoSiloNodes = this.deconstructObjectIntoSiloNodes.bind(this);
    this.reconstruct = this.reconstruct.bind(this);
    this.pushToSubscribers = this.pushToSubscribers.bind(this);
    this.removeFromSubscribersAtIndex = this.removeFromSubscribersAtIndex(this);
    
    // invoke functions
    this.runQueue = this.runModifiers();
    
    if(this.type === 'ARRAY' || this.type === 'OBJECT'){
      this.modifiers.keySubscribe = (key, renderFunction) => {
        const name = this.name + '_' + key;
        console.log('Subscribed to', this.name);
        const subscribedAtIndex = this.value[name].pushToSubscribers(renderFunction);
        this.value[name].notifySubscribers();
        return () => {node.removeFromSubscribersAtIndex(subscribedAtIndex)}
      }
    }
    
    this.id;
    this.issueID();
    this.virtualNode = new VirtualNode(this, this.modifiers);
    console.log('creating new vnode in the constructor of node: ', this.virtualNode.name)
  }

  get name() {
    return this._name;
  }

  set name(name) {
    if (!name || typeof name !== 'string') throw new Error('Name is required and should be a string')
    this._name = name;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get modifiers() {
    return this._modifiers;
  }

  set modifiers(modifiers) {
    if (typeof modifiers !== 'object' || Array.isArray(modifiers)) throw new Error('Modifiers must be a plain object');
    this._modifiers = modifiers;
  }

  get queue() {
    return this._queue;
  }

  set queue(queue) {
    this._queue = queue;
  }

  get parent() {
    return this._parent;
  }

  set parent(parent) {
    if (parent && parent.constructor.name !== 'SiloNode') throw new Error('Parent must be null or a siloNode');
    this._parent = parent;
  }

  get subscribers() {
    return this._subscribers;
  }

  set subscribers(subscribers) {
    this._subscribers = subscribers;
  }

  get type() {
    return this._type;
  }

  set type(type) {
    if (typeof type !== 'string' || !types[type]) throw new Error('Type must be an available constant');
    this._type = type;
  }

  get virtualNode(){
    return this._virtualNode
  }

  set virtualNode(virtualNode){
    this._virtualNode = virtualNode;
  }

  get id(){
    return this._id;
  }

 

  pushToSubscribers(renderFunction){
    this.subscribers.push(renderFunction);
  }

  removeFromSubscribersAtIndex(index){
    this.subcribers = this.subscribers.slice(index, 1);
  }

  //there's no setter for the ID because you cant set it directly. you have to use issueID

  //issueID MUST BE CALLED ON THE NODES IN ORDER ROOT TO LEAF. it always assumes that this node's parent will
  //have had issueID called on it before. use applyToSilo to make sure it runs in the right order
  issueID(){
    if(this.parent === null){ //its the root node
      this._id = this.name;
    } else {                  //its not the root node
      this._id = this.parent.id + '.' + this.name;
    }
  }

  notifySubscribers() {
    if (this.subscribers.length === 0) return;
    this.subscribers.forEach(func => {
      if (typeof func !== 'function') throw new Error('Subscriber array must only contain functions');
      func(this.getState());
    })
  }

  /**
   * Invoked once in the siloNode constructor to create a closure. The closure variable 
   * 'running' prevents the returned async function from being invoked if it's
   * still running from a previous call
   */
  runModifiers() {
    let running = false; // prevents multiple calls from being made if already running

    async function run() {
      if (running === false) { // prevents multiple calls from being made if already running
        running = true;
        while (this.queue.length > 0) {
          this.value = await this.queue.shift()();
          this.virtualNode.updateTo(this.value);
          if (this.type !== types.PRIMITIVE) this.value = this.deconstructObjectIntoSiloNodes().value;
          
          this.notifySubscribers();
        }
        running = false;   
      } else {
        return 'in progress...';
      }
    }
    return run;
  }

  /**
   * Deconstructs objects into a parent siloNode with a type of object/array, and
   * children siloNodes with values pertaining to the contents of the object
   * @param {string} objName - The intended key of the object when stored in the silo
   * @param {object} objectToDeconstruct - Any object that must contain a key of value
   * @param {SiloNode} parent - Intended SiloNode parent to the deconstructed object
   * @param {boolean} runLinkedMods - True only when being called for a constructorNode
   */
  deconstructObjectIntoSiloNodes(objName = this.name, objectToDeconstruct = this, parent = this.parent, runLinkedMods = false) {
    const objChildren = {};
    let type, keys;
  
    // determine if array or other object
    if (Array.isArray(objectToDeconstruct.value)) {
      keys = objectToDeconstruct.value;
      type = types.ARRAY;
    } else {
      keys = Object.keys(objectToDeconstruct.value);
      type = types.OBJECT;
    }
  
    const newSiloNode = new SiloNode(objName, objChildren, parent, objectToDeconstruct.modifiers, type);
    
    if (Array.isArray(objectToDeconstruct.value) && objectToDeconstruct.value.length > 0) {
      // loop through the array
      objectToDeconstruct.value.forEach((indexedVal, i) => {
        // recurse if the array has objects stored in its indices
        if (typeof indexedVal === 'object') objChildren[`${objName}_${i}`] = this.deconstructObjectIntoSiloNodes(`${objName}_${i}`, {value: indexedVal}, newSiloNode, runLinkedMods);
        else objChildren[`${objName}_${i}`] = new SiloNode(`${objName}_${i}`, indexedVal, newSiloNode);
      })
    } 
    
    else if (keys.length > 0) {
      // loop through object
      keys.forEach(key => {
        // recurse if the object has objects stored in its values
        if (typeof objectToDeconstruct.value[key] === 'object') objChildren[`${objName}_${key}`] = this.deconstructObjectIntoSiloNodes(`${objName}_${key}`, {value: objectToDeconstruct.value[key]}, newSiloNode, runLinkedMods);
        else objChildren[`${objName}_${key}`] = new SiloNode(`${objName}_${key}`, objectToDeconstruct.value[key], newSiloNode);
      })
    }

    if (runLinkedMods) newSiloNode.linkModifiers();

    return newSiloNode;
  }

  /**
   * Wraps developer written modifiers in async functions with state passed in automatically
   * @param {string} nodeName - The name of the siloNode
   * @param {object} stateModifiers - An object containing unwrapped modifiers most likely from the constructorNode
   */
  linkModifiers(nodeName = this.name, stateModifiers = this.modifiers) {
    if (!stateModifiers || Object.keys(stateModifiers).length === 0) return;
    const that = this;
    // looping through every modifier added by the dev
    Object.keys(stateModifiers).forEach(modifierKey => {
      const modifier = stateModifiers[modifierKey];

      if (typeof modifier !== 'function' ) throw new TypeError(); 

      // adds middleware that will affect the value of this node
      else if (modifier.length <= 2) {
        // wrap the dev's modifier function so we can pass the current node value into it
        let linkedModifier;
        if (that.type === types.PRIMITIVE) linkedModifier = async (payload) => await modifier(that.value, payload);
        // that.value is an object and we need to reassemble it
        else if (that.type === types.OBJECT || that.type === types.ARRAY) {
          linkedModifier = async (payload) => await modifier(this.reconstruct(nodeName, that), payload);
        }
        
        // the function that will be called when the dev tries to call their modifier
        this.modifiers[modifierKey] = payload => {
          // wrap the linkedModifier again so that it can be added to the async queue without being invoked
          const callback = async () => await linkedModifier(payload);
          that.queue.push(callback);
          that.runQueue();
        }
      }

      // adds middleware that will affect the value of a child node of index
      else if (modifier.length > 2) {
        // wrap the dev's modifier function so we can pass the current node value into it
        const linkedModifier = async (index, payload) => await modifier(this.reconstruct(index, that.value[index]), index, payload); 

        // the function that will be called when the dev tries to call their modifier
        this.modifiers[modifierKey] = (index, payload) => {
          // wrap the linkedModifier again so that it can be added to the async queue without being invoked
          const callback = async () => await linkedModifier(`${this.name}_${index}`, payload);
          that.value[`${this.name}_${index}`].queue.push(callback);
          that.value[`${this.name}_${index}`].runQueue();
        }
      }
    })
    
    Object.keys(this.modifiers).forEach( modifierKey => {
      this.virtualNode[modifierKey] = this.modifiers[modifierKey];
    })
  }

  /**
   * Wraps developer written modifiers in async functions with state passed in automatically
   * @param {string} nodeName - The name of the siloNode
   * @param {object} stateModifiers - An object containing unwrapped modifiers most likely from the constructorNode
   */
  reconstruct(siloNodeName, currSiloNode) {
    let reconstructedObject;
    if (currSiloNode.type === types.OBJECT) reconstructedObject = this.reconstructObject(siloNodeName, currSiloNode);
    else if (currSiloNode.type === types.ARRAY) reconstructedObject = this.reconstructArray(siloNodeName, currSiloNode);
    else return currSiloNode.value;
    return reconstructedObject;
  }

  /**
   * Wraps developer written modifiers in async functions with state passed in automatically
   * @param {string} nodeName - The name of the siloNode
   * @param {object} stateModifiers - An object containing unwrapped modifiers most likely from the constructorNode
   */
  reconstructObject(siloNodeName, currSiloNode) {
    const newObject = {};
    // loop through object values currently stored as nodes
    Object.keys(currSiloNode.value).forEach(key => {
      const childObj = currSiloNode.value[key];
      
      //get keyName from the naming convention
      const extractedKey = key.slice(siloNodeName.length + 1);
      if (childObj.type === types.OBJECT || childObj.type === types.ARRAY) {
        newObject[extractedKey] = this.reconstruct(key, childObj);
      } else if (childObj.type === types.PRIMITIVE) {
        newObject[extractedKey] = childObj.value;
      }
    })
    return newObject;
  }

  /**
   * Wraps developer written modifiers in async functions with state passed in automatically
   * @param {string} nodeName - The name of the siloNode
   * @param {object} stateModifiers - An object containing unwrapped modifiers most likely from the constructorNode
   */
  reconstructArray(siloNodeName, currSiloNode) {
    const newArray = [];
    // loop through array indices currently stored as nodes
    Object.keys(currSiloNode.value).forEach((key, i) => {
      const childObj = currSiloNode.value[key];
      if (childObj.type === types.ARRAY || childObj.type === types.OBJECT) {
        newArray.push(this.reconstruct(`${siloNodeName}_${i}`, childObj));
      } else if (childObj.type === types.PRIMITIVE) {
        newArray.push(childObj.value);
      }
    })
    return newArray;
  }

  getState(){
    if(this.type === types.CONTAINER){
      return this.virtualNode
    } else {
      let context = this.virtualNode;
      while(context.type !== types.CONTAINER){
        context = context.parent;
      }
      return context;
    }
  }

  // unsheatheChildren() {

  //   const state = {};
  //   // call getState on parent nodes up till root and collect all variables/modifiers from parents
  //   if (this.parent !== null) {
  //     const parentState = this.parent.unsheatheChildren();
  //     Object.keys(parentState).forEach(key => {
  //       state[key] = parentState[key];
  //     })
  //   }

  //   // getting children of objects/arays is redundant
  //   if (this.type !== types.ARRAY && this.type !== types.OBJECT)
  //     Object.keys(this.value).forEach(siloNodeName => {
  //       const currSiloNode = this.value[siloNodeName];
  //       if (currSiloNode.type === types.OBJECT || currSiloNode.type === types.ARRAY) state[siloNodeName] = this.reconstruct(siloNodeName, currSiloNode);
  //       else if (currSiloNode.type === types.PRIMITIVE) state[siloNodeName] = currSiloNode.value;

  //       // some siloNodes don't have modifiers
  //       if (currSiloNode.modifiers) {
  //         Object.keys(currSiloNode.modifiers).forEach(modifier => {
  //           state[modifier] = currSiloNode.modifiers[modifier];
  //         })
  //       }
  //     })

  //   return state;
  // }
}

export default SiloNode;