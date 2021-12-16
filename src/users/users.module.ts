import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SendMailProducerService } from 'src/jobs/sendMail-producer-service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, SendMailProducerService],
})
export class UsersModule {}
