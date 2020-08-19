import React, { Component, ChangeEvent } from "react";
import "./register.css";
import axios from "axios";
import { UserModel } from "../../models/user-model";
import { NavBar } from "../navBar/navBar";
import { Config } from "../../config";

interface RegisterState {
    user: UserModel;
    errors: { fNameErr: string, lNameErr: string, usernameErr: string, passwordErr: string };

}
export class Register extends Component<any, RegisterState> {

    constructor(props: any) {
        super(props);
        this.state = {
            user: new UserModel(),
            errors: { fNameErr: '*', lNameErr: '*', usernameErr: '*', passwordErr: '*' }
        };

    }

  

    private setFirstName = (args: ChangeEvent<HTMLInputElement>) => {
        const fName = args.target.value;
        let fNameErr = "";

        if (fName === ""){
            fNameErr = 'Missing First Name';
        }
        else if(fName.length > 20) {
            fNameErr = "First Name too long!";
        }
            
        const user = { ...this.state.user };
        user.firstName = fName;
        this.setState({ user });

        const errors = { ...this.state.errors };
        errors.fNameErr = fNameErr;
        this.setState({ errors });
    }

    private setLastName = (args: ChangeEvent<HTMLInputElement>) => {
        const lName = args.target.value;
        let lNameErr = "";

        if(lName === ""){
            lNameErr = "Missing Last Name"
        }
        else if(lName.length > 30){
            lNameErr = "Last Name too long";
        }
        const user = { ...this.state.user };
        user.lastName = lName;
        this.setState({ user });
        
        const errors = { ...this.state.errors };
        errors.lNameErr = lNameErr;
        this.setState({ errors });
    }

    private setUsername = (args: ChangeEvent<HTMLInputElement>) => {
        const username = args.target.value;
        let usernameErr = "";
        if(username === ""){
            usernameErr = "Missing username";
        }
        else if(username.length > 20){
            usernameErr = "username too long";
        }
        const user = { ...this.state.user };
        user.username = username;
        this.setState({ user });

        const errors = { ...this.state.errors };
        errors.usernameErr = usernameErr;
        this.setState({ errors });
    }

    private setPassword = (args: ChangeEvent<HTMLInputElement>) => {
        const password = args.target.value;
        let passwordErr = "";
        if(password === ""){
            passwordErr = "Missing password";
        }
        else if(password.length > 40){
            passwordErr = "password too long";
        }

        const user = { ...this.state.user };
        user.password = password;
        this.setState({ user });

        const errors = { ...this.state.errors };
        errors.passwordErr = passwordErr;
        this.setState({ errors });
        
    }

    private isFormLegal = () => {
        for(const prop in this.state.errors) {
            if(this.state.errors[prop].toString() !== ""){
                return false;
            }
        }
        return true;
    }

    private addUser = async () => {
        try{
            const response = await axios.post<UserModel>
            (Config.serverUrl + '/api/auth/register', this.state.user, {withCredentials: false});
            const user = response.data;
            if(user.username === undefined){
                alert('username already exist')
                return;
            }
            else{
            alert('you are been registered: ' + user.firstName + " " + user.lastName);

            sessionStorage.setItem("user", JSON.stringify(user));

            this.props.history.push('/login');

            }

        }
        catch(err){
            console.log(err.message);
            alert(err.message);
        }
    }
    public render() {
        return(
            <div className="register">
                <NavBar />
                <br/>
                <h2 className="text-center">Register</h2>
                <br/><br/>

                <form action="" className="text-center">

                <input type="text" placeholder="First Name" onChange={this.setFirstName}/>
                <br/>
                <input type="text" placeholder="Last Name" onChange={this.setLastName}/>
                <br/>
                <input type="text" placeholder="Username" onChange={this.setUsername}/>
                <br/>
                <input type="password" placeholder="Password" onChange={this.setPassword}/>
                <br/>
                <br/>
                <button type="button" disabled={!this.isFormLegal()} onClick={this.addUser}>Register</button>

                </form>
                
            </div>
        );
    }
}