import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Plus, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  ShieldCheck,
  ChevronRight,
  Filter,
  Check,
  Zap
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { CommunityEvent, CommunityEventType } from '../../types/community';
import { CreateEventModal } from './CreateEventModal';

export const CommunityEventsTab: React.FC = () => {
  const { communityEvents, joinCommunityEvent, currentUser } = useEcoSort();

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoleByEvent, setSelectedRoleByEvent] = useState<Record<string, string>>({});

  const eventTypes: { id: string; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All Events', icon: '🌟' },
    { id: 'BEACH_CLEANUP', label: 'Beach Cleanups', icon: '🌊' },
    { id: 'NEIGHBORHOOD_SWEEP', label: 'Neighborhood Sweeps', icon: '🏘️' },
    { id: 'TREE_PLANTING', label: 'Tree Planting', icon: '🌱' },
    { id: 'UPCYCLING_WORKSHOP', label: 'DIY Workshops', icon: '🎨' },
    { id: 'E_WASTE_DRIVE', label: 'E-Waste Drives', icon: '🔌' }
  ];

  const filteredEvents = useMemo(() => {
    return communityEvents.filter(ev => {
      if (selectedType !== 'ALL' && ev.eventType !== selectedType) return false;
      return true;
    });
  }, [communityEvents, selectedType]);

  const totalVolunteers = communityEvents.reduce((acc, ev) => acc + ev.registeredVolunteersCount, 0);
  const totalTargetKg = communityEvents.reduce((acc, ev) => acc + ev.targetCollectionKg, 0);

  return (
    <div className="space-y-6" id="community-events-tab">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase tracking-widest border border-teal-400/30">
                Green Action Drives & Meetups
              </span>
              <span className="text-xs text-slate-300">EPA Ghana Community Initiative</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Join Local Beach Cleanups & Eco-Workshops
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Earn EcoPoints while keeping Ghana's coastlines, neighborhoods, and campuses clean. Equipment and hydration provided at all verified locations!
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            id="host-event-btn"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            Host an Event (+50 Pts)
          </button>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-teal-800/60 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Upcoming Drives</span>
            <strong className="text-white text-base font-black">{communityEvents.length} Active</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Registered Volunteers</span>
            <strong className="text-teal-300 text-base font-black">{totalVolunteers} Eco-Warriors</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Target Recovery</span>
            <strong className="text-emerald-400 text-base font-black">{totalTargetKg} kg Waste</strong>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase font-bold">Per-Event Bonus</span>
            <strong className="text-amber-300 text-base font-black">Up to +100 EcoPts</strong>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {eventTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedType === t.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => {
          const isJoined = !!event.isJoined;
          const volunteerPercent = Math.min(100, Math.round((event.registeredVolunteersCount / event.maxVolunteers) * 100));
          const currentRole = selectedRoleByEvent[event.id] || event.availableRoles[0] || 'General Volunteer';

          return (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              id={`community-event-card-${event.id}`}
            >
              <div>
                {/* Event Image Banner */}
                <div className="relative aspect-[21/9] sm:aspect-[16/7] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Badges on Banner */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      +{event.ecoPointsReward} EcoPoints Reward
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-2 text-[11px] text-teal-300 font-bold mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.time}</span>
                    </div>
                    <h3 className="text-lg font-black text-white line-clamp-1">
                      {event.title}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4">
                  {/* Location & District */}
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {event.district}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Target & Volunteer Progress Bars */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-teal-500" />
                        Volunteers Joined:
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {event.registeredVolunteersCount} / {event.maxVolunteers} ({volunteerPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${volunteerPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <span>Target: {event.targetCollectionKg} kg waste</span>
                      <span>Organizer: {event.organizerName}</span>
                    </div>
                  </div>

                  {/* Equipment Provided */}
                  {event.equipmentProvided && event.equipmentProvided.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Equipment Provided on Site:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {event.equipmentProvided.map((eq, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-[10px] font-medium border border-teal-200/50 dark:border-teal-800/40"
                          >
                            ✓ {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Role Selector before Joining */}
                  {!isJoined && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                        Select Your Volunteer Role:
                      </label>
                      <select
                        value={currentRole}
                        onChange={(e) => setSelectedRoleByEvent(prev => ({ ...prev, [event.id]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                      >
                        {event.availableRoles.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* RSVP Action Footer */}
              <div className="p-5 pt-0">
                {isJoined ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-500" />
                      <div>
                        <span className="text-xs font-bold text-teal-900 dark:text-teal-300 block">
                          RSVP Confirmed ({event.selectedRole || 'General Volunteer'})
                        </span>
                        <span className="text-[10px] text-teal-700 dark:text-teal-400">
                          Check in with organizer on site to unlock +{event.ecoPointsReward} EcoPoints
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => joinCommunityEvent(event.id)}
                      className="text-xs font-bold text-slate-500 hover:text-rose-500 px-2.5 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      Cancel RSVP
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => joinCommunityEvent(event.id, currentRole)}
                    className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                    id={`rsvp-btn-${event.id}`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Join as {currentRole} (+{event.ecoPointsReward} Pts)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Host Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
