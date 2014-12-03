/*
 * File: com.xybase.spring.utils.CompScanNameGenerator.java
 *
 * XYCommons - Spring
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.spring;

import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanNameGenerator;
import org.springframework.util.StringUtils;

/**
 * <p> Service Name Generator for Spring Bean ID </p>
 *
 * @author Imam
 */
public class CompScanNameGenerator implements BeanNameGenerator {
    public String generateBeanName(BeanDefinition beanDefinition, BeanDefinitionRegistry beanDefinitionRegistry) {
        String className = beanDefinition.getBeanClassName();
        if (className.endsWith("Impl")) {
            className = className.substring(className.lastIndexOf(".") + 1, className.indexOf("Impl"));
        }
        return StringUtils.uncapitalize(className);
    }
}
