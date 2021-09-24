'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class StateHandler {
    constructor(sts) { this.setState = sts; }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = React__default['default'].useState(initial_value);
    const [handler,] = React__default['default'].useState(() => new handlerClass(setSt));
    handler.state = st;
    return [st, handler];
}
function useHandlerObject(handlerGenerator, initial_value) {
    const [st, setSt] = React__default['default'].useState(initial_value);
    const [handler, setHandler] = React__default['default'].useState();
    if (!handler) {
        let new_handler = handlerGenerator(setSt);
        setHandler(new_handler);
        setSt(new_handler.state || st);
        return [(new_handler.state || st), new_handler];
    }
    else
        handler.state = st;
    return [st, handler];
}

exports.StateHandler = StateHandler;
exports.useHandlerObject = useHandlerObject;
exports.useStateHandler = useStateHandler;
