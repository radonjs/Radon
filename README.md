# <img src='https://i.imgur.com/k6JIgZR.png' height='130'/>

Radon is an object-oriented state management framework for JavaScript applications.

## Getting Started

To install the stable version using npm as your package manager:

```npm install --save radon-js```

The Radon source code is transpiled to ES2015 to work in any modern browser. You don't need to use Babel or a module bundler to get started with Radon.

Most likely, you'll also need the React bindings and the developer tools.

```npm install --save react-radon```

Unlike Radon, React doesn't provide UMD builds, so you will need to use a CommonJS module bundler like Webpack, Parcel, or Rollup to utilize Radon with React.

## How Radon Works

```
import { StateNode } from 'radon-js'

/* StateNode is a class needed for creating instances of state. In Radon, StateNodes are created in
tandem with frontend components. The naming convention is important here; if you have created 
a frontend component called App with the intent of statefulness, then an instance of StateNode must be declared and labeled as AppState. This will allow the App component to properly bind to AppState
at compile time.

The new instance of StateNode takes two arguments: the first argument is the name of the StateNode you are creating which must follow our naming convention. The second argument is the name of the parent node. One StateNode must be considered the root of the state tree. Therefore, at only one occassion can the parent argument be omitted. This instance of StateNode will be considered the root. Every other StateNode must take a second argument.

const AppState = new StateNode('AppState');
// or
// const AppState = new StateNode('AppState', 'OtherState');

```



Radon state management is able to update specific parts of the state tree without ever resending the state unnecessarily.
It does this using state methods called Modifiers, which are attached to specific pieces of the state. State changes
cannot occur without calling one of these methods, which means that Radon can always determine which parts
of the state are changing, meaning data will only be sent to the subscribers when the data changes. This can significantly
improve the speed of state changes in highly nested applications when compared other state management tools.

Radon also implements native handling of asynchronous state changes using async generators. When state modifiers are called,
they are added to a running queue of modifiers, which are called in order using generators. This means that handling asynchronicity in complex web applications is predictable and intuitive.






Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Prerequisites
What things you need to install the software and how to install them

Give examples
Installing
A step by step series of examples that tell you how to get a development env running

Say what the step will be

Give the example
And repeat

until finished
End with an example of getting some data out of the system or using it for a little demo

Running the tests
Explain how to run the automated tests for this system

Break down into end to end tests
Explain what these tests test and why

Give an example
And coding style tests
Explain what these tests test and why

Give an example
Deployment
Add additional notes about how to deploy this on a live system

Built With
Dropwizard - The web framework used
Maven - Dependency Management
ROME - Used to generate RSS Feeds
Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

Versioning
We use SemVer for versioning. For the versions available, see the tags on this repository.

Authors
Billie Thompson - Initial work - PurpleBooth
See also the list of contributors who participated in this project.

License
This project is licensed under the MIT License - see the LICENSE.md file for details