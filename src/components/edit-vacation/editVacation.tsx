import React, { Component, ChangeEvent } from 'react'
import { VacationModel } from '../../models/vacation-model';
import "./editVacation.css";
import axios from "axios";
import { NavBar } from '../navBar/navBar';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { Config } from '../../config';


interface EditVacationState {
    vacation: VacationModel;
    vacations: VacationModel[];
    errors: { descriptionErr: string, destinationErr: string, dateStartErr: string, dateEndErr: string , priceErr: string };
    selectedFile: any;

}
export class EditVacation extends Component<any, EditVacationState> {

    public constructor(props: any) {
        super(props);

        this.state = {
            vacation: new VacationModel(),
            vacations: [],
            errors: { 
                descriptionErr: '*', 
                destinationErr: '*', 
                dateStartErr: '*', 
                dateEndErr: '*', 
                priceErr: '*' },
                selectedFile: null
        }
        
        
    }
    
    public async componentDidMount() {
        try{
        
        const vacationId = this.props.match.params.id;
        const vacation = { ...this.state.vacation};
        vacation.vacationId = vacationId;
        this.setState({vacation})

        const response = await axios.get<VacationModel[]>(Config.serverUrl + '/api/vacation/' + vacationId, {withCredentials: false});
        const vacations = response.data;
        
        this.setState({ vacations });


        }catch(err){
            alert(err.message)
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

        public insertVacation = async() => {
        try{
            console.log(this.state.vacation);
            const response = await axios.put<VacationModel>(Config.serverUrl + "/api/insert", this.state.vacation, {withCredentials: false});
            const updateVacation = response.data;
            console.log(updateVacation);
            const action = {type: ActionType.UpdateVacation, payload: updateVacation};
            store.dispatch(action);
            
        }catch(err){
            alert(err.message);
        }
    }

    render() {
        return (
            
            <div>
                <NavBar />
                <br/>
                <h1>Edit Vacation..</h1>
                {this.state.vacations.map(v => 
                <div key={v.vacationId} className="text-center">
                    <div className="divCard">
                        <h5>Vacation Information:</h5>
                        <br/>
                    <div><b>Description:</b> {v.description}
                    <br/>
                    <b>Price: </b>{v.price}
                    <br/>
                    <b>Destination:</b> {v.destination}
                    <br/>
                    <b>Start Time & Date: </b>{new Date(v.dateStart).toLocaleString()}
                    <br/>
                    <b>End Time & Date: </b>{new Date(v.dateEnd).toLocaleString()}</div>
                    <br/>
                    </div>
                </div>)}
                <form action=""  encType="multipart/form-data" className="text-center">
                    <div className="divForm">
                    <table>
                        <tbody>
                            <tr>
                                <td><label htmlFor="">Description: </label></td>
                                <td><input type="text"  onChange={this.setDescription}/></td>

                            </tr>
                            <tr>
                                <td><label htmlFor="">Destination: </label></td>
                                <td><input type="text"  onChange={this.setDestination}/></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="">Date Start: </label></td>
                                <td><input type="date"  onChange={this.setDateStart}/></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="">Date End: </label></td>
                                <td><input type="date" onChange={this.setDateEnd}/></td>
                            </tr>
                            <tr>
                                <td><label htmlFor="">Price: </label></td>
                                <td><input type="text" onChange={this.setPrice}/></td>
                            </tr>
                            
                        </tbody>
                        
                 </table>
                <br/>
                 <button disabled={!this.isFormLegal()} onClick={this.insertVacation}>Edit Vacation</button>
                 </div>
                </form>
            </div>
        )
    }
}
