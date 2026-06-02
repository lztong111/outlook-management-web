import { AccountModel } from '../models/Account';
import { OAuthService } from './OAuthService';
import logger from '../utils/logger';

const accountModel = new AccountModel();
const oauthService = new OAuthService();

// 刷新间隔：10 天（毫秒）
const REFRESH_INTERVAL = 10 * 24 * 60 * 60 * 1000;

export class TokenRefreshService {
  private timer: NodeJS.Timeout | null = null;

  start() {
    logger.info('Token refresh service started (interval: 10 days)');

    // 启动后延迟 5 分钟执行第一次刷新
    setTimeout(() => {
      this.refreshAllTokens();
    }, 5 * 60 * 1000);

    // 每 10 天执行一次
    this.timer = setInterval(() => {
      this.refreshAllTokens();
    }, REFRESH_INTERVAL);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      logger.info('Token refresh service stopped');
    }
  }

  async refreshAllTokens() {
    logger.info('Starting token refresh for all accounts...');

    const accounts = accountModel.getAll();
    let successCount = 0;
    let failCount = 0;

    for (const account of accounts) {
      try {
        await this.refreshAccountToken(account.id, account.client_id, account.refresh_token);
        successCount++;
      } catch (err: any) {
        failCount++;
        logger.error(`Failed to refresh token for ${account.email}: ${err.message}`);
      }

      // 每个账户间隔 1 分钟，避免请求过快
      await this.sleep(60 * 1000);
    }

    logger.info(`Token refresh completed: ${successCount} success, ${failCount} failed`);
  }

  private async refreshAccountToken(accountId: number, clientId: string, refreshToken: string) {
    try {
      // 尝试 Graph API 刷新
      const result = await oauthService.refreshGraphToken(clientId, refreshToken);
      if (result.refresh_token) {
        accountModel.updateTokenRefreshTime(accountId, result.refresh_token);
        logger.info(`Graph token refreshed for account ${accountId}`);
        return;
      }
    } catch (err: any) {
      logger.warn(`Graph refresh failed for account ${accountId}: ${err.message}`);
    }

    try {
      // 回退 IMAP 刷新
      const result = await oauthService.refreshImapToken(clientId, refreshToken);
      if (result.refresh_token) {
        accountModel.updateTokenRefreshTime(accountId, result.refresh_token);
        logger.info(`IMAP token refreshed for account ${accountId}`);
        return;
      }
    } catch (err: any) {
      logger.warn(`IMAP refresh failed for account ${accountId}: ${err.message}`);
    }

    // 两种方式都失败
    throw new Error('Both Graph and IMAP refresh failed');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const tokenRefreshService = new TokenRefreshService();
