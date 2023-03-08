/**
 * 
 */
export default class ReaAssetAppointmentCriteriaModel {

    /**
    *
    * @param {} userId ==> Long
    * @param {} wkfStatusIdList ==> Array
    * @param {} timeZoneId ==> String
    * @param {} viewForOwner ==> Boolean
    * @param {} startDate ==> Long
    * @param {} endDate ==> Long
    *
    */
    constructor(userId, wkfStatusIdList, timeZoneId, viewForOwner, startDate, endDate) {
        this.userId = userId;
        this.wkfStatusIdList = wkfStatusIdList;
        this.timeZoneId = timeZoneId;
        this.viewForOwner = viewForOwner;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}