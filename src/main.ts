import { useState } from "react";

class StateHandler<T> {
  
  public state? : T;
  public setState : React.Dispatch<React.SetStateAction<T>>

  constructor( sts : React.Dispatch<React.SetStateAction<T>> ) { this.setState = sts }

}


function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value : T) : [T, H] 
function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value? : T) : [T | undefined, H] 

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value: T) : [T, H]  {
  const [st, setSt] = useState<T>( initial_value );
  const [handler, ] = useState<H>( () => new handlerClass( setSt ) )  

  handler.state = st;

  return [ st, handler ]
}

export { StateHandler, useStateHandler }
