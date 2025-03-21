package com.celeste.remedicard.io.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    private final String mailFrom;

    private final String applicationMailAddress;

    public EmailService(JavaMailSender javaMailSender,
                        @Value("${email.from}")String mailFrom,
                        @Value("${spring.mail.username}") String applicationMailAddress) {
        this.javaMailSender = javaMailSender;
        this.mailFrom = mailFrom;
        this.applicationMailAddress = applicationMailAddress;
    }

    public void sendResetPasswordEmail(String email, String token){
        try {
            MimeMessage message = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Password Reset Code");
            helper.setText("\n Here is your password reset code: \n" + token + "\nNOTE: Ignore this message if you have no intention for the password reset operation!\n", true);
            helper.setFrom(mailFrom);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error sending email", e);
        }
    }


    public void sendContactUsEmail(String username, String email, String subject, String content){
        try {
            MimeMessage message = javaMailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(applicationMailAddress);
            helper.setSubject("CONTACT US: " + subject);
            helper.setText("\n Here is a new message from " + username + "(" + email + ") with subject \"" + subject + "\"" + ":" + "\n\n\n" + content + "\n", true);
            helper.setFrom(mailFrom);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error sending email", e);
        }
    }
}
