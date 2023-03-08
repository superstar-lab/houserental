package com.cf.houserental.bo.ui;

import java.util.List;

import com.iota.ersys.core.ui.layout.welcome.SimpleWelcomeView;
import com.iota.frmk.common.helper.FrmkAppConfigFileHelper;

/**
 * 
 * @author uhout.cheng
 */
public class WelcomeView extends SimpleWelcomeView {
    
	/** */
	private static final long serialVersionUID = 837076739235304018L;

	/**
	 * 
	 */
    public WelcomeView() {
       super();
    }   
    
    /**
     * @see com.iota.ersys.core.ui.layout.welcome.SimpleWelcomeView#initApps()
     */
    @Override
    public void initApps() {
    	List<String> displayAppCodes = FrmkAppConfigFileHelper.getWelcomeDisplayApplicationCodes();
    	if (displayAppCodes == null || displayAppCodes.size() == 0) {
    		displayAppCodes = FrmkAppConfigFileHelper.getApplicationCodes();
    	}
        setDisplayAppCodes(displayAppCodes);
    }
}
