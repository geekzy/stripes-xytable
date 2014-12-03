/*
 * File: com.xybase.app.utils.PageConstants.java
 *
 * XYTABLE
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 XYBASE SDN BHD. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.app.utils;

import com.xybase.utils.CommonConstants;

/**
 * <p> Page CommonConstants to store path constants to freemarker templates </p>
 *
 * @author Imam
 */
public interface Constants extends CommonConstants {
    int ROWS_PER_PAGE = 5;
    interface XYTABLE {
        String MAIN = "/WEB-INF/ftl/user.ftl";
        String AJAX = "/WEB-INF/ftl/ajax.ftl";
    }
}
