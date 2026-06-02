import Router from 'koa-router';
import { Context } from 'koa';
import { tokenRefreshService } from '../services/TokenRefreshService';
import { success, fail } from '../utils/response';

const router = new Router({ prefix: '/api/tokens' });

// 手动触发刷新所有 token
router.post('/refresh', async (ctx: Context) => {
  try {
    // 异步执行，不阻塞响应
    tokenRefreshService.refreshAllTokens();
    success(ctx, { message: 'Token refresh started' });
  } catch (err: any) {
    fail(ctx, `Failed to start token refresh: ${err.message}`);
  }
});

export const tokenRoutes = router;
