package com.cf.houserental.bo.ui.reservations;

import java.time.format.DateTimeFormatter;

import org.apache.commons.lang3.StringUtils;

import com.cf.houserental.bo.helper.HouseRentalI18nVar;
import com.cf.houserental.core.helper.NumberToWordConverter;
import com.cf.houserental.core.model.asset.ReaAsset;
import com.cf.houserental.core.model.reservation.ReaAssetReservation;
import com.iota.ersys.common.corebiz.model.people.People;
import com.iota.ersys.core.ui.component.ButtonLink;
import com.iota.ersys.core.ui.layout.AbstractListPanel;
import com.iota.ersys.core.ui.layout.AbstractSearchPanel;
import com.iota.ersys.core.ui.widget.component.ComponentFactory;
import com.iota.ersys.core.ui.widget.table.PagedDataProvider;
import com.iota.ersys.core.ui.widget.table.PagedDefinition;
import com.iota.ersys.core.ui.widget.table.columnrenderer.EntityColumnRenderer;
import com.iota.ersys.core.ui.widget.table.columnrenderer.EntityComponentColumnRenderer;
import com.iota.ersys.core.ui.widget.table.impl.EntityPagedDataProvider;
import com.iota.frmk.common.custom.model.cfield.EnAlign;
import com.iota.frmk.common.i18n.I18N;
import com.iota.frmk.common.tools.DateUtils;
import com.iota.frmk.common.tools.MyMathUtils;
import com.iota.frmk.common.tools.amount.AmountUtils;

/**
 * 
 * @author many.yoeurm
 *
 */
public class ReservationListPanel extends AbstractListPanel<ReaAssetReservation> implements HouseRentalI18nVar {

	/** */
	private static final long serialVersionUID = -8571848019029499165L;
	
	/**
	 * 
	 */
	public ReservationListPanel() {
		setCaption(I18N.message("bo.menu.reservations"));
		initLayout();
	}

	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractListPanel#getEntity()
	 */
	@Override
	protected ReaAssetReservation getEntity() {
		if (this.getSelectedItem() != null) {
			Long id = this.getItemSelectedId();
			if (id != null) {
				return ENTITY_SRV.getById(ReaAssetReservation.class, id);
			}
		}
		return null;
	}
	
	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractListPanel#createPagedDataProvider()
	 */
	@Override
	protected PagedDataProvider<ReaAssetReservation> createPagedDataProvider() {
		PagedDefinition<ReaAssetReservation> pagedDefinition = new PagedDefinition<ReaAssetReservation>(getSearchPanel().getRestrictions());
		pagedDefinition.addColumnDefinition(ReaAssetReservation.ID, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "id"), Long.class, EnAlign.LEFT, 90);
//		pagedDefinition.addColumnDefinition(ReaAssetReservation.REFERENCE, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "reference"), Button.class, EnAlign.LEFT, 100, new ReaReservationRefLinkColumnRender());
		pagedDefinition.addColumnDefinition(ReaAssetReservation.PEOBOOKED + DOT + People.FULLNAME, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "customer"), String.class, EnAlign.LEFT, 160);
		pagedDefinition.addColumnDefinition(ReaAssetReservation.ASSET + DOT + ReaAsset.PERSONINCHARGE + DOT + People.FULLNAME, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "owner"), String.class, EnAlign.LEFT, 160);
		pagedDefinition.addColumnDefinition(ReaAssetReservation.ASSET + DOT + ReaAsset.ASSETTITLE, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "asset.title"), String.class, EnAlign.LEFT, 250);
		pagedDefinition.addColumnDefinition(ReaAssetReservation.ASSETAMOUNTPERNIGHT, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "amount.per.night"), Double.class, EnAlign.RIGHT, 130, new ReservationAmountColumnRenderer());
		pagedDefinition.addColumnDefinition(ReaAssetReservation.SERVICEFEE, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "donation"), Double.class, EnAlign.RIGHT, 80, new ReservationServiceFeeColumnRenderer());
		pagedDefinition.addColumnDefinition(ReaAssetReservation.CARBONCOMPENSATORAMOUNT, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "compensator.carbone"), Double.class, EnAlign.RIGHT, 110, new ReservationCarbonCompensatorAmountColumnRenderer());
		pagedDefinition.addColumnDefinition(ReaAssetReservation.NBDAY, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "nb.day"), Integer.class, EnAlign.CENTER, 80);
		pagedDefinition.addColumnDefinition(ReaAssetReservation.STARTDATE, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "start.date"), String.class, EnAlign.CENTER, 120, new ReservationStartDateColumnRenderer());
		pagedDefinition.addColumnDefinition(ReaAssetReservation.ENDDATE, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "end.date"), String.class, EnAlign.CENTER, 120, new ReservationEndDateColumnRenderer());
		pagedDefinition.addColumnDefinition(ReaAssetReservation.NBADULTS, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "adults"), Integer.class, EnAlign.CENTER, 100);
		pagedDefinition.addColumnDefinition(ReaAssetReservation.NBCHILDREN, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "children"), Integer.class, EnAlign.CENTER, 100);
		pagedDefinition.addColumnDefinition(ReaAssetReservation.CANCELTYPE, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "cancel-conditions"), String.class, EnAlign.LEFT, 180);
		pagedDefinition.addColumnDefinition(ReaAssetReservation.STATUS, I18N.message(HOUSE_RENTAL_STAY_I18N_PREFIX + "status"), String.class, EnAlign.LEFT, 150);
		
		EntityPagedDataProvider<ReaAssetReservation> pagedDataProvider = new EntityPagedDataProvider<ReaAssetReservation>();
		pagedDataProvider.setPagedDefinition(pagedDefinition);
		return pagedDataProvider;
	}
	
	/**(non-Javadoc)
	 * @see com.iota.ersys.core.ui.layout.AbstractListPanel#createSearchPanel()
	 */
	@Override
	protected AbstractSearchPanel<ReaAssetReservation> createSearchPanel() {
		return new ReservationSearchPanel(this);
	}
	
	/**
	 * @see com.iota.ersys.core.ui.layout.AbstractListPanel#getSearchPanel()
	 */
	@Override
	public ReservationSearchPanel getSearchPanel() {
		return super.getSearchPanel();
	}
	
	/**
	 * 
	 * @author uhout.cheng
	 */
	private class ReservationAmountColumnRenderer extends EntityColumnRenderer {
		
		/** */
		private static final long serialVersionUID = -5812149360285699547L;

		/**
		 * @see com.nokor.frmk.vaadin.ui.widget.table.ColumnRenderer#getValue()
		 */
		@Override
		public Object getValue() {
			ReaAssetReservation reservation = (ReaAssetReservation) getEntity();
			return AmountUtils.format(MyMathUtils.getDouble(reservation.getAssetAmountPerNight()) - MyMathUtils.getDouble(reservation.getServiceFee()) - MyMathUtils.getDouble(reservation.getCarbonCompensatorAmount())) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY;
		}
	}
	
	/**
	 * 
	 * @author uhout.cheng
	 */
	private class ReservationServiceFeeColumnRenderer extends EntityColumnRenderer {
		
		/** */
		private static final long serialVersionUID = 5234001717122007167L;

		/**
		 * @see com.nokor.frmk.vaadin.ui.widget.table.ColumnRenderer#getValue()
		 */
		@Override
		public Object getValue() {
			ReaAssetReservation reservation = (ReaAssetReservation) getEntity();
			return AmountUtils.format(MyMathUtils.getDouble(reservation.getServiceFee())) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY;
		}
	}
	
	/**
	 * 
	 * @author sopheaktra.chim
	 */
	private class ReservationCarbonCompensatorAmountColumnRenderer extends EntityColumnRenderer {

		/** */
		private static final long serialVersionUID = 4813176905192414684L;

		/**
		 * @see com.nokor.frmk.vaadin.ui.widget.table.ColumnRenderer#getValue()
		 */
		@Override
		public Object getValue() {
			ReaAssetReservation reservation = (ReaAssetReservation) getEntity();
			return AmountUtils.format(MyMathUtils.getDouble(reservation.getCarbonCompensatorAmount())) + StringUtils.SPACE + NumberToWordConverter.EURO_SYMBOL_CURRENCY;
		}
	}
	
	/**
	 * 
	 * @author uhout.cheng
	 */
	private class ReservationStartDateColumnRenderer extends EntityColumnRenderer {
		
		/** */
		private static final long serialVersionUID = 515049775152378169L;

		/**
		 * @see com.nokor.frmk.vaadin.ui.widget.table.ColumnRenderer#getValue()
		 */
		@Override
		public Object getValue() {
			ReaAssetReservation reservation = (ReaAssetReservation) getEntity();
			String dateLabel = StringUtils.EMPTY;
			if (reservation.getStartDate() != null) {
				dateLabel = reservation.getStartDate().format(DateTimeFormatter.ofPattern(DateUtils.FORMAT_DDMMYYYY_SLASH));
			}
			return dateLabel;
		}
	}
	
	/**
	 * 
	 * @author uhout.cheng
	 */
	private class ReservationEndDateColumnRenderer extends EntityColumnRenderer {
		
		/** */
		private static final long serialVersionUID = -8559841200010676259L;

		/**
		 * @see com.nokor.frmk.vaadin.ui.widget.table.ColumnRenderer#getValue()
		 */
		@Override
		public Object getValue() {
			ReaAssetReservation reservation = (ReaAssetReservation) getEntity();
			String dateLabel = StringUtils.EMPTY;
			if (reservation.getEndDate() != null) {
				dateLabel = reservation.getEndDate().plusDays(1).format(DateTimeFormatter.ofPattern(DateUtils.FORMAT_DDMMYYYY_SLASH));
			}
			return dateLabel;
		}
	}
	
	/**
	 * 
	 * @author chanrineth.set
	 *
	 */
	private class ReaReservationRefLinkColumnRender extends EntityComponentColumnRenderer {	
		/** */
		private static final long serialVersionUID = 8917701357918499748L;

		@Override
		public Object getValue() {
			ReaAssetReservation reservation = (ReaAssetReservation) getEntity();			
			ButtonLink btnLink = ComponentFactory.getButtonLink();
			btnLink.setText(reservation.getReference());
			btnLink.addClickListener(event -> {
				setSelectedItem(reservation);
				getHolderPanel().onEditEventClick();
			});
			return btnLink;
		}
	}
}
