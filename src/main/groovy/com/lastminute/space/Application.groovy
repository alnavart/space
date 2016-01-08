package com.lastminute.space

import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        System.setProperty("spring.devtools.restart.enabled", "true");
        System.setProperty("spring.devtools.restart.exclude", "static/js/stop.js,static/js/sockjs*");
        SpringApplication.run(Application.class, args)
    }

}