'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class StateHandler {
    constructor(sts, state) {
        this.setState = sts;
        this.init = false;
        if (state)
            this.state = state;
        this.instanceCreated && this.instanceCreated();
    }
    putState(s) {
        if (this.init) {
            this.state = s;
        }
        this.init = true;
    }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = React__default['default'].useState(initial_value);
    const [handler,] = React__default['default'].useState(() => new handlerClass(setSt, st));
    handler['putState'](st);
    return [st, handler];
}

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
