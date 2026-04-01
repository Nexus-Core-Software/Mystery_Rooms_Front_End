// ========================================
// App.jsx - Componente Principal
// ========================================
// Maneja la navegación central, creación/unión de salas y 
// sincronización multiplayer. Ruteador con soporte para:
// - Selector de juegos
// - Creación/Unión de salas con sincronización localStorage
// - Gestión de identidad de jugador (playerId)
// - Modo prueba multijugador
// ========================================

import { useState } from 'react'
import './App.css'
import GameSelector from './components/GameSelector.jsx'
import RoomCreator from './components/RoomCreator.jsx'
import RoomLobby from './components/RoomLobby.jsx'
import PuzzleRoom3D from './components/PuzzleRoom3D.jsx'
import MultiPlayerTest from './components/MultiPlayerTest.jsx'
import UserNamePrompt from './components/UserNamePrompt.jsx'

function App() {
  // ============ Estado de Navegación ============
  const [selectedGame, setSelectedGame] = useState(null)
  const [puzzleRoom, setPuzzleRoom] = useState(null)
  const [multiPlayerTest, setMultiPlayerTest] = useState(null)
  
  // ============ Estado del Sistema de Nombres ============
  const [showUserNamePrompt, setShowUserNamePrompt] = useState(false)
  const [pendingRoomData, setPendingRoomData] = useState(null) // Datos de sala pendientes de confirmación de nombre

  // ============ Utilidades de Almacenamiento ============
  
  /**
   * Actualiza el contador y estado de una sala en localStorage
   */
  const updateRoomInStorage = (roomName, updates) => {
    try {
      const rooms = JSON.parse(localStorage.getItem('createdRooms') || '[]')
      const index = rooms.findIndex(r => r.roomName === roomName)
      if (index !== -1) {
        rooms[index] = { ...rooms[index], ...updates, lastActivity: Date.now() }
        localStorage.setItem('createdRooms', JSON.stringify(rooms))
        return true
      }
    } catch (error) {
      console.error('Error actualizando sala:', error)
    }
    return false
  }

  /**
   * Limpia los datos de sincronización de posición de un jugador
   */
  const clearPlayerSyncData = (roomName, playerId) => {
    try {
      const syncKey = `PLAYERS_SYNC:${roomName}`
      const playersData = JSON.parse(localStorage.getItem(syncKey) || '{}')
      if (playersData[playerId] !== undefined) {
        delete playersData[playerId]
        localStorage.setItem(syncKey, JSON.stringify(playersData))
        return true
      }
    } catch (error) {
      console.error('Error limpiando datos de sincronización:', error)
    }
    return false
  }

  /**
   * Obtiene el siguiente playerId disponible para una sala
   */
  const getNextAvailablePlayerId = (roomName, maxPlayers) => {
    try {
      const syncKey = `PLAYERS_SYNC:${roomName}`
      const playersData = JSON.parse(localStorage.getItem(syncKey) || '{}')
      
      // Encontrar el siguiente ID disponible
      for (let i = 0; i < maxPlayers; i++) {
        if (!playersData[i]) {
          return i
        }
      }
      
      // Si no hay IDs disponibles, devolver el primero (aunque esto no debería pasar)
      return 0
    } catch (error) {
      console.error('Error obteniendo siguiente playerId:', error)
      return 0
    }
  }

  // ============ Manejadores de Eventos ============

  const handleSelectGame = (game) => {
    if (game === 'multiPlayerTest') {
      setMultiPlayerTest({
        roomName: 'Sala de Prueba Multijugador',
        playerCount: 3,
        difficulty: 'normal',
        maxTime: 30
      })
    } else {
      setSelectedGame(game)
    }
  }

  const handleCreateRoom = (roomData) => {
    // Mostrar modal para pedir nombre de usuario antes de crear la sala
    setPendingRoomData({ ...roomData, action: 'create' })
    setShowUserNamePrompt(true)
  }

  const handleJoinRoom = (roomData) => {
    // Mostrar modal para pedir nombre de usuario antes de unirse a la sala
    setPendingRoomData({ ...roomData, action: 'join' })
    setShowUserNamePrompt(true)
  }

  /**
   * Maneja la confirmación del nombre de usuario y completa la acción pendiente
   */
  const handleUserNameConfirm = (userName) => {
    if (!pendingRoomData) return
    
    const { action, ...roomData } = pendingRoomData
    
    if (action === 'create') {
      // Crear sala con el nombre de usuario
      sessionStorage.setItem(`PLAYER_ID:${roomData.roomName}`, '0')
      sessionStorage.setItem(`PLAYER_NAME:${roomData.roomName}:0`, userName)
      
      // Registrar al creador en la sincronización inmediatamente
      const syncKey = `PLAYERS_SYNC:${roomData.roomName}`
      const playersData = JSON.parse(localStorage.getItem(syncKey) || '{}')
      playersData[0] = {
        name: userName,
        position: { x: 0, y: 1.7, z: 5 },
        rotation: { x: 0, y: 0, z: 0 }
      }
      localStorage.setItem(syncKey, JSON.stringify(playersData))
      
      setPuzzleRoom({ ...roomData, playerId: 0, userName })
    } else if (action === 'join') {
      // Unirse a sala con el nombre de usuario
      const nextPlayerId = getNextAvailablePlayerId(roomData.roomName, roomData.maxPlayers)
      sessionStorage.setItem(`PLAYER_ID:${roomData.roomName}:${nextPlayerId}`, nextPlayerId.toString())
      sessionStorage.setItem(`PLAYER_NAME:${roomData.roomName}:${nextPlayerId}`, userName)
      
      // Registrar al nuevo jugador en la sincronización inmediatamente
      const syncKey = `PLAYERS_SYNC:${roomData.roomName}`
      const playersData = JSON.parse(localStorage.getItem(syncKey) || '{}')
      playersData[nextPlayerId] = {
        name: userName,
        position: { x: Math.cos(nextPlayerId) * 8, y: 1.7, z: Math.sin(nextPlayerId) * 8 },
        rotation: { x: 0, y: 0, z: 0 }
      }
      localStorage.setItem(syncKey, JSON.stringify(playersData))
      
      // Actualizar contador en localStorage
      updateRoomInStorage(roomData.roomName, { playerCount: roomData.playerCount + 1 })
      
      setPuzzleRoom({ ...roomData, playerId: nextPlayerId, userName })
    }
    
    // Limpiar estado del modal
    setShowUserNamePrompt(false)
    setPendingRoomData(null)
    setSelectedGame(null)
  }

  /**
   * Cancela el modal de nombre de usuario
   */
  const handleUserNameCancel = () => {
    setShowUserNamePrompt(false)
    setPendingRoomData(null)
  }

  const handleExitRoom = () => {
    if (!puzzleRoom) return
    
    // Decrementar contador de sala
    updateRoomInStorage(puzzleRoom.roomName, { playerCount: Math.max(0, puzzleRoom.playerCount - 1) })
    
    // Limpiar datos de sincronización y nombre de usuario
    clearPlayerSyncData(puzzleRoom.roomName, puzzleRoom.playerId)
    sessionStorage.removeItem(`PLAYER_NAME:${puzzleRoom.roomName}:${puzzleRoom.playerId}`)
    
    setPuzzleRoom(null)
    setSelectedGame(null)
  }

  const handleExitMultiPlayerTest = () => {
    setMultiPlayerTest(null)
  }

  // ============ Renderizado Principal ============
  
  // Componente dinámico basado en estado actual
  const renderContent = () => {
    // Modo prueba multijugador
    if (multiPlayerTest) {
      return <MultiPlayerTest roomData={multiPlayerTest} onExit={handleExitMultiPlayerTest} />
    }
    
    // Sala de puzzles activa
    if (puzzleRoom) {
      return <PuzzleRoom3D roomData={puzzleRoom} onExit={handleExitRoom} />
    }
    
    // Flujo de salas
    if (selectedGame === 'createRoom') {
      return <RoomCreator onCreateRoom={handleCreateRoom} />
    }
    if (selectedGame === 'joinRoom') {
      return <RoomLobby onJoinRoom={handleJoinRoom} onBack={() => setSelectedGame(null)} />
    }
    
    // Selector de juegos (pantalla inicial)
    return <GameSelector onSelectGame={handleSelectGame} />
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'black',
      color: 'white'
    }}>
      {renderContent()}
      
      {/* Modal de nombre de usuario */}
      {showUserNamePrompt && pendingRoomData && (
        <UserNamePrompt
          roomName={pendingRoomData.roomName}
          onConfirm={handleUserNameConfirm}
          onCancel={handleUserNameCancel}
        />
      )}
    </div>
  )
}

export default App
