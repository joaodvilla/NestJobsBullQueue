import { Module } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from './users/users.module';
import { SendMailProducerService } from './jobs/sendMail-producer-service';
import { SendMailConsumer } from './jobs/sendMail-consumer';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { MiddlewareBuilder } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [SendMailProducerService, SendMailConsumer],
  exports: [],
})
export class AppModule {
  constructor(@InjectQueue('sendMail-queue') private senMailQueue: Queue) {}

  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.senMailQueue)]);

    consumer.apply(router).forRoutes('/admin/queues');
  }
}
