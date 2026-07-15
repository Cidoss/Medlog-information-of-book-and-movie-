'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { tmdbClient } from '@/utils/tmdb';
import { Movie } from '@/type/movie';
import GenreMovieList from '@/app/movie/MovieList';


const semuaGenre = [
  { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' }, { id: 878, name: 'Sci-Fi' }, { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' }, { id: 80, name: 'Crime' }, { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' }, { id: 53, name: 'Thriller' }
];


export default function MovieListPage() {
  const [moviesByGenre, setMoviesByGenre] = useState<{ [key: number]: Movie[] }>({});
  const [selectedGenre, setSelectedGenre] = useState<{ id: number; name: string } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  // ambil 10 film
  useEffect(() => {
    const genreUtama = semuaGenre.slice(0, 5);
    Promise.all(genreUtama.map(g => tmdbClient.get(`/discover/movie?with_genres=${g.id}`)))
      .then(results => {
        const dataMap: { [key: number]: Movie[] } = {};
        results.forEach((res, i) => dataMap[genreUtama[i].id] = res.data.results.slice(0, 10));
        setMoviesByGenre(dataMap);
        setLoading(false);
      });
  }, []);


  if (loading) return <div className="p-6 font-bold text-center">Loading Movies...</div>;


  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-black bg-white relative">
      

      {/* sidebar */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-64 bg-white border-r-2 border-black p-6 z-50 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl border-2 border-black p-2 rounded-lg">Semua Genre</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="font-bold text-lg">✕</button>
            </div>
            <div className="flex flex-col gap-2">
              {semuaGenre.map(g => (
                <button key={g.id} onClick={() => { setSelectedGenre(g); setIsSidebarOpen(false); }} className="text-left py-2 px-3 font-bold text-sm border-2 border-transparent hover:border-black hover:bg-red-50 rounded-xl">
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}


      {/* head */}
      <nav className="flex justify-between items-center border-b-2 border-black pb-4 mb-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="border-2 border-black p-1.5 rounded-lg hover:bg-gray-100 font-bold">☰</button>
          <Link href="/"><h1 className="text-3xl font-black">MedLog</h1></Link>
        </div>
      </nav>


      {/* tampilkan genre dan filmnya */}
      {selectedGenre ? (
        <GenreMovieList 
          genre={selectedGenre} 
          onClose={() => setSelectedGenre(null)} 
        />
      ) : (
        semuaGenre.slice(0, 5).map(genre => (
          <section key={genre.id} className="mb-14">
            <div className="w-full bg-red-600 text-white font-black py-2 border-2 border-black rounded-full text-sm uppercase text-center mb-3 ">{genre.name}</div>
            <div className="bg-[#fff0f0] border-2 border-black rounded-2xl p-4 flex gap-4 overflow-x-auto">
              {moviesByGenre[genre.id]?.map(movie => (
                <Link href={`/movie/${movie.id}`} key={movie.id} className="min-w-[130px] bg-white border-2 border-black p-2 rounded-lg hover:scale-105 transition-all">
                  <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="w-full aspect-[2/3] object-cover rounded mb-2" />
                  <p className="text-xs font-bold truncate">{movie.title}</p>
                </Link>
              ))}
            </div>
          </section>
        ))
      )}

    </div>
  );
}