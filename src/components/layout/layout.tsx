import React, { Component } from "react";
import "./layout.css";
import { Login } from "../login/login";
import { Vacations } from "../vacations/vacations";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Register } from "../register/register";
import { PageNotFound } from "../page-not-found/page-not-found";
import UserRoute from "../auth/userRoute";
import NotUserRoute from "../auth/notUserRoute";
import IsAdminRoute from "../auth/isAdminRoute";
import { Logout } from "../logout/logout";
import { AddVacation } from "../add-vacation/addVacation";
import { EditVacation } from "../edit-vacation/editVacation";
import { Admin } from "../admin/admin";








export class Layout extends Component {
    


    
    public render() {
            return(
                <div className="layout">
                    <BrowserRouter>  
  
                    <Switch>
                        <IsAdminRoute path="/admin" component={Admin} exact />
                        <IsAdminRoute path="/edit/:id" component={EditVacation} exact />
                        <IsAdminRoute path="/insert" component={AddVacation} exact />
                        <NotUserRoute path='/login' component={Login} exact />
                        <NotUserRoute path="/register" component={Register} exact />
                        <UserRoute path="/vacations" component={Vacations} exact />
                        <UserRoute path="/logout" component={Logout} exact />
                        <Redirect from="/" to="/vacations" exact/>
                        <Route component={PageNotFound} exact />
                    </Switch>

                    </BrowserRouter>
                </div>
            );
            
        }
  
}