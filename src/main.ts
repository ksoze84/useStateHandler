import React from "react"

abstract class StateHandler<T> {

  public    state?              : T;
  readonly  setState            : React.Dispatch<React.SetStateAction<T>>; 
  protected instanceCreated?    : () => void;

  constructor( hs : HandlerSetter<T>) { 
    this.setState = hs[1]; 
  }

}

abstract class StateHandlerState<T> extends StateHandler<T> {
  abstract state    : T;
}


function initHandler<T, H extends StateHandler<T>>( hs : HandlerSetter<T>, handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H ) {
  
  const handler = new handlerClass( hs );

  if(hs[0]) 
    handler.state = hs[0];
  else if( handler.state ){
    hs[1]( handler.state );
    hs[0]=handler.state;
  }
  
  handler['instanceCreated'] && handler['instanceCreated']()

  return handler
  
}

type HandlerSetter<T> =  [T, React.Dispatch<React.SetStateAction<T>>];

function useStateHandler<T, H extends StateHandler<T>>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value : T | (() => T)) : [T, H]
function useStateHandler<T, H extends StateHandler<T>>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value? : T | (() => T)) : [ H extends StateHandlerState<T> ? T : T | undefined, H]

function useStateHandler<T, H extends StateHandler<T>>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value: T | (() => T)) : [T | undefined, H]  {
  const hs                          = React.useState<T>( initial_value );    
  const [handler, ]                 = React.useState<H>( () => initHandler( hs, handlerClass )  );

  handler.state = hs[0];

  return [ handler.state, handler ];
}

export { StateHandler, useStateHandler, HandlerSetter }

