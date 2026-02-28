package com.netflix.clone.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.netflix.clone.exception.EmailSendingException;
import com.netflix.clone.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger =
            LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendVerificationEmail(String toEmail, String token) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Netflix Clone - Verify Your Email");

            String verificationLink =
                    frontendUrl + "/verify-email?token=" + token;

            message.setText(
                    "Welcome to Netflix Clone!\n\n"
                    + "Please verify your email:\n\n"
                    + verificationLink
                    + "\n\nThis link expires in 24 hours."
            );

            mailSender.send(message);

            logger.info("Verification email sent to {}", toEmail);

        } catch (Exception ex) {

            logger.error(
                    "Failed to send verification email to {}",
                    toEmail,
                    ex
            );

            throw new EmailSendingException(
                    "Failed to send verification email"
            );
        }
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String token) {

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Netflix Clone - Password Reset");

            String resetLink =
                    frontendUrl + "/reset-password?token=" + token;

            message.setText(
                    "Reset your password using this link:\n\n"
                    + resetLink
                    + "\n\nThis link expires in 1 hour."
            );

            mailSender.send(message);

            logger.info("Password reset email sent to {}", toEmail);

        } catch (Exception ex) {

            logger.error(
                    "Failed to send password reset email to {}",
                    toEmail,
                    ex
            );

            throw new EmailSendingException(
                    "Failed to send password reset email"
            );
        }
    }
}