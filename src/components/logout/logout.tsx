import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { userLogOut } from "../auth/auth";



export class Logout extends Component {
   
    componentDidMount() {
       userLogOut();
    }

    public render() {
        return(
                <Redirect to="/login" />
        );
    }
}