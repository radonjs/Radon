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

    if (node.parent) {
      this.parent = node.parent.virtualNode;
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
    }

    if (node.modifiers) {
      var modifierKeys = Object.keys(modifiers);
      modifierKeys.forEach(function (modifierKey) {
        _this[modifierKey] = modifiers[modifierKey];
      });
    } //set this.parent
    //set this.value
    //set each modifier
    //     this.parent;
    //     if(node.type === types.CONTAINER){
    //         const parentHolder = node.parent;
    //         node.parent = null;
    //         let value = node.unsheatheChildren();
    //         node.parent = parentHolder;
    //         Object.keys(value).forEach(key => {
    //         this[key] = value[key];
    //         this.getData = () => {
    //             return this;
    //         }
    //       })
    //     } else {
    //         this.getData = () => {
    //             let pointer = node;
    //         while(pointer.type !== types.CONTAINER){
    //             pointer = pointer.parent;
    //         }
    //         const route = node.id.split(pointer.name)[1].split('.');
    //         route.splice(0, 1);
    //         pointer = pointer.VirtualNode;
    //         let final = route[route.length -1];
    //         route.splice(route.length-1, 1);
    //         if(final.includes('_')){
    //             final = final.split('_');
    //             final = final[final.length - 1];
    //         }
    //         route.forEach(name => {
    //             if(name.includes('_')){
    //                 name = name.split('_');
    //                 name = name[name.length -1];
    //             }
    //             pointer = pointer[name]
    //         })
    //         return pointer[final];
    //     }
    //     this.updateTo = (data) => {
    //         let pointer = node;
    //         while(pointer.type !== types.CONTAINER){
    //             pointer = pointer.parent;
    //         }
    //         const route = node.id.split(pointer.name)[1].split('.');
    //         route.splice(0, 1);
    //         pointer = pointer.VirtualNode;
    //         let final = route[route.length -1];
    //         route.splice(route.length-1, 1);
    //         if(final.includes('_')){
    //             final = final.split('_');
    //             final = final[final.length - 1];
    //         }
    //         route.forEach(name => {
    //             if(name.includes('_')){
    //                 name = name.split('_');
    //                 name = name[name.length -1];
    //             }
    //             pointer = pointer[name]
    //         })
    //         pointer[final] = data;
    //     }
    // }
    //the modifiers need to be put in dynamically,
    //as does keySubscribe

  }

  _createClass(VirtualNode, [{
    key: "updateTo",
    value: function updateTo(data) {
      this.val = data;
    }
  }]);

  return VirtualNode;
}();
/*
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
*/

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

        var subscribedAtIndex = _this.value[name].pushToSubscribers(renderFunction);

        _this.value[name].notifySubscribers();

        var that = _this;
        return function () {
          that.value[name].removeFromSubscribersAtIndex(subscribedAtIndex);
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
    } // unsheatheChildren() {
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

  function unsubscribe() {
    var ob;
    Object.keys(foundNodeChildren).forEach(function (key) {
      ob = foundNodeChildren[key];
      ob.node.removeFromSubscribersAtIndex(ob.index);
    });
  }

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

    foundNode.notifySubscribers();
  } else {
    console.error(new Error("You are trying to subscribe to ".concat(name, ", which isn't in the silo.")));
  }

  return unsubscribe;
};

var combineState = combineNodes;
var StateNode = ConstructorNode;

exports.combineState = combineState;
exports.StateNode = StateNode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9yYWRvbi9jb25zdHJ1Y3Rvck5vZGUuanMiLCIuLi9yYWRvbi9jb25zdGFudHMuanMiLCIuLi9yYWRvbi92aXJ0dWFsTm9kZS5qcyIsIi4uL3JhZG9uL3NpbG9Ob2RlLmpzIiwiLi4vcmFkb24vY29tYmluZU5vZGVzLmpzIiwiLi4vaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ29uc3RydWN0b3JOb2RlIHtcbiAgY29uc3RydWN0b3IobmFtZSwgcGFyZW50TmFtZSA9IG51bGwpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lOyBcbiAgICB0aGlzLnN0YXRlID0ge307XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnROYW1lO1xuICAgIFxuICAgIHRoaXMuaW5pdGlhbGl6ZVN0YXRlID0gdGhpcy5pbml0aWFsaXplU3RhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLmluaXRpYWxpemVNb2RpZmllcnMgPSB0aGlzLmluaXRpYWxpemVNb2RpZmllcnMuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHZhcmlhYmxlcyB0byB0aGUgc3RhdGVcbiAgICogQHBhcmFtIHtvYmplY3R9IGluaXRpYWxTdGF0ZSAtIEFuIG9iamVjdCB3aXRoIGtleXMgYXMgdmFyaWFibGUgbmFtZXMgYW5kIHZhbHVlcyBvZiBkYXRhXG4gICAqL1xuXG4gIGluaXRpYWxpemVTdGF0ZShpbml0aWFsU3RhdGUpIHtcbiAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGUgaW5wdXQgaXMgYW4gb2JqZWN0XG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU3RhdGUgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoaW5pdGlhbFN0YXRlKSkgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgc3RhdGUgdmFyaWFibGVzIGFuZCBjcmVhdGUgb2JqZWN0cyB0aGF0IGhvbGQgdGhlIHZhcmlhYmxlIGFuZCBhbnlcbiAgICAvLyBhc3NvY2lhdGVkIG1vZGlmaWVyc1xuICAgIE9iamVjdC5rZXlzKGluaXRpYWxTdGF0ZSkuZm9yRWFjaChuZXdWYXJpYWJsZUluU3RhdGUgPT4ge1xuICAgICAgdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdID0ge1xuICAgICAgICB2YWx1ZTogaW5pdGlhbFN0YXRlW25ld1ZhcmlhYmxlSW5TdGF0ZV0sXG4gICAgICAgIC8vIGFjY291bnRzIGZvciBpbml0aWFsaXplTW9kaWZlcnMgYmVpbmcgY2FsbGVkIHByaW9yIHRvIGluaXRpYWxpemVTdGF0ZVxuICAgICAgICAvLyBieSBjaGVja2luZyB0byBzZWUgaWYgdGhpcyBvYmplY3QgaGFzIGFscmVhZHkgYmVlbiBjcmVhdGVkXG4gICAgICAgIG1vZGlmaWVyczogdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdID8gdGhpcy5zdGF0ZVtuZXdWYXJpYWJsZUluU3RhdGVdLm1vZGlmaWVycyA6IHt9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmVzIG1vZGlmaWVycyBpbiBzdGF0ZVxuICAgKiBAcGFyYW0ge29iamVjdH0gaW5pdGlhbE1vZGlmaWVycyAtIEFuIG9iamVjdCB3aXRoIGtleXMgYXNzb2NpYXRlZCB3aXRoIGV4aXN0aW5nIGluaXRpYWxpemVkIHZhcmlhYmxlcyBhbmQgdmFsdWVzIHRoYXQgYXJlIG9iamVjdHMgY29udGFpbmluZyBtb2RpZmllcnMgdG8gYmUgYm91bmQgdG8gdGhhdCBzcGVjaWZpYyB2YXJpYWJsZVxuICAgKi9cbiAgXG4gIGluaXRpYWxpemVNb2RpZmllcnMoaW5pdGlhbE1vZGlmaWVycykge1xuICAgIC8vIG1ha2Ugc3VyZSB0aGF0IHRoZSBpbnB1dCBpcyBhbiBvYmplY3RcbiAgICBpZiAodHlwZW9mIGluaXRpYWxNb2RpZmllcnMgIT09ICdvYmplY3QnIHx8IEFycmF5LmlzQXJyYXkoaW5pdGlhbE1vZGlmaWVycykpIHRocm93IG5ldyBFcnJvcignSW5wdXQgbXVzdCBiZSBhbiBvYmplY3QnKTtcbiAgICAvLyBsb29wcyB0aHJvdWdoIHRoZSBzdGF0ZSBtb2RpZmllcnMuIFRoZSBzYW1lIG9iamVjdCBpcyBjcmVhdGVkIGhlcmUgYXMgaW4gaW5pdGlhbGl6ZVN0YXRlIGFuZCBpdFxuICAgIC8vIHdpbGwgb3ZlcndyaXRlIHRoZSBpbml0aWFsaXplU3RhdGUgb2JqZWN0LiBCdXQgaXQgbmVlZHMgdG8gYmUgZG9uZSB0aGlzIHdheSBpbiBjYXNlIHRoZSBkZXYgY2FsbHMgXG4gICAgLy8gaW5pdGlhbGl6ZU1vZGlmaWVycyBiZWZvcmUgdGhleSBjYWxsIGluaXRpYWxpemVTdGF0ZS4gTm93IGl0IHdvcmtzIGVpdGhlciB3YXkgXG4gICAgT2JqZWN0LmtleXMoaW5pdGlhbE1vZGlmaWVycykuZm9yRWFjaChuZXdNb2RpZmllcnNJblN0YXRlID0+IHtcbiAgICAgIHRoaXMuc3RhdGVbbmV3TW9kaWZpZXJzSW5TdGF0ZV0gPSB7XG4gICAgICAgIC8vIGFjY291bnRzIGZvciBpbml0aWFsaXplU3RhdGUgYmVpbmcgY2FsbGVkIHByaW9yIHRvIGluaXRpYWxpemVNb2RpZmllcnMuIFxuICAgICAgICB2YWx1ZTogdGhpcy5zdGF0ZVtuZXdNb2RpZmllcnNJblN0YXRlXSA/IHRoaXMuc3RhdGVbbmV3TW9kaWZpZXJzSW5TdGF0ZV0udmFsdWUgOiBudWxsLFxuICAgICAgICBtb2RpZmllcnM6IGluaXRpYWxNb2RpZmllcnNbbmV3TW9kaWZpZXJzSW5TdGF0ZV1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCBuYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB0aHJvdyBuZXcgRXJyb3IoJ05hbWUgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIGVsc2UgdGhpcy5fbmFtZSA9IG5hbWU7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIHNldCBwYXJlbnQocGFyZW50KSB7XG4gICAgaWYgKHR5cGVvZiBwYXJlbnQgIT09ICdzdHJpbmcnICYmIHBhcmVudCAhPT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdQYXJlbnQgbXVzdCBiZSBhIHN0cmluZycpO1xuICAgIGVsc2UgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgZ2V0IHBhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29uc3RydWN0b3JOb2RlOyIsImV4cG9ydCBjb25zdCBBUlJBWSA9ICdBUlJBWSc7XG5leHBvcnQgY29uc3QgT0JKRUNUID0gJ09CSkVDVCc7XG5leHBvcnQgY29uc3QgUFJJTUlUSVZFID0gJ1BSSU1JVElWRSc7XG5leHBvcnQgY29uc3QgQ09OVEFJTkVSID0gJ0NPTlRBSU5FUic7IiwiaW1wb3J0ICogYXMgdHlwZXMgZnJvbSAnLi9jb25zdGFudHMnXG5cbmNsYXNzIFZpcnR1YWxOb2RlIHtcbiAgICBjb25zdHJ1Y3RvciAobm9kZSwgbW9kaWZpZXJzKSB7XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgaWYobm9kZS5wYXJlbnQpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IG5vZGUucGFyZW50LnZpcnR1YWxOb2RlO1xuICAgICAgICB9IFxuXG4gICAgICAgIFxuICAgICAgICB0aGlzLm5hbWUgPSBub2RlLm5hbWU7XG4gICAgICAgIHRoaXMudHlwZSA9IG5vZGUudHlwZTtcbiAgICAgICAgdGhpcy5pZCA9IG5vZGUuaWQ7XG5cblxuICAgICAgICBpZih0aGlzLnR5cGUgPT09IHR5cGVzLlBSSU1JVElWRSl7XG4gICAgICAgICAgICAvL3ZhbHVlIHNob3VsZCBqdXN0IGJlIGFuIGVtcHR5IG9iamVjdC5cbiAgICAgICAgICAgIC8vd2hlbiB5b3VyIGNoaWxkcmVuIGFyZSBiZWluZyBtYWRlXG4gICAgICAgICAgICAvL3RoZXknbGwganVzdCBwdXQgdGhlbXNlbHZlcyBpbnRvIHlvdXIgdmFsdWUuXG4gICAgICAgICAgICB0aGlzLnZhbCA9IG5vZGUudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZhbCA9IHt9O1xuICAgICAgICAgICAgaWYodGhpcy50eXBlID09PSB0eXBlcy5BUlJBWSl7IHRoaXMudmFsID0gW10gfSBcbiAgICAgICAgfSBcblxuICAgICAgICBpZihub2RlLnR5cGUgIT09IHR5cGVzLkNPTlRBSU5FUil7XG4gICAgICAgICAgICBsZXQgbmFtZSA9IG5vZGUubmFtZTtcbiAgICAgICAgICAgIGlmKG5hbWUuaW5jbHVkZXMoJ18nKSkgbmFtZSA9IG5hbWUuc3BsaXQoJ18nKVtuYW1lLnNwbGl0KCdfJykubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBub2RlLnBhcmVudC52aXJ0dWFsTm9kZS52YWxbbmFtZV0gPSB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobm9kZS5tb2RpZmllcnMpe1xuICAgICAgICAgICAgbGV0IG1vZGlmaWVyS2V5cyA9IE9iamVjdC5rZXlzKG1vZGlmaWVycyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1vZGlmaWVyS2V5cy5mb3JFYWNoKG1vZGlmaWVyS2V5ID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzW21vZGlmaWVyS2V5XSA9IG1vZGlmaWVyc1ttb2RpZmllcktleV07XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgICAgIFxuXG4gICAgICAgIC8vc2V0IHRoaXMucGFyZW50XG4gICAgICAgIC8vc2V0IHRoaXMudmFsdWVcbiAgICAgICAgLy9zZXQgZWFjaCBtb2RpZmllclxuICAgICAgICBcbiAgICAvLyAgICAgdGhpcy5wYXJlbnQ7XG5cbiAgICAvLyAgICAgaWYobm9kZS50eXBlID09PSB0eXBlcy5DT05UQUlORVIpe1xuICAgIC8vICAgICAgICAgY29uc3QgcGFyZW50SG9sZGVyID0gbm9kZS5wYXJlbnQ7XG4gICAgLy8gICAgICAgICBub2RlLnBhcmVudCA9IG51bGw7XG4gICAgLy8gICAgICAgICBsZXQgdmFsdWUgPSBub2RlLnVuc2hlYXRoZUNoaWxkcmVuKCk7XG4gICAgLy8gICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudEhvbGRlcjtcbiAgICAvLyAgICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgLy8gICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVtrZXldO1xuICAgIC8vICAgICAgICAgdGhpcy5nZXREYXRhID0gKCkgPT4ge1xuICAgIC8vICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgIH0pXG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgICB0aGlzLmdldERhdGEgPSAoKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgbGV0IHBvaW50ZXIgPSBub2RlO1xuICAgIC8vICAgICAgICAgd2hpbGUocG9pbnRlci50eXBlICE9PSB0eXBlcy5DT05UQUlORVIpe1xuICAgIC8vICAgICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyLnBhcmVudDtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGNvbnN0IHJvdXRlID0gbm9kZS5pZC5zcGxpdChwb2ludGVyLm5hbWUpWzFdLnNwbGl0KCcuJyk7XG4gICAgLy8gICAgICAgICByb3V0ZS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICBcbiAgICAvLyAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyLlZpcnR1YWxOb2RlO1xuICAgIC8vICAgICAgICAgbGV0IGZpbmFsID0gcm91dGVbcm91dGUubGVuZ3RoIC0xXTtcbiAgICAvLyAgICAgICAgIHJvdXRlLnNwbGljZShyb3V0ZS5sZW5ndGgtMSwgMSk7XG4gICAgLy8gICAgICAgICBpZihmaW5hbC5pbmNsdWRlcygnXycpKXtcbiAgICAvLyAgICAgICAgICAgICBmaW5hbCA9IGZpbmFsLnNwbGl0KCdfJyk7XG4gICAgLy8gICAgICAgICAgICAgZmluYWwgPSBmaW5hbFtmaW5hbC5sZW5ndGggLSAxXTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgcm91dGUuZm9yRWFjaChuYW1lID0+IHtcbiAgICAvLyAgICAgICAgICAgICBpZihuYW1lLmluY2x1ZGVzKCdfJykpe1xuICAgIC8vICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnXycpO1xuICAgIC8vICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZVtuYW1lLmxlbmd0aCAtMV07XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyW25hbWVdXG4gICAgLy8gICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgLy8gICAgICAgICByZXR1cm4gcG9pbnRlcltmaW5hbF07XG4gICAgLy8gICAgIH1cbiAgICAgICAgXG4gICAgLy8gICAgIHRoaXMudXBkYXRlVG8gPSAoZGF0YSkgPT4ge1xuICAgIC8vICAgICAgICAgbGV0IHBvaW50ZXIgPSBub2RlO1xuICAgIC8vICAgICAgICAgd2hpbGUocG9pbnRlci50eXBlICE9PSB0eXBlcy5DT05UQUlORVIpe1xuICAgIC8vICAgICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyLnBhcmVudDtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIGNvbnN0IHJvdXRlID0gbm9kZS5pZC5zcGxpdChwb2ludGVyLm5hbWUpWzFdLnNwbGl0KCcuJyk7XG4gICAgLy8gICAgICAgICByb3V0ZS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICBcbiAgICAvLyAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyLlZpcnR1YWxOb2RlO1xuICAgIC8vICAgICAgICAgbGV0IGZpbmFsID0gcm91dGVbcm91dGUubGVuZ3RoIC0xXTtcbiAgICAvLyAgICAgICAgIHJvdXRlLnNwbGljZShyb3V0ZS5sZW5ndGgtMSwgMSk7XG4gICAgLy8gICAgICAgICBpZihmaW5hbC5pbmNsdWRlcygnXycpKXtcbiAgICAvLyAgICAgICAgICAgICBmaW5hbCA9IGZpbmFsLnNwbGl0KCdfJyk7XG4gICAgLy8gICAgICAgICAgICAgZmluYWwgPSBmaW5hbFtmaW5hbC5sZW5ndGggLSAxXTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgIC8vICAgICAgICAgcm91dGUuZm9yRWFjaChuYW1lID0+IHtcbiAgICAvLyAgICAgICAgICAgICBpZihuYW1lLmluY2x1ZGVzKCdfJykpe1xuICAgIC8vICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZS5zcGxpdCgnXycpO1xuICAgIC8vICAgICAgICAgICAgICAgICBuYW1lID0gbmFtZVtuYW1lLmxlbmd0aCAtMV07XG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyW25hbWVdXG4gICAgLy8gICAgICAgICB9KVxuICAgICAgICAgICAgXG4gICAgLy8gICAgICAgICBwb2ludGVyW2ZpbmFsXSA9IGRhdGE7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvL3RoZSBtb2RpZmllcnMgbmVlZCB0byBiZSBwdXQgaW4gZHluYW1pY2FsbHksXG4gICAgLy9hcyBkb2VzIGtleVN1YnNjcmliZVxuICAgIH0gICBcbiAgICB1cGRhdGVUbyhkYXRhKXtcbiAgICAgICAgdGhpcy52YWwgPSBkYXRhO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVmlydHVhbE5vZGU7XG5cbi8qXG52Tm9kZS51cGRhdGVUbyA9IChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3V0ZSA9IG5vZGUuaWQuc3BsaXQoY29udGV4dC5uYW1lKVsxXS5zcGxpdCgnLicpXG4gICAgICAgICAgICByb3V0ZS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnN0IHJvdXRlID0gbm9kZS5pZC5zcGxpdChjb250ZXh0Lm5hbWUpWzFdLmpvaW4oKS5zcGxpdCgnLicpOyAvL2FsbCB0aGUgc2hpdCBhZnRlciB0aGUgcm91dGUgdG8gdGhlIGNvbnRleHQgXG4gICAgICAgICAgICBsZXQgcG9pbnRlciA9IGNvbnRleHQudmlydHVhbE5vZGU7XG4gICAgICAgICAgICBsZXQgZmluYWwgPSByb3V0ZVtyb3V0ZS5sZW5ndGgtMV07XG4gICAgICAgICAgICBpZihmaW5hbC5pbmNsdWRlcygnXycpKSBmaW5hbCA9IGZpbmFsLnNwbGl0KCdfJylbMV1cbiAgICAgICAgICAgIHJvdXRlLnNwbGljZShyb3V0ZS5sZW5ndGgtMSwgMSk7XG5cbiAgICAgICAgICAgIHJvdXRlLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAgIGlmKGl0ZW0uaW5jbHVkZXMoJ18nKSl7XG4gICAgICAgICAgICAgICAgcG9pbnRlciA9IHBvaW50ZXJbaXRlbS5zcGxpdCgnXycpWzFdXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyID0gcG9pbnRlcltpdGVtXTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgcG9pbnRlcltmaW5hbF0gPSBkYXRhO1xuICAgICAgICAgIH07XG4qLyIsImltcG9ydCAqIGFzIHR5cGVzIGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCBWaXJ0dWFsTm9kZSBmcm9tICcuL3ZpcnR1YWxOb2RlLmpzJ1xuXG5cbmNsYXNzIFNpbG9Ob2RlIHtcbiAgY29uc3RydWN0b3IobmFtZSwgdmFsdWUsIHBhcmVudCA9IG51bGwsIG1vZGlmaWVycyA9IHt9LCB0eXBlID0gdHlwZXMuUFJJTUlUSVZFLCBkZXZUb29sID0gbnVsbCkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMubW9kaWZpZXJzID0gbW9kaWZpZXJzO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLnN1YnNjcmliZXJzID0gW107XG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7IC8vIGNpcmN1bGFyIHNpbG8gbm9kZVxuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5kZXZUb29sID0gZGV2VG9vbDtcbiAgICAvLyBiaW5kXG4gICAgdGhpcy5saW5rTW9kaWZpZXJzID0gdGhpcy5saW5rTW9kaWZpZXJzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5ydW5Nb2RpZmllcnMgPSB0aGlzLnJ1bk1vZGlmaWVycy5iaW5kKHRoaXMpO1xuICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMgPSB0aGlzLm5vdGlmeVN1YnNjcmliZXJzLmJpbmQodGhpcyk7IFxuICAgIHRoaXMuZ2V0U3RhdGUgPSB0aGlzLmdldFN0YXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNvbnN0cnVjdEFycmF5ID0gdGhpcy5yZWNvbnN0cnVjdEFycmF5LmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNvbnN0cnVjdE9iamVjdCA9IHRoaXMucmVjb25zdHJ1Y3RPYmplY3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyA9IHRoaXMuZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWNvbnN0cnVjdCA9IHRoaXMucmVjb25zdHJ1Y3QuYmluZCh0aGlzKTtcbiAgICB0aGlzLnB1c2hUb1N1YnNjcmliZXJzID0gdGhpcy5wdXNoVG9TdWJzY3JpYmVycy5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleCA9IHRoaXMucmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleCh0aGlzKTtcbiAgICBcbiAgICAvLyBpbnZva2UgZnVuY3Rpb25zXG4gICAgdGhpcy5ydW5RdWV1ZSA9IHRoaXMucnVuTW9kaWZpZXJzKCk7XG4gICAgXG4gICAgaWYodGhpcy50eXBlID09PSAnQVJSQVknIHx8IHRoaXMudHlwZSA9PT0gJ09CSkVDVCcpe1xuICAgICAgdGhpcy5tb2RpZmllcnMua2V5U3Vic2NyaWJlID0gKGtleSwgcmVuZGVyRnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMubmFtZSArICdfJyArIGtleTtcbiAgICAgICAgY29uc3Qgc3Vic2NyaWJlZEF0SW5kZXggPSB0aGlzLnZhbHVlW25hbWVdLnB1c2hUb1N1YnNjcmliZXJzKHJlbmRlckZ1bmN0aW9uKTtcbiAgICAgICAgdGhpcy52YWx1ZVtuYW1lXS5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgIHJldHVybiAoKSA9PiB7dGhhdC52YWx1ZVtuYW1lXS5yZW1vdmVGcm9tU3Vic2NyaWJlcnNBdEluZGV4KHN1YnNjcmliZWRBdEluZGV4KX1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy5pZDtcbiAgICB0aGlzLmlzc3VlSUQoKTtcbiAgICB0aGlzLnZpcnR1YWxOb2RlID0gbmV3IFZpcnR1YWxOb2RlKHRoaXMsIHRoaXMubW9kaWZpZXJzKTtcbiAgfVxuXG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICB9XG5cbiAgc2V0IG5hbWUobmFtZSkge1xuICAgIGlmICghbmFtZSB8fCB0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHRocm93IG5ldyBFcnJvcignTmFtZSBpcyByZXF1aXJlZCBhbmQgc2hvdWxkIGJlIGEgc3RyaW5nJylcbiAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gIH1cblxuICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgZ2V0IG1vZGlmaWVycygpIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kaWZpZXJzO1xuICB9XG5cbiAgc2V0IG1vZGlmaWVycyhtb2RpZmllcnMpIHtcbiAgICBpZiAodHlwZW9mIG1vZGlmaWVycyAhPT0gJ29iamVjdCcgfHwgQXJyYXkuaXNBcnJheShtb2RpZmllcnMpKSB0aHJvdyBuZXcgRXJyb3IoJ01vZGlmaWVycyBtdXN0IGJlIGEgcGxhaW4gb2JqZWN0Jyk7XG4gICAgdGhpcy5fbW9kaWZpZXJzID0gbW9kaWZpZXJzO1xuICB9XG5cbiAgZ2V0IHF1ZXVlKCkge1xuICAgIHJldHVybiB0aGlzLl9xdWV1ZTtcbiAgfVxuXG4gIHNldCBxdWV1ZShxdWV1ZSkge1xuICAgIHRoaXMuX3F1ZXVlID0gcXVldWU7XG4gIH1cblxuICBnZXQgcGFyZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gIH1cblxuICBzZXQgcGFyZW50KHBhcmVudCkge1xuICAgIGlmIChwYXJlbnQgJiYgcGFyZW50LmNvbnN0cnVjdG9yLm5hbWUgIT09ICdTaWxvTm9kZScpIHRocm93IG5ldyBFcnJvcignUGFyZW50IG11c3QgYmUgbnVsbCBvciBhIHNpbG9Ob2RlJyk7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgZ2V0IHN1YnNjcmliZXJzKCkge1xuICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmVycztcbiAgfVxuXG4gIHNldCBzdWJzY3JpYmVycyhzdWJzY3JpYmVycykge1xuICAgIHRoaXMuX3N1YnNjcmliZXJzID0gc3Vic2NyaWJlcnM7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuXG4gIHNldCB0eXBlKHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnIHx8ICF0eXBlc1t0eXBlXSkgdGhyb3cgbmV3IEVycm9yKCdUeXBlIG11c3QgYmUgYW4gYXZhaWxhYmxlIGNvbnN0YW50Jyk7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gIH1cblxuICBnZXQgdmlydHVhbE5vZGUoKXtcbiAgICByZXR1cm4gdGhpcy5fdmlydHVhbE5vZGVcbiAgfVxuXG4gIHNldCB2aXJ0dWFsTm9kZSh2aXJ0dWFsTm9kZSl7XG4gICAgdGhpcy5fdmlydHVhbE5vZGUgPSB2aXJ0dWFsTm9kZTtcbiAgfVxuXG4gIGdldCBpZCgpe1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuXG4gXG5cbiAgcHVzaFRvU3Vic2NyaWJlcnMocmVuZGVyRnVuY3Rpb24pe1xuICAgIHRoaXMuc3Vic2NyaWJlcnMucHVzaChyZW5kZXJGdW5jdGlvbik7XG4gIH1cblxuICByZW1vdmVGcm9tU3Vic2NyaWJlcnNBdEluZGV4KGluZGV4KXtcbiAgICB0aGlzLnN1YmNyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzLnNsaWNlKGluZGV4LCAxKTtcbiAgfVxuXG4gIC8vdGhlcmUncyBubyBzZXR0ZXIgZm9yIHRoZSBJRCBiZWNhdXNlIHlvdSBjYW50IHNldCBpdCBkaXJlY3RseS4geW91IGhhdmUgdG8gdXNlIGlzc3VlSURcblxuICAvL2lzc3VlSUQgTVVTVCBCRSBDQUxMRUQgT04gVEhFIE5PREVTIElOIE9SREVSIFJPT1QgVE8gTEVBRi4gaXQgYWx3YXlzIGFzc3VtZXMgdGhhdCB0aGlzIG5vZGUncyBwYXJlbnQgd2lsbFxuICAvL2hhdmUgaGFkIGlzc3VlSUQgY2FsbGVkIG9uIGl0IGJlZm9yZS4gdXNlIGFwcGx5VG9TaWxvIHRvIG1ha2Ugc3VyZSBpdCBydW5zIGluIHRoZSByaWdodCBvcmRlclxuICBpc3N1ZUlEKCl7XG4gICAgaWYodGhpcy5wYXJlbnQgPT09IG51bGwpeyAvL2l0cyB0aGUgcm9vdCBub2RlXG4gICAgICB0aGlzLl9pZCA9IHRoaXMubmFtZTtcbiAgICB9IGVsc2UgeyAgICAgICAgICAgICAgICAgIC8vaXRzIG5vdCB0aGUgcm9vdCBub2RlXG4gICAgICB0aGlzLl9pZCA9IHRoaXMucGFyZW50LmlkICsgJy4nICsgdGhpcy5uYW1lO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeVN1YnNjcmliZXJzKCkge1xuICAgIGlmICh0aGlzLnN1YnNjcmliZXJzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIC8vIHN1YnNjcmliZXJzIGlzIGFuIGFycmF5IG9mIGZ1bmN0aW9ucyB0aGF0IG5vdGlmeSBzdWJzY3JpYmVkIGNvbXBvbmVudHMgb2Ygc3RhdGUgY2hhbmdlc1xuICAgIHRoaXMuc3Vic2NyaWJlcnMuZm9yRWFjaChmdW5jID0+IHtcbiAgICAgIGlmICh0eXBlb2YgZnVuYyAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IEVycm9yKCdTdWJzY3JpYmVyIGFycmF5IG11c3Qgb25seSBjb250YWluIGZ1bmN0aW9ucycpO1xuICAgICAgLy8gcGFzcyB0aGUgdXBkYXRlZCBzdGF0ZSBpbnRvIHRoZSBzdWJzY3JpYmUgZnVuY3Rpb25zIHRvIHRyaWdnZXIgcmUtcmVuZGVycyBvbiB0aGUgZnJvbnRlbmQgXG4gICAgICBmdW5jKHRoaXMuZ2V0U3RhdGUoKSk7XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnZva2VkIG9uY2UgaW4gdGhlIHNpbG9Ob2RlIGNvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIGNsb3N1cmUuIFRoZSBjbG9zdXJlIHZhcmlhYmxlIFxuICAgKiAncnVubmluZycgcHJldmVudHMgdGhlIHJldHVybmVkIGFzeW5jIGZ1bmN0aW9uIGZyb20gYmVpbmcgaW52b2tlZCBpZiBpdCdzXG4gICAqIHN0aWxsIHJ1bm5pbmcgZnJvbSBhIHByZXZpb3VzIGNhbGxcbiAgICovXG4gIHJ1bk1vZGlmaWVycygpIHtcbiAgICBsZXQgcnVubmluZyA9IGZhbHNlOyAvLyBwcmV2ZW50cyBtdWx0aXBsZSBjYWxscyBmcm9tIGJlaW5nIG1hZGUgaWYgc2V0IHRvIGZhbHNlXG5cbiAgICBhc3luYyBmdW5jdGlvbiBydW4oKSB7XG4gICAgICBpZiAocnVubmluZyA9PT0gZmFsc2UpIHsgLy8gcHJldmVudHMgbXVsdGlwbGUgY2FsbHMgZnJvbSBiZWluZyBtYWRlIGlmIGFscmVhZHkgcnVubmluZ1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgLy8gcnVucyB0aHJvdWdoIGFueSBtb2RpZmllcnMgdGhhdCBoYXZlIGJlZW4gYWRkZWQgdG8gdGhlIHF1ZXVlXG4gICAgICAgIHdoaWxlICh0aGlzLnF1ZXVlLmxlbmd0aCA+IDApIHtcblxuICAgICAgICAgIC8vIGVuZm9yY2VzIHRoYXQgd2UgYWx3YXlzIHdhaXQgZm9yIGEgbW9kaWZpZXIgdG8gZmluaXNoIGJlZm9yZSBwcm9jZWVkaW5nIHRvIHRoZSBuZXh0XG4gICAgICAgICAgbGV0IG5leHRNb2RpZmllciA9IHRoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgICBsZXQgcHJldmlvdXNTdGF0ZSA9IG51bGw7XG4gICAgICAgICAgaWYodGhpcy5kZXZUb29sKSB7XG4gICAgICAgICAgICBpZih0aGlzLnR5cGUgIT09IHR5cGVzLlBSSU1JVElWRSkge1xuICAgICAgICAgICAgICBwcmV2aW91c1N0YXRlID0gdGhpcy5yZWNvbnN0cnVjdCh0aGlzLm5hbWUsIHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcHJldmlvdXNTdGF0ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudmFsdWUgPSBhd2FpdCBuZXh0TW9kaWZpZXIoKTtcbiAgICAgICAgICBpZih0aGlzLmRldlRvb2wpIHtcbiAgICAgICAgICAgIHRoaXMuZGV2VG9vbC5ub3RpZnkocHJldmlvdXNTdGF0ZSwgdGhpcy52YWx1ZSwgdGhpcy5uYW1lLCBuZXh0TW9kaWZpZXIubW9kaWZpZXJOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy52aXJ0dWFsTm9kZS51cGRhdGVUbyh0aGlzLnZhbHVlKTtcbiAgICAgICAgICBpZiAodGhpcy50eXBlICE9PSB0eXBlcy5QUklNSVRJVkUpIHRoaXMudmFsdWUgPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcygpLnZhbHVlO1xuICAgICAgICAgIFxuICAgICAgICAgIHRoaXMubm90aWZ5U3Vic2NyaWJlcnMoKTtcbiAgICAgICAgfVxuICAgICAgICBydW5uaW5nID0gZmFsc2U7ICAgXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ1bjtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWNvbnN0cnVjdHMgb2JqZWN0cyBpbnRvIGEgcGFyZW50IHNpbG9Ob2RlIHdpdGggYSB0eXBlIG9mIG9iamVjdC9hcnJheSwgYW5kXG4gICAqIGNoaWxkcmVuIHNpbG9Ob2RlcyB3aXRoIHZhbHVlcyBwZXJ0YWluaW5nIHRvIHRoZSBjb250ZW50cyBvZiB0aGUgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvYmpOYW1lIC0gVGhlIGludGVuZGVkIGtleSBvZiB0aGUgb2JqZWN0IHdoZW4gc3RvcmVkIGluIHRoZSBzaWxvXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RUb0RlY29uc3RydWN0IC0gQW55IG9iamVjdCB0aGF0IG11c3QgY29udGFpbiBhIGtleSBvZiB2YWx1ZVxuICAgKiBAcGFyYW0ge1NpbG9Ob2RlfSBwYXJlbnQgLSBJbnRlbmRlZCBTaWxvTm9kZSBwYXJlbnQgdG8gdGhlIGRlY29uc3RydWN0ZWQgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcnVuTGlua2VkTW9kcyAtIFRydWUgb25seSB3aGVuIGJlaW5nIGNhbGxlZCBmb3IgYSBjb25zdHJ1Y3Rvck5vZGVcbiAgICovXG4gIGRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyhvYmpOYW1lID0gdGhpcy5uYW1lLCBvYmplY3RUb0RlY29uc3RydWN0ID0gdGhpcywgcGFyZW50ID0gdGhpcy5wYXJlbnQsIHJ1bkxpbmtlZE1vZHMgPSBmYWxzZSkge1xuICAgIGNvbnN0IG9iakNoaWxkcmVuID0ge307XG4gICAgbGV0IHR5cGUsIGtleXM7XG4gIFxuICAgIC8vIGRldGVybWluZSBpZiB0aGUgb2JqZWN0VG9EZWNvbnN0cnVjdCBpcyBhbiBhcnJheSBvciBwbGFpbiBvYmplY3RcbiAgICBpZiAoQXJyYXkuaXNBcnJheShvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlKSkge1xuICAgICAga2V5cyA9IG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWU7XG4gICAgICB0eXBlID0gdHlwZXMuQVJSQVk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3RUb0RlY29uc3RydWN0LnZhbHVlKTtcbiAgICAgIHR5cGUgPSB0eXBlcy5PQkpFQ1Q7XG4gICAgfVxuICAgIFxuICAgIC8vIGEgc2lsb25vZGUgbXVzdCBiZSBjcmVhdGVkIGJlZm9yZSBpdHMgY2hpbGRyZW4gYXJlIG1hZGUsIGJlY2F1c2UgdGhlIGNoaWxkcmVuIG5lZWQgdG8gaGF2ZVxuICAgIC8vIHRoaXMgZXhhY3Qgc2lsb25vZGUgcGFzc2VkIGludG8gdGhlbSBhcyBhIHBhcmVudCwgaGVuY2Ugb2JqQ2hpbGRyZW4gaXMgY3VycmVudGx5IGVtcHR5XG4gICAgY29uc3QgbmV3U2lsb05vZGUgPSBuZXcgU2lsb05vZGUob2JqTmFtZSwgb2JqQ2hpbGRyZW4sIHBhcmVudCwgb2JqZWN0VG9EZWNvbnN0cnVjdC5tb2RpZmllcnMsIHR5cGUsIHRoaXMuZGV2VG9vbCk7XG4gICAgXG4gICAgLy8gZm9yIGFycmF5cyBvbmx5XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZSkgJiYgb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHZhbHVlcyBpbiB0aGUgb2JqZWN0VG9EZWNvbnN0cnVjdCB0byBjcmVhdGUgc2lsb05vZGVzIGZvciBlYWNoIG9mIHRoZW1cbiAgICAgIG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWUuZm9yRWFjaCgoaW5kZXhlZFZhbCwgaSkgPT4ge1xuICAgICAgICAvLyByZWN1cnNlIGlmIHRoZSBhcnJheSBoYXMgb2JqZWN0cyBzdG9yZWQgaW4gaXRzIGluZGljZXMgdGhhdCBuZWVkIGZ1cnRoZXIgZGVjb25zdHJ1Y3RpbmdcbiAgICAgICAgaWYgKHR5cGVvZiBpbmRleGVkVmFsID09PSAnb2JqZWN0Jykgb2JqQ2hpbGRyZW5bYCR7b2JqTmFtZX1fJHtpfWBdID0gdGhpcy5kZWNvbnN0cnVjdE9iamVjdEludG9TaWxvTm9kZXMoYCR7b2JqTmFtZX1fJHtpfWAsIHt2YWx1ZTogaW5kZXhlZFZhbH0sIG5ld1NpbG9Ob2RlLCBydW5MaW5rZWRNb2RzKTtcbiAgICAgICAgLy8gb3RoZXJ3aXNlIGZvciBwcmltaXRpdmVzIHdlIGNhbiBnbyBzdHJhaWdodCB0byBjcmVhdGluZyBhIG5ldyBzaWxvTm9kZVxuICAgICAgICAvLyB0aGUgbmFtaW5nIGNvbnZlbnRpb24gZm9yIGtleXMgaW52b2x2ZXMgYWRkaW5nICdfaScgdG8gdGhlIG9iamVjdCBuYW1lXG4gICAgICAgIGVsc2Ugb2JqQ2hpbGRyZW5bYCR7b2JqTmFtZX1fJHtpfWBdID0gbmV3IFNpbG9Ob2RlKGAke29iak5hbWV9XyR7aX1gLCBpbmRleGVkVmFsLCBuZXdTaWxvTm9kZSwge30sIHR5cGVzLlBSSU1JVElWRSwgdGhpcy5kZXZUb29sKTtcbiAgICAgIH0pXG4gICAgfSBcbiAgICBcbiAgICAvLyBmb3IgcGxhaW4gb2JqZWN0c1xuICAgIGVsc2UgaWYgKGtleXMubGVuZ3RoID4gMCkge1xuICAgICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBrZXkvdmFsdWUgcGFpcnMgaW4gdGhlIG9iamVjdFRvRGVjb25zdHJ1Y3QgdG8gY3JlYXRlIHNpbG9Ob2RlcyBmb3IgZWFjaCBvZiB0aGVtXG4gICAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgLy8gcmVjdXJzZSBpZiB0aGUgb2JqZWN0IGhhcyBvYmplY3RzIHN0b3JlZCBpbiBpdHMgdmFsdWVzIHRoYXQgbmVlZCBmdXJ0aGVyIGRlY29uc3RydWN0aW5nXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZVtrZXldID09PSAnb2JqZWN0Jykgb2JqQ2hpbGRyZW5bYCR7b2JqTmFtZX1fJHtrZXl9YF0gPSB0aGlzLmRlY29uc3RydWN0T2JqZWN0SW50b1NpbG9Ob2RlcyhgJHtvYmpOYW1lfV8ke2tleX1gLCB7dmFsdWU6IG9iamVjdFRvRGVjb25zdHJ1Y3QudmFsdWVba2V5XX0sIG5ld1NpbG9Ob2RlLCBydW5MaW5rZWRNb2RzKTtcbiAgICAgICAgLy8gb3RoZXJ3aXNlIGZvciBwcmltaXRpdmVzIHdlIGNhbiBnbyBzdHJhaWdodCB0byBjcmVhdGluZyBhIG5ldyBzaWxvTm9kZVxuICAgICAgICAvLyB0aGUgbmFtaW5nIGNvbnZlbnRpb24gZm9yIGtleXMgaW52b2x2ZXMgYWRkaW5nICdfa2V5JyB0byB0aGUgb2JqZWN0IG5hbWUgXG4gICAgICAgIGVsc2Ugb2JqQ2hpbGRyZW5bYCR7b2JqTmFtZX1fJHtrZXl9YF0gPSBuZXcgU2lsb05vZGUoYCR7b2JqTmFtZX1fJHtrZXl9YCwgb2JqZWN0VG9EZWNvbnN0cnVjdC52YWx1ZVtrZXldLCBuZXdTaWxvTm9kZSwge30sIHR5cGVzLlBSSU1JVElWRSwgdGhpcy5kZXZUb29sKTtcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gbGlua01vZGlmaWVycyBzaG91bGQgb25seSBiZSBydW4gaWYgYSBjb25zdHJ1Y3Rvck5vZGUgaGFzIGJlZW4gcGFzc2VkIGludG8gdGhpcyBmdW5jdGlvblxuICAgIC8vIGJlY2F1c2UgdGhhdCBtZWFucyB0aGF0IHRoZSBzaWxvIGlzIGJlaW5nIGNyZWF0ZWQgZm9yIHRoZSBmaXJzdCB0aW1lIGFuZCB0aGUgbW9kaWZpZXJzIG5lZWRcbiAgICAvLyB0byBiZSB3cmFwcGVkLiBGb3IgZGVjb25zdHJ1Y3RlZCBvYmplY3RzIGF0IHJ1bnRpbWUsIHdyYXBwaW5nIGlzIG5vdCByZXF1aXJlZFxuICAgIGlmIChydW5MaW5rZWRNb2RzKSBuZXdTaWxvTm9kZS5saW5rTW9kaWZpZXJzKCk7XG5cbiAgICByZXR1cm4gbmV3U2lsb05vZGU7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHMgZGV2ZWxvcGVyIHdyaXR0ZW4gbW9kaWZpZXJzIGluIGFzeW5jIGZ1bmN0aW9ucyB3aXRoIHN0YXRlIHBhc3NlZCBpbiBhdXRvbWF0aWNhbGx5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBub2RlTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzaWxvTm9kZVxuICAgKiBAcGFyYW0ge29iamVjdH0gc3RhdGVNb2RpZmllcnMgLSBBbiBvYmplY3QgY29udGFpbmluZyB1bndyYXBwZWQgbW9kaWZpZXJzIG1vc3QgbGlrZWx5IGZyb20gdGhlIGNvbnN0cnVjdG9yTm9kZVxuICAgKi9cbiAgbGlua01vZGlmaWVycyhub2RlTmFtZSA9IHRoaXMubmFtZSwgc3RhdGVNb2RpZmllcnMgPSB0aGlzLm1vZGlmaWVycykge1xuICAgIGlmICghc3RhdGVNb2RpZmllcnMgfHwgT2JqZWN0LmtleXMoc3RhdGVNb2RpZmllcnMpLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuXG4gICAgLy8gbG9vcHMgdGhyb3VnaCBldmVyeSBtb2RpZmllciBjcmVhdGVkIGJ5IHRoZSBkZXZcbiAgICBPYmplY3Qua2V5cyhzdGF0ZU1vZGlmaWVycykuZm9yRWFjaChtb2RpZmllcktleSA9PiB7XG5cbiAgICAgIC8vIHJlbmFtZWQgZm9yIGNvbnZlbmllbmNlXG4gICAgICBjb25zdCBtb2RpZmllciA9IHN0YXRlTW9kaWZpZXJzW21vZGlmaWVyS2V5XTtcbiAgICAgIGlmICh0eXBlb2YgbW9kaWZpZXIgIT09ICdmdW5jdGlvbicgKSB0aHJvdyBuZXcgRXJyb3IoJ0FsbCBtb2RpZmllcnMgbXVzdCBiZSBmdW5jdGlvbnMnKTsgXG5cbiAgICAgIC8vIG1vZGlmaWVycyB3aXRoIGFyZ3VtZW50IGxlbmd0aHMgb2YgMiBvciBsZXNzIGFyZSBtZWFudCB0byBlZGl0IHByaW1pdGl2ZSB2YWx1ZXNcbiAgICAgIC8vIE9SIGFycmF5cy9vYmplY3RzIGluIHRoZWlyIGVudGlyZXR5IChub3Qgc3BlY2lmaWMgaW5kaWNlcylcbiAgICAgIGVsc2UgaWYgKG1vZGlmaWVyLmxlbmd0aCA8PSAyKSB7XG4gICAgICAgIC8vIHRoZSBkZXYncyBtb2RpZmllciBmdW5jdGlvbiBuZWVkcyB0byBiZSB3cmFwcGVkIGluIGFub3RoZXIgZnVuY3Rpb24gc28gd2UgY2FuIHBhc3MgXG4gICAgICAgIC8vIHRoZSBjdXJyZW50IHN0YXRlIHZhbHVlIGludG8gdGhlICdjdXJyZW50JyBwYXJhbWV0ZXJcbiAgICAgICAgbGV0IGxpbmtlZE1vZGlmaWVyO1xuICAgICAgICAvLyBmb3IgcHJpbWl0aXZlcyB3ZSBjYW4gcGFzcyB0aGUgdmFsdWUgc3RyYWlnaHQgaW50byB0aGUgbW9kaWZpZXJcbiAgICAgICAgaWYgKHRoYXQudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSBsaW5rZWRNb2RpZmllciA9IGFzeW5jIChwYXlsb2FkKSA9PiBhd2FpdCBtb2RpZmllcih0aGF0LnZhbHVlLCBwYXlsb2FkKTtcbiAgICAgICAgLy8gZm9yIG9iamVjdHMgd2UgbmVlZCB0byByZWNvbnN0cnVjdCB0aGUgb2JqZWN0IGJlZm9yZSBpdCBpcyBwYXNzZWQgaW50byB0aGUgbW9kaWZpZXJcbiAgICAgICAgZWxzZSBpZiAodGhhdC50eXBlID09PSB0eXBlcy5PQkpFQ1QgfHwgdGhhdC50eXBlID09PSB0eXBlcy5BUlJBWSkge1xuICAgICAgICAgIGxpbmtlZE1vZGlmaWVyID0gYXN5bmMgKHBheWxvYWQpID0+IGF3YWl0IG1vZGlmaWVyKHRoaXMucmVjb25zdHJ1Y3Qobm9kZU5hbWUsIHRoYXQpLCBwYXlsb2FkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gdGhlIGxpbmtlZE1vZGlmaWVyIGZ1bmN0aW9uIHdpbGwgYmUgd3JhcHBlZCBpbiBvbmUgbW9yZSBmdW5jdGlvbi4gVGhpcyBmaW5hbCBmdW5jdGlvbiBpcyB3aGF0XG4gICAgICAgIC8vIHdpbGwgYmUgcmV0dXJuZWQgdG8gdGhlIGRldmVsb3BlclxuICAgICAgICAvLyB0aGlzIGZ1bmN0aW9uIGFkZHMgdGhlIGxpbmtlZE1vZGlmaWVyIGZ1bmN0aW9uIHRvIHRoZSBhc3luYyBxdWV1ZSB3aXRoIHRoZSBwYXlsb2FkIHBhc3NlZCBpbiBhc1xuICAgICAgICAvLyB0aGUgb25seSBwYXJhbWV0ZXIuIEFmdGVyd2FyZCB0aGUgcXVldWUgaXMgaW52b2tlZCB3aGljaCB3aWxsIGJlZ2luIG1vdmluZyB0aHJvdWdoIHRoZSBcbiAgICAgICAgLy8gbGlzdCBvZiBtb2RpZmllcnNcbiAgICAgICAgdGhpcy5tb2RpZmllcnNbbW9kaWZpZXJLZXldID0gcGF5bG9hZCA9PiB7XG4gICAgICAgICAgLy8gd3JhcCB0aGUgbGlua2VkTW9kaWZpZXIgYWdhaW4gc28gdGhhdCBpdCBjYW4gYmUgYWRkZWQgdG8gdGhlIGFzeW5jIHF1ZXVlIHdpdGhvdXQgYmVpbmcgaW52b2tlZFxuICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXN5bmMgKCkgPT4gYXdhaXQgbGlua2VkTW9kaWZpZXIocGF5bG9hZCk7XG4gICAgICAgICAgaWYodGhpcy5kZXZUb29sKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5tb2RpZmllck5hbWUgPSBtb2RpZmllcktleTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhhdC5xdWV1ZS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgICB0aGF0LnJ1blF1ZXVlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbW9kaWZpZXJzIHdpdGggYXJndW1lbnQgbGVuZ3RocyBvZiBtb3JlIHRoYW4gMiBhcmUgbWVhbnQgdG8gZWRpdCBzcGVjaWZpYyBpbmRpY2VzIG9yXG4gICAgICAvLyBrZXkvdmFsdWUgcGFpcnMgb2Ygb2JqZWN0cyBPTkxZXG4gICAgICBlbHNlIGlmIChtb2RpZmllci5sZW5ndGggPiAyKSB7XG4gICAgICAgIC8vIHRoZSBkZXYncyBtb2RpZmllciBmdW5jdGlvbiBuZWVkcyB0byBiZSB3cmFwcGVkIGluIGFub3RoZXIgZnVuY3Rpb24gc28gd2UgY2FuIHBhc3MgXG4gICAgICAgIC8vIHRoZSBjdXJyZW50IHN0YXRlIHZhbHVlIGludG8gdGhlICdjdXJyZW50JyBwYXJhbWV0ZXJcbiAgICAgICAgLy8gcmVjb25zdHJ1Y3Qgd2lsbCByZWFzc2VtYmxlIG9iamVjdHMgYnV0IHdpbGwgc2ltcGx5IHJldHVybiBpZiBhIHByaW1pdGl2ZSBpcyBwYXNzZWQgaW5cbiAgICAgICAgY29uc3QgbGlua2VkTW9kaWZpZXIgPSBhc3luYyAoaW5kZXgsIHBheWxvYWQpID0+IGF3YWl0IG1vZGlmaWVyKHRoaXMucmVjb25zdHJ1Y3QoaW5kZXgsIHRoYXQudmFsdWVbaW5kZXhdKSwgaW5kZXgsIHBheWxvYWQpOyBcblxuICAgICAgICAvLyB0aGUgbGlua2VkTW9kaWZpZXIgZnVuY3Rpb24gd2lsbCBiZSB3cmFwcGVkIGluIG9uZSBtb3JlIGZ1bmN0aW9uLiBUaGlzIGZpbmFsIGZ1bmN0aW9uIGlzIHdoYXRcbiAgICAgICAgLy8gd2lsbCBiZSByZXR1cm5lZCB0byB0aGUgZGV2ZWxvcGVyXG4gICAgICAgIC8vIHRoaXMgZnVuY3Rpb24gYWRkcyB0aGUgbGlua2VkTW9kaWZpZXIgZnVuY3Rpb24gdG8gdGhlIGFzeW5jIHF1ZXVlIHdpdGggdGhlIHBheWxvYWQgcGFzc2VkIGluIGFzXG4gICAgICAgIC8vIHRoZSBvbmx5IHBhcmFtZXRlci4gQWZ0ZXJ3YXJkIHRoZSBxdWV1ZSBpcyBpbnZva2VkIHdoaWNoIHdpbGwgYmVnaW4gbW92aW5nIHRocm91Z2ggdGhlIFxuICAgICAgICAvLyBsaXN0IG9mIG1vZGlmaWVyc1xuICAgICAgICB0aGlzLm1vZGlmaWVyc1ttb2RpZmllcktleV0gPSAoaW5kZXgsIHBheWxvYWQpID0+IHtcbiAgICAgICAgICAvLyB3cmFwIHRoZSBsaW5rZWRNb2RpZmllciBhZ2FpbiBzbyB0aGF0IGl0IGNhbiBiZSBhZGRlZCB0byB0aGUgYXN5bmMgcXVldWUgd2l0aG91dCBiZWluZyBpbnZva2VkXG4gICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBhc3luYyAoKSA9PiBhd2FpdCBsaW5rZWRNb2RpZmllcihgJHt0aGlzLm5hbWV9XyR7aW5kZXh9YCwgcGF5bG9hZCk7XG4gICAgICAgICAgLy8gc2luY2UgdGhlIG1vZGlmaWVyIGlzIGNhbGxlZCBvbiB0aGUgQVJSQVkvT0JKRUNUIG5vZGUsIHdlIG5lZWQgdG8gYWRkIHRoZSBjYWxsYmFja1xuICAgICAgICAgIC8vIHRvIHRoZSBxdWV1ZSBvZiB0aGUgY2hpbGQuIFRoZSBuYW1pbmcgY29udmVudGlvbiBpczogJ29iamVjdE5hbWVfaScgfHwgJ29iamVjdE5hbWVfa2V5J1xuICAgICAgICAgIGlmKHRoaXMuZGV2VG9vbCkge1xuICAgICAgICAgICAgY2FsbGJhY2subW9kaWZpZXJOYW1lID0gbW9kaWZpZXJLZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoYXQudmFsdWVbYCR7dGhpcy5uYW1lfV8ke2luZGV4fWBdLnF1ZXVlLnB1c2goY2FsbGJhY2spO1xuICAgICAgICAgIHRoYXQudmFsdWVbYCR7dGhpcy5uYW1lfV8ke2luZGV4fWBdLnJ1blF1ZXVlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIFxuICAgIE9iamVjdC5rZXlzKHRoaXMubW9kaWZpZXJzKS5mb3JFYWNoKCBtb2RpZmllcktleSA9PiB7XG4gICAgICB0aGlzLnZpcnR1YWxOb2RlW21vZGlmaWVyS2V5XSA9IHRoaXMubW9kaWZpZXJzW21vZGlmaWVyS2V5XTtcbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEEgbWlkZGxlbWFuIGZ1bmN0aW9uIHVzZWQgZm9yIHJlZGlyZWN0aW9uLiBTaG91bGQgYmUgY2FsbGVkIHdpdGggYW4gb2JqZWN0IG5lZWRlZCByZWNvbnN0cnVjdGlvblxuICAgKiBhbmQgd2lsbCB0aGVuIGFjY3VyYXRlbHkgYXNzaWduIGl0cyBuZXh0IGRlc3RpbmF0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzaWxvTm9kZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2lsb05vZGVcbiAgICogQHBhcmFtIHtvYmplY3R9IGN1cnJTaWxvTm9kZSAtIFRoZSBhZGRyZXNzIG9mIHRoZSBwYXJlbnQgJ09CSkVDVC9BUlJBWScgc2lsb05vZGVcbiAgICovXG4gIHJlY29uc3RydWN0KHNpbG9Ob2RlTmFtZSwgY3VyclNpbG9Ob2RlKSB7XG4gICAgbGV0IHJlY29uc3RydWN0ZWRPYmplY3Q7XG4gICAgaWYgKGN1cnJTaWxvTm9kZS50eXBlID09PSB0eXBlcy5PQkpFQ1QpIHJlY29uc3RydWN0ZWRPYmplY3QgPSB0aGlzLnJlY29uc3RydWN0T2JqZWN0KHNpbG9Ob2RlTmFtZSwgY3VyclNpbG9Ob2RlKTtcbiAgICBlbHNlIGlmIChjdXJyU2lsb05vZGUudHlwZSA9PT0gdHlwZXMuQVJSQVkpIHJlY29uc3RydWN0ZWRPYmplY3QgPSB0aGlzLnJlY29uc3RydWN0QXJyYXkoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpO1xuICAgIC8vIGNhbGxlZCBpZiB0aGUgdmFsdWUgcGFzc2VkIGluIGlzIGEgcHJpbWl0aXZlXG4gICAgZWxzZSByZXR1cm4gY3VyclNpbG9Ob2RlLnZhbHVlO1xuXG4gICAgcmV0dXJuIHJlY29uc3RydWN0ZWRPYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogUmVjb25zdHJ1Y3RzIHBsYWluIG9iamVjdHMgb3V0IG9mIHNpbG9Ob2RlIHZhbHVlc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc2lsb05vZGVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNpbG9Ob2RlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjdXJyU2lsb05vZGUgLSBUaGUgYWRkcmVzcyBvZiB0aGUgcGFyZW50ICdPQkpFQ1QnIHNpbG9Ob2RlXG4gICAqL1xuICByZWNvbnN0cnVjdE9iamVjdChzaWxvTm9kZU5hbWUsIGN1cnJTaWxvTm9kZSkge1xuICAgIC8vIG91ciBjdXJyZW50bHkgZW1wdHkgb2JqZWN0IHRvIGJlIHVzZWQgZm9yIHJlY29uc3RydWN0aW9uXG4gICAgY29uc3QgbmV3T2JqZWN0ID0ge307XG4gICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBzaWxvTm9kZXMgc3RvcmVkIGluIHRoZSAnT0JKRUNUJyB2YWx1ZSB0byBleHRyYWN0IHRoZSBkYXRhXG4gICAgT2JqZWN0LmtleXMoY3VyclNpbG9Ob2RlLnZhbHVlKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAvLyBzaW1wbGlmaWVkIG5hbWVcbiAgICAgIGNvbnN0IGNoaWxkT2JqID0gY3VyclNpbG9Ob2RlLnZhbHVlW2tleV07XG4gICAgICBcbiAgICAgIC8vIGdldCB0aGUga2V5TmFtZSBmcm9tIHRoZSBuYW1pbmcgY29udmVudGlvblxuICAgICAgLy8gaWYgdGhlIHNpbG9Ob2RlIG5hbWUgaXMgJ2NhcnRfc2hpcnRzJywgdGhlIHNsaWNlIHdpbGwgZ2l2ZSB1cyAnc2hpcnRzJ1xuICAgICAgY29uc3QgZXh0cmFjdGVkS2V5ID0ga2V5LnNsaWNlKHNpbG9Ob2RlTmFtZS5sZW5ndGggKyAxKTtcbiAgICAgIC8vIGlmIGFuIGFkZGl0aW9uYWwgb2JqZWN0IGlzIHN0b3JlZCBpbiB0aGUgdmFsdWVzLCB0aGVuIHdlIG11c3QgcmVjdXJzZSB0b1xuICAgICAgLy8gcmVjb25zdHJ1Y3QgdGhlIG5lc3RlZCBvYmplY3QgYXMgd2VsbFxuICAgICAgaWYgKGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLk9CSkVDVCB8fCBjaGlsZE9iai50eXBlID09PSB0eXBlcy5BUlJBWSkge1xuICAgICAgICBuZXdPYmplY3RbZXh0cmFjdGVkS2V5XSA9IHRoaXMucmVjb25zdHJ1Y3Qoa2V5LCBjaGlsZE9iaik7XG4gICAgICB9XG4gICAgICAvLyBvdGhlcndpc2Ugd2UgaGF2ZSBhIHByaW1pdGl2ZSB2YWx1ZSB3aGljaCBjYW4gZWFzaWx5IGJlIGFkZGVkIHRvIHRoZSByZWNvbnN0cnVjdGVkXG4gICAgICAvLyBvYmplY3QgdXNpbmcgb3VyIGV4dHJhY3RlZEtleSB0byBwcm9wZXJseSBsYWJlbCBpdCBcbiAgICAgIGVsc2UgaWYgKGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLlBSSU1JVElWRSkge1xuICAgICAgICBuZXdPYmplY3RbZXh0cmFjdGVkS2V5XSA9IGNoaWxkT2JqLnZhbHVlO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBvYmplY3Qgc3VjY2Vzc2Z1bGx5IHJlY29uc3RydWN0ZWQgYXQgdGhpcyBsZXZlbFxuICAgIHJldHVybiBuZXdPYmplY3Q7XG4gIH1cblxuICAvKipcbiAgICogUmVjb25zdHJ1Y3RzIGFycmF5cyBvdXQgb2Ygc2lsb05vZGUgdmFsdWVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzaWxvTm9kZU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgc2lsb05vZGVcbiAgICogQHBhcmFtIHtvYmplY3R9IGN1cnJTaWxvTm9kZSAtIFRoZSBhZGRyZXNzIG9mIHRoZSBwYXJlbnQgJ0FSUkFZJyBzaWxvTm9kZVxuICAgKi9cbiAgcmVjb25zdHJ1Y3RBcnJheShzaWxvTm9kZU5hbWUsIGN1cnJTaWxvTm9kZSkge1xuICAgIC8vIG91ciBjdXJyZW50bHkgZW1wdHkgYXJyYXkgdG8gYmUgdXNlZCBmb3IgcmVjb25zdHJ1Y3Rpb25cbiAgICBjb25zdCBuZXdBcnJheSA9IFtdO1xuICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgc2lsb05vZGVzIHN0b3JlZCBpbiB0aGUgJ0FSUkFZJyB2YWx1ZSB0byBleHRyYWN0IHRoZSBkYXRhXG4gICAgT2JqZWN0LmtleXMoY3VyclNpbG9Ob2RlLnZhbHVlKS5mb3JFYWNoKChrZXksIGkpID0+IHtcbiAgICAgIC8vIHNpbXBsaWZpZWQgbmFtZVxuICAgICAgY29uc3QgY2hpbGRPYmogPSBjdXJyU2lsb05vZGUudmFsdWVba2V5XTtcbiAgICAgIC8vIGlmIGFuIGFkZGl0aW9uYWwgb2JqZWN0IGlzIHN0b3JlZCBpbiB0aGUgdmFsdWVzLCB0aGVuIHdlIG11c3QgcmVjdXJzZSB0b1xuICAgICAgLy8gcmVjb25zdHJ1Y3QgdGhlIG5lc3RlZCBvYmplY3QgYXMgd2VsbFxuICAgICAgaWYgKGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLkFSUkFZIHx8IGNoaWxkT2JqLnR5cGUgPT09IHR5cGVzLk9CSkVDVCkge1xuICAgICAgICBuZXdBcnJheS5wdXNoKHRoaXMucmVjb25zdHJ1Y3QoYCR7c2lsb05vZGVOYW1lfV8ke2l9YCwgY2hpbGRPYmopKTtcbiAgICAgIH0gXG4gICAgICAvLyBvdGhlcndpc2Ugd2UgaGF2ZSBhIHByaW1pdGl2ZSB2YWx1ZSB3aGljaCBjYW4gZWFzaWx5IGJlIGFkZGVkIHRvIHRoZSByZWNvbnN0cnVjdGVkXG4gICAgICAvLyBvYmplY3QgdXNpbmcgb3VyIGV4dHJhY3RlZEtleSB0byBwcm9wZXJseSBsYWJlbCBpdFxuICAgICAgZWxzZSBpZiAoY2hpbGRPYmoudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSB7XG4gICAgICAgIG5ld0FycmF5LnB1c2goY2hpbGRPYmoudmFsdWUpO1xuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBhcnJheSBzdWNjZXNzZnVsbHkgcmVjb25zdHJ1Y3RlZCBhdCB0aGlzIGxldmVsXG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgZ2V0U3RhdGUoKXtcbiAgICBpZih0aGlzLnR5cGUgPT09IHR5cGVzLkNPTlRBSU5FUil7XG4gICAgICByZXR1cm4gdGhpcy52aXJ0dWFsTm9kZVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXMudmlydHVhbE5vZGU7XG4gICAgICB3aGlsZShjb250ZXh0LnR5cGUgIT09IHR5cGVzLkNPTlRBSU5FUil7XG4gICAgICAgIGNvbnRleHQgPSBjb250ZXh0LnBhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cbiAgfVxuXG4gIC8vIHVuc2hlYXRoZUNoaWxkcmVuKCkge1xuXG4gIC8vICAgY29uc3Qgc3RhdGUgPSB7fTtcbiAgLy8gICAvLyBjYWxsIGdldFN0YXRlIG9uIHBhcmVudCBub2RlcyB1cCB0aWxsIHJvb3QgYW5kIGNvbGxlY3QgYWxsIHZhcmlhYmxlcy9tb2RpZmllcnMgZnJvbSBwYXJlbnRzXG4gIC8vICAgaWYgKHRoaXMucGFyZW50ICE9PSBudWxsKSB7XG4gIC8vICAgICBjb25zdCBwYXJlbnRTdGF0ZSA9IHRoaXMucGFyZW50LnVuc2hlYXRoZUNoaWxkcmVuKCk7XG4gIC8vICAgICBPYmplY3Qua2V5cyhwYXJlbnRTdGF0ZSkuZm9yRWFjaChrZXkgPT4ge1xuICAvLyAgICAgICBzdGF0ZVtrZXldID0gcGFyZW50U3RhdGVba2V5XTtcbiAgLy8gICAgIH0pXG4gIC8vICAgfVxuXG4gIC8vICAgLy8gZ2V0dGluZyBjaGlsZHJlbiBvZiBvYmplY3RzL2FyYXlzIGlzIHJlZHVuZGFudFxuICAvLyAgIGlmICh0aGlzLnR5cGUgIT09IHR5cGVzLkFSUkFZICYmIHRoaXMudHlwZSAhPT0gdHlwZXMuT0JKRUNUKVxuICAvLyAgICAgT2JqZWN0LmtleXModGhpcy52YWx1ZSkuZm9yRWFjaChzaWxvTm9kZU5hbWUgPT4ge1xuICAvLyAgICAgICBjb25zdCBjdXJyU2lsb05vZGUgPSB0aGlzLnZhbHVlW3NpbG9Ob2RlTmFtZV07XG4gIC8vICAgICAgIGlmIChjdXJyU2lsb05vZGUudHlwZSA9PT0gdHlwZXMuT0JKRUNUIHx8IGN1cnJTaWxvTm9kZS50eXBlID09PSB0eXBlcy5BUlJBWSkgc3RhdGVbc2lsb05vZGVOYW1lXSA9IHRoaXMucmVjb25zdHJ1Y3Qoc2lsb05vZGVOYW1lLCBjdXJyU2lsb05vZGUpO1xuICAvLyAgICAgICBlbHNlIGlmIChjdXJyU2lsb05vZGUudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSBzdGF0ZVtzaWxvTm9kZU5hbWVdID0gY3VyclNpbG9Ob2RlLnZhbHVlO1xuXG4gIC8vICAgICAgIC8vIHNvbWUgc2lsb05vZGVzIGRvbid0IGhhdmUgbW9kaWZpZXJzXG4gIC8vICAgICAgIGlmIChjdXJyU2lsb05vZGUubW9kaWZpZXJzKSB7XG4gIC8vICAgICAgICAgT2JqZWN0LmtleXMoY3VyclNpbG9Ob2RlLm1vZGlmaWVycykuZm9yRWFjaChtb2RpZmllciA9PiB7XG4gIC8vICAgICAgICAgICBzdGF0ZVttb2RpZmllcl0gPSBjdXJyU2lsb05vZGUubW9kaWZpZXJzW21vZGlmaWVyXTtcbiAgLy8gICAgICAgICB9KVxuICAvLyAgICAgICB9XG4gIC8vICAgICB9KVxuXG4gIC8vICAgcmV0dXJuIHN0YXRlO1xuICAvLyB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpbG9Ob2RlOyIsIi8vIGltcG9ydCBzdGF0ZSBjbGFzcyBmb3IgaW5zdGFuY2VvZiBjaGVja1xuaW1wb3J0IENvbnN0cnVjdG9yTm9kZSBmcm9tICcuL2NvbnN0cnVjdG9yTm9kZS5qcyc7XG5pbXBvcnQgU2lsb05vZGUgZnJvbSAnLi9zaWxvTm9kZS5qcyc7XG5pbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuL2NvbnN0YW50cy5qcydcbmltcG9ydCB2aXJ0dWFsTm9kZSBmcm9tICcuL3ZpcnR1YWxOb2RlLmpzJ1xuXG5jb25zdCBzaWxvID0ge307XG5jb25zdCB2aXJ0dWFsU2lsbyA9IHt9O1xuXG4vKipcbiAqIFRha2VzIGFsbCBvZiB0aGUgY29uc3RydWN0b3JOb2RlcyBjcmVhdGVkIGJ5IHRoZSBkZXZlbG9wZXIgYW5kIHR1cm5zIHRoZW0gaW50byB0aGUgc2lsb1xuICogQHBhcmFtICB7Li4uQ29uc3RydWN0b3JOb2RlfSBhcmdzIC0gQSBsaXN0IG9mIGNvbnN0cnVjdG9yIE5vZGVzXG4gKi9cblxuZnVuY3Rpb24gY29tYmluZU5vZGVzKC4uLmFyZ3MpIHtcbiAgbGV0IGRldlRvb2wgPSBudWxsO1xuICBpZihhcmdzWzBdICYmIGFyZ3NbMF0uZGV2VG9vbCA9PT0gdHJ1ZSkge1xuICAgIGRldlRvb2wgPSBhcmdzWzBdO1xuICAgIGFyZ3Muc2hpZnQoKTtcbiAgfVxuICBpZiAoYXJncy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignY29tYmluZU5vZGVzIGZ1bmN0aW9uIHRha2VzIGF0IGxlYXN0IG9uZSBjb25zdHJ1Y3Rvck5vZGUnKTtcblxuICAvLyBoYXN0YWJsZSBhY2NvdW50cyBmb3IgcGFzc2luZyBpbiBjb25zdHJ1Y3Rvck5vZGVzIGluIGFueSBvcmRlci4gXG4gIC8vIGhhc2h0YWJsZSBvcmdhbml6ZXMgYWxsIG5vZGVzIGludG8gcGFyZW50LWNoaWxkIHJlbGF0aW9uc2hpcHMgc28gdGhlIHNpbG8gaXMgZWFzaWVyIHRvIGNyZWF0ZVxuICBjb25zdCBoYXNoVGFibGUgPSB7fTtcblxuICAvLyBsb29wIHRocm91Z2ggdGhlIGNvbnN0cnVjdG9yTm9kZXMgcGFzc2VkIGluIGFzIGFyZ3VtZW50c1xuICBhcmdzLmZvckVhY2goY29uc3RydWN0b3JOb2RlID0+IHtcbiAgICBpZiAoIWNvbnN0cnVjdG9yTm9kZSB8fCBjb25zdHJ1Y3Rvck5vZGUuY29uc3RydWN0b3IubmFtZSAhPT0gJ0NvbnN0cnVjdG9yTm9kZScpIHRocm93IG5ldyBFcnJvcignT25seSBjb25zdHJ1Y3Rvck5vZGVzIGNhbiBiZSBwYXNzZWQgdG8gY29tYmluZU5vZGVzJyk7XG4gICAgLy8gYSBub2RlIHdpdGggYSBudWxsIHBhcmVudCB3aWxsIGJlIHRoZSByb290IG5vZGUsIGFuZCB0aGVyZSBjYW4gb25seSBiZSBvbmVcbiAgICBlbHNlIGlmIChjb25zdHJ1Y3Rvck5vZGUucGFyZW50ID09PSBudWxsKSB7XG4gICAgICAvLyB3ZSBjaGVjayB0byBzZWUgaWYgdGhlIHJvb3Qga2V5IGFscmVhZHkgZXhpc3RzIGluIHRoZSBoYXNodGFibGUuIElmIHNvLCB0aGlzIG1lYW5zIGEgcm9vdFxuICAgICAgLy8gaGFzIGFscmVhZHkgYmVlbiBlc3RhYmxpc2hlZFxuICAgICAgaWYgKCFoYXNoVGFibGUucm9vdCkgaGFzaFRhYmxlLnJvb3QgPSBbY29uc3RydWN0b3JOb2RlXTtcbiAgICAgIGVsc2UgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBjb25zdHJ1Y3RvciBub2RlIGNhbiBoYXZlIG51bGwgcGFyZW50Jyk7XG4gICAgfSBcbiAgICAvLyBpZiB0aGUgcGFyZW50IGlzbid0IG51bGwsIHRoZW4gdGhlIHBhcmVudCBpcyBhbm90aGVyIG5vZGVcbiAgICBlbHNlIHtcbiAgICAgIC8vIGlmIHRoZSBwYXJlbnQgZG9lc24ndCBleGlzdCBhcyBhIGtleSB5ZXQsIHdlIHdpbGwgY3JlYXRlIHRoZSBrZXkgYW5kIHNldCBpdCB0byBhbiBhcnJheVxuICAgICAgLy8gdGhhdCBjYW4gYmUgZmlsbGVkIHdpdGggYWxsIHBvc3NpYmxlIGNoaWxkcmVuXG4gICAgICBpZiAoIWhhc2hUYWJsZVtjb25zdHJ1Y3Rvck5vZGUucGFyZW50XSkgaGFzaFRhYmxlW2NvbnN0cnVjdG9yTm9kZS5wYXJlbnRdID0gW2NvbnN0cnVjdG9yTm9kZV07XG4gICAgICAvLyBpZiBwYXJlbnQgYWxyZWFkeSBleGlzdHMsIGFuZCBub2RlIGJlaW5nIGFkZGVkIHdpbGwgYXBwZW5kIHRvIHRoZSBhcnJheSBvZiBjaGlsZHJlblxuICAgICAgZWxzZSBoYXNoVGFibGVbY29uc3RydWN0b3JOb2RlLnBhcmVudF0ucHVzaChjb25zdHJ1Y3Rvck5vZGUpO1xuICAgIH1cbiAgfSkgXG5cbiAgLy8gZW5zdXJlIHRoZXJlIGlzIGEgZGVmaW5lZCByb290IGJlZm9yZSBjb250aW51aW5nXG4gIGlmICghaGFzaFRhYmxlLnJvb3QpIHRocm93IG5ldyBFcnJvcignQXQgbGVhc3Qgb25lIGNvbnN0cnVjdG9yIG5vZGUgbXVzdCBoYXZlIGEgbnVsbCBwYXJlbnQnKTtcblxuICAvLyBhIHJlY3Vyc2l2ZSBmdW5jdGlvbiB0aGF0IHdpbGwgY3JlYXRlIHNpbG9Ob2RlcyBhbmQgcmV0dXJuIHRoZW0gdG8gYSBwYXJlbnRcbiAgZnVuY3Rpb24gbWFwVG9TaWxvKGNvbnN0cnVjdG9yTm9kZSA9ICdyb290JywgcGFyZW50Q29uc3RydWN0b3JOb2RlID0gbnVsbCkge1xuICAgIC8vIHRoZSB2ZXJ5IGZpcnN0IHBhc3Mgd2lsbCBzZXQgdGhlIHBhcmVudCB0byByb290XG4gICAgY29uc3QgY29uc3RydWN0b3JOb2RlTmFtZSA9IChjb25zdHJ1Y3Rvck5vZGUgPT09ICdyb290JykgPyAncm9vdCcgOiBjb25zdHJ1Y3Rvck5vZGUubmFtZTtcblxuICAgIC8vIHJlY3Vyc2l2ZSBiYXNlIGNhc2UsIHdlIG9ubHkgY29udGludWUgaWYgdGhlIGN1cnJlbnQgbm9kZSBoYXMgYW55IGNvbnN0cnVjdG9yTm9kZSBjaGlsZHJlblxuICAgIGlmICghaGFzaFRhYmxlW2NvbnN0cnVjdG9yTm9kZU5hbWVdKSByZXR1cm47XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IHt9O1xuXG4gICAgLy8gbG9vcCB0aHJvdWdoIHRoZSBjaGlsZHJlbiBhcnJheXMgaW4gdGhlIGhhc2h0YWJsZVxuICAgIGhhc2hUYWJsZVtjb25zdHJ1Y3Rvck5vZGVOYW1lXS5mb3JFYWNoKGN1cnJDb25zdHJ1Y3Rvck5vZGUgPT4ge1xuICAgICAgY29uc3QgdmFsdWVzT2ZDdXJyU2lsb05vZGUgPSB7fTtcbiAgICAgIGNoaWxkcmVuW2N1cnJDb25zdHJ1Y3Rvck5vZGUubmFtZV0gPSBuZXcgU2lsb05vZGUoY3VyckNvbnN0cnVjdG9yTm9kZS5uYW1lLCB2YWx1ZXNPZkN1cnJTaWxvTm9kZSwgcGFyZW50Q29uc3RydWN0b3JOb2RlLCB7fSwgdHlwZXMuQ09OVEFJTkVSLCBkZXZUb29sKTtcbiAgICAgIFxuICAgICAgLy8gYWJzdHJhY3Qgc29tZSB2YXJpYWJsZXNcbiAgICAgIGNvbnN0IGN1cnJTaWxvTm9kZSA9IGNoaWxkcmVuW2N1cnJDb25zdHJ1Y3Rvck5vZGUubmFtZV07XG4gICAgICBjb25zdCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSA9IGN1cnJDb25zdHJ1Y3Rvck5vZGUuc3RhdGU7XG5cbiAgICAgIC8vIGNyZWF0ZSBTaWxvTm9kZXMgZm9yIGFsbCB0aGUgdmFyaWFibGVzIGluIHRoZSBjdXJyQ29uc3RydWN0b3JOb2RlXG4gICAgICBPYmplY3Qua2V5cyhzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSkuZm9yRWFjaCh2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlID0+IHtcbiAgICAgICAgLy8gaXMgdGhlIHZhcmlhYmxlIGlzIGFuIG9iamVjdC9hcnJheSwgd2UgbmVlZCB0byBkZWNvbnN0cnVjdCBpdCBpbnRvIGZ1cnRoZXIgc2lsb05vZGVzXG4gICAgICAgIGlmICh0eXBlb2Ygc3RhdGVPZkN1cnJDb25zdHJ1Y3Rvck5vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0udmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdmFsdWVzT2ZDdXJyU2lsb05vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0gPSBjdXJyU2lsb05vZGUuZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzKHZhckluQ29uc3RydWN0b3JOb2RlU3RhdGUsIHN0YXRlT2ZDdXJyQ29uc3RydWN0b3JOb2RlW3ZhckluQ29uc3RydWN0b3JOb2RlU3RhdGVdLCBjdXJyU2lsb05vZGUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG90aGVyd2lzZSBwcmltaXRpdmVzIGNhbiBiZSBzdG9yZWQgaW4gc2lsb05vZGVzIGFuZCB0aGUgbW9kaWZpZXJzIHJ1blxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB2YWx1ZXNPZkN1cnJTaWxvTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXSA9IG5ldyBTaWxvTm9kZSh2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlLCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXS52YWx1ZSwgY3VyclNpbG9Ob2RlLCBzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZVt2YXJJbkNvbnN0cnVjdG9yTm9kZVN0YXRlXS5tb2RpZmllcnMsIHR5cGVzLlBSSU1JVElWRSwgZGV2VG9vbCk7XG4gICAgICAgICAgdmFsdWVzT2ZDdXJyU2lsb05vZGVbdmFySW5Db25zdHJ1Y3Rvck5vZGVTdGF0ZV0ubGlua01vZGlmaWVycygpO1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyByZWN1cnNpdmVseSBjaGVjayB0byBzZWUgaWYgdGhlIGN1cnJlbnQgY29uc3RydWN0b3JOb2RlL3NpbG9Ob2RlIGhhcyBhbnkgY2hpbGRyZW4gXG4gICAgICBjb25zdCBzaWxvTm9kZUNoaWxkcmVuID0gbWFwVG9TaWxvKGN1cnJDb25zdHJ1Y3Rvck5vZGUsIGN1cnJTaWxvTm9kZSk7XG4gICAgICAvLyBpZiBhIE5vZGUgZGlkIGhhdmUgY2hpbGRyZW4sIHdlIHdpbGwgYWRkIHRob3NlIHJldHVybmVkIHNpbG9Ob2RlcyBhcyB2YWx1ZXNcbiAgICAgIC8vIGludG8gdGhlIGN1cnJlbnQgc2lsb05vZGVcbiAgICAgIGlmIChzaWxvTm9kZUNoaWxkcmVuKSB7IFxuICAgICAgICBPYmplY3Qua2V5cyhzaWxvTm9kZUNoaWxkcmVuKS5mb3JFYWNoKHNpbG9Ob2RlID0+IHtcbiAgICAgICAgICB2YWx1ZXNPZkN1cnJTaWxvTm9kZVtzaWxvTm9kZV0gPSBzaWxvTm9kZUNoaWxkcmVuW3NpbG9Ob2RlXTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIC8vIGhlcmUgd2Ugd2lsbCBnZXQgdGhlIHJvb3Qgc2lsb05vZGUgd2l0aCBhbGwgaXRzIGNoaWxkcmVuIGFkZGVkXG4gIGNvbnN0IHdyYXBwZWRSb290U2lsb05vZGUgPSBtYXBUb1NpbG8oKTtcblxuICAvLyBhZGQgdGhlIHNpbG9Ob2RlIHJvb3QgdG8gdGhlIHBsYWluIHNpbG8gb2JqZWN0XG4gIC8vIGl0IHdpbGwgYWx3YXlzIG9ubHkgYmUgYSBzaW5nbGUga2V5ICh0aGUgcm9vdCkgdGhhdCBpcyBhZGRlZCBpbnRvIHRoZSBzaWxvXG4gIE9iamVjdC5rZXlzKHdyYXBwZWRSb290U2lsb05vZGUpLmZvckVhY2gocm9vdFNpbG9Ob2RlID0+IHtcbiAgICBzaWxvW3Jvb3RTaWxvTm9kZV0gPSB3cmFwcGVkUm9vdFNpbG9Ob2RlW3Jvb3RTaWxvTm9kZV07XG4gIH0pO1xuICBcbiAgZnVuY3Rpb24gaWRlbnRpZnkgKCkge1xuICAgIC8vZWFjaCBub2RlJ3MgSUQgaXMgYSBzbmFrZV9jYXNlIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgYSBcbiAgICAvL3JvdXRlIHRvIHRoYXQgbm9kZSBmcm9tIHRoZSB0b3Agb2YgdGhlIHNpbG8gYnkgbmFtZVxuICAgIGZvckVhY2hTaWxvTm9kZShub2RlID0+IHtcbiAgICAgIG5vZGUuaXNzdWVJRCgpXG4gICAgfSk7XG4gIH1cblxuICBpZGVudGlmeSgpO1xuXG4gIGZ1bmN0aW9uIHZpcnR1YWxpemUgKCkgeyAvL3J1bnMgdGhyb3VnaCBlYWNoIG5vZGUgaW4gdGhlIHRyZWUsIHR1cm5zIGl0IGludG8gYSB2aXJ0dWFsIG5vZGUgaW4gdGhlIHZTaWxvXG4gICAgZm9yRWFjaFNpbG9Ob2RlKG5vZGUgPT4ge1xuICAgICAgaWYoIXZpcnR1YWxTaWxvW25vZGUuaWRdKXtcbiAgICAgICAgdmlydHVhbFNpbG9bbm9kZS5pZF0gPSBub2RlLnZpcnR1YWxOb2RlO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAgIHZpcnR1YWxpemUoKTtcbiAgICAgIFxuICAgIFxuICAgIGZvckVhY2hTaWxvTm9kZShub2RlID0+IHtcbiAgICAgIC8vIGFwcGx5IGtleVN1YnNjcmliZSBvbmx5IHRvIG9iamVjdCBhbmQgYXJyYXkgc2lsbyBub2Rlc1xuICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ09CSkVDVCcgfHwgbm9kZS50eXBlID09PSBcIkFSUkFZXCIpIHtcbiAgICAgICAgbm9kZS5tb2RpZmllcnMua2V5U3Vic2NyaWJlID0gKGtleSwgcmVuZGVyRnVuYykgPT4ge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSBub2RlLm5hbWUgKyBcIl9cIiArIGtleTtcbiAgICAgICAgICBjb25zdCBzdWJzY3JpYmVkQXRJbmRleCA9IG5vZGUudmFsdWVbbmFtZV0ucHVzaFRvU3Vic2NyaWJlcnMocmVuZGVyRnVuYyk7XG4gICAgICAgICAgbm9kZS52YWx1ZVtuYW1lXS5ub3RpZnlTdWJzY3JpYmVycygpO1xuICAgICAgICAgIHJldHVybiAoKSA9PiB7bm9kZS5yZW1vdmVGcm9tU3Vic2NyaWJlcnNBdEluZGV4KHN1YnNjcmliZWRBdEluZGV4KX1cbiAgICAgICAgfVxuICAgICAgfX0pXG4gICAgXG4gICAgXG5cbiAgXG4gIHNpbG8udmlydHVhbFNpbG8gPSB2aXJ0dWFsU2lsbztcbiAgcmV0dXJuIHNpbG87XG59XG5cbi8qKlxuICogQXBwbGllcyB0aGUgY2FsbGJhY2sgdG8gZXZlcnkgc2lsb05vZGUgaW4gdGhlIHNpbG9cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gQSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYSBzaWxvTm9kZSBhcyBpdHMgcGFyYW1ldGVyXG4gKi9cblxuLy8gY2FsbGJhY2tzIGhhdmUgdG8gYWNjZXB0IGEgU0lMT05PREVcbmZ1bmN0aW9uIGZvckVhY2hTaWxvTm9kZShjYWxsYmFjaykge1xuICAvLyBhY2Nlc3NpbmcgdGhlIHNpbmdsZSByb290IGluIHRoZSBzaWxvXG4gIE9iamVjdC5rZXlzKHNpbG8pLmZvckVhY2goc2lsb05vZGVSb290S2V5ID0+IHtcbiAgICBpbm5lcihzaWxvW3NpbG9Ob2RlUm9vdEtleV0sIGNhbGxiYWNrKTtcbiAgfSlcblxuICAvLyByZWN1cnNpdmVseSBuYXZpZ2F0ZSB0byBldmVyeSBzaWxvTm9kZVxuICBmdW5jdGlvbiBpbm5lcihoZWFkLCBjYWxsYmFjaykge1xuICAgIGlmIChoZWFkLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdTaWxvTm9kZScpIHtcbiAgICAgIGNhbGxiYWNrKGhlYWQpO1xuICAgICAgaWYgKGhlYWQudHlwZSA9PT0gdHlwZXMuUFJJTUlUSVZFKSByZXR1cm47IC8vIHJlY3Vyc2l2ZSBiYXNlIGNhc2VcbiAgICAgIFxuICAgICAgZWxzZSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWQudmFsdWUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBpZiAoaGVhZC52YWx1ZVtrZXldLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdTaWxvTm9kZScpIHtcbiAgICAgICAgICAgIGlubmVyKGhlYWQudmFsdWVba2V5XSwgY2FsbGJhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTdWJzY3JpYmVzIGNvbXBvbmVudHMgdG8gc2lsb05vZGVzIGluIHRoZSBzaWxvXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gcmVuZGVyRnVuY3Rpb24gLSBGdW5jdGlvbiB0byBiZSBhcHBlbmRlZCB0byBzdWJzY3JpYmVycyBhcnJheVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSByZWxldmFudCBjb21wb25lbnQgd2l0aCAnU3RhdGUnIGFwcGVuZGVkXG4gKi9cblxuc2lsby5zdWJzY3JpYmUgPSAocmVuZGVyRnVuY3Rpb24sIG5hbWUpID0+IHtcbiAgaWYgKCFuYW1lKSB7XG4gICAgaWYgKCEhcmVuZGVyRnVuY3Rpb24ucHJvdG90eXBlKSB7XG4gICAgICBuYW1lID0gcmVuZGVyRnVuY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWUgKyAnU3RhdGUnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW5cXCd0IHVzZSBhbiBhbm9ueW1vdXMgZnVuY3Rpb24gaW4gc3Vic2NyaWJlIHdpdGhvdXQgYSBuYW1lIGFyZ3VtZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGxldCBmb3VuZE5vZGU7XG4gIGxldCBzdWJzY3JpYmVkQXRJbmRleDtcbiAgY29uc3QgZm91bmROb2RlQ2hpbGRyZW4gPSBbXTtcblxuICBmb3JFYWNoU2lsb05vZGUobm9kZSA9PiB7XG4gICAgaWYobm9kZS5uYW1lID09PSBuYW1lKXtcbiAgICAgIHN1YnNjcmliZWRBdEluZGV4ID0gbm9kZS5wdXNoVG9TdWJzY3JpYmVycyhyZW5kZXJGdW5jdGlvbilcbiAgICAgIGZvdW5kTm9kZSA9IG5vZGVcbiAgICAgIGZvdW5kTm9kZUNoaWxkcmVuLnB1c2goe25vZGU6IGZvdW5kTm9kZSwgaW5kZXg6IHN1YnNjcmliZWRBdEluZGV4fSk7XG4gICAgfVxuICB9KVxuXG4gIGZ1bmN0aW9uIHVuc3Vic2NyaWJlKCkge1xuICAgIGxldCBvYjtcbiAgICBPYmplY3Qua2V5cyhmb3VuZE5vZGVDaGlsZHJlbikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgb2IgPSBmb3VuZE5vZGVDaGlsZHJlbltrZXldOyBcbiAgICAgIG9iLm5vZGUucmVtb3ZlRnJvbVN1YnNjcmliZXJzQXRJbmRleChvYi5pbmRleClcbiAgICB9KVxuICB9XG4gIFxuICBpZiAoISFmb3VuZE5vZGUpIHtcbiAgICBcbiAgICBpZiAoZm91bmROb2RlLnZhbHVlKSB7XG4gICAgICBPYmplY3Qua2V5cyhmb3VuZE5vZGUudmFsdWUpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IG5vZGUgPSBmb3VuZE5vZGUudmFsdWVba2V5XTtcbiAgICAgICAgaWYobm9kZS50eXBlICE9PSAnQ09OVEFJTkVSJyl7XG4gICAgICAgICAgc3Vic2NyaWJlZEF0SW5kZXggPSBub2RlLnB1c2hUb1N1YnNjcmliZXJzKHJlbmRlckZ1bmN0aW9uKTtcbiAgICAgICAgICBmb3VuZE5vZGVDaGlsZHJlbi5wdXNoKHtub2RlOiBub2RlLCBpbmRleDogc3Vic2NyaWJlZEF0SW5kZXh9KTtcbiAgXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIGZvdW5kTm9kZS5ub3RpZnlTdWJzY3JpYmVycygpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKGBZb3UgYXJlIHRyeWluZyB0byBzdWJzY3JpYmUgdG8gJHtuYW1lfSwgd2hpY2ggaXNuXFwndCBpbiB0aGUgc2lsby5gKSk7XG4gIH1cblxuICByZXR1cm4gdW5zdWJzY3JpYmU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbWJpbmVOb2RlczsiLCJpbXBvcnQgJ0BiYWJlbC9wb2x5ZmlsbCc7XG5pbXBvcnQgY29tYmluZU5vZGVzIGZyb20gJy4vcmFkb24vY29tYmluZU5vZGVzJztcbmltcG9ydCBDb25zdHJ1Y3Rvck5vZGUgZnJvbSAnLi9yYWRvbi9jb25zdHJ1Y3Rvck5vZGUnO1xuXG5leHBvcnQgY29uc3QgY29tYmluZVN0YXRlID0gY29tYmluZU5vZGVzO1xuZXhwb3J0IGNvbnN0IFN0YXRlTm9kZSA9IENvbnN0cnVjdG9yTm9kZTsiXSwibmFtZXMiOlsiQ29uc3RydWN0b3JOb2RlIiwibmFtZSIsInBhcmVudE5hbWUiLCJzdGF0ZSIsInBhcmVudCIsImluaXRpYWxpemVTdGF0ZSIsImJpbmQiLCJpbml0aWFsaXplTW9kaWZpZXJzIiwiaW5pdGlhbFN0YXRlIiwiQXJyYXkiLCJpc0FycmF5IiwiRXJyb3IiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsIm5ld1ZhcmlhYmxlSW5TdGF0ZSIsInZhbHVlIiwibW9kaWZpZXJzIiwiaW5pdGlhbE1vZGlmaWVycyIsIm5ld01vZGlmaWVyc0luU3RhdGUiLCJfbmFtZSIsIl9wYXJlbnQiLCJfc3RhdGUiLCJBUlJBWSIsIk9CSkVDVCIsIlBSSU1JVElWRSIsIkNPTlRBSU5FUiIsIlZpcnR1YWxOb2RlIiwibm9kZSIsInZpcnR1YWxOb2RlIiwidHlwZSIsImlkIiwidHlwZXMiLCJ2YWwiLCJpbmNsdWRlcyIsInNwbGl0IiwibGVuZ3RoIiwibW9kaWZpZXJLZXlzIiwibW9kaWZpZXJLZXkiLCJkYXRhIiwiU2lsb05vZGUiLCJkZXZUb29sIiwicXVldWUiLCJzdWJzY3JpYmVycyIsImxpbmtNb2RpZmllcnMiLCJydW5Nb2RpZmllcnMiLCJub3RpZnlTdWJzY3JpYmVycyIsImdldFN0YXRlIiwicmVjb25zdHJ1Y3RBcnJheSIsInJlY29uc3RydWN0T2JqZWN0IiwiZGVjb25zdHJ1Y3RPYmplY3RJbnRvU2lsb05vZGVzIiwicmVjb25zdHJ1Y3QiLCJwdXNoVG9TdWJzY3JpYmVycyIsInJlbW92ZUZyb21TdWJzY3JpYmVyc0F0SW5kZXgiLCJydW5RdWV1ZSIsImtleVN1YnNjcmliZSIsImtleSIsInJlbmRlckZ1bmN0aW9uIiwic3Vic2NyaWJlZEF0SW5kZXgiLCJ0aGF0IiwiaXNzdWVJRCIsInB1c2giLCJpbmRleCIsInN1YmNyaWJlcnMiLCJzbGljZSIsIl9pZCIsImZ1bmMiLCJydW5uaW5nIiwicnVuIiwibmV4dE1vZGlmaWVyIiwic2hpZnQiLCJwcmV2aW91c1N0YXRlIiwibm90aWZ5IiwibW9kaWZpZXJOYW1lIiwidXBkYXRlVG8iLCJvYmpOYW1lIiwib2JqZWN0VG9EZWNvbnN0cnVjdCIsInJ1bkxpbmtlZE1vZHMiLCJvYmpDaGlsZHJlbiIsIm5ld1NpbG9Ob2RlIiwiaW5kZXhlZFZhbCIsImkiLCJub2RlTmFtZSIsInN0YXRlTW9kaWZpZXJzIiwibW9kaWZpZXIiLCJsaW5rZWRNb2RpZmllciIsInBheWxvYWQiLCJjYWxsYmFjayIsInNpbG9Ob2RlTmFtZSIsImN1cnJTaWxvTm9kZSIsInJlY29uc3RydWN0ZWRPYmplY3QiLCJuZXdPYmplY3QiLCJjaGlsZE9iaiIsImV4dHJhY3RlZEtleSIsIm5ld0FycmF5IiwiY29udGV4dCIsIl92YWx1ZSIsIl9tb2RpZmllcnMiLCJfcXVldWUiLCJjb25zdHJ1Y3RvciIsIl9zdWJzY3JpYmVycyIsIl90eXBlIiwiX3ZpcnR1YWxOb2RlIiwic2lsbyIsInZpcnR1YWxTaWxvIiwiY29tYmluZU5vZGVzIiwiYXJncyIsImhhc2hUYWJsZSIsImNvbnN0cnVjdG9yTm9kZSIsInJvb3QiLCJtYXBUb1NpbG8iLCJwYXJlbnRDb25zdHJ1Y3Rvck5vZGUiLCJjb25zdHJ1Y3Rvck5vZGVOYW1lIiwiY2hpbGRyZW4iLCJjdXJyQ29uc3RydWN0b3JOb2RlIiwidmFsdWVzT2ZDdXJyU2lsb05vZGUiLCJzdGF0ZU9mQ3VyckNvbnN0cnVjdG9yTm9kZSIsInZhckluQ29uc3RydWN0b3JOb2RlU3RhdGUiLCJzaWxvTm9kZUNoaWxkcmVuIiwic2lsb05vZGUiLCJ3cmFwcGVkUm9vdFNpbG9Ob2RlIiwicm9vdFNpbG9Ob2RlIiwiaWRlbnRpZnkiLCJmb3JFYWNoU2lsb05vZGUiLCJ2aXJ0dWFsaXplIiwicmVuZGVyRnVuYyIsInNpbG9Ob2RlUm9vdEtleSIsImlubmVyIiwiaGVhZCIsInN1YnNjcmliZSIsInByb3RvdHlwZSIsImZvdW5kTm9kZSIsImZvdW5kTm9kZUNoaWxkcmVuIiwidW5zdWJzY3JpYmUiLCJvYiIsImNvbnNvbGUiLCJlcnJvciIsImNvbWJpbmVTdGF0ZSIsIlN0YXRlTm9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQU1BOzs7MkJBQ1FDLElBQVosRUFBcUM7UUFBbkJDLFVBQW1CLHVFQUFOLElBQU07Ozs7U0FDOUJELElBQUwsR0FBWUEsSUFBWjtTQUNLRSxLQUFMLEdBQWEsRUFBYjtTQUNLQyxNQUFMLEdBQWNGLFVBQWQ7U0FFS0csZUFBTCxHQUF1QixLQUFLQSxlQUFMLENBQXFCQyxJQUFyQixDQUEwQixJQUExQixDQUF2QjtTQUNLQyxtQkFBTCxHQUEyQixLQUFLQSxtQkFBTCxDQUF5QkQsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBM0I7Ozs7Ozs7Ozs7b0NBUWNFLGNBQWM7Ozs7VUFFeEIsUUFBT0EsWUFBUCxNQUF3QixRQUF4QixJQUFvQ0MsS0FBSyxDQUFDQyxPQUFOLENBQWNGLFlBQWQsQ0FBeEMsRUFBcUUsTUFBTSxJQUFJRyxLQUFKLENBQVUseUJBQVYsQ0FBTixDQUZ6Qzs7O01BSzVCQyxNQUFNLENBQUNDLElBQVAsQ0FBWUwsWUFBWixFQUEwQk0sT0FBMUIsQ0FBa0MsVUFBQUMsa0JBQWtCLEVBQUk7UUFDdEQsS0FBSSxDQUFDWixLQUFMLENBQVdZLGtCQUFYLElBQWlDO1VBQy9CQyxLQUFLLEVBQUVSLFlBQVksQ0FBQ08sa0JBQUQsQ0FEWTs7O1VBSS9CRSxTQUFTLEVBQUUsS0FBSSxDQUFDZCxLQUFMLENBQVdZLGtCQUFYLElBQWlDLEtBQUksQ0FBQ1osS0FBTCxDQUFXWSxr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
