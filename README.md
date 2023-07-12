# useStateHandler
Object based hook. bring the value of hooks and class based definitions together ( including this.setState ) 


Maintain a unique instance of the handler class on memory.

Heavy functions are not instantiated in every render. 

Minimal code!. Forget about useCallback, useReducer and custom hooks.

## Installation

```
yarn add use-state-handler
```


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

  static initState = { name : "", mail : "" }

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

  const [ cert, handler ] = useStateHandler( CertHandler, CertHandler.initState );


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


## How to use


1. Create a handler class C_Handler that extends StateHandler < StateType >. Add all setState methods you want to this class.

2. Use the hook useStateHandler( C_Handler, initial_value ). This hook returns [ state, C_Handler ]

3. enjoy!

## Rules

* Never set Handler.state directly, is read Only!


## Constructor

```jsx
constructor( s : HandlerSetter ) {
  super(s);
  //your code
}

```
## instanceCreated() function

if exist is called just after object is created and initial_value is setted


## State initialization

You can set a state in class definition, pass a initial_value to the hook, defining in the constructor or in the instanceCreated method. 
 
Handler state should not have multiple inititializations, but if happens this will be the result: instanceCreated() > Constructor()  > MyHandler.state > initial_value 
