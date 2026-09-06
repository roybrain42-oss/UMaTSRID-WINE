import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ForumReactionEmoji } from '../../types/community';

interface PostReactionPickerProps {
  reactions?: Record<string, number>;
  userReactions?: string[];
  onToggleReaction: (emoji: string) => void;
  size?: 'sm' | 'md';
  postId: string;
}

export const AVAILABLE_REACTIONS: { emoji: ForumReactionEmoji; label: string; description: string }[] = [
  { emoji: '🌱', label: 'Eco-Hero', description: 'Inspiring green impact' },
  { emoji: '💡', label: 'Pro-Tip', description: 'Helpful recycling advice' },
  { emoji: '🔥', label: 'Trending', description: 'Exciting initiative' },
  { emoji: '👏', label: 'Kudos', description: 'Celebrating great effort' },
  { emoji: '❤️', label: 'Love It', description: 'Community support' },
  { emoji: '♻️', label: 'Circular DIY', description: 'Creative upcycling ingenuity' }
];

export const PostReactionPicker: React.FC<PostReactionPickerProps> = ({
  reactions = {},
  userReactions = [],
  onToggleReaction,
  size = 'md',
  postId
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Filter reactions that have at least 1 count or is reacted by current user
  const activeReactions = AVAILABLE_REACTIONS.filter(
    r => (reactions[r.emoji] && reactions[r.emoji] > 0) || userReactions.includes(r.emoji)
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5 relative" id={`reactions-bar-${postId}`}>
      {/* Active Reaction Pills */}
      {activeReactions.map((item) => {
        const count = reactions[item.emoji] || (userReactions.includes(item.emoji) ? 1 : 0);
        const hasReacted = userReactions.includes(item.emoji);

        return (
          <button
            key={item.emoji}
            onClick={() => onToggleReaction(item.emoji)}
            title={`${item.label} (${count})`}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all transform active:scale-95 ${
              hasReacted
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-transparent'
            }`}
          >
            <span className="text-sm leading-none">{item.emoji}</span>
            <span className={`text-[11px] ${hasReacted ? 'font-black' : 'font-semibold'}`}>{count}</span>
          </button>
        );
      })}

      {/* Add Reaction Button & Floating Tray */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          onMouseEnter={() => setShowPicker(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60 ${
            showPicker ? 'ring-2 ring-emerald-500/30' : ''
          }`}
          title="React to this post"
          id={`react-btn-${postId}`}
        >
          <span className="text-xs">✨</span>
          <span className="text-[11px]">React</span>
        </button>

        {/* Floating Quick Reaction Popover */}
        {showPicker && (
          <>
            <div 
              className="fixed inset-0 z-20" 
              onClick={() => setShowPicker(false)} 
            />
            <div 
              onMouseLeave={() => setShowPicker(false)}
              className="absolute bottom-full left-0 mb-2 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 shadow-xl flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
            >
              {AVAILABLE_REACTIONS.map((item) => {
                const hasReacted = userReactions.includes(item.emoji);
                return (
                  <button
                    key={item.emoji}
                    type="button"
                    onClick={() => {
                      onToggleReaction(item.emoji);
                      setShowPicker(false);
                    }}
                    title={`${item.label} - ${item.description}`}
                    className={`p-1.5 rounded-xl text-lg hover:scale-125 transition-transform flex flex-col items-center group relative ${
                      hasReacted ? 'bg-emerald-500/20' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="leading-none">{item.emoji}</span>
                    <span className="absolute bottom-full mb-1 hidden group-hover:block px-2 py-0.5 rounded-lg bg-slate-950 text-white text-[10px] whitespace-nowrap z-40 pointer-events-none shadow-md font-bold">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
