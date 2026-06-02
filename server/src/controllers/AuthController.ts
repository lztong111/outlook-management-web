import { Context } from 'koa';
import crypto from 'crypto';
import { config } from '../config';
import { success, fail } from '../utils/response';

export class AuthController {
  async login(ctx: Context) {
    const { password } = ctx.request.body as any;
    if (!password) {
      return fail(ctx, '请输入密码', 400);
    }
    if (password !== config.accessPassword) {
      return fail(ctx, '密码错误，请重试', 401);
    }
    const token = crypto.createHash('sha256').update(password).digest('hex');
    success(ctx, { token, required: true });
  }

  async check(ctx: Context) {
    success(ctx, { required: true });
  }
}
