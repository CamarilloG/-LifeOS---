
// List of all keys used in the application
const APP_STORAGE_KEYS = [
  // Pomodoro
  'pomo-tasks', 'pomo-history', 'pomo-settings',
  // Finance
  'finance-logs', 'finance-budget',
  // Recipe & Grocery
  'saved-recipes', 'grocery-list',
  // Split
  'split-expenses',
  // Flashcards
  'flashcards',
  // Matrix
  'matrix-tasks',
  // Mood
  'mood-entries',
  // Media
  'media-list',
  // Health
  'health-water', 'health-water-goal', 'health-stand',
  // Course
  'courses',
  // Settings & Auth
  'dark-mode',
  'lifeos-users', 'lifeos-session'
];

export const dataService = {
  /**
   * Export all local data to a JSON file
   */
  exportData: () => {
    const data: Record<string, any> = {};
    
    APP_STORAGE_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch (e) {
          data[key] = value;
        }
      }
    });

    const exportObj = {
      version: 1,
      timestamp: new Date().toISOString(),
      data: data
    };

    const dataStr = JSON.stringify(exportObj, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `lifeos_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Import data from a JSON file
   */
  importData: async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importObj = JSON.parse(content);
          
          if (!importObj.data || typeof importObj.data !== 'object') {
            throw new Error('无效的备份文件格式');
          }

          // Clear existing data (optional, but safer to prevent conflicts)
          // APP_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));

          // Restore data
          Object.keys(importObj.data).forEach(key => {
            // Only import known keys to prevent pollution
            if (APP_STORAGE_KEYS.includes(key)) {
              const value = importObj.data[key];
              localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            }
          });

          resolve();
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsText(file);
    });
  }
};
