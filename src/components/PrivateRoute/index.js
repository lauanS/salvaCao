import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Context } from "../../context/authContext";

const PrivateRoute = ({component: Component, ...rest}) => {  
    const { isAuthenticated } = useContext(Context);  
    return (
        <Route {...rest} render={props => (
        isAuthenticated() ?
            <Component {...props} />
        : <Redirect to="/login" />
        )} />
    );    
};

export default PrivateRoute;