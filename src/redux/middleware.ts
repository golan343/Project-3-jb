
export const saveToSessionStorage = store => next => action => {
    next(action);
    sessionStorage.setItem("AppState", JSON.stringify(store.getState()))
};