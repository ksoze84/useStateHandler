import React from 'react';

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
        var _a;
        if (this.init) {
            if (this.state)
                this.setState(this.state);
            else
                this.state = s;
            (_a = this.instanceCreated) === null || _a === void 0 ? void 0 : _a.call(this);
            this.init = false;
        }
        else
            this.state = s;
    }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = React.useState(initial_value);
    const [handler,] = React.useState(() => new handlerClass(setSt, st));
    handler['putState'](st);
    return [st, handler];
}

export { StateHandler, useStateHandler };
