import React, { useState } from 'react';
import { 
  ThumbsUp, 
  CornerDownRight, 
  CheckCircle, 
  Trash2, 
  Send, 
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  User
} from 'lucide-react';
import { ForumComment } from '../../types/community';
import { useEcoSort } from '../../context/EcoSortContext';

interface ForumCommentItemProps {
  comment: ForumComment;
  postId: string;
  postAuthorId?: string;
  isNested?: boolean;
}

export const ForumCommentItem: React.FC<ForumCommentItemProps> = ({
  comment,
  postId,
  postAuthorId,
  isNested = false
}) => {
  const {
    currentUser,
    reactToForumComment,
    toggleUpvoteForumComment,
    toggleVerifyCommentSolution,
    deleteForumComment,
    addForumComment
  } = useEcoSort();

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const canVerify = currentUser.role === 'ADMIN' || currentUser.id === postAuthorId;
  const canDelete = currentUser.role === 'ADMIN' || currentUser.id === comment.authorId;

  const quickReactions = ['🌱', '💡', '👏', '❤️'];

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const taggedPrefix = replyText.startsWith('@') ? '' : `@${comment.authorName} `;
    addForumComment(postId, `${taggedPrefix}${replyText.trim()}`, comment.id);
    setReplyText('');
    setIsReplying(false);
  };

  const formattedTime = (() => {
    try {
      const date = new Date(comment.createdAt);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  })();

  return (
    <div 
      className={`space-y-2.5 transition-all ${
        isNested ? 'pl-4 sm:pl-6 border-l-2 border-slate-200 dark:border-slate-800' : ''
      }`}
      id={`comment-${comment.id}`}
    >
      <div 
        className={`p-3.5 sm:p-4 rounded-2xl transition-all ${
          comment.isVerifiedSolution
            ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-500/30'
            : 'bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60'
        }`}
      >
        {/* Comment Author Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {comment.authorName}
                </span>

                {comment.authorBadge && (
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-extrabold">
                    {comment.authorBadge}
                  </span>
                )}

                {comment.authorRole === 'ADMIN' && (
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-extrabold border border-blue-500/20 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> EPA
                  </span>
                )}

                {comment.authorRole === 'COLLECTION_AGENT' && (
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-extrabold border border-amber-500/20">
                    Route Agent
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-2.5 h-2.5" />
                {formattedTime}
              </span>
            </div>
          </div>

          {/* Badges / Verified Solution Status */}
          <div className="flex items-center gap-1.5">
            {comment.isVerifiedSolution && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                Verified Answer
              </span>
            )}

            {canVerify && (
              <button
                type="button"
                onClick={() => toggleVerifyCommentSolution(postId, comment.id)}
                title={comment.isVerifiedSolution ? "Unmark solution" : "Mark as verified solution"}
                className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-[10px] transition-colors"
              >
                <Award className={`w-3.5 h-3.5 ${comment.isVerifiedSolution ? 'text-emerald-500 fill-emerald-500/20' : ''}`} />
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                onClick={() => deleteForumComment(postId, comment.id)}
                title="Delete comment"
                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-[10px] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <div className="mt-2 text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line pl-9">
          {comment.content}
        </div>

        {/* Comment Reactions & Action Row */}
        <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-2 pl-9">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Upvote comment */}
            <button
              type="button"
              onClick={() => toggleUpvoteForumComment(postId, comment.id)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                comment.hasUpvoted
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-600'
              }`}
            >
              <ThumbsUp className={`w-3 h-3 ${comment.hasUpvoted ? 'fill-current' : ''}`} />
              <span>{comment.upvotes || 0}</span>
            </button>

            {/* Render active comment reactions */}
            {comment.reactions && Object.entries(comment.reactions).map(([emoji, count]) => {
              const numericCount = Number(count);
              if (numericCount <= 0) return null;
              const hasReacted = (comment.userReactions || []).includes(emoji);
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => reactToForumComment(postId, comment.id, emoji)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                    hasReacted
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                      : 'bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <span className="text-xs">{emoji}</span>
                  <span className="text-[10px]">{numericCount}</span>
                </button>
              );
            })}

            {/* Quick reaction trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="px-1.5 py-0.5 rounded-lg text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                title="Add reaction"
              >
                + React
              </button>

              {showEmojiPicker && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowEmojiPicker(false)} />
                  <div className="absolute bottom-full left-0 mb-1 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-lg flex items-center gap-1 animate-in fade-in">
                    {quickReactions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          reactToForumComment(postId, comment.id, emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-1 rounded hover:scale-125 transition-transform text-sm"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reply Button */}
          {!isNested && (
            <button
              type="button"
              onClick={() => setIsReplying(!isReplying)}
              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <CornerDownRight className="w-3 h-3" />
              <span>{isReplying ? 'Cancel Reply' : 'Reply'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Inline Nested Reply Input Box */}
      {isReplying && (
        <div className="pl-6 sm:pl-8 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendReply();
              }}
              placeholder={`Replying to @${comment.authorName}...`}
              className="flex-1 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              <Send className="w-3 h-3" />
              <span>Reply</span>
            </button>
          </div>
        </div>
      )}

      {/* Nested Replies Rendering */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2 mt-2">
          {comment.replies.map((reply) => (
            <ForumCommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              postAuthorId={postAuthorId}
              isNested={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};
