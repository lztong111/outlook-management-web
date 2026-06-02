import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

// 尝试加载根目录和 server 目录的 .env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let accessPassword = process.env.ACCESS_PASSWORD || '';
if (!accessPassword) {
  accessPassword = crypto.randomBytes(16).toString('hex');
  console.log(`\n========================================`);
  console.log(`[安全] 未设置 ACCESS_PASSWORD，已自动生成:`);
  console.log(`[安全] 密码: ${accessPassword}`);
  console.log(`[安全] 请保存此密码用于登录`);
  console.log(`========================================\n`);
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  dbPath: path.resolve(__dirname, '../..', process.env.DB_PATH || './data/outlook.db'),
  accessPassword,
};
