package com.xybase.app.domain;

public class User {
    /**
     * This field was generated by Apache iBATIS ibator.
     * This field corresponds to the database column user.id
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    private Integer id;

    /**
     * This field was generated by Apache iBATIS ibator.
     * This field corresponds to the database column user.fname
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    private String fname;

    /**
     * This field was generated by Apache iBATIS ibator.
     * This field corresponds to the database column user.lname
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    private String lname;

    /**
     * This field was generated by Apache iBATIS ibator.
     * This field corresponds to the database column user.age
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    private Integer age;

    /**
     * This field was generated by Apache iBATIS ibator.
     * This field corresponds to the database column user.country
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    private String country;

    /**
     * This field was generated by Apache iBATIS ibator.
     * This field corresponds to the database column user.status
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    private String status;

    /**
     * This field was generated by Apache iBATIS ibator.
     * This field corresponds to the database column user.gender
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    private String gender;

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method returns the value of the database column user.id
     *
     * @return the value of user.id
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public Integer getId() {
        return id;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method sets the value of the database column user.id
     *
     * @param id the value for user.id
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method returns the value of the database column user.fname
     *
     * @return the value of user.fname
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public String getFname() {
        return fname;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method sets the value of the database column user.fname
     *
     * @param fname the value for user.fname
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public void setFname(String fname) {
        this.fname = fname == null ? null : fname.trim();
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method returns the value of the database column user.lname
     *
     * @return the value of user.lname
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public String getLname() {
        return lname;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method sets the value of the database column user.lname
     *
     * @param lname the value for user.lname
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public void setLname(String lname) {
        this.lname = lname == null ? null : lname.trim();
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method returns the value of the database column user.age
     *
     * @return the value of user.age
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public Integer getAge() {
        return age;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method sets the value of the database column user.age
     *
     * @param age the value for user.age
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public void setAge(Integer age) {
        this.age = age;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method returns the value of the database column user.country
     *
     * @return the value of user.country
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public String getCountry() {
        return country;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method sets the value of the database column user.country
     *
     * @param country the value for user.country
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public void setCountry(String country) {
        this.country = country == null ? null : country.trim();
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method returns the value of the database column user.status
     *
     * @return the value of user.status
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public String getStatus() {
        return status;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method sets the value of the database column user.status
     *
     * @param status the value for user.status
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method returns the value of the database column user.gender
     *
     * @return the value of user.gender
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public String getGender() {
        return gender;
    }

    /**
     * This method was generated by Apache iBATIS ibator.
     * This method sets the value of the database column user.gender
     *
     * @param gender the value for user.gender
     *
     * @ibatorgenerated Sat Jan 29 22:57:50 ICT 2011
     */
    public void setGender(String gender) {
        this.gender = gender == null ? null : gender.trim();
    }
}