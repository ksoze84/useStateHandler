import { useState } from 'react';

class StateHandler {
    constructor(sts) { this.setState = sts; }
}
function useStateHandler(handlerClass, initial_value) {
    const [st, setSt] = useState(initial_value);
    const [handler,] = useState(() => new handlerClass(setSt));
    handler.state = st;
    return [st, handler];
}

export { StateHandler, useStateHandler };
