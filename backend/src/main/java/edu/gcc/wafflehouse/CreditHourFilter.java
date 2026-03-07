package edu.gcc.wafflehouse;

import java.util.ArrayList;

/**
 * @author Ina Tang
 */
public class CreditHourFilter extends Filter<Integer> {

    /**
     * Returns the courses with the given number of credit hours
     */
    @Override
    public ArrayList<Course> apply(ArrayList<Course> courses, Integer pattern) {
        ArrayList<Course> matchingCourses = new ArrayList<>();
        for (Course course : courses) {
            if (course.getCreditHours() == pattern) {
                matchingCourses.add(course);
            }
        }
        return matchingCourses;
    }
}
