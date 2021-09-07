'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

class StateHandler {
    constructor(sts) { this.setState = sts; }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = react.useState(initial_value);
    const [handler,] = react.useState(() => new handlerClass(setSt));
    handler.state = st;
    return [st, handler];
}

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
