"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import ApiService from "@/utils/apiCore";

interface ApiResponse {
  characterCount: number;
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  longestWord: string;
}

const UserDashboard = () => {
  const [text, setText] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const apiService = new ApiService();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text) {
      return;
    }
    setShowLoader(true);

    try {
      const response = await apiService.postData('text', { content: text });
      
      if (response?.statusCode === 201) {
        const id = response?.data?._id;
        const endpoints = [
          `text/${id}/character-count`,
          `text/${id}/word-count`,
          `text/${id}/paragraph-count`,
          `text/${id}/sentence-count`,
          `text/${id}/longest-word`
        ];
  
        const [characterCount, wordCount, paragraphCount, sentenceCount, longestWord] = await Promise.all(
          endpoints.map(endpoint => apiService.getData(endpoint))
        );

        setData({
          characterCount: characterCount?.data?.data || 0,
          wordCount: wordCount?.data?.data || 0,
          paragraphCount: paragraphCount?.data?.data || 0,
          sentenceCount: sentenceCount?.data?.data || 0,
          longestWord: longestWord?.data?.data || ''
        });
      }
    } catch (e: any) {
      alert('Something went wrong!');
    } finally {
      setShowLoader(false);
    }
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
      {showLoader ? (
        <p className="mt-4 text-white text-center">Loading...</p>
      ) : (
        <div className=" grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 border border-gray-300 rounded-md">
          <p className=" bg-blue-600 p-4 rounded-lg">
            <strong>Character Count:</strong> {data?.characterCount || 0}
          </p>
          <p className=" bg-blue-600 p-4 rounded-lg">
            <strong>Word Count:</strong> {data?.wordCount || 0}
          </p>
          <p className=" bg-blue-600 p-4 rounded-lg">
            <strong>Paragraph Count:</strong> {data?.paragraphCount || 0}
          </p>
          <p className=" bg-blue-600 p-4 rounded-lg">
            <strong>Sentence Count:</strong> {data?.sentenceCount || 0}
          </p>
          <p className=" bg-blue-600 p-4 rounded-lg">
            <strong>Longest Word:</strong> {data?.longestWord || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
