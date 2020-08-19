import React, { Component, ChangeEvent } from 'react'
import { VacationModel } from '../../models/vacation-model';
import "./addVacation.css";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { NavBar } from '../navBar/navBar';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { Config } from "../../config";


interface AddVacationState {
    vacation: VacationModel;
    errors: { descriptionErr: string, destinationErr: string, dateStartErr: string, dateEndErr: string , priceErr: string };
    selectedFile: any;

}
export class AddVacation extends Component<any, AddVacationState> {
    public constructor(props: any) {
        super(props);

        this.state = {
            vacation: new VacationModel(),
            errors: { 
                descriptionErr: '*', 
                destinationErr: '*', 
                dateStartErr: '*', 
                dateEndErr: '*', 
                priceErr: '*' },
                selectedFile: null
        }
        
    }
    
    private setDescription = (args: ChangeEvent<HTMLInputElement>) => {
        const description = args.target.value;
        let descriptionErr = "";
        if(description === ""){
            descriptionErr = "Missing Description";
        }
        else if(description.length > 1000) {
            descriptionErr = "Description too long";
        }

        const vacation = { ...this.state.vacation };
        vacation.description = description;
        this.setState({ vacation });

        const errors = { ...this.state.errors };
        errors.descriptionErr = descriptionErr;
        this.setState({ errors });
    }

    private setDestination = (args: ChangeEvent<HTMLInputElement>) => {
        const destination = args.target.value;
        let destinationErr = "";
        if(destination === ""){
            destinationErr = "Missing Destination";
        }
        else if(destination.length > 50) {
            destinationErr = "Destination too long";
        }

        const vacation = { ...this.state.vacation };
        vacation.destination = destination;
        this.setState({ vacation });

        const errors = { ...this.state.errors };
        errors.destinationErr = destinationErr;
        this.setState({ errors });
    }

    private setDateStart = (args: ChangeEvent<HTMLInputElement>) => {
        let dateStart = args.target.value;
        let dateStartErr = "";
        if(dateStart === ""){
            dateStartErr = "Missing Description";
        }
        // else if(dateStart < new Date().toLocaleString()) {
        //     dateStartErr = "start date must be valid date not in the past";
        // }

        const vacation = { ...this.state.vacation };
        const dateStrToDate = new Date(dateStart);
        vacation.dateStart = dateStrToDate;
        this.setState({ vacation });

        const errors = { ...this.state.errors };
        errors.dateStartErr = dateStartErr;
        this.setState({ errors });
    }

    private setDateEnd = (args: ChangeEvent<HTMLInputElement>) => {
        const dateEnd = args.target.value;
        let dateEndErr = "";
        if(dateEnd === ""){
            dateEndErr = "Missing Date End";
        }
        // else if(dateEnd < new Date().toLocaleString()) {
        //     dateEndErr = "End Date cant be on the past";
        // }

        const vacation = { ...this.state.vacation };
        const dateStrToDate = new Date(dateEnd);
        vacation.dateEnd = dateStrToDate;
        this.setState({ vacation });

        const errors = { ...this.state.errors };
        errors.dateEndErr = dateEndErr;
        this.setState({ errors });
    }

    private setPrice = (args: ChangeEvent<HTMLInputElement>) => {
        const price = args.target.value;
        let priceErr = "";
        if(price === ""){
            priceErr = "Missing Price";
        }
        else if(price.length > 6) {
            priceErr = "Price too long";
        }

        const vacation = { ...this.state.vacation };
        vacation.price = price;
        this.setState({ vacation });

        const errors = { ...this.state.errors };
        errors.priceErr = priceErr;
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

        private insertVacation = async() => {
        try{
            
            const response = await axios.post<VacationModel>(Config.serverUrl + "/api/insert", this.state.vacation, {withCredentials: false});
            const addedVacation = response.data;
            const action = {type: ActionType.AddVacation, payload: addedVacation};
            store.dispatch(action);
            this.props.history.goBack();
            
        }catch(err){
            alert(err.message);
        }
    }

    private setImage = async(args: ChangeEvent<HTMLInputElement>) => {
        try{
            const image = args.target.files[0];
            const fd = new FormData();
            const imageName = image.name;
            const extension = imageName.substr(imageName.lastIndexOf("."));
            const imageNewName = uuid() + extension;
            //----------set name on state
            const vacation = { ...this.state.vacation };
            vacation.imageFileName = imageNewName;
            this.setState({ vacation });
            //-----post file to server
            fd.append('image', image, imageNewName);
            await axios.post(Config.serverUrl + '/upload-image', fd)
        }catch(err){
            alert(err.message);
        }
    }

    render() {
        return (
            <div>
                <NavBar />
                <br/>
                <h1>Add Vacation..</h1>
                
                <form action="" encType="multipart/form-data" className="text-center">
                    <div className="divForm">
                    <table>
                        <tbody>
                            <tr>
                                <td><label htmlFor="">Description: </label></td>
                                <td><input type="text" placeholder="Description" onChange={this.setDescription}/></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="">Destination: </label></td>
                                <td><input type="text" placeholder="Destination" onChange={this.setDestination}/></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="">Date Start: </label></td>
                                <td><input type="date" placeholder="Date Start" onChange={this.setDateStart}/></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="">Date End: </label></td>
                                <td><input type="date" onChange={this.setDateEnd}/></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="">Price: </label></td>
                                <td><input type="text" onChange={this.setPrice}/></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="">Upload Image: </label></td>
                                <td><input type="file" name="userImage" required accept=".jpg" onChange={this.setImage}/></td>
                            </tr>
                            
                        </tbody>
                        
                 </table>
                <br/>
                 <button disabled={!this.isFormLegal()} onClick={this.insertVacation}>Add Vacation</button>
                 </div>
                </form>
            </div>
        )
    }
}
