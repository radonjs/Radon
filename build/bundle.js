'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var ConstructorNode =
/*#__PURE__*/
function () {
  function ConstructorNode(name) {
    var parentName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, ConstructorNode);

    this.name = name;
    this.state = {};
    this.parent = parentName;
    this.initializeState = this.initializeState.bind(this);
    this.initializeModifiers = this.initializeModifiers.bind(this);
  }
  /**
   * Adds variables to the state
   * @param {object} initialState - An object with keys as variable names and values of data
   */


  _createClass(ConstructorNode, [{
    key: "initializeState",
    value: function initializeState(initialState) {
      var _this = this;

      // make sure that the input is an object
      if (_typeof(initialState) !== 'object' || Array.isArray(initialState)) throw new Error('Input must be an object'); // loop through the state variables

      Object.keys(initialState).forEach(function (newVariableInState) {
        _this.state[newVariableInState] = {
          value: initialState[newVariableInState],
          //accounts for itializeModifers being called prior to initializeState. 
          modifiers: _this.state[newVariableInState] ? _this.state[newVariableInState].modifiers : {}
        };
      });
    }
    /**
     * Stores modifiers in state
     * @param {object} initialModifiers - An object with keys associated with existing initialized variables and values that are objects containing modifiers to be bound to that specific variable
     */

  }, {
    key: "initializeModifiers",
    value: function initializeModifiers(initialModifiers) {
      var _this2 = this;

      // make sure that the input is an object
      if (_typeof(initialModifiers) !== 'object' || Array.isArray(initialModifiers)) throw new Error('Input must be an object'); // loop through the state modifiers

      Object.keys(initialModifiers).forEach(function (newModifiersInState) {
        _this2.state[newModifiersInState] = {
          //accounts for initializeState being called prior to initializeState. 
          value: _this2.state[newModifiersInState] ? _this2.state[newModifiersInState].value : null,
          modifiers: initialModifiers[newModifiersInState]
        };
      });
    }
  }, {
    key: "name",
    set: function set(name) {
      if (typeof name !== 'string') throw new Error('Name must be a string');else this._name = name;
    },
    get: function get() {
      return this._name;
    }
  }, {
    key: "parent",
    set: function set(parent) {
      if (typeof parent !== 'string' && parent !== null) throw new Error('Parent must be a string');else this._parent = parent;
    },
    get: function get() {
      return this._parent;
    }
  }, {
    key: "state",
    set: function set(state) {
      this._state = state;
    },
    get: function get() {
      return this._state;
    }
  }]);

  return ConstructorNode;
}();
 // module.exports = ConstructorNode;

var ARRAY = 'ARRAY';
var OBJECT = 'OBJECT';
var PRIMITIVE = 'PRIMITIVE';
var CONTAINER = 'CONTAINER'; // module.exports = {
//   ARRAY: 'ARRAY',
//   OBJECT: 'OBJECT',
//   PRIMITIVE: 'PRIMITIVE',
//   CONTAINER: 'CONTAINER'
// }

var types = /*#__PURE__*/Object.freeze({
  ARRAY: ARRAY,
  OBJECT: OBJECT,
  PRIMITIVE: PRIMITIVE,
  CONTAINER: CONTAINER
});

var SiloNode =
/*#__PURE__*/
function () {
  function SiloNode(name, value) {
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var modifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PRIMITIVE;

    _classCallCheck(this, SiloNode);

    this.name = name;
    this.value = value;
    this.modifiers = modifiers;
    this.queue = [];
    this.subscribers = [];
    this.parent = parent; // circular silo node

    this.type = type; // bind

    this.linkModifiers = this.linkModifiers.bind(this);
    this.runModifiers = this.runModifiers.bind(this);
    this.notifySubscribers = this.notifySubscribers.bind(this);
    this.getState = this.getState.bind(this);
    this.reconstructArray = this.reconstructArray.bind(this);
    this.reconstructObject = this.reconstructObject.bind(this);
    this.deconstructObjectIntoSiloNodes = this.deconstructObjectIntoSiloNodes.bind(this);
    this.reconstruct = this.reconstruct.bind(this); // invoke functions

    this.runQueue = this.runModifiers();
  }

  _createClass(SiloNode, [{
    key: "pushToSubscribers",
    // do we need this?
    value: function pushToSubscribers(renderFunction) {
      this.subscribers.push(renderFunction);
    }
  }, {
    key: "removeFromSubscribersAtIndex",
    value: function removeFromSubscribersAtIndex(index) {
      this.subcribers = this.subscribers.slice(index, 1);
    }
    /**
     * Tells all subscribers of a siloNode that changes to state have been made
     */

  }, {
    key: "notifySubscribers",
    value: function notifySubscribers() {
      var _this = this;

      if (this.subscribers.length === 0) return;
      this.subscribers.forEach(function (func) {
        if (typeof func !== 'function') throw new Error('Subscriber array must only contain functions');
        func(_this.getState());
      });
    }
    /**
     * Invoked once in the siloNode constructor to create a closure. The closure variable 
     * 'running' prevents the returned async function from being invoked if it's
     * still running from a previous call
     */

  }, {
    key: "runModifiers",
    value: function runModifiers() {
      var running = false; // prevents multiple calls from being made if already running

      function run() {
        return _run.apply(this, arguments);
      }

      function _run() {
        _run = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(running === false)) {
                    _context.next = 13;
                    break;
                  }

                  // prevents multiple calls from being made if already running
                  running = true;

                case 2:
                  if (!(this.queue.length > 0)) {
                    _context.next = 10;
                    break;
                  }

                  _context.next = 5;
                  return this.queue.shift()();

                case 5:
                  this.value = _context.sent;
                  if (this.type !== PRIMITIVE) this.value = this.deconstructObjectIntoSiloNodes().value;
                  this.notifySubscribers();
                  _context.next = 2;
                  break;

                case 10:
                  running = false;
                  _context.next = 14;
                  break;

                case 13:
                  return _context.abrupt("return", 'in progress...');

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
        return _run.apply(this, arguments);
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

  }, {
    key: "deconstructObjectIntoSiloNodes",
    value: function deconstructObjectIntoSiloNodes() {
      var _this2 = this;

      var objName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.name;
      var objectToDeconstruct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.parent;
      var runLinkedMods = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var objChildren = {};
      var type, keys; // determine if array or other object

      if (Array.isArray(objectToDeconstruct.value)) {
        keys = objectToDeconstruct.value;
        type = ARRAY;
      } else {
        keys = Object.keys(objectToDeconstruct.value);
        type = OBJECT;
      }

      var newSiloNode = new SiloNode(objName, objChildren, parent, objectToDeconstruct.modifiers, type);

      if (Array.isArray(objectToDeconstruct.value) && objectToDeconstruct.value.length > 0) {
        // loop through the array
        objectToDeconstruct.value.forEach(function (indexedVal, i) {
          // recurse if the array has objects stored in its indices
          if (_typeof(indexedVal) === 'object') objChildren["".concat(objName, "_").concat(i)] = _this2.deconstructObjectIntoSiloNodes("".concat(objName, "_").concat(i), {
            value: indexedVal
          }, newSiloNode, runLinkedMods);else objChildren["".concat(objName, "_").concat(i)] = new SiloNode("".concat(objName, "_").concat(i), indexedVal, newSiloNode);
        });
      } else if (keys.length > 0) {
        // loop through object
        keys.forEach(function (key) {
          // recurse if the object has objects stored in its values
          if (_typeof(objectToDeconstruct.value[key]) === 'object') objChildren["".concat(objName, "_").concat(key)] = _this2.deconstructObjectIntoSiloNodes("".concat(objName, "_").concat(key), {
            value: objectToDeconstruct.value[key]
          }, newSiloNode, runLinkedMods);else objChildren["".concat(objName, "_").concat(key)] = new SiloNode("".concat(objName, "_").concat(key), objectToDeconstruct.value[key], newSiloNode);
        });
      }

      if (runLinkedMods) newSiloNode.linkModifiers();
      return newSiloNode;
    }
    /**
     * Wraps developer written modifiers in async functions with state passed in automatically
     * @param {string} nodeName - The name of the siloNode
     * @param {object} stateModifiers - An object containing unwrapped modifiers most likely from the constructorNode
     */

  }, {
    key: "linkModifiers",
    value: function linkModifiers() {
      var _this3 = this;

      var nodeName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.name;
      var stateModifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.modifiers;
      if (!stateModifiers || Object.keys(stateModifiers).length === 0) return;
      var that = this; // looping through every modifier added by the dev

      Object.keys(stateModifiers).forEach(function (modifierKey) {
        var modifier = stateModifiers[modifierKey];
        if (typeof modifier !== 'function') throw new TypeError(); // adds middleware that will affect the value of this node
        else if (modifier.length <= 2) {
            // wrap the dev's modifier function so we can pass the current node value into it
            var linkedModifier;
            if (that.type === PRIMITIVE) linkedModifier =
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2(payload) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.next = 2;
                        return modifier(that.value, payload);

                      case 2:
                        return _context2.abrupt("return", _context2.sent);

                      case 3:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              }));

              return function linkedModifier(_x) {
                return _ref.apply(this, arguments);
              };
            }(); // that.value is an object and we need to reassemble it
            else if (that.type === OBJECT || that.type === ARRAY) {
                linkedModifier =
                /*#__PURE__*/
                function () {
                  var _ref2 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee3(payload) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _context3.next = 2;
                            return modifier(_this3.reconstruct(nodeName, that), payload);

                          case 2:
                            return _context3.abrupt("return", _context3.sent);

                          case 3:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, this);
                  }));

                  return function linkedModifier(_x2) {
                    return _ref2.apply(this, arguments);
                  };
                }();
              } // the function that will be called when the dev tries to call their modifier

            _this3.modifiers[modifierKey] = function (payload) {
              // wrap the linkedModifier again so that it can be added to the async queue without being invoked
              var callback =
              /*#__PURE__*/
              function () {
                var _ref3 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee4() {
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.next = 2;
                          return linkedModifier(payload);

                        case 2:
                          return _context4.abrupt("return", _context4.sent);

                        case 3:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4, this);
                }));

                return function callback() {
                  return _ref3.apply(this, arguments);
                };
              }();

              that.queue.push(callback);
              that.runQueue();
            };
          } // adds middleware that will affect the value of a child node of index
          else if (modifier.length > 2) {
              // wrap the dev's modifier function so we can pass the current node value into it
              var _linkedModifier =
              /*#__PURE__*/
              function () {
                var _ref4 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee5(index, payload) {
                  return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          _context5.next = 2;
                          return modifier(_this3.reconstruct(index, that.value[index]), index, payload);

                        case 2:
                          return _context5.abrupt("return", _context5.sent);

                        case 3:
                        case "end":
                          return _context5.stop();
                      }
                    }
                  }, _callee5, this);
                }));

                return function _linkedModifier(_x3, _x4) {
                  return _ref4.apply(this, arguments);
                };
              }(); // the function that will be called when the dev tries to call their modifier


              _this3.modifiers[modifierKey] = function (index, payload) {
                // wrap the linkedModifier again so that it can be added to the async queue without being invoked
                var callback =
                /*#__PURE__*/
                function () {
                  var _ref5 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee6() {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            _context6.next = 2;
                            return _linkedModifier("".concat(_this3.name, "_").concat(index), payload);

                          case 2:
                            return _context6.abrupt("return", _context6.sent);

                          case 3:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6, this);
                  }));

                  return function callback() {
                    return _ref5.apply(this, arguments);
                  };
                }();

                that.value["".concat(_this3.name, "_").concat(index)].queue.push(callback);
                that.value["".concat(_this3.name, "_").concat(index)].runQueue();
              };
            }
      });
    }
    /**
     * Wraps developer written modifiers in async functions with state passed in automatically
     * @param {string} nodeName - The name of the siloNode
     * @param {object} stateModifiers - An object containing unwrapped modifiers most likely from the constructorNode
     */

  }, {
    key: "reconstruct",
    value: function reconstruct(siloNodeName, currSiloNode) {
      var reconstructedObject;
      if (currSiloNode.type === OBJECT) reconstructedObject = this.reconstructObject(siloNodeName, currSiloNode);else if (currSiloNode.type === ARRAY) reconstructedObject = this.reconstructArray(siloNodeName, currSiloNode);else return currSiloNode.value;
      return reconstructedObject;
    }
    /**
     * Wraps developer written modifiers in async functions with state passed in automatically
     * @param {string} nodeName - The name of the siloNode
     * @param {object} stateModifiers - An object containing unwrapped modifiers most likely from the constructorNode
     */

  }, {
    key: "reconstructObject",
    value: function reconstructObject(siloNodeName, currSiloNode) {
      var _this4 = this;

      var newObject = {}; // loop through object values currently stored as nodes

      Object.keys(currSiloNode.value).forEach(function (key) {
        var childObj = currSiloNode.value[key]; //get keyName from the naming convention

        var extractedKey = key.slice(siloNodeName.length + 1);

        if (childObj.type === OBJECT || childObj.type === ARRAY) {
          newObject[extractedKey] = _this4.reconstruct(key, childObj);
        } else if (childObj.type === PRIMITIVE) {
          newObject[extractedKey] = childObj.value;
        }
      });
      return newObject;
    }
    /**
     * Wraps developer written modifiers in async functions with state passed in automatically
     * @param {string} nodeName - The name of the siloNode
     * @param {object} stateModifiers - An object containing unwrapped modifiers most likely from the constructorNode
     */

  }, {
    key: "reconstructArray",
    value: function reconstructArray(siloNodeName, currSiloNode) {
      var _this5 = this;

      var newArray = []; // loop through array indices currently stored as nodes

      Object.keys(currSiloNode.value).forEach(function (key, i) {
        var childObj = currSiloNode.value[key];

        if (childObj.type === ARRAY || childObj.type === OBJECT) {
          newArray.push(_this5.reconstruct("".concat(siloNodeName, "_").concat(i), childObj));
        } else if (childObj.type === PRIMITIVE) {
          newArray.push(childObj.value);
        }
      });
      return newArray;
    }
  }, {
    key: "getState",
    value: function getState() {
      var _this6 = this;

      var state = {}; // call getState on parent nodes up till root and collect all variables/modifiers from parents

      if (this.parent !== null) {
        var parentState = this.parent.getState();
        Object.keys(parentState).forEach(function (key) {
          state[key] = parentState[key];
        });
      } // getting children of objects/arays is redundant


      if (this.type !== ARRAY && this.type !== OBJECT) Object.keys(this.value).forEach(function (siloNodeName) {
        var currSiloNode = _this6.value[siloNodeName];
        if (currSiloNode.type === OBJECT || currSiloNode.type === ARRAY) state[siloNodeName] = _this6.reconstruct(siloNodeName, currSiloNode);else if (currSiloNode.type === PRIMITIVE) state[siloNodeName] = currSiloNode.value; // some siloNodes don't have modifiers

        if (currSiloNode.modifiers) {
          Object.keys(currSiloNode.modifiers).forEach(function (modifier) {
            state[modifier] = currSiloNode.modifiers[modifier];
          });
        }
      });
      return state;
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    },
    set: function set(name) {
      if (!name || typeof name !== 'string') throw new Error('Name is required and should be a string');
      this._name = name;
    }
  }, {
    key: "value",
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      this._value = value;
    }
  }, {
    key: "modifiers",
    get: function get() {
      return this._modifiers;
    },
    set: function set(modifiers) {
      if (_typeof(modifiers) !== 'object' || Array.isArray(modifiers)) throw new Error('Modifiers must be a plain object');
      this._modifiers = modifiers;
    }
  }, {
    key: "queue",
    get: function get() {
      return this._queue;
    },
    set: function set(queue) {
      this._queue = queue;
    }
  }, {
    key: "parent",
    get: function get() {
      return this._parent;
    },
    set: function set(parent) {
      if (parent && parent.constructor.name !== 'SiloNode') throw new Error('Parent must be null or a siloNode');
      this._parent = parent;
    }
  }, {
    key: "subscribers",
    get: function get() {
      return this._subscribers;
    },
    set: function set(subscribers) {
      this._subscribers = subscribers;
    }
  }, {
    key: "type",
    get: function get() {
      return this._type;
    },
    set: function set(type) {
      if (typeof type !== 'string' || !types[type]) throw new Error('Type must be an available constant');
      this._type = type;
    }
  }]);

  return SiloNode;
}();
 // module.exports = SiloNode;

// const AppState = new ConstructorNode('AppState');
// AppState.initializeState({
//   name: 'Han',
//   age: 25
// })
// AppState.initializeModifiers({
//   age: {
//     incrementAge: (current, payload) => {
//       return current + payload;
//     }
//   }
// });
// const NavState = new ConstructorNode('NavState', 'AppState');
// NavState.initializeState({
//   name: 'Han',
//   cart: {one: 1, array: [1,2,3, {test: 'test'}]}
//   // cart: [{two: 2, three: [1,2,3]}, 5, 10]
// })
// NavState.initializeModifiers({
//   cart: {
//     updateCartItem: (current, index, payload) => {
//       return ++current;
//     },
//     addItem: (current, payload) => {
//       current.newThing = 'A new thing';
//       // current.push(payload);
//       return current;
//     }
//   }
// });
// const ButtState = new ConstructorNode('ButtState');
// ButtState.parent = 'NavState';
// ButtState.initializeState({
//   butt: 'Butt'
// })
//==================> SILO TESTING ENDED <===================\\

var silo = {};
/**
 * Takes all of the constructorNodes created by the developer
 * @param  {...ConstructorNode} args - A list of constructor Nodes
 */

function combineNodes() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) throw new Error('combineNodes function takes at least one constructorNode'); // hastable accounts for passing in constructorNodes in any order. 
  // hashtable organizes all nodes into parent-child relationships

  var hashTable = {};
  args.forEach(function (constructorNode) {
    if (!constructorNode || constructorNode.constructor.name !== 'ConstructorNode') throw new Error('Only constructorNodes can be passed to combineNodes');else if (constructorNode.parent === null) {
      // this is the root node, only one constructorNode can have a parent of null
      if (!hashTable.root) hashTable.root = [constructorNode];else throw new Error('Only one constructor node can have null parent');
    } else {
      if (!hashTable[constructorNode.parent]) hashTable[constructorNode.parent] = [constructorNode]; // if parent already exists, and node being added will append to the array of children
      else hashTable[constructorNode.parent].push(constructorNode);
    }
  }); // ensure there is a defined root

  if (!hashTable.root) throw new Error('At least one constructor node must have a null parent'); // recursive function that will create siloNodes and return them to a parent

  function mapToSilo() {
    var constructorNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'root';
    var parentConstructorNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var constructorNodeName = constructorNode === 'root' ? 'root' : constructorNode.name; // recursive base case, we only continue if the constructorNode has constructorNode children

    if (!hashTable[constructorNodeName]) return;
    var children = {}; // loop through the children of constructorNode

    hashTable[constructorNodeName].forEach(function (currConstructorNode) {
      var valuesOfCurrSiloNode = {};
      children[currConstructorNode.name] = new SiloNode(currConstructorNode.name, valuesOfCurrSiloNode, parentConstructorNode, {}, CONTAINER); // abstract some variables

      var currSiloNode = children[currConstructorNode.name];
      var stateOfCurrConstructorNode = currConstructorNode.state; // create SiloNodes for all the variables in the currConstructorNode

      Object.keys(stateOfCurrConstructorNode).forEach(function (varInConstructorNodeState) {
        // creates siloNodes for object variables
        if (_typeof(stateOfCurrConstructorNode[varInConstructorNodeState].value) === 'object') {
          valuesOfCurrSiloNode[varInConstructorNodeState] = currSiloNode.deconstructObjectIntoSiloNodes(varInConstructorNodeState, stateOfCurrConstructorNode[varInConstructorNodeState], currSiloNode, true);
        } // creates siloNodes for primitive variables
        else {
            valuesOfCurrSiloNode[varInConstructorNodeState] = new SiloNode(varInConstructorNodeState, stateOfCurrConstructorNode[varInConstructorNodeState].value, currSiloNode, stateOfCurrConstructorNode[varInConstructorNodeState].modifiers);
            valuesOfCurrSiloNode[varInConstructorNodeState].linkModifiers();
          }
      }); // recursively check to see if the current constructorNode/siloNode has any children 

      var siloNodeChildren = mapToSilo(currConstructorNode, currSiloNode);

      if (siloNodeChildren) {
        Object.keys(siloNodeChildren).forEach(function (siloNode) {
          valuesOfCurrSiloNode[siloNode] = siloNodeChildren[siloNode];
        });
      }
    });
    return children;
  } // rootState


  var wrappedRootSiloNode = mapToSilo(); // will always only be a single key (the root) that is added into the silo

  Object.keys(wrappedRootSiloNode).forEach(function (rootSiloNode) {
    silo[rootSiloNode] = wrappedRootSiloNode[rootSiloNode];
  });
  forEachSiloNode(function (node) {
    // apply keySubscribe only to object and array silo nodes
    if (node.type === 'OBJECT' || node.type === "ARRAY") {
      node.modifiers.keySubscribe = function (key, renderFunc) {
        var name = node.name + "_" + key;
        var subscribedAtIndex = node.value[name].pushToSubscribers(renderFunc);
        node.value[name].notifySubscribers();
        return function () {
          node.removeFromSubscribersAtIndex(subscribedAtIndex);
        };
      };
    }
  });
  return silo;
}
/**
 * Applies the callback to every siloNode in the silo
 * @param {function} callback - A function that accepts a siloNode as its parameter
 */
// callbacks have to accept a SILONODE


function forEachSiloNode(callback) {
  // accessing the single root in the silo
  Object.keys(silo).forEach(function (siloNodeRootKey) {
    inner(silo[siloNodeRootKey], callback);
  }); // recursively navigate to every siloNode

  function inner(head, callback) {
    if (head.constructor.name === 'SiloNode') {
      callback(head);
      if (head.type === PRIMITIVE) return; // recursive base case
      else {
          Object.keys(head.value).forEach(function (key) {
            if (head.value[key].constructor.name === 'SiloNode') {
              inner(head.value[key], callback);
            }
          });
        }
    }
  }
} // combineNodes(ButtState, NavState, AppState); // testing purposes
// // combineNodes(AppState, NavState); // testing purposes
// setTimeout(() => {console.log('delay', silo.AppState.value.NavState.getState())}, 1000);
// setTimeout(() => {console.log('Im adding again', silo.AppState.value.NavState.getState().addItem({six: 6}))}, 1001);
// setTimeout(() => {console.log('delay', silo.AppState.value.NavState.getState())}, 1010);
// ==========> TESTS that calling a parent function will modify its child for nested objects <========== \\
// console.log(silo.AppState.value.cart.value.cart_one.value);
// silo.AppState.value.cart.modifiers.increment('cart_one');
// setTimeout(() => {
//   console.log(silo.AppState.value.cart.value.cart_one.value);
// }, 1000);
// ==========> END TESTS that calling a parent function will modify its child for nested objects <========== \\

/**
 * Subscribes components to siloNodes in the silo
 * @param  {function} renderFunction - Function to be appended to subscribers array
 * @param {string} name - Name of the relevant component with 'State' appended
 */


silo.subscribe = function (renderFunction, name) {
  if (!name) {
    if (!!renderFunction.prototype) {
      name = renderFunction.prototype.constructor.name + 'State';
    } else {
      throw new Error('You can\'t use an anonymous function in subscribe without a name argument.');
    }
  }

  var foundNode;
  var subscribedAtIndex;
  var foundNodeChildren = [];
  forEachSiloNode(function (node) {
    if (node.name === name) {
      subscribedAtIndex = node.pushToSubscribers(renderFunction);
      foundNode = node;
      foundNodeChildren.push({
        node: foundNode,
        index: subscribedAtIndex
      });
    }
  });

  function unsubscribe() {
    var ob;
    Object.keys(foundNodeChildren).forEach(function (key) {
      ob = foundNodeChildren[key];
      ob.node.removeFromSubscribersAtIndex(ob.index);
    });
  }

  if (!!foundNode) {
    renderFunction(foundNode.getState());

    if (foundNode.value) {
      Object.keys(foundNode.value).forEach(function (key) {
        var node = foundNode.value[key];

        if (node.type !== 'CONTAINER') {
          subscribedAtIndex = node.pushToSubscribers(renderFunction);
          foundNodeChildren.push({
            node: node,
            index: subscribedAtIndex
          });
        }
      });
    }
  } else {
    console.error(new Error('You are trying to subscribe to something that isn\'t in the silo.'));
  }

  return unsubscribe;
};
 // module.exports = combineNodes;

var combineState = combineNodes;
var State = ConstructorNode;

exports.combineState = combineState;
exports.State = State;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9yYWRvbi9jb25zdHJ1Y3Rvck5vZGUuanMiLCIuLi9yYWRvbi9jb25zdGFudHMuanMiLCIuLi9yYWRvbi9zaWxvTm9kZS5qcyIsIi4uL3JhZG9uL2NvbWJpbmVOb2Rlcy5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIENvbnN0cnVjdG9yTm9kZSB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIHBhcmVudE5hbWUgPSBudWxsKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTsgXG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50TmFtZTtcbiAgICBcbiAgICB0aGlzLmluaXRpYWxpemVTdGF0ZSA9IHRoaXMuaW5pdGlhbGl6ZVN0YXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0aWFsaXplTW9kaWZpZXJzID0gdGhpcy5pbml0aWFsaXplTW9kaWZpZXJzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB2YXJpYWJsZXMgdG8gdGhlIHN0YXRlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpbml0aWFsU3RhdGUgLSBBbiBvYmplY3Qgd2l0aCBrZXlzIGFzIHZhcmlhYmxlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgZGF0YVxuICAgKi9cblxuICBpbml0aWFsaXplU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gICAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIGlucHV0IGlzIGFuIG9iamVjdFxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFN0YXRlICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KGluaXRpYWxTdGF0ZSkpIHRocm93IG5ldyBFcnJvcignSW5wdXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAvLyBsb29wIHRocm91Z2ggdGhlIHN0YXRlIHZhcmlhYmxlc1xuICAgIE9iamVjdC5rZXlzKGluaXRpYWxTdGF0ZSkuZm9yRWFjaChuZXdWYXJpYWJsZUluU3RhdGUgPT4ge1xuICAgICAgdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdID0ge1xuICAgICAgICB2YWx1ZTogaW5pdGlhbFN0YXRlW25ld1ZhcmlhYmxlSW5TdGF0ZV0sXG4gICAgICAgIC8vYWNjb3VudHMgZm9yIGl0aWFsaXplTW9kaWZlcnMgYmVpbmcgY2FsbGVkIHByaW9yIHRvIGluaXRpYWxpemVTdGF0ZS4gXG4gICAgICAgIG1vZGlmaWVyczogdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdID8gdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdLm1vZGlmaWVycyA6IHt9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmVzIG1vZGlmaWVycyBpbiBzdGF0ZVxuICAgKiBAcGFyYW0ge29iamVjdH0gaW5pdGlhbE1vZGlmaWVycyAtIEFuIG9iamVjdCB3aXRoIGtleXMgYXNzb2NpYXRlZCB3aXRoIGV4aXN0aW5nIGluaXRpYWxpemVkIHZhcmlhYmxlcyBhbmQgdmFsdWVzIHRoYXQgYXJlIG9iamVjdHMgY29udGFpbmluZyBtb2RpZmllcnMgdG8gYmUgYm91bmQgdG8gdGhhdCBzcGVjaWZpYyB2YXJpYWJsZVxuICAgKi9cbiAgXG4gIGluaXRpYWxpemVNb2RpZmllcnMoaW5pdGlhbE1vZGlmaWVycykge1xuICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBpbnB1dCBpcyBhbiBvYmplY3RcbiAgICBpZiAodHlwZW9mIGluaXRpYWxNb2RpZmllcnMgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoaW5pdGlhbE1vZGlmaWVycykpIHRocm93IG5ldyBFcnJvcignSW5wdXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAvLyBsb29wIHRocm91Z2ggdGhlIHN0YXRlIG1vZGlmaWVyc1xuICAgIE9iamVjdC5rZXlzKGluaXRpYWxNb2RpZmllcnMpLmZvckVhY2gobmV3TW9kaWZpZXJzSW5TdGF0ZSA9PiB7XG4gICAgICB0aGlzLnN0YXRlW25ld01vZGlmaWVyc0luU3RhdGVdID0ge1xuICAgICAgICAvL2FjY291bnRzIGZvciBpbml0aWFsaXplU3RhdGUgYmVpbmcgY2FsbGVkIHByaW9yIHRvIGluaXRpYWxpemVTdGF0ZS4gXG4gICAgICAgIHZhbHVlOiB0aGlzLnN0YXRlW25ld01vZGlmaWVyc0luU3RhdGVdID8gdGhpcy5zdGF0ZVtuZXdNb2RpZmllcnNJblN0YXRlXS52YWx1ZSA6IG51bGwsXG4gICAgICAgIG1vZGlmaWVyczogaW5pdGlhbE1vZGlmaWVyc1tuZXdNb2RpZmllcnNJblN0YXRlXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IG5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcignTmFtZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgZWxzZSB0aGlzLl9uYW1lID0gbmFtZTtcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgc2V0IHBhcmVudChwYXJlbnQpIHtcbiAgICBpZiAodHlwZW9mIHBhcmVudCAhPT0gJ3N0cmluZycgJiYgcGFyZW50ICE9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgZWxzZSB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICBnZXQgcGFyZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gIH1cblxuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICB9XG5cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25zdHJ1Y3Rvck5vZGU7XG4vLyBtb2R1bGUuZXhwb3J0cyA9IENvbnN0cnVjdG9yTm9kZTsiLCJleHBvcnQgY29uc3QgQVJSQVkgPSAnQVJSQVknO1xuZXhwb3J0IGNvbnN0IE9CSkVDVCA9ICdPQkpFQ1QnO1xuZXhwb3J0IGNvbnN0IFBSSU1JVElWRSA9ICdQUklNSVRJVkUnO1xuZXhwb3J0IGNvbnN0IENPTlRBSU5FUiA9ICdDT05UQUlORVInO1xuXG4vLyBtb2R1bGUuZXhwb3J0cyA9IHtcbi8vICAgQVJSQVk6ICdBUlJBWScsXG4vLyAgIE9CSkVDVDogJ09CSkVDVCcsXG4vLyAgIFBSSU1JVElWRTogJ1BSSU1JVElWRScsXG4vLyAgIENPTlRBSU5FUjogJ0NPTlRBSU5FUidcbi8vIH0iLCJpbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG4vLyBjb25zdCB0eXBlcyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJyk7XG5cbmNsYXNzIFNpbG9Ob2RlIHtcbiAgY29uc3RydWN0b3IobmFtZSwgdmFsdWUsIHBhcmVudCA9IG51bGwsIG1vZGlmaWVycyA9IHt9LCB0eXBlID0gdHlwZXMuUFJJTUlUSVZFKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5tb2RpZmllcnMgPSBtb2RpZmllcnM7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBbXTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDsgLy8gY2lyY3VsYXIgc2lsbyBub2RlXG4gICAgdGhpcy50eXBlID0gdHlwZTtcblxuICAgIC8vIGJpbmRcbiAgICB0aGlzLmxpbmtNb2RpZmllcnMgPSB0aGlzLmxpbmtNb2RpZmllcnMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJ1bk1vZGlmaWVycyA9IHRoaXMucnVuTW9kaWZpZXJzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycyA9IHRoaXMubm90aWZ5U3Vic2NyaWJlcnMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFN0YXRlID0gdGhpcy5nZXRTdGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjb25zdHJ1Y3RBcnJheSA9IHRoaXMucmVjb25zdHJ1Y3RBcnJheS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjb25zdHJ1Y3RPYmplY3QgPSB0aGlzLnJlY29uc3RydWN0T2JqZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5kZWNvbnN0cnVjdE9iamVjdEludG9TaWxvTm9kZXMgPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2Rlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjb25zdHJ1Y3QgPSB0aGlzLnJlY29uc3RydWN0LmJpbmQodGhpcyk7XG5cbiAgICAvLyBpbnZva2UgZnVuY3Rpb25zXG4gICAgdGhpcy5ydW5RdWV1ZSA9IHRoaXMucnVuTW9kaWZpZXJzKCk7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIHNldCBuYW1lKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUgfHwgdHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoJ05hbWUgaXMgcmVxdWlyZWQgYW5kIHNob3VsZCBiZSBhIHN0cmluZycpXG4gICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBtb2RpZmllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGlmaWVycztcbiAgfVxuXG4gIHNldCBtb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gICAgaWYgKHR5cGVvZiBtb2RpZmllcnMgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkobW9kaWZpZXJzKSkgdGhyb3cgbmV3IEVycm9yKCdNb2RpZmllcnMgbXVzdCBiZSBhIHBsYWluIG9iamVjdCcpO1xuICAgIHRoaXMuX21vZGlmaWVycyA9IG1vZGlmaWVycztcbiAgfVxuXG4gIGdldCBxdWV1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWU7XG4gIH1cblxuICBzZXQgcXVldWUocXVldWUpIHtcbiAgICB0aGlzLl9xdWV1ZSA9IHF1ZXVlO1xuICB9XG5cbiAgZ2V0IHBhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgc2V0IHBhcmVudChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnU2lsb05vZGUnKSB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBtdXN0IGJlIG51bGwgb3IgYSBzaWxvTm9kZScpO1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgfVxuXG4gIGdldCBzdWJzY3JpYmVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlcnM7XG4gIH1cblxuICBzZXQgc3Vic2NyaWJlcnMoc3Vic2NyaWJlcnMpIHtcbiAgICB0aGlzLl9zdWJzY3JpYmVycyA9IHN1YnNjcmliZXJzO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gIH1cblxuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJyB8fCAhdHlwZXNbdHlwZV0pIHRocm93IG5ldyBFcnJvcignVHlwZSBtdXN0IGJlIGFuIGF2YWlsYWJsZSBjb25zdGFudCcpO1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICB9XG5cbiAgLy8gZG8gd2UgbmVlZCB0aGlzP1xuICBwdXNoVG9TdWJzY3JpYmVycyhyZW5kZXJGdW5jdGlvbil7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHJlbmRlckZ1bmN0aW9uKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21TdWJzY3JpYmVyc0F0SW5kZXgoaW5kZXgpe1xuICAgIHRoaXMuc3ViY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnMuc2xpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlbGxzIGFsbCBzdWJzY3JpYmVycyBvZiBhIHNpbG9Ob2RlIHRoYXQgY2hhbmdlcyB0byBzdGF0ZSBoYXZlIGJlZW4gbWFkZVxuICAgKi9cbiAgbm90aWZ5U3Vic2NyaWJlcnMoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmMgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgRXJyb3IoJ1N1YnNjcmliZXIgYXJyYXkgbXVzdCBvbmx5IGNvbnRhaW4gZnVuY3Rpb25zJyk7XG4gICAgICBmdW5jKHRoaXMuZ2V0U3RhdGUoKSk7XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZva2VkIG9uY2UgaW4gdGhlIHNpbG9Ob2RlIGNvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIGNsb3N1cmUuIFRoZSBjbG9zdXJlIHZhcmlhYmxlIFxuICAgKiAncnVubmluZycgcHJldmVudHMgdGhlIHJldHVybmVkIGFzeW5jIGZ1bmN0aW9uIGZyb20gYmVpbmcgaW52b2tlZCBpZiBpdCdzXG4gICAqIHN0aWxsIHJ1bm5pbmcgZnJvbSBhIHByZXZpb3VzIGNhbGxcbiAgICovXG4gIHJ1bk1vZGlmaWVycygpIHtcbiAgICBsZXQgcnVubmluZyA9IGZhbHNlOyAvLyBwcmV2ZW50cyBtdWx0aXBsZSBjYWxscyBmcm9tIGJlaW5nIG1hZGUgaWYgYWxyZWFkeSBydW5uaW5nXG5cbiAgICBhc3luYyBmdW5jdGlvbiBydW4oKSB7XG4gICAgICBpZiAocnVubmluZyA9PT0gZmFsc2UpIHsgLy8gcHJldmVudHMgbXVsdGlwbGUgY2FsbHMgZnJvbSBiZWluZyBtYWRlIGlmIGFscmVhZHkgcnVubmluZ1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgd2hpbGUgKHRoaXMucXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMudmFsdWUgPSBhd2FpdCB0aGlzLnF1ZXVlLnNoaWZ0KCkoKTtcbiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSB0eXBlcy5QUklNSVRJVkUpIHRoaXMudmFsdWUgPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcygpLnZhbHVlO1xuICAgICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBydW5uaW5nID0gZmFsc2U7ICAgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2luIHByb2dyZXNzLi4uJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ1bjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNvbnN0cnVjdHMgb2JqZWN0cyBpbnRvIGEgcGFyZW50IHNpbG9Ob2RlIHdpdGggYSB0eXBlIG9mIG9iamVjdC9hcnJheSwgYW5kXG4gICAqIGNoaWxkcmVuIHNpbG9Ob2RlcyB3aXRoIHZhbHVlcyBwZXJ0YWluaW5nIHRvIHRoZSBjb250ZW50cyBvZiB0aGUgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvYmpOYW1lIC0gVGhlIGludGVuZGVkIGtleSBvZiB0aGUgb2JqZWN0IHdoZW4gc3RvcmVkIGluIHRoZSBzaWxvXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RUb0RlY29uc3RydWN0IC0gQW55IG9iamVjdCB0aGF0IG11c3QgY29udGFpbiBhIGtleSBvZiB2YWx1ZVxuICAgKiBAcGFyYW0ge1NpbG9Ob2RlfSBwYXJlbnQgLSBJbnRlbmRlZCBTaWxvTm9kZSBwYXJlbnQgdG8gdGhlIGRlY29uc3RydWN0ZWQgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcnVuTGlua2VkTW9kcyAtIFRydWUgb25seSB3aGVuIGJlaW5nIGNhbGxlZCBmb3IgYSBjb25zdHJ1Y3Rvck5vZGVcbiAgICovXG4gIGRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyhvYmpOYW1lID0gdGhpcy5uYW1lLCBvYmplY3RUb0RlY29uc3RydWN0ID0gdGhpcywgcGFyZW50ID0gdGhpcy5wYXJlbnQsIHJ1bkxpbmtlZE1vZHMgPSBmYWxzZSkge1xuICAgIGNvbnN0IG9iakNoaWxkcmVuID0ge307XG4gICAgbGV0IHR5cGUsIGtleXM7XG4gIFxuICAgIC8vIGRldGVybWluZSBpZiBhcnJheSBvciBvdGhlciBvYmplY3RcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlKSkge1xuICAgICAga2V5cyA9IG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWU7XG4gICAgICB0eXBlID0gdHlwZXMuQVJSQVk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlKTtcbiAgICAgIHR5cGUgPSB0eXBlcy5PQkpFQ1Q7XG4gICAgfVxuICBcbiAgICBjb25zdCBuZXdTaWxvTm9kZSA9IG5ldyBTaWxvTm9kZShvYmpOYW1lLCBvYmpDaGlsZHJlbiwgcGFyZW50LCBvYmplY3RUb0RlY29uc3RydWN0Lm1vZGlmaWVycywgdHlwZSk7XG4gICAgXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZSkgJiYgb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGFycmF5XG4gICAgICBvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlLmZvckVhY2goKGluZGV4ZWRWYWwsIGkpID0+IHtcbiAgICAgICAgLy8gcmVjdXJzZSBpZiB0aGUgYXJyYXkgaGFzIG9iamVjdHMgc3RvcmVkIGluIGl0cyBpbmRpY2VzXG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXhlZFZhbCA9PT0gJ29iamVjdCcpIG9iakNoaWxkcmVuW2Ake29iak5hbWV9XyR7aX1gXSA9IHRoaXMuZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzKGAke29iak5hbWV9XyR7aX1gLCB7dmFsdWU6IGluZGV4ZWRWYWx9LCBuZXdTaWxvTm9kZSwgcnVuTGlua2VkTW9kcyk7XG4gICAgICAgIGVsc2Ugb2JqQ2hpbGRyZW5bYCR7b2JqTmFtZX1fJHtpfWBdID0gbmV3IFNpbG9Ob2RlKGAke29iak5hbWV9XyR7aX1gLCBpbmRleGVkVmFsLCBuZXdTaWxvTm9kZSk7XG4gICAgICB9KVxuICAgIH0gXG4gICAgXG4gICAgZWxzZSBpZiAoa2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBsb29wIHRocm91Z2ggb2JqZWN0XG4gICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgLy8gcmVjdXJzZSBpZiB0aGUgb2JqZWN0IGhhcyBvYmplY3RzIHN0b3JlZCBpbiBpdHMgdmFsdWVzXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZVtrZXldID09PSAnb2JqZWN0Jykgb2JqQ2hpbGRyZW5bYCR7b2JqTmFtZX1fJHtrZXl9YF0gPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyhgJHtvYmpOYW1lfV8ke2tleX1gLCB7dmFsdWU6IG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWVba2V5XX0sIG5ld1NpbG9Ob2RlLCBydW5MaW5rZWRNb2RzKTtcbiAgICAgICAgZWxzZSBvYmpDaGlsZHJlbltgJHtvYmpOYW1lfV8ke2tleX1gXSA9IG5ldyBTaWxvTm9kZShgJHtvYmpOYW1lfV8ke2tleX1gLCBvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlW2tleV0sIG5ld1NpbG9Ob2RlKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHJ1bkxpbmtlZE1vZHMpIG5ld1NpbG9Ob2RlLmxpbmtNb2RpZmllcnMoKTtcblxuICAgIHJldHVybiBuZXdTaWxvTm9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcyBkZXZlbG9wZXIgd3JpdHRlbiBtb2RpZmllcnMgaW4gYXN5bmMgZnVuY3Rpb25zIHdpdGggc3RhdGUgcGFzc2VkIGluIGF1dG9tYXRpY2FsbHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vZGVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNpbG9Ob2RlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZU1vZGlmaWVycyAtIEFuIG9iamVjdCBjb250YWluaW5nIHVud3JhcHBlZCBtb2RpZmllcnMgbW9zdCBsaWtlbHkgZnJvbSB0aGUgY29uc3RydWN0b3JOb2RlXG4gICAqL1xuICBsaW5rTW9kaWZpZXJzKG5vZGVOYW1lID0gdGhpcy5uYW1lLCBzdGF0ZU1vZGlmaWVycyA9IHRoaXMubW9kaWZpZXJzKSB7XG4gICAgaWYgKCFzdGF0ZU1vZGlmaWVycyB8fCBPYmplY3Qua2V5cyhzdGF0ZU1vZGlmaWVycykubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgLy8gbG9vcGluZyB0aHJvdWdoIGV2ZXJ5IG1vZGlmaWVyIGFkZGVkIGJ5IHRoZSBkZXZcbiAgICBPYmplY3Qua2V5cyhzdGF0ZU1vZGlmaWVycykuZm9yRWFjaChtb2RpZmllcktleSA9PiB7XG4gICAgICBjb25zdCBtb2RpZmllciA9IHN0YXRlTW9kaWZpZXJzW21vZGlmaWVyS2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiBtb2RpZmllciAhPT0gJ2Z1bmN0aW9uJyApIHRocm93IG5ldyBUeXBlRXJyb3IoKTsgXG5cbiAgICAgIC8vIGFkZHMgbWlkZGxld2FyZSB0aGF0IHdpbGwgYWZmZWN0IHRoZSB2YWx1ZSBvZiB0aGlzIG5vZGVcbiAgICAgIGVsc2UgaWYgKG1vZGlmaWVyLmxlbmd0aCA8PSAyKSB7XG4gICAgICAgIC8vIHdyYXAgdGhlIGRldidzIG1vZGlmaWVyIGZ1bmN0aW9uIHNvIHdlIGNhbiBwYXNzIHRoZSBjdXJyZW50IG5vZGUgdmFsdWUgaW50byBpdFxuICAgICAgICBsZXQgbGlua2VkTW9kaWZpZXI7XG4gICAgICAgIGlmICh0aGF0LnR5cGUgPT09IHR5cGVzLlBSSU1JVElWRSkgbGlua2VkTW9kaWZpZXIgPSBhc3luYyAocGF5bG9hZCkgPT4gYXdhaXQgbW9kaWZpZXIodGhhdC52YWx1ZSwgcGF5bG9hZCk7XG4gICAgICAgIC8vIHRoYXQudmFsdWUgaXMgYW4gb2JqZWN0IGFuZCB3ZSBuZWVkIHRvIHJlYXNzZW1ibGUgaXRcbiAgICAgICAgZWxzZSBpZiAodGhhdC50eXBlID09PSB0eXBlcy5PQkpFQ1QgfHwgdGhhdC50eXBlID09PSB0eXBlcy5BUlJBWSkge1xuICAgICAgICAgIGxpbmtlZE1vZGlmaWVyID0gYXN5bmMgKHBheWxvYWQpID0+IGF3YWl0IG1vZGlmaWVyKHRoaXMucmVjb25zdHJ1Y3Qobm9kZU5hbWUsIHRoYXQpLCBwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgZGV2IHRyaWVzIHRvIGNhbGwgdGhlaXIgbW9kaWZpZXJcbiAgICAgICAgdGhpcy5tb2RpZmllcnNbbW9kaWZpZXJLZXldID0gcGF5bG9hZCA9PiB7XG4gICAgICAgICAgLy8gd3JhcCB0aGUgbGlua2VkTW9kaWZpZXIgYWdhaW4gc28gdGhhdCBpdCBjYW4gYmUgYWRkZWQgdG8gdGhlIGFzeW5jIHF1ZXVlIHdpdGhvdXQgYmVpbmcgaW52b2tlZFxuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXN5bmMgKCkgPT4gYXdhaXQgbGlua2VkTW9kaWZpZXIocGF5bG9hZCk7XG4gICAgICAgICAgdGhhdC5xdWV1ZS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICB0aGF0LnJ1blF1ZXVlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYWRkcyBtaWRkbGV3YXJlIHRoYXQgd2lsbCBhZmZlY3QgdGhlIHZhbHVlIG9mIGEgY2hpbGQgbm9kZSBvZiBpbmRleFxuICAgICAgZWxzZSBpZiAobW9kaWZpZXIubGVuZ3RoID4gMikge1xuICAgICAgICAvLyB3cmFwIHRoZSBkZXYncyBtb2RpZmllciBmdW5jdGlvbiBzbyB3ZSBjYW4gcGFzcyB0aGUgY3VycmVudCBub2RlIHZhbHVlIGludG8gaXRcbiAgICAgICAgY29uc3QgbGlua2VkTW9kaWZpZXIgPSBhc3luYyAoaW5kZXgsIHBheWxvYWQpID0+IGF3YWl0IG1vZGlmaWVyKHRoaXMucmVjb25zdHJ1Y3QoaW5kZXgsIHRoYXQudmFsdWVbaW5kZXhdKSwgaW5kZXgsIHBheWxvYWQpOyBcblxuICAgICAgICAvLyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBkZXYgdHJpZXMgdG8gY2FsbCB0aGVpciBtb2RpZmllclxuICAgICAgICB0aGlzLm1vZGlmaWVyc1ttb2RpZmllcktleV0gPSAoaW5kZXgsIHBheWxvYWQpID0+IHtcbiAgICAgICAgICAvLyB3cmFwIHRoZSBsaW5rZWRNb2RpZmllciBhZ2FpbiBzbyB0aGF0IGl0IGNhbiBiZSBhZGRlZCB0byB0aGUgYXN5bmMgcXVldWUgd2l0aG91dCBiZWluZyBpbnZva2VkXG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBhc3luYyAoKSA9PiBhd2FpdCBsaW5rZWRNb2RpZmllcihgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YCwgcGF5bG9hZCk7XG4gICAgICAgICAgdGhhdC52YWx1ZVtgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YF0ucXVldWUucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgdGhhdC52YWx1ZVtgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YF0ucnVuUXVldWUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogV3JhcHMgZGV2ZWxvcGVyIHdyaXR0ZW4gbW9kaWZpZXJzIGluIGFzeW5jIGZ1bmN0aW9ucyB3aXRoIHN0YXRlIHBhc3NlZCBpbiBhdXRvbWF0aWNhbGx5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBub2RlTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzaWxvTm9kZVxuICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGVNb2RpZmllcnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB1bndyYXBwZWQgbW9kaWZpZXJzIG1vc3QgbGlrZWx5IGZyb20gdGhlIGNvbnN0cnVjdG9yTm9kZVxuICAgKi9cbiAgcmVjb25zdHJ1Y3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpIHtcbiAgICBsZXQgcmVjb25zdHJ1Y3RlZE9iamVjdDtcbiAgICBpZiAoY3VyclNpbG9Ob2RlLnR5cGUgPT09IHR5cGVzLk9CSkVDVCkgcmVjb25zdHJ1Y3RlZE9iamVjdCA9IHRoaXMucmVjb25zdHJ1Y3RPYmplY3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpO1xuICAgIGVsc2UgaWYgKGN1cnJTaWxvTm9kZS50eXBlID09PSB0eXBlcy5BUlJBWSkgcmVjb25zdHJ1Y3RlZE9iamVjdCA9IHRoaXMucmVjb25zdHJ1Y3RBcnJheShzaWxvTm9kZU5hbWUsIGN1cnJTaWxvTm9kZSk7XG4gICAgZWxzZSByZXR1cm4gY3VyclNpbG9Ob2RlLnZhbHVlO1xuICAgIHJldHVybiByZWNvbnN0cnVjdGVkT2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBzIGRldmVsb3BlciB3cml0dGVuIG1vZGlmaWVycyBpbiBhc3luYyBmdW5jdGlvbnMgd2l0aCBzdGF0ZSBwYXNzZWQgaW4gYXV0b21hdGljYWxseVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2lsb05vZGVcbiAgICogQHBhcmFtIHtvYmplY3R9IHN0YXRlTW9kaWZpZXJzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdW53cmFwcGVkIG1vZGlmaWVycyBtb3N0IGxpa2VseSBmcm9tIHRoZSBjb25zdHJ1Y3Rvck5vZGVcbiAgICovXG4gIHJlY29uc3RydWN0T2JqZWN0KHNpbG9Ob2RlTmFtZSwgY3VyclNpbG9Ob2RlKSB7XG4gICAgY29uc3QgbmV3T2JqZWN0ID0ge307XG4gICAgLy8gbG9vcCB0aHJvdWdoIG9iamVjdCB2YWx1ZXMgY3VycmVudGx5IHN0b3JlZCBhcyBub2Rlc1xuICAgIE9iamVjdC5rZXlzKGN1cnJTaWxvTm9kZS52YWx1ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgY2hpbGRPYmogPSBjdXJyU2lsb05vZGUudmFsdWVba2V5XTtcbiAgICAgIFxuICAgICAgLy9nZXQga2V5TmFtZSBmcm9tIHRoZSBuYW1pbmcgY29udmVudGlvblxuICAgICAgY29uc3QgZXh0cmFjdGVkS2V5ID0ga2V5LnNsaWNlKHNpbG9Ob2RlTmFtZS5sZW5ndGggKyAxKTtcbiAgICAgIGlmIChjaGlsZE9iai50eXBlID09PSB0eXBlcy5PQkpFQ1QgfHwgY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuQVJSQVkpIHtcbiAgICAgICAgbmV3T2JqZWN0W2V4dHJhY3RlZEtleV0gPSB0aGlzLnJlY29uc3RydWN0KGtleSwgY2hpbGRPYmopO1xuICAgICAgfSBlbHNlIGlmIChjaGlsZE9iai50eXBlID09PSB0eXBlcy5QUklNSVRJVkUpIHtcbiAgICAgICAgbmV3T2JqZWN0W2V4dHJhY3RlZEtleV0gPSBjaGlsZE9iai52YWx1ZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHMgZGV2ZWxvcGVyIHdyaXR0ZW4gbW9kaWZpZXJzIGluIGFzeW5jIGZ1bmN0aW9ucyB3aXRoIHN0YXRlIHBhc3NlZCBpbiBhdXRvbWF0aWNhbGx5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBub2RlTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzaWxvTm9kZVxuICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGVNb2RpZmllcnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB1bndyYXBwZWQgbW9kaWZpZXJzIG1vc3QgbGlrZWx5IGZyb20gdGhlIGNvbnN0cnVjdG9yTm9kZVxuICAgKi9cbiAgcmVjb25zdHJ1Y3RBcnJheShzaWxvTm9kZU5hbWUsIGN1cnJTaWxvTm9kZSkge1xuICAgIGNvbnN0IG5ld0FycmF5ID0gW107XG4gICAgLy8gbG9vcCB0aHJvdWdoIGFycmF5IGluZGljZXMgY3VycmVudGx5IHN0b3JlZCBhcyBub2Rlc1xuICAgIE9iamVjdC5rZXlzKGN1cnJTaWxvTm9kZS52YWx1ZSkuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCBjaGlsZE9iaiA9IGN1cnJTaWxvTm9kZS52YWx1ZVtrZXldO1xuICAgICAgaWYgKGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLkFSUkFZIHx8IGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLk9CSkVDVCkge1xuICAgICAgICBuZXdBcnJheS5wdXNoKHRoaXMucmVjb25zdHJ1Y3QoYCR7c2lsb05vZGVOYW1lfV8ke2l9YCwgY2hpbGRPYmopKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSB7XG4gICAgICAgIG5ld0FycmF5LnB1c2goY2hpbGRPYmoudmFsdWUpO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgZ2V0U3RhdGUoKSB7XG4gICAgY29uc3Qgc3RhdGUgPSB7fTtcbiAgICAvLyBjYWxsIGdldFN0YXRlIG9uIHBhcmVudCBub2RlcyB1cCB0aWxsIHJvb3QgYW5kIGNvbGxlY3QgYWxsIHZhcmlhYmxlcy9tb2RpZmllcnMgZnJvbSBwYXJlbnRzXG4gICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBwYXJlbnRTdGF0ZSA9IHRoaXMucGFyZW50LmdldFN0YXRlKCk7XG4gICAgICBPYmplY3Qua2V5cyhwYXJlbnRTdGF0ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBzdGF0ZVtrZXldID0gcGFyZW50U3RhdGVba2V5XTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gZ2V0dGluZyBjaGlsZHJlbiBvZiBvYmplY3RzL2FyYXlzIGlzIHJlZHVuZGFudFxuICAgIGlmICh0aGlzLnR5cGUgIT09IHR5cGVzLkFSUkFZICYmIHRoaXMudHlwZSAhPT0gdHlwZXMuT0JKRUNUKVxuICAgICAgT2JqZWN0LmtleXModGhpcy52YWx1ZSkuZm9yRWFjaChzaWxvTm9kZU5hbWUgPT4ge1xuICAgICAgICBjb25zdCBjdXJyU2lsb05vZGUgPSB0aGlzLnZhbHVlW3NpbG9Ob2RlTmFtZV07XG4gICAgICAgIGlmIChjdXJyU2lsb05vZGUudHlwZSA9PT0gdHlwZXMuT0JKRUNUIHx8IGN1cnJTaWxvTm9kZS50eXBlID09PSB0eXBlcy5BUlJBWSkgc3RhdGVbc2lsb05vZGVOYW1lXSA9IHRoaXMucmVjb25zdHJ1Y3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpO1xuICAgICAgICBlbHNlIGlmIChjdXJyU2lsb05vZGUudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSBzdGF0ZVtzaWxvTm9kZU5hbWVdID0gY3VyclNpbG9Ob2RlLnZhbHVlO1xuXG4gICAgICAgIC8vIHNvbWUgc2lsb05vZGVzIGRvbid0IGhhdmUgbW9kaWZpZXJzXG4gICAgICAgIGlmIChjdXJyU2lsb05vZGUubW9kaWZpZXJzKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoY3VyclNpbG9Ob2RlLm1vZGlmaWVycykuZm9yRWFjaChtb2RpZmllciA9PiB7XG4gICAgICAgICAgICBzdGF0ZVttb2RpZmllcl0gPSBjdXJyU2lsb05vZGUubW9kaWZpZXJzW21vZGlmaWVyXTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbG9Ob2RlO1xuLy8gbW9kdWxlLmV4cG9ydHMgPSBTaWxvTm9kZTsiLCIvLyBpbXBvcnQgc3RhdGUgY2xhc3MgZm9yIGluc3RhbmNlb2YgY2hlY2tcbi8vIGNvbnN0IENvbnN0cnVjdG9yTm9kZSA9IHJlcXVpcmUoJy4vY29uc3RydWN0b3JOb2RlLmpzJyk7XG4vLyBjb25zdCBTaWxvTm9kZSA9IHJlcXVpcmUoJy4vc2lsb05vZGUuanMnKTtcbi8vIGNvbnN0IHR5cGVzID0gcmVxdWlyZSgnLi9jb25zdGFudHMuanMnKTtcblxuLy8gaW1wb3J0IHN0YXRlIGNsYXNzIGZvciBpbnN0YW5jZW9mIGNoZWNrXG5pbXBvcnQgQ29uc3RydWN0b3JOb2RlIGZyb20gJy4vY29uc3RydWN0b3JOb2RlLmpzJztcbmltcG9ydCBTaWxvTm9kZSBmcm9tICcuL3NpbG9Ob2RlLmpzJztcbmltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4vY29uc3RhbnRzLmpzJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT0+IFNJTE8gVEVTVElORyA8PT09PT09PT09PT09PT09PT09PSBcXFxcXG5cbi8vIGNvbnN0IEFwcFN0YXRlID0gbmV3IENvbnN0cnVjdG9yTm9kZSgnQXBwU3RhdGUnKTtcblxuLy8gQXBwU3RhdGUuaW5pdGlhbGl6ZVN0YXRlKHtcbi8vICAgbmFtZTogJ0hhbicsXG4vLyAgIGFnZTogMjVcbi8vIH0pXG5cbi8vIEFwcFN0YXRlLmluaXRpYWxpemVNb2RpZmllcnMoe1xuLy8gICBhZ2U6IHtcbi8vICAgICBpbmNyZW1lbnRBZ2U6IChjdXJyZW50LCBwYXlsb2FkKSA9PiB7XG4vLyAgICAgICByZXR1cm4gY3VycmVudCArIHBheWxvYWQ7XG4vLyAgICAgfVxuLy8gICB9XG4vLyB9KTtcblxuLy8gY29uc3QgTmF2U3RhdGUgPSBuZXcgQ29uc3RydWN0b3JOb2RlKCdOYXZTdGF0ZScsICdBcHBTdGF0ZScpO1xuXG4vLyBOYXZTdGF0ZS5pbml0aWFsaXplU3RhdGUoe1xuLy8gICBuYW1lOiAnSGFuJyxcbi8vICAgY2FydDoge29uZTogMSwgYXJyYXk6IFsxLDIsMywge3Rlc3Q6ICd0ZXN0J31dfVxuLy8gICAvLyBjYXJ0OiBbe3R3bzogMiwgdGhyZWU6IFsxLDIsM119LCA1LCAxMF1cbi8vIH0pXG5cbi8vIE5hdlN0YXRlLmluaXRpYWxpemVNb2RpZmllcnMoe1xuLy8gICBjYXJ0OiB7XG4vLyAgICAgdXBkYXRlQ2FydEl0ZW06IChjdXJyZW50LCBpbmRleCwgcGF5bG9hZCkgPT4ge1xuLy8gICAgICAgcmV0dXJuICsrY3VycmVudDtcbi8vICAgICB9LFxuLy8gICAgIGFkZEl0ZW06IChjdXJyZW50LCBwYXlsb2FkKSA9PiB7XG4vLyAgICAgICBjdXJyZW50Lm5ld1RoaW5nID0gJ0EgbmV3IHRoaW5nJztcbi8vICAgICAgIC8vIGN1cnJlbnQucHVzaChwYXlsb2FkKTtcbi8vICAgICAgIHJldHVybiBjdXJyZW50O1xuLy8gICAgIH1cbi8vICAgfVxuLy8gfSk7XG5cbi8vIGNvbnN0IEJ1dHRTdGF0ZSA9IG5ldyBDb25zdHJ1Y3Rvck5vZGUoJ0J1dHRTdGF0ZScpO1xuLy8gQnV0dFN0YXRlLnBhcmVudCA9ICdOYXZTdGF0ZSc7XG5cbi8vIEJ1dHRTdGF0ZS5pbml0aWFsaXplU3RhdGUoe1xuLy8gICBidXR0OiAnQnV0dCdcbi8vIH0pXG5cbi8vPT09PT09PT09PT09PT09PT09PiBTSUxPIFRFU1RJTkcgRU5ERUQgPD09PT09PT09PT09PT09PT09PT1cXFxcXG5cbmNvbnN0IHNpbG8gPSB7fTtcblxuLyoqXG4gKiBUYWtlcyBhbGwgb2YgdGhlIGNvbnN0cnVjdG9yTm9kZXMgY3JlYXRlZCBieSB0aGUgZGV2ZWxvcGVyXG4gKiBAcGFyYW0gIHsuLi5Db25zdHJ1Y3Rvck5vZGV9IGFyZ3MgLSBBIGxpc3Qgb2YgY29uc3RydWN0b3IgTm9kZXNcbiAqL1xuXG5mdW5jdGlvbiBjb21iaW5lTm9kZXMoLi4uYXJncykge1xuICBpZiAoYXJncy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignY29tYmluZU5vZGVzIGZ1bmN0aW9uIHRha2VzIGF0IGxlYXN0IG9uZSBjb25zdHJ1Y3Rvck5vZGUnKTtcblxuICAvLyBoYXN0YWJsZSBhY2NvdW50cyBmb3IgcGFzc2luZyBpbiBjb25zdHJ1Y3Rvck5vZGVzIGluIGFueSBvcmRlci4gXG4gIC8vIGhhc2h0YWJsZSBvcmdhbml6ZXMgYWxsIG5vZGVzIGludG8gcGFyZW50LWNoaWxkIHJlbGF0aW9uc2hpcHNcbiAgY29uc3QgaGFzaFRhYmxlID0ge307XG4gIGFyZ3MuZm9yRWFjaChjb25zdHJ1Y3Rvck5vZGUgPT4ge1xuICAgIGlmICghY29uc3RydWN0b3JOb2RlIHx8IGNvbnN0cnVjdG9yTm9kZS5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnQ29uc3RydWN0b3JOb2RlJykgdGhyb3cgbmV3IEVycm9yKCdPbmx5IGNvbnN0cnVjdG9yTm9kZXMgY2FuIGJlIHBhc3NlZCB0byBjb21iaW5lTm9kZXMnKTtcbiAgICBlbHNlIGlmIChjb25zdHJ1Y3Rvck5vZGUucGFyZW50ID09PSBudWxsKSB7XG4gICAgICAvLyB0aGlzIGlzIHRoZSByb290IG5vZGUsIG9ubHkgb25lIGNvbnN0cnVjdG9yTm9kZSBjYW4gaGF2ZSBhIHBhcmVudCBvZiBudWxsXG4gICAgICBpZiAoIWhhc2hUYWJsZS5yb290KSBoYXNoVGFibGUucm9vdCA9IFtjb25zdHJ1Y3Rvck5vZGVdO1xuICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb25lIGNvbnN0cnVjdG9yIG5vZGUgY2FuIGhhdmUgbnVsbCBwYXJlbnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFoYXNoVGFibGVbY29uc3RydWN0b3JOb2RlLnBhcmVudF0pIGhhc2hUYWJsZVtjb25zdHJ1Y3Rvck5vZGUucGFyZW50XSA9IFtjb25zdHJ1Y3Rvck5vZGVdO1xuICAgICAgLy8gaWYgcGFyZW50IGFscmVhZHkgZXhpc3RzLCBhbmQgbm9kZSBiZWluZyBhZGRlZCB3aWxsIGFwcGVuZCB0byB0aGUgYXJyYXkgb2YgY2hpbGRyZW5cbiAgICAgIGVsc2UgaGFzaFRhYmxlW2NvbnN0cnVjdG9yTm9kZS5wYXJlbnRdLnB1c2goY29uc3RydWN0b3JOb2RlKTtcbiAgICB9XG4gIH0pIFxuXG4gIC8vIGVuc3VyZSB0aGVyZSBpcyBhIGRlZmluZWQgcm9vdFxuICBpZiAoIWhhc2hUYWJsZS5yb290KSB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IG9uZSBjb25zdHJ1Y3RvciBub2RlIG11c3QgaGF2ZSBhIG51bGwgcGFyZW50Jyk7XG5cbiAgLy8gcmVjdXJzaXZlIGZ1bmN0aW9uIHRoYXQgd2lsbCBjcmVhdGUgc2lsb05vZGVzIGFuZCByZXR1cm4gdGhlbSB0byBhIHBhcmVudFxuICBmdW5jdGlvbiBtYXBUb1NpbG8oY29uc3RydWN0b3JOb2RlID0gJ3Jvb3QnLCBwYXJlbnRDb25zdHJ1Y3Rvck5vZGUgPSBudWxsKSB7XG4gICAgY29uc3QgY29uc3RydWN0b3JOb2RlTmFtZSA9IChjb25zdHJ1Y3Rvck5vZGUgPT09ICdyb290JykgPyAncm9vdCcgOiBjb25zdHJ1Y3Rvck5vZGUubmFtZTtcblxuICAgIC8vIHJlY3Vyc2l2ZSBiYXNlIGNhc2UsIHdlIG9ubHkgY29udGludWUgaWYgdGhlIGNvbnN0cnVjdG9yTm9kZSBoYXMgY29uc3RydWN0b3JOb2RlIGNoaWxkcmVuXG4gICAgaWYgKCFoYXNoVGFibGVbY29uc3RydWN0b3JOb2RlTmFtZV0pIHJldHVybjtcblxuICAgIGNvbnN0IGNoaWxkcmVuID0ge307XG5cbiAgICAvLyBsb29wIHRocm91Z2ggdGhlIGNoaWxkcmVuIG9mIGNvbnN0cnVjdG9yTm9kZVxuICAgIGhhc2hUYWJsZVtjb25zdHJ1Y3Rvck5vZGVOYW1lXS5mb3JFYWNoKGN1cnJDb25zdHJ1Y3Rvck5vZGUgPT4ge1xuICAgICAgY29uc3QgdmFsdWVzT2ZDdXJyU2lsb05vZGUgPSB7fTtcbiAgICAgIGNoaWxkcmVuW2N1cnJDb25zdHJ1Y3Rvck5vZGUubmFtZV0gPSBuZXcgU2lsb05vZGUoY3VyckNvbnN0cnVjdG9yTm9kZS5uYW1lLCB2YWx1ZXNPZkN1cnJTaWxvTm9kZSwgcGFyZW50Q29uc3RydWN0b3JOb2RlLCB7fSwgdHlwZXMuQ09OVEFJTkVSKTtcbiAgICAgIFxuICAgICAgLy8gYWJzdHJhY3Qgc29tZSB2YXJpYWJsZXNcbiAgICAgIGNvbnN0IGN1cnJTaWxvTm9kZSA9IGNoaWxkcmVuW2N1cnJDb25zdHJ1Y3Rvck5vZGUubmFtZV07XG4gICAgICBjb25zdCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSA9IGN1cnJDb25zdHJ1Y3Rvck5vZGUuc3RhdGU7XG5cbiAgICAgIC8vIGNyZWF0ZSBTaWxvTm9kZXMgZm9yIGFsbCB0aGUgdmFyaWFibGVzIGluIHRoZSBjdXJyQ29uc3RydWN0b3JOb2RlXG4gICAgICBPYmplY3Qua2V5cyhzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSkuZm9yRWFjaCh2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlID0+IHtcbiAgICAgICAgLy8gY3JlYXRlcyBzaWxvTm9kZXMgZm9yIG9iamVjdCB2YXJpYWJsZXNcbiAgICAgICAgaWYgKHR5cGVvZiBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXS52YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB2YWx1ZXNPZkN1cnJTaWxvTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXSA9IGN1cnJTaWxvTm9kZS5kZWNvbnN0cnVjdE9iamVjdEludG9TaWxvTm9kZXModmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZSwgc3RhdGVPZkN1cnJDb25zdHJ1Y3Rvck5vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0sIGN1cnJTaWxvTm9kZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY3JlYXRlcyBzaWxvTm9kZXMgZm9yIHByaW1pdGl2ZSB2YXJpYWJsZXNcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFsdWVzT2ZDdXJyU2lsb05vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0gPSBuZXcgU2lsb05vZGUodmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZSwgc3RhdGVPZkN1cnJDb25zdHJ1Y3Rvck5vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0udmFsdWUsIGN1cnJTaWxvTm9kZSwgc3RhdGVPZkN1cnJDb25zdHJ1Y3Rvck5vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0ubW9kaWZpZXJzKTtcbiAgICAgICAgICB2YWx1ZXNPZkN1cnJTaWxvTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXS5saW5rTW9kaWZpZXJzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIHJlY3Vyc2l2ZWx5IGNoZWNrIHRvIHNlZSBpZiB0aGUgY3VycmVudCBjb25zdHJ1Y3Rvck5vZGUvc2lsb05vZGUgaGFzIGFueSBjaGlsZHJlbiBcbiAgICAgIGNvbnN0IHNpbG9Ob2RlQ2hpbGRyZW4gPSBtYXBUb1NpbG8oY3VyckNvbnN0cnVjdG9yTm9kZSwgY3VyclNpbG9Ob2RlKTtcbiAgICAgIGlmIChzaWxvTm9kZUNoaWxkcmVuKSB7IFxuICAgICAgICBPYmplY3Qua2V5cyhzaWxvTm9kZUNoaWxkcmVuKS5mb3JFYWNoKHNpbG9Ob2RlID0+IHtcbiAgICAgICAgICB2YWx1ZXNPZkN1cnJTaWxvTm9kZVtzaWxvTm9kZV0gPSBzaWxvTm9kZUNoaWxkcmVuW3NpbG9Ob2RlXTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIC8vIHJvb3RTdGF0ZVxuICBjb25zdCB3cmFwcGVkUm9vdFNpbG9Ob2RlID0gbWFwVG9TaWxvKCk7XG5cbiAgLy8gd2lsbCBhbHdheXMgb25seSBiZSBhIHNpbmdsZSBrZXkgKHRoZSByb290KSB0aGF0IGlzIGFkZGVkIGludG8gdGhlIHNpbG9cbiAgT2JqZWN0LmtleXMod3JhcHBlZFJvb3RTaWxvTm9kZSkuZm9yRWFjaChyb290U2lsb05vZGUgPT4ge1xuICAgIHNpbG9bcm9vdFNpbG9Ob2RlXSA9IHdyYXBwZWRSb290U2lsb05vZGVbcm9vdFNpbG9Ob2RlXTtcbiAgfSk7XG4gIFxuICBmb3JFYWNoU2lsb05vZGUobm9kZSA9PiB7XG4gICAgLy8gYXBwbHkga2V5U3Vic2NyaWJlIG9ubHkgdG8gb2JqZWN0IGFuZCBhcnJheSBzaWxvIG5vZGVzXG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ09CSkVDVCcgfHwgbm9kZS50eXBlID09PSBcIkFSUkFZXCIpIHtcbiAgICAgIG5vZGUubW9kaWZpZXJzLmtleVN1YnNjcmliZSA9IChrZXksIHJlbmRlckZ1bmMpID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5vZGUubmFtZSArIFwiX1wiICsga2V5O1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVkQXRJbmRleCA9IG5vZGUudmFsdWVbbmFtZV0ucHVzaFRvU3Vic2NyaWJlcnMocmVuZGVyRnVuYyk7XG4gICAgICAgIG5vZGUudmFsdWVbbmFtZV0ubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtub2RlLnJlbW92ZUZyb21TdWJzY3JpYmVyc0F0SW5kZXgoc3Vic2NyaWJlZEF0SW5kZXgpfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHNpbG87XG59XG5cbi8qKlxuICogQXBwbGllcyB0aGUgY2FsbGJhY2sgdG8gZXZlcnkgc2lsb05vZGUgaW4gdGhlIHNpbG9cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYSBzaWxvTm9kZSBhcyBpdHMgcGFyYW1ldGVyXG4gKi9cblxuLy8gY2FsbGJhY2tzIGhhdmUgdG8gYWNjZXB0IGEgU0lMT05PREVcbmZ1bmN0aW9uIGZvckVhY2hTaWxvTm9kZShjYWxsYmFjaykge1xuICAvLyBhY2Nlc3NpbmcgdGhlIHNpbmdsZSByb290IGluIHRoZSBzaWxvXG4gIE9iamVjdC5rZXlzKHNpbG8pLmZvckVhY2goc2lsb05vZGVSb290S2V5ID0+IHtcbiAgICBpbm5lcihzaWxvW3NpbG9Ob2RlUm9vdEtleV0sIGNhbGxiYWNrKTtcbiAgfSlcblxuICAvLyByZWN1cnNpdmVseSBuYXZpZ2F0ZSB0byBldmVyeSBzaWxvTm9kZVxuICBmdW5jdGlvbiBpbm5lcihoZWFkLCBjYWxsYmFjaykge1xuICAgIGlmIChoZWFkLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdTaWxvTm9kZScpIHtcbiAgICAgIGNhbGxiYWNrKGhlYWQpO1xuICAgICAgaWYgKGhlYWQudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSByZXR1cm47IC8vIHJlY3Vyc2l2ZSBiYXNlIGNhc2VcbiAgICAgIFxuICAgICAgZWxzZSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWQudmFsdWUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBpZiAoaGVhZC52YWx1ZVtrZXldLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdTaWxvTm9kZScpIHtcbiAgICAgICAgICAgIGlubmVyKGhlYWQudmFsdWVba2V5XSwgY2FsbGJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gY29tYmluZU5vZGVzKEJ1dHRTdGF0ZSwgTmF2U3RhdGUsIEFwcFN0YXRlKTsgLy8gdGVzdGluZyBwdXJwb3Nlc1xuLy8gLy8gY29tYmluZU5vZGVzKEFwcFN0YXRlLCBOYXZTdGF0ZSk7IC8vIHRlc3RpbmcgcHVycG9zZXNcblxuLy8gc2V0VGltZW91dCgoKSA9PiB7Y29uc29sZS5sb2coJ2RlbGF5Jywgc2lsby5BcHBTdGF0ZS52YWx1ZS5OYXZTdGF0ZS5nZXRTdGF0ZSgpKX0sIDEwMDApO1xuLy8gc2V0VGltZW91dCgoKSA9PiB7Y29uc29sZS5sb2coJ0ltIGFkZGluZyBhZ2FpbicsIHNpbG8uQXBwU3RhdGUudmFsdWUuTmF2U3RhdGUuZ2V0U3RhdGUoKS5hZGRJdGVtKHtzaXg6IDZ9KSl9LCAxMDAxKTtcbi8vIHNldFRpbWVvdXQoKCkgPT4ge2NvbnNvbGUubG9nKCdkZWxheScsIHNpbG8uQXBwU3RhdGUudmFsdWUuTmF2U3RhdGUuZ2V0U3RhdGUoKSl9LCAxMDEwKTtcblxuXG4vLyA9PT09PT09PT09PiBURVNUUyB0aGF0IGNhbGxpbmcgYSBwYXJlbnQgZnVuY3Rpb24gd2lsbCBtb2RpZnkgaXRzIGNoaWxkIGZvciBuZXN0ZWQgb2JqZWN0cyA8PT09PT09PT09PSBcXFxcXG5cbi8vIGNvbnNvbGUubG9nKHNpbG8uQXBwU3RhdGUudmFsdWUuY2FydC52YWx1ZS5jYXJ0X29uZS52YWx1ZSk7XG4vLyBzaWxvLkFwcFN0YXRlLnZhbHVlLmNhcnQubW9kaWZpZXJzLmluY3JlbWVudCgnY2FydF9vbmUnKTtcbi8vIHNldFRpbWVvdXQoKCkgPT4ge1xuLy8gICBjb25zb2xlLmxvZyhzaWxvLkFwcFN0YXRlLnZhbHVlLmNhcnQudmFsdWUuY2FydF9vbmUudmFsdWUpO1xuLy8gfSwgMTAwMCk7XG5cbi8vID09PT09PT09PT0+IEVORCBURVNUUyB0aGF0IGNhbGxpbmcgYSBwYXJlbnQgZnVuY3Rpb24gd2lsbCBtb2RpZnkgaXRzIGNoaWxkIGZvciBuZXN0ZWQgb2JqZWN0cyA8PT09PT09PT09PSBcXFxcXG5cbi8qKlxuICogU3Vic2NyaWJlcyBjb21wb25lbnRzIHRvIHNpbG9Ob2RlcyBpbiB0aGUgc2lsb1xuICogQHBhcmFtICB7ZnVuY3Rpb259IHJlbmRlckZ1bmN0aW9uIC0gRnVuY3Rpb24gdG8gYmUgYXBwZW5kZWQgdG8gc3Vic2NyaWJlcnMgYXJyYXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcmVsZXZhbnQgY29tcG9uZW50IHdpdGggJ1N0YXRlJyBhcHBlbmRlZFxuICovXG5cbnNpbG8uc3Vic2NyaWJlID0gKHJlbmRlckZ1bmN0aW9uLCBuYW1lKSA9PiB7XG4gIGlmICghbmFtZSkge1xuICAgIGlmICghIXJlbmRlckZ1bmN0aW9uLnByb3RvdHlwZSkge1xuICAgICAgbmFtZSA9IHJlbmRlckZ1bmN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lICsgJ1N0YXRlJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuXFwndCB1c2UgYW4gYW5vbnltb3VzIGZ1bmN0aW9uIGluIHN1YnNjcmliZSB3aXRob3V0IGEgbmFtZSBhcmd1bWVudC4nKTtcbiAgICB9XG4gIH1cblxuICBsZXQgZm91bmROb2RlO1xuICBsZXQgc3Vic2NyaWJlZEF0SW5kZXg7XG4gIGNvbnN0IGZvdW5kTm9kZUNoaWxkcmVuID0gW107XG5cbiAgZm9yRWFjaFNpbG9Ob2RlKG5vZGUgPT4ge1xuICAgIGlmKG5vZGUubmFtZSA9PT0gbmFtZSl7XG4gICAgICBzdWJzY3JpYmVkQXRJbmRleCA9IG5vZGUucHVzaFRvU3Vic2NyaWJlcnMocmVuZGVyRnVuY3Rpb24pXG4gICAgICBmb3VuZE5vZGUgPSBub2RlXG4gICAgICBmb3VuZE5vZGVDaGlsZHJlbi5wdXNoKHtub2RlOiBmb3VuZE5vZGUsIGluZGV4OiBzdWJzY3JpYmVkQXRJbmRleH0pO1xuICAgIH1cbiAgfSlcblxuICBmdW5jdGlvbiB1bnN1YnNjcmliZSgpIHtcbiAgICBsZXQgb2I7XG4gICAgT2JqZWN0LmtleXMoZm91bmROb2RlQ2hpbGRyZW4pLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIG9iID0gZm91bmROb2RlQ2hpbGRyZW5ba2V5XTsgXG4gICAgICBvYi5ub2RlLnJlbW92ZUZyb21TdWJzY3JpYmVyc0F0SW5kZXgob2IuaW5kZXgpXG4gICAgfSlcbiAgfVxuICBcbiAgaWYgKCEhZm91bmROb2RlKSB7XG4gICAgcmVuZGVyRnVuY3Rpb24oZm91bmROb2RlLmdldFN0YXRlKCkpXG4gICAgaWYgKGZvdW5kTm9kZS52YWx1ZSkge1xuICAgICAgT2JqZWN0LmtleXMoZm91bmROb2RlLnZhbHVlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGxldCBub2RlID0gZm91bmROb2RlLnZhbHVlW2tleV07XG4gICAgICAgIGlmKG5vZGUudHlwZSAhPT0gJ0NPTlRBSU5FUicpe1xuICAgICAgICAgIHN1YnNjcmliZWRBdEluZGV4ID0gbm9kZS5wdXNoVG9TdWJzY3JpYmVycyhyZW5kZXJGdW5jdGlvbik7XG4gICAgICAgICAgZm91bmROb2RlQ2hpbGRyZW4ucHVzaCh7bm9kZTogbm9kZSwgaW5kZXg6IHN1YnNjcmliZWRBdEluZGV4fSk7XG4gIFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKG5ldyBFcnJvcignWW91IGFyZSB0cnlpbmcgdG8gc3Vic2NyaWJlIHRvIHNvbWV0aGluZyB0aGF0IGlzblxcJ3QgaW4gdGhlIHNpbG8uJykpO1xuICB9XG5cbiAgcmV0dXJuIHVuc3Vic2NyaWJlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb21iaW5lTm9kZXM7XG4vLyBtb2R1bGUuZXhwb3J0cyA9IGNvbWJpbmVOb2RlczsiLCJpbXBvcnQgY29tYmluZU5vZGVzIGZyb20gJy4vcmFkb24vY29tYmluZU5vZGVzJztcbmltcG9ydCBjb25zdHJ1Y3Rvck5vZGUgZnJvbSAnLi9yYWRvbi9jb25zdHJ1Y3Rvck5vZGUnO1xuXG5leHBvcnQgY29uc3QgY29tYmluZVN0YXRlID0gY29tYmluZU5vZGVzO1xuZXhwb3J0IGNvbnN0IFN0YXRlID0gY29uc3RydWN0b3JOb2RlOyJdLCJuYW1lcyI6WyJDb25zdHJ1Y3Rvck5vZGUiLCJuYW1lIiwicGFyZW50TmFtZSIsInN0YXRlIiwicGFyZW50IiwiaW5pdGlhbGl6ZVN0YXRlIiwiYmluZCIsImluaXRpYWxpemVNb2RpZmllcnMiLCJpbml0aWFsU3RhdGUiLCJBcnJheSIsImlzQXJyYXkiLCJFcnJvciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwibmV3VmFyaWFibGVJblN0YXRlIiwidmFsdWUiLCJtb2RpZmllcnMiLCJpbml0aWFsTW9kaWZpZXJzIiwibmV3TW9kaWZpZXJzSW5TdGF0ZSIsIl9uYW1lIiwiX3BhcmVudCIsIl9zdGF0ZSIsIkFSUkFZIiwiT0JKRUNUIiwiUFJJTUlUSVZFIiwiQ09OVEFJTkVSIiwiU2lsb05vZGUiLCJ0eXBlIiwidHlwZXMiLCJxdWV1ZSIsInN1YnNjcmliZXJzIiwibGlua01vZGlmaWVycyIsInJ1bk1vZGlmaWVycyIsIm5vdGlmeVN1YnNjcmliZXJzIiwiZ2V0U3RhdGUiLCJyZWNvbnN0cnVjdEFycmF5IiwicmVjb25zdHJ1Y3RPYmplY3QiLCJkZWNvbnN0cnVjdE9iamVjdEludG9TaWxvTm9kZXMiLCJyZWNvbnN0cnVjdCIsInJ1blF1ZXVlIiwicmVuZGVyRnVuY3Rpb24iLCJwdXNoIiwiaW5kZXgiLCJzdWJjcmliZXJzIiwic2xpY2UiLCJsZW5ndGgiLCJmdW5jIiwicnVubmluZyIsInJ1biIsInNoaWZ0Iiwib2JqTmFtZSIsIm9iamVjdFRvRGVjb25zdHJ1Y3QiLCJydW5MaW5rZWRNb2RzIiwib2JqQ2hpbGRyZW4iLCJuZXdTaWxvTm9kZSIsImluZGV4ZWRWYWwiLCJpIiwia2V5Iiwibm9kZU5hbWUiLCJzdGF0ZU1vZGlmaWVycyIsInRoYXQiLCJtb2RpZmllcktleSIsIm1vZGlmaWVyIiwiVHlwZUVycm9yIiwibGlua2VkTW9kaWZpZXIiLCJwYXlsb2FkIiwiY2FsbGJhY2siLCJzaWxvTm9kZU5hbWUiLCJjdXJyU2lsb05vZGUiLCJyZWNvbnN0cnVjdGVkT2JqZWN0IiwibmV3T2JqZWN0IiwiY2hpbGRPYmoiLCJleHRyYWN0ZWRLZXkiLCJuZXdBcnJheSIsInBhcmVudFN0YXRlIiwiX3ZhbHVlIiwiX21vZGlmaWVycyIsIl9xdWV1ZSIsImNvbnN0cnVjdG9yIiwiX3N1YnNjcmliZXJzIiwiX3R5cGUiLCJzaWxvIiwiY29tYmluZU5vZGVzIiwiYXJncyIsImhhc2hUYWJsZSIsImNvbnN0cnVjdG9yTm9kZSIsInJvb3QiLCJtYXBUb1NpbG8iLCJwYXJlbnRDb25zdHJ1Y3Rvck5vZGUiLCJjb25zdHJ1Y3Rvck5vZGVOYW1lIiwiY2hpbGRyZW4iLCJjdXJyQ29uc3RydWN0b3JOb2RlIiwidmFsdWVzT2ZDdXJyU2lsb05vZGUiLCJzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSIsInZhckluQ29uc3RydWN0b3JOb2RlU3RhdGUiLCJzaWxvTm9kZUNoaWxkcmVuIiwic2lsb05vZGUiLCJ3cmFwcGVkUm9vdFNpbG9Ob2RlIiwicm9vdFNpbG9Ob2RlIiwiZm9yRWFjaFNpbG9Ob2RlIiwibm9kZSIsImtleVN1YnNjcmliZSIsInJlbmRlckZ1bmMiLCJzdWJzY3JpYmVkQXRJbmRleCIsInB1c2hUb1N1YnNjcmliZXJzIiwicmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleCIsInNpbG9Ob2RlUm9vdEtleSIsImlubmVyIiwiaGVhZCIsInN1YnNjcmliZSIsInByb3RvdHlwZSIsImZvdW5kTm9kZSIsImZvdW5kTm9kZUNoaWxkcmVuIiwidW5zdWJzY3JpYmUiLCJvYiIsImNvbnNv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
