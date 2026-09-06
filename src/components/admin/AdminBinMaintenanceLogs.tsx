import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Cpu, 
  ShieldCheck, 
  Download, 
  Plus, 
  RefreshCw, 
  FileSpreadsheet, 
  Sparkles, 
  MapPin, 
  Battery, 
  Sun, 
  ChevronRight, 
  Copy, 
  Check, 
  Layers, 
  Sliders, 
  Coins, 
  Info,
  ArrowRight,
  Activity,
  Zap
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { SmartDustBin, SmartBinMaintenanceLog, SmartBinMaintenanceAction } from '../../types';

export const AdminBinMaintenanceLogs: React.FC = () => {
  const { 
    smartBins, 
    maintenanceLogs, 
    markBinStatusWithLog, 
    currentUser,
    addToast 
  } = useEcoSort();

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<'ALL' | SmartBinMaintenanceAction>('ALL');
  const [selectedBinFilter, setSelectedBinFilter] = useState<string>('ALL');
  const [dateSort, setDateSort] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  // Modal State
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [selectedBinId, setSelectedBinId] = useState<string>(smartBins[0]?.id || '');
  const [modalAction, setModalAction] = useState<SmartBinMaintenanceAction>('UNDER_REPAIR');
  const [technicianName, setTechnicianName] = useState<string>(currentUser.name || 'EPA Lead Tech Kwame Asante');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [resolutionNotes, setResolutionNotes] = useState<string>('');
  const [costGhs, setCostGhs] = useState<number>(0);
  const [customTimestamp, setCustomTimestamp] = useState<string>(() => {
    const now = new Date();
    // format as YYYY-MM-DDTHH:mm for datetime-local input
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  });
  const [resetCapacity, setResetCapacity] = useState<boolean>(true);
  const [selectedComponents, setSelectedComponents] = useState<string[]>(['Ultrasonic Distance Sensor']);

  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  const COMPONENT_OPTIONS = [
    'Ultrasonic Distance Sensor (HC-SR04)',
    'Servo Motor Lid Actuator (SG90)',
    'NeoPixel WS2812B LED Ring',
    'Monocrystalline Solar PV Panel',
    '18650 LiFePO4 Battery & BMS',
    'HX711 Waste Load Cell Sensors',
    'ESP32-S3 Microcontroller & Antenna',
    'Chamber Mechanical Sorting Flaps',
    'Anti-Pest & Odor Bio-Seal'
  ];

  // Quick Action Opener
  const handleOpenActionModal = (bin: SmartDustBin, action: SmartBinMaintenanceAction) => {
    setSelectedBinId(bin.id);
    setModalAction(action);
    if (action === 'UNDER_REPAIR') {
      setIssueDescription(
        bin.status === 'LID_JAMMED' 
          ? 'Lid servo actuator mechanism physically jammed by oversized waste.' 
          : 'Sensor anomaly detected or maintenance inspection required.'
      );
      setResolutionNotes('Device transitioned into MAINTENANCE safety mode with amber flashing warning.');
      setSelectedComponents(['Servo Motor Lid Actuator (SG90)', 'Ultrasonic Distance Sensor (HC-SR04)']);
      setCostGhs(45);
    } else if (action === 'SERVICED') {
      setIssueDescription('Scheduled maintenance, full sensor recalibration, and mechanical overhaul.');
      setResolutionNotes('Chambers sanitized, servo lubricated, LED diagnostics verified 100% operational.');
      setSelectedComponents(['Ultrasonic Distance Sensor (HC-SR04)', 'Servo Motor Lid Actuator (SG90)', 'NeoPixel WS2812B LED Ring']);
      setCostGhs(0);
      setResetCapacity(true);
    } else {
      setIssueDescription('Routine multi-point IoT calibration and battery diagnostics.');
      setResolutionNotes('All diagnostics passed standard EPA Ghana IoT protocol.');
      setCostGhs(0);
    }
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    setCustomTimestamp(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
    setShowLogModal(true);
  };

  const handleToggleComponent = (comp: string) => {
    setSelectedComponents(prev => 
      prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]
    );
  };

  const handleSetCurrentTimestamp = () => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    setCustomTimestamp(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
  };

  const handleSubmitMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBinId) {
      addToast({
        title: 'Select Smart Bin',
        message: 'Please choose a target smart dust bin from the fleet.',
        type: 'warning'
      });
      return;
    }

    // Format readable timestamp from datetime-local
    let formattedTime = customTimestamp;
    try {
      const dt = new Date(customTimestamp);
      if (!isNaN(dt.getTime())) {
        formattedTime = dt.toLocaleString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch {}

    markBinStatusWithLog({
      binId: selectedBinId,
      action: modalAction,
      issueDescription: issueDescription.trim() || undefined,
      resolutionNotes: resolutionNotes.trim() || undefined,
      technicianName: technicianName.trim() || undefined,
      componentsServiced: selectedComponents,
      costGhs: Number(costGhs) || 0,
      customTimestamp: formattedTime,
      resetCapacityIfServiced: resetCapacity
    });

    setShowLogModal(false);
  };

  // Filtered and Sorted Logs
  const filteredLogs = useMemo(() => {
    return maintenanceLogs.filter(log => {
      // Action Filter
      if (actionFilter !== 'ALL' && log.action !== actionFilter) {
        return false;
      }
      // Bin Filter
      if (selectedBinFilter !== 'ALL' && log.binId !== selectedBinFilter) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = log.binName?.toLowerCase().includes(q);
        const matchesLoc = log.binLocation?.toLowerCase().includes(q);
        const matchesTech = log.technicianName?.toLowerCase().includes(q) || log.performedBy?.toLowerCase().includes(q);
        const matchesDesc = log.issueDescription?.toLowerCase().includes(q);
        const matchesRes = log.resolutionNotes?.toLowerCase().includes(q);
        const matchesComp = log.componentsServiced?.some(c => c.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesTech && !matchesDesc && !matchesRes && !matchesComp) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const timeA = a.timestampMs || 0;
      const timeB = b.timestampMs || 0;
      return dateSort === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });
  }, [maintenanceLogs, actionFilter, selectedBinFilter, searchQuery, dateSort]);

  // Statistics
  const stats = useMemo(() => {
    const totalLogs = maintenanceLogs.length;
    const underRepairBins = smartBins.filter(b => b.status === 'MAINTENANCE' || b.status === 'OFFLINE' || b.status === 'LID_JAMMED');
    const onlineBins = smartBins.filter(b => b.status === 'ONLINE' || b.status === 'FULL');
    const totalExpenditure = maintenanceLogs.reduce((sum, log) => sum + (log.costGhs || 0), 0);
    const reliabilityRate = smartBins.length > 0 ? Math.round((onlineBins.length / smartBins.length) * 100) : 100;

    return {
      totalLogs,
      underRepairCount: underRepairBins.length,
      onlineCount: onlineBins.length,
      totalExpenditure,
      reliabilityRate
    };
  }, [maintenanceLogs, smartBins]);

  const handleCopyLog = (log: SmartBinMaintenanceLog) => {
    const text = `[Maintenance Log] ${log.binName} (${log.binId})\nAction: ${log.action}\nTimestamp: ${log.timestamp}\nStatus: ${log.previousStatus} ➔ ${log.newStatus}\nTechnician: ${log.technicianName || log.performedBy}\nIssue: ${log.issueDescription || 'N/A'}\nResolution: ${log.resolutionNotes || 'N/A'}\nComponents: ${(log.componentsServiced || []).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedLogId(log.id);
    addToast({
      title: 'Log Details Copied',
      message: 'Maintenance record copied to clipboard.',
      type: 'info'
    });
    setTimeout(() => setCopiedLogId(null), 2500);
  };

  const exportLogsCSV = () => {
    const header = "Log ID,Bin ID,Bin Name,Location,Action,Previous Status,New Status,Timestamp,Technician,Cost GHS,Issue Description,Resolution Notes,Components Serviced\n";
    const rows = filteredLogs.map(log => {
      const comps = (log.componentsServiced || []).join('; ');
      return `"${log.id}","${log.binId}","${log.binName}","${log.binLocation}","${log.action}","${log.previousStatus}","${log.newStatus}","${log.timestamp}","${log.technicianName || log.performedBy}",${log.costGhs || 0},"${(log.issueDescription || '').replace(/"/g, '""')}","${(log.resolutionNotes || '').replace(/"/g, '""')}","${comps}"`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `EcoSort_SmartBin_Maintenance_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Maintenance Log Exported 📄',
      message: `Successfully downloaded ${filteredLogs.length} maintenance records as CSV.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                IoT Smart Bin Maintenance Log & Servicing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Audit trail, hardware calibration, and manual status certification for Ghana's IoT waste grid.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportLogsCSV}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Export filtered records as CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV ({filteredLogs.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedBinId(smartBins[0]?.id || '');
              setModalAction('UNDER_REPAIR');
              handleOpenActionModal(smartBins[0] || {} as any, 'UNDER_REPAIR');
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Log Maintenance Event</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Maintenance Events
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalLogs}
            </span>
            <span className="text-xs text-slate-400 font-medium">Logged</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Complete lifecycle audit trail
          </p>
        </div>

        {/* Currently Under Repair */}
        <div className={`p-5 rounded-2xl border transition-all ${
          stats.underRepairCount > 0 
            ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/30' 
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        } shadow-sm`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              {stats.underRepairCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
              Under Repair
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.underRepairCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              / {smartBins.length} Bins
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {stats.underRepairCount > 0 ? 'Requires technician dispatch' : 'All smart bins operational'}
          </p>
        </div>

        {/* Online / Serviced Health */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Fleet Reliability
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.reliabilityRate}%
            </span>
            <span className="text-xs text-slate-400 font-medium">Online ({stats.onlineCount})</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Active for citizen deposits
          </p>
        </div>

        {/* Maintenance Spend */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Maintenance Cost
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              GH₵ {stats.totalExpenditure.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Parts & field servicing budget
          </p>
        </div>
      </div>

      {/* Smart Bin Quick Status & Direct Action Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              Smart Bin Fleet Direct Action & Live Status
            </h3>
            <p className="text-xs text-slate-500">
              Click any bin below to immediately mark as 'Under Repair' or 'Serviced' with custom notes and timestamp.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {smartBins.length} IoT Units Deployed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
          {smartBins.map((bin) => {
            const isUnderRepair = bin.status === 'MAINTENANCE' || bin.status === 'LID_JAMMED' || bin.status === 'OFFLINE';
            const statusColor = isUnderRepair ? 'border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50';

            return (
              <div 
                key={bin.id}
                className={`p-4 rounded-2xl border transition-all ${statusColor} flex flex-col justify-between gap-3 relative overflow-hidden`}
              >
                {/* Status Indicator Bar */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        isUnderRepair ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                      }`} />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[200px]" title={bin.name}>
                        {bin.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{bin.location}</span>
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                    bin.status === 'MAINTENANCE' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40' :
                    bin.status === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40' :
                    bin.status === 'FULL' ? 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40' :
                    'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                  }`}>
                    {bin.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Specs / Telemetry mini bar */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Fill Level</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">
                      {bin.overallFillLevel}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Battery</span>
                    <span className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Battery className="w-3 h-3 text-emerald-500" />
                      {bin.batteryLevel}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Solar PV</span>
                    <span className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Sun className="w-3 h-3 text-amber-500" />
                      {bin.solarWattsGenerated || 14}W
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {!isUnderRepair ? (
                    <button
                      onClick={() => handleOpenActionModal(bin, 'UNDER_REPAIR')}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Mark Under Repair</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenActionModal(bin, 'SERVICED')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Serviced & Online</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedBinFilter(bin.id);
                      addToast({
                        title: `Filtered by ${bin.name}`,
                        message: 'Showing maintenance history for this bin below.',
                        type: 'info'
                      });
                    }}
                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                    title="View history for this bin"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by bin, technician, issue, components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as any)}
              aria-label="Filter by maintenance action"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Actions ({maintenanceLogs.length})</option>
              <option value="UNDER_REPAIR">Under Repair</option>
              <option value="SERVICED">Serviced & Online</option>
              <option value="INSPECTION">Inspection / Diagnostics</option>
              <option value="PARTS_REPLACED">Parts Replaced</option>
              <option value="SENSOR_CALIBRATION">Sensor Calibration</option>
            </select>

            {/* Smart Bin Selector */}
            <select
              value={selectedBinFilter}
              onChange={(e) => setSelectedBinFilter(e.target.value)}
              aria-label="Filter by specific smart bin"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer max-w-[200px]"
            >
              <option value="ALL">All Smart Bins</option>
              {smartBins.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {/* Date Sorting */}
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value as any)}
              aria-label="Sort by date"
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>

            {(searchQuery || actionFilter !== 'ALL' || selectedBinFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActionFilter('ALL');
                  setSelectedBinFilter('ALL');
                }}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Maintenance Logs Table / Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
              Official Smart Bin Maintenance Audit Ledger
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing {filteredLogs.length} of {maintenanceLogs.length} events
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Wrench className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No maintenance records found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No maintenance logs match your selected filter criteria. Try resetting your search filters or record a new servicing action.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 dark:bg-slate-950/75 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4">Timestamp & Date</th>
                  <th className="py-3.5 px-4">Smart Bin</th>
                  <th className="py-3.5 px-4">Action & Transition</th>
                  <th className="py-3.5 px-4">Technician / Lead</th>
                  <th className="py-3.5 px-4">Issue Description & Servicing Notes</th>
                  <th className="py-3.5 px-4">Components</th>
                  <th className="py-3.5 px-4 text-right">Cost</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {filteredLogs.map((log) => {
                  const isUnderRepair = log.action === 'UNDER_REPAIR';
                  const isServiced = log.action === 'SERVICED';

                  return (
                    <tr 
                      key={log.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block font-mono text-[11px]">
                              {log.timestamp}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ID: {log.id.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Smart Bin */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-[200px]">
                          <span className="font-bold text-slate-900 dark:text-white block truncate" title={log.binName}>
                            {log.binName}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate flex items-center gap-1" title={log.binLocation}>
                            <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            {log.binLocation}
                          </span>
                        </div>
                      </td>

                      {/* Action & Status Transition */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isUnderRepair ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30' :
                            isServiced ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30' :
                            'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30'
                          }`}>
                            {isUnderRepair && <Wrench className="w-3 h-3" />}
                            {isServiced && <CheckCircle2 className="w-3 h-3" />}
                            {log.action.replace('_', ' ')}
                          </span>

                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 font-mono">
                            <span>{log.previousStatus}</span>
                            <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                            <span className="font-bold text-slate-700 dark:text-slate-300">{log.newStatus}</span>
                          </div>
                        </div>
                      </td>

                      {/* Technician */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-[10px]">
                            <User className="w-3 h-3" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {log.technicianName || log.performedBy}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              EPA Field Directorate
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Description and Notes */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-1">
                          {log.issueDescription && (
                            <p className="text-slate-800 dark:text-slate-200 font-medium line-clamp-2 leading-relaxed">
                              {log.issueDescription}
                            </p>
                          )}
                          {log.resolutionNotes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                              ↳ {log.resolutionNotes}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Serviced Components */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {log.componentsServiced && log.componentsServiced.length > 0 ? (
                            log.componentsServiced.map((comp, idx) => (
                              <span 
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium truncate max-w-[170px]"
                                title={comp}
                              >
                                {comp.split('(')[0].trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[10px]">Routine check</span>
                          )}
                        </div>
                      </td>

                      {/* Cost */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          {log.costGhs ? `GH₵ ${log.costGhs.toFixed(2)}` : 'GH₵ 0.00'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleCopyLog(log)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                          title="Copy log details"
                        >
                          {copiedLogId === log.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Maintenance Action Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  modalAction === 'UNDER_REPAIR' 
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                }`}>
                  {modalAction === 'UNDER_REPAIR' ? <Wrench className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {modalAction === 'UNDER_REPAIR' ? 'Mark Smart Bin Under Repair' : 'Mark Smart Bin Serviced & Online'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record certified maintenance event in official EPA IoT ledger.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLogModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitMaintenance} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Target Bin Selection */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Target Smart Dust Bin *
                </label>
                <select
                  value={selectedBinId}
                  onChange={(e) => setSelectedBinId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                >
                  {smartBins.map(bin => (
                    <option key={bin.id} value={bin.id}>
                      {bin.name} — ({bin.location}) [{bin.status}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Maintenance Action Type Selector */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Maintenance Action Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalAction('UNDER_REPAIR');
                      if (!issueDescription) {
                        setIssueDescription('Flagged for sensor/servo repair.');
                      }
                    }}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      modalAction === 'UNDER_REPAIR'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-amber-500" />
                    <span>🛠️ Under Repair</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setModalAction('SERVICED');
                      if (!resolutionNotes) {
                        setResolutionNotes('Chambers sanitized, servo motor verified, returned to active service.');
                      }
                    }}
                    className={`p-3 rounded-xl border font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      modalAction === 'SERVICED'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>✅ Serviced & Online</span>
                  </button>
                </div>
              </div>

              {/* Timestamp Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Official Event Timestamp *
                  </label>
                  <button
                    type="button"
                    onClick={handleSetCurrentTimestamp}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    <span>Set to Current Time</span>
                  </button>
                </div>
                <input 
                  type="datetime-local"
                  value={customTimestamp}
                  onChange={(e) => setCustomTimestamp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
              </div>

              {/* Technician / Lead */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Technician / Performed By *
                </label>
                <input 
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="e.g. Kwame Asante (EPA Lead Field Engineer)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  required
                />
              </div>

              {/* Issue Description */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  {modalAction === 'UNDER_REPAIR' ? 'Issue / Anomaly Description *' : 'Servicing Description / Scope *'}
                </label>
                <textarea 
                  rows={2}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder={modalAction === 'UNDER_REPAIR' 
                    ? 'e.g. Ultrasonic sensor lens dirty, lid servo arm loose due to oversized gallon deposit.'
                    : 'e.g. Routine 14-day field servicing, chamber cleaning, and firmware verification.'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  required
                />
              </div>

              {/* Resolution Notes */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Resolution & Certification Notes
                </label>
                <textarea 
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Re-calibrated HC-SR04 baseline tare, greased SG90 nylon gears, verified all 12 NeoPixel LEDs."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>

              {/* Components Serviced Checklist */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Serviced Components Checklist
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  {COMPONENT_OPTIONS.map((comp) => {
                    const isSelected = selectedComponents.includes(comp);
                    return (
                      <button
                        type="button"
                        key={comp}
                        onClick={() => handleToggleComponent(comp)}
                        className={`p-1.5 rounded-lg text-left text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] border ${
                          isSelected ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-400'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                        <span className="truncate">{comp.split('(')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cost & Capacity Reset Toggle */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Maintenance Cost (GH₵)
                  </label>
                  <input 
                    type="number"
                    min="0"
                    step="0.5"
                    value={costGhs}
                    onChange={(e) => setCostGhs(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                {modalAction === 'SERVICED' && (
                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                      <input 
                        type="checkbox"
                        checked={resetCapacity}
                        onChange={(e) => setResetCapacity(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Reset Capacity to 0%
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5 ${
                    modalAction === 'UNDER_REPAIR'
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                  }`}
                >
                  {modalAction === 'UNDER_REPAIR' ? (
                    <>
                      <Wrench className="w-4 h-4" />
                      <span>Confirm & Mark Under Repair</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Mark Serviced</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
