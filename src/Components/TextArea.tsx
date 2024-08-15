"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash'; 


interface ApiResponse {
  characterCount: number;
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
}

const TextArea = () => {
  const [text, setText] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to call the API
  const fetchData = async (text: string) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/text-analyze', { text });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced function to call fetchData
  const debouncedFetchData = debounce(fetchData, 1000);

  useEffect(() => {
    if (text.trim()) {
      debouncedFetchData(text);
    } else {
      setData(null);
    }
  }, [text]);

  // Handle text change
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchData(text);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <textarea
          value={text}
          onChange={handleChange}
          rows={10}
          className="p-2 border border-gray-300 rounded-md resize-none text-black"
          placeholder="Type your text here..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Analyze Text
        </button>
      </form>
      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
      {data && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <p><strong>Character Count:</strong> {data.characterCount}</p>
          <p><strong>Word Count:</strong> {data.wordCount}</p>
          <p><strong>Paragraph Count:</strong> {data.paragraphCount}</p>
          <p><strong>Sentence Count:</strong> {data.sentenceCount}</p>
        </div>
      )}
    </div>
  );
};

export default TextArea;
