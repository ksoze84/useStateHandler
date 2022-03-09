import React from 'react';

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
    const hs = React.useState(initial_value);
    const [handler,] = React.useState(() => initHandler(hs, handlerClass));
    handler.state = hs[0];
    return [handler.state, handler];
}

export { StateHandler, useStateHandler };
