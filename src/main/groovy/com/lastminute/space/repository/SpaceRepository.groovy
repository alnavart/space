package com.lastminute.space.repository

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.cloud.client.discovery.DiscoveryClient
import org.springframework.stereotype.Component

@Component
class SpaceRepository {

    @Autowired
    private DiscoveryClient discoveryClient

    public getAllSpacecrafts()
    {
        return discoveryClient.getServices()
    }
}
