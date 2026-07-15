'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { openLibraryClient } from '@/utils/OpenLib';
import { Book } from '@/type/book';


interface GenreBookListProps {
  genre: string;
  onClose: () => void;
}


export default function GenreBookList({ genre, onClose }: GenreBookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);


  // ganti buku tiap genre
  useEffect(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
  }, [genre]);


  //ambil buku dari API
  useEffect(() => {
    setFetching(true);
    
    openLibraryClient.get(`/search.json?q=subject:${genre.toLowerCase()}&page=${page}&limit=10`)
      .then(res => {
        const docs = res.data.docs || [];
        if (docs.length === 0) {
          setHasMore(false);
        } else {
          setBooks(prev => prev.concat(docs));
        }
        setFetching(false);
      })
      .catch((err) => {
        console.error(err);
        setFetching(false);
      });
  }, [genre, page]);


  // 3. Deteksi scroll internal area box
  const handleScroll = () => {
    if (!containerRef.current || fetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight <= 5) {
      setPage(prev => prev + 1);
    }
  };


  return (
    <section className="mb-14 bg-[#f0f5ff] border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      
      {/* Header Info Banner Kategori */}
      <div className="w-full bg-blue-600 text-white font-black py-2 border-2 border-black rounded-full text-sm uppercase text-center mb-6 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <span>Kategori: {genre}</span>
        <button onClick={onClose} className="absolute right-4 font-bold bg-black text-white px-2 py-0.5 rounded-full text-xs hover:bg-gray-800">
          ✕ Close
        </button>
      </div>

      {/* Kontainer Grid Hasil Fetching Data Buku Open Library */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-[450px] overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 border-b-2 border-dashed border-black pb-4"
      >
        {books.map((book: Book, index: number) => {
          // Bersihkan key path dari string '/works/XXXXX' menjadi 'XXXXX' untuk rute detail
          const bookId = book.key ? book.key.replace('/works/', '') : index;
          const coverImg = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
            : 'https://openlibrary.org/images/icons/avatar_book-lg.png';
          
          return (
            <Link 
              href={`/book/${bookId}`} 
              key={`${book.key}-${index}`} 
              className="bg-white border-2 border-black p-2 rounded-lg hover:scale-105 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
            >
              <img 
                src={coverImg} 
                alt={book.title} 
                className="w-full aspect-[2/3] object-cover rounded mb-2" 
              />
              <p className="text-xs font-bold truncate text-black">{book.title}</p>
            </Link>
          );
        })}

        {fetching && (
          <div className="col-span-full text-center py-4 font-black text-xs text-blue-600 animate-pulse">
            Muat buku lainnya
          </div>
        )}
      </div>

      {/* Penanda Batas Bawah Box */}
      <div className="w-full text-center pt-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {hasMore ? "Scroll ke bawah " : "buku kategori ini telah dimuat"}
      </div>

    </section>
  );
}