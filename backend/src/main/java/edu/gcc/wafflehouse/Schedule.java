package edu.gcc.wafflehouse;

import java.util.ArrayList;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.File;

/**
 * Interface for organizing courses / wrapper class for ArrayList of Courses
 * @author Ina Tang
 */
public class Schedule {

    private ArrayList<Course> courses;

    // Constructors
    public Schedule() {
        this.courses = new ArrayList<Course>();
    }

    public Schedule(ArrayList<Course> courses) {
        this.courses = courses;
    }

    // Methods
    public ArrayList<Course> getCourses() {
        return new ArrayList<>(courses);
    }

    public void addCourse(Course c) {
        courses.add(c);
    }

    public void removeCourse(Course c) {
        courses.remove(c);
    }
  
    public void saveSchedule() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        mapper.writeValue(new File("../../resources/schedule.csv"), courses);
    }

    public Schedule loadSchedule() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(new File("../../resources/schedule.csv"), Schedule.class);
    }
}
