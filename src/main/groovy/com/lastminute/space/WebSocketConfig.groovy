package com.lastminute.space

import com.lastminute.space.event.PresenceEventListener
import com.lastminute.space.interceptor.ChannelInterceptor
import com.lastminute.space.repository.ParticipantRepository
import com.lastminute.space.service.MessageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.config.ChannelRegistration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {
    @Autowired
    MessageService messageService

    @Autowired
    ParticipantRepository participantRepository

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic/")
        config.setApplicationDestinationPrefixes("/app")
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/message").withSockJS()
    }

    @Bean
    public PresenceEventListener presenceEventListener(SimpMessagingTemplate messagingTemplate) {
        return new PresenceEventListener(participantRepository: participantRepository, messageService: messageService)
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.setInterceptors(
                new ChannelInterceptor(
                        participantRepository: participantRepository))
    }

}
