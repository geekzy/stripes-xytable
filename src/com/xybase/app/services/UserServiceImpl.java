/*
 * File: com.xybase.app.services.UserServiceImpl.java
 *
 * XYTABLE
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.app.services;

import com.xybase.app.dao.UserDAO;
import com.xybase.app.domain.User;
import com.xybase.app.domain.UserExample;
import com.xybase.utils.GridUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * <p> User Service Implementation </p>
 *
 * @author Imam
 */
@Service
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private static final Log log = LogFactory.getLog(UserServiceImpl.class);

    @Autowired
    private UserDAO userDAO;

    @Override
    public void getAllUserPaging(GridUtil grid) {
        UserExample ex = new UserExample();
        ex.createCriteria();
        ex.setOrderByClause(grid.getSortx() != null ? grid.getOrderClause() : null);
        List<User> result = getAllUser(ex, grid.getOffset(), grid.getRows());
        grid.setResultList(result);
        grid.setTotalRecords(countAllUser());
    }

    @Override
    public List<User> getAllUser(UserExample ex, int start, int max) {
        if (max == -1) {
            return userDAO.selectByExample(ex);
        }
        return userDAO.selectByExamplePaging(ex, start, max);
    }

    @Override
    public int countAllUser() {
        UserExample ex = new UserExample();
        ex.createCriteria();
        return userDAO.countByExample(ex);
    }
}
