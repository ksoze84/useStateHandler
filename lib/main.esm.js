import React from 'react';

class StateHandler {
    constructor(sts) { this.setState = sts; }
}
function useStateHandler(handlerClass, initial_value) {
    let inid = true;
    const [st, setSt] = React.useState();
    const [handler,] = React.useState(() => init(new handlerClass(setSt), initial_value, inid = false));
    if (inid)
        handler.state = st;
    return [st, handler];
}
const init = (handlerObject, initial_value) => {
    if (initial_value)
        handlerObject.state = initial_value instanceof Function ? initial_value() : initial_value;
    handlerObject.instanceCreated && handlerObject.instanceCreated();
    return handlerObject;
};

export { StateHandler, useStateHandler };
