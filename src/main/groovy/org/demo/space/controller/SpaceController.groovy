package org.demo.space.controller

import org.demo.space.communication.HearingAid
import org.demo.space.domain.Message
import org.demo.space.schedule.SpacecraftsRadar;
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpaceController {

    @Autowired
    HearingAid hearingAid
    @Autowired
    SpacecraftsRadar spacecraftsRadar
    @Value('${services.eureka.url}')
    String eurekaUrl;

    @RequestMapping("/all-spacecrafts")
    List allSpacecrafts() {
        spacecraftsRadar.getCurrentSpacecrafts()
    }

    @RequestMapping("/eureka-url")
    String eurekaUrl() {
        eurekaUrl
    }

    @RequestMapping("/answer")
    Message answer() {
        new Message("Nothing.. but also Satellites, Planets, Asteroids, Comets... and Alien life?", "Infinite space")
    }

    @RequestMapping("/say-hello/{spacecraft}")
    Message firstService(@PathVariable String spacecraft) {
        hearingAid.getAnswerFrom(spacecraft)
    }
}
