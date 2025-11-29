import React, { useState } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input } from '../components/ui/Common';

interface Course {
  id: string;
  name: string;
  totalChapters: number;
  completedChapters: number;
}

const CourseApp: React.FC = () => {
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
  const [name, setName] = useState('');
  const [total, setTotal] = useState('');

  const addCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !total) return;
    setCourses(prev => [...prev, {
      id: Date.now().toString(),
      name,
      totalChapters: parseInt(total) || 10,
      completedChapters: 0
    }]);
    setName('');
    setTotal('');
  };

  const updateProgress = (id: string, delta: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        const newCompleted = Math.min(Math.max(c.completedChapters + delta, 0), c.totalChapters);
        return { ...c, completedChapters: newCompleted };
      }
      return c;
    }));
  };

  const removeCourse = (id: string) => setCourses(prev => prev.filter(c => c.id !== id));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <h3 className="font-bold mb-4">添加新课程</h3>
        <form onSubmit={addCourse} className="flex gap-3">
          <Input placeholder="课程名称 (如: React 进阶)" value={name} onChange={e => setName(e.target.value)} required className="flex-[2]" />
          <Input type="number" placeholder="总章节数" value={total} onChange={e => setTotal(e.target.value)} required className="flex-1" />
          <Button type="submit">添加</Button>
        </form>
      </Card>

      <div className="space-y-4">
        {courses.length === 0 && <p className="text-center text-gray-400 py-8">开始您的学习之旅吧！</p>}
        {courses.map(course => {
          const percent = Math.round((course.completedChapters / course.totalChapters) * 100);
          return (
            <div key={course.id} className="bg-white dark:bg-paper p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-start mb-3">
                 <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{course.name}</h3>
                    <p className="text-sm text-gray-500">进度: {course.completedChapters} / {course.totalChapters} 章节</p>
                 </div>
                 <button onClick={() => removeCourse(course.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                   <i className="fas fa-trash"></i>
                 </button>
               </div>
               
               {/* Progress Bar */}
               <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                 <div className="bg-cyan-500 h-full transition-all duration-500 ease-out" style={{ width: `${percent}%` }}></div>
               </div>

               <div className="flex justify-between items-center">
                 <span className="font-mono font-bold text-cyan-600">{percent}%</span>
                 <div className="flex gap-2">
                   <Button variant="ghost" onClick={() => updateProgress(course.id, -1)} disabled={course.completedChapters === 0}>-</Button>
                   <Button variant="secondary" onClick={() => updateProgress(course.id, 1)} disabled={course.completedChapters >= course.totalChapters}>完成一章</Button>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseApp;