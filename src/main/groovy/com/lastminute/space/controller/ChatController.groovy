package com.lastminute.space.controller
import com.lastminute.space.domain.ChatMessage
import com.lastminute.space.repository.ParticipantRepository
import com.lastminute.space.service.MessageService
import groovy.json.JsonBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class ChatController {
    @Autowired
    private MessageService messageService
    @Autowired
    private ParticipantRepository participantRepository

    @RequestMapping("/hello")
    public @ResponseBody String hello() {
        return "Hello world!"
    }

    @MessageMapping("/message")
    public void chatMessage(@Payload ChatMessage message) {
        ChatMessage mess = new ChatMessage(
                email: message.email,
                text: message.text
        )
        messageService.sendMessage(message)
    }

    @RequestMapping("/participants")
    public @ResponseBody String participants() {
        return new JsonBuilder(participantRepository.getAllParticipants()).toPrettyString()
    }
}
