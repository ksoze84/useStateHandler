# useStateHandler
Class based hook. bring the value of hooks and class based definitions together ( including this.setState ) 


Maintain a unique instance of the handler class on memory.

Heavy functions are not instantiated in every render. Minimal code. 

Forget about useCallback, useReducer and custom hooks.

## How to use


1.- Create a handler class C_Handler that extends StateHandler < StateType >. Add all setState operations you want to this class.

2.- Use the hook useStateHandler( C_Handler, initial_Value ). This hook returns [ state, C_Handler ]

3.- enjoy!

## Example
```jsx

import { StateHandler, useStateHandler } from 'use-state-handler';

class CertH extends StateHandler<ICert> {

  public setValue = ( name: string, val : any ) => {
    this.setState (  {...this.state, ...{ [name] : val } }  )
  }

  public setInput = ( e : ChangeEvent<HTMLInputElement> ) => {   
    this.setValue ( e.target.name, e.target.value )
  } 
}

const ModalCert: FunctionComponent<ModalProps> 
  = ({ modalProps, toggler}) => {

    const [ cert, handler ] = useStateHandler( CertH, {} );

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
            onChange={ handler.setInput )  }
          />

      </div> 
    );

  };



```
Here handler is the instance of CertH 
