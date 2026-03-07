package edu.gcc.wafflehouse;

import java.util.ArrayList;

/**
 * @author Ina Tang
 */
public class Student extends Profile {
    private String firstName;
    private String lastName;
    private String major;
    private Advisor advisor;

    private Schedule schedule;

    public Schedule getSchedule() {
        return schedule;
    }

}
