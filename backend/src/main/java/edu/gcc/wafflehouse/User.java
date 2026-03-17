package edu.gcc.wafflehouse;

import java.util.ArrayList;

enum Year {
    FF, SO, JR, SR;
}

public class User {

    private String firstName;
    private String middleName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private Year year;
    private Schedule pastCourses;
    private Schedule currentCourses;
    private Schedule potentialCourses;

    public User(String firstName,
                String middleName,
                String lastName,
                String username,
                String email,
                String password,
                Year year) {
    }

    public String getFirstName() {
        return firstName;
    }
    public String getMiddleName() {
        return middleName;
    }
    public String getLastName() {
        return lastName;
    }
    public String getUsername() {
        return username;
    }
    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }
    public Year getYear() {
        return year;
    }
    public Schedule getPastCourses() {
        return pastCourses;
    }
    public Schedule getCurrentCourses() {
        return currentCourses;
    }
    public  Schedule getPotentialCourses() {
        return potentialCourses;
    }

    public static User getUser(int id) {
        // Need to implement this once we have a DB
        return null;
    }
    public static void setUser(User user) {

    }
    public static void addUser(User user) {

    }
    public static User removeUser(int id) {
        return null;
    }

}
