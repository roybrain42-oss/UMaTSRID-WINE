import React, { useState, useMemo } from 'react';
import { 
  X, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Bookmark, 
  Pin, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Tag, 
  SlidersHorizontal,
  Coins,
  CheckCircle,
  HelpCircle,
  Clock,
  MapPin,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { CommunityForumPost, ForumComment } from '../../types/community';
import { useEcoSort } from '../../context/EcoSortContext';
import { PostReactionPicker } from './PostReactionPicker';
import { ForumCommentItem } from './ForumCommentItem';

interface PostDiscussionModalProps {
  post: CommunityForumPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PostDiscussionModal: React.FC<PostDiscussionModalProps> = ({
  post,
  isOpen,
  onClose
}) => {
  const {
    currentUser,
    toggleUpvoteForumPost,
    reactToForumPost,
    toggleBookmarkForumPost,
    addForumComment,
    addToast
  } = useEcoSort();

  const [commentText, setCommentText] = useState('');
  const [sortBy, setSortBy] = useState<'TOP' | 'NEWEST' | 'SOLUTIONS'>('TOP');
  const [selectedTagPrompt, setSelectedTagPrompt] = useState<string | null>(null);

  if (!isOpen || !post) return null;

  const quickPrompts = [
    { label: 'Drop-off locations? 📍', insert: 'Where is the nearest verified drop-off point for this in Greater Accra?' },
    { label: 'EPA Guideline details 📜', insert: 'How does this align with the Ghana EPA single-use reduction mandate?' },
    { label: 'Pro-tip confirmation 💡', insert: 'Tried this approach today! It worked seamlessly with my household sorting.' },
    { label: 'Collection schedule 🚚', insert: 'When does the next collection agent pass through for this batch?' }
  ];

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    addForumComment(post.id, commentText.trim());
    setCommentText('');
    setSelectedTagPrompt(null);
  };

  const handleSharePost = () => {
    const textToCopy = `EcoSort Ghana Community Discussion: "${post.title}" by ${post.authorName}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      addToast({
        title: 'Link Copied! 🔗',
        message: 'Discussion link copied to clipboard.',
        type: 'info',
        duration: 2500
      });
    }
  };

  // Sort comments
  const sortedComments = useMemo(() => {
    const list = [...(post.comments || [])];
    if (sortBy === 'SOLUTIONS') {
      return list.sort((a, b) => (b.isVerifiedSolution ? 1 : 0) - (a.isVerifiedSolution ? 1 : 0));
    }
    if (sortBy === 'NEWEST') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    // TOP
    return list.sort((a, b) => {
      const reactionsA = Object.values(a.reactions || {}).reduce((acc: number, c) => acc + Number(c), 0) + (a.upvotes || 0);
      const reactionsB = Object.values(b.reactions || {}).reduce((acc: number, c) => acc + Number(c), 0) + (b.upvotes || 0);
      return reactionsB - reactionsA;
    });
  }, [post.comments, sortBy]);

  const totalReactionsCount = Object.values(post.reactions || {}).reduce((acc: number, v) => acc + Number(v), 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      id="post-discussion-modal"
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider border border-blue-500/20">
              {post.category.replace(/_/g, ' ')}
            </span>
            {post.isPinned && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmarkForumPost(post.id)}
              className={`p-2 rounded-xl border transition-colors ${
                post.isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border-amber-300'
                  : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title={post.isBookmarked ? 'Saved' : 'Save discussion'}
            >
              <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleSharePost}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              title="Share discussion"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Post Author Bar */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                alt={post.authorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    {post.authorName}
                  </h4>
                  {post.authorBadge && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-500/20">
                      {post.authorBadge}
                    </span>
                  )}
                  {post.authorRole === 'ADMIN' && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> EPA Officer
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  {post.authorLocation && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {post.authorLocation}
                    </span>
                  )}
                  <span>•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Title & Full Content */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold"
              >
                #{t}
              </span>
            ))}
          </div>

          {/* Reactions & Engagement Summary Row */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                {totalReactionsCount} Total Reactions • {post.upvotes} Upvotes
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                {post.commentsCount} {post.commentsCount === 1 ? 'Comment' : 'Comments'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              {/* Upvote Button */}
              <button
                type="button"
                onClick={() => toggleUpvoteForumPost(post.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all transform active:scale-95 ${
                  post.hasUpvoted
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-600'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${post.hasUpvoted ? 'fill-current' : ''}`} />
                <span>Upvote ({post.upvotes})</span>
              </button>

              {/* Rich Reactions Bar */}
              <PostReactionPicker
                reactions={post.reactions}
                userReactions={post.userReactions}
                onToggleReaction={(emoji) => reactToForumPost(post.id, emoji)}
                postId={post.id}
              />
            </div>
          </div>

          {/* Comment Thread Section */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Discussion Thread ({post.commentsCount})
              </h3>

              {/* Sort Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSortBy('TOP')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    sortBy === 'TOP'
                      ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  🔥 Top
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('NEWEST')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    sortBy === 'NEWEST'
                      ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  ⏱️ Newest
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('SOLUTIONS')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    sortBy === 'SOLUTIONS'
                      ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  🏆 Verified Answers
                </button>
              </div>
            </div>

            {/* List of comments */}
            {sortedComments.length > 0 ? (
              <div className="space-y-3.5">
                {sortedComments.map((comment) => (
                  <ForumCommentItem
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    postAuthorId={post.authorId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  No replies yet in this thread!
                </p>
                <p className="text-xs text-slate-400">
                  Be the first to share an eco-tip or ask a question and earn +2 EcoPoints!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Comment Input Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 space-y-3">
          {/* Quick preset question suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-bold whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Suggestions:
            </span>
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCommentText(qp.insert)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors"
              >
                {qp.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendComment();
              }}
              placeholder={`Contribute as ${currentUser.name} (Earn +2 EcoPoints)...`}
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            <button
              type="button"
              onClick={handleSendComment}
              disabled={!commentText.trim()}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Post Reply</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              +2 EcoPoints reward awarded per constructive community reply
            </span>
            <span>{commentText.length}/500</span>
          </div>
        </div>
      </div>
    </div>
  );
};
