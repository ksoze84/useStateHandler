import React from 'react';

class StateHandler {
    constructor(hs) {
        this.setState = hs[1];
        if (hs[0])
            this.state = hs[0];
        else if (this.state)
            hs[0] = (this.state);
        this.instanceCreated && this.instanceCreated();
    }
}
function useStateHandler(handlerClass, initial_value) {
    const hs = React.useState(initial_value);
    const [handler,] = React.useState(() => new handlerClass(hs));
    handler.state = hs[0];
    return [handler.state, handler];
}

export { StateHandler, useStateHandler };
