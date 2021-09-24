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
    const [handler, setHandler] = React__default['default'].useState();
    if (!handler) {
        let new_handler = new handlerClass(setSt);
        setHandler(new_handler);
        if (new_handler.state)
            setSt(new_handler.state);
        else
            new_handler.state = st;
        new_handler.instanceCreated && new_handler.instanceCreated();
        return [(new_handler.state || st), new_handler];
    }
    else
        handler.state = st;
    return [st, handler];
}

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
