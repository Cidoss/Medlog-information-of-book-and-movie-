'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { tmdbClient } from '@/utils/tmdb';
import { Movie } from '@/type/movie';
import { useAppComments } from '@/app/layout'; // Hook yang benar

export default function MovieDetailPage() {
  const { id } = useParams();
  const movieId = id ? (Array.isArray(id) ? id[0] : id) : '';

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', text: '' });

  const { allComments, addComment } = useAppComments();
  const currentComments = (movieId && allComments[movieId]) ? allComments[movieId] : [];

  useEffect(() => {
    if (movieId) {
      tmdbClient.get(`/movie/${movieId}`)
        .then(res => {
          setMovie(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [movieId]);

  if (loading) return <div className="p-6 font-bold text-center">Loading...</div>;
  if (!movie) return <div className="p-6 font-bold text-center">Movie tidak ditemukan!</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-black bg-white min-h-screen font-sans">
      <nav className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
        <Link href="/">
          <h1 className="text-3xl font-black">MedLog <span className="text-red-600 text-sm font-bold">Movies</span></h1>
        </Link>
        <Link href="/movie" className="border-2 border-black px-4 py-1.5 rounded-full text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-all">
          Kembali
        </Link>
      </nav>

      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase tracking-wide">{movie.title}</h2>
        {movie.tagline && <p className="text-sm italic text-gray-500 font-bold mt-1">"{movie.tagline}"</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] aspect-[2/3] object-cover w-full" />
        <div className="md:col-span-2 bg-[#fff0f0] border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold flex flex-col justify-between space-y-3">
          <div className="space-y-2 text-sm">
            <p className="text-lg text-red-600">★ Rating: {movie.vote_average?.toFixed(1) ?? '0.0'} / 10 ({movie.vote_count?.toLocaleString() ?? 0} votes)</p>
            <p><span className="text-gray-500">Tanggal Rilis:</span> {movie.release_date ?? '-'}</p>
            <p><span className="text-gray-500">Durasi:</span> {movie.runtime ? `${movie.runtime} Menit` : '-'}</p>
            <p><span className="text-gray-500">Genre:</span> {movie.genres?.map(g => g.name).join(', ') || '-'}</p>
          </div>
          <div className="border-t-2 border-black border-dashed pt-3 space-y-2">
            <p><span className="text-gray-500">Budget:</span> {movie.budget && movie.budget > 0 ? `$${movie.budget.toLocaleString('en-US')}` : 'Tidak Diketahui'}</p>
            <p><span className="text-gray-500">Pendapatan:</span> {movie.revenue && movie.revenue > 0 ? `$${movie.revenue.toLocaleString('en-US')}` : 'Tidak Diketahui'}</p>
            <p><span className="text-gray-500">Studio:</span> {movie.production_companies?.map(c => c.name).slice(0, 3).join(', ') || '-'}</p>
          </div>
        </div>
      </div>

      <div className="border-2 border-black rounded-2xl p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-2">Sinopsis</h3>
        <p className="font-bold text-gray-800 leading-relaxed">{movie.overview || 'Sinopsis tidak tersedia.'}</p>
      </div>

      <div className="border-2 border-black rounded-2xl p-6 bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4">Kritik & Ulasan ({currentComments.length})</h3>
        <form onSubmit={e => { e.preventDefault(); addComment(movieId, form); setForm({ name: '', text: '' }); }} className="mb-6 space-y-3">
          <input type="text" placeholder="Nama Lu..." value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border-2 border-black rounded-xl font-bold focus:outline-none" required />
          <textarea placeholder="Isi ulasan..." value={form.text} onChange={e => setForm({...form, text: e.target.value})} rows={2} className="w-full px-4 py-2 border-2 border-black rounded-xl font-bold resize-none focus:outline-none" required />
          <button type="submit" className="bg-red-600 text-white font-black px-6 py-2 border-2 border-black rounded-xl text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 uppercase">Kirim</button>
        </form>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {currentComments.map((c, i) => (
            <div key={i} className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
              <p className="text-xs text-red-600">@{c.name}</p>
              <p className="text-sm text-gray-800">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}