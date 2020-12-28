import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from "@sendgrid/mail";
@Injectable()
export class MailClientService {
    constructor(private config: ConfigService) { }
    logger = new Logger(MailClientService.name)
    private sendEmail(message: SendGrid.MailDataRequired) {
        SendGrid.setApiKey(this.config.get('email').token as string)
        SendGrid.send(message).then(() => this.logger.log(`Send email to ${message.to} with subject ${message.subject}`))
    }

    public sendNotificationEmail(to: string, subject: string, text: string, html: string) {

        const message = { to, subject, text, html, from: "notifications@biosimulations.org" }
        this.sendEmail(message)
    }
}
