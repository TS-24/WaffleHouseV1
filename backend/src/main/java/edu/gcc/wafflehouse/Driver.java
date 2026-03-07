package edu.gcc.wafflehouse;

import io.javalin.Javalin;

/**
 * Controller / Router
 * @author Tim (last edited: Ina Tang)
 */
public class Driver {

    public static void registerRoutes(Javalin app) {

        // Create objects for search, student, and schedule
        Search search = new Search();
        Student student = new Student();
        Schedule schedule = student.getSchedule();

        /* TODO: Search (this doesn't work. Consider a query approach?) */
        app.get("/course", ctx -> ctx.json(search.getCourses()));

        // Get schedule
        app.get("/schedule", ctx -> ctx.json(schedule));

        // Add course to schedule
        app.post("/course", ctx -> {
            Course course = ctx.bodyAsClass(Course.class);
            schedule.addCourse(course);
        });

        // TODO: Delete course from schedule

    }

}
