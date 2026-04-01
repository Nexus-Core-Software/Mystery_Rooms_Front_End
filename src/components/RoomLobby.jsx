import { useEffect, useState } from 'react'
import '../styles/RoomLobby.css'

function RoomLobby({ onJoinRoom, onBack }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [codeInput, setCodeInput] = useState('')
  const [pendingRoom, setPendingRoom] = useState(null) // Sala privada esperando código

  // Cargar salas disponibles desde localStorage
  useEffect(() => {
    const loadRooms = () => {
      try {
        const savedRooms = localStorage.getItem('createdRooms')
        if (savedRooms) {
          const parsedRooms = JSON.parse(savedRooms)
          // Filtrar salas:
          // - Que tengan al menos 1 jugador activo
          // - Si están vacías, solo eliminarlas si llevan > 60 minutos creadas
          const now = Date.now()
          const validRooms = parsedRooms.filter(room => {
            const roomAge = (now - room.createdAt) / (1000 * 60) // en minutos
            const hasActivePlayers = room.playerCount > 0
            
            // Mantener la sala si tiene jugadores activos
            if (hasActivePlayers) {
              return true
            }
            
            // Eliminar salas vacías solo si son muy antiguas
            return roomAge < 60
          })
          
          // Si hay salas eliminadas, actualizar localStorage
          if (validRooms.length !== parsedRooms.length) {
            const eliminadas = parsedRooms.length - validRooms.length
            console.log(`Eliminadas ${eliminadas} salas inactivas o vacías`)
            localStorage.setItem('createdRooms', JSON.stringify(validRooms))
          }
          
          setRooms(validRooms)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error cargando salas:', error)
        setLoading(false)
      }
    }

    loadRooms()
    // Recargar cada 5 segundos para ver salas nuevas y limpiar salas vacías
    const interval = setInterval(loadRooms, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleJoinRoom = (room) => {
    // Si es privada, pedir código
    if (room.isPrivate) {
      setPendingRoom(room)
      setCodeInput('')
      return
    }
    // Si es pública, entrar directo
    onJoinRoom(room)
  }

  const handleSubmitCode = () => {
    if (pendingRoom && codeInput.trim() === pendingRoom.accessCode) {
      onJoinRoom(pendingRoom)
      setPendingRoom(null)
      setCodeInput('')
    } else {
      alert('❌ Código incorrecto')
      setCodeInput('')
    }
  }

  const handleCancelCode = () => {
    setPendingRoom(null)
    setCodeInput('')
  }

  const handleRefresh = () => {
    setLoading(true)
    const savedRooms = localStorage.getItem('createdRooms')
    if (savedRooms) {
      const parsedRooms = JSON.parse(savedRooms)
      const now = Date.now()
      // Usar la misma lógica de filtro que en loadRooms
      const validRooms = parsedRooms.filter(room => {
        const roomAge = (now - room.createdAt) / (1000 * 60)
        const hasActivePlayers = room.playerCount > 0
        
        // Mantener sala si tiene jugadores
        if (hasActivePlayers) {
          return true
        }
        
        // Eliminar salas vacías si son antiguas
        return roomAge < 60
      })
      setRooms(validRooms)
      localStorage.setItem('createdRooms', JSON.stringify(validRooms))
    }
    setLoading(false)
  }

  return (
    <div className="room-lobby-container">
      <div className="room-lobby-card">
        <h1>🔓 Unirse a una Sala</h1>
        <p>Selecciona una sala disponible para unirte</p>

        {/* Modal de código de acceso para salas privadas */}
        {pendingRoom && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.95)',
              padding: '30px',
              borderRadius: '12px',
              border: '2px solid #ff6b35',
              color: '#fff',
              textAlign: 'center',
              width: '300px'
            }}>
              <h2 style={{ marginTop: 0, color: '#ff6b35' }}>🔒 Sala Privada</h2>
              <p style={{ color: '#aaa', marginBottom: '20px' }}>
                Ingresa el código de acceso para la sala "{pendingRoom.roomName}"
              </p>
              <input
                type="text"
                maxLength="4"
                placeholder="0000"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ''))}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitCode()}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '24px',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  marginBottom: '15px',
                  borderRadius: '6px',
                  border: '2px solid #ff6b35',
                  background: 'rgba(255, 107, 53, 0.1)',
                  color: '#fff'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSubmitCode}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#ff6b35',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Entrar
                </button>
                <button
                  onClick={handleCancelCode}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(255, 107, 53, 0.3)',
                    color: '#ff6b35',
                    border: '2px solid #ff6b35',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Cargando salas...</div>
        ) : rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No hay salas disponibles en este momento.</p>
            <p style={{ fontSize: '12px', color: '#aaa' }}>
              Crea una nueva sala o espera a que alguien más cree una.
            </p>
          </div>
        ) : (
          <div className="rooms-list">
            {rooms.map((room, index) => (
              <div key={index} className="room-card">
                <div className="room-header">
                  <h3>
                    {room.isPrivate ? '🔒 ' : '🔓 '}{room.roomName}
                  </h3>
                  <span className={`status ${room.playerCount >= room.maxPlayers ? 'full' : 'open'}`}>
                    {room.playerCount >= room.maxPlayers ? '🔴 Llena' : '🟢 Abierta'}
                  </span>
                </div>
                <div className="room-details">
                  <div className="detail">
                    <span className="label">👥 Jugadores:</span>
                    <span className="value">{room.playerCount} / {room.maxPlayers || room.playerCount}</span>
                  </div>
                  <div className="detail">
                    <span className="label">⚡ Dificultad:</span>
                    <span className="value">{room.difficulty.charAt(0).toUpperCase() + room.difficulty.slice(1)}</span>
                  </div>
                  <div className="detail">
                    <span className="label">⏱️ Tiempo:</span>
                    <span className="value">{room.maxTime} min</span>
                  </div>
                  {room.isPrivate && (
                    <div className="detail" style={{ color: '#ff6b35' }}>
                      <span className="label">🔐 Privada:</span>
                      <span className="value">Requiere código</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleJoinRoom(room)}
                  disabled={room.playerCount >= room.maxPlayers}
                  className={`btn-join ${room.playerCount >= room.maxPlayers ? 'disabled' : ''}`}
                >
                  {room.playerCount >= room.maxPlayers ? '❌ Sala Llena' : '✅ Unirse'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="lobby-buttons">
          <button onClick={handleRefresh} className="btn-refresh">
            🔄 Actualizar
          </button>
          <button onClick={onBack} className="btn-back">
            ← Atrás
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomLobby
