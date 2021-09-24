import React from 'react';

class StateHandler {
    constructor(sts) { this.setState = sts; }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = React.useState(initial_value);
    const [handler, setHandler] = React.useState();
    if (!handler) {
        let new_handler = new handlerClass(setSt);
        setHandler(new_handler);
        setSt(new_handler.state || st);
        new_handler.instanceCreated && new_handler.instanceCreated();
        return [(new_handler.state || st), new_handler];
    }
    else
        handler.state = st;
    return [st, handler];
}
function useHandlerObject(handlerGenerator, initial_value) {
    const [st, setSt] = React.useState(initial_value);
    const [handler, setHandler] = React.useState();
    if (!handler) {
        let new_handler = handlerGenerator(setSt);
        setHandler(new_handler);
        setSt(new_handler.state || st);
        new_handler.instanceCreated && new_handler.instanceCreated();
        return [(new_handler.state || st), new_handler];
    }
    else
        handler.state = st;
    return [st, handler];
}

export { StateHandler, useHandlerObject, useStateHandler };
