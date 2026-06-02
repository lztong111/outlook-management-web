import { create } from 'zustand';
import type { MailMessage, FetchMailsResult } from '../types';
import { mailApi } from '../lib/api';
import { useAccountStore } from './accounts';

interface MailStore {
  currentAccountId: number | null;
  mails: MailMessage[];
  selectedMail: MailMessage | null;
  loading: boolean;
  fetchResult: FetchMailsResult | null;
  setCurrentAccount: (id: number) => void;
  fetchAllMails: (accountId: number, proxyId?: number) => Promise<void>;
  fetchCachedMails: (accountId: number) => Promise<void>;
  clearAllMailbox: (accountId: number, proxyId?: number) => Promise<void>;
  selectMail: (mail: MailMessage | null) => void;
}

export const useMailStore = create<MailStore>((set) => ({
  currentAccountId: null,
  mails: [],
  selectedMail: null,
  loading: false,
  fetchResult: null,

  setCurrentAccount: (id) => set({ currentAccountId: id, mails: [], selectedMail: null }),

  fetchAllMails: async (accountId, proxyId) => {
    set({ loading: true });
    try {
      // 获取收件箱和垃圾箱邮件
      const results = await Promise.allSettled([
        mailApi.fetch({ account_id: accountId, mailbox: 'INBOX', proxy_id: proxyId }),
        mailApi.fetch({ account_id: accountId, mailbox: 'Junk', proxy_id: proxyId }),
      ]);
      
      const allMails: any[] = [];
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allMails.push(...result.value.mails);
        }
      });
      
      // 按时间排序
      allMails.sort((a, b) => new Date(b.mail_date).getTime() - new Date(a.mail_date).getTime());
      set({ mails: allMails });
      useAccountStore.getState().refreshAccountsSilent();
    } finally {
      set({ loading: false });
    }
  },

  fetchCachedMails: async (accountId) => {
    set({ loading: true });
    try {
      const data = await mailApi.cached({ account_id: accountId, mailbox: 'ALL', pageSize: 200 });
      set({ mails: data.list });
    } finally {
      set({ loading: false });
    }
  },

  clearAllMailbox: async (accountId, proxyId) => {
    await Promise.allSettled([
      mailApi.clear({ account_id: accountId, mailbox: 'INBOX', proxy_id: proxyId }),
      mailApi.clear({ account_id: accountId, mailbox: 'Junk', proxy_id: proxyId }),
    ]);
    set({ mails: [], selectedMail: null });
    useAccountStore.getState().refreshAccountsSilent();
  },

  selectMail: (mail) => set({ selectedMail: mail }),
}));
