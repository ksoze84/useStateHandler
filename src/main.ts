import React from "react"

abstract class StateHandler<T> {
  
  state?            : T;
  setState          : React.Dispatch<React.SetStateAction<T>>; 
  instanceCreated?  : () => void;

  constructor( sts : HandlerSetter<T> ) { this.setState = sts }

}

abstract class StateHandlerState<T> extends StateHandler<T> {
  
  abstract state    : T;

}



type HandlerSetter<T> = React.Dispatch<React.SetStateAction<T>> 

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : HandlerSetter<T> ) => H, initial_value : T | (() => T)) : [T , H]
function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : HandlerSetter<T> ) => H, initial_value? : T | (() => T)) : [ H extends StateHandlerState<T> ? T : T | undefined, H]

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : HandlerSetter<T> ) => H, initial_value: T | (() => T)) : [T, H]  {
  const [st, setSt]                 = React.useState<T>( initial_value );  
  const [handler, setHandler ]      = React.useState<H>( );
  
  if (!handler){
    const new_handler = new handlerClass( setSt );
    setHandler( new_handler );
    if (new_handler.state) 
      setSt(  new_handler.state );
    else  
      new_handler.state = st;
    new_handler.instanceCreated && new_handler.instanceCreated();
    return [ ( new_handler.state || st ), new_handler ]
  }
  else
    handler.state = st;

  return [ st, handler ];
}


export { StateHandler, useStateHandler, HandlerSetter }
