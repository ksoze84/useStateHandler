import React from "react"

abstract class StateHandler<T> {
  
  state?                    : T;
  setState                  : React.Dispatch<React.SetStateAction<T>>; 
  private instanceCreated?  : () => void;
  private init              : boolean;

  constructor( sts : HandlerSetter<T>, state? : T ) { 
    this.setState = sts; 
    this.init = false;
    
    if(state) 
      this.state = state;

    this.instanceCreated && this.instanceCreated(); 
  }

  private putState( s : T ){
    if (this.init) 
      { this.state = s };
    this.init = true;
  }

}

abstract class StateHandlerState<T> extends StateHandler<T> {
  abstract state    : T;
}



type HandlerSetter<T> = React.Dispatch<React.SetStateAction<T>> 

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value : T | (() => T)) : [T , H]
function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value? : T | (() => T)) : [ H extends StateHandlerState<T> ? T : T | undefined, H]

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value: T | (() => T)) : [T, H]  {
  const [st, setSt]                 = React.useState<T>( initial_value );    
  const [handler, ]                 = React.useState<H>( () => new handlerClass( setSt, st ) );
  
  handler['putState'](st);

  return [ st, handler ];
}


export { StateHandler, useStateHandler, HandlerSetter }
