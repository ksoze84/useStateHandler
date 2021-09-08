import { useState } from "react";

class StateHandler<T> {
  
  public state? : T;
  public setState : ( value : React.SetStateAction<T> ) => void

  constructor( sts : ( value : React.SetStateAction<T> ) => void ) { this.setState = sts }

}


function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : ( value : React.SetStateAction<T> ) => void ) => H, initial_value : T) : [T, H] 
function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : ( value : React.SetStateAction<T> ) => void ) => H, initial_value? : T) : [T | undefined, H] 

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : ( value : React.SetStateAction<T> ) => void ) => H, initial_value: T) : [T, H]  {
  const [st, setSt] = useState<T>( initial_value );
  const [handler, ] = useState<H>( () => new handlerClass( setSt ) )  

  handler.state = st;

  return [ st, handler ]
}

export { StateHandler, useStateHandler }