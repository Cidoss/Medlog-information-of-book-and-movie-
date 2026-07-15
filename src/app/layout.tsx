'use client';

import React, { createContext, useContext, useState } from 'react';
import './globals.css';

type CommentStore = { [id: string]: { name: string; text: string }[] };
type AppCommentContextType = {
  allComments: CommentStore;
  addComment: (id: string, newComment: { name: string; text: string }) => void;
};

const AppCommentContext = createContext<AppCommentContextType | undefined>(undefined);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [allComments, setAllComments] = useState<CommentStore>({});

  const addComment = (id: string, newComment: { name: string; text: string }) => {
    setAllComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), newComment],
    }));
  };

  return (
    <html lang="en">
      <body>
        <AppCommentContext.Provider value={{ allComments, addComment }}>
          {children}
        </AppCommentContext.Provider>
      </body>
    </html>
  );
}

export function useAppComments() {
  const context = useContext(AppCommentContext);
  if (!context) throw new Error('useAppComments must be used within RootLayout');
  return context;
}