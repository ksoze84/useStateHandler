import React from "react"

abstract class StateHandler<T> {
  
  state?            : T;
  setState          : React.Dispatch<React.SetStateAction<T>>; 

  constructor( sts : React.Dispatch<React.SetStateAction<T>> ) { this.setState = sts }

}


function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value : T | (() => T)) : [T, H] 
function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value? : T | (() => T)) : [T | undefined, H] 

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value: T | (() => T)) : [T, H]  {
  const [st, setSt]     = React.useState<T>( initial_value );  
  const [handler, ]     = React.useState<H>( () => new handlerClass( setSt ) );
  

  handler.state = st;

  return [ st, handler ];
}

export { StateHandler, useStateHandler }
