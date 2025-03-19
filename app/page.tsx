'use client';
import { useState } from 'react';
import Image from "next/image";
import emailjs from '@emailjs/browser';
import CourseSelector from './components/CourseSelector';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await emailjs.send(
        'service_6tslfbz',
        'template_1pmiy3g',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'lykrvr8rKsGjuTLOM'
      );

      setStatus('success');
      setMessage('Message envoyé avec succès !');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue lors de l\'envoi du message');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-yellow-400">MusicSchool</h1>
          <div className="space-x-6">
            <a href="#cours" className="hover:text-yellow-400">Nos Cours</a>
            <a href="#professeurs" className="hover:text-yellow-400">Professeurs</a>
            <a href="#contact" className="hover:text-yellow-400">Contact</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Apprenez la musique avec passion</h2>
        <p className="text-xl mb-8">Découvrez nos cours de guitare, batterie et basse avec des professeurs expérimentés</p>
        <button className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition">
          Réserver un cours d'essai
        </button>
      </section>

      {/* Cours Section */}
      <section id="cours" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Nos Cours</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Guitare */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Guitare</h3>
            <p className="mb-4">Cours pour tous niveaux, de débutant à avancé</p>
            <ul className="space-y-2">
              <li>• Guitare acoustique</li>
              <li>• Guitare électrique</li>
              <li>• Guitare basse</li>
            </ul>
            <button className="mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full hover:bg-yellow-500 transition">
              En savoir plus
            </button>
          </div>

          {/* Batterie */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Batterie</h3>
            <p className="mb-4">Apprenez les rythmes et techniques de base</p>
            <ul className="space-y-2">
              <li>• Rythmes de base</li>
              <li>• Techniques avancées</li>
              <li>• Styles variés</li>
            </ul>
            <button className="mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full hover:bg-yellow-500 transition">
              En savoir plus
            </button>
          </div>

          {/* Basse */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Basse</h3>
            <p className="mb-4">Maîtrisez l'art de la basse</p>
            <ul className="space-y-2">
              <li>• Techniques de base</li>
              <li>• Harmonie</li>
              <li>• Styles musicaux</li>
            </ul>
            <button className="mt-4 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full hover:bg-yellow-500 transition">
              En savoir plus
            </button>
          </div>
        </div>
      </section>

      {/* Course Selector Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Choisissez votre cours</h2>
        <CourseSelector />
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Contactez-nous</h2>
        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-700"
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-700"
              />
            </div>
            <div>
              <label className="block mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-gray-700 h-32"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full bg-yellow-400 text-gray-900 py-3 rounded-full font-bold hover:bg-yellow-500 transition ${
                status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-4 rounded ${
              status === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {message}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>© 2024 MusicSchool. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
