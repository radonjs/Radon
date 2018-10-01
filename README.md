# <img src='https://i.imgur.com/k6JIgZR.png' height='130'/>

Radon is an object-oriented state management framework for JavaScript applications.

## Getting Started

## How Radon Works

Radon state management is able to update specific parts of the state tree without ever resending the state unnecessarily.
It does this using state methods called Modifiers, which are attached to specific pieces of the state. State changes
cannot occur without calling one of these methods, which means that Radon can always determine which parts
of the state are changing, meaning data will only be sent to the subscribers when the data changes. This can significantly
improve the speed of state changes in highly nested applications when compared other state management tools.

Radon also implements native handling of asynchronous state changes using async generators. When state modifiers are called,
they are added to a running queue of modifiers, which are called in order using generators. This means that handling asynchronicity in complex web applications is predictable and intuitive.

