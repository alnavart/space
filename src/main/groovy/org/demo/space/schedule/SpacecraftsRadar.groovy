package org.demo.space.schedule

import org.demo.space.domain.Event
import org.demo.space.service.MessageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.client.discovery.DiscoveryClient
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

import java.util.logging.Logger

@Component
class SpacecraftsRadar {

    Logger log = Logger.getLogger(this.class.toString())
    @Autowired
    private DiscoveryClient discoveryClient
    @Autowired
    private MessageService messageService
    @Value('${spring.application.name}')
    private String myself;

    List currentSpacecrafts = []

    @Scheduled(fixedRate = 10000l)
    public void detectSpacecrafts() {
        List newSpacecraftsLecture = readSpacecrafts()
        checkAndNotifyChanges(newSpacecraftsLecture)
        currentSpacecrafts = newSpacecraftsLecture
    }

    public List<String> getCurrentSpacecrafts() {
        return currentSpacecrafts
    }

    private void checkAndNotifyChanges(List<String> newSpacecraftLecture) {
        List spacecraftsDown = currentSpacecrafts - newSpacecraftLecture
        List spacecraftsNew = newSpacecraftLecture - currentSpacecrafts
        spacecraftsDown ? notifyDownSpacecrafts(spacecraftsDown) : null
        spacecraftsNew ? notifyNewSpacecrafts(spacecraftsNew) : null
    }

    private void notifyNewSpacecrafts(List<String> newSpacecrafts) {
        newSpacecrafts.each { newSpacecraft -> notifyNewSpacecraft(newSpacecraft) }
    }

    private void notifyNewSpacecraft(String newSpacecraftName) {
        log.info("Detected new spacecraft: " + newSpacecraftName)
        Event newSpacecraftEvent = new Event(
                type: "NEW_SPACECRAFT",
                data: newSpacecraftName
        )
        messageService.sendEvent(newSpacecraftEvent)
    }

    private void notifyDownSpacecrafts(List<String> spacecraftsDown) {
        spacecraftsDown.each { spacecraftDown -> notifyDownSpacecraft(spacecraftDown) }

    }

    private void notifyDownSpacecraft(String spacecraftDown) {
        log.info("Detected down spacecraft: " + spacecraftDown)
        Event spacecraftDownEvent = new Event(
                type: "SPACECRAFT_DOWN",
                data: spacecraftDown
        )
        messageService.sendEvent(spacecraftDownEvent)
    }

    private List<String> readSpacecrafts() {
        return discoveryClient.getServices() - [myself]
    }
}
