import BaseEntityDTO from "../shared/bean/base-entity.model";

/**
 * 
 */
export default class ReaAssetReservationSettingModel extends BaseEntityDTO {
    /**
     * 
     */
    constructor(id, uid, uri, assetId, instantBooking, suitableForChildren, suitableForBabies,
        animalsAllowed, smokingAllowed,eventsAllowed, additionalRules, minNight, maxNight, 
        frequencyAvailableParam, notificationArrivalParam, reservationTimeBetweenParam, 
        visibilityAvailableParam, emailCoManager, registrationNumber, listSettingPeriodConfig) {
        super(id, uid, uri);
        this.assetId = assetId;
        this.instantBooking = instantBooking;
        this.suitableForChildren = suitableForChildren;
        this.suitableForBabies = suitableForBabies;
        this.animalsAllowed = animalsAllowed;
        this.smokingAllowed = smokingAllowed;
        this.eventsAllowed = eventsAllowed;
        this.additionalRules = additionalRules;
        this.minNight = minNight;
        this.maxNight = maxNight;
        this.frequencyAvailableParam = frequencyAvailableParam;
        this.notificationArrivalParam = notificationArrivalParam;
        this.reservationTimeBetweenParam = reservationTimeBetweenParam;
        this.visibilityAvailableParam = visibilityAvailableParam;
        this.emailCoManager = emailCoManager;
        this.registrationNumber = registrationNumber;
        this.listSettingPeriodConfig = listSettingPeriodConfig;
    }

}