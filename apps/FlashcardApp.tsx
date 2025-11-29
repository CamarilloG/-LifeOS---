
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input, Badge } from '../components/ui/Common';
import { Flashcard } from '../types';

const FlashcardApp: React.FC = () => {
  const [cards, setCards] = useLocalStorage<Flashcard[]>('flashcards', []);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front || !back) return;
    const newCard: Flashcard = {
        id: Date.now().toString(),
        front,
        back,
        interval: 0,
        repetition: 0,
        efactor: 2.5,
        nextReviewDate: new Date().toISOString()
    };
    setCards(prev => [...prev, newCard]);
    setFront('');
    setBack('');
  };

  const dueCards = useMemo(() => {
    const now = new Date().toISOString();
    return cards.filter(c => c.nextReviewDate <= now).sort((a,b) => a.nextReviewDate.localeCompare(b.nextReviewDate));
  }, [cards]);

  const startSession = () => {
    if (dueCards.length === 0) return;
    setSessionQueue(dueCards);
    setCurrentCardIndex(0);
    setIsStudyMode(true);
    setIsFlipped(false);
  };

  // SM-2 Algorithm Implementation
  const processCard = (quality: number) => {
    const card = sessionQueue[currentCardIndex];
    let { interval, repetition, efactor } = card;

    if (quality >= 3) {
        if (repetition === 0) interval = 1;
        else if (repetition === 1) interval = 6;
        else interval = Math.round(interval * efactor);
        repetition += 1;
    } else {
        repetition = 0;
        interval = 1;
    }

    efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (efactor < 1.3) efactor = 1.3;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    // Update Card
    const updatedCard = { ...card, interval, repetition, efactor, nextReviewDate: nextDate.toISOString() };
    setCards(prev => prev.map(c => c.id === card.id ? updatedCard : c));

    // Move to next
    if (currentCardIndex < sessionQueue.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setIsFlipped(false);
    } else {
        setIsStudyMode(false); // End session
    }
  };

  if (isStudyMode && sessionQueue.length > 0) {
    const currentCard = sessionQueue[currentCardIndex];
    return (
      <div className="max-w-2xl mx-auto h-[80vh] flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="w-full flex justify-between text-gray-500 font-mono text-sm">
            <span>进度: {currentCardIndex + 1} / {sessionQueue.length}</span>
            <button onClick={() => setIsStudyMode(false)} className="hover:text-red-500">退出</button>
        </div>
        
        <div 
          onClick={() => !isFlipped && setIsFlipped(true)}
          className="w-full max-w-lg aspect-[3/2] cursor-pointer perspective-1000 group relative"
        >
           <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            {/* Front */}
            <div className="absolute w-full h-full bg-white dark:bg-paper rounded-2xl shadow-2xl border-2 border-yellow-400 flex flex-col items-center justify-center p-8 backface-hidden z-20" style={{ backfaceVisibility: 'hidden' }}>
              <span className="absolute top-4 left-4 text-xs font-bold text-gray-300 uppercase">Question</span>
              <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white leading-relaxed">{currentCard.front}</h3>
              <p className="absolute bottom-6 text-sm text-gray-400 animate-bounce">点击查看答案</p>
            </div>
            {/* Back */}
            <div className="absolute w-full h-full bg-yellow-50 dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-yellow-500 flex flex-col items-center justify-center p-8 transform rotate-y-180 z-10" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <span className="absolute top-4 left-4 text-xs font-bold text-yellow-600 uppercase">Answer</span>
              <h3 className="text-2xl font-medium text-center text-gray-800 dark:text-white leading-relaxed">{currentCard.back}</h3>
            </div>
          </div>
        </div>

        {isFlipped ? (
            <div className="grid grid-cols-4 gap-3 w-full max-w-lg animate-slide-up">
                <Button onClick={() => processCard(1)} className="bg-red-100 text-red-600 hover:bg-red-200 border-none flex-col py-3">
                    <span className="text-xs opacity-75">1天</span>
                    <span className="font-bold">重来</span>
                </Button>
                <Button onClick={() => processCard(3)} className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none flex-col py-3">
                    <span className="text-xs opacity-75">2天</span>
                    <span className="font-bold">困难</span>
                </Button>
                <Button onClick={() => processCard(4)} className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-none flex-col py-3">
                    <span className="text-xs opacity-75">4天</span>
                    <span className="font-bold">良好</span>
                </Button>
                <Button onClick={() => processCard(5)} className="bg-green-100 text-green-600 hover:bg-green-200 border-none flex-col py-3">
                    <span className="text-xs opacity-75">7天</span>
                    <span className="font-bold">简单</span>
                </Button>
            </div>
        ) : (
            <div className="h-14"></div> // Placeholder layout shift prevention
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-900/20">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">记忆卡片库</h2>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-4">
                <span>总计: {cards.length}</span>
                <span className="flex items-center gap-1 text-orange-500 font-bold">
                    <i className="fas fa-clock"></i> 待复习: {dueCards.length}
                </span>
            </p>
        </div>
        <Button size="lg" onClick={startSession} disabled={dueCards.length === 0} className="mt-4 md:mt-0 shadow-lg shadow-yellow-500/20 bg-yellow-500 hover:bg-yellow-600 text-white">
          <i className="fas fa-play mr-2"></i> 开始今日复习
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit sticky top-24">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-plus-circle text-yellow-500"></i> 添加新卡片
          </h3>
          <form onSubmit={addCard} className="space-y-3">
            <Input placeholder="正面 (单词/问题)" value={front} onChange={e => setFront(e.target.value)} required />
            <textarea 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none h-32 resize-none transition-all"
              placeholder="背面 (解释/答案)"
              value={back}
              onChange={e => setBack(e.target.value)}
              required
            />
            <Button type="submit" variant="secondary" className="w-full bg-yellow-500 hover:bg-yellow-600">添加</Button>
          </form>
        </Card>

        <div className="md:col-span-2 space-y-4">
          {cards.map(card => {
             const daysUntil = Math.ceil((new Date(card.nextReviewDate).getTime() - Date.now()) / (1000 * 3600 * 24));
             return (
                <div key={card.id} className="bg-white dark:bg-paper p-4 rounded-xl border border-gray-100 dark:border-gray-700 relative group hover:shadow-md transition-all">
                <button 
                    onClick={() => setCards(prev => prev.filter(c => c.id !== card.id))}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <i className="fas fa-times"></i>
                </button>
                <div className="flex justify-between items-start pr-8">
                    <p className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">{card.front}</p>
                    <Badge color={daysUntil <= 0 ? 'red' : 'green'}>
                        {daysUntil <= 0 ? 'Due Now' : `${daysUntil}d`}
                    </Badge>
                </div>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">{card.back}</p>
                <div className="mt-3 flex gap-4 text-xs text-gray-400 font-mono">
                    <span>Lv.{card.repetition}</span>
                    <span>Easy: {card.efactor.toFixed(2)}</span>
                </div>
                </div>
             );
          })}
          {cards.length === 0 && (
            <div className="col-span-2 flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-slate-800/50">
              <i className="fas fa-layer-group text-3xl mb-2"></i>
              <p>暂无卡片，添加一张开始吧</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardApp;
