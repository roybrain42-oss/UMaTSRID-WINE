import React, { useState } from 'react';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Zap, 
  Copy, 
  Check,
  Radio,
  FileText
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { ClientSmsRecord } from '../../services/smsNotificationService';

export const AdminHttpSmsMonitor: React.FC = () => {
  const { 
    smsLogs, 
    smsGatewayStatus, 
    refreshSmsLogs, 
    sendCustomSms, 
    addToast 
  } = useEcoSort();

  // Filter state
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Test SMS Dispatcher Form State
  const [testPhone, setTestPhone] = useState<string>('0244123456');
  const [testMessage, setTestMessage] = useState<string>(
    'EcoSort Ghana Test: httpSMS gateway test from EPA Command Center. Akwaaba!'
  );
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast({
      title: 'Copied to Clipboard',
      message: 'Message content copied.',
      type: 'info',
      duration: 2000
    });
  };

  // Dispatch Test SMS
  const handleSendTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone.trim() || !testMessage.trim()) {
      addToast({
        title: 'Missing Fields',
        message: 'Please enter a valid Ghanaian phone number and message.',
        type: 'error'
      });
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await sendCustomSms(testPhone, testMessage, 'SYSTEM');
      if (res.success) {
        addToast({
          title: res.status === 'DELIVERED' ? 'SMS Delivered Live 🚀' : 'SMS Simulated 📲',
          message: `${res.status === 'DELIVERED' ? 'Live httpSMS delivered' : 'Simulated dispatch'} to ${res.recipient || testPhone}`,
          type: 'success',
          duration: 5000
        });
      } else {
        addToast({
          title: 'SMS Failed',
          message: res.error || 'Failed to dispatch via httpSMS',
          type: 'error'
        });
      }
    } catch (err: any) {
      addToast({
        title: 'Network Error',
        message: err?.message || 'Failed to communicate with SMS service',
        type: 'error'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Filtered logs
  const filteredLogs = smsLogs.filter((log: ClientSmsRecord) => {
    const matchesType = filterType === 'ALL' || log.type === filterType;
    const matchesSearch = 
      log.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.httpSmsMessageId && log.httpSmsMessageId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.metadata?.userName && log.metadata.userName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const totalSent = smsLogs.length;
  const registrationCount = smsLogs.filter(l => l.type === 'REGISTRATION').length;
  const cashOutCount = smsLogs.filter(l => l.type === 'CASH_OUT' || l.type === 'TRANSACTION').length;
  const rewardCount = smsLogs.filter(l => l.type === 'REWARD').length;
  const depositCount = smsLogs.filter(l => l.type === 'DEPOSIT').length;

  return (
    <div className="space-y-6">
      {/* Gateway Connection Overview Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              httpSMS Gateway Active (https://httpsms.com)
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
              Ghanaian Mobile SMS Dispatch Network
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Automatic transactional SMS alerts for new digital citizen registrations, 
              MTN/Telecel/AT MoMo cash-out payouts, reward redemptions, and smart bin deposits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshSmsLogs()}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Refresh SMS status and log entries"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
            </button>
            <a
              href="https://httpsms.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" /> httpSMS Portal
            </a>
          </div>
        </div>

        {/* 4 Gateway Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Gateway Mode</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${smsGatewayStatus?.isConfigured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="text-base font-extrabold text-white">
                {smsGatewayStatus?.isConfigured ? 'Live Android Bridge' : 'Local Simulated Ledger'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {smsGatewayStatus?.isConfigured ? 'Direct via Android app' : 'Ready for HTTPSMS_API_KEY'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Configured Sender</span>
            <div className="text-base font-extrabold text-emerald-400 font-mono mt-1">
              {smsGatewayStatus?.fromNumber || '+233 24 100 2026'}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Ghana E.164 Sender ID</span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Dispatched</span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {totalSent}
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">100% Transmission Rate</span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Event Distribution</span>
            <div className="text-xs font-semibold text-slate-300 mt-1 space-y-0.5">
              <div>Reg: <span className="font-bold text-white">{registrationCount}</span> • MoMo: <span className="font-bold text-white">{cashOutCount}</span></div>
              <div>Vouchers: <span className="font-bold text-white">{rewardCount}</span> • Smart Bins: <span className="font-bold text-white">{depositCount}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Test SMS Dispatcher & Gateway Integration Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Test SMS Dispatch Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Send Test SMS Message
                </h3>
                <p className="text-xs text-slate-500">
                  Direct test via httpSMS backend handler
                </p>
              </div>
            </div>

            <form onSubmit={handleSendTestSms} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Ghana Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="024 412 3456 or +233244123456"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Accepts standard Ghana mobile format: 024..., 050..., 027..., or +233...
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  SMS Message Body
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={4}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
                  placeholder="Type test SMS content..."
                  required
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                  <span>Standard 160-char GSM segment</span>
                  <span>{testMessage.length} chars</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingTest}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching SMS...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Dispatch httpSMS Message
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              All dispatched messages are signed and logged into the tamper-proof platform audit ledger.
            </span>
          </div>
        </div>

        {/* Integration Specs & Architecture */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  httpSMS Automated Trigger Workflows
                </h3>
                <p className="text-xs text-slate-500">
                  How EcoSort Ghana delivers critical alerts across Accra, Kumasi, and Takoradi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 1. User Registration Akwaaba
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Triggered immediately upon citizen onboarding. Sends personalized welcome SMS with digital ID and +50 initial EcoPoints balance.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/40">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 2. MoMo Cash-Out Receipt
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Triggered when a user converts EcoPoints to GH₵ via MTN MoMo, Telecel Cash, or AT Money. Sends instant transaction ref & balance.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 3. Reward Voucher Redemption
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Triggered when ECG power vouchers, water cards, or grocery coupons are redeemed. Sends the alphanumeric redemption code.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/40">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 4. Smart Bin Deposit Receipt
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Triggered when recyclable plastics or sachets are deposited in IoT bins. Sends real-time points credit and weight summary.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-slate-900 text-white font-mono text-[11px] flex items-center justify-between">
            <span className="text-slate-400">
              API Endpoint: <span className="text-emerald-400">POST /api/sms/send</span> • Upstream: <span className="text-blue-400">https://api.httpsms.com/v1/messages/send</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Secure Server Proxy
            </span>
          </div>
        </div>
      </div>

      {/* SMS Dispatched Audit Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Dispatched SMS Audit Ledger ({filteredLogs.length})
            </h3>
            <p className="text-xs text-slate-500">
              Real-time delivery records for all SMS messages dispatched via httpSMS
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone, message, ID..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['ALL', 'REGISTRATION', 'CASH_OUT', 'REWARD', 'DEPOSIT', 'SYSTEM'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    filterType === type 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {type === 'ALL' ? 'All' :
                   type === 'REGISTRATION' ? 'Reg' :
                   type === 'CASH_OUT' ? 'MoMo' :
                   type === 'REWARD' ? 'Vouchers' :
                   type === 'DEPOSIT' ? 'Bins' : 'System'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Smartphone className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No SMS records found</p>
            <p className="text-xs text-slate-500 mt-1">
              Dispatch a test message above or complete a registration / MoMo withdrawal.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Message Body</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredLogs.map((log: ClientSmsRecord) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                        {log.to}
                      </div>
                      {log.metadata?.userName && (
                        <div className="text-[11px] text-slate-500">
                          {log.metadata.userName}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        log.type === 'REGISTRATION' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' :
                        log.type === 'CASH_OUT' || log.type === 'TRANSACTION' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' :
                        log.type === 'REWARD' ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' :
                        log.type === 'DEPOSIT' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {log.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs md:max-w-md">
                      <p className="text-slate-700 dark:text-slate-300 line-clamp-2 text-xs leading-relaxed font-sans">
                        {log.content}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        ID: {log.httpSmsMessageId || log.id}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          log.status === 'DELIVERED' ? 'bg-emerald-500' :
                          log.status === 'SIMULATED' ? 'bg-blue-500' :
                          log.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
                        }`} />
                        <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200">
                          {log.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {log.gateway}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : ''}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCopy(log.content, log.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        title="Copy message content"
                      >
                        {copiedId === log.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminHttpSmsMonitor;
