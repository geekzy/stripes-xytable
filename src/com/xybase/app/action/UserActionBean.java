/*
 * File: com.xybase.app.action.UserActionBean.java
 *
 * XYTABLE
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.app.action;

import com.xybase.app.services.UserService;
import com.xybase.app.utils.Constants;
import com.xybase.stripes.BaseActionBean;
import com.xybase.utils.GridUtil;
import net.sourceforge.stripes.action.ForwardResolution;
import net.sourceforge.stripes.action.Resolution;
import net.sourceforge.stripes.action.StreamingResolution;
import net.sourceforge.stripes.action.UrlBinding;
import net.sourceforge.stripes.integration.spring.SpringBean;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * <p> User action bean </p>
 *
 * @author Imam
 */
@UrlBinding("/action/user")
public class UserActionBean extends BaseActionBean {
    private static final Log log = LogFactory.getLog(UserActionBean.class);
    private @SpringBean UserService userService;

    private GridUtil userGrid;
    private boolean ajax;

    @Override
    public Resolution show() {
        String myHidParam = getContext().getRequest().getParameter("myHidParam");
        log.debug("myHidParam : " + myHidParam);
        userGrid = userGrid == null ? new GridUtil() : userGrid;
        userGrid.setRows(Constants.ROWS_PER_PAGE);
        userService.getAllUserPaging(userGrid);
        return new ForwardResolution(Constants.XYTABLE.MAIN);
    }

    public Resolution ajaxPage() {
        ajax = true;
        userGrid = userGrid == null ? new GridUtil() : userGrid;
        userGrid.setRows(Constants.ROWS_PER_PAGE);
        userService.getAllUserPaging(userGrid);
        return new ForwardResolution(Constants.XYTABLE.AJAX);
    }

    public Resolution json() {
        userGrid = userGrid == null ? new GridUtil() : userGrid;
        userGrid.setRows(Constants.ROWS_PER_PAGE);
        userService.getAllUserPaging(userGrid);
        return new StreamingResolution(Constants.JSON_MIME, userGrid.serialize());
    }

    public GridUtil getUserGrid() {
        return userGrid;
    }

    public void setUserGrid(GridUtil userGrid) {
        this.userGrid = userGrid;
    }

    public boolean isAjax() {
        return ajax;
    }

    public void setAjax(boolean ajax) {
        this.ajax = ajax;
    }
}
