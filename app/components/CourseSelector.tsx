'use client';
import { useState } from 'react';

type CourseType = {
  instrument: string;
  type: 'individuel' | 'collectif';
  niveau: 'debutant' | 'intermediaire' | 'avance';
  duree: '30min' | '1h' | '1h30' | '2h';
  prix: number;
  date?: string;
  heure?: string;
};

type StudentInfo = {
  nom: string;
  prenom: string;
  email: string;
};

const instruments = ['Guitare', 'Batterie', 'Basse'];
const niveaux = ['debutant', 'intermediaire', 'avance'];
const durees = ['30min', '1h', '1h30', '2h'];
const heures = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const prixBase = {
  debutant: {
    '30min': 25,
    '1h': 45,
    '1h30': 65,
    '2h': 85
  },
  intermediaire: {
    '30min': 30,
    '1h': 50,
    '1h30': 70,
    '2h': 90
  },
  avance: {
    '30min': 35,
    '1h': 55,
    '1h30': 75,
    '2h': 95
  }
};

export default function CourseSelector() {
  const [selection, setSelection] = useState<CourseType>({
    instrument: '',
    type: 'individuel',
    niveau: 'debutant',
    duree: '1h',
    prix: 0
  });

  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    nom: '',
    prenom: '',
    email: ''
  });

  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reservationMessage, setReservationMessage] = useState('');

  const calculerPrix = () => {
    let prix = prixBase[selection.niveau][selection.duree];
    if (selection.type === 'collectif') {
      prix = prix * 0.7;
    }
    return prix;
  };

  const handleChange = (field: keyof CourseType, value: string) => {
    setSelection(prev => ({
      ...prev,
      [field]: value,
      prix: calculerPrix()
    }));
  };

  const handleStudentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setReservationStatus('loading');
    setReservationMessage('');

    try {
      // Créer l'événement dans le calendrier
      const calendarResponse = await fetch('/api/create-calendar-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: selection,
          student: studentInfo,
        }),
      });

      if (!calendarResponse.ok) {
        throw new Error('Erreur lors de la création de l\'événement');
      }

      // Envoyer l'email de confirmation
      const emailResponse = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: selection,
          student: studentInfo,
        }),
      });

      if (!emailResponse.ok) {
        console.error('Erreur lors de l\'envoi de l\'email');
      }

      setReservationStatus('success');
      setReservationMessage('Votre cours a été réservé avec succès ! Vous recevrez un email de confirmation.');
      setShowReservationForm(false);
      setStudentInfo({ nom: '', prenom: '', email: '' });
      setSelection({
        instrument: '',
        type: 'individuel',
        niveau: 'debutant',
        duree: '1h',
        prix: 0
      });
    } catch (error) {
      setReservationStatus('error');
      setReservationMessage('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-yellow-400">Choisissez votre cours</h3>
      
      {/* Sélection de l'instrument */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Instrument</label>
        <select
          value={selection.instrument}
          onChange={(e) => handleChange('instrument', e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option value="">Sélectionnez un instrument</option>
          {instruments.map((instrument) => (
            <option key={instrument} value={instrument}>
              {instrument}
            </option>
          ))}
        </select>
      </div>

      {/* Type de cours */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Type de cours</label>
        <div className="flex gap-4">
          <button
            onClick={() => handleChange('type', 'individuel')}
            className={`flex-1 p-2 rounded ${
              selection.type === 'individuel'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Individuel
          </button>
          <button
            onClick={() => handleChange('type', 'collectif')}
            className={`flex-1 p-2 rounded ${
              selection.type === 'collectif'
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Collectif
          </button>
        </div>
      </div>

      {/* Niveau */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Niveau</label>
        <select
          value={selection.niveau}
          onChange={(e) => handleChange('niveau', e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        >
          {niveaux.map((niveau) => (
            <option key={niveau} value={niveau}>
              {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Durée */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Durée du cours</label>
        <select
          value={selection.duree}
          onChange={(e) => handleChange('duree', e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        >
          {durees.map((duree) => (
            <option key={duree} value={duree}>
              {duree}
            </option>
          ))}
        </select>
      </div>

      {/* Date et heure */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Date du cours</label>
        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          value={selection.date || ''}
          onChange={(e) => handleChange('date', e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Heure du cours</label>
        <select
          value={selection.heure || ''}
          onChange={(e) => handleChange('heure', e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option value="">Sélectionnez une heure</option>
          {heures.map((heure) => (
            <option key={heure} value={heure}>
              {heure}
            </option>
          ))}
        </select>
      </div>

      {/* Résumé et prix */}
      {selection.instrument && selection.date && selection.heure && (
        <div className="mt-8 p-4 bg-gray-700 rounded">
          <h4 className="text-lg font-bold mb-2">Résumé de votre sélection</h4>
          <p>Cours de {selection.instrument} - {selection.type}</p>
          <p>Niveau : {selection.niveau}</p>
          <p>Durée : {selection.duree}</p>
          <p>Date : {new Date(selection.date).toLocaleDateString('fr-FR')}</p>
          <p>Heure : {selection.heure}</p>
          <p className="text-xl font-bold text-yellow-400 mt-2">
            Prix : {calculerPrix()}€
          </p>
          <button 
            onClick={() => setShowReservationForm(true)}
            className="mt-4 w-full bg-yellow-400 text-gray-900 py-2 rounded-full font-bold hover:bg-yellow-500 transition"
          >
            Réserver ce cours
          </button>
        </div>
      )}

      {/* Formulaire de réservation */}
      {showReservationForm && (
        <div className="mt-8 p-4 bg-gray-700 rounded">
          <h4 className="text-lg font-bold mb-4">Informations personnelles</h4>
          <form onSubmit={handleReservation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                name="nom"
                value={studentInfo.nom}
                onChange={handleStudentInfoChange}
                required
                className="w-full p-2 rounded bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <input
                type="text"
                name="prenom"
                value={studentInfo.prenom}
                onChange={handleStudentInfoChange}
                required
                className="w-full p-2 rounded bg-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={studentInfo.email}
                onChange={handleStudentInfoChange}
                required
                className="w-full p-2 rounded bg-gray-600"
              />
            </div>
            <button
              type="submit"
              disabled={reservationStatus === 'loading'}
              className={`w-full bg-yellow-400 text-gray-900 py-2 rounded-full font-bold hover:bg-yellow-500 transition ${
                reservationStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {reservationStatus === 'loading' ? 'Réservation en cours...' : 'Confirmer la réservation'}
            </button>
          </form>
          {reservationMessage && (
            <div className={`mt-4 p-4 rounded ${
              reservationStatus === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {reservationMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}