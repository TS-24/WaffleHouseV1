package edu.gcc.wafflehouse;

import java.util.ArrayList;

public class Schedule {
    private ArrayList<Course> schedule;
    private Student student;

    public Schedule(ArrayList<Course> schedule, Student s) {
        this.schedule = schedule;
        this.student = s;
    }

    public Schedule() {
        this.schedule = new ArrayList<Course>();
        this.student = new Student();
    }

    public ArrayList<Course> getSchedule() {
        return schedule;
    }
    public void addCourse(Course c) {
        schedule.add(c);
    }

}
