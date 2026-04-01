import { useState } from 'react'
import NodePuzzle from '../games/NodePuzzle/NodePuzzle.jsx'
import '../styles/PuzzleRoom.css'

function PuzzleRoom({ roomData, onExit }) {
  const [activePuzzle, setActivePuzzle] = useState(null)
  const [completedPuzzles, setCompletedPuzzles] = useState([])

  // Lista de puzzles disponibles en la sala
  const availablePuzzles = [
    {
      id: 'nodePuzzle',
      name: 'Puzzle de Nodos',
      description: 'Conecta los nodos siguiendo la secuencia correcta',
      difficulty: 'variable'
    }
    // Aquí puedes agregar más puzzles en el futuro
  ]

  const handlePuzzleComplete = (puzzleId) => {
    setCompletedPuzzles(prev => [...prev, puzzleId])
    setActivePuzzle(null)
  }

  const handlePuzzleClose = () => {
    setActivePuzzle(null)
  }

  // Si hay un puzzle activo, mostrar el puzzle
  if (activePuzzle) {
    if (activePuzzle === 'nodePuzzle') {
      return (
        <NodePuzzle 
          onClose={handlePuzzleClose}
          roomDifficulty={roomData.difficulty}
          onComplete={() => handlePuzzleComplete('nodePuzzle')}
        />
      )
    }
  }

  // Mostrar la sala con los puzzles disponibles
  return (
    <div className="puzzle-room-container">
      <div className="room-header">
        <h1>🎮 {roomData.roomName}</h1>
        <div className="room-info">
          <span>👥 Jugadores: {roomData.playerCount}</span>
          <span>⚡ Dificultad: {roomData.difficulty.charAt(0).toUpperCase() + roomData.difficulty.slice(1)}</span>
          <span>⏱️ Tiempo: {roomData.maxTime} min</span>
        </div>
      </div>

      <div className="room-content">
        <h2>Puzzles Disponibles</h2>
        <div className="puzzles-grid">
          {availablePuzzles.map(puzzle => (
            <div
              key={puzzle.id}
              className={`puzzle-card ${completedPuzzles.includes(puzzle.id) ? 'completed' : ''}`}
            >
              <h3>{puzzle.name}</h3>
              <p>{puzzle.description}</p>
              {completedPuzzles.includes(puzzle.id) ? (
                <button className="btn-completed" disabled>
                  ✓ Completado
                </button>
              ) : (
                <button
                  className="btn-play"
                  onClick={() => setActivePuzzle(puzzle.id)}
                >
                  Jugar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Sección de Salida */}
        <div className="exit-section">
          <h2>Salida</h2>
          <p>Puzzles completados: {completedPuzzles.length} de {availablePuzzles.length}</p>
          <button
            className="btn-exit"
            onClick={onExit}
          >
            🚪 Salir de la Sala
          </button>
        </div>
      </div>
    </div>
  )
}

export default PuzzleRoom
