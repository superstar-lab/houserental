export default class AssetAppointmentRequestModel {

    /**
     * 
     * @param {*} assetId 
     * @param {*} userId 
     * @param {*} ownerId 
     * @param {*} startDate 
     * @param {*} endDate 
     * @param {*} inventoryId 
     * @param {*} visitAddressTypeCode 
     * @param {*} address 
     * @param {*} timeZoneId 
     */
    constructor(assetId, userId, ownerId, startDate, endDate, inventoryId, visitAddressTypeCode,
        address, timeZoneId) {
        this.assetId = assetId;
        this.userId = userId;
        this.ownerId = ownerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.inventoryId = inventoryId;
        this.visitAddressTypeCode = visitAddressTypeCode;
        this.address = address;
        this.timeZoneId = timeZoneId;
    }
}