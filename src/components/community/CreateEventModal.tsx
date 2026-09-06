import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  Sparkles, 
  Clock, 
  Tag, 
  Target 
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { CommunityEventType } from '../../types/community';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_EVENT_BANNERS = [
  { label: 'Beach Cleanup', url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Neighborhood Sweep', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tree Planting', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop&q=80' },
  { label: 'Upcycling Workshop', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80' },
  { label: 'E-Waste Drive', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80' }
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, createCommunityEvent } = useEcoSort();

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<CommunityEventType>('BEACH_CLEANUP');
  const [date, setDate] = useState('Saturday, Next Week');
  const [time, setTime] = useState('07:00 AM - 11:00 AM GMT');
  const [location, setLocation] = useState('Laboma Beach / Jamestown Shore');
  const [district, setDistrict] = useState(currentUser.community || 'Osu Klottey');
  const [targetCollectionKg, setTargetCollectionKg] = useState<number>(350);
  const [maxVolunteers, setMaxVolunteers] = useState<number>(50);
  const [ecoPointsReward, setEcoPointsReward] = useState<number>(100);
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState(PRESET_EVENT_BANNERS[0].url);
  const [equipmentInput, setEquipmentInput] = useState('Heavy duty biodegradable sacks, Nitrile gloves, Digital scale, Refreshments, First-aid');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createCommunityEvent({
      title: title.trim(),
      description: description.trim() || 'Join our local eco-warriors for a high-impact environmental cleanup drive.',
      eventType,
      date,
      time,
      location: location.trim(),
      district: district.trim(),
      organizerName: currentUser.name,
      organizerAvatar: currentUser.avatar,
      organizerRole: currentUser.role === 'ADMIN' ? 'EPA Ghana Officer' : 'Community Volunteer Lead',
      bannerUrl,
      targetCollectionKg,
      maxVolunteers,
      ecoPointsReward,
      availableRoles: [
        'Sorting Lead', 
        'Sacks Transport', 
        'Digital Weigh Master', 
        'Registration & Refreshments'
      ],
      equipmentProvided: equipmentInput.split(',').map(s => s.trim()).filter(Boolean),
      status: 'UPCOMING'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
        id="create-event-modal"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Host a Green Community Drive</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rally volunteers, clean neighborhoods, award EcoPoints</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
            id="close-create-event-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Drive / Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Greater Accra Coastal Cleanup Drive 2026"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-teal-500"
              id="event-title-input"
            />
          </div>

          {/* Event Type & Target Kg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Event Type
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as CommunityEventType)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              >
                <option value="BEACH_CLEANUP">🌊 Beach / Coastal Cleanup</option>
                <option value="NEIGHBORHOOD_SWEEP">🏘️ Neighborhood Sweep</option>
                <option value="TREE_PLANTING">🌱 Tree Planting / Green Space</option>
                <option value="UPCYCLING_WORKSHOP">🎨 Upcycling DIY Workshop</option>
                <option value="E_WASTE_DRIVE">🔌 E-Waste & Battery Drop</option>
                <option value="SCHOOL_OUTREACH">🏫 Campus & School Outreach</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Target Collection (kg)
              </label>
              <input
                type="number"
                min="10"
                value={targetCollectionKg}
                onChange={(e) => setTargetCollectionKg(parseInt(e.target.value) || 50)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g., Saturday, March 14, 2026"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Time Window
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 07:00 AM - 11:30 AM GMT"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>
          </div>

          {/* Location & District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Meeting Point / Landmark
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Jamestown Lighthouse Forecourt"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Sub-Metro / District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g., Accra Metro / Ga Mashie"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>
          </div>

          {/* Volunteers & EcoPoints Bonus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Max Volunteers Cap
              </label>
              <input
                type="number"
                min="5"
                max="500"
                value={maxVolunteers}
                onChange={(e) => setMaxVolunteers(parseInt(e.target.value) || 20)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Volunteer EcoPoints Reward
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={ecoPointsReward}
                onChange={(e) => setEcoPointsReward(parseInt(e.target.value) || 50)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-teal-400 bg-teal-50/50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-300 font-bold text-xs outline-none"
              />
            </div>
          </div>

          {/* Banner Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Select Event Cover Photo
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_EVENT_BANNERS.map((b) => (
                <button
                  type="button"
                  key={b.label}
                  onClick={() => setBannerUrl(b.url)}
                  className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                    bannerUrl === b.url
                      ? 'border-teal-500 ring-2 ring-teal-500/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={b.url} alt={b.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-0.5 text-[8px] font-bold text-white text-center truncate">
                    {b.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Provided */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Equipment Provided (comma separated)
            </label>
            <input
              type="text"
              value={equipmentInput}
              onChange={(e) => setEquipmentInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Description & Objectives
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share what volunteers should wear, key goals, safety protocols..."
              className="w-full px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center gap-2"
              id="submit-create-event-btn"
            >
              <Sparkles className="w-4 h-4" />
              Schedule Clean-Up Drive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
