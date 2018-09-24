// import * as types from './constants.js';
const types = require('./constants.js');

class SiloNode {
  constructor(name, val, parent = null, modifiers = {}, type = types.PRIMITIVE) {
    this.name = name;
    this.value = val;
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
    this.handleArray = this.handleArray.bind(this);
    this.handleObject = this.handleObject.bind(this);
    this.updateSilo = this.updateSilo.bind(this);
    this.handle = this.handle.bind(this);

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
      if (typeof func !== 'function') throw new Error('subscriber array must only contain functions');
      func(this.getState(this));
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
        else if (that.type === types.OBJECT) {
          linkedModifier = async (payload) => await modifier(this.handleObject(nodeName, that), payload);
        }
        else if (that.type === types.ARRAY) {
          linkedModifier = async (payload) => await modifier(this.handleArray(nodeName, that), payload);
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
        const linkedModifier = async (index, payload) => await modifier(this.handle(that.value[index], index), index, payload); 

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

  handle(node, name) {
    let handledObj;
    if (node.type === types.OBJECT) handledObj = this.handleObject(name, node);
    else if (node.type === types.ARRAY) handledObj = this.handleArray(name, node);
    else return node.value;
    return handledObj;
  }

  handleObject(name, obj) {
    const newObject = {};

    // loop through object values currently stored as nodes
    Object.keys(obj.value).forEach(key => {
      const childObj = obj.value[key];
      //get keyName from the naming convention
      const extractedKey = key.slice(name.length + 1);
      if (childObj.type === types.OBJECT) {
        newObject[extractedKey] = this.handleObject(key, childObj);
      } else if (childObj.type === types.ARRAY) {
        newObject[extractedKey] = this.handleArray(key, childObj);
      } else if (childObj.type === types.PRIMITIVE) {
        newObject[extractedKey] = childObj.value;
      }
    })
    return newObject;
  }

  handleArray(name, obj) {
    const newArray = [];
    // loop through array indices currently stored as nodes
    Object.keys(obj.value).forEach((key, i) => {
      const childObj = obj.value[key];
      if (childObj.type === types.ARRAY) {
        newArray.push(this.handleArray(`${name}_${i}`, childObj));
      } else if (childObj.type === types.OBJECT) {
        newArray.push(this.handleObject(`${name}_${i}`, childObj))
      } else if (childObj.type === types.PRIMITIVE) {
        newArray.push(childObj.value);
      }
    })
    return newArray;
  }

  getState(currentNode = this) {
    const state = {};
    // recurse to root and collect all variables/modifiers from parents
    if (currentNode.parent !== 'root' && currentNode.parent !== null) {
      const parentData = this.getState(currentNode.parent);
      Object.keys(parentData).forEach(key => {
        state[key] = parentData[key];
      })
    }

    // getting children of objects is redundant
    if (currentNode.type !== types.ARRAY && currentNode.type !== types.OBJECT)
      Object.keys(currentNode.value).forEach(key => {
        const node = currentNode.value[key];
        if (node.type === types.OBJECT) state[key] = this.handleObject(key, node);
        else if (node.type === types.ARRAY) {
          state[key] = this.handleArray(key, node);
        }
        else if (node.type === types.PRIMITIVE) state[key] = node.value;

        if (node.modifiers) {
          Object.keys(node.modifiers).forEach(modifier => {
            state[modifier] = node.modifiers[modifier];
          })
        }
      })

    return state;
  }
}

// export default SiloNode;
module.exports = SiloNode;