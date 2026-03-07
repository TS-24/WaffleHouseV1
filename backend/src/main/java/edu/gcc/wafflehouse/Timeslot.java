package edu.gcc.wafflehouse;

import java.time.LocalTime;

public class Timeslot {
    private char day;
    private LocalTime startTime;
    private LocalTime endTime;

    public Timeslot(char day, LocalTime startTime, LocalTime endTime) {
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public char getDay() {
        return day;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
}
