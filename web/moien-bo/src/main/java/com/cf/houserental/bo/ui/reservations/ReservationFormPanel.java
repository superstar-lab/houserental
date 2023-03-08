/**
 * 
 */
package com.cf.houserental.bo.ui.reservations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

import com.cf.houserental.bo.helper.HouseRentalI18nVar;
import com.cf.houserental.core.helper.NumberToWordConverter;
import com.cf.houserental.core.model.asset.ReaAsset;
import com.cf.houserental.core.model.reservation.EReservationCancelReason;
import com.cf.houserental.core.model.reservation.EReservationCancelType;
import com.cf.houserental.core.model.reservation.ReaAssetReservation;
import com.cf.houserental.core.model.reservation.ReaAssetReservationWkfStatus;
import com.cf.houserental.core.model.reservation.ReservationContact;
import com.cf.houserental.core.model.reservation.ReservationDatePrice;
import com.cf.houserental.core.model.reservation.setting.ReaAssetReservationSetting;
import com.iota.ersys.common.corebiz.model.address.Address;
import com.iota.ersys.common.corebiz.model.address.Zone;
import com.iota.ersys.core.ui.component.MVerticalLayout;
import com.iota.ersys.core.ui.component.Panel;
import com.iota.ersys.core.ui.layout.AbstractFormPanel;
import com.iota.ersys.core.ui.widget.component.ComponentFactory;
import com.iota.frmk.common.i18n.I18N;
import com.iota.frmk.common.tools.DateUtils;
import com.iota.frmk.common.tools.MyMathUtils;
import com.iota.frmk.common.tools.amount.AmountUtils;
import com.iota.frmk.dao.hql.BaseRestrictions;
import com.iota.frmk.model.entity.Entity;
import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Unit;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.Label;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.textfield.TextField;

/**
 * 
 * @author chanrineth.set
 *
 */
public class ReservationFormPanel extends AbstractFormPanel implements HouseRentalI18nVar {
	/** */
	private static final long serialVersionUID = -2635482519869934884L;

	private Long entityId;
	private TextField txtAssetTitle;
	private TextField txtAssetAddress;
	private TextField txtPeoBooked;
	private TextField txtOwner;
	private TextField txtAssetAmountPerNight;
	private TextField txtCleaningFee;
	private TextField txtSheetsFee;
	private TextField txtTowelCharges;
	private TextField txtServiceFee;
	private TextField txtCarbonCompensatorAmount;
	private TextField txtNbDay;
	private TextField txtNbAdults;
	private TextField txtNbChildren;
	private TextField txtStartDate;
	private TextField txtEndDate;
	private TextField txtCancelType;
	private TextField txtStatus;
	
	private TextField txtCancelReason;
	private TextField txtCancelOtherText;
	private FormLayout frmCancelReasonLayout;
	private FormLayout frmCancelReasonOtherLayout;
	private MVerticalLayout bookingDateDetailLayout;
	private MVerticalLayout reservationContactLayout;
	
	/**
	 * 
	 */
	public ReservationFormPanel() {
		super.init();
        setCaption(I18N.message("global.form.detail"));
	}
	
	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractFormPanel#createForm()
	 */
	@Override
	protected Component createForm() {
		txtAssetTitle = ComponentFactory.getTextField();
		txtAssetAddress = ComponentFactory.getTextField();
		
		txtPeoBooked = ComponentFactory.getTextField();
		txtOwner = ComponentFactory.getTextField();
		
		txtAssetAmountPerNight = ComponentFactory.getTextField();
		txtCleaningFee = ComponentFactory.getTextField();
		txtSheetsFee = ComponentFactory.getTextField();
		txtTowelCharges = ComponentFactory.getTextField();
		txtNbDay = ComponentFactory.getTextField();
		txtNbAdults = ComponentFactory.getTextField();
		txtNbChildren = ComponentFactory.getTextField();
		txtServiceFee = ComponentFactory.getTextField();
		txtCarbonCompensatorAmount = ComponentFactory.getTextField();
		txtCancelType = ComponentFactory.getTextField();
		
		txtCancelReason = ComponentFactory.getTextField();
		txtCancelOtherText = ComponentFactory.getTextField();
		
		txtStartDate = ComponentFactory.getTextField();
		txtEndDate = ComponentFactory.getTextField();
		
		txtStatus = ComponentFactory.getTextField();
		
		txtPeoBooked.setReadOnly(true);
		txtOwner.setReadOnly(true);
		txtAssetTitle.setReadOnly(true);
		txtAssetAddress.setReadOnly(true);
		txtAssetAmountPerNight.setReadOnly(true);
		txtCleaningFee.setReadOnly(true);
		txtSheetsFee.setReadOnly(true);
		txtTowelCharges.setReadOnly(true);
		txtServiceFee.setReadOnly(true);
		txtCarbonCompensatorAmount.setReadOnly(true);
		txtNbDay.setReadOnly(true);
		txtNbAdults.setReadOnly(true);
		txtNbChildren.setReadOnly(true);
		txtStartDate.setReadOnly(true);
		txtEndDate.setReadOnly(true);
		txtStatus.setReadOnly(true);
		txtCancelType.setReadOnly(true);
		
		txtCancelReason.setReadOnly(true);
		txtCancelOtherText.setReadOnly(true);
		
		txtAssetTitle.setWidth(700, Unit.PIXELS);
		txtAssetAddress.setWidth(700, Unit.PIXELS);
		txtPeoBooked.setWidth(700, Unit.PIXELS);
		txtOwner.setWidth(700, Unit.PIXELS);
		txtAssetAmountPerNight.setWidth(700, Unit.PIXELS);
		txtServiceFee.setWidth(700, Unit.PIXELS);
		txtCarbonCompensatorAmount.setWidth(700, Unit.PIXELS);
		txtNbAdults.setWidth(700, Unit.PIXELS);
		txtNbChildren.setWidth(700, Unit.PIXELS);
		txtNbDay.setWidth(700, Unit.PIXELS);
		txtCancelType.setWidth(700, Unit.PIXELS);
		txtStartDate.setWidth(700, Unit.PIXELS);
		txtEndDate.setWidth(700, Unit.PIXELS);
		txtStatus.setWidth(700, Unit.PIXELS);
		
		txtCancelReason.setWidth(700, Unit.PIXELS);
		txtCancelOtherText.setWidth(700, Unit.PIXELS);
		
		frmCancelReasonLayout = ComponentFactory.getFormLayout();
		frmCancelReasonLayout.setVisible(false);
		frmCancelReasonLayout.setWidth(700, Unit.PIXELS);
		frmCancelReasonLayout.addFormItem(txtCancelReason, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "cancel-reason"));
		
		frmCancelReasonOtherLayout = ComponentFactory.getFormLayout();
		frmCancelReasonOtherLayout.setVisible(false);
		frmCancelReasonOtherLayout.setWidth(700, Unit.PIXELS);
		frmCancelReasonOtherLayout.addFormItem(txtCancelOtherText, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "cancel-other"));

		FormLayout formLayout = ComponentFactory.getFormLayout();
		formLayout.setWidth(700, Unit.PIXELS);
		formLayout.addFormItem(txtAssetTitle, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "asset.title"));
		formLayout.addFormItem(txtAssetAddress, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "asset.address"));
		formLayout.addFormItem(txtPeoBooked, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "customer"));
		formLayout.addFormItem(txtOwner, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "owner"));
		formLayout.addFormItem(txtAssetAmountPerNight, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "amount.per.night"));
		formLayout.addFormItem(txtCleaningFee, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "cleaning.fee"));
		formLayout.addFormItem(txtSheetsFee, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "sheets.fee"));
		formLayout.addFormItem(txtTowelCharges, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "towel.charges"));
		formLayout.addFormItem(txtServiceFee, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "donation"));
		formLayout.addFormItem(txtCarbonCompensatorAmount, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "compensator.carbone"));
		formLayout.addFormItem(txtNbAdults, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "adults"));
		formLayout.addFormItem(txtNbChildren, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "children"));
		formLayout.addFormItem(txtNbDay, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "nb.day"));
		formLayout.addFormItem(txtStartDate, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "start.date"));
		formLayout.addFormItem(txtEndDate, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "end.date"));
		formLayout.addFormItem(txtCancelType, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "cancel-conditions"));
		formLayout.add(frmCancelReasonLayout);
		formLayout.add(frmCancelReasonOtherLayout);
		formLayout.addFormItem(txtStatus, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "status"));
		
		bookingDateDetailLayout = ComponentFactory.getVerticalLayout();
		bookingDateDetailLayout.setWidth(400, Unit.PIXELS);
		bookingDateDetailLayout.setSpacing(true);
		bookingDateDetailLayout.setMargin(true);
		bookingDateDetailLayout.setPadding(true);
		
		reservationContactLayout = ComponentFactory.getVerticalLayout();
		reservationContactLayout.setWidth(400, Unit.PIXELS);
		reservationContactLayout.setSpacing(true);
		reservationContactLayout.setMargin(true);
		reservationContactLayout.setPadding(true);
		
		HorizontalLayout horLayout = ComponentFactory.getHorizontalLayout();
		horLayout.setSizeUndefined();
		horLayout.setSpacing(true);
		
		MVerticalLayout leftVerLayout = ComponentFactory.getVerticalLayout();
		leftVerLayout.setSizeUndefined();
		leftVerLayout.setSpacing(true);
		leftVerLayout.add(bookingDateDetailLayout);
		leftVerLayout.add(reservationContactLayout);
		
		horLayout.add(formLayout);
		horLayout.add(leftVerLayout);
		
		Panel panel = ComponentFactory.getPanel(horLayout);
		panel.setSizeFull();
		return panel;
	}

	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractFormPanel#editEntity(java.lang.Long)
	 */
	@Override
	public void editEntity(Long entityId) {
		if (entityId != null) {
			reset();
			setEntityId(entityId);
			ReaAssetReservation reservation = ENTITY_SRV.getById(ReaAssetReservation.class, entityId);
			ReaAsset asset = reservation.getAsset();
			txtAssetTitle.setValue(asset.getAssetTitle());
			
			Address address = asset.getAddress();
			List<String> listAddressDesc = new ArrayList<>();
			if (StringUtils.isNotBlank(address.getLine3())) {
				listAddressDesc.add(address.getLine3());
			}
			Zone zone = address.getZone();
			if (zone != null) {
				listAddressDesc.add(zone.getRefCode() + StringUtils.SPACE + zone.getDescLocaleField());
				if (zone.getCountry() != null) {
					listAddressDesc.add(zone.getCountry().getDesc());	
				}
			}
			
			txtAssetAddress.setValue(getDefaultString(StringUtils.join(listAddressDesc, ", ")));
			txtPeoBooked.setValue(getDefaultString(reservation.getPeoBooked().getFullName()));
			txtOwner.setValue(getDefaultString(asset.getPersonInCharge().getFullName()));
			
			double cleaningFee = MyMathUtils.getDouble(reservation.getCleaningFee());
			double towelCharges = MyMathUtils.getDouble(reservation.getTowelCharges());
			double sheetFee = MyMathUtils.getDouble(reservation.getSheetsFee());
			double serviceFee = MyMathUtils.getDouble(reservation.getServiceFee());
			double carbonCompensatorAmount = MyMathUtils.getDouble(reservation.getCarbonCompensatorAmount());
			
			txtAssetAmountPerNight.setValue(AmountUtils.format(MyMathUtils.getDouble(reservation.getAssetAmountPerNight()) - cleaningFee - towelCharges - sheetFee - serviceFee - carbonCompensatorAmount) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY);
			txtCleaningFee.setValue(AmountUtils.format(cleaningFee) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY);
			txtTowelCharges.setValue(AmountUtils.format(towelCharges) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY);
			txtSheetsFee.setValue(AmountUtils.format(sheetFee) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY);
			txtServiceFee.setValue(AmountUtils.format(serviceFee) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY);
			txtCarbonCompensatorAmount.setValue(AmountUtils.format(carbonCompensatorAmount) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY);
			
			txtNbDay.setValue(getDefaultString(reservation.getNbDay()));
			
			EReservationCancelType cancelType = reservation.getCancelType();
			if (cancelType != null) {
				txtCancelType.setValue(getDefaultString(cancelType.getDescLocaleField()));
			}
			
			ReaAssetReservationSetting assetReservationSetting = getReaAssetReservationSetting(asset);
			String arrivalTime = "16:00";
			String departureTime = "12:00";
			if (assetReservationSetting != null) {
				if (StringUtils.isNotBlank(assetReservationSetting.getArrivalTime())) {
					arrivalTime = assetReservationSetting.getArrivalTime();
				}
				if (StringUtils.isNotBlank(assetReservationSetting.getDepartureTime())) {
					departureTime = assetReservationSetting.getDepartureTime();
				}
			}
			
			Integer arrivalHour = DateUtils.string2DateSmart(arrivalTime).getHours();
			Integer arrivalMinute = DateUtils.string2DateSmart(arrivalTime).getMinutes();
			Integer departureHour = DateUtils.string2DateSmart(departureTime).getHours();
			Integer departureMinute = DateUtils.string2DateSmart(departureTime).getMinutes();
			
			txtStartDate.setValue(LocalDateTime.of(reservation.getStartDate().toLocalDate(), LocalTime.of(arrivalHour, arrivalMinute)).format(DateTimeFormatter.ofPattern(DateUtils.FORMAT_DDMMYYYY_HHMM_SLASH)));
			txtEndDate.setValue(LocalDateTime.of(reservation.getEndDate().toLocalDate().plusDays(1), LocalTime.of(departureHour, departureMinute)).format(DateTimeFormatter.ofPattern(DateUtils.FORMAT_DDMMYYYY_HHMM_SLASH)));
			
			txtNbAdults.setValue(getDefaultString(reservation.getNbAdults()));
			txtNbChildren.setValue(getDefaultString(reservation.getNbChildren()));
			
			txtStatus.setValue(getDefaultString(reservation.getStatus().getDescLocaleField()));
			
			if (ReaAssetReservationWkfStatus.RES_CAN == reservation.getStatus()) {
				EReservationCancelReason cancelReason = reservation.getCancelReason();
				if (cancelReason != null) {
					frmCancelReasonLayout.setVisible(true);
					txtCancelReason.setValue(getDefaultString(cancelReason.getDescLocaleField()));
				}
				if (StringUtils.isNotBlank(reservation.getOtherReasonDesc())) {
					frmCancelReasonOtherLayout.setVisible(true);
					txtCancelOtherText.setValue(getDefaultString(reservation.getOtherReasonDesc()));
				}
			}
			
			List<ReservationDatePrice> reservationDatePrices = reservation.getReservationDatePrices();
			if (reservationDatePrices != null && !reservationDatePrices.isEmpty()) {
				Label lblTitle = ComponentFactory.getLabel(I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "payment") + " : ");
				lblTitle.getStyle().set("color", "#A6A6BB").set("font-family", "Overpass-Regular").set("font-size", "16px").set("width", "400px").set("font-weight", "800");
				IntStream.range(0, reservationDatePrices.size()).forEach(index -> {
					LocalDate date = reservationDatePrices.get(index).getDate();
					double price = MyMathUtils.getDouble(reservationDatePrices.get(index).getPrice());
					if (date != null && price > 0) {
						String content = (index + 1) + ". " + date.format(DateTimeFormatter.ofPattern(DateUtils.FORMAT_DDMMYYYY_SLASH)) + " : " + AmountUtils.format(price) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY;
						Label lblContent = ComponentFactory.getLabel(content);
						lblContent.getStyle().set("color", "#808093").set("font-family", "Overpass-Regular").set("font-size", "14px").set("width", "400px").set("font-weight", "600");
						bookingDateDetailLayout.add(lblContent);
					}
				});
				if (bookingDateDetailLayout.getComponentCount() > 0) {
					bookingDateDetailLayout.addComponentAsFirst(lblTitle);
				}
			}
			
			List<ReservationContact> reservationContacts = reservation.getReservationContacts();
			if (reservationContacts != null && !reservationContacts.isEmpty()) {
				Label lblTitle = ComponentFactory.getLabel(I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "other-contact") + " : ");
				lblTitle.getStyle().set("color", "#A6A6BB").set("font-family", "Overpass-Regular").set("font-size", "16px").set("width", "400px").set("font-weight", "800");
				IntStream.range(0, reservationContacts.size()).forEach(index -> {
					String email = reservationContacts.get(index).getEmail();
					if (StringUtils.isNotBlank(email)) {
						String content = (index + 1) + ". " + email;
						Label lblContent = ComponentFactory.getLabel(content);
						lblContent.getStyle().set("color", "#808093").set("font-family", "Overpass-Regular").set("font-size", "14px").set("width", "400px").set("font-weight", "600");
						reservationContactLayout.add(lblContent);
					}
				});
				if (reservationContactLayout.getComponentCount() > 0) {
					reservationContactLayout.addComponentAsFirst(lblTitle);
				}
			}
		}
	}
	
	/**
	 * 
	 * @param asset
	 * @return
	 */
	private ReaAssetReservationSetting getReaAssetReservationSetting(ReaAsset asset) {
		if (asset != null) {
			BaseRestrictions<ReaAssetReservationSetting> settingRestrictions = new BaseRestrictions<>(ReaAssetReservationSetting.class);
			settingRestrictions.addCriterion(Restrictions.eq(ReaAssetReservationSetting.ASSET, asset));
			settingRestrictions.addOrder(Order.desc(ReaAssetReservationSetting.ID));
			return ENTITY_SRV.getFirst(settingRestrictions);	
		}
		return null;
	}
	
	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractFormPanel#newEntity()
	 */
	@Override
	public void newEntity() {}

	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractFormPanel#getEntity()
	 */
	@Override
	protected Entity getEntity() {
		return null;
	}

	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractFormPanel#saveEntity()
	 */
	@Override
	public void saveEntity() {}
	
	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractFormPanel#reset()
	 */
	@Override
	public void reset() {
		super.reset();
		txtAssetTitle.setValue(StringUtils.EMPTY);
		txtAssetAddress.setValue(StringUtils.EMPTY);
		txtPeoBooked.setValue(StringUtils.EMPTY);
		txtOwner.setValue(StringUtils.EMPTY);
		txtAssetAmountPerNight.setValue(StringUtils.EMPTY);
		txtCleaningFee.setValue(StringUtils.EMPTY);
		txtSheetsFee.setValue(StringUtils.EMPTY);
		txtTowelCharges.setValue(StringUtils.EMPTY);
		txtServiceFee.setValue(StringUtils.EMPTY);
		txtCarbonCompensatorAmount.setValue(StringUtils.EMPTY);
		txtNbAdults.setValue(StringUtils.EMPTY);
		txtNbChildren.setValue(StringUtils.EMPTY);
		txtNbDay.setValue(StringUtils.EMPTY);
		txtCancelType.setValue(StringUtils.EMPTY);
		txtCancelReason.setValue(StringUtils.EMPTY);
		txtCancelOtherText.setValue(StringUtils.EMPTY);
		frmCancelReasonLayout.setVisible(false);
		frmCancelReasonOtherLayout.setVisible(false);
		txtStartDate.clear();
		txtEndDate.clear();
		txtStatus.clear();
		bookingDateDetailLayout.removeAll();
		reservationContactLayout.removeAll();
	}

	/**
	 * @return the entityId
	 */
	public Long getEntityId() {
		return entityId;
	}

	/**
	 * @param entityId the entityId to set
	 */
	public void setEntityId(Long entityId) {
		this.entityId = entityId;
	}
}
