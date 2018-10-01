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

var ARRAY = 'ARRAY';
var OBJECT = 'OBJECT';
var PRIMITIVE = 'PRIMITIVE';
var CONTAINER = 'CONTAINER';

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
}
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

var combineState = combineNodes;
var StateNode = ConstructorNode;

exports.combineState = combineState;
exports.StateNode = StateNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9yYWRvbi9jb25zdHJ1Y3Rvck5vZGUuanMiLCIuLi9yYWRvbi9jb25zdGFudHMuanMiLCIuLi9yYWRvbi9zaWxvTm9kZS5qcyIsIi4uL3JhZG9uL2NvbWJpbmVOb2Rlcy5qcyIsIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNsYXNzIENvbnN0cnVjdG9yTm9kZSB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIHBhcmVudE5hbWUgPSBudWxsKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTsgXG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50TmFtZTtcbiAgICBcbiAgICB0aGlzLmluaXRpYWxpemVTdGF0ZSA9IHRoaXMuaW5pdGlhbGl6ZVN0YXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pbml0aWFsaXplTW9kaWZpZXJzID0gdGhpcy5pbml0aWFsaXplTW9kaWZpZXJzLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB2YXJpYWJsZXMgdG8gdGhlIHN0YXRlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpbml0aWFsU3RhdGUgLSBBbiBvYmplY3Qgd2l0aCBrZXlzIGFzIHZhcmlhYmxlIG5hbWVzIGFuZCB2YWx1ZXMgb2YgZGF0YVxuICAgKi9cblxuICBpbml0aWFsaXplU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gICAgLy8gbWFrZSBzdXJlIHRoYXQgdGhlIGlucHV0IGlzIGFuIG9iamVjdFxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFN0YXRlICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KGluaXRpYWxTdGF0ZSkpIHRocm93IG5ldyBFcnJvcignSW5wdXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAvLyBsb29wIHRocm91Z2ggdGhlIHN0YXRlIHZhcmlhYmxlc1xuICAgIE9iamVjdC5rZXlzKGluaXRpYWxTdGF0ZSkuZm9yRWFjaChuZXdWYXJpYWJsZUluU3RhdGUgPT4ge1xuICAgICAgdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdID0ge1xuICAgICAgICB2YWx1ZTogaW5pdGlhbFN0YXRlW25ld1ZhcmlhYmxlSW5TdGF0ZV0sXG4gICAgICAgIC8vYWNjb3VudHMgZm9yIGl0aWFsaXplTW9kaWZlcnMgYmVpbmcgY2FsbGVkIHByaW9yIHRvIGluaXRpYWxpemVTdGF0ZS4gXG4gICAgICAgIG1vZGlmaWVyczogdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdID8gdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdLm1vZGlmaWVycyA6IHt9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmVzIG1vZGlmaWVycyBpbiBzdGF0ZVxuICAgKiBAcGFyYW0ge29iamVjdH0gaW5pdGlhbE1vZGlmaWVycyAtIEFuIG9iamVjdCB3aXRoIGtleXMgYXNzb2NpYXRlZCB3aXRoIGV4aXN0aW5nIGluaXRpYWxpemVkIHZhcmlhYmxlcyBhbmQgdmFsdWVzIHRoYXQgYXJlIG9iamVjdHMgY29udGFpbmluZyBtb2RpZmllcnMgdG8gYmUgYm91bmQgdG8gdGhhdCBzcGVjaWZpYyB2YXJpYWJsZVxuICAgKi9cbiAgXG4gIGluaXRpYWxpemVNb2RpZmllcnMoaW5pdGlhbE1vZGlmaWVycykge1xuICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBpbnB1dCBpcyBhbiBvYmplY3RcbiAgICBpZiAodHlwZW9mIGluaXRpYWxNb2RpZmllcnMgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoaW5pdGlhbE1vZGlmaWVycykpIHRocm93IG5ldyBFcnJvcignSW5wdXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAvLyBsb29wIHRocm91Z2ggdGhlIHN0YXRlIG1vZGlmaWVyc1xuICAgIE9iamVjdC5rZXlzKGluaXRpYWxNb2RpZmllcnMpLmZvckVhY2gobmV3TW9kaWZpZXJzSW5TdGF0ZSA9PiB7XG4gICAgICB0aGlzLnN0YXRlW25ld01vZGlmaWVyc0luU3RhdGVdID0ge1xuICAgICAgICAvL2FjY291bnRzIGZvciBpbml0aWFsaXplU3RhdGUgYmVpbmcgY2FsbGVkIHByaW9yIHRvIGluaXRpYWxpemVTdGF0ZS4gXG4gICAgICAgIHZhbHVlOiB0aGlzLnN0YXRlW25ld01vZGlmaWVyc0luU3RhdGVdID8gdGhpcy5zdGF0ZVtuZXdNb2RpZmllcnNJblN0YXRlXS52YWx1ZSA6IG51bGwsXG4gICAgICAgIG1vZGlmaWVyczogaW5pdGlhbE1vZGlmaWVyc1tuZXdNb2RpZmllcnNJblN0YXRlXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0IG5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcignTmFtZSBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgZWxzZSB0aGlzLl9uYW1lID0gbmFtZTtcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgc2V0IHBhcmVudChwYXJlbnQpIHtcbiAgICBpZiAodHlwZW9mIHBhcmVudCAhPT0gJ3N0cmluZycgJiYgcGFyZW50ICE9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgZWxzZSB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICBnZXQgcGFyZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gIH1cblxuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICB9XG5cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb25zdHJ1Y3Rvck5vZGU7IiwiZXhwb3J0IGNvbnN0IEFSUkFZID0gJ0FSUkFZJztcbmV4cG9ydCBjb25zdCBPQkpFQ1QgPSAnT0JKRUNUJztcbmV4cG9ydCBjb25zdCBQUklNSVRJVkUgPSAnUFJJTUlUSVZFJztcbmV4cG9ydCBjb25zdCBDT05UQUlORVIgPSAnQ09OVEFJTkVSJzsiLCJpbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5cbmNsYXNzIFNpbG9Ob2RlIHtcbiAgY29uc3RydWN0b3IobmFtZSwgdmFsdWUsIHBhcmVudCA9IG51bGwsIG1vZGlmaWVycyA9IHt9LCB0eXBlID0gdHlwZXMuUFJJTUlUSVZFKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5tb2RpZmllcnMgPSBtb2RpZmllcnM7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHRoaXMuc3Vic2NyaWJlcnMgPSBbXTtcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDsgLy8gY2lyY3VsYXIgc2lsbyBub2RlXG4gICAgdGhpcy50eXBlID0gdHlwZTtcblxuICAgIC8vIGJpbmRcbiAgICB0aGlzLmxpbmtNb2RpZmllcnMgPSB0aGlzLmxpbmtNb2RpZmllcnMuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJ1bk1vZGlmaWVycyA9IHRoaXMucnVuTW9kaWZpZXJzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycyA9IHRoaXMubm90aWZ5U3Vic2NyaWJlcnMuYmluZCh0aGlzKTtcbiAgICB0aGlzLmdldFN0YXRlID0gdGhpcy5nZXRTdGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjb25zdHJ1Y3RBcnJheSA9IHRoaXMucmVjb25zdHJ1Y3RBcnJheS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjb25zdHJ1Y3RPYmplY3QgPSB0aGlzLnJlY29uc3RydWN0T2JqZWN0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5kZWNvbnN0cnVjdE9iamVjdEludG9TaWxvTm9kZXMgPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2Rlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjb25zdHJ1Y3QgPSB0aGlzLnJlY29uc3RydWN0LmJpbmQodGhpcyk7XG5cbiAgICAvLyBpbnZva2UgZnVuY3Rpb25zXG4gICAgdGhpcy5ydW5RdWV1ZSA9IHRoaXMucnVuTW9kaWZpZXJzKCk7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIHNldCBuYW1lKG5hbWUpIHtcbiAgICBpZiAoIW5hbWUgfHwgdHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoJ05hbWUgaXMgcmVxdWlyZWQgYW5kIHNob3VsZCBiZSBhIHN0cmluZycpXG4gICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICB9XG5cbiAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBtb2RpZmllcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21vZGlmaWVycztcbiAgfVxuXG4gIHNldCBtb2RpZmllcnMobW9kaWZpZXJzKSB7XG4gICAgaWYgKHR5cGVvZiBtb2RpZmllcnMgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkobW9kaWZpZXJzKSkgdGhyb3cgbmV3IEVycm9yKCdNb2RpZmllcnMgbXVzdCBiZSBhIHBsYWluIG9iamVjdCcpO1xuICAgIHRoaXMuX21vZGlmaWVycyA9IG1vZGlmaWVycztcbiAgfVxuXG4gIGdldCBxdWV1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVldWU7XG4gIH1cblxuICBzZXQgcXVldWUocXVldWUpIHtcbiAgICB0aGlzLl9xdWV1ZSA9IHF1ZXVlO1xuICB9XG5cbiAgZ2V0IHBhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgc2V0IHBhcmVudChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50ICYmIHBhcmVudC5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnU2lsb05vZGUnKSB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBtdXN0IGJlIG51bGwgb3IgYSBzaWxvTm9kZScpO1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgfVxuXG4gIGdldCBzdWJzY3JpYmVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3Vic2NyaWJlcnM7XG4gIH1cblxuICBzZXQgc3Vic2NyaWJlcnMoc3Vic2NyaWJlcnMpIHtcbiAgICB0aGlzLl9zdWJzY3JpYmVycyA9IHN1YnNjcmliZXJzO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3R5cGU7XG4gIH1cblxuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJyB8fCAhdHlwZXNbdHlwZV0pIHRocm93IG5ldyBFcnJvcignVHlwZSBtdXN0IGJlIGFuIGF2YWlsYWJsZSBjb25zdGFudCcpO1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICB9XG5cbiAgLy8gZG8gd2UgbmVlZCB0aGlzP1xuICBwdXNoVG9TdWJzY3JpYmVycyhyZW5kZXJGdW5jdGlvbil7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHJlbmRlckZ1bmN0aW9uKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21TdWJzY3JpYmVyc0F0SW5kZXgoaW5kZXgpe1xuICAgIHRoaXMuc3ViY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnMuc2xpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlbGxzIGFsbCBzdWJzY3JpYmVycyBvZiBhIHNpbG9Ob2RlIHRoYXQgY2hhbmdlcyB0byBzdGF0ZSBoYXZlIGJlZW4gbWFkZVxuICAgKi9cbiAgbm90aWZ5U3Vic2NyaWJlcnMoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmMgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgRXJyb3IoJ1N1YnNjcmliZXIgYXJyYXkgbXVzdCBvbmx5IGNvbnRhaW4gZnVuY3Rpb25zJyk7XG4gICAgICBmdW5jKHRoaXMuZ2V0U3RhdGUoKSk7XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZva2VkIG9uY2UgaW4gdGhlIHNpbG9Ob2RlIGNvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIGNsb3N1cmUuIFRoZSBjbG9zdXJlIHZhcmlhYmxlIFxuICAgKiAncnVubmluZycgcHJldmVudHMgdGhlIHJldHVybmVkIGFzeW5jIGZ1bmN0aW9uIGZyb20gYmVpbmcgaW52b2tlZCBpZiBpdCdzXG4gICAqIHN0aWxsIHJ1bm5pbmcgZnJvbSBhIHByZXZpb3VzIGNhbGxcbiAgICovXG4gIHJ1bk1vZGlmaWVycygpIHtcbiAgICBsZXQgcnVubmluZyA9IGZhbHNlOyAvLyBwcmV2ZW50cyBtdWx0aXBsZSBjYWxscyBmcm9tIGJlaW5nIG1hZGUgaWYgYWxyZWFkeSBydW5uaW5nXG5cbiAgICBhc3luYyBmdW5jdGlvbiBydW4oKSB7XG4gICAgICBpZiAocnVubmluZyA9PT0gZmFsc2UpIHsgLy8gcHJldmVudHMgbXVsdGlwbGUgY2FsbHMgZnJvbSBiZWluZyBtYWRlIGlmIGFscmVhZHkgcnVubmluZ1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgd2hpbGUgKHRoaXMucXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRoaXMudmFsdWUgPSBhd2FpdCB0aGlzLnF1ZXVlLnNoaWZ0KCkoKTtcbiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSB0eXBlcy5QUklNSVRJVkUpIHRoaXMudmFsdWUgPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcygpLnZhbHVlO1xuICAgICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBydW5uaW5nID0gZmFsc2U7ICAgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2luIHByb2dyZXNzLi4uJztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ1bjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNvbnN0cnVjdHMgb2JqZWN0cyBpbnRvIGEgcGFyZW50IHNpbG9Ob2RlIHdpdGggYSB0eXBlIG9mIG9iamVjdC9hcnJheSwgYW5kXG4gICAqIGNoaWxkcmVuIHNpbG9Ob2RlcyB3aXRoIHZhbHVlcyBwZXJ0YWluaW5nIHRvIHRoZSBjb250ZW50cyBvZiB0aGUgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvYmpOYW1lIC0gVGhlIGludGVuZGVkIGtleSBvZiB0aGUgb2JqZWN0IHdoZW4gc3RvcmVkIGluIHRoZSBzaWxvXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RUb0RlY29uc3RydWN0IC0gQW55IG9iamVjdCB0aGF0IG11c3QgY29udGFpbiBhIGtleSBvZiB2YWx1ZVxuICAgKiBAcGFyYW0ge1NpbG9Ob2RlfSBwYXJlbnQgLSBJbnRlbmRlZCBTaWxvTm9kZSBwYXJlbnQgdG8gdGhlIGRlY29uc3RydWN0ZWQgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcnVuTGlua2VkTW9kcyAtIFRydWUgb25seSB3aGVuIGJlaW5nIGNhbGxlZCBmb3IgYSBjb25zdHJ1Y3Rvck5vZGVcbiAgICovXG4gIGRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyhvYmpOYW1lID0gdGhpcy5uYW1lLCBvYmplY3RUb0RlY29uc3RydWN0ID0gdGhpcywgcGFyZW50ID0gdGhpcy5wYXJlbnQsIHJ1bkxpbmtlZE1vZHMgPSBmYWxzZSkge1xuICAgIGNvbnN0IG9iakNoaWxkcmVuID0ge307XG4gICAgbGV0IHR5cGUsIGtleXM7XG4gIFxuICAgIC8vIGRldGVybWluZSBpZiBhcnJheSBvciBvdGhlciBvYmplY3RcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlKSkge1xuICAgICAga2V5cyA9IG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWU7XG4gICAgICB0eXBlID0gdHlwZXMuQVJSQVk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlKTtcbiAgICAgIHR5cGUgPSB0eXBlcy5PQkpFQ1Q7XG4gICAgfVxuICBcbiAgICBjb25zdCBuZXdTaWxvTm9kZSA9IG5ldyBTaWxvTm9kZShvYmpOYW1lLCBvYmpDaGlsZHJlbiwgcGFyZW50LCBvYmplY3RUb0RlY29uc3RydWN0Lm1vZGlmaWVycywgdHlwZSk7XG4gICAgXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZSkgJiYgb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGFycmF5XG4gICAgICBvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlLmZvckVhY2goKGluZGV4ZWRWYWwsIGkpID0+IHtcbiAgICAgICAgLy8gcmVjdXJzZSBpZiB0aGUgYXJyYXkgaGFzIG9iamVjdHMgc3RvcmVkIGluIGl0cyBpbmRpY2VzXG4gICAgICAgIGlmICh0eXBlb2YgaW5kZXhlZFZhbCA9PT0gJ29iamVjdCcpIG9iakNoaWxkcmVuW2Ake29iak5hbWV9XyR7aX1gXSA9IHRoaXMuZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzKGAke29iak5hbWV9XyR7aX1gLCB7dmFsdWU6IGluZGV4ZWRWYWx9LCBuZXdTaWxvTm9kZSwgcnVuTGlua2VkTW9kcyk7XG4gICAgICAgIGVsc2Ugb2JqQ2hpbGRyZW5bYCR7b2JqTmFtZX1fJHtpfWBdID0gbmV3IFNpbG9Ob2RlKGAke29iak5hbWV9XyR7aX1gLCBpbmRleGVkVmFsLCBuZXdTaWxvTm9kZSk7XG4gICAgICB9KVxuICAgIH0gXG4gICAgXG4gICAgZWxzZSBpZiAoa2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBsb29wIHRocm91Z2ggb2JqZWN0XG4gICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgLy8gcmVjdXJzZSBpZiB0aGUgb2JqZWN0IGhhcyBvYmplY3RzIHN0b3JlZCBpbiBpdHMgdmFsdWVzXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZVtrZXldID09PSAnb2JqZWN0Jykgb2JqQ2hpbGRyZW5bYCR7b2JqTmFtZX1fJHtrZXl9YF0gPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyhgJHtvYmpOYW1lfV8ke2tleX1gLCB7dmFsdWU6IG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWVba2V5XX0sIG5ld1NpbG9Ob2RlLCBydW5MaW5rZWRNb2RzKTtcbiAgICAgICAgZWxzZSBvYmpDaGlsZHJlbltgJHtvYmpOYW1lfV8ke2tleX1gXSA9IG5ldyBTaWxvTm9kZShgJHtvYmpOYW1lfV8ke2tleX1gLCBvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlW2tleV0sIG5ld1NpbG9Ob2RlKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHJ1bkxpbmtlZE1vZHMpIG5ld1NpbG9Ob2RlLmxpbmtNb2RpZmllcnMoKTtcblxuICAgIHJldHVybiBuZXdTaWxvTm9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcyBkZXZlbG9wZXIgd3JpdHRlbiBtb2RpZmllcnMgaW4gYXN5bmMgZnVuY3Rpb25zIHdpdGggc3RhdGUgcGFzc2VkIGluIGF1dG9tYXRpY2FsbHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vZGVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNpbG9Ob2RlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZU1vZGlmaWVycyAtIEFuIG9iamVjdCBjb250YWluaW5nIHVud3JhcHBlZCBtb2RpZmllcnMgbW9zdCBsaWtlbHkgZnJvbSB0aGUgY29uc3RydWN0b3JOb2RlXG4gICAqL1xuICBsaW5rTW9kaWZpZXJzKG5vZGVOYW1lID0gdGhpcy5uYW1lLCBzdGF0ZU1vZGlmaWVycyA9IHRoaXMubW9kaWZpZXJzKSB7XG4gICAgaWYgKCFzdGF0ZU1vZGlmaWVycyB8fCBPYmplY3Qua2V5cyhzdGF0ZU1vZGlmaWVycykubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgLy8gbG9vcGluZyB0aHJvdWdoIGV2ZXJ5IG1vZGlmaWVyIGFkZGVkIGJ5IHRoZSBkZXZcbiAgICBPYmplY3Qua2V5cyhzdGF0ZU1vZGlmaWVycykuZm9yRWFjaChtb2RpZmllcktleSA9PiB7XG4gICAgICBjb25zdCBtb2RpZmllciA9IHN0YXRlTW9kaWZpZXJzW21vZGlmaWVyS2V5XTtcblxuICAgICAgaWYgKHR5cGVvZiBtb2RpZmllciAhPT0gJ2Z1bmN0aW9uJyApIHRocm93IG5ldyBUeXBlRXJyb3IoKTsgXG5cbiAgICAgIC8vIGFkZHMgbWlkZGxld2FyZSB0aGF0IHdpbGwgYWZmZWN0IHRoZSB2YWx1ZSBvZiB0aGlzIG5vZGVcbiAgICAgIGVsc2UgaWYgKG1vZGlmaWVyLmxlbmd0aCA8PSAyKSB7XG4gICAgICAgIC8vIHdyYXAgdGhlIGRldidzIG1vZGlmaWVyIGZ1bmN0aW9uIHNvIHdlIGNhbiBwYXNzIHRoZSBjdXJyZW50IG5vZGUgdmFsdWUgaW50byBpdFxuICAgICAgICBsZXQgbGlua2VkTW9kaWZpZXI7XG4gICAgICAgIGlmICh0aGF0LnR5cGUgPT09IHR5cGVzLlBSSU1JVElWRSkgbGlua2VkTW9kaWZpZXIgPSBhc3luYyAocGF5bG9hZCkgPT4gYXdhaXQgbW9kaWZpZXIodGhhdC52YWx1ZSwgcGF5bG9hZCk7XG4gICAgICAgIC8vIHRoYXQudmFsdWUgaXMgYW4gb2JqZWN0IGFuZCB3ZSBuZWVkIHRvIHJlYXNzZW1ibGUgaXRcbiAgICAgICAgZWxzZSBpZiAodGhhdC50eXBlID09PSB0eXBlcy5PQkpFQ1QgfHwgdGhhdC50eXBlID09PSB0eXBlcy5BUlJBWSkge1xuICAgICAgICAgIGxpbmtlZE1vZGlmaWVyID0gYXN5bmMgKHBheWxvYWQpID0+IGF3YWl0IG1vZGlmaWVyKHRoaXMucmVjb25zdHJ1Y3Qobm9kZU5hbWUsIHRoYXQpLCBwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gdGhlIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgZGV2IHRyaWVzIHRvIGNhbGwgdGhlaXIgbW9kaWZpZXJcbiAgICAgICAgdGhpcy5tb2RpZmllcnNbbW9kaWZpZXJLZXldID0gcGF5bG9hZCA9PiB7XG4gICAgICAgICAgLy8gd3JhcCB0aGUgbGlua2VkTW9kaWZpZXIgYWdhaW4gc28gdGhhdCBpdCBjYW4gYmUgYWRkZWQgdG8gdGhlIGFzeW5jIHF1ZXVlIHdpdGhvdXQgYmVpbmcgaW52b2tlZFxuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXN5bmMgKCkgPT4gYXdhaXQgbGlua2VkTW9kaWZpZXIocGF5bG9hZCk7XG4gICAgICAgICAgdGhhdC5xdWV1ZS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICB0aGF0LnJ1blF1ZXVlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYWRkcyBtaWRkbGV3YXJlIHRoYXQgd2lsbCBhZmZlY3QgdGhlIHZhbHVlIG9mIGEgY2hpbGQgbm9kZSBvZiBpbmRleFxuICAgICAgZWxzZSBpZiAobW9kaWZpZXIubGVuZ3RoID4gMikge1xuICAgICAgICAvLyB3cmFwIHRoZSBkZXYncyBtb2RpZmllciBmdW5jdGlvbiBzbyB3ZSBjYW4gcGFzcyB0aGUgY3VycmVudCBub2RlIHZhbHVlIGludG8gaXRcbiAgICAgICAgY29uc3QgbGlua2VkTW9kaWZpZXIgPSBhc3luYyAoaW5kZXgsIHBheWxvYWQpID0+IGF3YWl0IG1vZGlmaWVyKHRoaXMucmVjb25zdHJ1Y3QoaW5kZXgsIHRoYXQudmFsdWVbaW5kZXhdKSwgaW5kZXgsIHBheWxvYWQpOyBcblxuICAgICAgICAvLyB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSBkZXYgdHJpZXMgdG8gY2FsbCB0aGVpciBtb2RpZmllclxuICAgICAgICB0aGlzLm1vZGlmaWVyc1ttb2RpZmllcktleV0gPSAoaW5kZXgsIHBheWxvYWQpID0+IHtcbiAgICAgICAgICAvLyB3cmFwIHRoZSBsaW5rZWRNb2RpZmllciBhZ2FpbiBzbyB0aGF0IGl0IGNhbiBiZSBhZGRlZCB0byB0aGUgYXN5bmMgcXVldWUgd2l0aG91dCBiZWluZyBpbnZva2VkXG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBhc3luYyAoKSA9PiBhd2FpdCBsaW5rZWRNb2RpZmllcihgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YCwgcGF5bG9hZCk7XG4gICAgICAgICAgdGhhdC52YWx1ZVtgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YF0ucXVldWUucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgdGhhdC52YWx1ZVtgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YF0ucnVuUXVldWUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogV3JhcHMgZGV2ZWxvcGVyIHdyaXR0ZW4gbW9kaWZpZXJzIGluIGFzeW5jIGZ1bmN0aW9ucyB3aXRoIHN0YXRlIHBhc3NlZCBpbiBhdXRvbWF0aWNhbGx5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBub2RlTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzaWxvTm9kZVxuICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGVNb2RpZmllcnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB1bndyYXBwZWQgbW9kaWZpZXJzIG1vc3QgbGlrZWx5IGZyb20gdGhlIGNvbnN0cnVjdG9yTm9kZVxuICAgKi9cbiAgcmVjb25zdHJ1Y3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpIHtcbiAgICBsZXQgcmVjb25zdHJ1Y3RlZE9iamVjdDtcbiAgICBpZiAoY3VyclNpbG9Ob2RlLnR5cGUgPT09IHR5cGVzLk9CSkVDVCkgcmVjb25zdHJ1Y3RlZE9iamVjdCA9IHRoaXMucmVjb25zdHJ1Y3RPYmplY3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpO1xuICAgIGVsc2UgaWYgKGN1cnJTaWxvTm9kZS50eXBlID09PSB0eXBlcy5BUlJBWSkgcmVjb25zdHJ1Y3RlZE9iamVjdCA9IHRoaXMucmVjb25zdHJ1Y3RBcnJheShzaWxvTm9kZU5hbWUsIGN1cnJTaWxvTm9kZSk7XG4gICAgZWxzZSByZXR1cm4gY3VyclNpbG9Ob2RlLnZhbHVlO1xuICAgIHJldHVybiByZWNvbnN0cnVjdGVkT2JqZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFdyYXBzIGRldmVsb3BlciB3cml0dGVuIG1vZGlmaWVycyBpbiBhc3luYyBmdW5jdGlvbnMgd2l0aCBzdGF0ZSBwYXNzZWQgaW4gYXV0b21hdGljYWxseVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2lsb05vZGVcbiAgICogQHBhcmFtIHtvYmplY3R9IHN0YXRlTW9kaWZpZXJzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcgdW53cmFwcGVkIG1vZGlmaWVycyBtb3N0IGxpa2VseSBmcm9tIHRoZSBjb25zdHJ1Y3Rvck5vZGVcbiAgICovXG4gIHJlY29uc3RydWN0T2JqZWN0KHNpbG9Ob2RlTmFtZSwgY3VyclNpbG9Ob2RlKSB7XG4gICAgY29uc3QgbmV3T2JqZWN0ID0ge307XG4gICAgLy8gbG9vcCB0aHJvdWdoIG9iamVjdCB2YWx1ZXMgY3VycmVudGx5IHN0b3JlZCBhcyBub2Rlc1xuICAgIE9iamVjdC5rZXlzKGN1cnJTaWxvTm9kZS52YWx1ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgY2hpbGRPYmogPSBjdXJyU2lsb05vZGUudmFsdWVba2V5XTtcbiAgICAgIFxuICAgICAgLy9nZXQga2V5TmFtZSBmcm9tIHRoZSBuYW1pbmcgY29udmVudGlvblxuICAgICAgY29uc3QgZXh0cmFjdGVkS2V5ID0ga2V5LnNsaWNlKHNpbG9Ob2RlTmFtZS5sZW5ndGggKyAxKTtcbiAgICAgIGlmIChjaGlsZE9iai50eXBlID09PSB0eXBlcy5PQkpFQ1QgfHwgY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuQVJSQVkpIHtcbiAgICAgICAgbmV3T2JqZWN0W2V4dHJhY3RlZEtleV0gPSB0aGlzLnJlY29uc3RydWN0KGtleSwgY2hpbGRPYmopO1xuICAgICAgfSBlbHNlIGlmIChjaGlsZE9iai50eXBlID09PSB0eXBlcy5QUklNSVRJVkUpIHtcbiAgICAgICAgbmV3T2JqZWN0W2V4dHJhY3RlZEtleV0gPSBjaGlsZE9iai52YWx1ZTtcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHMgZGV2ZWxvcGVyIHdyaXR0ZW4gbW9kaWZpZXJzIGluIGFzeW5jIGZ1bmN0aW9ucyB3aXRoIHN0YXRlIHBhc3NlZCBpbiBhdXRvbWF0aWNhbGx5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBub2RlTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzaWxvTm9kZVxuICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGVNb2RpZmllcnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB1bndyYXBwZWQgbW9kaWZpZXJzIG1vc3QgbGlrZWx5IGZyb20gdGhlIGNvbnN0cnVjdG9yTm9kZVxuICAgKi9cbiAgcmVjb25zdHJ1Y3RBcnJheShzaWxvTm9kZU5hbWUsIGN1cnJTaWxvTm9kZSkge1xuICAgIGNvbnN0IG5ld0FycmF5ID0gW107XG4gICAgLy8gbG9vcCB0aHJvdWdoIGFycmF5IGluZGljZXMgY3VycmVudGx5IHN0b3JlZCBhcyBub2Rlc1xuICAgIE9iamVjdC5rZXlzKGN1cnJTaWxvTm9kZS52YWx1ZSkuZm9yRWFjaCgoa2V5LCBpKSA9PiB7XG4gICAgICBjb25zdCBjaGlsZE9iaiA9IGN1cnJTaWxvTm9kZS52YWx1ZVtrZXldO1xuICAgICAgaWYgKGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLkFSUkFZIHx8IGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLk9CSkVDVCkge1xuICAgICAgICBuZXdBcnJheS5wdXNoKHRoaXMucmVjb25zdHJ1Y3QoYCR7c2lsb05vZGVOYW1lfV8ke2l9YCwgY2hpbGRPYmopKTtcbiAgICAgIH0gZWxzZSBpZiAoY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSB7XG4gICAgICAgIG5ld0FycmF5LnB1c2goY2hpbGRPYmoudmFsdWUpO1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgZ2V0U3RhdGUoKSB7XG4gICAgY29uc3Qgc3RhdGUgPSB7fTtcbiAgICAvLyBjYWxsIGdldFN0YXRlIG9uIHBhcmVudCBub2RlcyB1cCB0aWxsIHJvb3QgYW5kIGNvbGxlY3QgYWxsIHZhcmlhYmxlcy9tb2RpZmllcnMgZnJvbSBwYXJlbnRzXG4gICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBwYXJlbnRTdGF0ZSA9IHRoaXMucGFyZW50LmdldFN0YXRlKCk7XG4gICAgICBPYmplY3Qua2V5cyhwYXJlbnRTdGF0ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBzdGF0ZVtrZXldID0gcGFyZW50U3RhdGVba2V5XTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gZ2V0dGluZyBjaGlsZHJlbiBvZiBvYmplY3RzL2FyYXlzIGlzIHJlZHVuZGFudFxuICAgIGlmICh0aGlzLnR5cGUgIT09IHR5cGVzLkFSUkFZICYmIHRoaXMudHlwZSAhPT0gdHlwZXMuT0JKRUNUKVxuICAgICAgT2JqZWN0LmtleXModGhpcy52YWx1ZSkuZm9yRWFjaChzaWxvTm9kZU5hbWUgPT4ge1xuICAgICAgICBjb25zdCBjdXJyU2lsb05vZGUgPSB0aGlzLnZhbHVlW3NpbG9Ob2RlTmFtZV07XG4gICAgICAgIGlmIChjdXJyU2lsb05vZGUudHlwZSA9PT0gdHlwZXMuT0JKRUNUIHx8IGN1cnJTaWxvTm9kZS50eXBlID09PSB0eXBlcy5BUlJBWSkgc3RhdGVbc2lsb05vZGVOYW1lXSA9IHRoaXMucmVjb25zdHJ1Y3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpO1xuICAgICAgICBlbHNlIGlmIChjdXJyU2lsb05vZGUudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSBzdGF0ZVtzaWxvTm9kZU5hbWVdID0gY3VyclNpbG9Ob2RlLnZhbHVlO1xuXG4gICAgICAgIC8vIHNvbWUgc2lsb05vZGVzIGRvbid0IGhhdmUgbW9kaWZpZXJzXG4gICAgICAgIGlmIChjdXJyU2lsb05vZGUubW9kaWZpZXJzKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoY3VyclNpbG9Ob2RlLm1vZGlmaWVycykuZm9yRWFjaChtb2RpZmllciA9PiB7XG4gICAgICAgICAgICBzdGF0ZVttb2RpZmllcl0gPSBjdXJyU2lsb05vZGUubW9kaWZpZXJzW21vZGlmaWVyXTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbG9Ob2RlOyIsIi8vIGltcG9ydCBzdGF0ZSBjbGFzcyBmb3IgaW5zdGFuY2VvZiBjaGVja1xuaW1wb3J0IENvbnN0cnVjdG9yTm9kZSBmcm9tICcuL2NvbnN0cnVjdG9yTm9kZS5qcyc7XG5pbXBvcnQgU2lsb05vZGUgZnJvbSAnLi9zaWxvTm9kZS5qcyc7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL2NvbnN0YW50cy5qcydcblxuY29uc3Qgc2lsbyA9IHt9O1xuXG4vKipcbiAqIFRha2VzIGFsbCBvZiB0aGUgY29uc3RydWN0b3JOb2RlcyBjcmVhdGVkIGJ5IHRoZSBkZXZlbG9wZXJcbiAqIEBwYXJhbSAgey4uLkNvbnN0cnVjdG9yTm9kZX0gYXJncyAtIEEgbGlzdCBvZiBjb25zdHJ1Y3RvciBOb2Rlc1xuICovXG5cbmZ1bmN0aW9uIGNvbWJpbmVOb2RlcyguLi5hcmdzKSB7XG4gIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKCdjb21iaW5lTm9kZXMgZnVuY3Rpb24gdGFrZXMgYXQgbGVhc3Qgb25lIGNvbnN0cnVjdG9yTm9kZScpO1xuXG4gIC8vIGhhc3RhYmxlIGFjY291bnRzIGZvciBwYXNzaW5nIGluIGNvbnN0cnVjdG9yTm9kZXMgaW4gYW55IG9yZGVyLiBcbiAgLy8gaGFzaHRhYmxlIG9yZ2FuaXplcyBhbGwgbm9kZXMgaW50byBwYXJlbnQtY2hpbGQgcmVsYXRpb25zaGlwc1xuICBjb25zdCBoYXNoVGFibGUgPSB7fTtcbiAgYXJncy5mb3JFYWNoKGNvbnN0cnVjdG9yTm9kZSA9PiB7XG4gICAgaWYgKCFjb25zdHJ1Y3Rvck5vZGUgfHwgY29uc3RydWN0b3JOb2RlLmNvbnN0cnVjdG9yLm5hbWUgIT09ICdDb25zdHJ1Y3Rvck5vZGUnKSB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgY29uc3RydWN0b3JOb2RlcyBjYW4gYmUgcGFzc2VkIHRvIGNvbWJpbmVOb2RlcycpO1xuICAgIGVsc2UgaWYgKGNvbnN0cnVjdG9yTm9kZS5wYXJlbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHRoaXMgaXMgdGhlIHJvb3Qgbm9kZSwgb25seSBvbmUgY29uc3RydWN0b3JOb2RlIGNhbiBoYXZlIGEgcGFyZW50IG9mIG51bGxcbiAgICAgIGlmICghaGFzaFRhYmxlLnJvb3QpIGhhc2hUYWJsZS5yb290ID0gW2NvbnN0cnVjdG9yTm9kZV07XG4gICAgICBlbHNlIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgY29uc3RydWN0b3Igbm9kZSBjYW4gaGF2ZSBudWxsIHBhcmVudCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWhhc2hUYWJsZVtjb25zdHJ1Y3Rvck5vZGUucGFyZW50XSkgaGFzaFRhYmxlW2NvbnN0cnVjdG9yTm9kZS5wYXJlbnRdID0gW2NvbnN0cnVjdG9yTm9kZV07XG4gICAgICAvLyBpZiBwYXJlbnQgYWxyZWFkeSBleGlzdHMsIGFuZCBub2RlIGJlaW5nIGFkZGVkIHdpbGwgYXBwZW5kIHRvIHRoZSBhcnJheSBvZiBjaGlsZHJlblxuICAgICAgZWxzZSBoYXNoVGFibGVbY29uc3RydWN0b3JOb2RlLnBhcmVudF0ucHVzaChjb25zdHJ1Y3Rvck5vZGUpO1xuICAgIH1cbiAgfSkgXG5cbiAgLy8gZW5zdXJlIHRoZXJlIGlzIGEgZGVmaW5lZCByb290XG4gIGlmICghaGFzaFRhYmxlLnJvb3QpIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGNvbnN0cnVjdG9yIG5vZGUgbXVzdCBoYXZlIGEgbnVsbCBwYXJlbnQnKTtcblxuICAvLyByZWN1cnNpdmUgZnVuY3Rpb24gdGhhdCB3aWxsIGNyZWF0ZSBzaWxvTm9kZXMgYW5kIHJldHVybiB0aGVtIHRvIGEgcGFyZW50XG4gIGZ1bmN0aW9uIG1hcFRvU2lsbyhjb25zdHJ1Y3Rvck5vZGUgPSAncm9vdCcsIHBhcmVudENvbnN0cnVjdG9yTm9kZSA9IG51bGwpIHtcbiAgICBjb25zdCBjb25zdHJ1Y3Rvck5vZGVOYW1lID0gKGNvbnN0cnVjdG9yTm9kZSA9PT0gJ3Jvb3QnKSA/ICdyb290JyA6IGNvbnN0cnVjdG9yTm9kZS5uYW1lO1xuXG4gICAgLy8gcmVjdXJzaXZlIGJhc2UgY2FzZSwgd2Ugb25seSBjb250aW51ZSBpZiB0aGUgY29uc3RydWN0b3JOb2RlIGhhcyBjb25zdHJ1Y3Rvck5vZGUgY2hpbGRyZW5cbiAgICBpZiAoIWhhc2hUYWJsZVtjb25zdHJ1Y3Rvck5vZGVOYW1lXSkgcmV0dXJuO1xuXG4gICAgY29uc3QgY2hpbGRyZW4gPSB7fTtcblxuICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgY2hpbGRyZW4gb2YgY29uc3RydWN0b3JOb2RlXG4gICAgaGFzaFRhYmxlW2NvbnN0cnVjdG9yTm9kZU5hbWVdLmZvckVhY2goY3VyckNvbnN0cnVjdG9yTm9kZSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZXNPZkN1cnJTaWxvTm9kZSA9IHt9O1xuICAgICAgY2hpbGRyZW5bY3VyckNvbnN0cnVjdG9yTm9kZS5uYW1lXSA9IG5ldyBTaWxvTm9kZShjdXJyQ29uc3RydWN0b3JOb2RlLm5hbWUsIHZhbHVlc09mQ3VyclNpbG9Ob2RlLCBwYXJlbnRDb25zdHJ1Y3Rvck5vZGUsIHt9LCB0eXBlcy5DT05UQUlORVIpO1xuICAgICAgXG4gICAgICAvLyBhYnN0cmFjdCBzb21lIHZhcmlhYmxlc1xuICAgICAgY29uc3QgY3VyclNpbG9Ob2RlID0gY2hpbGRyZW5bY3VyckNvbnN0cnVjdG9yTm9kZS5uYW1lXTtcbiAgICAgIGNvbnN0IHN0YXRlT2ZDdXJyQ29uc3RydWN0b3JOb2RlID0gY3VyckNvbnN0cnVjdG9yTm9kZS5zdGF0ZTtcblxuICAgICAgLy8gY3JlYXRlIFNpbG9Ob2RlcyBmb3IgYWxsIHRoZSB2YXJpYWJsZXMgaW4gdGhlIGN1cnJDb25zdHJ1Y3Rvck5vZGVcbiAgICAgIE9iamVjdC5rZXlzKHN0YXRlT2ZDdXJyQ29uc3RydWN0b3JOb2RlKS5mb3JFYWNoKHZhckluQ29uc3RydWN0b3JOb2RlU3RhdGUgPT4ge1xuICAgICAgICAvLyBjcmVhdGVzIHNpbG9Ob2RlcyBmb3Igb2JqZWN0IHZhcmlhYmxlc1xuICAgICAgICBpZiAodHlwZW9mIHN0YXRlT2ZDdXJyQ29uc3RydWN0b3JOb2RlW3ZhckluQ29uc3RydWN0b3JOb2RlU3RhdGVdLnZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHZhbHVlc09mQ3VyclNpbG9Ob2RlW3ZhckluQ29uc3RydWN0b3JOb2RlU3RhdGVdID0gY3VyclNpbG9Ob2RlLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2Rlcyh2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlLCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXSwgY3VyclNpbG9Ob2RlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjcmVhdGVzIHNpbG9Ob2RlcyBmb3IgcHJpbWl0aXZlIHZhcmlhYmxlc1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YWx1ZXNPZkN1cnJTaWxvTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXSA9IG5ldyBTaWxvTm9kZSh2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlLCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXS52YWx1ZSwgY3VyclNpbG9Ob2RlLCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXS5tb2RpZmllcnMpO1xuICAgICAgICAgIHZhbHVlc09mQ3VyclNpbG9Ob2RlW3ZhckluQ29uc3RydWN0b3JOb2RlU3RhdGVdLmxpbmtNb2RpZmllcnMoKTtcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8gcmVjdXJzaXZlbHkgY2hlY2sgdG8gc2VlIGlmIHRoZSBjdXJyZW50IGNvbnN0cnVjdG9yTm9kZS9zaWxvTm9kZSBoYXMgYW55IGNoaWxkcmVuIFxuICAgICAgY29uc3Qgc2lsb05vZGVDaGlsZHJlbiA9IG1hcFRvU2lsbyhjdXJyQ29uc3RydWN0b3JOb2RlLCBjdXJyU2lsb05vZGUpO1xuICAgICAgaWYgKHNpbG9Ob2RlQ2hpbGRyZW4pIHsgXG4gICAgICAgIE9iamVjdC5rZXlzKHNpbG9Ob2RlQ2hpbGRyZW4pLmZvckVhY2goc2lsb05vZGUgPT4ge1xuICAgICAgICAgIHZhbHVlc09mQ3VyclNpbG9Ob2RlW3NpbG9Ob2RlXSA9IHNpbG9Ob2RlQ2hpbGRyZW5bc2lsb05vZGVdO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgLy8gcm9vdFN0YXRlXG4gIGNvbnN0IHdyYXBwZWRSb290U2lsb05vZGUgPSBtYXBUb1NpbG8oKTtcblxuICAvLyB3aWxsIGFsd2F5cyBvbmx5IGJlIGEgc2luZ2xlIGtleSAodGhlIHJvb3QpIHRoYXQgaXMgYWRkZWQgaW50byB0aGUgc2lsb1xuICBPYmplY3Qua2V5cyh3cmFwcGVkUm9vdFNpbG9Ob2RlKS5mb3JFYWNoKHJvb3RTaWxvTm9kZSA9PiB7XG4gICAgc2lsb1tyb290U2lsb05vZGVdID0gd3JhcHBlZFJvb3RTaWxvTm9kZVtyb290U2lsb05vZGVdO1xuICB9KTtcbiAgXG4gIGZvckVhY2hTaWxvTm9kZShub2RlID0+IHtcbiAgICAvLyBhcHBseSBrZXlTdWJzY3JpYmUgb25seSB0byBvYmplY3QgYW5kIGFycmF5IHNpbG8gbm9kZXNcbiAgICBpZiAobm9kZS50eXBlID09PSAnT0JKRUNUJyB8fCBub2RlLnR5cGUgPT09IFwiQVJSQVlcIikge1xuICAgICAgbm9kZS5tb2RpZmllcnMua2V5U3Vic2NyaWJlID0gKGtleSwgcmVuZGVyRnVuYykgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gbm9kZS5uYW1lICsgXCJfXCIgKyBrZXk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZWRBdEluZGV4ID0gbm9kZS52YWx1ZVtuYW1lXS5wdXNoVG9TdWJzY3JpYmVycyhyZW5kZXJGdW5jKTtcbiAgICAgICAgbm9kZS52YWx1ZVtuYW1lXS5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge25vZGUucmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleChzdWJzY3JpYmVkQXRJbmRleCl9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gc2lsbztcbn1cblxuLyoqXG4gKiBBcHBsaWVzIHRoZSBjYWxsYmFjayB0byBldmVyeSBzaWxvTm9kZSBpbiB0aGUgc2lsb1xuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBBIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBhIHNpbG9Ob2RlIGFzIGl0cyBwYXJhbWV0ZXJcbiAqL1xuXG4vLyBjYWxsYmFja3MgaGF2ZSB0byBhY2NlcHQgYSBTSUxPTk9ERVxuZnVuY3Rpb24gZm9yRWFjaFNpbG9Ob2RlKGNhbGxiYWNrKSB7XG4gIC8vIGFjY2Vzc2luZyB0aGUgc2luZ2xlIHJvb3QgaW4gdGhlIHNpbG9cbiAgT2JqZWN0LmtleXMoc2lsbykuZm9yRWFjaChzaWxvTm9kZVJvb3RLZXkgPT4ge1xuICAgIGlubmVyKHNpbG9bc2lsb05vZGVSb290S2V5XSwgY2FsbGJhY2spO1xuICB9KVxuXG4gIC8vIHJlY3Vyc2l2ZWx5IG5hdmlnYXRlIHRvIGV2ZXJ5IHNpbG9Ob2RlXG4gIGZ1bmN0aW9uIGlubmVyKGhlYWQsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGhlYWQuY29uc3RydWN0b3IubmFtZSA9PT0gJ1NpbG9Ob2RlJykge1xuICAgICAgY2FsbGJhY2soaGVhZCk7XG4gICAgICBpZiAoaGVhZC50eXBlID09PSB0eXBlcy5QUklNSVRJVkUpIHJldHVybjsgLy8gcmVjdXJzaXZlIGJhc2UgY2FzZVxuICAgICAgXG4gICAgICBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmtleXMoaGVhZC52YWx1ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGlmIChoZWFkLnZhbHVlW2tleV0uY29uc3RydWN0b3IubmFtZSA9PT0gJ1NpbG9Ob2RlJykge1xuICAgICAgICAgICAgaW5uZXIoaGVhZC52YWx1ZVtrZXldLCBjYWxsYmFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFN1YnNjcmliZXMgY29tcG9uZW50cyB0byBzaWxvTm9kZXMgaW4gdGhlIHNpbG9cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSByZW5kZXJGdW5jdGlvbiAtIEZ1bmN0aW9uIHRvIGJlIGFwcGVuZGVkIHRvIHN1YnNjcmliZXJzIGFycmF5XG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHJlbGV2YW50IGNvbXBvbmVudCB3aXRoICdTdGF0ZScgYXBwZW5kZWRcbiAqL1xuXG5zaWxvLnN1YnNjcmliZSA9IChyZW5kZXJGdW5jdGlvbiwgbmFtZSkgPT4ge1xuICBpZiAoIW5hbWUpIHtcbiAgICBpZiAoISFyZW5kZXJGdW5jdGlvbi5wcm90b3R5cGUpIHtcbiAgICAgIG5hbWUgPSByZW5kZXJGdW5jdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IubmFtZSArICdTdGF0ZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IGNhblxcJ3QgdXNlIGFuIGFub255bW91cyBmdW5jdGlvbiBpbiBzdWJzY3JpYmUgd2l0aG91dCBhIG5hbWUgYXJndW1lbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgbGV0IGZvdW5kTm9kZTtcbiAgbGV0IHN1YnNjcmliZWRBdEluZGV4O1xuICBjb25zdCBmb3VuZE5vZGVDaGlsZHJlbiA9IFtdO1xuXG4gIGZvckVhY2hTaWxvTm9kZShub2RlID0+IHtcbiAgICBpZihub2RlLm5hbWUgPT09IG5hbWUpe1xuICAgICAgc3Vic2NyaWJlZEF0SW5kZXggPSBub2RlLnB1c2hUb1N1YnNjcmliZXJzKHJlbmRlckZ1bmN0aW9uKVxuICAgICAgZm91bmROb2RlID0gbm9kZVxuICAgICAgZm91bmROb2RlQ2hpbGRyZW4ucHVzaCh7bm9kZTogZm91bmROb2RlLCBpbmRleDogc3Vic2NyaWJlZEF0SW5kZXh9KTtcbiAgICB9XG4gIH0pXG5cbiAgZnVuY3Rpb24gdW5zdWJzY3JpYmUoKSB7XG4gICAgbGV0IG9iO1xuICAgIE9iamVjdC5rZXlzKGZvdW5kTm9kZUNoaWxkcmVuKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBvYiA9IGZvdW5kTm9kZUNoaWxkcmVuW2tleV07IFxuICAgICAgb2Iubm9kZS5yZW1vdmVGcm9tU3Vic2NyaWJlcnNBdEluZGV4KG9iLmluZGV4KVxuICAgIH0pXG4gIH1cbiAgXG4gIGlmICghIWZvdW5kTm9kZSkge1xuICAgIHJlbmRlckZ1bmN0aW9uKGZvdW5kTm9kZS5nZXRTdGF0ZSgpKVxuICAgIGlmIChmb3VuZE5vZGUudmFsdWUpIHtcbiAgICAgIE9iamVjdC5rZXlzKGZvdW5kTm9kZS52YWx1ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBsZXQgbm9kZSA9IGZvdW5kTm9kZS52YWx1ZVtrZXldO1xuICAgICAgICBpZihub2RlLnR5cGUgIT09ICdDT05UQUlORVInKXtcbiAgICAgICAgICBzdWJzY3JpYmVkQXRJbmRleCA9IG5vZGUucHVzaFRvU3Vic2NyaWJlcnMocmVuZGVyRnVuY3Rpb24pO1xuICAgICAgICAgIGZvdW5kTm9kZUNoaWxkcmVuLnB1c2goe25vZGU6IG5vZGUsIGluZGV4OiBzdWJzY3JpYmVkQXRJbmRleH0pO1xuICBcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihuZXcgRXJyb3IoJ1lvdSBhcmUgdHJ5aW5nIHRvIHN1YnNjcmliZSB0byBzb21ldGhpbmcgdGhhdCBpc25cXCd0IGluIHRoZSBzaWxvLicpKTtcbiAgfVxuXG4gIHJldHVybiB1bnN1YnNjcmliZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29tYmluZU5vZGVzOyIsImltcG9ydCBjb21iaW5lTm9kZXMgZnJvbSAnLi9yYWRvbi9jb21iaW5lTm9kZXMnO1xuaW1wb3J0IENvbnN0cnVjdG9yTm9kZSBmcm9tICcuL3JhZG9uL2NvbnN0cnVjdG9yTm9kZSc7XG5cbmV4cG9ydCBjb25zdCBjb21iaW5lU3RhdGUgPSBjb21iaW5lTm9kZXM7XG5leHBvcnQgY29uc3QgU3RhdGVOb2RlID0gQ29uc3RydWN0b3JOb2RlOyJdLCJuYW1lcyI6WyJDb25zdHJ1Y3Rvck5vZGUiLCJuYW1lIiwicGFyZW50TmFtZSIsInN0YXRlIiwicGFyZW50IiwiaW5pdGlhbGl6ZVN0YXRlIiwiYmluZCIsImluaXRpYWxpemVNb2RpZmllcnMiLCJpbml0aWFsU3RhdGUiLCJBcnJheSIsImlzQXJyYXkiLCJFcnJvciIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwibmV3VmFyaWFibGVJblN0YXRlIiwidmFsdWUiLCJtb2RpZmllcnMiLCJpbml0aWFsTW9kaWZpZXJzIiwibmV3TW9kaWZpZXJzSW5TdGF0ZSIsIl9uYW1lIiwiX3BhcmVudCIsIl9zdGF0ZSIsIkFSUkFZIiwiT0JKRUNUIiwiUFJJTUlUSVZFIiwiQ09OVEFJTkVSIiwiU2lsb05vZGUiLCJ0eXBlIiwidHlwZXMiLCJxdWV1ZSIsInN1YnNjcmliZXJzIiwibGlua01vZGlmaWVycyIsInJ1bk1vZGlmaWVycyIsIm5vdGlmeVN1YnNjcmliZXJzIiwiZ2V0U3RhdGUiLCJyZWNvbnN0cnVjdEFycmF5IiwicmVjb25zdHJ1Y3RPYmplY3QiLCJkZWNvbnN0cnVjdE9iamVjdEludG9TaWxvTm9kZXMiLCJyZWNvbnN0cnVjdCIsInJ1blF1ZXVlIiwicmVuZGVyRnVuY3Rpb24iLCJwdXNoIiwiaW5kZXgiLCJzdWJjcmliZXJzIiwic2xpY2UiLCJsZW5ndGgiLCJmdW5jIiwicnVubmluZyIsInJ1biIsInNoaWZ0Iiwib2JqTmFtZSIsIm9iamVjdFRvRGVjb25zdHJ1Y3QiLCJydW5MaW5rZWRNb2RzIiwib2JqQ2hpbGRyZW4iLCJuZXdTaWxvTm9kZSIsImluZGV4ZWRWYWwiLCJpIiwia2V5Iiwibm9kZU5hbWUiLCJzdGF0ZU1vZGlmaWVycyIsInRoYXQiLCJtb2RpZmllcktleSIsIm1vZGlmaWVyIiwiVHlwZUVycm9yIiwibGlua2VkTW9kaWZpZXIiLCJwYXlsb2FkIiwiY2FsbGJhY2siLCJzaWxvTm9kZU5hbWUiLCJjdXJyU2lsb05vZGUiLCJyZWNvbnN0cnVjdGVkT2JqZWN0IiwibmV3T2JqZWN0IiwiY2hpbGRPYmoiLCJleHRyYWN0ZWRLZXkiLCJuZXdBcnJheSIsInBhcmVudFN0YXRlIiwiX3ZhbHVlIiwiX21vZGlmaWVycyIsIl9xdWV1ZSIsImNvbnN0cnVjdG9yIiwiX3N1YnNjcmliZXJzIiwiX3R5cGUiLCJzaWxvIiwiY29tYmluZU5vZGVzIiwiYXJncyIsImhhc2hUYWJsZSIsImNvbnN0cnVjdG9yTm9kZSIsInJvb3QiLCJtYXBUb1NpbG8iLCJwYXJlbnRDb25zdHJ1Y3Rvck5vZGUiLCJjb25zdHJ1Y3Rvck5vZGVOYW1lIiwiY2hpbGRyZW4iLCJjdXJyQ29uc3RydWN0b3JOb2RlIiwidmFsdWVzT2ZDdXJyU2lsb05vZGUiLCJzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSIsInZhckluQ29uc3RydWN0b3JOb2RlU3RhdGUiLCJzaWxvTm9kZUNoaWxkcmVuIiwic2lsb05vZGUiLCJ3cmFwcGVkUm9vdFNpbG9Ob2RlIiwicm9vdFNpbG9Ob2RlIiwiZm9yRWFjaFNpbG9Ob2RlIiwibm9kZSIsImtleVN1YnNjcmliZSIsInJlbmRlckZ1bmMiLCJzdWJzY3JpYmVkQXRJbmRleCIsInB1c2hUb1N1YnNjcmliZXJzIiwicmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleCIsInNpbG9Ob2RlUm9vdEtleSIsImlubmVyIiwiaGVhZCIsInN1YnNjcmliZSIsInByb3RvdHlwZSIsImZvdW5kTm9kZSIsImZvdW5kTm9kZUNoaWxkcmVuIiwidW5zdWJzY3JpYmUiLCJvYiIsImNvbnNvbGUiLCJlcnJvciIsImNvbWJpbmVTdGF0ZSIsIlN0YXRlTm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFNQTs7OzJCQUNRQyxJQUFaLEVBQXFDO1FBQW5CQyxVQUFtQix1RUFBTixJQUFNOzs7O1NBQzlCRCxJQUFMLEdBQVlBLElBQVo7U0FDS0UsS0FBTCxHQUFhLEVBQWI7U0FDS0MsTUFBTCxHQUFjRixVQUFkO1NBRUtHLGVBQUwsR0FBdUIsS0FBS0EsZUFBTCxDQUFxQkMsSUFBckIsQ0FBMEIsSUFBMUIsQ0FBdkI7U0FDS0MsbUJBQUwsR0FBMkIsS0FBS0EsbUJBQUwsQ0FBeUJELElBQXpCLENBQThCLElBQTlCLENBQTNCOzs7Ozs7Ozs7O29DQVFjRSxjQUFjOzs7O1VBRXhCLFFBQU9BLFlBQVAsTUFBd0IsUUFBeEIsSUFBb0NDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixZQUFkLENBQXhDLEVBQXFFLE1BQU0sSUFBSUcsS0FBSixDQUFVLHlCQUFWLENBQU4sQ0FGekM7O01BSTVCQyxNQUFNLENBQUNDLElBQVAsQ0FBWUwsWUFBWixFQUEwQk0sT0FBMUIsQ0FBa0MsVUFBQUMsa0JBQWtCLEVBQUk7UUFDdEQsS0FBSSxDQUFDWixLQUFMLENBQVdZLGtCQUFYLElBQWlDO1VBQy9CQyxLQUFLLEVBQUVSLFlBQVksQ0FBQ08sa0JBQUQsQ0FEWTs7VUFHL0JFLFNBQVMsRUFBRSxLQUFJLENBQUNkLEtBQUwsQ0FBV1ksa0JBQVgsSUFB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
