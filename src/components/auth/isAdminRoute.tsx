import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAdmin, isUserLoggedIn } from './auth';


const IsAdminRoute = ({component: Component, ...rest}) => {
    return (

    
        <Route {...rest} render={props => (
            isUserLoggedIn() && isAdmin()  ?
                <Component {...props} />
            : <Redirect to="/vacations" />
        )} />
    );
};

export default IsAdminRoute;