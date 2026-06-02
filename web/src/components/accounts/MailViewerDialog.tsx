import { useEffect, useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { useMailStore } from '../../stores/mails';
import { MailList } from '../mail/MailList';
import { MailContent } from '../mail/MailContent';
import { toast } from 'sonner';

interface MailViewerDialogProps {
  open: boolean;
  accountId: number;
  accountEmail: string;
  onClose: () => void;
}

export function MailViewerDialog({
  open,
  accountId,
  accountEmail,
  onClose,
}: MailViewerDialogProps) {
  const { setCurrentAccount, fetchAllMails, selectedMail, selectMail, mails, loading } = useMailStore();
  const [initialLoading, setInitialLoading] = useState(false);

  const handleFetchMails = async () => {
    setInitialLoading(true);
    try {
      await fetchAllMails(accountId);
    } catch (err: any) {
      toast.error(err.message || '获取邮件失败');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentAccount(accountId);
      selectMail(null);
      handleFetchMails();
    }
  }, [open, accountId]);

  // 邮件加载完成后自动选中第一条
  useEffect(() => {
    if (mails.length > 0 && !selectedMail && !initialLoading) {
      selectMail(mails[0]);
    }
  }, [mails, selectedMail, initialLoading]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[80vh] bg-background rounded-lg shadow-xl flex flex-col overflow-hidden animate-[slideUp_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">邮件查看</h2>
            <p className="text-sm text-muted-foreground">{accountEmail}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFetchMails}
              disabled={loading || initialLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${(loading || initialLoading) ? 'animate-spin' : ''}`} />
              刷新
            </button>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">关闭</span>
            </button>
          </div>
        </div>

        {/* Content: Two-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Mail list */}
          <div className="w-[320px] shrink-0 border-r border-border bg-card overflow-hidden">
            <MailList accountId={accountId} />
          </div>

          {/* Right: Mail content */}
          <div className="flex-1 overflow-hidden bg-background">
            <MailContent mail={selectedMail} />
          </div>
        </div>
      </div>
    </div>
  );
}
