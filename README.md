# <img src='https://i.imgur.com/k6JIgZR.png' height='130'/>

[![Build Status](https://img.shields.io/travis/com/radonjs/Radon/master.svg?label=Radon&style=flat-square)](https://travis-ci.com/radonjs/Radon)  [![npm](https://img.shields.io/npm/v/radon-js.svg?style=flat-square)](https://npmjs.org/package/radon-js)

[Radon](http://radonjs.org) is an object-oriented state management framework for JavaScript applications.

Read our documentation at [radonjs.org](http://radonjs.org/docs/introduction)

# Why?

## Data Encapsulation

One of the first goals of Radon was to implement an object oriented state manager capable of data encapsulation. Many state managers allow pieces of state to be accessible by any component or module, and with that access follows modification allowances. This inherently conflicts with a ubiquitous object oriented programming practice: limiting scope. Limiting the scope of a variable or method provides better context for its purpose and makes it easier to reason about. Plus, there's the added bonus of protecting data from being modified by script that has several degrees of separation. Many programming languages have native features to handle data encapsulation such as privatized class attributes and methods. Unfortunately, Javascript doesn't have the same privatization features held by universal languages such as Java and C/C++. Therefore, the data encapsulation feature of Radon needed to be derived by other means.

To understand encapsulation in Radon, it is first important to understand how the data is organized. Radon is built using a tree data structure. Pieces of state are stored in specially designed nodes and are organized in a way that parallels the component tree of many common frontend frameworks such as React or Vue. For example, if a developer created an initial App component that needed access to variables in state, a corresponding AppState node would be created that contained those specific variables and any accompanying modifier functions. Now let's say the App component renders two more components named Navbar and Main. If Navbar were to be stateful, it would need a corresponding node called NavbarState. If the same thing can be said for Main, then it would have a corresponding state node called MainState. If a frontend component is intended to be stateless, then there will be no corresponding state node. So now we can hopefully start to imagine that the App Component is at the top of a component tree (as the root), with NavbarState and MainState branching beneath it. The same can be said for the State Tree. AppState is our root, with NavbarState and MainState branching below.

But what does this mean for data encapsulation? The intention for the State Tree is for state nodes to share their data and modifiers with corresponding frontend components. However, this implementation alone would be too constricting of the data. Therefore, frontend components are not only able to access the data from their corresponding state nodes, but also the data from its parent, grandparent, and any further parent tracing back to the root. Now there's a greater sense of flow that encourages commonly used and shared data to be stored near the root, and specialized data to be stored as leaves on the tree. In sum, frontend components will have access to parental lineage data, but will not have access to their sibling’s or children's data. Thus, varying pieces of state are exposed where they are needed, and hidden where they are not.

## Component Rendering Linked to Objects in State

Another feature of Radon intends to remove unnecessary re-rendering that can emerge from modifying objects in state. In other state management systems, modifying a single key/value pair in a plain object or an index in an array will result in a re-render of any component subscribed to the object. The Radon State Tree solves this problem by deconstructing objects into state nodes by index or key/value pairs. The object deconstruction feature allows for direct modification of these indices/pairs and triggers a re-render of only the component listening to that particular data point.

## Asynchronous Modifications to State

Modifiers are functions written by the developer that can only modify a single state variable. Developers have the option to create an asynchronous modifier which may seem problematic if multiple modifiers are called in tandem to edit the same piece of state. However, Radon ensures that all state changes, whether asynchronous or synchronous, occur in the order of initial invocation. This is accomplished with an asynchronous queue that awaits the completion of the most recently invoked modifier before progressing to the next. Hence, the developer does not need to worry about conflicting state changes or out of order updates.

# Getting Started

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
a frontend component called App with the intent of statefulness, then an instance of StateNode must be 
declared and labeled as AppState. This will allow the App component to properly bind to AppState
at compile time.


The new instance of StateNode takes two arguments: the first argument is the name of the StateNode you
are creating which must follow our naming convention. The second argument is the name of the parent
node. One StateNode must be considered the root of the state tree. Therefore, at only one occasion can
the parent argument be omitted. This instance of StateNode will be considered the root. Every other
StateNode must take a parent argument.
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
Modifiers are functions that modify a single variable in state. Modifiers are attached to variables by
calling the method initializeModifiers which also takes an object as an argument. The keys of the
argument object must correspond to variables that have already been declared in AppState. The values
are objects that contain the modifier functions as key-value pairs. There are two types of modifiers
in Radon. The first type, as seen below, can accept either 1 or 2 arguments. The 'current' argument
will automatically be injected with the bound state variable. The 'payload' argument is any data that 
can be used to modify or replace the 'current' value of state. Even if the current value of state is 
not used in the modifier, it will still be passed in automatically.
*/

AppState.initializeModifiers({
  name: {
    updateName: (current, payload) => {
      return payload;
    }
  },
  status: {
    toggleStatus: (current) => {
      return !current;
    }
  }
})

/*
It is important to note that when these modifiers are called from a component, only the payload argument
must be passed into the function as Radon will fill the 'current' parameter by default.
*/

<button onClick={() => this.props.name.updateName('Radon is cool!!!')}>Click Me</button>
<button onClick={() => this.props.status.toggleStatus()}>Click Me Too</button>

/*
The second modifier type is what helps Radon eliminate unnecessary re-rendering of frontend components.
This modifier type accepts three arguments and is used exclusively with objects. *Note that
initializeModifiers should only be called once. It is shown again here for demonstration purposes only*.
*/

AppState.initializeModifiers({
  arrayOfNames: {
    addNameToArray: (current, payload) => {
      current.push(payload);
      return current;
    },
    updateAName: (current, index, payload) => {
      return payload;
    }
  }
})

/*
The modifier addNumberToArray is nothing new. Since the goal of the modifier is to edit the array as a 
whole, the entire array object is passed into the 'current' parameter. A modifier that edits the array 
will cause a re-render of any component that subscribes to the array. However, we may have
circumstances in which we only want to edit a single index within an array. In this case we create a
modifier that accepts an index. The 'current' value will always reflect arrayOfNumbers[index]. This 
will prevent a re-render of components listening to the entire array, and will instead only re-render
components listening to the specified index.

Again, it is important to note that the 'current' parameter will be injected with state automatically.
*/

<button onClick={() => updateAName(0, 'Hannah')}>Edit an Index!</button>

/*
The same logic applies to plain objects. Instead of passing a numerical index into a modifier, the key 
of a key-value pair can be passed in instead.

Objects can be nested and it is possible to create modifiers for deeply nested objects. Ultimately, the
modifier will always be bound to the parent object. However, the key/index parameter will transform into 
a longer chain of 'addresses' to tell Radon exactly where the data is stored. For example:
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
Once all StateNodes have been declared, they should be combined in the function combineStateNodes. The
returned object is known as the silo.
*/

import AppState from './appState';
import NarbarState from './navbarState';
import mainState from './mainState';

const silo = combineStateNodes(AppState, NavbarState, MainState);

```


### Bind the state
In order to use the **Silo** state in a component, it must be passed to the same from the top of the application. 
That depends on the framework binding.
Below you can find a working example of use of **Radon** on **React** via [react-radon](https://github.com/radonjs/React-Radon), the react binding for this library, as an example:

```javascript
import {render} from 'react-dom';
import {Provider} from 'react-radon';

// Silo from Exported combineNodes from the example before
import silo from './localSiloLocation';

render(
  <Provider silo={silo}>
    <App />
  </Provider>,
  document.getElementById('root'));


// And in the component where you need the piece of state

import React from 'react';
import { bindToSilo } from 'react-radon'

const ReactComponent = (props) => {
  return (
    <div>
      {props.name}
    </div>
  )
}

export default bindToSilo(ReactComponent);

```

## Built With

Rollup - Module Bundler

Babel - ES2015 transpiling

## Versioning
2.0.0 We use SemVer for versioning.

## Authors
Hannah Mitchell,

Hayden Fithyan,

Joshua Wright,

Nicholas Smith

## License
This project is licensed under the MIT License - see the LICENSE.txt file for details
