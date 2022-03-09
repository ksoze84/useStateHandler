'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class StateHandler {
    constructor(hs) {
        this.setState = hs[1];
        if (hs[0])
            this.state = hs[0];
        else if (this.state)
            hs[0] = this.state;
        this.instanceCreated && this.instanceCreated();
    }
}
function useStateHandler(handlerClass, initial_value) {
    const hs = React__default['default'].useState(initial_value);
    const [handler,] = React__default['default'].useState(() => new handlerClass(hs));
    handler.state = hs[0];
    return [hs[0], handler];
}

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
