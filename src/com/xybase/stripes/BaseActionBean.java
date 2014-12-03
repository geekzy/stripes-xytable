/*
 * File: com.xybase.stripes.BaseActionBean.java
 *
 * XYCommon - Stripes
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.stripes;

import net.sourceforge.stripes.action.ActionBean;
import net.sourceforge.stripes.action.ActionBeanContext;
import net.sourceforge.stripes.action.DefaultHandler;
import net.sourceforge.stripes.action.Resolution;

/**
 * <p> Base Action Bean </p>
 *
 * @author Imam
 */
public abstract class BaseActionBean implements ActionBean {
    protected ActionBeanContext context;

    @DefaultHandler
    public abstract Resolution show();

    @Override
    public void setContext(ActionBeanContext context) {
        this.context = context;
    }

    @Override
    public ActionBeanContext getContext() {
        return this.context;
    }
}
