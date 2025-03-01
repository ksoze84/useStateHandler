# useStateHandler

Simple class based hook and state manager for React.  

KeyPoints: 
* Keep the React paradigm; only mind this hook is persistent. If you are familiar with class components, you will be familiar with this as well.
* Work with classes.
* Maintain a unique instance of the handler class on memory accross your application. 
* Share the state and the methods to update it between components.
* You write the class, the hook manages the rest.
* Heavy functions are not instantiated in every render. Minimize overhead by avoiding useCallback, useReducer, useMemo, and dependency arrays.
* Helps to separate logic from render.
* Minimal and simple code. Small footprint and low impact in React's cycles. 

This is not a hook meant to replace useState, but rather to be used alongside another hooks, like useState, but mostly with useEffect to control the handler when components mount/unmount.

## Basic Example

```tsx

import { StateHandler, useStateHandler } from "use-state-handler";

class CountHandler extends StateHandler<number> {
  state = 0;

  public add      = () => this.setState( s => s + 1 );
  public subtract = () => this.setState( s => s - 1 );
  public reset    = () => this.setState( 0 );
}

function Counter() {
  const [count, {add, subtract}] = useStateHandler(CountHandler);

  return (
    <div>
      <span>{count}</span>
      <button onClick={add}>+</button>
      <button onClick={subtract}>-</button>
    </div>
  );
}


```

## Table of Contents


- [Basic Example](#basic-example)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [How to use](#how-to-use)
- [Rules](#rules)
- [State initialization](#state-initialization)
- [instanceCreated() function](#instancecreated-function)
- [Get the instance with getHandler()](#get-the-instance-with-gethandler)
- [Handler Configuration](#handler-configuration)
  - [Merging the state](#merging-the-state)
- [usePartialHandler to update only when a determined subset of state properties changes](#usepartialhandler-to-update-only-when-a-determined-subset-of-state-properties-changes)
- [Working with Classes](#working-with-classes)
  - [Reutilizing classes](#reutilizing-classes)
  - [Extendibility and Inheritance](#extendibility-and-inheritance)
- [Your Own setState function](#your-own-setstate-function)
  - [Example with immer:](#example-with-immer)
  - [Or you can only change the accessibility modifier of setState](#or-you-can-only-change-the-accessibility-modifier-of-setstate)
- [Destroying the instance](#destroying-the-instance)
- [Constructor](#constructor)


## Installation

```
npm install use-state-handler --save
```

## How to use


1. Create a handler class C_Handler that extends StateHandler < StateType >. Add all state update methods you want to this class.
1. Use the hook useStateHandler( C_Handler, initial_value ). This hook returns [ state, C_Handler ]
1. enjoy!

## Rules

* Never set Handler.state directly; it is read only!
* You may save another data in the class, but beware of component state updates signaling and mounting logics if this data mutates over time.
* Do not manipulate state directly in the constructor.
* The class name is the key for this software to work as expected. Never use the same name for state handler classes even if they are declared in different scopes.


## State initialization

You can set an initial state in the class definition or pass an initial value on the hook. You should not initialize the state with both methods, but if you do, the initial value on the hook will prevail.

Prefer setting the state in the class definition for easier readability.

```tsx

class CountHandler extends StateHandler<{chairs:number, tables:number, rooms:number}> {
  state = {
    chairs: 0,
    tables : 0,
    rooms : 10
  }

  ...
}

// OR 

function Counter() {
  const [counters] = useStateHandler(CountHandler, { chairs: 0, tables : 0, rooms : 10 });

 ...
}

```

**Code you wrote in instanceCreated() method will update the initial state.**


## instanceCreated() function

Optional handler method that is called only once when an instance is created. If exists in the instance, this method is called by the useStateHandler hook the first time a component in the application using the hook is effectively mounted and when the instance is "newly created".  

This method has NOT the same behavior as mount callback of a component in React. The only way this method is called again by the hook is by destroying the instance first with destroyInstance().

```tsx

class CountHandler extends StateHandler<{chairs:number, tables:number, rooms:number}> {
  state = {
    chairs: 0,
    tables : 0,
    rooms : 0
  }

  instanceCreated = () => {
    fetch('https://myapi.com/counters').then( r => r.json() ).then( r => this.setState(r) );
  }
}

```

## Get the instance with getHandler()

You can get the instance of your Handler using getHandler() utility method, mainly for two things:
* To use handler actions without triggering re-renders in "control-only" components
* To use the handler outside react

```tsx

class CountHandler extends StateHandler<number> {
  state = 0;

  public add      = () => this.setState( s => s + 1 );
  public subtract = () => this.setState( s => s - 1 );
  public reset    = () => this.setState( 0 );
}

function Counter() {
  const [count] = useStateHandler(CountHandler);

  return (
    <div>
      <span>{count}</span>
    </div>
  );
}

function Controls() {
  const {add, subtract} = getHandler(CountHandler);

  return (
    <div className="buttons">
      <button onClick={add}>+</button>
      <button onClick={subtract}>-</button>
    </div>
  );
}

export function App() {
  return (
    <div>
        <Counter />
        <Controls />
    </div>
  );
}



```


## Handler Configuration

You may configure the handler by setting the optional property _handlerConfig in your handler. It has two boolean options:
* merge : The state is overwritten by default using setState. Change this to true to merge.
* destroyOnUnmount : Tries to delete the instance in each unmount of each component. Is successfully deleted if there are no active listeners (other components using it).

```tsx

//default:
 _handlerConfig = { merge : false, destroyOnUnmount : false }

```

### Merging the state

Overwrite the state is the default mode on hanlder.setState, but you can configure the handler to merge. This example is specially usefull for refactor old class components:

```tsx

class CountHandler extends StateHandler<{chairs:number, tables:number, rooms:number}> {
  state = {
    chairs: 0,
    tables : 0,
    rooms : 10
  }

  _handlerConfig = { merge : true }

  addChairs = () => this.setState( c =>( { chairs: c.chairs + 1 }) );
  subtractChairs = () => this.setState( c => ({chairs : c.chairs - 1}) );

  addTables = () => this.setState( t => ({tables: t.tables + 1}) );
  subtractTables = () => this.setState( t => ({tables: t.tables - 1}) );

  resetAll = () => this.setState( { chairs: 0, tables : 0 } );
}

function Chairs() {
  const [{chairs},{addChairs, subtractChairs}] = useStateHandler(CountHandler);

  return <>
    <span>Chairs: {chairs}</span>
    <button onClick={addChairs}>+</button>
    <button onClick={subtractChairs}>-</button>
  </> 
}

function Tables() {
  const [{tables},{addTables, subtractTables}] = useStateHandler(CountHandler);

  return <>
    <span>Tables: {tables}</span>
    <button onClick={addTables}>+</button>
    <button onClick={subtractTables}>-</button>
  </>
}

```
**Note that the useStateHandler hook will trigger re-render for any part of the state changed. In the example above, Tables component will re-render if the chairs value is changed. This behavior can be optimized with usePartialHandler hook.**  
**Merging mode is only for non-undefined objects, and there is no check of any kind for this before doing it, so its on you to guarantee an initial and always state object.**

## usePartialHandler to update only when a determined subset of state properties changes

When a non-undefined object with many properties is used as state, the useStateHandler hook will trigger re-render for any part of the state changed, even if only the component is using only one of the properties. This can be optimized using the provided usePartialHandler hook, which performs a shallow comparison. It is more suitable if the merge state option is set to true.

The usage of this hook is identical to useStateHandler, but the second argument must be a non-empty array of strings with the state property names. An initial state can be defined in the third argument. 

**Use only if you have performance problems; this hook avoids some unnecessary re-renders but introduces a dependency array of comparisons. Always prefer useStateHandler first.**

Updating the previous example:

```tsx
class CountHandler extends StateHandler<{chairs:number, tables:number, rooms:number}> {
  state = {
    chairs: 0,
    tables : 0,
    rooms : 10
  }

  _handlerConfig = { merge : true }

  addChairs = () => this.setState( c =>( { chairs: c.chairs + 1 }) );
  subtractChairs = () => this.setState( c => ({chairs : c.chairs - 1}) );

  addTables = () => this.setState( t => ({tables: t.tables + 1}) );
  subtractTables = () => this.setState( t => ({tables: t.tables - 1}) );

  resetAll = () => this.setState( { chairs: 0, tables : 0 } );
}

function Chairs() {
  const [{chairs}, {addTables, subtractTables}] = usePartialHandler(CountHandler, ["chairs"]);

  return <>
    <span>Chairs: {chairs}</span>
    <button onClick={addChairs}>+</button>
    <button onClick={subtractChairs}>-</button>
  </> 
}

function Tables() {
  const [{tables}, {addTables, subtractTables}] = usePartialHandler(CountHandler, ["tables"]);

  return <>
    <span>Tables: {tables}</span>
    <button onClick={addTables}>+</button>
    <button onClick={subtractTables}>-</button>
  </>
}

```


## Working with Classes

### Reutilizing classes

Classes are made for reutilization, making new instances from these. But in this case, the instance creation is managed by the hook, and it maintains only one instance per class name. 
One way to use your class again with this hook without duplicating code is to extend it:

```ts
class CountHandlerTwo extends CountHandler {};

```

### Extendibility and Inheritance

You can write common functionality in a generic class and extend this class, adding the specifics. In this case, extending a parent generic class with StateHandler lets you encapsulate common functionality:


MyApiHandler.ts : A handler for my API
```ts

type ApiData = {
  data?: Record<string, any>[];
  isLoading: boolean;
}

export abstract class MyApiHandler extends StateHandler<ApiData>{

  state : ApiData = {
    data: undefined,
    isLoading: false
  }

  protected _handlerConfig = { merge: true };

  abstract readonly loadUri : string; // making loadUri property obligatory to define in inherited class
  readonly saveUri? : string = undefined;

  public load = ( params? : string ) => {
    this.setState({isLoading: true});
    return fetch( this.loadUri + ( params ?? '' ) )
            .then( r => r.json() )
            .then( resp => this.setState({ data : resp?.data ?? [] , isLoading: false}) )
  }

  public modify = ( item : Record<string, any>, changes : Record<string, any> ) => 
    this.setState( { data : this.state.data?.map( i => i === item ? { ...i, ...changes } : i ) } )

  public delete = ( item : Record<string, any> ) => 
    this.setState( { data : this.state.data?.filter( i => i !== item ) } )

  public append = ( item : Record<string, any> ) =>
    this.setState( { data : this.state.data?.concat( item ) } )

  public save = ( params? : Record<string, any> ) => {
    this.setState({isLoading: true});
    return fetch( this.saveUri ?? '', { method: 'POST', body : JSON.stringify(params)} )
            .then( r => r.json() )
            .then( () => this.setState({ isLoading: false }) )
  }

}

```

MyComponent.tsx

```tsx
import { MyApiHandler } from "./MyApiHandler";

class SpecificApiHandler extends MyApiHandler { loadUri = 'https://myapi/specific' }

export function MyComponent() {

  const [{data, isLoading}, {load, formModify, save} ] = useStateHandler( SpecificApiHandler );

  useEffect( () => { load() }, [] );

  return ( ... );
}

```


## Your Own setState function

setState() is only a wrapper for the real _setState() function. You can directly modify it in Javascript; in Typescript, you need to define the setState type as a second generic type of the class.

### Example with immer:
```tsx
import { produce, WritableDraft } from "immer";

type CountState = {chairs:number, tables:number, rooms:number};
type MySetStateType = ( recipe : (draft: WritableDraft<CountState>) => void ) => void;

export class CountHandler extends StateHandler<CountState, MySetStateType> {
  state = {
    chairs: 0,
    tables : 0,
    rooms : 10
  }

  public setState : MySetStateType = ( recipe ) => this._setState( s => produce(s, recipe) )

}

function Chairs() {
  const [{chairs}, {setState}] = useStateHandler(CountHandler);
  return <>
    <span>Chairs: {chairs}</span>
    <button onClick={() => setState( s => { s.chairs++ } )}>+</button>
    <button onClick={() => setState( s => { s.chairs-- } )}>-</button>
  </>
}

function Tables() {
  const [{tables}, {setState}] = useStateHandler(CountHandler);
  return <>
    <span>Tables: {tables}</span>
    <button onClick={() => setState( s => { s.tables++ } )}>+</button>
    <button onClick={() => setState( s => { s.tables-- } )}>-</button>
  </>
}

```


### Or you can only change the accessibility modifier of setState
```tsx
public setState = this._setState
```

## Destroying the instance

You may destroy the instance when needed using the **destroyInstance()** method. This method must be called **on the unmount callback** of the component using it.  
This first checks if there are active state hook listeners active. If there isn't, the instance reference is deleted, and the **instanceDeleted()** method is called if exists.

If you implement **instanceDeleted()**, remember that it is not the equivalent of an unmount component callback.

This is not neccesary if the handler option destroyOnUnmount is true

```tsx
export function App() {

  const [ {data}, {load, destroyInstance} ] = useStateHandler( ActividadesHandler );

  useEffect( () => {
    load();
    return () => destroyInstance(); // instanceDeleted() would be called
  }, [] );

 ...
}

```

## Constructor

You may define a constructor in your class. But is not necessary

**Prefer defining an instanceCreated() method on the handler over the constructor to execute initial code.** 

```tsx
constructor( initialState? : T ) {
  super(initialState);
  //your code
}

```

Constructor code of the class and its inherited instances constructors are not part of the mounting/unmounting logic of react. Hook state listeners may or may not be ready when the code executes. 

It is safe to write code that does not involve changing the state directly.

