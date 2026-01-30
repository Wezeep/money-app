package com.wezeep.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    @Value("${wezeep.security.rate-limit.requests-per-minute:10}")
    private int requestsPerMinute;

    @Value("${wezeep.security.rate-limit.requests-per-hour:100}")
    private int requestsPerHour;

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Bean
    public Map<String, Bucket> rateLimitBuckets() {
        return cache;
    }

    public Bucket resolveBucket(String key) {
        return cache.computeIfAbsent(key, k -> {
            Bandwidth limit = Bandwidth.classic(requestsPerMinute, Refill.intervally(requestsPerMinute, Duration.ofMinutes(1)));
            return Bucket.builder()
                    .addLimit(limit)
                    .build();
        });
    }
}
