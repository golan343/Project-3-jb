import React, { Component, ChangeEvent } from "react";
import "./login.css";
import { UserModel } from "../../models/user-model";
import axios from "axios";
import { isUserLoggedIn } from '../auth/auth';
import { Redirect } from "react-router-dom";
import { NavBar } from "../navBar/navBar";
import { Config } from "../../config";


interface LoginInterface {
    user: UserModel;
    userSession: string;
}


export class Login extends Component<any, LoginInterface> {

    public constructor(props: any) {
        super(props);

        
        this.state = {
            user: new UserModel(),
            userSession: ""
            
        };

        
    }
   

    private setUsername = (args: ChangeEvent<HTMLInputElement>) => {
        const username = args.target.value;
        const user = { ...this.state.user };
        user.username = username;
        this.setState({ user });
    }

    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        const user = { ...this.state.user };
        user.password = password;
        this.setState({ user });
    }

    private loginUser = async () => {
        try{
            
            const response = await axios.post<UserModel>
            (Config.serverUrl + '/api/auth/login', this.state.user, {withCredentials: false});
            const user = response.data;
            alert('you are been Logged in : ' + user.firstName + " " + user.lastName);
            
            sessionStorage.setItem('user', JSON.stringify(user));

            this.props.history.push('/vacations');
            

        }
        catch(err){
            alert("Incorrect username or password");
        }
    }

    private goToRegister = () => {
        try{
            this.props.history.push('/register');

        }
        catch(err){
            alert(err.message);
        }
    }

    public render() {
        return(
            
            <div className="login">
                <NavBar />
                {isUserLoggedIn() ? <Redirect to="/vacations" exact/> : "" }
                <br/>
                
                <h2 className="text-center">Login: </h2>
                <br/>
                <form action="" className="text-center">
                <input type="text" placeholder="Username" onChange={this.setUsername}/>
                <br/>
                <input type="password" placeholder="Password" onChange={this.setPassword}/>
                <br/>
                <button type="button" onClick={this.loginUser}>Login</button>
                <span> | </span>
                <button type="button" onClick={this.goToRegister}>Register</button>
                </form>
            </div>
        );
    }
}