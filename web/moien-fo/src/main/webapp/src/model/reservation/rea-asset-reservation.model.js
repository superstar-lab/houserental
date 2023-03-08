import BaseEntityDTO from "../shared/bean/base-entity.model";

/**
 * 
 */
export default class ReaAssetReservationModel extends BaseEntityDTO {

    /**
     * 
     * @param {*} id 
     * @param {*} uid 
     * @param {*} uri 
     * @param {*} assetAmountPerNight 
     * @param {*} cleaningFee 
     * @param {*} sheetsFee 
     * @param {*} towelCharges 
     * @param {*} otherFee 
     * @param {*} nbDay 
     * @param {*} startDate 
     * @param {*} endDate 
     * @param {*} typeOfStay 
     * @param {*} peoBooked 
     * @param {*} asset 
     * @param {*} nbAdults 
     * @param {*} nbChildren 
     * @param {*} wkfStatus 
     * @param {*} cancelReason
     */
    constructor(
        id, uid, uri, assetAmountPerNight,
        cleaningFee, sheetsFee, towelCharges,
        otherFee, nbDay, startDate, endDate,
        typeOfStay, peoBooked, asset, nbAdults,
        nbChildren, wkfStatus, cancelReason) {
        super(id, uid, uri);
        this.assetAmountPerNight = assetAmountPerNight;
        this.cleaningFee = cleaningFee;
        this.sheetsFee = sheetsFee;
        this.towelCharges = towelCharges;
        this.otherFee = otherFee;
        this.nbDay = nbDay;
        this.startDate = startDate;
        this.endDate = endDate;
        this.typeOfStay = typeOfStay;
        this.peoBooked = peoBooked;
        this.asset = asset;
        this.nbAdults = nbAdults;
        this.nbChildren = nbChildren;
        this.wkfStatus = wkfStatus;
        this.cancelReason = cancelReason;
    }
}