
import React, { useState } from 'react';
import { useLocalStorage } from '../utils/hooks';
import { Card, Button, Input } from '../components/ui/Common';

interface Course {
  id: string;
  name: string;
  totalChapters: number;
  completedChapters: number;
}

const SAMPLE_COURSES: Course[] = [
  {
    id: 'sample-1',
    name: 'React 进阶实战',
    totalChapters: 25,
    completedChapters: 12
  },
  {
    id: 'sample-2',
    name: '日语 N3 备考',
    totalChapters: 15,
    completedChapters: 3
  },
  {
     id: 'sample-3',
     name: 'UI/UX 设计基础',
     totalChapters: 10,
     completedChapters: 10
  }
];

const CourseApp: React.FC = () => {
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', SAMPLE_COURSES);
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
  
  const loadSamples = () => setCourses(SAMPLE_COURSES);

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
        {courses.length === 0 && (
            <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                <i className="fas fa-graduation-cap text-3xl mb-3 opacity-50"></i>
                <p className="mb-3">开始您的学习之旅吧！</p>
                <button onClick={loadSamples} className="text-cyan-500 hover:underline text-sm font-medium">
                    加载示例数据
                </button>
            </div>
        )}
        {courses.map(course => {
          const percent = Math.round((course.completedChapters / course.totalChapters) * 100);
          return (
            <div key={course.id} className="bg-white dark:bg-paper p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-3">
                 <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        {course.name}
                        {percent === 100 && <i className="fas fa-circle-check text-green-500"></i>}
                    </h3>
                    <p className="text-sm text-gray-500">进度: {course.completedChapters} / {course.totalChapters} 章节</p>
                 </div>
                 <button onClick={() => removeCourse(course.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                   <i className="fas fa-trash"></i>
                 </button>
               </div>
               
               {/* Progress Bar */}
               <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 mb-4 overflow-hidden relative">
                 <div 
                    className={`h-full transition-all duration-700 ease-out ${percent === 100 ? 'bg-green-500' : 'bg-cyan-500'}`} 
                    style={{ width: `${percent}%` }}
                 >
                     {/* Shimmer effect */}
                     <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] transform -skew-x-12 translate-x-[-100%]"></div>
                 </div>
               </div>

               <div className="flex justify-between items-center">
                 <span className={`font-mono font-bold ${percent === 100 ? 'text-green-600' : 'text-cyan-600'}`}>{percent}%</span>
                 <div className="flex gap-2">
                   <Button size="sm" variant="ghost" onClick={() => updateProgress(course.id, -1)} disabled={course.completedChapters === 0}>-</Button>
                   <Button size="sm" variant="secondary" onClick={() => updateProgress(course.id, 1)} disabled={course.completedChapters >= course.totalChapters} className={percent === 100 ? 'bg-green-500 hover:bg-green-600' : 'bg-cyan-500 hover:bg-cyan-600'}>
                        {percent === 100 ? '已完成' : '完成一章'}
                   </Button>
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
