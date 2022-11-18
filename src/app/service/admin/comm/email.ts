import { Provide, Inject, Init, Logger } from '@midwayjs/decorator';
import { Clients, Metadata } from '@midwayjs/grpc';
import { Repository } from 'sequelize-typescript';

import { UserEntity } from '../../../entity/user';
import { email } from '../../../../domain/email';
import { BaseService } from '../../../../core/baseService';

@Provide()
export class EmailService extends BaseService<UserEntity> {
  @Inject()
  private grpcClients: Clients;

  private emailGrpcService: email.EmailClient;

  private readonly timeOut = 10000;

  private meta: Metadata;

  getModel(): Repository<UserEntity> {
    return UserEntity;
  }

  @Logger()
  private logger;

  @Init()
  async init() {
    // 赋值一个服务实例
    this.emailGrpcService =
      this.grpcClients.getService<email.EmailClient>('email.Email');

    this.meta = new Metadata();
  }

  // 发送邮件
  async sendEmail(param: email.SendEmailRequest): Promise<string> {
    try {
      const { emailType, toEmailAddress, replaceContent, cacheValue } = param;

      const { reqId } = this.ctx;
      this.meta.add('reqId', reqId);

      const result = await this.emailGrpcService
        .sendEmail({
          timeout: this.timeOut,
          metadata: this.meta,
        })
        .sendMessage({
          emailType,
          toEmailAddress,
          replaceContent,
          cacheValue,
        });

      this.logger.info(
        `email address ${param.toEmailAddress} emailType ${emailType} send success`,
        result
      );

      // 返回结果
      return result.code;
    } catch (error) {
      this.logger.error(
        `email address ${param.toEmailAddress} send error`,
        error
      );
    }
  }

  // 群发通知邮件
  async sendEmails(
    param: email.SendEmailRequest & { emails: string[] }
  ): Promise<void> {
    const { emails, emailType, replaceContent, cacheValue } = param;
    emails.forEach(toEmailAddress => {
      this.sendEmail({
        emailType,
        toEmailAddress,
        replaceContent,
        cacheValue,
      });
    });
  }
}
