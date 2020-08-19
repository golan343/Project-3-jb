export class VacationModel {
    public constructor(
        public vacationId?: number,
        public description?: string,
        public destination?: string,
        public imageFileName?: string,
        public dateStart?: Date,
        public dateEnd?: Date,
        public price?: string) { }
}
