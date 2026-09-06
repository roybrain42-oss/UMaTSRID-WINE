import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Tag, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { ForumPostCategory } from '../../types/community';

interface CreateForumPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateForumPostModal: React.FC<CreateForumPostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addForumPost } = useEcoSort();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ForumPostCategory>('TIPS_AND_HACKS');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('recycling, ghana, ecotips');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    addForumPost({
      title: title.trim(),
      category,
      content: content.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorLocation: currentUser.location || 'Accra, Ghana',
      tags: tags.length > 0 ? tags : ['EcoSort', 'Ghana'],
      isPinned: false
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
        id="create-forum-post-modal"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Start a Community Discussion</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Share eco tips, ask recycling questions, or start local drives (+5 Pts)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
            id="close-create-post-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Topic / Question Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Best way to clean oily food containers before sorting in Accra?"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              id="forum-title-input"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Discussion Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'TIPS_AND_HACKS', label: '💡 Tips & Hacks', icon: Lightbulb },
                { id: 'UPCYCLING_DIY', label: '🎨 Upcycling DIY', icon: Sparkles },
                { id: 'QUESTIONS_ANSWERS', label: '❓ Q & A', icon: HelpCircle },
                { id: 'LOCAL_INITIATIVES', label: '🏘️ Local Drives', icon: MessageSquare },
                { id: 'EPA_POLICY', label: '📜 EPA Policy & Carbon', icon: ShieldCheck },
                { id: 'GENERAL', label: '🌍 General Green Hub', icon: BookOpen }
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id as ForumPostCategory)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                    category === cat.id
                      ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Tags (comma separated)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., PlasticSort, AccraClean, Composting, UniversityOfGhana"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                id="forum-tags-input"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Post Content & Details *
            </label>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your advice, ask a technical recycling question, or invite neighbors to join an environmental action..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none resize-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              id="forum-content-input"
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2"
              id="submit-forum-post-btn"
            >
              <Sparkles className="w-4 h-4" />
              Publish Topic (+5 Pts)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
