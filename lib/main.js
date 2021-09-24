'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class StateHandler {
    constructor(sts) { this.setState = sts; }
}
function useStateHandler(handlerClass, initial_value) {
    const [inid, setInid] = React__default['default'].useState(false);
    const [st, setSt] = React__default['default'].useState();
    const [handler,] = React__default['default'].useState(() => init(new handlerClass(setSt), initial_value, setInid));
    if (inid)
        handler.state = st;
    return [st, handler];
}
const init = (handlerObject, initial_value, setInid) => {
    if (initial_value)
        handlerObject.state = initial_value instanceof Function ? initial_value() : initial_value;
    handlerObject.instanceCreated && handlerObject.instanceCreated();
    setInid(true);
    return handlerObject;
};

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
