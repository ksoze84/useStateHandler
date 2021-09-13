import React from 'react';

class StateHandler {
    constructor(sts) { this.setState = sts; }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = React.useState(initial_value);
    const [handler,] = React.useState(() => new handlerClass(setSt));
    handler.state = st;
    return [st, handler];
}

export { StateHandler, useStateHandler };
