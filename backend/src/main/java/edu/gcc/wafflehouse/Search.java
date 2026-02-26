package edu.gcc.wafflehouse;
import java.time.LocalTime;
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

    public ArrayList<Course> getCourses() {
        return courses;
    }

    public Course getCourseByID (int courseID) {

        // TODO: make the course search algorithm more efficient.
        for (Course c : courses) {
            if (c.getId() == courseID) {
                return c;
            }
        }
        return null;
    }

    public void AddTestCourses() {
        ArrayList<Timeslot> csTimes = new ArrayList<>();
        csTimes.add(new Timeslot('M', LocalTime.of(9, 0), LocalTime.of(10, 15)));
        csTimes.add(new Timeslot('W', LocalTime.of(9, 0), LocalTime.of(10, 15)));
        Course cs101 = new Course(
                "Introduction to Computer Science",
                101,
                "CS",
                new Professor("Dr. Smith"),
                3,
                30,
                2025,
                1,
                csTimes
        );

        ArrayList<Timeslot> mathTimes = new ArrayList<>();
        mathTimes.add(new Timeslot('T', LocalTime.of(11, 0), LocalTime.of(12, 15)));
        mathTimes.add(new Timeslot('R', LocalTime.of(11, 0), LocalTime.of(12, 15)));

        Course math201 = new Course(
                "Calculus II",
                201,
                "MATH",
                new Professor("Dr. Johnson"),
                4,
                35,
                2025,
                1,
                mathTimes
        );

        ArrayList<Timeslot> histTimes = new ArrayList<>();
        histTimes.add(new Timeslot('M', LocalTime.of(14, 0), LocalTime.of(15, 15)));
        histTimes.add(new Timeslot('W', LocalTime.of(14, 0), LocalTime.of(15, 15)));

        Course hist150 = new Course(
                "World History",
                150,
                "HIST",
                new Professor("Dr. Lee"),
                3,
                40,
                2025,
                1,
                histTimes
        );

    }}
