
import React, { useRef, useState } from 'react';
import { Modal, Button } from './ui/Common';
import { dataService } from '../services/dataService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleExport = () => {
    try {
      dataService.exportData();
      setMessage({ type: 'success', text: '数据导出成功！' });
    } catch (e) {
      setMessage({ type: 'error', text: '导出失败' });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm('恢复备份将覆盖当前的本地数据，确定要继续吗？')) {
      setLoading(true);
      setMessage(null);
      try {
        await dataService.importData(file);
        setMessage({ type: 'success', text: '数据恢复成功！页面即将刷新...' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setMessage({ type: 'error', text: '恢复失败：无效的文件格式' });
        setLoading(false);
      }
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="系统设置">
      <div className="space-y-8">
        
        {/* Data Management Section */}
        <div>
          <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <i className="fas fa-database text-primary"></i> 数据管理
          </h4>
          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              LifeOS 的数据完全存储在您的设备本地。您可以随时导出数据进行备份，或迁移到其他设备。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExport} className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-600 shadow-sm">
                <i className="fas fa-download mr-2"></i> 导出备份 (JSON)
              </Button>
              
              <Button onClick={handleImportClick} disabled={loading} className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-600 shadow-sm">
                {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-upload mr-2"></i>}
                恢复备份
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".json" 
                className="hidden" 
              />
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* About Section */}
        <div>
           <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <i className="fas fa-info-circle text-gray-400"></i> 关于 LifeOS
          </h4>
          <div className="text-xs text-gray-400 text-center">
            <p>Version 1.0.0</p>
            <p className="mt-1">Local-First Personal Operating System</p>
          </div>
        </div>
        
      </div>
    </Modal>
  );
};
