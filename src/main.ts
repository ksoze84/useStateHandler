import React from "react"

abstract class StateHandler<T> {
  
  state?            : T;
  setState          : React.Dispatch<React.SetStateAction<T>>; 
  instanceCreated?  : () => void

  constructor( sts : React.Dispatch<React.SetStateAction<T>> ) { this.setState = sts }

}


function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value : T | (() => T)) : [T, H] 
function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value? : T | (() => T)) : [T | undefined, H] 

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value: T | (() => T)) : [T, H]  {
  const [st, setSt]     = React.useState<T>( initial_value );  
  const [handler, setHandler ]     = React.useState<H>( );
  
  if (!handler ){
    let new_handler = new handlerClass( setSt )
    setHandler( new_handler )
    setSt( new_handler.state || st  )
    new_handler.instanceCreated && new_handler.instanceCreated();
    return [ ( new_handler.state || st ), new_handler ]
  }
  else
    handler.state = st;

  return [ st, handler ];
}

function useHandlerObject<H extends StateHandler<T>, T>( handlerGenerator : ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value: T | (() => T)) : [T, H] 
function useHandlerObject<H extends StateHandler<T>, T>( handlerGenerator : ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value?: T | (() => T)) : [T | undefined, H] 

function useHandlerObject<H extends StateHandler<T>, T>( handlerGenerator : ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value: T | (() => T)) : [T, H]  {
  const [st, setSt]                 = React.useState<T>( initial_value );  
  const [handler, setHandler ]      = React.useState<H>();
  
  if (!handler ){
    let new_handler = handlerGenerator(setSt) 
    setHandler( new_handler );
    setSt( new_handler.state || st  );
    new_handler.instanceCreated && new_handler.instanceCreated();
    return [ ( new_handler.state || st ), new_handler ]
  }
  else
    handler.state = st;

  return [ st, handler ];
}


export { StateHandler, useStateHandler, useHandlerObject }
