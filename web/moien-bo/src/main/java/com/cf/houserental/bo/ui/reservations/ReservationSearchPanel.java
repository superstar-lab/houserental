package com.cf.houserental.bo.ui.reservations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.vaadin.gatanaso.MultiselectComboBox;

import com.cf.houserental.bo.helper.HouseRentalI18nVar;
import com.cf.houserental.core.model.reservation.ETypeOfStay;
import com.cf.houserental.core.model.reservation.ReaAssetReservation;
import com.cf.houserental.core.model.reservation.ReaAssetReservationWkfStatus;
import com.cf.houserental.core.service.reservation.ReaAssetReservationRestriction;
import com.iota.ersys.core.ui.component.StartEndDateField;
import com.iota.ersys.core.ui.layout.AbstractSearchPanel;
import com.iota.ersys.core.ui.widget.component.ComponentFactory;
import com.iota.frmk.common.i18n.I18N;
import com.iota.frmk.dao.hql.BaseRestrictions;
import com.iota.frmk.workflow.model.WkfStatus;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Unit;

/**
 * 
 * @author many.yoeurm
 *
 */
public class ReservationSearchPanel extends AbstractSearchPanel<ReaAssetReservation> implements HouseRentalI18nVar {
	
	/** */
	private static final long serialVersionUID = -6698989648328852909L;

	private Boolean filterByExternalParam;
	
	private StartEndDateField dfStartEndDate;
	private MultiselectComboBox<WkfStatus> cbxStatuses;
	
	/**
	 * 
	 * @param listPanel
	 */
	public ReservationSearchPanel(ReservationListPanel listPanel) {
		super(listPanel);
	}

	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractSearchPanel#createForm()
	 */
	@Override
	protected Component createForm() {
		return null;
	}
	
	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractSearchPanel#initControl()
	 */
	@Override
	protected void initControl() {
		dfStartEndDate = ComponentFactory.getStartEndDateField();
		dfStartEndDate.setWidth(250, Unit.PIXELS);
		
		cbxStatuses = new MultiselectComboBox<>();
		cbxStatuses.setItems(ReaAssetReservationWkfStatus.WKF_STATUS_LIST);
		cbxStatuses.setWidth(250, Unit.PIXELS);
		
		addControlToAdvancedBlock(cbxStatuses, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "status"));
		addControlToAdvancedBlock(dfStartEndDate, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "start.end.date"));
	}

	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractSearchPanel#reset()
	 */
	@Override
	protected void reset() {
		txtSearchText.clear();
		cbxStatuses.clear();
		dfStartEndDate.clear();
	}

	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractSearchPanel#getRestrictions()
	 */
	@Override
	public BaseRestrictions<ReaAssetReservation> getRestrictions() {
		ReaAssetReservationRestriction restrictions = new ReaAssetReservationRestriction();
		List<WkfStatus> wkfStatuses = new ArrayList<>();
		cbxStatuses.getSelectedItems().forEach(obj -> {
			wkfStatuses.add(obj);
		});
		if (filterByExternalParam != null) {
			restrictions = ReaAssetReservationRestriction.buildReservationRestriction(
					wkfStatuses, 
					null, 
					dfStartEndDate.getStartLocalDate(), 
					false
				);
			return restrictions;
		} else {
			restrictions = new ReaAssetReservationRestriction();
		}
		
		restrictions.setText(txtSearchText.getValue());
		if (dfStartEndDate.getStartLocalDate() != null) {
			restrictions.setStartDate(dfStartEndDate.getStartLocalDate().atStartOfDay());
		}
		if (dfStartEndDate.getEndLocalDate() != null) {
			restrictions.setEndDate(dfStartEndDate.getEndLocalDate().atTime(LocalTime.MAX));
		}
		if (wkfStatuses != null && !wkfStatuses.isEmpty()) {
			restrictions.addCriterion(Restrictions.in(ReaAssetReservation.STATUS, wkfStatuses));
		}
		restrictions.addCriterion(Restrictions.ne(ReaAssetReservation.STATUS, ReaAssetReservationWkfStatus.RES_NEW));
		return restrictions;
	}
	
	/**
	 * 
	 * @param statuses
	 * @param typeOfStay
	 * @param date
	 */
	public void buildReservationRestriction(List<WkfStatus> statuses, ETypeOfStay typeOfStay, LocalDate date) {
		this.filterByExternalParam = true;
		cbxStatuses.select(statuses);
		dfStartEndDate.setStartLocalDate(date);
	}
	
	/**
	 * 
	 */
	public void disableFilterByExternalParam() {
		this.filterByExternalParam = null;
	}

}
