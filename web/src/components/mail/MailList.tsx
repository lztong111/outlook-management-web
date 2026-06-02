import { Mail } from 'lucide-react';
import { useMailStore } from '../../stores/mails';
import { MailCard } from './MailCard';
import { MailSkeleton } from './MailSkeleton';
import type { MailMessage } from '../../types';

interface MailListProps {
  accountId: number | null;
}

export function MailList({ accountId }: MailListProps) {
  const {
    mails,
    selectedMail,
    selectMail,
    loading,
  } = useMailStore();

  if (!accountId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">请先选择邮箱账户</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Mail list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <MailSkeleton />
        ) : mails.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">暂无邮件</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {mails.map((mail: MailMessage) => (
              <MailCard
                key={mail.id}
                mail={mail}
                isSelected={selectedMail?.id === mail.id}
                onClick={() => selectMail(mail)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
