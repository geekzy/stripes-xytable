/*
 * File: com.xybase.stripes.servlet.StripesFreemarkerServlet.java
 *
 * XYCommons - Freemarker
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.stripes.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import freemarker.ext.beans.BeansWrapper;
import freemarker.ext.servlet.FreemarkerServlet;
import freemarker.template.ObjectWrapper;
import freemarker.template.SimpleHash;
import freemarker.template.Template;
import freemarker.template.TemplateModel;
import net.sourceforge.stripes.action.ActionBean;
import net.sourceforge.stripes.controller.UrlBinding;
import net.sourceforge.stripes.controller.UrlBindingFactory;

public class StripesFreemarkerServlet extends FreemarkerServlet {
    /**
     * This method exposes fields so that you have the option to use public properties in your
     * action beans instead of private properties with getters and setters, if you wish.
     */
    @Override
    protected ObjectWrapper createObjectWrapper() {
        ObjectWrapper result = super.createObjectWrapper();

        if (result instanceof BeansWrapper) {
            BeansWrapper beansWrapper = (BeansWrapper) result;
            beansWrapper.setExposeFields(true);
        }
        return result;
    }

    /**
     * This method puts the context path under the key "contextPath" so that you can use
     * ${contextPath} in your templates.
     */
    @Override
    protected boolean preTemplateProcess(HttpServletRequest req, HttpServletResponse resp,
        Template template, TemplateModel data)
        throws ServletException, IOException
    {
        SimpleHash hash = (SimpleHash) data;

        String contextPath = req.getContextPath();
        hash.put("contextPath", contextPath);

        ActionBean actionBean = (ActionBean) req.getAttribute("actionBean");
		UrlBinding urlBinding = UrlBindingFactory.parseUrlBinding(actionBean.getClass());
        hash.put("urlBinding", urlBinding.getPath());

        return true;
    }
}
