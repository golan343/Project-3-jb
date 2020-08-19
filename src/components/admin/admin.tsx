import React, { Component } from 'react'
import { Bar } from "react-chartjs-2";
import "./admin.css";
import { CharDataModel } from '../../models/charData-model';
import { store } from '../../redux/store';
import { VacationModel } from '../../models/vacation-model';
import { Unsubscribe } from 'redux';
import { ActionType } from '../../redux/action-type';
import axios from "axios";
import { NavBar } from '../navBar/navBar';
import { Config } from '../../config';



interface AdminState {
    charData: CharDataModel;
    data: [];
    vacations: VacationModel[];
}
export class Admin extends Component<any, AdminState> {
    public unsubscribeStore: Unsubscribe;
    
    constructor(props) {
        super(props);
        this.state = {
            charData: { },
            vacations: store.getState().vacations,
            data: []
        }
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
    
                const labels = [""];
                const data = [""];
                this.state.vacations.map(v => {
                    
                    const followerData = sessionStorage.getItem(`vacationId${v.vacationId}`);
                    if(followerData.toString() !== "0"){
                        labels.push(`vacation: ${v.vacationId}`);
                        data.push(followerData);
                    }
                });
                
            const charData = { ...this.state.charData };
            
            const datasets = [
            {
                label: 'Vacation followers',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data: data
            }
        ];
        
        charData.datasets = datasets;
        charData.labels = labels;
        

        this.setState({ charData })
    
    
            }
            catch(err){
                alert(`Err Message: ${err.message}`);
            }
    }


      
        render() {
          return (
            <div>
                <NavBar />
              <h2>Followers Vacations</h2>
              <Bar
                data={this.state.charData}
                width={100}
                height={100}
                options={{
                  maintainAspectRatio: false
                }}
              />
            </div>
          )};
            }
