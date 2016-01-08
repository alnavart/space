package com.lastminute.space.interceptor

import com.lastminute.space.repository.ParticipantRepository
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptorAdapter

class ChannelInterceptor extends ChannelInterceptorAdapter {
    ParticipantRepository participantRepository

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(message)
        if (StompCommand.SUBSCRIBE.equals(headers.getCommand()) ||
                StompCommand.SEND.equals(headers.getCommand())) {
            String participant = participantRepository.getParticipant(headers.getSessionId())

            /** rules **
            if (!participant.endsWith("lastminute.com")) { //rumbo.com or bravofly.com
                throw new IllegalArgumentException("No permission")
            }            **/
        }
        return message
    }
}
