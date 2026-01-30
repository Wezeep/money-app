package com.wezeep;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.oauth2.client.autoconfigure.OAuth2ClientAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = OAuth2ClientAutoConfiguration.class)
@EnableCaching
@EnableAsync
@EnableScheduling
public class WezeepApplication {

    public static void main(String[] args) {
        SpringApplication.run(WezeepApplication.class, args);
    }
}
