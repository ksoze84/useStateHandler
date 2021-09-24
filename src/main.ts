import React from "react"

abstract class StateHandler<T> {
  
  state?            : T;
  setState          : React.Dispatch<React.SetStateAction<T>> = () => undefined; 
  instanceCreated?  : () => void

  constructor( sts : React.Dispatch<React.SetStateAction<T>> ) { this.setState = sts }

}


function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value : T | (() => T)) : [T, H] 
function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value? : T | (() => T)) : [T | undefined, H] 

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value: T | (() => T)) : [T, H]  {
  const [inid, setInid] = React.useState(false);
  const [st, setSt]     = React.useState<T>( );  
  const [handler, ]     = React.useState<H>( () => init(  new handlerClass( setSt as React.Dispatch<React.SetStateAction<T>> ), initial_value, setInid ) );
  

  if(inid) 
    handler.state = st;

  return [ st as T, handler ];
}

const init : <H extends StateHandler<T>, T>( handlerObject : H, initial_value : T | (() => T), setInid : (v:boolean) => void ) => H  = ( handlerObject, initial_value, setInid ) => {
  if (initial_value)
    handlerObject.state = initial_value instanceof Function ? initial_value() : initial_value;

  handlerObject.instanceCreated && handlerObject.instanceCreated()
  setInid(true);

  return handlerObject;
}


export { StateHandler, useStateHandler }
