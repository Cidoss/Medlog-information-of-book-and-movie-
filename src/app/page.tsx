'use client';



import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { tmdbClient } from '@/utils/tmdb';

import { openLibraryClient } from '@/utils/OpenLib';

import { Movie } from '@/type/movie';

import { Book } from '@/type/book';





export default function HomePage() {

  const [movies, setMovies] = useState<Movie[]>([]);

  const [books, setBooks] = useState<Book[]>([]);

  const [loading, setLoading] = useState(true);





  useEffect(() => {

    // Ambil data film populer

    tmdbClient.get('/movie/popular?page=1')

      .then((res) => {

        setMovies(res.data.results.slice(0, 10));

        setLoading(false);

      })

      .catch((err) => console.error(err));



    // Ambil data buku best seller

    openLibraryClient.get('/search.json?q=best+seller&limit=10')

      .then((res) => {

        setBooks(res.data.docs || []);

      })

      .catch((err) => console.error(err));

  }, []);





  if (loading) return <div className="p-6 font-bold text-center">Loading...</div>;





  return (

    <div className="max-w-6xl mx-auto p-6 font-sans text-black bg-white">

     

      {/* HEADER NAVBAR */}

      <nav className="flex justify-between items-center border-b-2 border-black pb-4 mb-10">
        <h1 className="text-3xl font-black">MedLog</h1>
        <div className="w-64">
        </div>
      </nav>


      {/* Film */}
      <section className="mb-14">
        <Link href="/movie" className="block hover:opacity-90 transition-all">
          <div className="medlog-banner-btn bg-red-600">Movie</div>
        </Link>

        <div className="bg-[#fff0f0] border-2 border-black rounded-2xl p-4 flex gap-4 overflow-x-auto">
          {movies.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className="medlog-card transition-all duration-300 hover:scale-105">
              <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="w-full aspect-[2/3] object-cover rounded mb-2" />
              <p className="text-xs font-bold truncate">{movie.title}</p>
            </Link>
          ))}

          <Link href="/movie" className="medlog-more-btn bg-red-100 hover:bg-red-200">
            <p className="text-xs font-black uppercase">Lihat Film lainnya...</p>
          </Link>
        </div>
      </section>


      {/*  Buku */}
      <section>
        <Link href="/book" className="block hover:opacity-90 transition-all">
          <div className="medlog-banner-btn bg-blue-600">Book</div>
        </Link>

        <div className="bg-[#f0f5ff] border-2 border-black rounded-2xl p-4 flex gap-4 overflow-x-auto">
          {books.map((book) => (
            <Link href={`/book/${book.key.replace('/works/', '')}`} key={book.key} className="medlog-card transition-all duration-300 hover:scale-105">
              <img src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://openlibrary.org/images/icons/avatar_book-lg.png'}
                alt={book.title}
                className="w-full aspect-[2/3] object-cover rounded mb-2"/>
              <p className="text-xs font-bold truncate">{book.title}</p>
            </Link>
          ))}

          <Link href="/book" className="medlog-more-btn bg-blue-100 hover:bg-blue-200">
            <p className="text-xs font-black uppercase">Lihat Buku Lainnya...</p>
          </Link>
        </div>
      </section>
    </div>
  );
}