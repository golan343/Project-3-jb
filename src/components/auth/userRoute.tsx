import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isUserLoggedIn } from './auth';


const UserRoute = ({component: Component, ...rest}) => {
    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isUserLoggedIn() ?
                <Component {...props} />
            : <Redirect to="/login" />
        )} />
    );
};

export default UserRoute;