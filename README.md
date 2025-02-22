# useStateHandler

Simple object based hook and state manager for React.  

KeyPoints: 
* Keep the React paradigm; only mind this hook is persistent. If you are familiar with class components, this will too.
* Maintain a unique instance of the handler class on memory accross your application. 
* Share the state and the methods to update it between components.
* You write the class, the hook manages the rest.
* Heavy functions are not instantiated in every render. Minimize overhead by avoiding useCallback, useReducer, useMemo, and dependency arrays.
* Helps to separate logic from render.
* Minimal and simple code. Small footprint and low impact in React's cycles. 

This is not a hook meant to replace useState, but rather to be used alongside another hooks, like useState, but mostly with useEffect to control related components mount/unmount.


## Installation

```
npm install use-state-handler --save
```

## How to use


1. Create a handler class C_Handler that extends StateHandler < StateType >. Add all state update methods you want to this class.
1. Use the hook useStateHandler( C_Handler, initial_value ). This hook returns [ state, C_Handler ]
1. enjoy!

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

## State initialization

You can set an initial state in the class definition or pass an initial value on the hook. You should not initialize the state with both methods, but if you do, the initial value on the hook will prevail unless the handler is already instantiated.

Prefer setting the state in the class definition for easier readability.

Code you wrote in instanceCreated() method will update the initial state.


## Get the instance.

You can get the instance of your Handler using getHandler() utility method, mainly for two things:
* To use handler actions without triggering re-renders in "control-only" components
* To use the handler outside react

### Updating last example:

```tsx

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


## Rules

* Never set Handler.state directly, is read Only!
* You may save another data in the class, but beware of components state updates signaling and mounting logics if this data mutates over time.
* Prefer defining an instanceCreated() method on the handler over the constructor to execute initial code.  



## Handler Configuration

You may configure the handler by setting the optional property _handlerConfig in your handler. It has two boolean options:
* merge : The state is overwritten by default using setState. Change this to true to merge.
* destroyOnUnmount : Tries to delete the instance in each unmount of each component.

```tsx

//default:
 _handlerConfig = { merge : false, destroyOnUnmount : false }

```

### Merging the state

Overwrite the state is the default mode on hanlder.setState, but you can configure the handler to merge. This example is specially usefull for refactor old class components:

```tsx

type countState = {chairs:number, tables:number, rooms:number}

class CountHandler extends StateHandler<countState> {
  state = {
    chairs: 0,
    tables : 0,
    rooms : 10
  }

  _handlerConfig = { merge : true, destroyOnUnmount : false }

  addChairs = () => this.setState( c =>( { chairs: c.chairs + 1 }) );
  subtractChairs = () => this.setState( c => ({chairs : c.chairs - 1}) );

  addTables = () => this.setState( t => ({tables: t.tables + 1}) );
  subtractTables = () => this.setState( t => ({tables: t.tables - 1}) );

  resetSome = () => this.setState( { chairs: 0, tables : 0 } );
}


```
**Note that the useStateHandler hook will trigger re-render for any part of the state changed.**




## instanceCreated() function

Optional Callback function that may be implemented and is called only once when an instance is created. If exists in the instance, this method is called by the useStateHandler hook the first time a component in the application using the hook is effectively mounted and when the instance is "newly created".  

This method has NOT the same behavior as mount callback a component in React. The only way this method is called again by the hook is destroying the instance first with destroyInstance().


## Destroying the instance

You may destroy the instance when needed using the **destroyInstance()** method. This method must be called **on the unmount callback** of the component using it.  
This first checks if there are active state hook listeners active. If there isn't, the instance reference is deleted, and the **instanceDeleted()** method is called if exists.

If you implement **instanceDeleted()**, remember that it is not the equivalent of an unmount component callback.

This is not neccesary if the handler option destroyOnUnmount is true

## Big Example

ModalCert.tsx:
```jsx
import { CertHandler } from './CertHandler';
import { useStateHandler } from 'use-state-handler';

const ModalCert: FunctionComponent<ModalProps> = ({ cert_name }) => {

  const [ cert, handler ] = useStateHandler( CertHandler );

  useEffect( () => { handler.load( cert_name ) }, [] )

  return (
    <div className="box">

      <input
        type='text'
        placeholder="ej: Jhon"
        value={cert.name}
        name="name"
        onChange={ handler.setInput }
      />
      
      <input
        type='text'
        placeholder="ej: Jhon@mail.com"
        value={cert.mail}
        name="mail"
        onChange={ handler.setInput }
      />

      <select
        name="type"
        onChange={ handler.setType }
      >
        <option value="A"></option>
        <option value="B"></option>
      </select>

      <span className="subtitle">Output Signature:</span>
      <div className="signature"> cert.description </div>

      <MyControlComponent 
        certHandler={handler}
      />

      <button onClick={handler.save}>
        Save
      </button>

    </div> 
  );

}

```

CertHandler.ts
```jsx
import { StateHandler } from 'use-state-handler';

export class CertHandler extends StateHandler<ICert> {

  private descA = " Description A ...";
  private descB = " Description B ...";

  state = { name : "", mail : "" };

  instanceCreated = ( ) => 
    this.load( "" )


  public load = ( name : string ) =>
    fetch( "url", name )
      .then( data => setState( data ) )
  

  public setValue = ( name: string, val : any ) => {
    this.setState (  {...this.state, ...{ [name] : val } }  )
  }

  public loadControlOptions = ( id : string ) => 
    fetch( "url_details" )
      .then( data => setState( {...this.state, ...{ details : data } } )

  public setInput = ( e : ChangeEvent<HTMLInputElement> ) => {   
    this.setValue ( e.target.name, e.target.value )
  } 

  public setType = ( e : ChangeEvent<HTMLSelectElement> ) => {   
    let type = e.target.value;
    let desc : string
    
    if(type === "A")
      desc = state.name + this.descA;
    else
      desc = this.descB;

    setState({...this.state, ...{ type : type, description : desc } });
  } 


  save = () =>
    post( "save_url", this.state )

}

```
NewModalCert.tsx:
```jsx
import { CertHandler } from './CertHandler';
import { useStateHandler } from 'use-state-handler';

//same as before but different initialization
const NewModalCert: FunctionComponent<ModalProps> = ({ cert_name }) => {

  const [ cert, handler ] = useStateHandler( CertHandler );


  return (
    <div className="box">

      <input
        type='text'
        placeholder="ej: Jhon"
        value={cert.name}
        name="name"
        onChange={ handler.setInput }
      />
      
      <input
        type='text'
        placeholder="ej: Jhon@mail.com"
        value={cert.mail}
        name="mail"
        onChange={ handler.setInput }
      />

      <select
        name="type"
        onChange={ handler.setType }
      >
        <option value="A"></option>
        <option value="B"></option>
      </select>

      <span className="subtitle">Output Signature:</span>
      <div className="signature"> cert.description </div>

      <MyControlComponent 
        certHandler={handler}
      />

      <button onClick={handler.save}>
        Save
      </button>

    </div> 
  );

}

```


## Constructor

You may define a constructor in your class. But is not necessary

**Prefer defining an instanceCreated() method on the handler over the constructor to execute initial code.** 

```jsx
constructor() {
  super();
  //your code
}

```

Constructor code of the class and its inherited instances constructors are not part of the mounting/unmounting logic of react. Hook state listeners may or may not be ready when the code executes. 

It is safe to make changes that do not involve the state.
