import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Input } from './ui/Common';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');

  // Captcha State
  const [captchaCode, setCaptchaCode] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate Captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    drawCaptcha(code);
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add some noise lines
    for(let i=0; i<5; i++) {
        ctx.strokeStyle = `rgba(100,100,100,0.${Math.floor(Math.random()*5)})`;
        ctx.beginPath();
        ctx.moveTo(Math.random()*canvas.width, Math.random()*canvas.height);
        ctx.lineTo(Math.random()*canvas.width, Math.random()*canvas.height);
        ctx.stroke();
    }

    ctx.fillText(code, canvas.width / 2, canvas.height / 2);
  };

  useEffect(() => {
    if (isOpen) {
        // Delay slightly to ensure modal DOM exists
        setTimeout(generateCaptcha, 100);
    }
  }, [isOpen, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaCode) {
        setError('验证码错误');
        generateCaptcha();
        setCaptchaInput('');
        return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onClose();
      // Reset form
      setEmail('');
      setPassword('');
      setName('');
      setCaptchaInput('');
    } catch (err: any) {
      setError(err.message || '操作失败');
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? '启用云同步' : '注册云账号'}>
      <div className="flex flex-col gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
             <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full text-blue-600 dark:text-blue-300">
                <i className="fas fa-cloud-arrow-up"></i>
             </div>
             <div>
                 <h4 className="font-bold text-sm text-blue-800 dark:text-blue-200">无需账号即可使用</h4>
                 <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                     LifeOS 默认将所有数据保存在您的本地浏览器中。登录账号仅用于跨设备备份和同步数据。
                 </p>
             </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${mode === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
          >
            登录
          </button>
          <button 
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${mode === 'register' ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
             <Input 
                placeholder="您的昵称" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                icon="fa-user"
             />
          )}
          
          <Input 
            type="email" 
            placeholder="邮箱地址" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            icon="fa-envelope"
          />
          
          <Input 
            type="password" 
            placeholder="密码" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            icon="fa-lock"
          />

          <div className="flex gap-4">
            <Input 
                placeholder="验证码" 
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                required
                className="flex-1"
                maxLength={4}
            />
            <canvas 
                ref={canvasRef} 
                width="100" 
                height="42" 
                className="bg-gray-100 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600"
                onClick={generateCaptcha}
                title="点击刷新"
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (mode === 'login' ? '登录并同步' : '注册账号')}
          </Button>
        </form>
        
        <div className="text-center">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm underline">
                暂不登录，继续使用本地模式
            </button>
        </div>
      </div>
    </Modal>
  );
};