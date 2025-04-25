
export const LocalStorage = {
  // Generic setter for any key-value pair
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  },

  // Generic getter for any key
  get: <T = any>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return defaultValue || null;
    }
  },

  // Remove a specific item
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  },

  // Clear all local storage
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },

  // Specific methods for common use cases in this app
  saveConnectionPreference: (connectionDetails: { 
    host?: string, 
    port?: number, 
    username?: string 
  }) => {
    LocalStorage.set('clickhouse_connection_preference', {
      ...connectionDetails,
      savedAt: new Date().toISOString()
    });
  },

  getConnectionPreference: () => {
    return LocalStorage.get('clickhouse_connection_preference');
  },

  saveLastTransferConfig: (transferConfig: {
    sourceType: 'file' | 'clickhouse',
    direction: 'import' | 'export',
    selectedColumns: string[]
  }) => {
    LocalStorage.set('last_transfer_config', {
      ...transferConfig,
      configuredAt: new Date().toISOString()
    });
  },

  getLastTransferConfig: () => {
    return LocalStorage.get('last_transfer_config');
  }
};

export default LocalStorage;
