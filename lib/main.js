'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class StateHandler {
    constructor(hs) {
        this.setState = hs[1];
    }
}
function initHandler(hs, handlerClass) {
    const handler = new handlerClass(hs);
    if (hs[0])
        handler.state = hs[0];
    else if (handler.state) {
        hs[1](handler.state);
        hs[0] = handler.state;
    }
    handler['instanceCreated'] && handler['instanceCreated']();
    return handler;
}
function useStateHandler(handlerClass, initial_value) {
    const hs = React__default['default'].useState(initial_value);
    const [handler,] = React__default['default'].useState(() => initHandler(hs, handlerClass));
    handler.state = hs[0];
    return [handler.state, handler];
}

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
