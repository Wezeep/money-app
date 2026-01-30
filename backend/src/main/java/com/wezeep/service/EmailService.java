package com.wezeep.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:no-reply@wezeep.com}")
    private String fromEmail;

    @Value("${wezeep.app.url:https://wezeep.app}")
    private String appUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Reset Your Wezeep Password");
        message.setText("Click the link below to reset your password:\n\n" +
                appUrl + "/reset-password?token=" + token + "\n\n" +
                "This link will expire in 1 hour.");
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Welcome to Wezeep!");
        message.setText("Hi " + name + ",\n\nWelcome to Wezeep! Start sending money worldwide today.");
        mailSender.send(message);
    }
}
