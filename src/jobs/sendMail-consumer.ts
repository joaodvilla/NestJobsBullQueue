import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Processor('sendMail-queue')
export class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<CreateUserDto>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.email,
      from: 'Equipe teste <teste@teste.com>',
      subject: 'Bem-vindo',
      text: `Olá ${data.name}, cadastro realizado com sucesso`,
    });
  }
}
