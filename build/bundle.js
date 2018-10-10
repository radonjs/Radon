'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('@babel/polyfill');

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
      if (_typeof(initialState) !== 'object' || Array.isArray(initialState)) throw new Error('Input must be an object'); // loop through the state variables and create objects that hold the variable and any
      // associated modifiers

      Object.keys(initialState).forEach(function (newVariableInState) {
        _this.state[newVariableInState] = {
          value: initialState[newVariableInState],
          // accounts for initializeModifers being called prior to initializeState
          // by checking to see if this object has already been created
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
      if (_typeof(initialModifiers) !== 'object' || Array.isArray(initialModifiers)) throw new Error('Input must be an object'); // loops through the state modifiers. The same object is created here as in initializeState and it
      // will overwrite the initializeState object. But it needs to be done this way in case the dev calls 
      // initializeModifiers before they call initializeState. Now it works either way 

      Object.keys(initialModifiers).forEach(function (newModifiersInState) {
        _this2.state[newModifiersInState] = {
          // accounts for initializeState being called prior to initializeModifiers. 
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

var VirtualNode =
/*#__PURE__*/
function () {
  function VirtualNode(node, modifiers) {
    var _this = this;

    _classCallCheck(this, VirtualNode);

    this.parent = null;
    this.parents = {};

    if (node.parent) {
      this.parent = node.parent.virtualNode;
      this.parents[this.parent.name] = this.parent;
      var ancestor = this.parent;

      while (ancestor.parent !== null) {
        ancestor = ancestor.parent;
        this.parents[ancestor.name] = ancestor;
      }
    }

    this.name = node.name;
    this.type = node.type;
    this.id = node.id;

    if (this.type === PRIMITIVE) {
      //value should just be an empty object.
      //when your children are being made
      //they'll just put themselves into your value.
      this.val = node.value;
    } else {
      this.val = {};

      if (this.type === ARRAY) {
        this.val = [];
      }
    }

    if (node.type !== CONTAINER) {
      var name = node.name;
      if (name.includes('_')) name = name.split('_')[name.split('_').length - 1];
      node.parent.virtualNode.val[name] = this;

      if (this.parent.type === CONTAINER) {
        this.parent[name] = this;
      }
    }

    if (node.modifiers) {
      var modifierKeys = Object.keys(modifiers);
      modifierKeys.forEach(function (modifierKey) {
        _this[modifierKey] = modifiers[modifierKey];
      });
    }
  }

  _createClass(VirtualNode, [{
    key: "updateTo",
    value: function updateTo(data) {
      this.val = data;
    }
  }]);

  return VirtualNode;
}();

var SiloNode =
/*#__PURE__*/
function () {
  function SiloNode(name, value) {
    var _this = this;

    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var modifiers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : PRIMITIVE;
    var devTool = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

    _classCallCheck(this, SiloNode);

    this.name = name;
    this.value = value;
    this.modifiers = modifiers;
    this.queue = [];
    this.subscribers = [];
    this.parent = parent; // circular silo node

    this.type = type;
    this.devTool = devTool; // bind

    this.linkModifiers = this.linkModifiers.bind(this);
    this.runModifiers = this.runModifiers.bind(this);
    this.notifySubscribers = this.notifySubscribers.bind(this);
    this.getState = this.getState.bind(this);
    this.reconstructArray = this.reconstructArray.bind(this);
    this.reconstructObject = this.reconstructObject.bind(this);
    this.deconstructObjectIntoSiloNodes = this.deconstructObjectIntoSiloNodes.bind(this);
    this.reconstruct = this.reconstruct.bind(this);
    this.pushToSubscribers = this.pushToSubscribers.bind(this);
    this.removeFromSubscribersAtIndex = this.removeFromSubscribersAtIndex(this); // invoke functions

    this.runQueue = this.runModifiers();

    if (this.type === 'ARRAY' || this.type === 'OBJECT') {
      this.modifiers.keySubscribe = function (key, renderFunction) {
        var name = _this.name + '_' + key;
        var node = _this.value[name];
        var subscribedAtIndex = node.pushToSubscribers(renderFunction);
        node.notifySubscribers();
        return function () {
          node._subscribers.splice(subscribedAtIndex, 1);
        };
      };
    }

    this.id;
    this.issueID();
    this.virtualNode = new VirtualNode(this, this.modifiers);
  }

  _createClass(SiloNode, [{
    key: "pushToSubscribers",
    value: function pushToSubscribers(renderFunction) {
      this.subscribers.push(renderFunction);
    }
  }, {
    key: "removeFromSubscribersAtIndex",
    value: function removeFromSubscribersAtIndex(index) {
      this.subcribers = this.subscribers.slice(index, 1);
    } //there's no setter for the ID because you cant set it directly. you have to use issueID
    //issueID MUST BE CALLED ON THE NODES IN ORDER ROOT TO LEAF. it always assumes that this node's parent will
    //have had issueID called on it before. use applyToSilo to make sure it runs in the right order

  }, {
    key: "issueID",
    value: function issueID() {
      if (this.parent === null) {
        //its the root node
        this._id = this.name;
      } else {
        //its not the root node
        this._id = this.parent.id + '.' + this.name;
      }
    }
  }, {
    key: "notifySubscribers",
    value: function notifySubscribers() {
      var _this2 = this;

      if (this.subscribers.length === 0) return; // subscribers is an array of functions that notify subscribed components of state changes

      this.subscribers.forEach(function (func) {
        if (typeof func !== 'function') throw new Error('Subscriber array must only contain functions'); // pass the updated state into the subscribe functions to trigger re-renders on the frontend 

        func(_this2.getState());
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
      var running = false; // prevents multiple calls from being made if set to false

      function run() {
        return _run.apply(this, arguments);
      }

      function _run() {
        _run = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee() {
          var nextModifier, previousState;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(running === false)) {
                    _context.next = 16;
                    break;
                  }

                  // prevents multiple calls from being made if already running
                  running = true; // runs through any modifiers that have been added to the queue

                case 2:
                  if (!(this.queue.length > 0)) {
                    _context.next = 15;
                    break;
                  }

                  // enforces that we always wait for a modifier to finish before proceeding to the next
                  nextModifier = this.queue.shift();
                  previousState = null;

                  if (this.devTool) {
                    if (this.type !== PRIMITIVE) {
                      previousState = this.reconstruct(this.name, this);
                    } else {
                      previousState = this.value;
                    }
                  }

                  _context.next = 8;
                  return nextModifier();

                case 8:
                  this.value = _context.sent;

                  if (this.devTool) {
                    this.devTool.notify(previousState, this.value, this.name, nextModifier.modifierName);
                  }

                  this.virtualNode.updateTo(this.value);
                  if (this.type !== PRIMITIVE) this.value = this.deconstructObjectIntoSiloNodes().value;
                  this.notifySubscribers();
                  _context.next = 2;
                  break;

                case 15:
                  running = false;

                case 16:
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
      var _this3 = this;

      var objName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.name;
      var objectToDeconstruct = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this;
      var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.parent;
      var runLinkedMods = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var objChildren = {};
      var type, keys; // determine if the objectToDeconstruct is an array or plain object

      if (Array.isArray(objectToDeconstruct.value)) {
        keys = objectToDeconstruct.value;
        type = ARRAY;
      } else {
        keys = Object.keys(objectToDeconstruct.value);
        type = OBJECT;
      } // a silonode must be created before its children are made, because the children need to have
      // this exact silonode passed into them as a parent, hence objChildren is currently empty


      var newSiloNode = new SiloNode(objName, objChildren, parent, objectToDeconstruct.modifiers, type, this.devTool); // for arrays only

      if (Array.isArray(objectToDeconstruct.value) && objectToDeconstruct.value.length > 0) {
        // loop through the values in the objectToDeconstruct to create siloNodes for each of them
        objectToDeconstruct.value.forEach(function (indexedVal, i) {
          // recurse if the array has objects stored in its indices that need further deconstructing
          if (_typeof(indexedVal) === 'object') objChildren["".concat(objName, "_").concat(i)] = _this3.deconstructObjectIntoSiloNodes("".concat(objName, "_").concat(i), {
            value: indexedVal
          }, newSiloNode, runLinkedMods); // otherwise for primitives we can go straight to creating a new siloNode
          // the naming convention for keys involves adding '_i' to the object name
          else objChildren["".concat(objName, "_").concat(i)] = new SiloNode("".concat(objName, "_").concat(i), indexedVal, newSiloNode, {}, PRIMITIVE, _this3.devTool);
        });
      } // for plain objects
      else if (keys.length > 0) {
          // loop through the key/value pairs in the objectToDeconstruct to create siloNodes for each of them
          keys.forEach(function (key) {
            // recurse if the object has objects stored in its values that need further deconstructing
            if (_typeof(objectToDeconstruct.value[key]) === 'object') objChildren["".concat(objName, "_").concat(key)] = _this3.deconstructObjectIntoSiloNodes("".concat(objName, "_").concat(key), {
              value: objectToDeconstruct.value[key]
            }, newSiloNode, runLinkedMods); // otherwise for primitives we can go straight to creating a new siloNode
            // the naming convention for keys involves adding '_key' to the object name 
            else objChildren["".concat(objName, "_").concat(key)] = new SiloNode("".concat(objName, "_").concat(key), objectToDeconstruct.value[key], newSiloNode, {}, PRIMITIVE, _this3.devTool);
          });
        } // linkModifiers should only be run if a constructorNode has been passed into this function
      // because that means that the silo is being created for the first time and the modifiers need
      // to be wrapped. For deconstructed objects at runtime, wrapping is not required


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
      var _this4 = this;

      var nodeName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.name;
      var stateModifiers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.modifiers;
      if (!stateModifiers || Object.keys(stateModifiers).length === 0) return;
      var that = this; // loops through every modifier created by the dev

      Object.keys(stateModifiers).forEach(function (modifierKey) {
        // renamed for convenience
        var modifier = stateModifiers[modifierKey];
        if (typeof modifier !== 'function') throw new Error('All modifiers must be functions'); // modifiers with argument lengths of 2 or less are meant to edit primitive values
        // OR arrays/objects in their entirety (not specific indices)
        else if (modifier.length <= 2) {
            // the dev's modifier function needs to be wrapped in another function so we can pass 
            // the current state value into the 'current' parameter
            var linkedModifier; // for primitives we can pass the value straight into the modifier

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
            }(); // for objects we need to reconstruct the object before it is passed into the modifier
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
                            return modifier(_this4.reconstruct(nodeName, that), payload);

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
              } // the linkedModifier function will be wrapped in one more function. This final function is what
            // will be returned to the developer
            // this function adds the linkedModifier function to the async queue with the payload passed in as
            // the only parameter. Afterward the queue is invoked which will begin moving through the 
            // list of modifiers

            _this4.modifiers[modifierKey] = function (payload) {
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

              if (_this4.devTool) {
                callback.modifierName = modifierKey;
              }

              that.queue.push(callback);
              that.runQueue();
            };
          } // modifiers with argument lengths of more than 2 are meant to edit specific indices or
          // key/value pairs of objects ONLY
          else if (modifier.length > 2) {
              // the dev's modifier function needs to be wrapped in another function so we can pass 
              // the current state value into the 'current' parameter
              // reconstruct will reassemble objects but will simply return if a primitive is passed in
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
                          return modifier(_this4.reconstruct(index, that.value[index]), index, payload);

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
              }(); // the linkedModifier function will be wrapped in one more function. This final function is what
              // will be returned to the developer
              // this function adds the linkedModifier function to the async queue with the payload passed in as
              // the only parameter. Afterward the queue is invoked which will begin moving through the 
              // list of modifiers


              _this4.modifiers[modifierKey] = function (index, payload) {
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
                            return _linkedModifier("".concat(_this4.name, "_").concat(index), payload);

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
                }(); // since the modifier is called on the ARRAY/OBJECT node, we need to add the callback
                // to the queue of the child. The naming convention is: 'objectName_i' || 'objectName_key'


                if (_this4.devTool) {
                  callback.modifierName = modifierKey;
                }

                that.value["".concat(_this4.name, "_").concat(index)].queue.push(callback);
                that.value["".concat(_this4.name, "_").concat(index)].runQueue();
              };
            }
      });
      Object.keys(this.modifiers).forEach(function (modifierKey) {
        _this4.virtualNode[modifierKey] = _this4.modifiers[modifierKey];
      });
    }
    /**
     * A middleman function used for redirection. Should be called with an object needed reconstruction
     * and will then accurately assign its next destination
     * @param {string} siloNodeName - The name of the siloNode
     * @param {object} currSiloNode - The address of the parent 'OBJECT/ARRAY' siloNode
     */

  }, {
    key: "reconstruct",
    value: function reconstruct(siloNodeName, currSiloNode) {
      var reconstructedObject;
      if (currSiloNode.type === OBJECT) reconstructedObject = this.reconstructObject(siloNodeName, currSiloNode);else if (currSiloNode.type === ARRAY) reconstructedObject = this.reconstructArray(siloNodeName, currSiloNode); // called if the value passed in is a primitive
      else return currSiloNode.value;
      return reconstructedObject;
    }
    /**
     * Reconstructs plain objects out of siloNode values
     * @param {string} siloNodeName - The name of the siloNode
     * @param {object} currSiloNode - The address of the parent 'OBJECT' siloNode
     */

  }, {
    key: "reconstructObject",
    value: function reconstructObject(siloNodeName, currSiloNode) {
      var _this5 = this;

      // our currently empty object to be used for reconstruction
      var newObject = {}; // loop through the siloNodes stored in the 'OBJECT' value to extract the data

      Object.keys(currSiloNode.value).forEach(function (key) {
        // simplified name
        var childObj = currSiloNode.value[key]; // get the keyName from the naming convention
        // if the siloNode name is 'cart_shirts', the slice will give us 'shirts'

        var extractedKey = key.slice(siloNodeName.length + 1); // if an additional object is stored in the values, then we must recurse to
        // reconstruct the nested object as well

        if (childObj.type === OBJECT || childObj.type === ARRAY) {
          newObject[extractedKey] = _this5.reconstruct(key, childObj);
        } // otherwise we have a primitive value which can easily be added to the reconstructed
        // object using our extractedKey to properly label it 
        else if (childObj.type === PRIMITIVE) {
            newObject[extractedKey] = childObj.value;
          }
      }); // object successfully reconstructed at this level

      return newObject;
    }
    /**
     * Reconstructs arrays out of siloNode values
     * @param {string} siloNodeName - The name of the siloNode
     * @param {object} currSiloNode - The address of the parent 'ARRAY' siloNode
     */

  }, {
    key: "reconstructArray",
    value: function reconstructArray(siloNodeName, currSiloNode) {
      var _this6 = this;

      // our currently empty array to be used for reconstruction
      var newArray = []; // loop through the siloNodes stored in the 'ARRAY' value to extract the data

      Object.keys(currSiloNode.value).forEach(function (key, i) {
        // simplified name
        var childObj = currSiloNode.value[key]; // if an additional object is stored in the values, then we must recurse to
        // reconstruct the nested object as well

        if (childObj.type === ARRAY || childObj.type === OBJECT) {
          newArray.push(_this6.reconstruct("".concat(siloNodeName, "_").concat(i), childObj));
        } // otherwise we have a primitive value which can easily be added to the reconstructed
        // object using our extractedKey to properly label it
        else if (childObj.type === PRIMITIVE) {
            newArray.push(childObj.value);
          }
      }); // array successfully reconstructed at this level

      return newArray;
    }
  }, {
    key: "getState",
    value: function getState() {
      if (this.type === CONTAINER) {
        return this.virtualNode;
      } else {
        var context = this.virtualNode;

        while (context.type !== CONTAINER) {
          context = context.parent;
        }

        return context;
      }
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
  }, {
    key: "virtualNode",
    get: function get() {
      return this._virtualNode;
    },
    set: function set(virtualNode) {
      this._virtualNode = virtualNode;
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
  }]);

  return SiloNode;
}();

var silo = {};
var virtualSilo = {};
/**
 * Takes all of the constructorNodes created by the developer and turns them into the silo
 * @param  {...ConstructorNode} args - A list of constructor Nodes
 */

function combineNodes() {
  var devTool = null;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args[0] && args[0].devTool === true) {
    devTool = args[0];
    args.shift();
  }

  if (args.length === 0) throw new Error('combineNodes function takes at least one constructorNode'); // hastable accounts for passing in constructorNodes in any order. 
  // hashtable organizes all nodes into parent-child relationships so the silo is easier to create

  var hashTable = {}; // loop through the constructorNodes passed in as arguments

  args.forEach(function (constructorNode) {
    if (!constructorNode || constructorNode.constructor.name !== 'ConstructorNode') throw new Error('Only constructorNodes can be passed to combineNodes'); // a node with a null parent will be the root node, and there can only be one
    else if (constructorNode.parent === null) {
        // we check to see if the root key already exists in the hashtable. If so, this means a root
        // has already been established
        if (!hashTable.root) hashTable.root = [constructorNode];else throw new Error('Only one constructor node can have null parent');
      } // if the parent isn't null, then the parent is another node
      else {
          // if the parent doesn't exist as a key yet, we will create the key and set it to an array
          // that can be filled with all possible children
          if (!hashTable[constructorNode.parent]) hashTable[constructorNode.parent] = [constructorNode]; // if parent already exists, and node being added will append to the array of children
          else hashTable[constructorNode.parent].push(constructorNode);
        }
  }); // ensure there is a defined root before continuing

  if (!hashTable.root) throw new Error('At least one constructor node must have a null parent'); // a recursive function that will create siloNodes and return them to a parent

  function mapToSilo() {
    var constructorNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'root';
    var parentConstructorNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    // the very first pass will set the parent to root
    var constructorNodeName = constructorNode === 'root' ? 'root' : constructorNode.name; // recursive base case, we only continue if the current node has any constructorNode children

    if (!hashTable[constructorNodeName]) return;
    var children = {}; // loop through the children arrays in the hashtable

    hashTable[constructorNodeName].forEach(function (currConstructorNode) {
      var valuesOfCurrSiloNode = {};
      children[currConstructorNode.name] = new SiloNode(currConstructorNode.name, valuesOfCurrSiloNode, parentConstructorNode, {}, CONTAINER, devTool); // abstract some variables

      var currSiloNode = children[currConstructorNode.name];
      var stateOfCurrConstructorNode = currConstructorNode.state; // create SiloNodes for all the variables in the currConstructorNode

      Object.keys(stateOfCurrConstructorNode).forEach(function (varInConstructorNodeState) {
        // is the variable is an object/array, we need to deconstruct it into further siloNodes
        if (_typeof(stateOfCurrConstructorNode[varInConstructorNodeState].value) === 'object') {
          valuesOfCurrSiloNode[varInConstructorNodeState] = currSiloNode.deconstructObjectIntoSiloNodes(varInConstructorNodeState, stateOfCurrConstructorNode[varInConstructorNodeState], currSiloNode, true);
        } // otherwise primitives can be stored in siloNodes and the modifiers run
        else {
            valuesOfCurrSiloNode[varInConstructorNodeState] = new SiloNode(varInConstructorNodeState, stateOfCurrConstructorNode[varInConstructorNodeState].value, currSiloNode, stateOfCurrConstructorNode[varInConstructorNodeState].modifiers, PRIMITIVE, devTool);
            valuesOfCurrSiloNode[varInConstructorNodeState].linkModifiers();
          }
      }); // recursively check to see if the current constructorNode/siloNode has any children 

      var siloNodeChildren = mapToSilo(currConstructorNode, currSiloNode); // if a Node did have children, we will add those returned siloNodes as values
      // into the current siloNode

      if (siloNodeChildren) {
        Object.keys(siloNodeChildren).forEach(function (siloNode) {
          valuesOfCurrSiloNode[siloNode] = siloNodeChildren[siloNode];
        });
      }
    });
    return children;
  } // here we will get the root siloNode with all its children added


  var wrappedRootSiloNode = mapToSilo(); // add the siloNode root to the plain silo object
  // it will always only be a single key (the root) that is added into the silo

  Object.keys(wrappedRootSiloNode).forEach(function (rootSiloNode) {
    silo[rootSiloNode] = wrappedRootSiloNode[rootSiloNode];
  });

  function identify() {
    //each node's ID is a snake_case string that represents a 
    //route to that node from the top of the silo by name
    forEachSiloNode(function (node) {
      node.issueID();
    });
  }

  identify();

  function virtualize() {
    //runs through each node in the tree, turns it into a virtual node in the vSilo
    forEachSiloNode(function (node) {
      if (!virtualSilo[node.id]) {
        virtualSilo[node.id] = node.virtualNode;
      }
    });
  }

  virtualize();
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
  var unsubscribe;

  if (!!foundNode) {
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

    unsubscribe = function unsubscribe() {
      var ob;
      Object.keys(foundNodeChildren).forEach(function (key) {
        ob = foundNodeChildren[key];

        ob._subscribers.splice(ob.index, 1);
      });
    };

    foundNode.notifySubscribers();
    return unsubscribe;
  } else {
    console.error(new Error('You are trying to subscribe to something that isn\'t in the silo.'));
    return function errFunc() {
      console.error(new Error('You are trying to run unsubscribe from something that wasn\'t in the silo in the first place.'));
    };
  }
};

var combineState = combineNodes;
var StateNode = ConstructorNode;

exports.combineState = combineState;
exports.StateNode = StateNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9yYWRvbi9jb25zdHJ1Y3Rvck5vZGUuanMiLCIuLi9yYWRvbi9jb25zdGFudHMuanMiLCIuLi9yYWRvbi92aXJ0dWFsTm9kZS5qcyIsIi4uL3JhZG9uL3NpbG9Ob2RlLmpzIiwiLi4vcmFkb24vY29tYmluZU5vZGVzLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ29uc3RydWN0b3JOb2RlIHtcbiAgY29uc3RydWN0b3IobmFtZSwgcGFyZW50TmFtZSA9IG51bGwpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lOyBcbiAgICB0aGlzLnN0YXRlID0ge307XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnROYW1lO1xuICAgIFxuICAgIHRoaXMuaW5pdGlhbGl6ZVN0YXRlID0gdGhpcy5pbml0aWFsaXplU3RhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXRpYWxpemVNb2RpZmllcnMgPSB0aGlzLmluaXRpYWxpemVNb2RpZmllcnMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHZhcmlhYmxlcyB0byB0aGUgc3RhdGVcbiAgICogQHBhcmFtIHtvYmplY3R9IGluaXRpYWxTdGF0ZSAtIEFuIG9iamVjdCB3aXRoIGtleXMgYXMgdmFyaWFibGUgbmFtZXMgYW5kIHZhbHVlcyBvZiBkYXRhXG4gICAqL1xuXG4gIGluaXRpYWxpemVTdGF0ZShpbml0aWFsU3RhdGUpIHtcbiAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGUgaW5wdXQgaXMgYW4gb2JqZWN0XG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU3RhdGUgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoaW5pdGlhbFN0YXRlKSkgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgc3RhdGUgdmFyaWFibGVzIGFuZCBjcmVhdGUgb2JqZWN0cyB0aGF0IGhvbGQgdGhlIHZhcmlhYmxlIGFuZCBhbnlcbiAgICAvLyBhc3NvY2lhdGVkIG1vZGlmaWVyc1xuICAgIE9iamVjdC5rZXlzKGluaXRpYWxTdGF0ZSkuZm9yRWFjaChuZXdWYXJpYWJsZUluU3RhdGUgPT4ge1xuICAgICAgdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdID0ge1xuICAgICAgICB2YWx1ZTogaW5pdGlhbFN0YXRlW25ld1ZhcmlhYmxlSW5TdGF0ZV0sXG4gICAgICAgIC8vIGFjY291bnRzIGZvciBpbml0aWFsaXplTW9kaWZlcnMgYmVpbmcgY2FsbGVkIHByaW9yIHRvIGluaXRpYWxpemVTdGF0ZVxuICAgICAgICAvLyBieSBjaGVja2luZyB0byBzZWUgaWYgdGhpcyBvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBjcmVhdGVkXG4gICAgICAgIG1vZGlmaWVyczogdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdID8gdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdLm1vZGlmaWVycyA6IHt9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmVzIG1vZGlmaWVycyBpbiBzdGF0ZVxuICAgKiBAcGFyYW0ge29iamVjdH0gaW5pdGlhbE1vZGlmaWVycyAtIEFuIG9iamVjdCB3aXRoIGtleXMgYXNzb2NpYXRlZCB3aXRoIGV4aXN0aW5nIGluaXRpYWxpemVkIHZhcmlhYmxlcyBhbmQgdmFsdWVzIHRoYXQgYXJlIG9iamVjdHMgY29udGFpbmluZyBtb2RpZmllcnMgdG8gYmUgYm91bmQgdG8gdGhhdCBzcGVjaWZpYyB2YXJpYWJsZVxuICAgKi9cbiAgXG4gIGluaXRpYWxpemVNb2RpZmllcnMoaW5pdGlhbE1vZGlmaWVycykge1xuICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBpbnB1dCBpcyBhbiBvYmplY3RcbiAgICBpZiAodHlwZW9mIGluaXRpYWxNb2RpZmllcnMgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoaW5pdGlhbE1vZGlmaWVycykpIHRocm93IG5ldyBFcnJvcignSW5wdXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAvLyBsb29wcyB0aHJvdWdoIHRoZSBzdGF0ZSBtb2RpZmllcnMuIFRoZSBzYW1lIG9iamVjdCBpcyBjcmVhdGVkIGhlcmUgYXMgaW4gaW5pdGlhbGl6ZVN0YXRlIGFuZCBpdFxuICAgIC8vIHdpbGwgb3ZlcndyaXRlIHRoZSBpbml0aWFsaXplU3RhdGUgb2JqZWN0LiBCdXQgaXQgbmVlZHMgdG8gYmUgZG9uZSB0aGlzIHdheSBpbiBjYXNlIHRoZSBkZXYgY2FsbHMgXG4gICAgLy8gaW5pdGlhbGl6ZU1vZGlmaWVycyBiZWZvcmUgdGhleSBjYWxsIGluaXRpYWxpemVTdGF0ZS4gTm93IGl0IHdvcmtzIGVpdGhlciB3YXkgXG4gICAgT2JqZWN0LmtleXMoaW5pdGlhbE1vZGlmaWVycykuZm9yRWFjaChuZXdNb2RpZmllcnNJblN0YXRlID0+IHtcbiAgICAgIHRoaXMuc3RhdGVbbmV3TW9kaWZpZXJzSW5TdGF0ZV0gPSB7XG4gICAgICAgIC8vIGFjY291bnRzIGZvciBpbml0aWFsaXplU3RhdGUgYmVpbmcgY2FsbGVkIHByaW9yIHRvIGluaXRpYWxpemVNb2RpZmllcnMuIFxuICAgICAgICB2YWx1ZTogdGhpcy5zdGF0ZVtuZXdNb2RpZmllcnNJblN0YXRlXSA/IHRoaXMuc3RhdGVbbmV3TW9kaWZpZXJzSW5TdGF0ZV0udmFsdWUgOiBudWxsLFxuICAgICAgICBtb2RpZmllcnM6IGluaXRpYWxNb2RpZmllcnNbbmV3TW9kaWZpZXJzSW5TdGF0ZV1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCBuYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoJ05hbWUgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIGVsc2UgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIHNldCBwYXJlbnQocGFyZW50KSB7XG4gICAgaWYgKHR5cGVvZiBwYXJlbnQgIT09ICdzdHJpbmcnICYmIHBhcmVudCAhPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdQYXJlbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIGVsc2UgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgZ2V0IHBhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29uc3RydWN0b3JOb2RlOyIsImV4cG9ydCBjb25zdCBBUlJBWSA9ICdBUlJBWSc7XG5leHBvcnQgY29uc3QgT0JKRUNUID0gJ09CSkVDVCc7XG5leHBvcnQgY29uc3QgUFJJTUlUSVZFID0gJ1BSSU1JVElWRSc7XG5leHBvcnQgY29uc3QgQ09OVEFJTkVSID0gJ0NPTlRBSU5FUic7IiwiaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi9jb25zdGFudHMnXG5cbmNsYXNzIFZpcnR1YWxOb2RlIHtcbiAgY29uc3RydWN0b3IgKG5vZGUsIG1vZGlmaWVycykge1xuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLnBhcmVudHMgPSB7fTtcbiAgICBpZiAobm9kZS5wYXJlbnQpe1xuICAgICAgICAgIFxuICAgICAgdGhpcy5wYXJlbnQgPSBub2RlLnBhcmVudC52aXJ0dWFsTm9kZTtcbiAgICAgIHRoaXMucGFyZW50c1t0aGlzLnBhcmVudC5uYW1lXSA9IHRoaXMucGFyZW50O1xuICAgICAgbGV0IGFuY2VzdG9yID0gdGhpcy5wYXJlbnQ7XG4gICAgICBcbiAgICAgIHdoaWxlKGFuY2VzdG9yLnBhcmVudCAhPT0gbnVsbCl7XG4gICAgICAgIGFuY2VzdG9yID0gYW5jZXN0b3IucGFyZW50O1xuICAgICAgICB0aGlzLnBhcmVudHNbYW5jZXN0b3IubmFtZV0gPSBhbmNlc3RvcjtcbiAgICAgIH1cbiAgICB9IFxuXG4gICAgdGhpcy5uYW1lID0gbm9kZS5uYW1lO1xuICAgIHRoaXMudHlwZSA9IG5vZGUudHlwZTtcbiAgICB0aGlzLmlkID0gbm9kZS5pZDtcblxuICAgIGlmICh0aGlzLnR5cGUgPT09IHR5cGVzLlBSSU1JVElWRSl7XG4gICAgICAvL3ZhbHVlIHNob3VsZCBqdXN0IGJlIGFuIGVtcHR5IG9iamVjdC5cbiAgICAgIC8vd2hlbiB5b3VyIGNoaWxkcmVuIGFyZSBiZWluZyBtYWRlXG4gICAgICAvL3RoZXknbGwganVzdCBwdXQgdGhlbXNlbHZlcyBpbnRvIHlvdXIgdmFsdWUuXG4gICAgICB0aGlzLnZhbCA9IG5vZGUudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsID0ge307XG4gICAgICBpZih0aGlzLnR5cGUgPT09IHR5cGVzLkFSUkFZKXsgdGhpcy52YWwgPSBbXSB9IFxuICAgIH0gXG5cbiAgICBpZiAobm9kZS50eXBlICE9PSB0eXBlcy5DT05UQUlORVIpe1xuICAgICAgbGV0IG5hbWUgPSBub2RlLm5hbWU7XG4gICAgICBpZihuYW1lLmluY2x1ZGVzKCdfJykpIG5hbWUgPSBuYW1lLnNwbGl0KCdfJylbbmFtZS5zcGxpdCgnXycpLmxlbmd0aCAtIDFdO1xuXG4gICAgICBub2RlLnBhcmVudC52aXJ0dWFsTm9kZS52YWxbbmFtZV0gPSB0aGlzO1xuICAgICAgaWYodGhpcy5wYXJlbnQudHlwZSA9PT0gdHlwZXMuQ09OVEFJTkVSKXtcbiAgICAgICAgdGhpcy5wYXJlbnRbbmFtZV0gPSB0aGlzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlLm1vZGlmaWVycyl7XG4gICAgICBsZXQgbW9kaWZpZXJLZXlzID0gT2JqZWN0LmtleXMobW9kaWZpZXJzKTtcbiAgICAgIG1vZGlmaWVyS2V5cy5mb3JFYWNoKG1vZGlmaWVyS2V5ID0+IHtcbiAgICAgICAgdGhpc1ttb2RpZmllcktleV0gPSBtb2RpZmllcnNbbW9kaWZpZXJLZXldO1xuICAgICAgfSlcbiAgICB9XG5cbiAgfSAgIFxuICB1cGRhdGVUbyhkYXRhKXtcbiAgICB0aGlzLnZhbCA9IGRhdGE7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlydHVhbE5vZGU7XG4iLCJpbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgVmlydHVhbE5vZGUgZnJvbSAnLi92aXJ0dWFsTm9kZS5qcydcblxuXG5jbGFzcyBTaWxvTm9kZSB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIHZhbHVlLCBwYXJlbnQgPSBudWxsLCBtb2RpZmllcnMgPSB7fSwgdHlwZSA9IHR5cGVzLlBSSU1JVElWRSwgZGV2VG9vbCA9IG51bGwpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLm1vZGlmaWVycyA9IG1vZGlmaWVycztcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5zdWJzY3JpYmVycyA9IFtdO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50OyAvLyBjaXJjdWxhciBzaWxvIG5vZGVcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuZGV2VG9vbCA9IGRldlRvb2w7XG5cbiAgICAvLyBiaW5kXG4gICAgdGhpcy5saW5rTW9kaWZpZXJzID0gdGhpcy5saW5rTW9kaWZpZXJzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ydW5Nb2RpZmllcnMgPSB0aGlzLnJ1bk1vZGlmaWVycy5iaW5kKHRoaXMpO1xuICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMgPSB0aGlzLm5vdGlmeVN1YnNjcmliZXJzLmJpbmQodGhpcyk7IFxuICAgIHRoaXMuZ2V0U3RhdGUgPSB0aGlzLmdldFN0YXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNvbnN0cnVjdEFycmF5ID0gdGhpcy5yZWNvbnN0cnVjdEFycmF5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNvbnN0cnVjdE9iamVjdCA9IHRoaXMucmVjb25zdHJ1Y3RPYmplY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyA9IHRoaXMuZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNvbnN0cnVjdCA9IHRoaXMucmVjb25zdHJ1Y3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLnB1c2hUb1N1YnNjcmliZXJzID0gdGhpcy5wdXNoVG9TdWJzY3JpYmVycy5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleCA9IHRoaXMucmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleCh0aGlzKTtcbiAgICBcbiAgICAvLyBpbnZva2UgZnVuY3Rpb25zXG4gICAgdGhpcy5ydW5RdWV1ZSA9IHRoaXMucnVuTW9kaWZpZXJzKCk7XG4gICAgXG4gICAgaWYodGhpcy50eXBlID09PSAnQVJSQVknIHx8IHRoaXMudHlwZSA9PT0gJ09CSkVDVCcpe1xuICAgICAgdGhpcy5tb2RpZmllcnMua2V5U3Vic2NyaWJlID0gKGtleSwgcmVuZGVyRnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMubmFtZSArICdfJyArIGtleTtcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLnZhbHVlW25hbWVdXG4gICAgICAgIGNvbnN0IHN1YnNjcmliZWRBdEluZGV4ID0gbm9kZS5wdXNoVG9TdWJzY3JpYmVycyhyZW5kZXJGdW5jdGlvbik7XG4gICAgICAgIG5vZGUubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtub2RlLl9zdWJzY3JpYmVycy5zcGxpY2Uoc3Vic2NyaWJlZEF0SW5kZXgsIDEpfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB0aGlzLmlkO1xuICAgIHRoaXMuaXNzdWVJRCgpO1xuICAgIHRoaXMudmlydHVhbE5vZGUgPSBuZXcgVmlydHVhbE5vZGUodGhpcywgdGhpcy5tb2RpZmllcnMpO1xuICB9XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gIH1cblxuICBzZXQgbmFtZShuYW1lKSB7XG4gICAgaWYgKCFuYW1lIHx8IHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IEVycm9yKCdOYW1lIGlzIHJlcXVpcmVkIGFuZCBzaG91bGQgYmUgYSBzdHJpbmcnKVxuICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgfVxuXG4gIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbW9kaWZpZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9tb2RpZmllcnM7XG4gIH1cblxuICBzZXQgbW9kaWZpZXJzKG1vZGlmaWVycykge1xuICAgIGlmICh0eXBlb2YgbW9kaWZpZXJzICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KG1vZGlmaWVycykpIHRocm93IG5ldyBFcnJvcignTW9kaWZpZXJzIG11c3QgYmUgYSBwbGFpbiBvYmplY3QnKTtcbiAgICB0aGlzLl9tb2RpZmllcnMgPSBtb2RpZmllcnM7XG4gIH1cblxuICBnZXQgcXVldWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3F1ZXVlO1xuICB9XG5cbiAgc2V0IHF1ZXVlKHF1ZXVlKSB7XG4gICAgdGhpcy5fcXVldWUgPSBxdWV1ZTtcbiAgfVxuXG4gIGdldCBwYXJlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgfVxuXG4gIHNldCBwYXJlbnQocGFyZW50KSB7XG4gICAgaWYgKHBhcmVudCAmJiBwYXJlbnQuY29uc3RydWN0b3IubmFtZSAhPT0gJ1NpbG9Ob2RlJykgdGhyb3cgbmV3IEVycm9yKCdQYXJlbnQgbXVzdCBiZSBudWxsIG9yIGEgc2lsb05vZGUnKTtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICBnZXQgc3Vic2NyaWJlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N1YnNjcmliZXJzO1xuICB9XG5cbiAgc2V0IHN1YnNjcmliZXJzKHN1YnNjcmliZXJzKSB7XG4gICAgdGhpcy5fc3Vic2NyaWJlcnMgPSBzdWJzY3JpYmVycztcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLl90eXBlO1xuICB9XG5cbiAgc2V0IHR5cGUodHlwZSkge1xuICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycgfHwgIXR5cGVzW3R5cGVdKSB0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgbXVzdCBiZSBhbiBhdmFpbGFibGUgY29uc3RhbnQnKTtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgfVxuXG4gIGdldCB2aXJ0dWFsTm9kZSgpe1xuICAgIHJldHVybiB0aGlzLl92aXJ0dWFsTm9kZVxuICB9XG5cbiAgc2V0IHZpcnR1YWxOb2RlKHZpcnR1YWxOb2RlKXtcbiAgICB0aGlzLl92aXJ0dWFsTm9kZSA9IHZpcnR1YWxOb2RlO1xuICB9XG5cbiAgZ2V0IGlkKCl7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiBcblxuICBwdXNoVG9TdWJzY3JpYmVycyhyZW5kZXJGdW5jdGlvbil7XG4gICAgdGhpcy5zdWJzY3JpYmVycy5wdXNoKHJlbmRlckZ1bmN0aW9uKTtcbiAgfVxuXG4gIHJlbW92ZUZyb21TdWJzY3JpYmVyc0F0SW5kZXgoaW5kZXgpe1xuICAgIHRoaXMuc3ViY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnMuc2xpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgLy90aGVyZSdzIG5vIHNldHRlciBmb3IgdGhlIElEIGJlY2F1c2UgeW91IGNhbnQgc2V0IGl0IGRpcmVjdGx5LiB5b3UgaGF2ZSB0byB1c2UgaXNzdWVJRFxuXG4gIC8vaXNzdWVJRCBNVVNUIEJFIENBTExFRCBPTiBUSEUgTk9ERVMgSU4gT1JERVIgUk9PVCBUTyBMRUFGLiBpdCBhbHdheXMgYXNzdW1lcyB0aGF0IHRoaXMgbm9kZSdzIHBhcmVudCB3aWxsXG4gIC8vaGF2ZSBoYWQgaXNzdWVJRCBjYWxsZWQgb24gaXQgYmVmb3JlLiB1c2UgYXBwbHlUb1NpbG8gdG8gbWFrZSBzdXJlIGl0IHJ1bnMgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gIGlzc3VlSUQoKXtcbiAgICBpZih0aGlzLnBhcmVudCA9PT0gbnVsbCl7IC8vaXRzIHRoZSByb290IG5vZGVcbiAgICAgIHRoaXMuX2lkID0gdGhpcy5uYW1lO1xuICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgLy9pdHMgbm90IHRoZSByb290IG5vZGVcbiAgICAgIHRoaXMuX2lkID0gdGhpcy5wYXJlbnQuaWQgKyAnLicgKyB0aGlzLm5hbWU7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5U3Vic2NyaWJlcnMoKSB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaWJlcnMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgLy8gc3Vic2NyaWJlcnMgaXMgYW4gYXJyYXkgb2YgZnVuY3Rpb25zIHRoYXQgbm90aWZ5IHN1YnNjcmliZWQgY29tcG9uZW50cyBvZiBzdGF0ZSBjaGFuZ2VzXG4gICAgdGhpcy5zdWJzY3JpYmVycy5mb3JFYWNoKGZ1bmMgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBmdW5jICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgRXJyb3IoJ1N1YnNjcmliZXIgYXJyYXkgbXVzdCBvbmx5IGNvbnRhaW4gZnVuY3Rpb25zJyk7XG4gICAgICAvLyBwYXNzIHRoZSB1cGRhdGVkIHN0YXRlIGludG8gdGhlIHN1YnNjcmliZSBmdW5jdGlvbnMgdG8gdHJpZ2dlciByZS1yZW5kZXJzIG9uIHRoZSBmcm9udGVuZCBcbiAgICAgIGZ1bmModGhpcy5nZXRTdGF0ZSgpKTtcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEludm9rZWQgb25jZSBpbiB0aGUgc2lsb05vZGUgY29uc3RydWN0b3IgdG8gY3JlYXRlIGEgY2xvc3VyZS4gVGhlIGNsb3N1cmUgdmFyaWFibGUgXG4gICAqICdydW5uaW5nJyBwcmV2ZW50cyB0aGUgcmV0dXJuZWQgYXN5bmMgZnVuY3Rpb24gZnJvbSBiZWluZyBpbnZva2VkIGlmIGl0J3NcbiAgICogc3RpbGwgcnVubmluZyBmcm9tIGEgcHJldmlvdXMgY2FsbFxuICAgKi9cbiAgcnVuTW9kaWZpZXJzKCkge1xuICAgIGxldCBydW5uaW5nID0gZmFsc2U7IC8vIHByZXZlbnRzIG11bHRpcGxlIGNhbGxzIGZyb20gYmVpbmcgbWFkZSBpZiBzZXQgdG8gZmFsc2VcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHJ1bigpIHtcbiAgICAgIGlmIChydW5uaW5nID09PSBmYWxzZSkgeyAvLyBwcmV2ZW50cyBtdWx0aXBsZSBjYWxscyBmcm9tIGJlaW5nIG1hZGUgaWYgYWxyZWFkeSBydW5uaW5nXG4gICAgICAgIHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAvLyBydW5zIHRocm91Z2ggYW55IG1vZGlmaWVycyB0aGF0IGhhdmUgYmVlbiBhZGRlZCB0byB0aGUgcXVldWVcbiAgICAgICAgd2hpbGUgKHRoaXMucXVldWUubGVuZ3RoID4gMCkge1xuXG4gICAgICAgICAgLy8gZW5mb3JjZXMgdGhhdCB3ZSBhbHdheXMgd2FpdCBmb3IgYSBtb2RpZmllciB0byBmaW5pc2ggYmVmb3JlIHByb2NlZWRpbmcgdG8gdGhlIG5leHRcbiAgICAgICAgICBsZXQgbmV4dE1vZGlmaWVyID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgIGxldCBwcmV2aW91c1N0YXRlID0gbnVsbDtcbiAgICAgICAgICBpZih0aGlzLmRldlRvb2wpIHtcbiAgICAgICAgICAgIGlmKHRoaXMudHlwZSAhPT0gdHlwZXMuUFJJTUlUSVZFKSB7XG4gICAgICAgICAgICAgIHByZXZpb3VzU3RhdGUgPSB0aGlzLnJlY29uc3RydWN0KHRoaXMubmFtZSwgdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwcmV2aW91c1N0YXRlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy52YWx1ZSA9IGF3YWl0IG5leHRNb2RpZmllcigpO1xuICAgICAgICAgIGlmKHRoaXMuZGV2VG9vbCkge1xuICAgICAgICAgICAgdGhpcy5kZXZUb29sLm5vdGlmeShwcmV2aW91c1N0YXRlLCB0aGlzLnZhbHVlLCB0aGlzLm5hbWUsIG5leHRNb2RpZmllci5tb2RpZmllck5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnZpcnR1YWxOb2RlLnVwZGF0ZVRvKHRoaXMudmFsdWUpO1xuICAgICAgICAgIGlmICh0aGlzLnR5cGUgIT09IHR5cGVzLlBSSU1JVElWRSkgdGhpcy52YWx1ZSA9IHRoaXMuZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzKCkudmFsdWU7XG4gICAgICAgICAgXG4gICAgICAgICAgdGhpcy5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgICAgICB9XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTsgICBcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcnVuO1xuICB9XG5cbiAgLyoqXG4gICAqIERlY29uc3RydWN0cyBvYmplY3RzIGludG8gYSBwYXJlbnQgc2lsb05vZGUgd2l0aCBhIHR5cGUgb2Ygb2JqZWN0L2FycmF5LCBhbmRcbiAgICogY2hpbGRyZW4gc2lsb05vZGVzIHdpdGggdmFsdWVzIHBlcnRhaW5pbmcgdG8gdGhlIGNvbnRlbnRzIG9mIHRoZSBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IG9iak5hbWUgLSBUaGUgaW50ZW5kZWQga2V5IG9mIHRoZSBvYmplY3Qgd2hlbiBzdG9yZWQgaW4gdGhlIHNpbG9cbiAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFRvRGVjb25zdHJ1Y3QgLSBBbnkgb2JqZWN0IHRoYXQgbXVzdCBjb250YWluIGEga2V5IG9mIHZhbHVlXG4gICAqIEBwYXJhbSB7U2lsb05vZGV9IHBhcmVudCAtIEludGVuZGVkIFNpbG9Ob2RlIHBhcmVudCB0byB0aGUgZGVjb25zdHJ1Y3RlZCBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBydW5MaW5rZWRNb2RzIC0gVHJ1ZSBvbmx5IHdoZW4gYmVpbmcgY2FsbGVkIGZvciBhIGNvbnN0cnVjdG9yTm9kZVxuICAgKi9cbiAgZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzKG9iak5hbWUgPSB0aGlzLm5hbWUsIG9iamVjdFRvRGVjb25zdHJ1Y3QgPSB0aGlzLCBwYXJlbnQgPSB0aGlzLnBhcmVudCwgcnVuTGlua2VkTW9kcyA9IGZhbHNlKSB7XG4gICAgY29uc3Qgb2JqQ2hpbGRyZW4gPSB7fTtcbiAgICBsZXQgdHlwZSwga2V5cztcbiAgXG4gICAgLy8gZGV0ZXJtaW5lIGlmIHRoZSBvYmplY3RUb0RlY29uc3RydWN0IGlzIGFuIGFycmF5IG9yIHBsYWluIG9iamVjdFxuICAgIGlmIChBcnJheS5pc0FycmF5KG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWUpKSB7XG4gICAgICBrZXlzID0gb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZTtcbiAgICAgIHR5cGUgPSB0eXBlcy5BUlJBWTtcbiAgICB9IGVsc2Uge1xuICAgICAga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWUpO1xuICAgICAgdHlwZSA9IHR5cGVzLk9CSkVDVDtcbiAgICB9XG4gICAgXG4gICAgLy8gYSBzaWxvbm9kZSBtdXN0IGJlIGNyZWF0ZWQgYmVmb3JlIGl0cyBjaGlsZHJlbiBhcmUgbWFkZSwgYmVjYXVzZSB0aGUgY2hpbGRyZW4gbmVlZCB0byBoYXZlXG4gICAgLy8gdGhpcyBleGFjdCBzaWxvbm9kZSBwYXNzZWQgaW50byB0aGVtIGFzIGEgcGFyZW50LCBoZW5jZSBvYmpDaGlsZHJlbiBpcyBjdXJyZW50bHkgZW1wdHlcbiAgICBjb25zdCBuZXdTaWxvTm9kZSA9IG5ldyBTaWxvTm9kZShvYmpOYW1lLCBvYmpDaGlsZHJlbiwgcGFyZW50LCBvYmplY3RUb0RlY29uc3RydWN0Lm1vZGlmaWVycywgdHlwZSwgdGhpcy5kZXZUb29sKTtcbiAgICBcbiAgICAvLyBmb3IgYXJyYXlzIG9ubHlcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlKSAmJiBvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgdmFsdWVzIGluIHRoZSBvYmplY3RUb0RlY29uc3RydWN0IHRvIGNyZWF0ZSBzaWxvTm9kZXMgZm9yIGVhY2ggb2YgdGhlbVxuICAgICAgb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZS5mb3JFYWNoKChpbmRleGVkVmFsLCBpKSA9PiB7XG4gICAgICAgIC8vIHJlY3Vyc2UgaWYgdGhlIGFycmF5IGhhcyBvYmplY3RzIHN0b3JlZCBpbiBpdHMgaW5kaWNlcyB0aGF0IG5lZWQgZnVydGhlciBkZWNvbnN0cnVjdGluZ1xuICAgICAgICBpZiAodHlwZW9mIGluZGV4ZWRWYWwgPT09ICdvYmplY3QnKSBvYmpDaGlsZHJlbltgJHtvYmpOYW1lfV8ke2l9YF0gPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyhgJHtvYmpOYW1lfV8ke2l9YCwge3ZhbHVlOiBpbmRleGVkVmFsfSwgbmV3U2lsb05vZGUsIHJ1bkxpbmtlZE1vZHMpO1xuICAgICAgICAvLyBvdGhlcndpc2UgZm9yIHByaW1pdGl2ZXMgd2UgY2FuIGdvIHN0cmFpZ2h0IHRvIGNyZWF0aW5nIGEgbmV3IHNpbG9Ob2RlXG4gICAgICAgIC8vIHRoZSBuYW1pbmcgY29udmVudGlvbiBmb3Iga2V5cyBpbnZvbHZlcyBhZGRpbmcgJ19pJyB0byB0aGUgb2JqZWN0IG5hbWVcbiAgICAgICAgZWxzZSBvYmpDaGlsZHJlbltgJHtvYmpOYW1lfV8ke2l9YF0gPSBuZXcgU2lsb05vZGUoYCR7b2JqTmFtZX1fJHtpfWAsIGluZGV4ZWRWYWwsIG5ld1NpbG9Ob2RlLCB7fSwgdHlwZXMuUFJJTUlUSVZFLCB0aGlzLmRldlRvb2wpO1xuICAgICAgfSlcbiAgICB9IFxuICAgIFxuICAgIC8vIGZvciBwbGFpbiBvYmplY3RzXG4gICAgZWxzZSBpZiAoa2V5cy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGtleS92YWx1ZSBwYWlycyBpbiB0aGUgb2JqZWN0VG9EZWNvbnN0cnVjdCB0byBjcmVhdGUgc2lsb05vZGVzIGZvciBlYWNoIG9mIHRoZW1cbiAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAvLyByZWN1cnNlIGlmIHRoZSBvYmplY3QgaGFzIG9iamVjdHMgc3RvcmVkIGluIGl0cyB2YWx1ZXMgdGhhdCBuZWVkIGZ1cnRoZXIgZGVjb25zdHJ1Y3RpbmdcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlW2tleV0gPT09ICdvYmplY3QnKSBvYmpDaGlsZHJlbltgJHtvYmpOYW1lfV8ke2tleX1gXSA9IHRoaXMuZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzKGAke29iak5hbWV9XyR7a2V5fWAsIHt2YWx1ZTogb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZVtrZXldfSwgbmV3U2lsb05vZGUsIHJ1bkxpbmtlZE1vZHMpO1xuICAgICAgICAvLyBvdGhlcndpc2UgZm9yIHByaW1pdGl2ZXMgd2UgY2FuIGdvIHN0cmFpZ2h0IHRvIGNyZWF0aW5nIGEgbmV3IHNpbG9Ob2RlXG4gICAgICAgIC8vIHRoZSBuYW1pbmcgY29udmVudGlvbiBmb3Iga2V5cyBpbnZvbHZlcyBhZGRpbmcgJ19rZXknIHRvIHRoZSBvYmplY3QgbmFtZSBcbiAgICAgICAgZWxzZSBvYmpDaGlsZHJlbltgJHtvYmpOYW1lfV8ke2tleX1gXSA9IG5ldyBTaWxvTm9kZShgJHtvYmpOYW1lfV8ke2tleX1gLCBvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlW2tleV0sIG5ld1NpbG9Ob2RlLCB7fSwgdHlwZXMuUFJJTUlUSVZFLCB0aGlzLmRldlRvb2wpO1xuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBsaW5rTW9kaWZpZXJzIHNob3VsZCBvbmx5IGJlIHJ1biBpZiBhIGNvbnN0cnVjdG9yTm9kZSBoYXMgYmVlbiBwYXNzZWQgaW50byB0aGlzIGZ1bmN0aW9uXG4gICAgLy8gYmVjYXVzZSB0aGF0IG1lYW5zIHRoYXQgdGhlIHNpbG8gaXMgYmVpbmcgY3JlYXRlZCBmb3IgdGhlIGZpcnN0IHRpbWUgYW5kIHRoZSBtb2RpZmllcnMgbmVlZFxuICAgIC8vIHRvIGJlIHdyYXBwZWQuIEZvciBkZWNvbnN0cnVjdGVkIG9iamVjdHMgYXQgcnVudGltZSwgd3JhcHBpbmcgaXMgbm90IHJlcXVpcmVkXG4gICAgaWYgKHJ1bkxpbmtlZE1vZHMpIG5ld1NpbG9Ob2RlLmxpbmtNb2RpZmllcnMoKTtcblxuICAgIHJldHVybiBuZXdTaWxvTm9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwcyBkZXZlbG9wZXIgd3JpdHRlbiBtb2RpZmllcnMgaW4gYXN5bmMgZnVuY3Rpb25zIHdpdGggc3RhdGUgcGFzc2VkIGluIGF1dG9tYXRpY2FsbHlcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vZGVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNpbG9Ob2RlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZU1vZGlmaWVycyAtIEFuIG9iamVjdCBjb250YWluaW5nIHVud3JhcHBlZCBtb2RpZmllcnMgbW9zdCBsaWtlbHkgZnJvbSB0aGUgY29uc3RydWN0b3JOb2RlXG4gICAqL1xuICBsaW5rTW9kaWZpZXJzKG5vZGVOYW1lID0gdGhpcy5uYW1lLCBzdGF0ZU1vZGlmaWVycyA9IHRoaXMubW9kaWZpZXJzKSB7XG4gICAgaWYgKCFzdGF0ZU1vZGlmaWVycyB8fCBPYmplY3Qua2V5cyhzdGF0ZU1vZGlmaWVycykubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICAvLyBsb29wcyB0aHJvdWdoIGV2ZXJ5IG1vZGlmaWVyIGNyZWF0ZWQgYnkgdGhlIGRldlxuICAgIE9iamVjdC5rZXlzKHN0YXRlTW9kaWZpZXJzKS5mb3JFYWNoKG1vZGlmaWVyS2V5ID0+IHtcblxuICAgICAgLy8gcmVuYW1lZCBmb3IgY29udmVuaWVuY2VcbiAgICAgIGNvbnN0IG1vZGlmaWVyID0gc3RhdGVNb2RpZmllcnNbbW9kaWZpZXJLZXldO1xuICAgICAgaWYgKHR5cGVvZiBtb2RpZmllciAhPT0gJ2Z1bmN0aW9uJyApIHRocm93IG5ldyBFcnJvcignQWxsIG1vZGlmaWVycyBtdXN0IGJlIGZ1bmN0aW9ucycpOyBcblxuICAgICAgLy8gbW9kaWZpZXJzIHdpdGggYXJndW1lbnQgbGVuZ3RocyBvZiAyIG9yIGxlc3MgYXJlIG1lYW50IHRvIGVkaXQgcHJpbWl0aXZlIHZhbHVlc1xuICAgICAgLy8gT1IgYXJyYXlzL29iamVjdHMgaW4gdGhlaXIgZW50aXJldHkgKG5vdCBzcGVjaWZpYyBpbmRpY2VzKVxuICAgICAgZWxzZSBpZiAobW9kaWZpZXIubGVuZ3RoIDw9IDIpIHtcbiAgICAgICAgLy8gdGhlIGRldidzIG1vZGlmaWVyIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHdyYXBwZWQgaW4gYW5vdGhlciBmdW5jdGlvbiBzbyB3ZSBjYW4gcGFzcyBcbiAgICAgICAgLy8gdGhlIGN1cnJlbnQgc3RhdGUgdmFsdWUgaW50byB0aGUgJ2N1cnJlbnQnIHBhcmFtZXRlclxuICAgICAgICBsZXQgbGlua2VkTW9kaWZpZXI7XG4gICAgICAgIC8vIGZvciBwcmltaXRpdmVzIHdlIGNhbiBwYXNzIHRoZSB2YWx1ZSBzdHJhaWdodCBpbnRvIHRoZSBtb2RpZmllclxuICAgICAgICBpZiAodGhhdC50eXBlID09PSB0eXBlcy5QUklNSVRJVkUpIGxpbmtlZE1vZGlmaWVyID0gYXN5bmMgKHBheWxvYWQpID0+IGF3YWl0IG1vZGlmaWVyKHRoYXQudmFsdWUsIHBheWxvYWQpO1xuICAgICAgICAvLyBmb3Igb2JqZWN0cyB3ZSBuZWVkIHRvIHJlY29uc3RydWN0IHRoZSBvYmplY3QgYmVmb3JlIGl0IGlzIHBhc3NlZCBpbnRvIHRoZSBtb2RpZmllclxuICAgICAgICBlbHNlIGlmICh0aGF0LnR5cGUgPT09IHR5cGVzLk9CSkVDVCB8fCB0aGF0LnR5cGUgPT09IHR5cGVzLkFSUkFZKSB7XG4gICAgICAgICAgbGlua2VkTW9kaWZpZXIgPSBhc3luYyAocGF5bG9hZCkgPT4gYXdhaXQgbW9kaWZpZXIodGhpcy5yZWNvbnN0cnVjdChub2RlTmFtZSwgdGhhdCksIHBheWxvYWQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyB0aGUgbGlua2VkTW9kaWZpZXIgZnVuY3Rpb24gd2lsbCBiZSB3cmFwcGVkIGluIG9uZSBtb3JlIGZ1bmN0aW9uLiBUaGlzIGZpbmFsIGZ1bmN0aW9uIGlzIHdoYXRcbiAgICAgICAgLy8gd2lsbCBiZSByZXR1cm5lZCB0byB0aGUgZGV2ZWxvcGVyXG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gYWRkcyB0aGUgbGlua2VkTW9kaWZpZXIgZnVuY3Rpb24gdG8gdGhlIGFzeW5jIHF1ZXVlIHdpdGggdGhlIHBheWxvYWQgcGFzc2VkIGluIGFzXG4gICAgICAgIC8vIHRoZSBvbmx5IHBhcmFtZXRlci4gQWZ0ZXJ3YXJkIHRoZSBxdWV1ZSBpcyBpbnZva2VkIHdoaWNoIHdpbGwgYmVnaW4gbW92aW5nIHRocm91Z2ggdGhlIFxuICAgICAgICAvLyBsaXN0IG9mIG1vZGlmaWVyc1xuICAgICAgICB0aGlzLm1vZGlmaWVyc1ttb2RpZmllcktleV0gPSBwYXlsb2FkID0+IHtcbiAgICAgICAgICAvLyB3cmFwIHRoZSBsaW5rZWRNb2RpZmllciBhZ2FpbiBzbyB0aGF0IGl0IGNhbiBiZSBhZGRlZCB0byB0aGUgYXN5bmMgcXVldWUgd2l0aG91dCBiZWluZyBpbnZva2VkXG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBhc3luYyAoKSA9PiBhd2FpdCBsaW5rZWRNb2RpZmllcihwYXlsb2FkKTtcbiAgICAgICAgICBpZih0aGlzLmRldlRvb2wpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrLm1vZGlmaWVyTmFtZSA9IG1vZGlmaWVyS2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGF0LnF1ZXVlLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgIHRoYXQucnVuUXVldWUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBtb2RpZmllcnMgd2l0aCBhcmd1bWVudCBsZW5ndGhzIG9mIG1vcmUgdGhhbiAyIGFyZSBtZWFudCB0byBlZGl0IHNwZWNpZmljIGluZGljZXMgb3JcbiAgICAgIC8vIGtleS92YWx1ZSBwYWlycyBvZiBvYmplY3RzIE9OTFlcbiAgICAgIGVsc2UgaWYgKG1vZGlmaWVyLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgLy8gdGhlIGRldidzIG1vZGlmaWVyIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHdyYXBwZWQgaW4gYW5vdGhlciBmdW5jdGlvbiBzbyB3ZSBjYW4gcGFzcyBcbiAgICAgICAgLy8gdGhlIGN1cnJlbnQgc3RhdGUgdmFsdWUgaW50byB0aGUgJ2N1cnJlbnQnIHBhcmFtZXRlclxuICAgICAgICAvLyByZWNvbnN0cnVjdCB3aWxsIHJlYXNzZW1ibGUgb2JqZWN0cyBidXQgd2lsbCBzaW1wbHkgcmV0dXJuIGlmIGEgcHJpbWl0aXZlIGlzIHBhc3NlZCBpblxuICAgICAgICBjb25zdCBsaW5rZWRNb2RpZmllciA9IGFzeW5jIChpbmRleCwgcGF5bG9hZCkgPT4gYXdhaXQgbW9kaWZpZXIodGhpcy5yZWNvbnN0cnVjdChpbmRleCwgdGhhdC52YWx1ZVtpbmRleF0pLCBpbmRleCwgcGF5bG9hZCk7IFxuXG4gICAgICAgIC8vIHRoZSBsaW5rZWRNb2RpZmllciBmdW5jdGlvbiB3aWxsIGJlIHdyYXBwZWQgaW4gb25lIG1vcmUgZnVuY3Rpb24uIFRoaXMgZmluYWwgZnVuY3Rpb24gaXMgd2hhdFxuICAgICAgICAvLyB3aWxsIGJlIHJldHVybmVkIHRvIHRoZSBkZXZlbG9wZXJcbiAgICAgICAgLy8gdGhpcyBmdW5jdGlvbiBhZGRzIHRoZSBsaW5rZWRNb2RpZmllciBmdW5jdGlvbiB0byB0aGUgYXN5bmMgcXVldWUgd2l0aCB0aGUgcGF5bG9hZCBwYXNzZWQgaW4gYXNcbiAgICAgICAgLy8gdGhlIG9ubHkgcGFyYW1ldGVyLiBBZnRlcndhcmQgdGhlIHF1ZXVlIGlzIGludm9rZWQgd2hpY2ggd2lsbCBiZWdpbiBtb3ZpbmcgdGhyb3VnaCB0aGUgXG4gICAgICAgIC8vIGxpc3Qgb2YgbW9kaWZpZXJzXG4gICAgICAgIHRoaXMubW9kaWZpZXJzW21vZGlmaWVyS2V5XSA9IChpbmRleCwgcGF5bG9hZCkgPT4ge1xuICAgICAgICAgIC8vIHdyYXAgdGhlIGxpbmtlZE1vZGlmaWVyIGFnYWluIHNvIHRoYXQgaXQgY2FuIGJlIGFkZGVkIHRvIHRoZSBhc3luYyBxdWV1ZSB3aXRob3V0IGJlaW5nIGludm9rZWRcbiAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGFzeW5jICgpID0+IGF3YWl0IGxpbmtlZE1vZGlmaWVyKGAke3RoaXMubmFtZX1fJHtpbmRleH1gLCBwYXlsb2FkKTtcbiAgICAgICAgICAvLyBzaW5jZSB0aGUgbW9kaWZpZXIgaXMgY2FsbGVkIG9uIHRoZSBBUlJBWS9PQkpFQ1Qgbm9kZSwgd2UgbmVlZCB0byBhZGQgdGhlIGNhbGxiYWNrXG4gICAgICAgICAgLy8gdG8gdGhlIHF1ZXVlIG9mIHRoZSBjaGlsZC4gVGhlIG5hbWluZyBjb252ZW50aW9uIGlzOiAnb2JqZWN0TmFtZV9pJyB8fCAnb2JqZWN0TmFtZV9rZXknXG4gICAgICAgICAgaWYodGhpcy5kZXZUb29sKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5tb2RpZmllck5hbWUgPSBtb2RpZmllcktleTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhhdC52YWx1ZVtgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YF0ucXVldWUucHVzaChjYWxsYmFjayk7XG4gICAgICAgICAgdGhhdC52YWx1ZVtgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YF0ucnVuUXVldWUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgXG4gICAgT2JqZWN0LmtleXModGhpcy5tb2RpZmllcnMpLmZvckVhY2goIG1vZGlmaWVyS2V5ID0+IHtcbiAgICAgIHRoaXMudmlydHVhbE5vZGVbbW9kaWZpZXJLZXldID0gdGhpcy5tb2RpZmllcnNbbW9kaWZpZXJLZXldO1xuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQSBtaWRkbGVtYW4gZnVuY3Rpb24gdXNlZCBmb3IgcmVkaXJlY3Rpb24uIFNob3VsZCBiZSBjYWxsZWQgd2l0aCBhbiBvYmplY3QgbmVlZGVkIHJlY29uc3RydWN0aW9uXG4gICAqIGFuZCB3aWxsIHRoZW4gYWNjdXJhdGVseSBhc3NpZ24gaXRzIG5leHQgZGVzdGluYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNpbG9Ob2RlTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzaWxvTm9kZVxuICAgKiBAcGFyYW0ge29iamVjdH0gY3VyclNpbG9Ob2RlIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHBhcmVudCAnT0JKRUNUL0FSUkFZJyBzaWxvTm9kZVxuICAgKi9cbiAgcmVjb25zdHJ1Y3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpIHtcbiAgICBsZXQgcmVjb25zdHJ1Y3RlZE9iamVjdDtcbiAgICBpZiAoY3VyclNpbG9Ob2RlLnR5cGUgPT09IHR5cGVzLk9CSkVDVCkgcmVjb25zdHJ1Y3RlZE9iamVjdCA9IHRoaXMucmVjb25zdHJ1Y3RPYmplY3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpO1xuICAgIGVsc2UgaWYgKGN1cnJTaWxvTm9kZS50eXBlID09PSB0eXBlcy5BUlJBWSkgcmVjb25zdHJ1Y3RlZE9iamVjdCA9IHRoaXMucmVjb25zdHJ1Y3RBcnJheShzaWxvTm9kZU5hbWUsIGN1cnJTaWxvTm9kZSk7XG4gICAgLy8gY2FsbGVkIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaW4gaXMgYSBwcmltaXRpdmVcbiAgICBlbHNlIHJldHVybiBjdXJyU2lsb05vZGUudmFsdWU7XG5cbiAgICByZXR1cm4gcmVjb25zdHJ1Y3RlZE9iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvbnN0cnVjdHMgcGxhaW4gb2JqZWN0cyBvdXQgb2Ygc2lsb05vZGUgdmFsdWVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzaWxvTm9kZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2lsb05vZGVcbiAgICogQHBhcmFtIHtvYmplY3R9IGN1cnJTaWxvTm9kZSAtIFRoZSBhZGRyZXNzIG9mIHRoZSBwYXJlbnQgJ09CSkVDVCcgc2lsb05vZGVcbiAgICovXG4gIHJlY29uc3RydWN0T2JqZWN0KHNpbG9Ob2RlTmFtZSwgY3VyclNpbG9Ob2RlKSB7XG4gICAgLy8gb3VyIGN1cnJlbnRseSBlbXB0eSBvYmplY3QgdG8gYmUgdXNlZCBmb3IgcmVjb25zdHJ1Y3Rpb25cbiAgICBjb25zdCBuZXdPYmplY3QgPSB7fTtcbiAgICAvLyBsb29wIHRocm91Z2ggdGhlIHNpbG9Ob2RlcyBzdG9yZWQgaW4gdGhlICdPQkpFQ1QnIHZhbHVlIHRvIGV4dHJhY3QgdGhlIGRhdGFcbiAgICBPYmplY3Qua2V5cyhjdXJyU2lsb05vZGUudmFsdWUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIC8vIHNpbXBsaWZpZWQgbmFtZVxuICAgICAgY29uc3QgY2hpbGRPYmogPSBjdXJyU2lsb05vZGUudmFsdWVba2V5XTtcbiAgICAgIFxuICAgICAgLy8gZ2V0IHRoZSBrZXlOYW1lIGZyb20gdGhlIG5hbWluZyBjb252ZW50aW9uXG4gICAgICAvLyBpZiB0aGUgc2lsb05vZGUgbmFtZSBpcyAnY2FydF9zaGlydHMnLCB0aGUgc2xpY2Ugd2lsbCBnaXZlIHVzICdzaGlydHMnXG4gICAgICBjb25zdCBleHRyYWN0ZWRLZXkgPSBrZXkuc2xpY2Uoc2lsb05vZGVOYW1lLmxlbmd0aCArIDEpO1xuICAgICAgLy8gaWYgYW4gYWRkaXRpb25hbCBvYmplY3QgaXMgc3RvcmVkIGluIHRoZSB2YWx1ZXMsIHRoZW4gd2UgbXVzdCByZWN1cnNlIHRvXG4gICAgICAvLyByZWNvbnN0cnVjdCB0aGUgbmVzdGVkIG9iamVjdCBhcyB3ZWxsXG4gICAgICBpZiAoY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuT0JKRUNUIHx8IGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLkFSUkFZKSB7XG4gICAgICAgIG5ld09iamVjdFtleHRyYWN0ZWRLZXldID0gdGhpcy5yZWNvbnN0cnVjdChrZXksIGNoaWxkT2JqKTtcbiAgICAgIH1cbiAgICAgIC8vIG90aGVyd2lzZSB3ZSBoYXZlIGEgcHJpbWl0aXZlIHZhbHVlIHdoaWNoIGNhbiBlYXNpbHkgYmUgYWRkZWQgdG8gdGhlIHJlY29uc3RydWN0ZWRcbiAgICAgIC8vIG9iamVjdCB1c2luZyBvdXIgZXh0cmFjdGVkS2V5IHRvIHByb3Blcmx5IGxhYmVsIGl0IFxuICAgICAgZWxzZSBpZiAoY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSB7XG4gICAgICAgIG5ld09iamVjdFtleHRyYWN0ZWRLZXldID0gY2hpbGRPYmoudmFsdWU7XG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIG9iamVjdCBzdWNjZXNzZnVsbHkgcmVjb25zdHJ1Y3RlZCBhdCB0aGlzIGxldmVsXG4gICAgcmV0dXJuIG5ld09iamVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvbnN0cnVjdHMgYXJyYXlzIG91dCBvZiBzaWxvTm9kZSB2YWx1ZXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNpbG9Ob2RlTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzaWxvTm9kZVxuICAgKiBAcGFyYW0ge29iamVjdH0gY3VyclNpbG9Ob2RlIC0gVGhlIGFkZHJlc3Mgb2YgdGhlIHBhcmVudCAnQVJSQVknIHNpbG9Ob2RlXG4gICAqL1xuICByZWNvbnN0cnVjdEFycmF5KHNpbG9Ob2RlTmFtZSwgY3VyclNpbG9Ob2RlKSB7XG4gICAgLy8gb3VyIGN1cnJlbnRseSBlbXB0eSBhcnJheSB0byBiZSB1c2VkIGZvciByZWNvbnN0cnVjdGlvblxuICAgIGNvbnN0IG5ld0FycmF5ID0gW107XG4gICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBzaWxvTm9kZXMgc3RvcmVkIGluIHRoZSAnQVJSQVknIHZhbHVlIHRvIGV4dHJhY3QgdGhlIGRhdGFcbiAgICBPYmplY3Qua2V5cyhjdXJyU2lsb05vZGUudmFsdWUpLmZvckVhY2goKGtleSwgaSkgPT4ge1xuICAgICAgLy8gc2ltcGxpZmllZCBuYW1lXG4gICAgICBjb25zdCBjaGlsZE9iaiA9IGN1cnJTaWxvTm9kZS52YWx1ZVtrZXldO1xuICAgICAgLy8gaWYgYW4gYWRkaXRpb25hbCBvYmplY3QgaXMgc3RvcmVkIGluIHRoZSB2YWx1ZXMsIHRoZW4gd2UgbXVzdCByZWN1cnNlIHRvXG4gICAgICAvLyByZWNvbnN0cnVjdCB0aGUgbmVzdGVkIG9iamVjdCBhcyB3ZWxsXG4gICAgICBpZiAoY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuQVJSQVkgfHwgY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuT0JKRUNUKSB7XG4gICAgICAgIG5ld0FycmF5LnB1c2godGhpcy5yZWNvbnN0cnVjdChgJHtzaWxvTm9kZU5hbWV9XyR7aX1gLCBjaGlsZE9iaikpO1xuICAgICAgfSBcbiAgICAgIC8vIG90aGVyd2lzZSB3ZSBoYXZlIGEgcHJpbWl0aXZlIHZhbHVlIHdoaWNoIGNhbiBlYXNpbHkgYmUgYWRkZWQgdG8gdGhlIHJlY29uc3RydWN0ZWRcbiAgICAgIC8vIG9iamVjdCB1c2luZyBvdXIgZXh0cmFjdGVkS2V5IHRvIHByb3Blcmx5IGxhYmVsIGl0XG4gICAgICBlbHNlIGlmIChjaGlsZE9iai50eXBlID09PSB0eXBlcy5QUklNSVRJVkUpIHtcbiAgICAgICAgbmV3QXJyYXkucHVzaChjaGlsZE9iai52YWx1ZSk7XG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIGFycmF5IHN1Y2Nlc3NmdWxseSByZWNvbnN0cnVjdGVkIGF0IHRoaXMgbGV2ZWxcbiAgICByZXR1cm4gbmV3QXJyYXk7XG4gIH1cblxuICBnZXRTdGF0ZSgpe1xuICAgIGlmKHRoaXMudHlwZSA9PT0gdHlwZXMuQ09OVEFJTkVSKXtcbiAgICAgIHJldHVybiB0aGlzLnZpcnR1YWxOb2RlXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpcy52aXJ0dWFsTm9kZTtcbiAgICAgIHdoaWxlKGNvbnRleHQudHlwZSAhPT0gdHlwZXMuQ09OVEFJTkVSKXtcbiAgICAgICAgY29udGV4dCA9IGNvbnRleHQucGFyZW50O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbG9Ob2RlOyIsIi8vIGltcG9ydCBzdGF0ZSBjbGFzcyBmb3IgaW5zdGFuY2VvZiBjaGVja1xuaW1wb3J0IENvbnN0cnVjdG9yTm9kZSBmcm9tICcuL2NvbnN0cnVjdG9yTm9kZS5qcyc7XG5pbXBvcnQgU2lsb05vZGUgZnJvbSAnLi9zaWxvTm9kZS5qcyc7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL2NvbnN0YW50cy5qcydcbmltcG9ydCB2aXJ0dWFsTm9kZSBmcm9tICcuL3ZpcnR1YWxOb2RlLmpzJ1xuXG5jb25zdCBzaWxvID0ge307XG5jb25zdCB2aXJ0dWFsU2lsbyA9IHt9O1xuXG4vKipcbiAqIFRha2VzIGFsbCBvZiB0aGUgY29uc3RydWN0b3JOb2RlcyBjcmVhdGVkIGJ5IHRoZSBkZXZlbG9wZXIgYW5kIHR1cm5zIHRoZW0gaW50byB0aGUgc2lsb1xuICogQHBhcmFtICB7Li4uQ29uc3RydWN0b3JOb2RlfSBhcmdzIC0gQSBsaXN0IG9mIGNvbnN0cnVjdG9yIE5vZGVzXG4gKi9cblxuZnVuY3Rpb24gY29tYmluZU5vZGVzKC4uLmFyZ3MpIHtcbiAgbGV0IGRldlRvb2wgPSBudWxsO1xuICBpZihhcmdzWzBdICYmIGFyZ3NbMF0uZGV2VG9vbCA9PT0gdHJ1ZSkge1xuICAgIGRldlRvb2wgPSBhcmdzWzBdO1xuICAgIGFyZ3Muc2hpZnQoKTtcbiAgfVxuICBpZiAoYXJncy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignY29tYmluZU5vZGVzIGZ1bmN0aW9uIHRha2VzIGF0IGxlYXN0IG9uZSBjb25zdHJ1Y3Rvck5vZGUnKTtcblxuICAvLyBoYXN0YWJsZSBhY2NvdW50cyBmb3IgcGFzc2luZyBpbiBjb25zdHJ1Y3Rvck5vZGVzIGluIGFueSBvcmRlci4gXG4gIC8vIGhhc2h0YWJsZSBvcmdhbml6ZXMgYWxsIG5vZGVzIGludG8gcGFyZW50LWNoaWxkIHJlbGF0aW9uc2hpcHMgc28gdGhlIHNpbG8gaXMgZWFzaWVyIHRvIGNyZWF0ZVxuICBjb25zdCBoYXNoVGFibGUgPSB7fTtcblxuICAvLyBsb29wIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yTm9kZXMgcGFzc2VkIGluIGFzIGFyZ3VtZW50c1xuICBhcmdzLmZvckVhY2goY29uc3RydWN0b3JOb2RlID0+IHtcbiAgICBpZiAoIWNvbnN0cnVjdG9yTm9kZSB8fCBjb25zdHJ1Y3Rvck5vZGUuY29uc3RydWN0b3IubmFtZSAhPT0gJ0NvbnN0cnVjdG9yTm9kZScpIHRocm93IG5ldyBFcnJvcignT25seSBjb25zdHJ1Y3Rvck5vZGVzIGNhbiBiZSBwYXNzZWQgdG8gY29tYmluZU5vZGVzJyk7XG4gICAgLy8gYSBub2RlIHdpdGggYSBudWxsIHBhcmVudCB3aWxsIGJlIHRoZSByb290IG5vZGUsIGFuZCB0aGVyZSBjYW4gb25seSBiZSBvbmVcbiAgICBlbHNlIGlmIChjb25zdHJ1Y3Rvck5vZGUucGFyZW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBjaGVjayB0byBzZWUgaWYgdGhlIHJvb3Qga2V5IGFscmVhZHkgZXhpc3RzIGluIHRoZSBoYXNodGFibGUuIElmIHNvLCB0aGlzIG1lYW5zIGEgcm9vdFxuICAgICAgLy8gaGFzIGFscmVhZHkgYmVlbiBlc3RhYmxpc2hlZFxuICAgICAgaWYgKCFoYXNoVGFibGUucm9vdCkgaGFzaFRhYmxlLnJvb3QgPSBbY29uc3RydWN0b3JOb2RlXTtcbiAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBjb25zdHJ1Y3RvciBub2RlIGNhbiBoYXZlIG51bGwgcGFyZW50Jyk7XG4gICAgfSBcbiAgICAvLyBpZiB0aGUgcGFyZW50IGlzbid0IG51bGwsIHRoZW4gdGhlIHBhcmVudCBpcyBhbm90aGVyIG5vZGVcbiAgICBlbHNlIHtcbiAgICAgIC8vIGlmIHRoZSBwYXJlbnQgZG9lc24ndCBleGlzdCBhcyBhIGtleSB5ZXQsIHdlIHdpbGwgY3JlYXRlIHRoZSBrZXkgYW5kIHNldCBpdCB0byBhbiBhcnJheVxuICAgICAgLy8gdGhhdCBjYW4gYmUgZmlsbGVkIHdpdGggYWxsIHBvc3NpYmxlIGNoaWxkcmVuXG4gICAgICBpZiAoIWhhc2hUYWJsZVtjb25zdHJ1Y3Rvck5vZGUucGFyZW50XSkgaGFzaFRhYmxlW2NvbnN0cnVjdG9yTm9kZS5wYXJlbnRdID0gW2NvbnN0cnVjdG9yTm9kZV07XG4gICAgICAvLyBpZiBwYXJlbnQgYWxyZWFkeSBleGlzdHMsIGFuZCBub2RlIGJlaW5nIGFkZGVkIHdpbGwgYXBwZW5kIHRvIHRoZSBhcnJheSBvZiBjaGlsZHJlblxuICAgICAgZWxzZSBoYXNoVGFibGVbY29uc3RydWN0b3JOb2RlLnBhcmVudF0ucHVzaChjb25zdHJ1Y3Rvck5vZGUpO1xuICAgIH1cbiAgfSkgXG5cbiAgLy8gZW5zdXJlIHRoZXJlIGlzIGEgZGVmaW5lZCByb290IGJlZm9yZSBjb250aW51aW5nXG4gIGlmICghaGFzaFRhYmxlLnJvb3QpIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGNvbnN0cnVjdG9yIG5vZGUgbXVzdCBoYXZlIGEgbnVsbCBwYXJlbnQnKTtcblxuICAvLyBhIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0aGF0IHdpbGwgY3JlYXRlIHNpbG9Ob2RlcyBhbmQgcmV0dXJuIHRoZW0gdG8gYSBwYXJlbnRcbiAgZnVuY3Rpb24gbWFwVG9TaWxvKGNvbnN0cnVjdG9yTm9kZSA9ICdyb290JywgcGFyZW50Q29uc3RydWN0b3JOb2RlID0gbnVsbCkge1xuICAgIC8vIHRoZSB2ZXJ5IGZpcnN0IHBhc3Mgd2lsbCBzZXQgdGhlIHBhcmVudCB0byByb290XG4gICAgY29uc3QgY29uc3RydWN0b3JOb2RlTmFtZSA9IChjb25zdHJ1Y3Rvck5vZGUgPT09ICdyb290JykgPyAncm9vdCcgOiBjb25zdHJ1Y3Rvck5vZGUubmFtZTtcblxuICAgIC8vIHJlY3Vyc2l2ZSBiYXNlIGNhc2UsIHdlIG9ubHkgY29udGludWUgaWYgdGhlIGN1cnJlbnQgbm9kZSBoYXMgYW55IGNvbnN0cnVjdG9yTm9kZSBjaGlsZHJlblxuICAgIGlmICghaGFzaFRhYmxlW2NvbnN0cnVjdG9yTm9kZU5hbWVdKSByZXR1cm47XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IHt9O1xuXG4gICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBjaGlsZHJlbiBhcnJheXMgaW4gdGhlIGhhc2h0YWJsZVxuICAgIGhhc2hUYWJsZVtjb25zdHJ1Y3Rvck5vZGVOYW1lXS5mb3JFYWNoKGN1cnJDb25zdHJ1Y3Rvck5vZGUgPT4ge1xuICAgICAgY29uc3QgdmFsdWVzT2ZDdXJyU2lsb05vZGUgPSB7fTtcbiAgICAgIGNoaWxkcmVuW2N1cnJDb25zdHJ1Y3Rvck5vZGUubmFtZV0gPSBuZXcgU2lsb05vZGUoY3VyckNvbnN0cnVjdG9yTm9kZS5uYW1lLCB2YWx1ZXNPZkN1cnJTaWxvTm9kZSwgcGFyZW50Q29uc3RydWN0b3JOb2RlLCB7fSwgdHlwZXMuQ09OVEFJTkVSLCBkZXZUb29sKTtcbiAgICAgIFxuICAgICAgLy8gYWJzdHJhY3Qgc29tZSB2YXJpYWJsZXNcbiAgICAgIGNvbnN0IGN1cnJTaWxvTm9kZSA9IGNoaWxkcmVuW2N1cnJDb25zdHJ1Y3Rvck5vZGUubmFtZV07XG4gICAgICBjb25zdCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSA9IGN1cnJDb25zdHJ1Y3Rvck5vZGUuc3RhdGU7XG5cbiAgICAgIC8vIGNyZWF0ZSBTaWxvTm9kZXMgZm9yIGFsbCB0aGUgdmFyaWFibGVzIGluIHRoZSBjdXJyQ29uc3RydWN0b3JOb2RlXG4gICAgICBPYmplY3Qua2V5cyhzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSkuZm9yRWFjaCh2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlID0+IHtcbiAgICAgICAgLy8gaXMgdGhlIHZhcmlhYmxlIGlzIGFuIG9iamVjdC9hcnJheSwgd2UgbmVlZCB0byBkZWNvbnN0cnVjdCBpdCBpbnRvIGZ1cnRoZXIgc2lsb05vZGVzXG4gICAgICAgIGlmICh0eXBlb2Ygc3RhdGVPZkN1cnJDb25zdHJ1Y3Rvck5vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0udmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdmFsdWVzT2ZDdXJyU2lsb05vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0gPSBjdXJyU2lsb05vZGUuZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzKHZhckluQ29uc3RydWN0b3JOb2RlU3RhdGUsIHN0YXRlT2ZDdXJyQ29uc3RydWN0b3JOb2RlW3ZhckluQ29uc3RydWN0b3JOb2RlU3RhdGVdLCBjdXJyU2lsb05vZGUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG90aGVyd2lzZSBwcmltaXRpdmVzIGNhbiBiZSBzdG9yZWQgaW4gc2lsb05vZGVzIGFuZCB0aGUgbW9kaWZpZXJzIHJ1blxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YWx1ZXNPZkN1cnJTaWxvTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXSA9IG5ldyBTaWxvTm9kZSh2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlLCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXS52YWx1ZSwgY3VyclNpbG9Ob2RlLCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXS5tb2RpZmllcnMsIHR5cGVzLlBSSU1JVElWRSwgZGV2VG9vbCk7XG4gICAgICAgICAgdmFsdWVzT2ZDdXJyU2lsb05vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0ubGlua01vZGlmaWVycygpO1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyByZWN1cnNpdmVseSBjaGVjayB0byBzZWUgaWYgdGhlIGN1cnJlbnQgY29uc3RydWN0b3JOb2RlL3NpbG9Ob2RlIGhhcyBhbnkgY2hpbGRyZW4gXG4gICAgICBjb25zdCBzaWxvTm9kZUNoaWxkcmVuID0gbWFwVG9TaWxvKGN1cnJDb25zdHJ1Y3Rvck5vZGUsIGN1cnJTaWxvTm9kZSk7XG4gICAgICAvLyBpZiBhIE5vZGUgZGlkIGhhdmUgY2hpbGRyZW4sIHdlIHdpbGwgYWRkIHRob3NlIHJldHVybmVkIHNpbG9Ob2RlcyBhcyB2YWx1ZXNcbiAgICAgIC8vIGludG8gdGhlIGN1cnJlbnQgc2lsb05vZGVcbiAgICAgIGlmIChzaWxvTm9kZUNoaWxkcmVuKSB7IFxuICAgICAgICBPYmplY3Qua2V5cyhzaWxvTm9kZUNoaWxkcmVuKS5mb3JFYWNoKHNpbG9Ob2RlID0+IHtcbiAgICAgICAgICB2YWx1ZXNPZkN1cnJTaWxvTm9kZVtzaWxvTm9kZV0gPSBzaWxvTm9kZUNoaWxkcmVuW3NpbG9Ob2RlXTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIC8vIGhlcmUgd2Ugd2lsbCBnZXQgdGhlIHJvb3Qgc2lsb05vZGUgd2l0aCBhbGwgaXRzIGNoaWxkcmVuIGFkZGVkXG4gIGNvbnN0IHdyYXBwZWRSb290U2lsb05vZGUgPSBtYXBUb1NpbG8oKTtcblxuICAvLyBhZGQgdGhlIHNpbG9Ob2RlIHJvb3QgdG8gdGhlIHBsYWluIHNpbG8gb2JqZWN0XG4gIC8vIGl0IHdpbGwgYWx3YXlzIG9ubHkgYmUgYSBzaW5nbGUga2V5ICh0aGUgcm9vdCkgdGhhdCBpcyBhZGRlZCBpbnRvIHRoZSBzaWxvXG4gIE9iamVjdC5rZXlzKHdyYXBwZWRSb290U2lsb05vZGUpLmZvckVhY2gocm9vdFNpbG9Ob2RlID0+IHtcbiAgICBzaWxvW3Jvb3RTaWxvTm9kZV0gPSB3cmFwcGVkUm9vdFNpbG9Ob2RlW3Jvb3RTaWxvTm9kZV07XG4gIH0pO1xuICBcbiAgZnVuY3Rpb24gaWRlbnRpZnkgKCkge1xuICAgIC8vZWFjaCBub2RlJ3MgSUQgaXMgYSBzbmFrZV9jYXNlIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgYSBcbiAgICAvL3JvdXRlIHRvIHRoYXQgbm9kZSBmcm9tIHRoZSB0b3Agb2YgdGhlIHNpbG8gYnkgbmFtZVxuICAgIGZvckVhY2hTaWxvTm9kZShub2RlID0+IHtcbiAgICAgIG5vZGUuaXNzdWVJRCgpXG4gICAgfSk7XG4gIH1cblxuICBpZGVudGlmeSgpO1xuXG4gIGZ1bmN0aW9uIHZpcnR1YWxpemUgKCkgeyAvL3J1bnMgdGhyb3VnaCBlYWNoIG5vZGUgaW4gdGhlIHRyZWUsIHR1cm5zIGl0IGludG8gYSB2aXJ0dWFsIG5vZGUgaW4gdGhlIHZTaWxvXG4gICAgZm9yRWFjaFNpbG9Ob2RlKG5vZGUgPT4ge1xuICAgICAgaWYoIXZpcnR1YWxTaWxvW25vZGUuaWRdKXtcbiAgICAgICAgdmlydHVhbFNpbG9bbm9kZS5pZF0gPSBub2RlLnZpcnR1YWxOb2RlO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB2aXJ0dWFsaXplKCk7XG4gICAgXG4gIGZvckVhY2hTaWxvTm9kZShub2RlID0+IHtcbiAgICAvLyBhcHBseSBrZXlTdWJzY3JpYmUgb25seSB0byBvYmplY3QgYW5kIGFycmF5IHNpbG8gbm9kZXNcbiAgICBpZiAobm9kZS50eXBlID09PSAnT0JKRUNUJyB8fCBub2RlLnR5cGUgPT09IFwiQVJSQVlcIikge1xuICAgICAgbm9kZS5tb2RpZmllcnMua2V5U3Vic2NyaWJlID0gKGtleSwgcmVuZGVyRnVuYykgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gbm9kZS5uYW1lICsgXCJfXCIgKyBrZXk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZWRBdEluZGV4ID0gbm9kZS52YWx1ZVtuYW1lXS5wdXNoVG9TdWJzY3JpYmVycyhyZW5kZXJGdW5jKTtcbiAgICAgICAgbm9kZS52YWx1ZVtuYW1lXS5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge25vZGUucmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleChzdWJzY3JpYmVkQXRJbmRleCl9XG4gICAgICB9XG4gICAgfX0pXG4gIFxuICBzaWxvLnZpcnR1YWxTaWxvID0gdmlydHVhbFNpbG87XG4gIHJldHVybiBzaWxvO1xufVxuXG4vKipcbiAqIEFwcGxpZXMgdGhlIGNhbGxiYWNrIHRvIGV2ZXJ5IHNpbG9Ob2RlIGluIHRoZSBzaWxvXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIEEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGEgc2lsb05vZGUgYXMgaXRzIHBhcmFtZXRlclxuICovXG5cbi8vIGNhbGxiYWNrcyBoYXZlIHRvIGFjY2VwdCBhIFNJTE9OT0RFXG5mdW5jdGlvbiBmb3JFYWNoU2lsb05vZGUoY2FsbGJhY2spIHtcbiAgLy8gYWNjZXNzaW5nIHRoZSBzaW5nbGUgcm9vdCBpbiB0aGUgc2lsb1xuICBPYmplY3Qua2V5cyhzaWxvKS5mb3JFYWNoKHNpbG9Ob2RlUm9vdEtleSA9PiB7XG4gICAgaW5uZXIoc2lsb1tzaWxvTm9kZVJvb3RLZXldLCBjYWxsYmFjayk7XG4gIH0pXG5cbiAgLy8gcmVjdXJzaXZlbHkgbmF2aWdhdGUgdG8gZXZlcnkgc2lsb05vZGVcbiAgZnVuY3Rpb24gaW5uZXIoaGVhZCwgY2FsbGJhY2spIHtcbiAgICBpZiAoaGVhZC5jb25zdHJ1Y3Rvci5uYW1lID09PSAnU2lsb05vZGUnKSB7XG4gICAgICBjYWxsYmFjayhoZWFkKTtcbiAgICAgIGlmIChoZWFkLnR5cGUgPT09IHR5cGVzLlBSSU1JVElWRSkgcmV0dXJuOyAvLyByZWN1cnNpdmUgYmFzZSBjYXNlXG4gICAgICBcbiAgICAgIGVsc2Uge1xuICAgICAgICBPYmplY3Qua2V5cyhoZWFkLnZhbHVlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgaWYgKGhlYWQudmFsdWVba2V5XS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnU2lsb05vZGUnKSB7XG4gICAgICAgICAgICBpbm5lcihoZWFkLnZhbHVlW2tleV0sIGNhbGxiYWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU3Vic2NyaWJlcyBjb21wb25lbnRzIHRvIHNpbG9Ob2RlcyBpbiB0aGUgc2lsb1xuICogQHBhcmFtICB7ZnVuY3Rpb259IHJlbmRlckZ1bmN0aW9uIC0gRnVuY3Rpb24gdG8gYmUgYXBwZW5kZWQgdG8gc3Vic2NyaWJlcnMgYXJyYXlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcmVsZXZhbnQgY29tcG9uZW50IHdpdGggJ1N0YXRlJyBhcHBlbmRlZFxuICovXG5cbnNpbG8uc3Vic2NyaWJlID0gKHJlbmRlckZ1bmN0aW9uLCBuYW1lKSA9PiB7XG4gIGlmICghbmFtZSkge1xuICAgIGlmICghIXJlbmRlckZ1bmN0aW9uLnByb3RvdHlwZSkge1xuICAgICAgbmFtZSA9IHJlbmRlckZ1bmN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lICsgJ1N0YXRlJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuXFwndCB1c2UgYW4gYW5vbnltb3VzIGZ1bmN0aW9uIGluIHN1YnNjcmliZSB3aXRob3V0IGEgbmFtZSBhcmd1bWVudC4nKTtcbiAgICB9XG4gIH1cblxuICBsZXQgZm91bmROb2RlO1xuICBsZXQgc3Vic2NyaWJlZEF0SW5kZXg7XG4gIGNvbnN0IGZvdW5kTm9kZUNoaWxkcmVuID0gW107XG5cbiAgZm9yRWFjaFNpbG9Ob2RlKG5vZGUgPT4ge1xuICAgIGlmKG5vZGUubmFtZSA9PT0gbmFtZSl7XG4gICAgICBzdWJzY3JpYmVkQXRJbmRleCA9IG5vZGUucHVzaFRvU3Vic2NyaWJlcnMocmVuZGVyRnVuY3Rpb24pXG4gICAgICBmb3VuZE5vZGUgPSBub2RlXG4gICAgICBmb3VuZE5vZGVDaGlsZHJlbi5wdXNoKHtub2RlOiBmb3VuZE5vZGUsIGluZGV4OiBzdWJzY3JpYmVkQXRJbmRleH0pO1xuICAgIH1cbiAgfSlcblxuICBsZXQgdW5zdWJzY3JpYmU7XG4gIFxuICBpZiAoISFmb3VuZE5vZGUpIHtcbiAgICBpZiAoZm91bmROb2RlLnZhbHVlKSB7XG4gICAgICBPYmplY3Qua2V5cyhmb3VuZE5vZGUudmFsdWUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IG5vZGUgPSBmb3VuZE5vZGUudmFsdWVba2V5XTtcbiAgICAgICAgaWYobm9kZS50eXBlICE9PSAnQ09OVEFJTkVSJyl7XG4gICAgICAgICAgc3Vic2NyaWJlZEF0SW5kZXggPSBub2RlLnB1c2hUb1N1YnNjcmliZXJzKHJlbmRlckZ1bmN0aW9uKTtcbiAgICAgICAgICBmb3VuZE5vZGVDaGlsZHJlbi5wdXNoKHtub2RlOiBub2RlLCBpbmRleDogc3Vic2NyaWJlZEF0SW5kZXh9KTtcbiAgXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdW5zdWJzY3JpYmUgPSAoKSA9PiAge1xuICAgICAgbGV0IG9iO1xuICAgICAgT2JqZWN0LmtleXMoZm91bmROb2RlQ2hpbGRyZW4pLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgb2IgPSBmb3VuZE5vZGVDaGlsZHJlbltrZXldOyBcbiAgICAgICAgb2IuX3N1YnNjcmliZXJzLnNwbGljZShvYi5pbmRleCwgMSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgZm91bmROb2RlLm5vdGlmeVN1YnNjcmliZXJzKCk7XG4gICAgcmV0dXJuIHVuc3Vic2NyaWJlO1xuXG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihuZXcgRXJyb3IoJ1lvdSBhcmUgdHJ5aW5nIHRvIHN1YnNjcmliZSB0byBzb21ldGhpbmcgdGhhdCBpc25cXCd0IGluIHRoZSBzaWxvLicpKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gZXJyRnVuYyAoKSB7XG4gICAgICBjb25zb2xlLmVycm9yKG5ldyBFcnJvcignWW91IGFyZSB0cnlpbmcgdG8gcnVuIHVuc3Vic2NyaWJlIGZyb20gc29tZXRoaW5nIHRoYXQgd2FzblxcJ3QgaW4gdGhlIHNpbG8gaW4gdGhlIGZpcnN0IHBsYWNlLicpKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb21iaW5lTm9kZXM7IiwiaW1wb3J0ICdAYmFiZWwvcG9seWZpbGwnO1xuaW1wb3J0IGNvbWJpbmVOb2RlcyBmcm9tICcuL3JhZG9uL2NvbWJpbmVOb2Rlcyc7XG5pbXBvcnQgQ29uc3RydWN0b3JOb2RlIGZyb20gJy4vcmFkb24vY29uc3RydWN0b3JOb2RlJztcblxuZXhwb3J0IGNvbnN0IGNvbWJpbmVTdGF0ZSA9IGNvbWJpbmVOb2RlcztcbmV4cG9ydCBjb25zdCBTdGF0ZU5vZGUgPSBDb25zdHJ1Y3Rvck5vZGU7Il0sIm5hbWVzIjpbIkNvbnN0cnVjdG9yTm9kZSIsIm5hbWUiLCJwYXJlbnROYW1lIiwic3RhdGUiLCJwYXJlbnQiLCJpbml0aWFsaXplU3RhdGUiLCJiaW5kIiwiaW5pdGlhbGl6ZU1vZGlmaWVycyIsImluaXRpYWxTdGF0ZSIsIkFycmF5IiwiaXNBcnJheSIsIkVycm9yIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJuZXdWYXJpYWJsZUluU3RhdGUiLCJ2YWx1ZSIsIm1vZGlmaWVycyIsImluaXRpYWxNb2RpZmllcnMiLCJuZXdNb2RpZmllcnNJblN0YXRlIiwiX25hbWUiLCJfcGFyZW50IiwiX3N0YXRlIiwiQVJSQVkiLCJPQkpFQ1QiLCJQUklNSVRJVkUiLCJDT05UQUlORVIiLCJWaXJ0dWFsTm9kZSIsIm5vZGUiLCJwYXJlbnRzIiwidmlydHVhbE5vZGUiLCJhbmNlc3RvciIsInR5cGUiLCJpZCIsInR5cGVzIiwidmFsIiwiaW5jbHVkZXMiLCJzcGxpdCIsImxlbmd0aCIsIm1vZGlmaWVyS2V5cyIsIm1vZGlmaWVyS2V5IiwiZGF0YSIsIlNpbG9Ob2RlIiwiZGV2VG9vbCIsInF1ZXVlIiwic3Vic2NyaWJlcnMiLCJsaW5rTW9kaWZpZXJzIiwicnVuTW9kaWZpZXJzIiwibm90aWZ5U3Vic2NyaWJlcnMiLCJnZXRTdGF0ZSIsInJlY29uc3RydWN0QXJyYXkiLCJyZWNvbnN0cnVjdE9iamVjdCIsImRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyIsInJlY29uc3RydWN0IiwicHVzaFRvU3Vic2NyaWJlcnMiLCJyZW1vdmVGcm9tU3Vic2NyaWJlcnNBdEluZGV4IiwicnVuUXVldWUiLCJrZXlTdWJzY3JpYmUiLCJrZXkiLCJyZW5kZXJGdW5jdGlvbiIsInN1YnNjcmliZWRBdEluZGV4IiwiX3N1YnNjcmliZXJzIiwic3BsaWNlIiwiaXNzdWVJRCIsInB1c2giLCJpbmRleCIsInN1YmNyaWJlcnMiLCJzbGljZSIsIl9pZCIsImZ1bmMiLCJydW5uaW5nIiwicnVuIiwibmV4dE1vZGlmaWVyIiwic2hpZnQiLCJwcmV2aW91c1N0YXRlIiwibm90aWZ5IiwibW9kaWZpZXJOYW1lIiwidXBkYXRlVG8iLCJvYmpOYW1lIiwib2JqZWN0VG9EZWNvbnN0cnVjdCIsInJ1bkxpbmtlZE1vZHMiLCJvYmpDaGlsZHJlbiIsIm5ld1NpbG9Ob2RlIiwiaW5kZXhlZFZhbCIsImkiLCJub2RlTmFtZSIsInN0YXRlTW9kaWZpZXJzIiwidGhhdCIsIm1vZGlmaWVyIiwibGlua2VkTW9kaWZpZXIiLCJwYXlsb2FkIiwiY2FsbGJhY2siLCJzaWxvTm9kZU5hbWUiLCJjdXJyU2lsb05vZGUiLCJyZWNvbnN0cnVjdGVkT2JqZWN0IiwibmV3T2JqZWN0IiwiY2hpbGRPYmoiLCJleHRyYWN0ZWRLZXkiLCJuZXdBcnJheSIsImNvbnRleHQiLCJfdmFsdWUiLCJfbW9kaWZpZXJzIiwiX3F1ZXVlIiwiY29uc3RydWN0b3IiLCJfdHlwZSIsIl92aXJ0dWFsTm9kZSIsInNpbG8iLCJ2aXJ0dWFsU2lsbyIsImNvbWJpbmVOb2RlcyIsImFyZ3MiLCJoYXNoVGFibGUiLCJjb25zdHJ1Y3Rvck5vZGUiLCJyb290IiwibWFwVG9TaWxvIiwicGFyZW50Q29uc3RydWN0b3JOb2RlIiwiY29uc3RydWN0b3JOb2RlTmFtZSIsImNoaWxkcmVuIiwiY3VyckNvbnN0cnVjdG9yTm9kZSIsInZhbHVlc09mQ3VyclNpbG9Ob2RlIiwic3RhdGVPZkN1cnJDb25zdHJ1Y3Rvck5vZGUiLCJ2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlIiwic2lsb05vZGVDaGlsZHJlbiIsInNpbG9Ob2RlIiwid3JhcHBlZFJvb3RTaWxvTm9kZSIsInJvb3RTaWxvTm9kZSIsImlkZW50aWZ5IiwiZm9yRWFjaFNpbG9Ob2RlIiwidmlydHVhbGl6ZSIsInJlbmRlckZ1bmMiLCJzaWxvTm9kZVJvb3RLZXkiLCJpbm5lciIsImhlYWQiLCJzdWJzY3JpYmUiLCJwcm90b3R5cGUiLCJmb3VuZE5vZGUiLCJmb3VuZE5vZGVDaGlsZHJlbiIsInVuc3Vic2NyaWJlIiwib2IiLCJjb25zb2xlIiwiZXJyb3IiLCJlcnJGdW5jIiwiY29tYmluZVN0YXRlIiwiU3RhdGVOb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBTUE7OzsyQkFDUUMsSUFBWixFQUFxQztRQUFuQkMsVUFBbUIsdUVBQU4sSUFBTTs7OztTQUM5QkQsSUFBTCxHQUFZQSxJQUFaO1NBQ0tFLEtBQUwsR0FBYSxFQUFiO1NBQ0tDLE1BQUwsR0FBY0YsVUFBZDtTQUVLRyxlQUFMLEdBQXVCLEtBQUtBLGVBQUwsQ0FBcUJDLElBQXJCLENBQTBCLElBQTFCLENBQXZCO1NBQ0tDLG1CQUFMLEdBQTJCLEtBQUtBLG1CQUFMLENBQXlCRCxJQUF6QixDQUE4QixJQUE5QixDQUEzQjs7Ozs7Ozs7OztvQ0FRY0UsY0FBYzs7OztVQUV4QixRQUFPQSxZQUFQLE1BQXdCLFFBQXhCLElBQW9DQyxLQUFLLENBQUNDLE9BQU4sQ0FBY0YsWUFBZCxDQUF4QyxFQUFxRSxNQUFNLElBQUlHLEtBQUosQ0FBVSx5QkFBVixDQUFOLENBRnpDOzs7TUFLNUJDLE1BQU0s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
