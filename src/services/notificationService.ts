import nodemailer from "nodemailer"
import { IUser, NotificationData } from "../types";


class NotificationService{
    private emailTransporter : nodemailer.Transporter;

    constructor(){
        this.emailTransporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

   private async sendEmail(user : IUser, data : NotificationData){
        const mailOptions = {
            from : process.env.SMTP_USER,
            to : user.email,
            subject : `URL Monitor Alert : ${data.urlName}`,
            html : this.generateEmailTemplate(data)
        }

        try {
            await this.emailTransporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Email notification failed:', error);
            return false;
        }
    }

    private generateEmailTemplate(data : NotificationData){
        return `
      <h2>URL Monitor Alert</h2>
      <p>The following URL is experiencing issues:</p>
      <ul>
        <li>Name: ${data.urlName}</li>
        <li>URL: ${data.url}</li>
        <li>Status: ${data.status}</li>
        <li>Time: ${data.timestamp}</li>
        ${data.errorMessage ? `<li>Error: ${data.errorMessage}</li>` : ''}
      </ul>
    `
    }

    public async sendNotifications(user : IUser, data : NotificationData){
        const notifications: Promise<boolean>[] = [];

        notifications.push(this.sendEmail(user, data));

        await Promise.allSettled(notifications);
    }

}

export const notificationService = new NotificationService(); 

