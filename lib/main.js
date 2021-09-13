'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class StateHandler {
    constructor(sts) { this.setState = sts; }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = React__default['default'].useState(handlerClass.prototype.state || initial_value);
    const [handler,] = React__default['default'].useState(() => new handlerClass(setSt));
    handler.state = st;
    return [st, handler];
}

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
