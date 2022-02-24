
const eventHooks = {
    stop: e => e.stopPropagation(),
    prevent: e => e.preventDefault(),
    self: e => e.target !== e.currentTarget,
    ctrl: e => !e.ctrlKey,
    shift: e => !e.shiftKey,
    alt: e => !e.altKey,
    meta: e => !e.metaKey,
    left: e => 'button' in e && e.button !== 0,
    middle: e => 'button' in e && e.button !== 1,
    right: e => 'button' in e && e.button !== 2,
};

export function createEvent(callee, modifiers) {
    return (event, ...args) => {
        for (let i = 0; i < modifiers.length; i++) {
            const guard = eventHooks[modifiers[i]];
            if (guard && guard(event, modifiers))
                return;
        }
        return callee(event, ...args);
    };
}
