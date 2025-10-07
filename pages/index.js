import { supabase } from '../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function Home() {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    async function loadVideos() {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) console.error('Erreur de chargement :', error)
      else setVideos(data)
    }
    loadVideos()
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '600px', margin: 'auto' }}>
      <h1>🎬 Cinéphile Anonyme</h1>
      <p>Bienvenue sur Cinéphile Anonyme !</p>

      <h2 style={{ marginTop: '40px' }}>📺 Vidéos disponibles</h2>
      {videos.length === 0 ? (
        <p>Aucune vidéo pour le moment.</p>
      ) : (
        <ul>
          {videos.map(video => (
            <li key={video.id} style={{ marginBottom: '20px' }}>
              <strong>{video.title}</strong><br/>
              <em>{video.description}</em><br/>
              <a href={video.url} target="_blank" rel="noopener noreferrer">🎥 Voir la vidéo</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
