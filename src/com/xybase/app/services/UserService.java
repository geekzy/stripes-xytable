/*
 * File: com.xybase.app.services.UserService.java
 *
 * XYTABLE
 * Licensed Material - Property of XYBASE.
 * Copyright (C) 2011 PT. XYBASE Indonesia. All rights reserved.
 *
 * Version 0.1
 */
package com.xybase.app.services;

import com.xybase.app.domain.User;
import com.xybase.app.domain.UserExample;
import com.xybase.utils.GridUtil;

import java.util.List;

/**
 * <p> User Service Interface </p>
 *
 * @author Imam
 */
public interface UserService {
    void getAllUserPaging(GridUtil grid);
    List<User> getAllUser(UserExample ex, int start, int max);
    int countAllUser();
}
