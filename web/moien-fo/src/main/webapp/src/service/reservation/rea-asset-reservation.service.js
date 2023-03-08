import BaseWsRequest from "../base/base-ws-request";
import BaseWsPath from "../base/base-ws-path";

/**
 * 
 */
export default class ReaAssetReservationService {
    constructor() {
		this.baseWsRequest = new BaseWsRequest();
		this.rootPath = BaseWsPath.USER_MAIL_PATH;
    }
    
    reservationUrl = BaseWsPath.PATH_RESERVATION;
    searchPath = BaseWsPath.PATH_SEARCH;
    settingsPath = BaseWsPath.PATH_SETTING;
    reaassetPath = BaseWsPath.REAASSET_PATH;
    ratingPath = BaseWsPath.PATH_RATING;

    createReservation(reaAssetReservationModel) {
        var url = this.reservationUrl;
        return this.baseWsRequest.post(reaAssetReservationModel, url);
    }

    updateReservation(reaAssetReservationModel, reservationId) {
        var url = this.reservationUrl + "/" + reservationId;
        return this.baseWsRequest.put(reaAssetReservationModel, url);
    }
    
    searchReservation(reaAssetReservationCriteriaDTO) {
        var url = this.reservationUrl + this.searchPath;
        return this.baseWsRequest.post(reaAssetReservationCriteriaDTO, url);
    }

    getReservationSettingByAssetId(assetId) {
        var url = this.reservationUrl + this.settingsPath + this.reaassetPath + '/' + assetId;
        return this.baseWsRequest.get(url);
    }

    getListReservationRating(assetId, reservationId) {
        var url = this.reservationUrl + this.ratingPath + "?assetId=" + assetId + "&reservationId=" + reservationId;
        return this.baseWsRequest.get(url);
    }

    createReservationSettings(reaAssetReservationSettingsModel) {
        var url = this.reservationUrl + this.settingsPath;
        return this.baseWsRequest.post(reaAssetReservationSettingsModel, url);
    }

    updateReservationSettings(reaAssetReservationSettingsModel, settingId) {
        var url = this.reservationUrl + this.settingsPath + "/" + settingId;
        return this.baseWsRequest.put(reaAssetReservationSettingsModel, url);
    }
}