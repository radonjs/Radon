class ConstructorNode {
  constructor(name, parentName = null) {
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

  initializeState(initialState) {
    // make sure that the input is an object
    if (typeof initialState !== 'object' || Array.isArray(initialState)) throw new Error('Input must be an object');
    // loop through the state variables and create objects that hold the variable and any
    // associated modifiers
    Object.keys(initialState).forEach(newVariableInState => {
      this.state[newVariableInState] = {
        value: initialState[newVariableInState],
        // accounts for initializeModifers being called prior to initializeState
        // by checking to see if this object has already been created
        modifiers: this.state[newVariableInState] ? this.state[newVariableInState].modifiers : {}
      }
    });
  }

  /**
   * Stores modifiers in state
   * @param {object} initialModifiers - An object with keys associated with existing initialized variables and values that are objects containing modifiers to be bound to that specific variable
   */
  
  initializeModifiers(initialModifiers) {
    // make sure that the input is an object
    if (typeof initialModifiers !== 'object' || Array.isArray(initialModifiers)) throw new Error('Input must be an object');
    // loops through the state modifiers. The same object is created here as in initializeState and it
    // will overwrite the initializeState object. But it needs to be done this way in case the dev calls 
    // initializeModifiers before they call initializeState. Now it works either way 
    Object.keys(initialModifiers).forEach(newModifiersInState => {
      this.state[newModifiersInState] = {
        // accounts for initializeState being called prior to initializeModifiers. 
        value: this.state[newModifiersInState] ? this.state[newModifiersInState].value : null,
        modifiers: initialModifiers[newModifiersInState]
      }
    });
  }

  set name(name) {
    if (typeof name !== 'string') throw new Error('Name must be a string');
    else this._name = name;
  }

  get name() {
    return this._name;
  }

  set parent(parent) {
    if (typeof parent !== 'string' && parent !== null) throw new Error('Parent must be a string');
    else this._parent = parent;
  }

  get parent() {
    return this._parent;
  }

  set state(state) {
    this._state = state;
  }

  get state() {
    return this._state;
  }
}

export default ConstructorNode;