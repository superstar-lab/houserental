import { HttpAPI } from "../../provider/httpservice";
import HttpService from "../../basehttpservice/httpservice";

/**
 * 
 */
export class ReaAssetAppointmentService {

    getReaAssetAppointmentById(appointmentId, deviceTimeZone) {
        var url = HttpAPI.PATH_APPOINTMENT + "/" + appointmentId + "?timeZoneName=" + deviceTimeZone;
        return new HttpService().get(url);
    }

    listAppointmentUserVisitRequest(reaAssetAppointmentCriteriaModel) {
        var url = HttpAPI.PATH_APPOINTMENT + HttpAPI.PATH_VISIT_REQUEST;
        return new HttpService().post(reaAssetAppointmentCriteriaModel, url);
    }

    /**
     * 
     * @param {*} secUserId 
     * @param {*} reaAssetAppointmentCriteriaModel 
     * @returns 
     */
    listUserAppointment(secUserId, reaAssetAppointmentCriteriaModel) {
        var url = HttpAPI.PATH_APPOINTMENT + HttpAPI.USER_PATH + "/" + secUserId;
        return new HttpService().post(reaAssetAppointmentCriteriaModel, url);
    }

    countUserAppointment(appointmentCriteriaModel) {
        var url = HttpAPI.PATH_APPOINTMENT + HttpAPI.COUNT_PATH;
        return new HttpService().post(appointmentCriteriaModel, url);
    }

    hasAppointment(userId, assetId, zoneIdName) {
        var url = HttpAPI.PATH_APPOINTMENT + HttpAPI.PATH_HASAPPOINTMENT + "?userId=" + userId + "&assetId=" + assetId + "&timeZoneName=" + zoneIdName;
        return new HttpService().get(url);
    }

    /**
     * 
     * @param {*} assetAppointmentRequestModel 
     * @returns 
     */
    createAppointment(assetAppointmentRequestModel) {
        var url = HttpAPI.PATH_APPOINTMENT;
        return new HttpService().post(assetAppointmentRequestModel, url);
    }

    updateAppointment(appointmentId, reaAssetAppointmentDTO) {
        var url = HttpAPI.PATH_APPOINTMENT + "/" + appointmentId;
        return new HttpService().put(reaAssetAppointmentDTO, url);
    }

    updateAppointmentByOwner(appointmentId, reaAssetAppointmentDTO) {
        var url = HttpAPI.PATH_APPOINTMENT + "/" + appointmentId + HttpAPI.OWNER_PATH;
        return new HttpService().put(reaAssetAppointmentDTO, url);
    }

    tenentAcceptedModification(appointmentId, reaAssetAppointmentDTO) {
        var url = HttpAPI.PATH_APPOINTMENT + "/" + appointmentId + "/tenentaccepted";
        return new HttpService().put(reaAssetAppointmentDTO, url);
    }

    proposeLeaseService(appointmentId) {
        var url = HttpAPI.PATH_APPOINTMENT+ "/" + appointmentId + HttpAPI.PATH_PROPOSE_LEASE;
        return new HttpService().post({}, url);
    }

}