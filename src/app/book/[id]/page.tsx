'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { openLibraryClient } from '@/utils/OpenLib';
import { useAppComments } from '@/app/layout';
import { Book } from '@/type/book';

interface CommentItem {
  name: string;
  text: string;
}

export default function BookDetailPage() {
  const { id } = useParams();
  
  let bookId = '';
  if (id) {
    if (Array.isArray(id)) bookId = id[0];
    else bookId = id;
  }

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<CommentItem>({ name: '', text: '' });
  const { allComments, addComment } = useAppComments();

  let comments: CommentItem[] = [];
  if (allComments[bookId]) comments = allComments[bookId];

  useEffect(() => {
    if (bookId) {
      openLibraryClient.get('/works/' + bookId + '.json')
        .then(res => { setBook(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [bookId]);

  if (loading) return <div className="p-6 text-center font-bold">Loading...</div>;
  if (!book) return <div className="p-6 text-center font-bold">Buku tidak ditemukan!</div>;

  let sinopsis = 'Sinopsis tidak tersedia.';
  if (book.description) {
    if (typeof book.description === 'object') sinopsis = book.description.value;
    else sinopsis = book.description;
  }

  let coverUrl = 'https://openlibrary.org/images/icons/avatar_book-lg.png';
  if (book.covers && book.covers.length > 0) {
    coverUrl = 'https://covers.openlibrary.org/b/id/' + book.covers[0] + '-L.jpg';
  }

  let kategori = 'Tidak tersedia';
  if (book.subjects) kategori = book.subjects.join(', ');

  let latarTempat = 'Tidak tersedia';
  if (book.subject_places) latarTempat = book.subject_places.join(', ');

  let terbit = (book.first_publish_date ) || 'Tidak tersedia';

  return (
    <div className="max-w-6xl mx-auto p-6 text-black bg-white min-h-screen font-sans">
      <nav className="flex justify-between items-center border-b-2 border-black pb-4 mb-6">
        <Link href="/"><h1 className="text-3xl font-black">MedLog <span className="text-blue-600 text-sm font-bold">Books</span></h1></Link>
        <Link href="/book" className="border-2 border-black px-4 py-1.5 rounded-full text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Kembali</Link>
      </nav>

      <div className="mb-6">
        <h2 className="text-3xl font-black uppercase tracking-wide">{book.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <img src={coverUrl} alt={book.title} className="rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] aspect-[2/3] object-cover w-full" />
        <div className="md:col-span-2 bg-[#f0f5ff] border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold flex flex-col justify-between space-y-3">
          <div className="space-y-2 text-sm">
            <p className="text-lg text-blue-600">Detail Lengkap</p>
            <p><span className="text-gray-500">Judul:</span> {book.title}</p>
            <p><span className="text-gray-500">Terbit:</span> {terbit}</p>
            <p><span className="text-gray-500">Kategori:</span> {kategori}</p>
            <p><span className="text-gray-500">Latar Tempat:</span> {latarTempat}</p>
          </div>
        </div>
      </div>

      <div className="border-2 border-black rounded-2xl p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-2">Sinopsis Buku</h3>
        <p className="font-bold text-gray-800 leading-relaxed whitespace-pre-line">{sinopsis}</p>
      </div>

      <div className="border-2 border-black rounded-2xl p-6 bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-black uppercase mb-4">Ulasan Pembaca ({comments.length})</h3>
        <form onSubmit={(e) => { e.preventDefault(); addComment(bookId, form); setForm({ name: '', text: '' }); }} className="mb-6 space-y-3">
          <input type="text" placeholder="Nama..." value={form.name} onChange={e => setForm({name: e.target.value, text: form.text})} className="w-full px-4 py-2 border-2 border-black rounded-xl font-bold" required />
          <textarea placeholder="Ulasan..." value={form.text} onChange={e => setForm({name: form.name, text: e.target.value})} rows={2} className="w-full px-4 py-2 border-2 border-black rounded-xl font-bold resize-none" required />
          <button type="submit" className="bg-blue-600 text-white font-black px-6 py-2 border-2 border-black rounded-xl text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">Kirim</button>
        </form>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {comments.map((c, i) => (
            <div key={i} className="bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold">
              <p className="text-xs text-blue-600">@{c.name}</p>
              <p className="text-sm text-gray-800">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}