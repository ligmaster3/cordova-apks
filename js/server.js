import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zodiac'
}

// Create MySQL table
async function setupDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        edad INT NOT NULL,
        correo VARCHAR(100) UNIQUE NOT NULL,
        contrasena VARCHAR(255) NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    console.log('Base de datos configurada correctamente')
    await connection.end()
  } catch (error) {
    console.error('Error configurando la base de datos:', error)
  }
}

// Registration endpoint
app.post('/api/registro', async (req, res) => {
  try {
    const { nombre, apellido, edad, correo, contrasena } = req.body
    
    // Validate input
    if (!nombre || !apellido || !edad || !correo || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }
    
    const connection = await mysql.createConnection(dbConfig)
    
    // Check if email already exists
    const [existingUsers] = await connection.execute(
      'SELECT id FROM usuarios WHERE correo = ?',
      [correo]
    )
    
    if (existingUsers.length > 0) {
      await connection.end()
      return res.status(400).json({ error: 'El correo ya está registrado' })
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(contrasena, 10)
    
    // Insert new user
    await connection.execute(
      'INSERT INTO usuarios (nombre, apellido, edad, correo, contrasena) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, edad, correo, hashedPassword]
    )
    
    await connection.end()
    res.status(201).json({ message: 'Usuario registrado exitosamente' })
    
  } catch (error) {
    console.error('Error en el registro:', error)
    res.status(500).json({ error: 'Error en el servidor' })
  }
})

// Initialize server and database
setupDatabase()
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})