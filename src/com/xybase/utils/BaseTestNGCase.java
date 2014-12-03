/*
 * File: com.xybase.utils.BaseTestNGCase.java
 *
 * XYCommon - Unit Testing
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.utils;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.BeforeClass;

/**
 * <p>This class is the base class of all TestNG Case, this class will include Spring Context</p>
 *
 * @author imam
 */
@ContextConfiguration(locations = "classpath*:config/spring-config.xml")
public class BaseTestNGCase extends AbstractTestNGSpringContextTests {
    @BeforeClass
    public void init() {}
}
