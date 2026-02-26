package edu.gcc.wafflehouse;

import io.javalin.Javalin;

/**
 * @author Tim
 */
public class Driver {

    public static void main(String[] args) {

        // create objects for search and schedule
        Search search = new Search();
        Schedule schedule = new Schedule();

        Javalin app = Javalin.create(
                // TODO: add the location of FRONTEND files to the config: (config -> { config.staticFiles.add("public"); })
        ).start(7000);

        /* COURSE REQUESTS */
        app.get("/course", ctx -> ctx.json(search.getCourses()));

        /* SCHEDULE REQUESTS */
        app.get("/schedule", ctx -> ctx.json(schedule.getSchedule()));
        app.post("/schedule", ctx -> {

        });

    }

}
