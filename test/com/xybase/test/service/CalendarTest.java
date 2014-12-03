/*
 * File: com.xybase.test.service.CalendarTest.java
 *
 * BLESS
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 XYBASE SDN BHD. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.test.service;

import com.xybase.utils.BaseTestNGCase;
import org.testng.Assert;
import org.testng.annotations.Test;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * <p> DateTime Test Case </p>
 * <p/>
 * <p>Revision Information:<br/><i>
 * $Date$<br/>
 * $Revision$<br/>
 * $LastChangedBy$
 * </i></p>
 *
 * @author Imam
 */
public class CalendarTest extends BaseTestNGCase {
    @Test
    public void testCalendar() throws ParseException {
        final String DATE_FORMAT = "dd/MM/yyyy";
        DateFormat df = new SimpleDateFormat(DATE_FORMAT);
        Date date = df.parse("05/02/2011");

        Calendar cal = Calendar.getInstance();
        cal.setTime(date);

        int dayNth = cal.get(Calendar.DAY_OF_WEEK);
        Assert.assertEquals(7, dayNth, "Incorrect day of the week!!");
    }
}
