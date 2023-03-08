import React from 'react';
import { withRouter } from 'react-router-dom';
import { Calendar, Badge, Whisper, Popover, Modal } from 'rsuite';
import styles from './request-visit.page.css';
import Helper from '../../../helper/helper';
import moment from 'moment';
import ReaAssetAppointmentDTO from '../../../model/asset/reaasset-appointment.model';
import ScheduleService from '../../../service/schedule/schedule.service';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import theme from '../../../theme/theme';
import { t } from 'localizify';
import LocalStorageHelper from '../../../helper/local.storage.helper';

const dayOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const deviceTimeZone = moment.tz.guess();
const today = new Date();

class RequestVisitPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          timeTracking: {},
          listTimeTrackingSegment: [],
          listAppointmentThisMonth: [],
          listAvailableTimeThisMonth: {},
          isModalVisable: false,
          reaAssetDTO: {},
          personInCharge: '',
          appointment: {},
          appointmentDate: null,
          loading: false
        }
        this.secUser = null;
        this.reaAssetDTO = null;
        this.selectedDate = null;
        this.selectedMonth = null;
        this.timeTracking = {};
        this.listTimeTrackingSegment = []
        this.listAppointmentThisMonth = [];
        this.listAvailableTimeThisMonth = {}
    }

    componentDidMount() {
      this.reaAssetDTO = this.props.location.reaAssetDTO;
      this.secUser = LocalStorageHelper.getCurrentUser();
      this.setState({reaAssetDTO: this.reaAssetDTO});
      this.selectedDate = today.toISOString().split('T')[0];
      this.selectedMonth = today.toISOString().split('T')[0];
      if (this.reaAssetDTO && this.reaAssetDTO.personInCharge) {
        this.listAppointmentThisMonth = []
        this.getTimeTrackingUser(this.reaAssetDTO.personInCharge.secUserId, this.selectedDate);
      }
    }

    convertToTimeFormat(time = "") {
        var timeSplit = time.split(":");
        var hour = timeSplit[0];
        var minute = timeSplit[1];
        return hour + ":" + minute;
    }

    createDateTime(date = '', time = '') {
        var hour = time.split(" ")[0].split(":")[0];
        var minute = time.split(" ")[0].split(":")[1];
        return Date.parse(date + "T" + hour + ":" + minute + ":00.000" + moment().format("Z"));
    }

    getTimeTrackingUser(secUserId, date) {
      this.setState({ isLoading: true });
      var scheduleService = new ScheduleService()
      scheduleService.getTimeTrackingUserByDateWithTimeZone(secUserId, date, deviceTimeZone)
          .then(res => res.json())
          .then((data) => {
              this.timeTracking = data.timeTrackingDTO;
              this.listTimeTrackingSegment = this.timeTracking.listTimeTrackingSegmentDTO;
              this.setState({ timeTracking: data.timeTrackingDTO });
              this.getListAgentAppointmentThisMonth();
          }).catch(err => {
              console.log(err);
              this.setState({ isLoading: false });
          });
    }

    getListAgentAppointmentThisMonth() {
      var currentDay = new Date(this.selectedMonth);
      var firstDay = moment(new Date(currentDay.getFullYear(), currentDay.getMonth(), 1)).format("YYYY-MM-DD");
      var lastDay = moment(new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 0)).format("YYYY-MM-DD");
      var appointmentDTO = new ReaAssetAppointmentDTO();
      appointmentDTO.agentId = this.reaAssetDTO.personInCharge.secUserId;
      appointmentDTO.startDate = Date.parse(firstDay);
      appointmentDTO.endDate = Date.parse(lastDay);
      appointmentDTO.timeZoneId = deviceTimeZone;

      var scheduleService = new ScheduleService()
      scheduleService.listAgentAppointment(appointmentDTO).then(res => res.json()).then(data => {
          this.listAppointmentThisMonth = data;
          this.setState({appointmentThisMonth: this.appointmentThisMonth});
          this.generateListAvailableTimeThisMonth();
      }).catch(err => {
          console.log(err);
      });
    }

    generateListAvailableTimeThisMonth() {
        var currentDay = new Date(this.selectedMonth);
        var firstDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), 1);
        var lastDay = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1);

        var listAppointmentThisMonth = {}
        this.listAppointmentThisMonth.filter(item => {
            var data = {};
            data[this.convertToTimeFormat(new Date(item.startDate).toTimeString())] = item;
            listAppointmentThisMonth[moment(item.startDate).format("YYYY-MM-DD")] = listAppointmentThisMonth[moment(item.startDate).format("YYYY-MM-DD")] ? {...listAppointmentThisMonth[moment(item.startDate).format("YYYY-MM-DD")], ...data} : data;
        })

        var listNormalTimeTrackingSegment = {};
        var listSpecialTimeTrackingSegement = {};
        this.listTimeTrackingSegment.filter(item => {
            var data = {};
            data[item.localTimeStartHourStr] = item;
            if ((Helper.isObjectNotNull(item.date))) {
                listSpecialTimeTrackingSegement[moment(item.date).format("YYYY-MM-DD")] = listSpecialTimeTrackingSegement[moment(item.date).format("YYYY-MM-DD")] ? {...listSpecialTimeTrackingSegement[moment(item.date).format("YYYY-MM-DD")], ...data} : data;
            } else {
                listNormalTimeTrackingSegment[item.dayOfWeek.code] = listNormalTimeTrackingSegment[item.dayOfWeek.code] ? {...listNormalTimeTrackingSegment[item.dayOfWeek.code], ...data} : data;
            }
        })
        
        console.log("List", listSpecialTimeTrackingSegement, listNormalTimeTrackingSegment, listAppointmentThisMonth);

        var listAvailableTimeThisMonth = {}
        while (firstDay.toDateString() != lastDay.toDateString()) {
            if (listNormalTimeTrackingSegment[dayOfWeek[firstDay.getDay()]]) {
                listAvailableTimeThisMonth[moment(firstDay).format("YYYY-MM-DD")] = listNormalTimeTrackingSegment[dayOfWeek[firstDay.getDay()]];
                if (listSpecialTimeTrackingSegement[moment(firstDay).format("YYYY-MM-DD")]) {
                    listAvailableTimeThisMonth[moment(firstDay).format("YYYY-MM-DD")] = {...listAvailableTimeThisMonth[moment(firstDay).format("YYYY-MM-DD")], ...listSpecialTimeTrackingSegement[moment(firstDay).format("YYYY-MM-DD")]};
                    console.log(listSpecialTimeTrackingSegement[moment(firstDay).format("YYYY-MM-DD")])   
                }
                if (listAppointmentThisMonth[moment(firstDay).format("YYYY-MM-DD")]) {
                    listAvailableTimeThisMonth[moment(firstDay).format("YYYY-MM-DD")] = {...listAvailableTimeThisMonth[moment(firstDay).format("YYYY-MM-DD")], ...listAppointmentThisMonth[moment(firstDay).format("YYYY-MM-DD")]}
                    console.log(listAppointmentThisMonth[moment(firstDay).format("YYYY-MM-DD")])
                }
            }
            firstDay.setDate(firstDay.getDate() + 1);
        }
        this.setState({listAvailableTimeThisMonth: listAvailableTimeThisMonth});
        console.log(this.state.listAvailableTimeThisMonth);
    }

    onCalenderChange(date) {
        if (new Date(this.selectedDate).getMonth() != date.getMonth()) {
            this.selectedMonth = date.toISOString().split('T')[0];
            console.log(this.selectedMonth);
            this.getTimeTrackingUser(this.reaAssetDTO.personInCharge.secUserId, this.selectedMonth);
        }
        this.selectedDate = date.toISOString().split('T')[0];
    }

    onSelectVisit(appointment, date) {
        console.log(appointment, date, this.reaAssetDTO.personInCharge.secUser.desc);
        this.setState({personInCharge: this.reaAssetDTO.personInCharge.secUser.desc, isModalVisable: true, appointment: appointment, appointmentDate: date})
    }

    confirmVisit() {
        var appointmentDTO = new ReaAssetAppointmentDTO();
        appointmentDTO.assetId = this.reaAssetDTO.id;
        appointmentDTO.userId = this.secUser.id;
        appointmentDTO.agentId = this.reaAssetDTO.personInCharge.secUserId;
        appointmentDTO.startDate = this.createDateTime(this.state.appointmentDate.toISOString().split('T')[0], this.state.appointment.localTimeStartHourStr);
        appointmentDTO.endDate = this.createDateTime(this.state.appointmentDate.toISOString().split('T')[0], this.state.appointment.localTimeEndHourStr);
        appointmentDTO.address = this.state.appointment.address;
        appointmentDTO.timeZoneId = deviceTimeZone;
        console.log(appointmentDTO);
        this.setState({loading: true})
        const scheduleService = new ScheduleService();
        scheduleService.createAppointment(appointmentDTO).then(res => res.json()).then(data => {
            this.setState({loading: false});
            this.props.history.push('/account/pending-request');
        }).catch(err => {
            console.log(err);
            this.setState({loading: false});
        })
    }
      
    renderCell(date) {
        // console.log(moment(date).format("YYYY-MM-DD"));
        if (this.state.listAvailableTimeThisMonth[moment(date).format("YYYY-MM-DD")]) {
            const availableTimeToday = [];
            for (const [key, value] of Object.entries(this.state.listAvailableTimeThisMonth[moment(date).format("YYYY-MM-DD")])) {
                if (value.available) {
                    availableTimeToday.push(value);
                }
            }
            return(
                <Row xs={1} md={5} style={{margin: 0}}>
                    {
                        availableTimeToday.map((value, index) => (
                            <Col key={index} style={{padding: 0}} md="auto">
                                <div className={'available-button'} onClick={() => {this.onSelectVisit(value, date)}}
                                >{value.localTimeStartHourStr}</div>
                            </Col>
                        ))
                    }
                </Row>
            );
        }
      
        return null;
    }

    render() {
        return(
            <div className={'request-visit'}>
                <Calendar bordered renderCell={this.renderCell.bind(this)} onChange={(date) => {this.onCalenderChange(date)}}/>
                {
                    this.renderModalConfirmVisit()
                }
            </div>
        );
    }

    renderModalConfirmVisit() {
        return(
            <Modal show={this.state.isModalVisable} onHide={() => this.setState({isModalVisable: false})}>
                <Modal.Header><h3>{t('hou.ren.property.confirmationvisit')}</h3></Modal.Header>
                <Modal.Body>
                    <div>
                        {
                            t('hou.ren.msg.property.confirmationvisit.desc', { param: this.state.personInCharge})
                        }
                    </div>
                    <div style={{paddingTop: 20}}>
                        {
                            t('hou.ren.msg.property.confirmationvisit.desc1')
                        }
                    </div>
                    <div style={{paddingTop: 20}}>
                        {
                            t('hou.ren.msg.property.confirmationvisit.desc2')
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {this.confirmVisit()}}>{t('hou.ren.property.confirmrequestvisit')}
                        {
                            this.state.loading ?
                                <Spinner animation="border" variant="primary" size="sm" style={{marginLeft: 10}}/>
                            : null
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

export default withRouter(RequestVisitPage);