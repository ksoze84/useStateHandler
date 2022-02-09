import React from 'react';

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
    const [st, setSt] = React.useState(initial_value);
    const [handler,] = React.useState(() => new handlerClass(setSt, st));
    handler['putState'](st);
    return [st, handler];
}

export { StateHandler, useStateHandler };
