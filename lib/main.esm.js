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
        if (new_handler.state)
            setSt(new_handler.state);
        else
            new_handler.state = st;
        new_handler.instanceCreated && new_handler.instanceCreated();
        return [(new_handler.state || st), new_handler];
    }
    else
        handler.state = st;
    return [st, handler];
}

export { StateHandler, useStateHandler };
