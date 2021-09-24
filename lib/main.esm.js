import React from 'react';

class StateHandler {
    constructor(sts) {
        this.setState = () => undefined;
        this.setState = sts;
    }
}
function useStateHandler(handlerClass, initial_value) {
    const [inid, setInid] = React.useState(false);
    const [st, setSt] = React.useState();
    const [handler,] = React.useState(() => init(new handlerClass(setSt), initial_value, setInid));
    if (inid)
        handler.state = st;
    return [st, handler];
}
const init = (handlerObject, initial_value, setInid) => {
    if (initial_value)
        handlerObject.state = initial_value instanceof Function ? initial_value() : initial_value;
    handlerObject.instanceCreated && handlerObject.instanceCreated();
    setInid(true);
    return handlerObject;
};

export { StateHandler, useStateHandler };
