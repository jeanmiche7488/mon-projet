import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const calendar = google.calendar('v3');

// Configuration de l'authentification
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_PROJECT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

// Fonction pour convertir la durée en minutes
function getDurationInMinutes(duree: string): number {
  switch (duree) {
    case '30min':
      return 30;
    case '1h':
      return 60;
    case '1h30':
      return 90;
    case '2h':
      return 120;
    default:
      return 60;
  }
}

export async function POST(request: Request) {
  try {
    console.log('Début de la requête');
    const { course, student } = await request.json();
    console.log('Données reçues:', { course, student });

    // Calculer la date et l'heure de fin en fonction de la durée
    const startDate = new Date(`${course.date}T${course.heure}`);
    const durationMinutes = getDurationInMinutes(course.duree);
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + durationMinutes);

    console.log('Dates calculées:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      durationMinutes
    });

    // Créer l'événement
    const event = {
      summary: `Cours de ${course.instrument} - ${student.prenom} ${student.nom}`,
      description: `
        Type: ${course.type}
        Niveau: ${course.niveau}
        Durée: ${course.duree}
        Prix: ${course.prix}€
        
        Contact: ${student.email}
      `,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/Paris',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/Paris',
      },
    };

    console.log('Tentative de création de l\'événement:', event);

    // Créer l'événement sans inviter les participants
    const response = await calendar.events.insert({
      auth,
      calendarId: 'pierre.servant5@gmail.com',
      requestBody: event,
      sendUpdates: 'none', // Ne pas envoyer d'invitations
    });

    console.log('Événement créé avec succès:', response.data);
    return NextResponse.json({ success: true, event: response.data });
  } catch (error: any) {
    console.error('Erreur détaillée:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      response: error.response?.data
    });
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création de l\'événement',
        details: error.message
      },
      { status: 500 }
    );
  }
} 