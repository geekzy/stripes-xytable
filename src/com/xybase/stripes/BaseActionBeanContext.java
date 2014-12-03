/*
 * File: com.xybase.stripes.BaseActionBeanContext.java
 *
 * XYCommon - Stripes
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.stripes;

import net.sourceforge.stripes.action.ActionBeanContext;
import net.sourceforge.stripes.integration.spring.SpringHelper;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

/**
 * <p> Base Action Bean Context </p>
 *
 * @author Imam
 */
public class BaseActionBeanContext extends ActionBeanContext {

    public HttpSession getSession() {
        return getRequest().getSession();
    }

    @SuppressWarnings("unchecked")
	public <T> T getCurrent(String key, T defaultValue) {
		T value = (T) getSession().getAttribute(key);
		if (value == null) {
			value = defaultValue;
			setCurrent(key, value);
		}
		return value;
	}

    public void setCurrent(String key, Object value) {
        getSession().setAttribute(key, value);
    }

    public void removeCurrent(String key) {
        getSession().removeAttribute(key);
    }

    public void invalidateSession() {
        getSession().invalidate();
    }

    /* (non-Javadoc)
     *
     * @see net.sourceforge.stripes.action.ActionBeanContext#setServletContext(javax.servlet.ServletContext)
     */
	public void setServletContext(ServletContext servletContext) {
		SpringHelper.injectBeans(this, servletContext);
		super.setServletContext(servletContext);
	}
}
