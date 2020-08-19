import { FollowerModel } from './../models/follower-model';
import { VacationModel } from './../models/vacation-model';
export class AppState {
    public vacations: VacationModel[];
    public userFollowArr: any[];
    public follower: FollowerModel;

    public constructor() {
        this.vacations = [];
        this.userFollowArr = [];
        this.follower = new FollowerModel();
    }
}