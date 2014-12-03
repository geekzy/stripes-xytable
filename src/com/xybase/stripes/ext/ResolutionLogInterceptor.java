/*
 * File: com.xybase.stripes.ext.ResolutionLogInterceptor.java
 *
 * XYCommons - Stripes Ext
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.stripes.ext;

import net.sourceforge.stripes.action.Resolution;
import net.sourceforge.stripes.controller.ExecutionContext;
import net.sourceforge.stripes.controller.Interceptor;
import net.sourceforge.stripes.controller.Intercepts;
import net.sourceforge.stripes.controller.LifecycleStage;
import net.sourceforge.stripes.util.Log;

@Intercepts(LifecycleStage.EventHandling)
public class ResolutionLogInterceptor implements Interceptor {

    private final static Log log = Log.getInstance(ResolutionLogInterceptor.class);

    public Resolution intercept(ExecutionContext ctx) throws Exception {
        String className = ctx.getActionBean().getClass().getSimpleName();
        String methodName = ctx.getHandler().getName();
        log.debug(className + "-[" + methodName + "]- .....Entering");
        Resolution resolution = ctx.proceed();
        log.debug(className + "-[" + methodName + "]- .....Exiting");
        return resolution;
    }

}
