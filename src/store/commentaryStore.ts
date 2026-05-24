import { create } from 'zustand';
import { CommentaryEntry } from '../types';

interface CommentaryStore {
  commentaries: CommentaryEntry[];
  addCommentaries: (entries: CommentaryEntry[]) => void;
  likeCommentary: (id: string) => void;
  clearCommentary: () => void;
}

export const useCommentaryStore = create<CommentaryStore>((set) => ({
  commentaries: [],
  addCommentaries: (entries) => set((state) => ({
    commentaries: [...entries, ...state.commentaries].slice(0, 100) // keep last 100 commentaries
  })),
  likeCommentary: (id) => set((state) => ({
    commentaries: state.commentaries.map((c) =>
      c.id === id ? { ...c, likes: c.likes + 1 } : c
    )
  })),
  clearCommentary: () => set({ commentaries: [] })
}));
export default useCommentaryStore;
