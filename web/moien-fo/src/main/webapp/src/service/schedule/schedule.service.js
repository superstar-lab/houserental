import BaseWsRequest from "../base/base-ws-request";
import BaseWsPath from "../base/base-ws-path";

class ScheduleService {

    constructor() {
        this.baseWsRequest = new BaseWsRequest();
        const baseWsPath = new BaseWsPath();

        this.schedulePath = baseWsPath.getSchedulePath();
        this.timePath = baseWsPath.getTimePath();
        this.getTimeTrackingUser = this.schedulePath + baseWsPath.getTimeTrackingUserPath();
        this.urlListAgentAppointment = this.schedulePath + baseWsPath.getListAgentAppointmentPath();
        this.urlCreateAppointment = this.schedulePath + BaseWsPath.PATH_CREATE_APPOINTMENT;
        this.listOwnerAppointmentPath = this.schedulePath + baseWsPath.getListOwnerAppointmentPath();
        this.urlListCustomerAppointment = this.schedulePath + baseWsPath.getListCustomerAppointmentPath();
        
        this.urlChangeAppointmentStatus = this.schedulePath + BaseWsPath.PATH_CHANGE_APPOINTMENT_STATUS;
        this.urlGetZoneAgent = BaseWsPath.PATH_ZONE_AGENT + BaseWsPath.REF_CODE_PATH;
    }

    getZoneAgent(postal) {
        var url = this.urlGetZoneAgent + "/" + postal;
        return this.baseWsRequest.get(url);
    }
    

    listTime() {
        var url = this.schedulePath + this.timePath;
        return this.baseWsRequest.get(url);
    }

    getTimeTrackingByUserWithTimeZone(secUserId, timeZoneId) {
        var url = this.getTimeTrackingUser + "/" + secUserId + "?timeZoneName=" + timeZoneId;
        return this.baseWsRequest.get(url);
    }

    getTimeTrackingUserByDateWithTimeZone(secUserId, date, timeZoneId) {
        var url = this.getTimeTrackingUser + "/" + secUserId + "/" + date + "?timeZoneName=" + timeZoneId;
        return this.baseWsRequest.get(url);
    }

    createAppointment(appointmentDTO) {
        var url = this.urlCreateAppointment;
        return this.baseWsRequest.post(appointmentDTO, url);
    }

    listAgentAppointment(appointmentDTO) {
        var url = this.urlListAgentAppointment;
        return this.baseWsRequest.post(appointmentDTO, url);
    }

    listOwnerAppointment(appointmentDTO) {
        var url = this.listOwnerAppointmentPath;
        return this.baseWsRequest.post(appointmentDTO, url);
    }

    changeAppointmentStatus(appointmentDTO) {
        return this.baseWsRequest.post(appointmentDTO, this.urlChangeAppointmentStatus);
    }

    listCustomerAppointment(appointmentDTO) {
        var url = this.urlListCustomerAppointment;
        return this.baseWsRequest.post(appointmentDTO, url);
    }
}

export default ScheduleService;
export { ScheduleService };