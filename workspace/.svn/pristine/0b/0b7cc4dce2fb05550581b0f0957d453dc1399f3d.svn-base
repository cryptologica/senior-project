package com.turingpoint.controller.auth;

import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

/**
 * Class for sending an email message
 * 
 * @author scotthadley
 */
public class SendEmail {

	public static void sendEmail(String emailAddress, String subject, String emailBody) {
		sendMessage(emailAddress, subject, emailBody);
	}
	
	/**
	 * Send an email that contains our Logo, a message HTML body, and a custom button
	 * @param emailAddress - The email address of the person to send the message to
	 * @param subject - Email subject text
	 * @param messageBodyHTML - The body of the message, can be HTML or plain text
	 * @param buttonText - The text placed inside the button (is the button display text)
	 * @param buttonURL - The URL the user is directed to if they click the button
	 */
	public static void sendEmailWithButton(String emailAddress, String subject, String messageBodyHTML, String buttonText, String buttonURL){
		String html = getButtonHTML(messageBodyHTML, buttonText, buttonURL);
		sendMessage(emailAddress, subject, html);
	}
	
	private static void sendMessage(String emailAddress, String subject, String emailBody){
		final String username = "turingpointteam";
		final String password = "TuringPointID10T";

		Properties props = new Properties();
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.port", "587");

		Session session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});

		try {

			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("turingpointteam@gmail.com"));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailAddress));
			message.setSubject(subject);
			message.setContent(emailBody, "text/html; charset=utf-8");

			Transport.send(message);

		} catch (MessagingException e) {
			throw new RuntimeException(e);
		}
	}
	
	
	private static String getButtonHTML(String messageBodyHTML, String buttonText, String buttonURL){
		String htmlText = "<img style=\"width: 300px; padding-left: 30px;\" src=\"https://turingpointpolling.com/img/logoWide4.png\">";
		htmlText += "<div style=\"padding-left : 50px; \">" + messageBodyHTML + "</div>";
		htmlText += "<div style=\"padding-left: 300px;\">" + "<!--[if mso]>"
				+ "<v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\""
				+ "href=\"" + buttonURL
				+ "\" style=\"height:40px;v-text-anchor:middle;width:200px;\" arcsize=\"10%\" strokecolor=\"#1e3650\" fill=\"t\">"
				+ "<v:fill type=\"tile\" src=\"https://i.imgur.com/0xPEf.gif\" color=\"#2697fd\" />"
				+ "<w:anchorlock/>"
				+ "<center style=\"color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:bold;\">"+ buttonText +"</center>"
				+ "</v:roundrect>" + "<![endif]-->" + "<a href=\"" + buttonURL + "\""
				+ "style=\"background-color: #2697fd; border: 1px solid #1e3650;"
				+ "border-radius: 4px; color: #ffffff; display: inline-block; font-family: sans-serif; font-size: 13px; font-weight: bold;"
				+ "line-height: 40px; text-align: center; text-decoration: none; width: 200px; -webkit-text-size-adjust: none; mso-hide: all;\">"
				+ buttonText + "</a>" + "</div>";
		return htmlText;
	}
}
