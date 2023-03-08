import BaseEntityDTO from "../shared/bean/base-entity.model";

/**
 * 
 */
export default class ReservationSettingPeriodConfigModel extends BaseEntityDTO {
    /**
     * 
     */
    constructor(id, uid, uri, startDate, endDate, minNight, maxNight) {
        super(id, uid, uri);
        this.startDate = startDate;
        this.endDate = endDate;
        this.minNight = minNight;
        this.maxNight = maxNight;
    }

}