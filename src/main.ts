import React from "react"

abstract class StateHandler<T> {
  
  state?            : T;
  setState          : React.Dispatch<React.SetStateAction<T>> = () => undefined; 
  instanceCreated?  : () => void

  constructor( sts : React.Dispatch<React.SetStateAction<T>> ) { this.setState = sts }

}


function useStateHandler<T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => StateHandler<T>, initial_value : T | (() => T)) : [T, StateHandler<T>] 
function useStateHandler<T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => StateHandler<T>, initial_value? : T | (() => T)) : [T | undefined, StateHandler<T>] 

function useStateHandler<T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => StateHandler<T>, initial_value: T | (() => T)) : [T, StateHandler<T>]  {
  const [inid, setInid] = React.useState(false);
  const [st, setSt]     = React.useState<T>( );  
  const [handler, ]     = React.useState<StateHandler<T>>( () => init(  new handlerClass( setSt as React.Dispatch<React.SetStateAction<T>> ), initial_value, setInid ) );
  

  if(inid) 
    handler.state = st;

  return [ st as T, handler ];
}

const init : <T>( handlerObject : StateHandler<T>, initial_value : T | (() => T), setInid : (v:boolean) => void ) => StateHandler<T>  = ( handlerObject, initial_value, setInid ) => {
  if (initial_value)
    handlerObject.state = initial_value instanceof Function ? initial_value() : initial_value;

  handlerObject.instanceCreated && handlerObject.instanceCreated()
  setInid(true);

  return handlerObject;
}


export { StateHandler, useStateHandler }
