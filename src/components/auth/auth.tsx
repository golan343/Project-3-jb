export const isUserLoggedIn = () => {
    return sessionStorage.getItem("user") != null;
}
export const userLogOut = () => {
    sessionStorage.removeItem("user");
    
}

export function isAdmin() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if(!user){
        return;
    }
    return user.isAdmin === 1 ? true : false;
}


