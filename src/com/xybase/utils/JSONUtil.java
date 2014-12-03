/*
 * File: com.miistwo.pa.common.JSONUtil.java
 *
 * XYCommon - JSON
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.utils;

import flexjson.JSONSerializer;
import flexjson.transformer.DateTransformer;

import java.util.*;

/**
 * <p>A generic wrapper to serialize objects into json string.</p>
 * <p>Implementation is using flexjson</p>
 *
 * <p>This class is adapted from JSONUtil in mida-ev-ext project</p>
 *
 * <p>Revision Information:<br/><i>
 * $Date$<br/>
 * $Revision$<br/>
 * $LastChangedBy$
 * </i></p>
 *
 * @author imam
 */
public class JSONUtil {
    private Map<String, Object> data;
	private Set<String> dateFields;
    private String[] excludes;

	public JSONUtil(){
		data = new HashMap<String, Object>();
	}

	/**
	 * add date field name to be transform
	 * @param fieldName the field name
	 */
	public void addDateField(String fieldName){
		if(dateFields == null){
			dateFields = new HashSet<String>();
		}
		dateFields.add(fieldName);
	}

	/**
	 * add the data to be transform.
	 * @param key the key value
	 * @param value the object
	 */
	public void addData(String key, Object value){
		data.put(key, value);
	}


	/**
	 * Set the mapped data
	 * @param data the data map
	 */
	public void setData(Map<String, Object>  data ){
		this.data=data;
	}

	/**
	 * serialize json object
	 * @return json object
	 */
	public String serialize(){
		JSONSerializer json = new JSONSerializer();
		if((dateFields != null) && (dateFields.size() > 0)){
			DateTransformer transformer = new DateTransformer(CommonConstants.DATE_FORMAT);
			for (String field : dateFields) {
				json.transform(transformer, field);
			}
		}

        List<String> list = new ArrayList<String>();
        if (excludes != null) {
            list.addAll(Arrays.asList(excludes));
        }
        list.add("*.class");

		return json.exclude(list.toArray(new String[list.size()])).deepSerialize(data);
	}

    public String[] getExcludes() {
        return excludes;
    }

    public void setExcludes(String... excludes) {
        this.excludes = excludes;
    }
}
