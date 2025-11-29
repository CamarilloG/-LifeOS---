import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui/Common';
import { generateTravelItinerary } from '../services/geminiService';

const TravelApp: React.FC = () => {
  const [city, setCity] = useState('');
  const [itinerary, setItinerary] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await generateTravelItinerary(city, 3);
    setItinerary(result);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-4">旅行规划师</h2>
        <form onSubmit={handlePlan} className="flex gap-2">
            <Input value={city} onChange={e => setCity(e.target.value)} placeholder="您想去哪个城市？" required />
            <Button type="submit" disabled={loading}>
                {loading ? '规划中...' : '规划行程'}
            </Button>
        </form>
      </Card>
      
      {itinerary && (
        <Card className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm">{itinerary}</pre>
        </Card>
      )}
    </div>
  );
};
export default TravelApp;