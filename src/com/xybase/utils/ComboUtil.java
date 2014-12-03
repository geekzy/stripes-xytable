/*
 * File: com.miistwo.pa.common.ComboUtil.java
 *
 * XYCommon - JSON
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.utils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;

/**
 * <p>This class represent a helper for building JSON string for Combo</p>
 *
 * @author imam
 */
public class ComboUtil<T> extends JSONUtil {
    private static final String DEFAULT_LABEL = "--- Please select ---";
    private String id;
    private String label;
    private String defaultLabel;
    private int max;
    private Collection<T> list;
    private Class<?> clazz;

    public ComboUtil(Class<?> clazz, Collection<T> list, String id, String label) {
        this(clazz, list, id, label, DEFAULT_LABEL);
    }

    public ComboUtil(Class<?> clazz, Collection<T> list, String id, String label, String defaultLabel) {
        this(clazz, list, id, label, DEFAULT_LABEL, -1);
    }

    public ComboUtil(Class<?> clazz, Collection<T> list, String id, String label, String defaultLabel, int max) {
        super();
        // set class reference
        this.clazz = clazz;
        // set property name for id
        this.id = id;
        // set property name for label
        this.label = label;
        // set default label
        this.defaultLabel = defaultLabel;
        // set max label string length
        this.max = max;
        // set collection
        this.list = list;
    }

    @Override
    public String serialize() { return serialize(true); }
    public String serialize(boolean withDefault) {
        List<Map<String, Object>> options = new ArrayList<Map<String, Object>>();

        // add default label on first option
        if (withDefault) {
            Map<String, Object> defaultOption = new HashMap<String, Object>(2);
            defaultOption.put("id", "");
            defaultOption.put("title", getDefaultLabel());
            defaultOption.put("label", getDefaultLabel());
            options.add(defaultOption);
        }
        // loop through the colletion
        for (T obj : list) {
            Map<String, Object> option = new HashMap<String, Object>(2);
            try {
                // get id based on property passed on argument
                Method getId = clazz.getMethod(StringUtils.toGetterName(id));
                option.put("id", getId.invoke(obj));

                // get label based on property passed on argument
                Method getLabel = clazz.getMethod(StringUtils.toGetterName(label));
                String label = String.valueOf(getLabel.invoke(obj));
                // put title
                option.put("title", label);
                // put label
                option.put("label", label);
                if (max != -1) {
                    option.put("label", label.length() > max ? (label.substring(0, max - 1) + "...") : label);
                }

                // put into list
                options.add(option);
            } catch (NoSuchMethodException ignored) {
            } catch (InvocationTargetException ignored) {
            } catch (IllegalAccessException ignored) { }
        }
        // put list into object options
        addData("options", options);
        return super.serialize();
    }

    public String getDefaultLabel() {
        return defaultLabel == null ? DEFAULT_LABEL : defaultLabel;
    }

    public void setDefaultLabel(String defaultLabel) {
        this.defaultLabel = defaultLabel;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Collection<T> getList() {
        return list;
    }

    public void setList(Collection<T> list) {
        this.list = list;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }
}
