import React from "react";
import { HandlerSetter, checkDeleteInstance } from "./main";

/**
 * @abstract
 * @class StateHandler
 * @template T
 * @description Abstract class representing a state handler.
 */
export abstract class StateHandler<T> {

  /**
   * @public
   * @type {T}
   * @description The current state of the handler.
   */
  public state?: T;

  /**
  * @public
  * @type {React.Dispatch<React.SetStateAction<T>>}
  * @description A function to update the state.
  */
  public readonly setState: React.Dispatch<React.SetStateAction<T>>;

  /**
   * @protected
   * @type {(() => void)}
   * @description An optional function that is called when the handler is created.
   */
  protected instanceCreated?: () => void;

  /**
   * @constructor
   * @param {HandlerSetter<T>} hs - The handler setter.
   * @description Initializes a new state handler instance.
   */
  constructor(hs: HandlerSetter<T>) {
    this.setState = hs[1];
    if (hs[0]) this.state = hs[0];
  }

  /**
   * Deletes the instance. This method must be called when the related component is unmounted.
   * @description Calls the checkDeleteInstance function to determine if the instance should be deleted.
   */
  public deleteInstanceOnUnmount() {
    checkDeleteInstance(this.constructor.name);
  }
}
