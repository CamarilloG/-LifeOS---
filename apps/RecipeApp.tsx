
import React, { useState } from 'react';
import { Card, Button, Input, Modal, Badge } from '../components/ui/Common';
import { generateRecipes } from '../services/geminiService';
import { Recipe, SavedRecipe } from '../types';
import { useLocalStorage } from '../utils/hooks';

const RecipeApp: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useLocalStorage<SavedRecipe[]>('saved-recipes', []);
  const [groceryList, setGroceryList] = useLocalStorage<any[]>('grocery-list', []); // Integration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    setLoading(true);
    setError('');
    try {
      const ingredientList = ingredients.split(/[,，、\s]+/).filter(i => i.trim());
      const result = await generateRecipes(ingredientList);
      if (result.recipes) setRecipes(result.recipes);
    } catch (err) {
      setError("生成失败。请检查 API Key 和网络连接。");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = (recipe: Recipe) => {
      if (savedRecipes.some(r => r.name === recipe.name)) return;
      setSavedRecipes(prev => [...prev, { ...recipe, id: Date.now().toString(), savedAt: new Date().toISOString() }]);
  };

  const removeSaved = (id: string) => {
      setSavedRecipes(prev => prev.filter(r => r.id !== id));
  };

  const addToGroceries = (recipe: Recipe) => {
      const newItems = recipe.ingredients.map(ing => ({
          id: Date.now() + Math.random(),
          name: `${ing.name} (${ing.amount})`,
          checked: false
      }));
      setGroceryList(prev => [...prev, ...newItems]);
      alert(`已将 ${newItems.length} 种食材加入购物清单`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-10 bg-gradient-to-b from-orange-50 to-transparent dark:from-orange-900/10 rounded-3xl">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">
            AI 智能主厨 <span className="text-orange-500">KitchenAI</span>
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            不知道吃什么？输入冰箱里的食材，让 AI 为您生成米其林级别的创意食谱。
        </p>
        
        <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto px-4">
          <Input 
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="例如：鸡蛋，西红柿，牛肉，意面..."
            className="flex-1 shadow-md text-lg py-3"
          />
          <Button type="submit" disabled={loading || !ingredients} size="lg" className="shadow-lg shadow-orange-500/30 bg-orange-500 hover:bg-orange-600">
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-wand-magic-sparkles"></i> 开始生成</>}
          </Button>
        </form>
        {error && <p className="text-red-500 text-sm animate-shake">{error}</p>}
      </div>

      {/* Generated Results */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse px-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-slate-700 rounded-2xl"></div>
            ))}
        </div>
      )}

      {recipes.length > 0 && (
          <div className="space-y-4 px-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><i className="fas fa-lightbulb text-yellow-500"></i> 为您推荐</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recipes.map((recipe, idx) => (
                <Card key={idx} className="flex flex-col h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-900">
                    <div className="mb-4">
                        <div className="flex gap-2 mb-3">
                            <Badge color="green">{recipe.prepTime}</Badge>
                            <Badge color="orange">{recipe.calories} kcal</Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{recipe.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{recipe.description}</p>
                    </div>
                    <div className="mt-auto pt-4 flex gap-2">
                        <Button variant="outline" onClick={() => setSelectedRecipe(recipe)} className="flex-1">详情</Button>
                        <Button onClick={() => saveRecipe(recipe)} className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none shadow-none"><i className="fas fa-heart"></i></Button>
                    </div>
                </Card>
                ))}
              </div>
          </div>
      )}

      {/* Saved Recipes */}
      {savedRecipes.length > 0 && (
        <div className="px-4 border-t border-gray-100 dark:border-gray-700 pt-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <i className="fas fa-book-bookmark text-red-500"></i> 我的收藏
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {savedRecipes.map(recipe => (
                    <div key={recipe.id} className="bg-white dark:bg-paper p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group relative">
                        <button onClick={() => removeSaved(recipe.id!)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                            <i className="fas fa-trash"></i>
                        </button>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{recipe.name}</h4>
                        <p className="text-xs text-gray-400 mb-3">收藏于 {new Date(recipe.savedAt).toLocaleDateString()}</p>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedRecipe(recipe)} className="w-full text-xs border border-gray-100 dark:border-gray-600">查看</Button>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <Modal isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} title={selectedRecipe.name}>
            <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-300 italic text-sm bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                    {selectedRecipe.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl text-center">
                        <span className="block text-xs text-orange-500 uppercase font-bold">准备时间</span>
                        <span className="font-bold text-gray-800 dark:text-white">{selectedRecipe.prepTime}</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-center">
                        <span className="block text-xs text-green-500 uppercase font-bold">热量</span>
                        <span className="font-bold text-gray-800 dark:text-white">{selectedRecipe.calories}</span>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">所需食材</h4>
                    <ul className="grid grid-cols-2 gap-2 text-sm">
                        {selectedRecipe.ingredients.map((ing, i) => (
                            <li key={i} className="flex justify-between p-2 bg-gray-50 dark:bg-slate-800 rounded">
                                <span className="font-medium">{ing.name}</span>
                                <span className="text-gray-500">{ing.amount}</span>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={() => addToGroceries(selectedRecipe)} variant="secondary" className="w-full mt-3 text-xs">
                        <i className="fas fa-cart-plus mr-1"></i> 全部加入购物清单
                    </Button>
                </div>

                <div>
                    <h4 className="font-bold mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">烹饪步骤</h4>
                    <ol className="space-y-4">
                        {selectedRecipe.instructions.map((step, i) => (
                            <li key={i} className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">{i+1}</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default RecipeApp;
