/**
 * @author Sam Mayfield (pickleroot)
 */

package edu.gcc.wafflehouse;

public class Course {
    public String name;
    public int code;
    public String department;
    public Professor prof;
    public int creditHours;
    public int capacity;
    public enum dayOfWeek {MWF, TR, M, T, W, R, F, MW};
    public int year;
    public int semester;
    public enum startTime {};
    public enum endTime {};

}
