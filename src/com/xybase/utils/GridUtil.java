/*
 * File: gcom.xybase.utils.GridUtil.java
 *
 * XYCommon -
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.utils;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import java.util.List;

/**
 * <p>This class is a grid wrapper to be used with the xytable.js component.</p>
 * <p>This class is extending from JSONUtil so it supports json output by serializing this class</p>
 *
 * <p>Revision Information:<br/><i>
 * $Date$<br/>
 * $Revision$
 * $LastChangedBy$
 * </i></p>
 *
 * @author Imam
 */
public class GridUtil extends JSONUtil {
    /**
     * Current page, default to 1
     */
    private int page;
    /**
     * Maximum rows to display, default to CommonConstants.ROWS_PER_PAGE
     */
    private int rows;
    /**
     * The actual result list
     */
    private List<?> resultList;
    /**
     * Total records available
     */
    private int totalRecords;
    /**
     * Current offset, starts from 0
     */
    private int offset;
    /**
     * Sort field name
     */
    private String sortx;
    /**
     * Sort direction, 1 - ASC; -1 - DESC
     */
    private int sortd;

    public GridUtil() {
        super();
    }

    public int getPage() {
        page = Math.round((offset/getRows()) + 0.5f);
        return page > getTotalPages() ? getTotalPages() : page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getRows() {
        rows = rows != 0 ? rows : CommonConstants.ROWS_PER_PAGE;
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    public int getTotalPages() {
        return Math.round((totalRecords/getRows()) + 0.5f);
    }

    public int getOffset() {
        return offset < 0 ? 0 : offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public List<?> getResultList() {
        return resultList;
    }

    public void setResultList(List<?> resultList) {
        this.resultList = resultList;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }

    public String getSortx() {
        return sortx;
    }

    public void setSortx(String sortx) {
        this.sortx = sortx;
    }

    public int getSortd() {
        return sortd == 0 ? 1 : sortd;
    }

    public void setSortd(int sortd) {
        this.sortd = sortd;
    }

    public String getOrderClause() {
        return getSortx() + (getSortd() == 1 ? " ASC" : " DESC");
    }

    /**
     * Serialize this class into json format
     *
     * @return json string represented the grid 
     */
	@Override
    public String serialize() {
        addData("rows", getResultList());
        addData("page", getPage());
        addData("records", getTotalRecords());
        addData("total", getTotalPages());
        addData("sortx", getSortx());
        addData("sortd", getSortd());
        return super.serialize();
    }

	@Override
	public String toString(){
		return ToStringBuilder.reflectionToString(this, ToStringStyle.MULTI_LINE_STYLE);
	}
}
