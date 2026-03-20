package edu.gcc.wafflehouse;

/**
 * Helper class for handling filter requests
 * @author Ina Tang
 */
public class FilterRequest {
    public String name;
    public String prof;
    public String dept;
    public Timeslot time;
    public String credits;
    public String semester;
    public String year;
    // All fields are nullable — null means "don't filter on this"
}
