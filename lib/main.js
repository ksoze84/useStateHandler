'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/*
MIT License

Copyright (c) [2024] [Felipe Rodriguez Herrera]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
const storage = new Map();
/**
 * Abstract class representing a state handler. This class should be extended to create a state handler.
 * The extended Class must be passed to the useStateHandler hook to work with React.
 * The hook useStateHandler will maintain only one instance of the class per application at a time.
 * The instance of this Class will be only one in the application, and will be shared between all components that use the [useStateHandler Hook, Class] pair saving its state.
 * Mounting and unmounting components will not necesarily affect the instance nor its state.
 * When is created a new instance of the class, the instanceCreated() method is called.
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
         * Configuration object for the state handler.
         *
         * @property {boolean} merge - Indicates whether to merge the state.
         * @property {boolean} destroyOnUnmount - Indicates whether to destroy the state on unmount.
         * @protected
         * @readonly
         */
        this._handlerConfig = { merge: false, destroyOnUnmount: false };
        /**
         * Sets the state and notifies all listeners.
         *
         * @param value - The new state or a function that returns the new state based on the previous state.
         */
        this.setState = (value) => {
            var _a, _b;
            const newState = value instanceof Function ? value(this.state) : value;
            this.state = (this._handlerConfig.merge ? Object.assign(Object.assign({}, this.state), newState) : newState);
            (_b = (_a = storage.get(this.constructor.name)) === null || _a === void 0 ? void 0 : _a.listeners) === null || _b === void 0 ? void 0 : _b.forEach(l => l(this.state));
        };
        /**
         * Destroys the instance if there are no active listeners.
         * Use this method to delete the instance **on the unmount callback** of the component using it.
         * Logs a warn if there are active listeners and the instance is not deleted.
         */
        this.destroyInstance = () => {
            var _a, _b, _c, _d;
            if (((_c = (_b = (_a = storage.get(this.constructor.name)) === null || _a === void 0 ? void 0 : _a.listeners) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) === 0) {
                storage.delete(this.constructor.name);
                (_d = this.instanceDeleted) === null || _d === void 0 ? void 0 : _d.call(this);
            }
        };
        if (!this.state && state)
            this.state = state;
    }
}
/**
 * Gets the instance of the handler class.
 * This is not a hook. It will not trigger re-renders when used in components.
 *
 * @template T - The type of the state.
 * @template H - The type of the StateHandler class.
 * @param handlerClass - The constructor of the StateHandler class.
 * @returns The instance of the StateHandler class.
 */
function getHandler(handlerClass) {
    var _a;
    if (!storage.has(handlerClass.name))
        storage.set(handlerClass.name, { handler: new handlerClass() });
    return (_a = storage.get(handlerClass.name)) === null || _a === void 0 ? void 0 : _a.handler;
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
    var _a;
    const handler = getHandler(handlerClass);
    const [state, setState] = React__default["default"].useState((_a = (initial_value instanceof Function ? initial_value() : initial_value)) !== null && _a !== void 0 ? _a : handler.state);
    React.useEffect(() => mountLogic(setState, handlerClass), []);
    return [state, handler];
}
function mountLogic(dispatcher, handlerClass) {
    var _a, _b, _c;
    const handler = getHandler(handlerClass);
    if (!((_a = storage.get(handler.constructor.name)) === null || _a === void 0 ? void 0 : _a.listeners)) {
        storage.get(handler.constructor.name).listeners = [dispatcher];
        (_b = handler["instanceCreated"]) === null || _b === void 0 ? void 0 : _b.call(handler);
    }
    else
        (_c = storage.get(handler.constructor.name)) === null || _c === void 0 ? void 0 : _c.listeners.push(dispatcher);
    return () => unmountLogic(dispatcher, handler);
}
function unmountLogic(dispatcher, handler) {
    var _a, _b, _c, _d, _e, _f;
    if (((_c = (_b = (_a = storage.get(handler.constructor.name)) === null || _a === void 0 ? void 0 : _a.listeners) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0) {
        storage.get(handler.constructor.name).listeners = (_f = (_e = (_d = storage.get(handler.constructor.name)) === null || _d === void 0 ? void 0 : _d.listeners) === null || _e === void 0 ? void 0 : _e.filter(l => l !== dispatcher)) !== null && _f !== void 0 ? _f : [];
        if (handler["_handlerConfig"].destroyOnUnmount)
            handler.destroyInstance();
    }
}

exports.StateHandler = StateHandler;
exports.getHandler = getHandler;
exports.useStateHandler = useStateHandler;
