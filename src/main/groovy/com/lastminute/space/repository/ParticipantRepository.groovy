package com.lastminute.space.repository

import org.springframework.stereotype.Service

import java.util.concurrent.ConcurrentHashMap

@Service
class ParticipantRepository {
    ConcurrentHashMap<String, String> map = new ConcurrentHashMap<String, String>()

    public void addParticipant(String sessionId, String email){
        map.put(sessionId, email)
    }

    public void removeParticipant(String sessionId){
        map.remove(sessionId)
    }

    public String getParticipant(String sessionId){
        return map.get(sessionId)
    }

    public Collection<String> getAllParticipants()
    {
        return map.values()
    }
}
