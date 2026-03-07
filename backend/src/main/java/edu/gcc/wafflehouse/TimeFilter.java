package edu.gcc.wafflehouse;

import java.time.LocalTime;
import java.util.ArrayList;

/**
 * @author Ina Tang
 */
public class TimeFilter extends Filter<Timeslot> {
    /**
     * Filter by timeslot
     * @param courses What you expect
     * @param timeslot Day of the week, earliest start time, latest end time
     * @return Courses that **contains** a timeslot that sits inside the given timeslot
     */
    @Override
    public ArrayList<Course> apply(ArrayList<Course> courses, Timeslot timeslot) {
        ArrayList<Course> matchingCourses = new ArrayList<>();
        for (Course course : courses) {
            for (Timeslot ts : course.getTimes()) {
                // If the course has a slot on one of the desired day of the week
                if (ts.getDay() == timeslot.getDay()) {
                    // If that slot is in between the desired start and end time
                    LocalTime desiredStart = timeslot.getStartTime();
                    LocalTime desiredEnd = timeslot.getEndTime();
                    if (!ts.getStartTime().isAfter(desiredStart) &&
                            !ts.getEndTime().isBefore(desiredEnd)) {
                        matchingCourses.add(course);
                        break;
                    }
                }
            }
        }
        return matchingCourses;
    }
}
