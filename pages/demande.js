import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Demande() {
  const [title, setTitle] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [type, setType] = useState('film')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')

  const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

  async function fetchSuggestions(query) {
  if (!query) return setSuggestions([])
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`
  )
  const data = await res.json()
  setSuggestions(data.results || [])
}



  async function handleSubmit(e) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('requests')
      .insert([{ title, type, description }])
    if (error) {
      console.error(error)
      setMessage('Erreur lors de l’envoi, réessayez.')
    } else {
      setMessage('Demande envoyée avec succès !')
      setTitle('')
      setDescription('')
      setType('film')
      setSuggestions([])
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '600px', margin: 'auto' }}>
      <h1>📨 Demande de visionnement</h1>
      <form onSubmit={handleSubmit}>
        <label>Titre :</label><br/>
        <input 
          value={title} 
          onChange={e => {
            setTitle(e.target.value)
            fetchSuggestions(e.target.value)
          }} 
          required 
          style={{ width: '100%', marginBottom: '10px' }}
        />
        {suggestions.length > 0 && (
          <ul style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'auto', padding: '5px', margin: 0 }}>
            {suggestions.map(movie => (
              <li 
                key={movie.id} 
                style={{ cursor: 'pointer', marginBottom: '5px' }}
                onClick={() => {
                  setTitle(movie.title)
                  setSuggestions([])
                  setDescription(movie.overview || '')
                }}
              >
                {movie.title} ({movie.release_date?.split('-')[0]})
              </li>
            ))}
          </ul>
        )}

        <label>Type :</label><br/>
        <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
          <option value="film">Film</option>
          <option value="serie">Série</option>
          <option value="emission">Émission</option>
        </select>

        <label>Description :</label><br/>
        <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} required></textarea>

        <button type="submit">Envoyer la demande</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
