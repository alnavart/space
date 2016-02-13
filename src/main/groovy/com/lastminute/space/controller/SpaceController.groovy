package com.lastminute.space.controller;

import com.lastminute.space.communication.HearingAid;
import com.lastminute.space.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpaceController {

    @Autowired
    HearingAid hearingAid
    @Autowired
    private DiscoveryClient discoveryClient

    @RequestMapping("/all-services")
    List services() {
         discoveryClient.getServices()
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
