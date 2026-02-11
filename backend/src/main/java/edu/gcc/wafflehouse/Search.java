package edu.gcc.wafflehouse;
import java.util.ArrayList;

public class Search {
    private ArrayList<Course> courses;
    private ArrayList<Course> results;
    private ArrayList<Filter> filters;
    private String query;
    private FilterName filtername;
    public enum FilterName {
        Professor, Department, Timeslot, Credits;
    }

    public ArrayList<Course> getFilteredResults() {
        return null;
    }

    public ArrayList<Course> getResults() {
        return results;
    }
}
