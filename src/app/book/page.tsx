'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { openLibraryClient } from '@/utils/OpenLib';
import GenreBookList from './bookList';
import { Book } from '@/type/book';


const genreBuku = [
  'Fiction', 'Science', 'History', 'Biography', 'Fantasy', 
  'Mystery', 'Computers', 'Business', 'Poetry', 'Philosophy'
];

export default function BookListPage() {
  const [booksByGenre, setBooksByGenre] = useState<{ [key: string]: Book[] }>({});
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mainGenres = genreBuku.slice(0, 5);
    
    Promise.all(mainGenres.map(g => 
      openLibraryClient.get(`/search.json?q=subject:${g.toLowerCase()}&limit=10`)
    ))
    .then(results => {
      const dataMap: { [key: string]: Book[] } = {};
      results.forEach((res, i) => {
        dataMap[mainGenres[i]] = res.data.docs || [];
      });
      setBooksByGenre(dataMap);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);


  if (loading) return <div className="p-6 font-bold text-center text-blue-600 animate-pulse">Loading Books...</div>;


  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-black bg-white relative">
      

      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-64 bg-white border-r-2 border-black p-6 z-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl">Kategori Buku</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="font-bold text-lg">✕</button>
            </div>
            <div className="flex flex-col gap-2">
              {genreBuku.map(g => (
                <button key={g} onClick={() => { setSelectedGenre(g); setIsSidebarOpen(false); }} className="text-left py-2 px-3 font-bold text-sm border-2 border-transparent hover:border-black hover:bg-blue-50 rounded-xl">
                  {g}
                </button>
              ))}
            </div>
          </div>
        </>
      )}


      {/* header */}
      <nav className="flex justify-between items-center border-b-2 border-black pb-4 mb-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="border-2 border-black p-1.5 rounded-lg hover:bg-gray-100 font-bold">☰</button>
          <Link href="/"><h1 className="text-3xl font-black">MedLog <span className="text-blue-600 text-sm font-bold">Books</span></h1></Link>
        </div>
      </nav>


      {/* genre buku */}
      {selectedGenre ? (
        <GenreBookList 
          genre={selectedGenre} 
          onClose={() => setSelectedGenre(null)} 
        />
      ) : (
        genreBuku.slice(0, 5).map(genre => (
          <section key={genre} className="mb-14">
            
            <div className="w-full bg-blue-600 text-white font-black py-2 border-2 border-black rounded-full text-sm uppercase text-center mb-3">
              {genre}
            </div>

            {/* Slider Horizontal Buku Open Library */}
            <div className="bg-[#f0f5ff] border-2 border-black rounded-2xl p-4 flex gap-4 overflow-x-auto">
              {booksByGenre[genre]?.map((book: Book, index: number) => {
                const bookId = book.key ? book.key.replace('/works/', '') : index;
                const coverImg = book.cover_i 
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                  : 'https://openlibrary.org/images/icons/avatar_book-lg.png';
                
                return (
                  <Link href={`/book/${bookId}`} key={`${book.key}-${index}`} className="min-w-[130px] max-w-[130px] bg-white border-2 border-black p-2 rounded-lg hover:scale-105 transition-all flex flex-col justify-between">
                    <img src={coverImg} alt={book.title} className="w-full aspect-[2/3] object-cover rounded mb-2" />
                    <p className="text-xs font-bold truncate text-black">{book.title}</p>
                  </Link>
                );
              })}
            </div>

          </section>
        ))
      )}
    </div>
  );
}