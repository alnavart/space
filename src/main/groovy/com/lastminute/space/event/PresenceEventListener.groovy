package com.lastminute.space.event

import com.lastminute.space.domain.Event
import com.lastminute.space.repository.ParticipantRepository
import com.lastminute.space.service.MessageService
import org.springframework.context.ApplicationEvent
import org.springframework.context.ApplicationListener
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.web.socket.messaging.SessionConnectEvent
import org.springframework.web.socket.messaging.SessionDisconnectEvent

public class PresenceEventListener implements ApplicationListener<ApplicationEvent> {
    ParticipantRepository participantRepository
    MessageService messageService

    public void onApplicationEvent(ApplicationEvent event) {
        if(event instanceof SessionConnectEvent) {
            handleSessionConnected((SessionConnectEvent) event)
        } else if(event instanceof SessionDisconnectEvent) {
            handleSessionDisconnect((SessionDisconnectEvent) event)
        }
    }

    private void handleSessionConnected(SessionConnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage())
        String email = headers.getHeader("nativeHeaders")["X-Email"]?.get(0)
        participantRepository.addParticipant(headers.getSessionId(), email)
        Event chatEvent = new Event(
                type: "CONNECT",
                email: email
        )
        messageService.sendEvent(chatEvent)

    }

    private void handleSessionDisconnect(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage())
        String sessionId = headers.getSessionId()
        String email = participantRepository.getParticipant(sessionId)
        participantRepository.removeParticipant(sessionId)

        Event chatEvent = new Event(
                type: "DISCONNECT",
                email: email
        )

        messageService.sendEvent(chatEvent)
    }
}
