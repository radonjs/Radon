// import * as types from './constants.js';
const types = require('./constants.js');

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
    this.updateSilo = this.updateSilo.bind(this);
    this.reconstruct = this.reconstruct.bind(this);

    // invoke functions
    this.runQueue = this.runModifiers();
  }

  get name() {
    return this._name;
  }

  set name(name) {
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
    this._type = type;
  }

  notifySubscribers() {
    if (this.subscribers.length === 0) return;
    this.subscribers.forEach(func => {
      if (typeof func !== 'function') throw new Error('Subscriber array must only contain functions');
      func(this.getState());
    })
  }

  runModifiers() {
    let running = false; // prevents multiple calls from being made if already running

    async function run() {
      if (running === false) { // prevents multiple calls from being made if already running
        running = true;
        while (this.queue.length > 0) {
          this.value = await this.queue.shift()();
          if (this.type !== types.PRIMITIVE) this.value = this.updateSilo().value;
          this.notifySubscribers();
        }
        running = false;   
      } else {
        return 'in progress...';
      }
    }
    return run;
  }

  updateSilo(objName = this.name, obj = this, parent = this.parent) {
    const objChildren = {};
    let type, keys;
  
    // determine if array or other object
    if (Array.isArray(obj.value)) {
      keys = obj.value;
      type = types.ARRAY;
    } else {
      keys = Object.keys(obj.value);
      type = types.OBJECT;
    }
  
    const node = new SiloNode(objName, objChildren, parent, obj.modifiers, type);
    
    if (Array.isArray(obj.value) && obj.value.length > 0) {
      obj.value.forEach((val, i) => {
        if (typeof val === 'object') objChildren[`${objName}_${i}`] = this.updateSilo(`${objName}_${i}`, {value: val}, node);
        else objChildren[`${objName}_${i}`] = new SiloNode(`${objName}_${i}`, val, node);
      })
    } 
    
    else if (keys.length > 0) {
      keys.forEach(key => {
        if (typeof obj.value[key] === 'object') objChildren[`${objName}_${key}`] = this.updateSilo(key, {value: obj.value[key]}, node);
        else objChildren[`${objName}_${key}`] = new SiloNode(`${objName}_${key}`, obj.value[key], node);
      })
    }

    node.value = objChildren;
    return node;
  }

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
  }

  reconstruct(siloNodeName, currSiloNode) {
    let reconstructedObject;
    if (currSiloNode.type === types.OBJECT) reconstructedObject = this.reconstructObject(siloNodeName, currSiloNode);
    else if (currSiloNode.type === types.ARRAY) reconstructedObject = this.reconstructArray(siloNodeName, currSiloNode);
    else return currSiloNode.value;
    return reconstructedObject;
  }

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

  getState() {
    const state = {};
    // call getState on parent nodes up till root and collect all variables/modifiers from parents
    if (this.parent !== null) {
      const parentState = this.parent.getState();
      Object.keys(parentState).forEach(key => {
        state[key] = parentState[key];
      })
    }

    // getting children of objects/arays is redundant
    if (this.type !== types.ARRAY && this.type !== types.OBJECT)
      Object.keys(this.value).forEach(siloNodeName => {
        const currSiloNode = this.value[siloNodeName];
        if (currSiloNode.type === types.OBJECT || currSiloNode.type === types.ARRAY) state[siloNodeName] = this.reconstruct(siloNodeName, currSiloNode);
        else if (currSiloNode.type === types.PRIMITIVE) state[siloNodeName] = currSiloNode.value;

        // some siloNodes don't have modifiers
        if (currSiloNode.modifiers) {
          Object.keys(currSiloNode.modifiers).forEach(modifier => {
            state[modifier] = currSiloNode.modifiers[modifier];
          })
        }
      })

    return state;
  }
}

// export default SiloNode;
module.exports = SiloNode;