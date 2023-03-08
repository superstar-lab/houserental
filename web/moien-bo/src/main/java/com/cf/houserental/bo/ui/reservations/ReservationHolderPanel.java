package com.cf.houserental.bo.ui.reservations;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.cf.houserental.core.model.reservation.ETypeOfStay;
import com.cf.houserental.core.model.reservation.ReaAssetReservationWkfStatus;
import com.iota.ersys.MainUI;
import com.iota.ersys.core.ui.layout.AbstractFormPanel;
import com.iota.ersys.core.ui.layout.AbstractListPanel;
import com.iota.ersys.core.ui.layout.AbstractTabsheetPanel;
import com.iota.frmk.common.tools.DateUtils;
import com.iota.frmk.workflow.model.WkfStatus;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.OptionalParameter;
import com.vaadin.flow.router.Route;

/**
 * 
 * @author many.yoeurm
 *
 */
@Route(value = ReservationHolderPanel.NAME, layout = MainUI.class)
public class ReservationHolderPanel extends AbstractTabsheetPanel {

	/** */
	private static final long serialVersionUID = -8056727513998728972L;
	public static final String NAME = "bo.reservations";
	
	private ReservationListPanel listPanel;
	private ReservationFormPanel formPanel;
	
	/**
	 * 
	 */
	public ReservationHolderPanel() {
		init();
	}
	
	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractTabsheetPanel#createListPanel()
	 */
	@Override
	public AbstractListPanel<?> createListPanel() {
		if (listPanel == null) {
			listPanel = new ReservationListPanel();
		}
		return listPanel;
	}

	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractTabsheetPanel#createFormPanel()
	 */
	@Override
	public AbstractFormPanel createFormPanel() {
		if (formPanel == null) {
			formPanel = new ReservationFormPanel();
		}
		return formPanel;
	}
	
	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractTabsheetPanel#setParameter(com.vaadin.flow.router.BeforeEvent, java.lang.String)
	 */
	@Override
    public void setParameter(BeforeEvent event, @OptionalParameter String parameter) {
		Map<String, String> params = getParametersMap(event);
		Long statusId = getValueAsLong(params.get("statusId"));
		String typeOfStay = params.get("type");
		Long dateInMillis = getValueAsLong(params.get("date"));
		LocalDate date = null;
		if (dateInMillis != null) {
			date = DateUtils.toLocalDate(new Date(dateInMillis));
		}
		
		if (statusId != null) {
			WkfStatus status = WkfStatus.getById(statusId);
			List<WkfStatus> listStatusParam = new ArrayList<>();
			if (status != null) {
				listStatusParam.add(status);
				if (ReaAssetReservationWkfStatus.RES_PEN.equals(status)) {
					listStatusParam.add(ReaAssetReservationWkfStatus.RES_ACC);
				}
			}
			listPanel.getSearchPanel().buildReservationRestriction(
					listStatusParam,
					"ST".equals(typeOfStay) || "LT".equals(typeOfStay)? ETypeOfStay.valueOf(typeOfStay) : null, 
					date
				);
			listPanel.getSearchPanel().onSearchButtonClicked(null);
			listPanel.getSearchPanel().disableFilterByExternalParam();
		}
    }

	/**
	 * 
	 * @param value
	 * @return
	 */
	private Long getValueAsLong(String value) {
		try {
			return Long.parseLong(value);
		} catch (NumberFormatException ex) {
			return null;
		}
	}

}
