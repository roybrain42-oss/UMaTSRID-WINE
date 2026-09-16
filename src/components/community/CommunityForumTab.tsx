import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Search, 
  Plus, 
  Tag, 
  Pin, 
  Send, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Lightbulb, 
  ShieldCheck,
  Share2,
  Clock,
  Bookmark,
  Flame,
  CheckCircle2,
  ExternalLink,
  Coins,
  MapPin,
  Filter,
  User
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { CommunityForumPost, ForumPostCategory } from '../../types/community';
import { CreateForumPostModal } from './CreateForumPostModal';
import { PostReactionPicker } from './PostReactionPicker';
import { ForumCommentItem } from './ForumCommentItem';
import { PostDiscussionModal } from './PostDiscussionModal';

export const CommunityForumTab: React.FC = () => {
  const { 
    forumPosts, 
    toggleUpvoteForumPost,
    reactToForumPost,
    toggleBookmarkForumPost,
    addForumComment, 
    currentUser,
    addToast
  } = useEcoSort();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSortTab, setActiveSortTab] = useState<'TRENDING' | 'LATEST' | 'VERIFIED' | 'BOOKMARKS'>('TRENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentInputByPost, setCommentInputByPost] = useState<Record<string, string>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedModalPost, setSelectedModalPost] = useState<CommunityForumPost | null>(null);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All Discussions', icon: '💬' },
    { id: 'TIPS_HACKS', label: 'Tips & Hacks', icon: '💡' },
    { id: 'UPCYCLING_DIY', label: 'Upcycling DIY', icon: '🎨' },
    { id: 'QUESTIONS', label: 'Q & A Help', icon: '❓' },
    { id: 'LOCAL_INITIATIVE', label: 'Local Drives', icon: '🏘️' },
    { id: 'POLICY_EPA', label: 'EPA Ghana & Carbon', icon: '📜' }
  ];

  const filteredPosts = useMemo(() => {
    let result = forumPosts.filter(post => {
      if (selectedCategory !== 'ALL' && post.category !== selectedCategory) return false;
      if (activeSortTab === 'BOOKMARKS' && !post.isBookmarked) return false;
      if (activeSortTab === 'VERIFIED') {
        const hasVerifiedComment = post.comments && post.comments.some(c => c.isVerifiedSolution);
        if (!hasVerifiedComment && post.authorRole !== 'ADMIN') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inContent = post.content.toLowerCase().includes(q);
        const inTags = post.tags.some(t => t.toLowerCase().includes(q));
        const inAuthor = post.authorName.toLowerCase().includes(q);
        if (!inTitle && !inContent && !inTags && !inAuthor) return false;
      }
      return true;
    });

    if (activeSortTab === 'TRENDING') {
      result.sort((a, b) => {
        const rA = Object.values(a.reactions || {}).reduce((acc: number, v) => acc + Number(v), 0) + a.upvotes + (a.commentsCount * 2);
        const rB = Object.values(b.reactions || {}).reduce((acc: number, v) => acc + Number(v), 0) + b.upvotes + (b.commentsCount * 2);
        return rB - rA;
      });
    } else if (activeSortTab === 'LATEST') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [forumPosts, selectedCategory, activeSortTab, searchQuery]);

  const handleSendInlineComment = (postId: string) => {
    const text = commentInputByPost[postId] || '';
    if (!text.trim()) return;
    addForumComment(postId, text);
    setCommentInputByPost(prev => ({ ...prev, [postId]: '' }));
  };

  const handleShare = (post: CommunityForumPost) => {
    const shareText = `EcoSort Ghana Forum: "${post.title}" by ${post.authorName}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      addToast({
        title: 'Link Copied! 🔗',
        message: 'Discussion link copied to clipboard.',
        type: 'info',
        duration: 2500
      });
    }
  };

  const totalReactionsAll = forumPosts.reduce((acc, p) => {
    const reactionsTotal = Object.values(p.reactions || {}).reduce((a: number, b) => a + Number(b), 0);
    return acc + reactionsTotal + (p.upvotes || 0);
  }, 0);

  const totalCommentsAll = forumPosts.reduce((acc, p) => acc + (p.commentsCount || 0), 0);

  return (
    <div className="space-y-6" id="community-forum-tab">
      {/* Top Knowledge Hub Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold uppercase tracking-widest border border-blue-400/30">
                Eco-Knowledge Hub & Forum
              </span>
              <span className="text-xs text-slate-300">Peer-to-Peer Green Network</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Ghana Sustainability Forum & Eco-Discussions
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ask sorting questions, share DIY upcycling techniques, react to community tips, and discuss EPA Ghana carbon offset standards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
              id="start-discussion-btn"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              New Discussion (+5 Pts)
            </button>
          </div>
        </div>

        {/* Engagement Stats Strip */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-blue-800/60 max-w-lg">
          <div>
            <div className="text-lg sm:text-xl font-black text-white">{forumPosts.length}</div>
            <div className="text-[10px] sm:text-xs text-blue-200">Active Topics</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-emerald-400">{totalCommentsAll}</div>
            <div className="text-[10px] sm:text-xs text-blue-200">Replies Shared</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-black text-amber-400">{totalReactionsAll}</div>
            <div className="text-[10px] sm:text-xs text-blue-200">Eco-Reactions</div>
          </div>
        </div>

        {/* Channels Pill Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto mt-5 pt-3 border-t border-blue-800/40 pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === c.id
                  ? 'bg-white text-slate-950 shadow-md font-extrabold'
                  : 'bg-blue-950/60 text-blue-200 hover:bg-blue-900/60 border border-blue-800/40'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter & Sorting Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions by topic, keyword (#Upcycling, #PlasticSort), or author..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Sort Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl overflow-x-auto scrollbar-none">
          {[
            { id: 'TRENDING', label: 'Trending', icon: Flame },
            { id: 'LATEST', label: 'Latest', icon: Clock },
            { id: 'VERIFIED', label: 'Verified Answers', icon: CheckCircle2 },
            { id: 'BOOKMARKS', label: 'Saved', icon: Bookmark }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSortTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSortTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Forum Thread Feed */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            const currentCommentText = commentInputByPost[post.id] || '';

            return (
              <div
                key={post.id}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all shadow-sm ${
                  post.isPinned 
                    ? 'border-blue-500/40 bg-gradient-to-br from-blue-50/20 dark:from-blue-950/10 to-transparent' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                id={`forum-post-${post.id}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {post.authorName}
                        </span>
                        {post.authorBadge && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-500/20">
                            {post.authorBadge}
                          </span>
                        )}
                        {post.authorRole === 'ADMIN' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-400/20 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> EPA Officer
                          </span>
                        )}
                        {post.isPinned && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        {post.authorLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {post.authorLocation}
                          </span>
                        )}
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Category Pill */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleBookmarkForumPost(post.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        post.isBookmarked
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={post.isBookmarked ? 'Saved' : 'Save discussion'}
                    >
                      <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleShare(post)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {post.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Title & Body */}
                <div className="mt-3.5 space-y-2">
                  <h3 
                    onClick={() => setSelectedModalPost(post)}
                    className="text-base sm:text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Interactive Engagement & Reaction Bar */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* Upvote Button */}
                    <button
                      onClick={() => toggleUpvoteForumPost(post.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all transform active:scale-95 ${
                        post.hasUpvoted
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${post.hasUpvoted ? 'fill-current' : ''}`} />
                      <span>{post.upvotes}</span>
                    </button>

                    {/* Rich Emoji Reactions Picker & Counts */}
                    <PostReactionPicker
                      reactions={post.reactions}
                      userReactions={post.userReactions}
                      onToggleReaction={(emoji) => reactToForumPost(post.id, emoji)}
                      postId={post.id}
                    />

                    {/* Comments Toggle */}
                    <button
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{post.commentsCount} {post.commentsCount === 1 ? 'Reply' : 'Replies'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedModalPost(post)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
                    >
                      <span>Full Thread</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {isExpanded ? 'Hide Replies' : 'Join Discussion'}
                    </button>
                  </div>
                </div>

                {/* Expanded Inline Replies & Comment Box */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
                    {/* Comments List */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-3">
                        {post.comments.map((comm) => (
                          <ForumCommentItem
                            key={comm.id}
                            comment={comm}
                            postId={post.id}
                            postAuthorId={post.authorId}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center border border-dashed border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-400 italic">No replies yet. Be the first to share an eco-tip!</p>
                      </div>
                    )}

                    {/* Add Inline Comment Input */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={currentCommentText}
                          onChange={(e) => setCommentInputByPost(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendInlineComment(post.id);
                          }}
                          placeholder={`Write a helpful reply as ${currentUser.name}...`}
                          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleSendInlineComment(post.id)}
                          disabled={!currentCommentText.trim()}
                          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply (+2 Pts)</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <Coins className="w-3 h-3 text-amber-500" /> +2 EcoPoints awarded on submission
                        </span>
                        <span>{currentCommentText.length}/500</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No discussions found matching your filter
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try choosing another topic channel, clearing your search keywords, or create a brand new discussion.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setActiveSortTab('TRENDING');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Create Topic Modal */}
      <CreateForumPostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Full Post Discussion Modal */}
      <PostDiscussionModal
        post={selectedModalPost}
        isOpen={!!selectedModalPost}
        onClose={() => setSelectedModalPost(null)}
      />
    </div>
  );
};
