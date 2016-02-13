package com.lastminute.space.service

import com.lastminute.space.domain.Event
import com.lastminute.space.domain.ChatMessage
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service

@Service
class MessageService {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate

    public void sendMessage(ChatMessage message){
        simpMessagingTemplate.convertAndSend("/topic/chat".toString(), message)
    }

    public void sendEvent(Event event){
        simpMessagingTemplate.convertAndSend("/topic/events".toString(), event)
    }
}
