import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../lib/api';

interface Props {
  open: boolean;
  onSuccess: () => void;
}

export function LoginDialog({ open, onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login(password);
      if (res.token) {
        localStorage.setItem('auth_token', res.token);
      }
      onSuccess();
    } catch {
      setError('密码错误，请重试');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25 mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Outlook 邮箱管理器</h1>
          <p className="text-sm text-blue-200/70 mt-1.5">安全登录 · 邮箱管理平台</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">身份验证</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-blue-200/80 mb-2">访问密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder:text-blue-200/30 transition-all"
                  placeholder="请输入访问密码"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-blue-300/50 hover:text-blue-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !password.trim()}
              className="w-full py-3 text-sm rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-blue-600/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  验证中...
                </span>
              ) : '登录'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-blue-200/30 mt-6">
          Outlook Mail Manager v1.0.0
        </p>
      </div>
    </div>
  );
}
