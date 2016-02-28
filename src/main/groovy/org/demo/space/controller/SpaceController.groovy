package org.demo.space.controller;

import org.demo.space.communication.HearingAid
import org.demo.space.repository.SpaceRepository
import org.demo.space.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpaceController {

    @Autowired
    HearingAid hearingAid
    @Autowired
    SpaceRepository spaceRepository

    @RequestMapping("/all-spacecrafts")
    List allSpacecrafts() {
         spaceRepository.getAllSpacecrafts()
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
