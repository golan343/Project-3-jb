import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

export function reducer(currentState: AppState, action: Action): AppState {

    const newState = { ...currentState };
    switch (action.type) {
        case ActionType.GetAllVacations:
            newState.vacations = action.payload;    
            break;
            
        case ActionType.AddVacation:
            newState.vacations.push(action.payload);
            break;

        case ActionType.DeleteVacation:
            const index = newState.vacations.findIndex(v => v.vacationId === action.payload);
            newState.vacations.splice(index, 1);
            break;

        case ActionType.UpdateVacation:
            newState.vacations.push(action.payload);
            break;

        case ActionType.AddFollow:
            newState.userFollowArr.push(action.payload);
            break;  

        case ActionType.DeleteFollow:
            const FollowIndex = newState.userFollowArr.findIndex(f => f.vacationId === action.payload);
            newState.userFollowArr.splice(FollowIndex, 1);
            break;            
        
    }


    return newState;

}