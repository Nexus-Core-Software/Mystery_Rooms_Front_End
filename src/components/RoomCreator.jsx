import { useState } from 'react'
import '../styles/RoomCreator.css'

function RoomCreator({ onCreateRoom }) {
  const [formData, setFormData] = useState({
    roomName: '',
    playerCount: 1,
    difficulty: 'normal',
    maxTime: 60,
    isPrivate: false
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'playerCount' || name === 'maxTime' ? parseInt(value) : value
    }))
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.roomName.trim()) {
      newErrors.roomName = 'El nombre de la sala es requerido'
    }

    if (formData.playerCount < 1 || formData.playerCount > 10) {
      newErrors.playerCount = 'La cantidad debe ser entre 1 y 10 jugadores'
    }

    if (formData.maxTime < 5 || formData.maxTime > 300) {
      newErrors.maxTime = 'El tiempo debe ser entre 5 y 300 minutos'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Generar código de acceso: 4 dígitos aleatorios
  const generateAccessCode = () => {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Agregar la sala a la lista de salas disponibles en localStorage
      const roomWithMeta = {
        ...formData,
        isPrivate: formData.isPrivate,
        accessCode: formData.isPrivate ? generateAccessCode() : null, // Solo generar código si es privada
        createdAt: Date.now(),
        maxPlayers: formData.playerCount, // Guardar el máximo de jugadores esperados
        playerCount: 1, // Comienza con 1 (el creador)
        activePlayers: [0], // Array de índices de jugadores activos
        lastActivity: Date.now() // Timestamp de última actividad
      }

      try {
        const existingRooms = localStorage.getItem('createdRooms')
        const rooms = existingRooms ? JSON.parse(existingRooms) : []
        rooms.push(roomWithMeta)
        localStorage.setItem('createdRooms', JSON.stringify(rooms))
      } catch (error) {
        console.error('Error guardando sala:', error)
      }

      // Pasar roomWithMeta que incluye isPrivate y accessCode
      onCreateRoom(roomWithMeta)
    }
  }

  return (
    <div className="room-creator-container">
      <div className="room-creator-card">
        <h1>Crear Sala de Puzzles</h1>
        <form onSubmit={handleSubmit} className="room-form">
          {/* Campo: Nombre de la sala */}
          <div className="form-group">
            <label htmlFor="roomName">Nombre de la Sala</label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              placeholder="Ej: Sala Aventurera"
              maxLength="30"
            />
            {errors.roomName && <span className="error">{errors.roomName}</span>}
          </div>

          {/* Campo: Cantidad de jugadores */}
          <div className="form-group">
            <label htmlFor="playerCount">Cantidad de Jugadores</label>
            <input
              type="number"
              id="playerCount"
              name="playerCount"
              value={formData.playerCount}
              onChange={handleChange}
              min="1"
              max="10"
            />
            {errors.playerCount && <span className="error">{errors.playerCount}</span>}
          </div>

          {/* Campo: Dificultad (Dropdown) */}
          <div className="form-group">
            <label htmlFor="difficulty">Dificultad</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="facil">Fácil</option>
              <option value="normal">Normal</option>
              <option value="dificil">Difícil</option>
              <option value="extremo">Extremo</option>
            </select>
          </div>

          {/* Campo: Tiempo máximo */}
          <div className="form-group">
            <label htmlFor="maxTime">Tiempo Máximo (minutos)</label>
            <input
              type="number"
              id="maxTime"
              name="maxTime"
              value={formData.maxTime}
              onChange={handleChange}
              min="5"
              max="300"
              step="5"
            />
            {errors.maxTime && <span className="error">{errors.maxTime}</span>}
          </div>

          {/* Campo: Privada/Pública */}
          <div className="form-group">
            <label htmlFor="isPrivate" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span>🔒 Sala Privada (requiere código de acceso)</span>
            </label>
          </div>

          {/* Botones */}
          <div className="form-buttons">
            <button type="submit" className="btn-create">
              Crear Sala
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RoomCreator
