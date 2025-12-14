import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DATABASE_NAME = 'mediscript.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAY_NAME = 'MediScript Database';
const DATABASE_SIZE = 200000;

let db: SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: 'default',
    });

    console.log('✅ Database opened successfully');

    // Create tables
    await createTables();
    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

const createTables = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  // Prescriptions table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS prescriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      patient_age INTEGER NOT NULL,
      patient_gender TEXT NOT NULL,
      symptoms TEXT NOT NULL,
      diagnosis TEXT,
      medications TEXT,
      advice TEXT,
      follow_up TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced INTEGER DEFAULT 0
    )
  `);

  // Patients table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Templates table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      symptoms TEXT NOT NULL,
      diagnosis TEXT NOT NULL,
      medications TEXT NOT NULL,
      advice TEXT,
      follow_up TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Statistics table
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS statistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_prescriptions INTEGER DEFAULT 0,
      total_patients INTEGER DEFAULT 0,
      voice_commands INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Initialize statistics if empty
  const [result] = await db.executeSql('SELECT COUNT(*) as count FROM statistics');
  if (result.rows.item(0).count === 0) {
    await db.executeSql('INSERT INTO statistics (total_prescriptions, total_patients, voice_commands) VALUES (0, 0, 0)');
  }
};

// Prescription CRUD operations
export const savePrescription = async (prescription: any): Promise<number> => {
  if (!db) throw new Error('Database not initialized');

  const {patient_name, patient_age, patient_gender, symptoms, diagnosis, medications, advice, follow_up} = prescription;

  const [result] = await db.executeSql(
    `INSERT INTO prescriptions (patient_name, patient_age, patient_gender, symptoms, diagnosis, medications, advice, follow_up)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [patient_name, patient_age, patient_gender, symptoms, diagnosis, JSON.stringify(medications), advice, follow_up]
  );

  // Update statistics
  await db.executeSql('UPDATE statistics SET total_prescriptions = total_prescriptions + 1, updated_at = CURRENT_TIMESTAMP');

  return result.insertId;
};

export const getPrescriptions = async (limit: number = 50, offset: number = 0): Promise<any[]> => {
  if (!db) throw new Error('Database not initialized');

  const [result] = await db.executeSql(
    'SELECT * FROM prescriptions ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );

  const prescriptions = [];
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    prescriptions.push({
      ...row,
      medications: JSON.parse(row.medications),
    });
  }

  return prescriptions;
};

export const getPrescriptionById = async (id: number): Promise<any | null> => {
  if (!db) throw new Error('Database not initialized');

  const [result] = await db.executeSql('SELECT * FROM prescriptions WHERE id = ?', [id]);

  if (result.rows.length === 0) return null;

  const row = result.rows.item(0);
  return {
    ...row,
    medications: JSON.parse(row.medications),
  };
};

export const deletePrescription = async (id: number): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.executeSql('DELETE FROM prescriptions WHERE id = ?', [id]);
  await db.executeSql('UPDATE statistics SET total_prescriptions = total_prescriptions - 1, updated_at = CURRENT_TIMESTAMP');
};

export const searchPrescriptions = async (query: string): Promise<any[]> => {
  if (!db) throw new Error('Database not initialized');

  const [result] = await db.executeSql(
    `SELECT * FROM prescriptions 
     WHERE patient_name LIKE ? OR symptoms LIKE ? OR diagnosis LIKE ?
     ORDER BY created_at DESC`,
    [`%${query}%`, `%${query}%`, `%${query}%`]
  );

  const prescriptions = [];
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    prescriptions.push({
      ...row,
      medications: JSON.parse(row.medications),
    });
  }

  return prescriptions;
};

// Statistics
export const getStatistics = async (): Promise<any> => {
  if (!db) throw new Error('Database not initialized');

  const [result] = await db.executeSql('SELECT * FROM statistics LIMIT 1');
  return result.rows.item(0);
};

export const incrementVoiceCommands = async (): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.executeSql('UPDATE statistics SET voice_commands = voice_commands + 1, updated_at = CURRENT_TIMESTAMP');
};

// Close database
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
    console.log('✅ Database closed');
  }
};
