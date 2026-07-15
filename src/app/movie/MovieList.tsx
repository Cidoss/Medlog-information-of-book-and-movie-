'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { tmdbClient } from '@/utils/tmdb';
import { Movie } from '@/type/movie';


interface GenreMovieListProps {
  genre: { id: number; name: string };
  onClose: () => void;
}


export default function GenreMovieList({ genre, onClose }: GenreMovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);


  // isi film sesuai genre

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [genre.id]);


  // ambil data film per page
  useEffect(() => {
    setFetching(true);

    tmdbClient.get(`/discover/movie?with_genres=${genre.id}&page=${page}`)
      .then(res => {
        const newMovies: Movie[] = res.data.results || [];
        
        if (newMovies.length === 0) {
          setHasMore(false);
        } else {
          setMovies(prev => [...prev, ...newMovies]);
        }
        setFetching(false);
      })
      .catch(() => setFetching(false));
    }, [genre.id, page]);


  //render film baru saat scroll bawah
  const handleScroll = () => {
    if (!containerRef.current || fetching || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setPage(prev => prev + 1);
    }
  };

// isi
return (
    <section className="mb-14 bg-[#fff0f0] border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      
      <div className="w-full bg-red-600 text-white font-black py-2 border-2 border-black rounded-full text-sm uppercase text-center mb-6 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <span>Genre: {genre.name}</span>
        <button onClick={onClose} className="absolute right-4 font-bold bg-black text-white px-2 py-0.5 rounded-full text-xs hover:bg-gray-800 transition-all">
          ✕ Close
        </button>
      </div>

      {/* kotak film */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-[450px] overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 border-b-2 border-dashed border-black pb-4"
      >
        {movies.map((movie: Movie, index: number) => (
          <Link 
            href={`/movie/${movie.id}`} 
            key={`${movie.id}-${index}`} 
            className="bg-white border-2 border-black p-2 rounded-lg hover:scale-90 transition-all flex flex-col justify-between"
          >
            <img 
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://placehold.co/300x450?text=No+Poster'} 
              alt={movie.title} 
              className="w-full aspect-[2/3] object-cover rounded mb-2" 
            />
            <p className="text-xs font-bold truncate text-black">{movie.title}</p>
          </Link>
        ))}

        {fetching && (
          <div className="col-span-full text-center py-4 font-black text-xs text-red-600 animate-pulse">
            Muat film lainnya
          </div>
        )}
      </div>

      <div className="w-full text-center pt-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {hasMore ? "Scroll ke bawah" : "Film genre ini telah dimuat"}
      </div>

    </section>
  );
}