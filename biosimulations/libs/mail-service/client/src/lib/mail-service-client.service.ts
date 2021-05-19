import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';
@Injectable()
export class MailClientService {
  constructor(private config: ConfigService) {}
  logger = new Logger(MailClientService.name);

  successTemplate = this.config.get('email').successTemplate as string;
  failureTemplate = this.config.get('email').failureTemplate as string;
  private sendEmail(message: SendGrid.MailDataRequired) {
    SendGrid.setApiKey(this.config.get('email').token as string);
    SendGrid.send(message).then(() =>
      this.logger.log(`Sent email to ${message.to}`),
    );
  }
  /**
   * Sends a notification email to the submitter of a simulation when the simulation has succeeded. Uses a sendgrid template
   * @param to The email address of the user
   * @param id The id of the simulation run
   * @param name The name of the simulation run
   * @param date  The date that the simulation run was submitted
   */
  public sendSuccessEmail(to: string, id: string, name: string, date: Date) {
    const message: MailData = {
      to,
      templateId: this.successTemplate,
      dynamicTemplateData: {
        id,
        name,
        date: date.toLocaleString(),
      },
      from: {
        email: 'notifications@biosimulations.org',
        name: 'runBioSimulations',
      },
      asm: {
        groupId: 14634,
      },
    };
    this.sendEmail(message);
  }

  /**
   *  Sends a notifcation email to the submitter of the a simulation when the simulation has failed. Uses a sendgrid template
   * @param to The email address of the user
   * @param id The id of the simulation run
   * @param name The name of the simulation run
   * @param date The date the simulation run was submitted
   */
  public sendFailureEmail(to: string, id: string, name: string, date: Date) {
    const message: MailData = {
      to,
      templateId: this.failureTemplate,
      dynamicTemplateData: {
        id,
        name,
        date: date.toLocaleString(),
      },
      from: {
        email: 'notifications@biosimulations.org',
        name: 'runBioSimulations',
      },
      asm: {
        groupId: 14634,
      },
    };
    this.sendEmail(message);
  }
}

interface DynamicTemplateData {
  id: string;
  name: string;
  date: string;
}
type MailData = SendGrid.MailDataRequired & {
  to: string;
  templateId: string;
  dynamicTemplateData: DynamicTemplateData;
  from: { email: string; name: string };
  asm: { groupId: number };
};
