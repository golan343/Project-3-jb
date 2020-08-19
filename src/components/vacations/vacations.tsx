import React, { Component } from "react";
import "./vacations.css";
import { isAdmin } from "../auth/auth";
import { FollowerModel } from "../../models/follower-model";
import axios from "axios";
import { VacationModel } from "../../models/vacation-model";
import { NavLink } from "react-router-dom";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { ActionType } from "../../redux/action-type";
import { socket } from "../../middleware/socket";
import { NavBar } from "../navBar/navBar";
import { Config } from "../../config";







interface VacationsInterface {
    vacations: VacationModel[];
    follower: FollowerModel;
    userFollowArr: any[];

}



export class Vacations extends Component<any, VacationsInterface> {
    private user = JSON.parse(sessionStorage.getItem("user"));

    public unsubscribeStore: Unsubscribe;

    constructor(props: any) {

        super(props);
        this.state = {
            vacations: store.getState().vacations,
            follower: new FollowerModel(),
            userFollowArr: store.getState().userFollowArr,
        };
        socket.on('update-vacation-from-server', vacations => {
            this.setState({vacations});
        });
        

    }

    public async componentDidMount() {

        
        if(store.getState().vacations.length > 0 ){
            return;
        }

            //vacations redux
            this.unsubscribeStore = store.subscribe(() => {
                const vacations = store.getState().vacations;
                this.setState({ vacations });
            });

        try{
            const response = await axios.get<VacationModel[]>(Config.serverUrl + '/api/vacations', {withCredentials: false});
            const vacations = response.data;
            const action = {type: ActionType.GetAllVacations, payload: vacations};
            store.dispatch(action);

            this.getFollowers();
            this.getFollowArr();

            

        }
        catch(err){
            alert(`Err Message: ${err.message}`);
        }
    }
    private getFollowArr = () => {
        try{
            this.state.vacations.forEach( async v => {
                const response = await axios.get<FollowerModel[]>(Config.serverUrl + "/api/get-follower-data/" + this.user.userId , {withCredentials: false});
                const data = response.data;
                data.find(d => { 
                    if(d.vacationId === v.vacationId){
                        const action = {type: ActionType.AddFollow, payload: v.vacationId};
                        store.dispatch(action);
                    }
                    return;
                });
            });

        }catch(err){
            alert(err.message);
        }
    }
    
    componentDidUpdate(){
        socket.on('update-vacation-from-server', vacations => {
            this.setState({vacations});
        });
        this.getFollowers();
        
    }


    private onMouseEnter = async(e) => {
        try{
            this.getFollowers();
            const vacationId = e.currentTarget.id;
            const follower = { ...this.state.follower }
            follower.vacationId = vacationId;
            follower.userId = this.user.userId;
        
            this.setState({follower});
            
        
            

        }
        catch(err){
            alert(err.message);
        }


    };
    private getFollowers = () => {
        try{
 
        this.state.vacations.map(async v => {
            const response = await axios.get(Config.serverUrl + "/api/get-followers/" + v.vacationId, {withCredentials: false});
            const followers = response.data;
            if(followers === undefined || null){
                return;
            }
            sessionStorage.setItem(`vacationId${v.vacationId}`, JSON.stringify(followers.length));
            })
        }catch(err){
            alert(err.message);
        }
    }


    private addFollow = async() => {
        try{
            console.log(this.state.follower);
            const vacationId = this.state.follower.vacationId;
            await axios.post<FollowerModel>(Config.serverUrl + "/api/insert-follow", this.state.follower, {withCredentials: false});
            const action = {type: ActionType.AddFollow, payload: vacationId};
            store.dispatch(action);
            this.getFollowArr();
            this.getFollowers();
            
        }catch(err){
            alert(err.message);
        }
    };

    private unFollow = async () => {
        try{
            const userId = this.user.userId;
            const vacationId = this.state.follower.vacationId;
            await axios.delete(Config.serverUrl + `/api/delete-follow/${userId}/${vacationId}`, {withCredentials: false});
            const action = {type: ActionType.DeleteFollow, payload: vacationId};
            store.dispatch(action);
            this.getFollowers();
        }catch(err){
            alert(err.message);
        }

    }

    private deleteVacation = async() => {
        const vacationId = this.state.follower.vacationId;
        const response = await axios.delete(Config.serverUrl + "/api/" + vacationId, {withCredentials: false});
        const action = {type: ActionType.DeleteVacation, payload: response};
            store.dispatch(action);
        sessionStorage.removeItem(`vacationId${vacationId}`);
        socket.emit('update-vacation-from-client', this);
        


    }

    public editVacation = () => {
        const vacationId = this.state.follower.vacationId;
        this.props.history.push(`/edit/${vacationId}`);
    }





    public render() {
            return(
                <div>
                    <NavBar />
                    <br/>
                  <h1>Vacations...</h1>
                  <br/>

                  {isAdmin() ? <div className="text-center"><button className="vacationBtn"><NavLink to="/insert"> Add Vacation </NavLink></button></div>: null}

                  <br/>

                    {this.state.vacations.map(v =>  <div id={v.vacationId.toString()} className="vacationDiv"  key={v.vacationId} onMouseEnter={this.onMouseEnter}>
                    {this.state.userFollowArr.includes(v.vacationId) && !isAdmin() ? (
                    <button onClick={this.unFollow} className="unfBtn">f</button> 
                    ) : "" }
                    {!this.state.userFollowArr.includes(v.vacationId) && !isAdmin() ?
                    (<button onClick={this.addFollow} className="fBtn">f</button>) : "" }

                    {isAdmin() ? <button className="xBtn" onClick={this.deleteVacation}>&#10008;</button> : ""}
                    <br/>
                    {isAdmin() ? <button className="editBtn" onClick={this.editVacation}>&#9998;</button> : ""}
                  <div><b>Description:</b> {v.description}
                  <br/>
                  <b>Price: </b>{v.price}</div>
                  <br/>
                    <div><img src={Config.serverUrl + "/uploads/" + v.imageFileName} alt="" /></div>
                  <br/>
                  <div><b>Start Time & Date: </b>{new Date(v.dateStart).toLocaleString()}
                  <br/>
                  <b>End Time & Date: </b>{new Date(v.dateEnd).toLocaleString()}</div>
                  <br/>

                    <div id="countDiv"  className="countFollowers">{sessionStorage.getItem(`vacationId${v.vacationId}`)}</div>
                  </div>)}
                </div>

            );

    };



}


