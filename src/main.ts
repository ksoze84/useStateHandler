import React from "react"

abstract class StateHandler<T> {

  public    state?              : T;
  readonly  setState            : React.Dispatch<React.SetStateAction<T>>; 
  protected instanceCreated?    : () => void;
  private   init                : boolean;

  constructor( sts : HandlerSetter<T>, state? : T ) { 
    this.setState = sts; 
    this.init = true;

    if(state) 
      this.state = state;
    else if( this.state )
      this.setState(this.state);
    
    
  }

  private putState( s : T ){

    if (this.init){ 
      if(this.state)
        this.setState(this.state);
      else
        this.state = s
      this.instanceCreated && this.instanceCreated(); 
      this.init = false;
    }
    else
      this.state = s

  }

}

abstract class StateHandlerState<T> extends StateHandler<T> {
  abstract state    : T;
}



type HandlerSetter<T> = React.Dispatch<React.SetStateAction<T>> 

function useStateHandler<T, H extends StateHandler<T>>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value : T | (() => T)) : [H , T]
function useStateHandler<T, H extends StateHandler<T>>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value? : T | (() => T)) : [H, H extends StateHandlerState<T> ? T : T | undefined]

function useStateHandler<T, H extends StateHandler<T>>( handlerClass : new ( s : HandlerSetter<T>, state? : T ) => H, initial_value: T | (() => T)) : [H, T]  {
  const [st, setSt]                 = React.useState<T>( initial_value );    
  const [handler, ]                 = React.useState<H>( () => new handlerClass( setSt, st ) );

  handler['putState'](st);

  return [ handler, st ];
}

export { StateHandler, useStateHandler, HandlerSetter }
