'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

const storage = new Map();
const listeners = new WeakMap();
/**
 * Abstract class representing a state handler. This class should be extended to create a state handler.  
 * The extended Class must be passed to the useStateHandler hook to work with React.  
 * The hook useStateHandler will maintain only one instance of the class per application at a time.  
 * The instance of this Class will be only one in the application, and will be shared between all components that use the [useStateHandler Hook, Class] pair saving its state.  
 * Mounting and unmounting components will not necesarily affect the instance nor its state.  
 * When is created a new instance of the class, the instanceCreated() method is called.  
 * When the instance is deleted, the instanceDeleted() method is called.  
 * To delete the instance, use the destroyInstance() method on [last] component unmount.
 *
 * @template T - The type of the state.
 */
class StateHandler {
    /**
     * Constructs a new instance of the StateHandler class.  
     * Prefer use the method instanceCreated() instead of the constructor.  
     * Constructor code of the class and its inherited instances constructors are not part of the mounting/unmounting logic of react. Listeners may or may not be ready.  
     *
     * @param state - The initial state.
     */
    constructor(state) {
        /**
         * Sets the state and notifies all listeners.
         *
         * @param value - The new state or a function that returns the new state based on the previous state.
         */
        this.setState = (value) => {
            var _a;
            this.state = value instanceof Function ? value(this.state) : value;
            (_a = listeners.get(this)) === null || _a === void 0 ? void 0 : _a.forEach(l => l(value));
        };
        /**
         * Destroys the instance if there are no active listeners.  
         * Use this method to delete the instance **on the unmount callback** of the component using it.
         *
         * Logs a warn if there are active listeners and the instance is not deleted.
         */
        this.destroyInstance = () => {
            var _a, _b, _c;
            if (((_b = (_a = listeners.get(this)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) === 0) {
                storage.delete(this.constructor.name);
                (_c = this.instanceDeleted) === null || _c === void 0 ? void 0 : _c.call(this);
            }
            else {
                console.warn(`There are ${this.constructor.name} listeners active (unmounted components). Instance will not be deleted`);
            }
        };
        if (!this.state && state)
            this.state = state;
    }
}
function initHandler(handlerClass) {
    if (!storage.has(handlerClass.name))
        storage.set(handlerClass.name, new handlerClass());
    return storage.get(handlerClass.name);
}
/**
 *
 * Hook to manage state with a handler class. The handler class must extend `StateHandler<T>`.  
 * This hook will maintain only one instance of the class per application at a time and will be shared between all components that use the [useStateHandler Hook, Class] pair, saving its state.  
 * Do not modify the handler state directly. Use the handler setState method instead.  
 * Unmounting components will not necessarily affect the instance nor its state.
 *
 * @template T - The type of the state.
 * @template H - The type of the handler class, which extends `StateHandler<T>`
 *
 * @param handlerClass - The class of the handler to be used for managing state.  
 * @param initial_value - Optional. The initial value of the state, which can be a value of type `T` or a function that returns a value of type `T`.
 *
 * @returns A readonly tuple containing the current state and the handler instance.
 */
function useStateHandler(handlerClass, initial_value) {
    const [, setHs] = React__default["default"].useState(initial_value);
    const handler = initHandler(handlerClass);
    React.useEffect(() => mountLogic(setHs, handlerClass), []);
    return [handler.state, handler];
}
function mountLogic(dispatcher, handlerClass) {
    var _a, _b;
    const handler = initHandler(handlerClass);
    if (!listeners.has(handler)) {
        listeners.set(handler, [dispatcher]);
        (_a = handler["instanceCreated"]) === null || _a === void 0 ? void 0 : _a.call(handler);
    }
    else
        (_b = listeners.get(handler)) === null || _b === void 0 ? void 0 : _b.push(dispatcher);
    return () => unmountLogic(dispatcher, handler);
}
function unmountLogic(dispatcher, handler) {
    var _a, _b, _c, _d;
    if (((_b = (_a = listeners.get(handler)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0)
        listeners.set(handler, (_d = (_c = listeners.get(handler)) === null || _c === void 0 ? void 0 : _c.filter(l => l !== dispatcher)) !== null && _d !== void 0 ? _d : []);
}

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
