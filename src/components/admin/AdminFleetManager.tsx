import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Scale, 
  User, 
  Calendar, 
  Clock, 
  X, 
  Check, 
  Phone,
  Coins,
  Send
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { CollectionJob } from '../../types';

export const AdminFleetManager: React.FC = () => {
  const { 
    collectionJobs, 
    allUsers, 
    assignJobAgent, 
    cancelJobAdmin, 
    forceVerifyJobAdmin 
  } = useEcoSort();

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [assigningJob, setAssigningJob] = useState<CollectionJob | null>(null);
  const [verifyingJob, setVerifyingJob] = useState<CollectionJob | null>(null);
  const [cancellingJob, setCancellingJob] = useState<CollectionJob | null>(null);

  // Modal form inputs
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [overrideWeightKg, setOverrideWeightKg] = useState<number>(5.0);
  const [overrideNotes, setOverrideNotes] = useState('Calibrated EPA municipal industrial scale test verification');
  const [cancelReason, setCancelReason] = useState('Duplicate request or unreachable pickup location');

  // Agents list
  const availableAgents = allUsers.filter(u => u.role === 'COLLECTION_AGENT' || u.role === 'ADMIN');

  const filteredJobs = collectionJobs.filter(job => {
    if (selectedStatus === 'ALL') return true;
    return job.status === selectedStatus;
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningJob || !selectedAgentId) return;

    const agent = availableAgents.find(a => a.id === selectedAgentId);
    if (agent) {
      assignJobAgent(assigningJob.id, agent.id, agent.name);
    }
    setAssigningJob(null);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingJob || overrideWeightKg <= 0) return;

    forceVerifyJobAdmin(verifyingJob.id, overrideWeightKg, overrideNotes);
    setVerifyingJob(null);
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingJob) return;

    cancelJobAdmin(cancellingJob.id, cancelReason);
    setCancellingJob(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" />
            National Fleet Logistics & Pick-up Dispatch
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time pickup requests across Accra & Kumasi, assign fleet motorbikes & override scale weights.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'AVAILABLE', 'ASSIGNED', 'COLLECTED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                    Job #{job.id}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {job.userName} ({job.community})
                  </span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  job.status === 'COLLECTED' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : job.status === 'ASSIGNED'
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : job.status === 'CANCELLED'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-amber-50 text-amber-600 border border-amber-200'
                }`}>
                  {job.status}
                </span>
              </div>

              {/* Address & Material Details */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{job.pickupAddress}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-bold block">Material Category</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {job.category} • {job.material}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Estimated Weight</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {job.estimatedWeightKg} kg (~{job.estimatedPoints} Pts)
                    </span>
                  </div>
                </div>

                {job.actualWeightKg && (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">Verified Scale Weight:</span>
                    <span className="font-black text-emerald-600 font-mono">{job.actualWeightKg} kg ({job.pointsEarned || 0} Pts)</span>
                  </div>
                )}

                {job.collectorName && (
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Assigned Agent: {job.collectorName}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              <div className="flex items-center gap-2">
                {job.status !== 'COLLECTED' && job.status !== 'CANCELLED' && (
                  <>
                    <button
                      onClick={() => {
                        setAssigningJob(job);
                        setSelectedAgentId(availableAgents[0]?.id || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-500/20 cursor-pointer"
                    >
                      Assign Fleet
                    </button>

                    <button
                      onClick={() => {
                        setVerifyingJob(job);
                        setOverrideWeightKg(job.estimatedWeightKg);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm cursor-pointer"
                    >
                      Verify Weight
                    </button>

                    <button
                      onClick={() => setCancellingJob(job)}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      title="Cancel job"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Fleet Modal */}
      {assigningJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Dispatch Collection Agent
              </h3>
              <button onClick={() => setAssigningJob(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Assign Job #{assigningJob.id} ({assigningJob.category}, {assigningJob.community}) to a certified field agent.
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Certified Agent
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                >
                  {availableAgents.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.location}) - {a.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningJob(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Dispatch Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Force Verify Modal */}
      {verifyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Administrative Weigh-in & Verification
              </h3>
              <button onClick={() => setVerifyingJob(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Verify scale weight for Job #{verifyingJob.id} ({verifyingJob.userName}) and award EcoPoints.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Calibrated Scale Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5000"
                  required
                  value={overrideWeightKg}
                  onChange={(e) => setOverrideWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-black font-mono text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Verification Note / Officer Stamp
                </label>
                <input
                  type="text"
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyingJob(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Credit Points
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Job Modal */}
      {cancellingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-lg text-slate-900 dark:text-white">
              Cancel Collection Job?
            </h3>
            <p className="text-xs text-slate-500">
              Reason for administrative cancellation of Job #{cancellingJob.id}:
            </p>

            <form onSubmit={handleCancelSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCancellingJob(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
