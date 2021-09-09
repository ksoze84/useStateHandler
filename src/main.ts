import React from "react"

class StateHandler<T> {
  
  public state? : T;
  public setState : React.Dispatch<React.SetStateAction<T>>

  constructor( sts : React.Dispatch<React.SetStateAction<T>> ) { this.setState = sts }

}


function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value : T) : [T, H] 
function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value? : T) : [T | undefined, H] 

function useStateHandler<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value: T) : [T, H]  {
  const [st, setSt] = React.useState<T>( initial_value );
  const [handler, ] = React.useState<H>( () => new handlerClass( setSt ) )  

  handler.state = st;

  return [ st, handler ]
}

/* 

 idea for maintain constructor initial state definition .

function initialize<H extends StateHandler<T>, T>( handlerClass : new ( s : React.Dispatch<React.SetStateAction<T>> ) => H, initial_value : T, sts : React.Dispatch<React.SetStateAction<T>> ) : H {
  const newInstance = new handlerClass( sts )

  if (initial_value === undefined && newInstance.state !== undefined )
    newInstance.setState(newInstance.state)

  return newInstance
}
 */

export { StateHandler, useStateHandler }
