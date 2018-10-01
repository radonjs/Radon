# <img src='https://i.imgur.com/k6JIgZR.png' height='130'/>

Radon is an object-oriented state management framework for JavaScript applications. 

## Why?

Radon is a state manager that is built using a tree data structure to implement data encapsulation. There is a rarely an instance in the programming universe that data should available  

Radon state management is able to update specific parts of the state tree without ever resending the state unnecessarily.
It does this using state methods called Modifiers, which are attached to specific pieces of the state. State changes
cannot occur without calling one of these methods, which means that Radon can always determine which parts
of the state are changing, meaning data will only be sent to the subscribers when the data changes. This can significantly
improve the speed of state changes in highly nested applications when compared other state management tools.

Radon also implements native handling of asynchronous state changes using async generators. When state modifiers are called,
they are added to a running queue of modifiers, which are called in order using generators. This means that handling asynchronicity in complex web applications is predictable and intuitive.

## Getting Started

To install the stable version using npm as your package manager:

```npm install --save radon-js```

The Radon source code is transpiled to ES2015 to work in any modern browser. You don't need to use Babel or a module bundler to get started with Radon.

Most likely, you'll also need the React bindings and the developer tools.

```npm install --save react-radon```

Unlike Radon, React doesn't provide UMD builds, so you will need to use a CommonJS module bundler like Webpack, Parcel, or Rollup to utilize Radon with React.

## How Radon Works

```javascript
import { StateNode } from 'radon-js'

/* 
StateNode is a class needed for creating instances of state. In Radon, StateNodes are created in
tandem with frontend components. The naming convention is important here; if you have created 
a frontend component called App with the intent of statefulness, then an instance of StateNode must be declared and labeled as AppState. This will allow the App component to properly bind to AppState
at compile time.

The new instance of StateNode takes two arguments: the first argument is the name of the StateNode you are creating which must follow our naming convention. The second argument is the name of the parent node. One StateNode must be considered the root of the state tree. Therefore, at only one occassion can the parent argument be omitted. This instance of StateNode will be considered the root. Every other StateNode must take a parent argument.
*/

const AppState = new StateNode('AppState');
// or
// const AppState = new StateNode('AppState', 'OtherState');

/*
To declare variables in state, the method initializeState must be called which takes an object
as an argument. The variable names and their data should be listed in the object as key-value pairs.
*/

AppState.initializeState({
  name: 'Radon',
  status: true,
  arrayOfNames: []
})

/*
Modifiers are functions that modify a single variable in state. Modifiers are attached to variables by calling the method initializeModifiers which also takes an object as an argument. The keys of the
argument object must correspond to variables that have already been declared in AppState. The values 
are objects that contain the modifier functions as key-value pairs. There are two types of modifiers 
in Radon. The first type, as seen below, can accept either 1 or 2 arguments. The 'current' argument
will automatically be injected with the bound state variable. The 'payload' argument is any data that can be used to modify or replace the 'current' value of state. Even if the current value of state is not used in the modifier, it will still be passed in automatically. 
*/

AppState.initializeModifiers({
  name: {
    updateName: (current, payload) => {
      return payload;
    }
  }
  status: {
    toggleStatus: (current) => {
      return !current;
    }
  }
})

/*
It is important to note that when these modifiers are called from a component, only the payload argument must be passed into the function as Radon will fill the 'current' parameter by default.
*/

<button onClick={() => this.props.updateName('Radon is cool!!!')}>Click Me</button>
<button onClick={() => this.props.toggleStatus()}>Click Me Too</button>

/*
The second modifier type is what helps Radon eliminate unnecessary rerendering of frontend components. This modifier type accepts three arguments and is used exclusively with objects. *Note that initializeModifiers should only be called once. It is shown again here for demonstration purposes only*.
*/

AppState.initializeModifiers({
  arrayOfNames: {
    addNameToArray: (current, payload) => {
      current.push(payload);
      return current;
    }
    updateAName: (current, index, payload) => {
      return payload;
    }
  }
})

/*
The modifier addNumberToArray is nothing new. Since the goal of the modifier is to edit the array as a whole, the entire array object is passed into the 'current' parameter. A modifier that edits the array will cause a rerender of any component that subscribes to the array. However, we may have circumstances in which we only want to edit a single index within an array. In this case we create a modifier that accepts an index. The 'current' value will always reflect arrayOfNumbers[index]. This will prevent a rerender of components listenting to the entire array, and will instead only rerender components listening to the specified index.

Again, it is important to note that the 'current' parameter will be injected with state automatically.
*/

<button onClick={() => updateAName(0, 'Hannah')}>Edit an Index!</button>

/*
The same logic applies to plain objects. Instead of passing a numerical index into a modifier, the key of a key-value pair can be passed in instead.

Objects can be nested and it is possible to create modifiers for deeply nested objects. Ultimately, the modifier will always be bound to the parent object. However, the key/index parameter will transform into a longer chain of 'addresses' to tell Radon exactly where the data is stored. For example:
*/

names: {
  first: ['', 'Beth', 'Lisa'],
  last: {
    birth: ['Mitchell', 'Sanchez', 'Delaney'],
    married: ['Mitchell', 'Smith', 'Delaney']
  }
}

/*
To inject the name 'Hannah' into index 0 of the 'first' array, the specified 'address' would be first_0.
To change the value of index 2 of the 'married' array, the specified 'address' would be last_married_2.
*/

/*
Once all StateNodes have been declared, they should be combined in the function combineStateNodes. The returned object is known as the silo.
*/

import AppState from './appState';
import NarbarState from './navbarState';
import mainState from './mainState';

const silo = combineStateNodes(AppState, NavbarState, MainState);

```

## Built With

Rollup - Module Bundler
Babel - ES2015 transpiling

## Versioning
2.0.0 We use SemVer for versioning.

## Authors
Hannah Mitchell
Hayden Fithyan
Joshua Wright
Nicholas Smith

## License
This project is licensed under the MIT License - see the LICENSE.md file for details