'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

class StateHandler {
    constructor(sts, state) {
        this.setState = sts;
        this.init = true;
        if (state)
            this.state = state;
        else if (this.state)
            this.setState(this.state);
    }
    putState(s) {
        if (this.init) {
            if (this.state)
                this.setState(this.state);
            else
                this.state = s;
            this.instanceCreated && this.instanceCreated();
            this.init = false;
        }
        else
            this.state = s;
    }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = React__default['default'].useState(initial_value);
    const [handler,] = React__default['default'].useState(() => new handlerClass(setSt, st));
    handler['putState'](st);
    return [handler.state, handler];
}

exports.StateHandler = StateHandler;
exports.useStateHandler = useStateHandler;
