package edu.gcc.wafflehouse;

import java.time.LocalTime;

/**
 * Filter by day of the week, earliest start time, and latest end time
 * @author Ina Tang
 */
public class TimeFilter extends Filter {

    /**
     * Initialize timeslot
     * @param timeslot Day of the week, earliest start time, latest end time
     */
    public TimeFilter(Timeslot timeslot) {
        super(timeslot);
    }

    /**
     * Filter by timeslot
     * @param course What you expect
     * @return true if course **contains** a timeslot that sits inside the given timeslot
     */
    @Override
    public boolean apply(Course course) {
        Timeslot thisTs = (Timeslot) getInput();
        char desiredDay = thisTs.getDay();
        LocalTime desiredStart = thisTs.getstart_time();
        LocalTime desiredEnd = thisTs.getend_time();

        for (Timeslot ts : course.getTimes()) {
            // If day filter is set, check that the course has a slot on that day
            boolean dayMatches = (desiredDay == '\0') || (ts.getDay() == desiredDay);
            if (!dayMatches) continue;

            // If time range is set, check that the slot fits within it
            boolean timeMatches = true;
            if (desiredStart != null && ts.getstart_time().isBefore(desiredStart)) {
                timeMatches = false;
            }
            if (desiredEnd != null && ts.getend_time().isAfter(desiredEnd)) {
                timeMatches = false;
            }

            if (dayMatches && timeMatches) return true;
        }
        return false;
    }
}
