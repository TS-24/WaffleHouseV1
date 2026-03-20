package edu.gcc.wafflehouse;


/**
 * Filter based on the year a course is offered, e.g., 2024, 2025
 * @author Ina Tang
 */
public class YearFilter extends Filter {

    public YearFilter(Object year) {
        super(year);
    }

    /**
     * Returns true if the course's year matches the given year
     */
    @Override
    protected boolean apply(Course course) {
        return course.getYear() == Integer.parseInt((String) getInput());
    }
}
