import React, { useEffect } from "react";
const store = new Map();
const setDistPatcher = (handler) => {
    return (val) => {
        var _a;
        if (store.has(handler) && store.get(handler).handler) {
            if (val instanceof Function)
                store.get(handler).handler.state = val((_a = store.get(handler)) === null || _a === void 0 ? void 0 : _a.handler.state);
            else
                store.get(handler).handler.state = val;
            store.get(handler).listeners.forEach(l => l(val));
        }
    };
};
class StateHandler {
    constructor(hs) {
        this.setState = hs[1];
    }
}
class StateHandlerState extends StateHandler {
}
function initHandler(hs, handlerClass) {
    var _a, _b, _c;
    if (store.has(handlerClass.name)) {
        (_a = store.get(handlerClass.name)) === null || _a === void 0 ? void 0 : _a.listeners.push(hs[1]);
        return (_b = store.get(handlerClass.name)) === null || _b === void 0 ? void 0 : _b.handler;
    }
    else {
        const handler = new handlerClass([null, setDistPatcher(handlerClass.name)]);
        store.set(handlerClass.name, { handler: handler, listeners: [hs[1]] });
        if (hs[0])
            handler.state = hs[0];
        else if (handler.state)
            hs[1](handler.state);
        (_c = handler['instanceCreated']) === null || _c === void 0 ? void 0 : _c.call(handler);
        return handler;
    }
}
function useStateHandler(handlerClass, initial_value) {
    const hs = React.useState(initial_value);
    const [handler,] = React.useState(() => initHandler(hs, handlerClass));
    useEffect(() => () => { store.get(handlerClass.name).listeners = store.get(handlerClass.name).listeners.filter(l => l !== hs[1]); }, []);
    return [handler.state, handler];
}
export { StateHandler, useStateHandler };
//# sourceMappingURL=main.js.map