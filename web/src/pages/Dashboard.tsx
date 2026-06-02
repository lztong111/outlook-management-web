import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Inbox, AlertTriangle, RefreshCw, Trash, RotateCw } from 'lucide-react';
import { dashboardApi, tokenApi } from '../lib/api';
import { toast } from 'sonner';
import type { DashboardStats } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentMails } from '../components/dashboard/RecentMails';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tokenRefreshing, setTokenRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await dashboardApi.stats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || '加载仪表盘数据失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefreshTokens = async () => {
    setTokenRefreshing(true);
    try {
      await tokenApi.refreshAll();
      toast.success('Token 刷新已启动，正在后台执行...');
    } catch (err: any) {
      toast.error(err.message || '启动 Token 刷新失败');
    } finally {
      setTokenRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 rounded bg-secondary animate-pulse" />
          <div className="h-9 w-20 rounded bg-secondary animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-24 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card h-80 animate-pulse" />
          <div className="glass-card h-80 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-3" />
          <p className="text-lg font-medium text-foreground mb-1">加载失败</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => fetchStats()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      icon: Users,
      label: '邮箱总数',
      value: stats.totalAccounts,
      sub: `${stats.activeAccounts} 个活跃`,
      color: '#3B82F6',
    },
    {
      icon: Inbox,
      label: '收件箱邮件',
      value: stats.totalInboxMails,
      color: '#22C55E',
    },
    {
      icon: AlertTriangle,
      label: '垃圾箱邮件',
      value: stats.totalJunkMails,
      color: '#F59E0B',
    },
    {
      icon: Trash,
      label: '已删除邮件',
      value: stats.totalTrashMails,
      color: '#EF4444',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">仪表盘</h1>
          <p className="text-sm text-muted-foreground mt-0.5">邮箱管理系统概览</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshTokens}
            disabled={tokenRefreshing}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
            title="手动刷新所有邮箱的 Token"
          >
            <RotateCw className={`h-4 w-4 ${tokenRefreshing ? 'animate-spin' : ''}`} />
            刷新 Token
          </button>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            刷新
          </button>
        </div>
      </motion.div>

      {/* Stat Cards - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 0.08} />
        ))}
      </div>

      {/* Bottom Panels: Quick Actions + Recent Mails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions stats={stats} />
        <RecentMails mails={stats.recentMails} />
      </div>
    </div>
  );
}
