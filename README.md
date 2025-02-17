# useStateHandler

Simple object based hook and state manager for React.  

KeyPoints: 
* Maintain a unique instance of the handler class on memory accross your application. 
* Share the state and the methods to update it between components.
* You write the class, the hook manages the rest.
* Heavy functions are not instantiated in every render. Forget about using useCallback, useReducer and custom hooks.
* Helps to maintain logic from render separate.

This is not a hook meant to replace useState. But rather, useStateHandler frequently is used alongside another hooks, especially useEffect.

Minimal and simple code. Small footprint and low impact in React's cycles. 


## Installation

```
npm install use-state-handler --save
```

## How to use


1. Create a handler class C_Handler that extends StateHandler < StateType >. Add all state update methods you want to this class.
1. Use the hook useStateHandler( C_Handler, initial_value ). This hook returns [ state, C_Handler ]
1. enjoy!


## Example

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



## Rules

* Never set Handler.state directly, is read Only!
* You may save another data in the class, but beware of components state updates signaling and mounting logics if this data mutates over time.
* Prefer defining an instanceCreated() method on the handle over the constructor to execute initial code.  

## Constructor

You may define a constructor in your class. But is not necessary

**Prefer defining an instanceCreated() mehtod on the handle over the constructor to execute initial code.** 

Constructor code of the class and its inherited instances constructors are not part of the mounting/unmounting logic of react. Hook state listeners may or may not be ready when the code executes. 

```jsx
constructor(  ) {
  super();
  //your code
}

```
## instanceCreated() function

Optional Callback function that may be implemented and is called only once when an instance is created. If exists in the instance, this method is called by the useStateHandler hook the first time a component in the application using the hook is effectively mounted and when the instance is "newly created".  

This method has NOT the same behavior as mount callback a component in React. The only way this method is called again by the hook is destroying the instance first with destroyInstance().


## State initialization

You can set a state in class definition or pass a initial_value.  
Handler state should not have multiple inititializations, but if happens this will be the result: MyHandler.state > initial_value.

Code you wrote in instanceCreated() method will update the initial state.


## Destroing the instance

You may destroy the instance when needed using the **destroyInstance()** method. This method must be called **on the unmount callback** of the component using it.  
This first checks if there are active state hook listeners active. If there isn't, the instance reference is deleted, and the **instanceDeleted()** method is called if exists.

If you implement **instanceDeleted()**, remember that it is not the equivalent of an unmount component callback.