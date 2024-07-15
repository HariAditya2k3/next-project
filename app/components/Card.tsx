import React from 'react';
import { useQuery } from 'react-query';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface CardProps {
  showContent: boolean;
}

const fetchDummyData = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Card: React.FC<CardProps> = ({ showContent }) => {
  const { data, isLoading, isError } = useQuery<Post[]>('dummyData', fetchDummyData, {
    enabled: showContent,
  });

  if (!showContent) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md max-h-96 md:max-h-screen-md lg:max-h-screen-lg xl:max-h-screen-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <p>No content to display</p>
      </div>
    );
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching data</p>;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md max-h-96 md:max-h-screen-md lg:max-h-screen-lg xl:max-h-screen-xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      {data?.map((post) => (
        <div key={post.id} className="mb-4">
          <h2 className="text-lg font-bold mb-2">Post Details</h2>
          <p className="text-gray-700 dark:text-gray-300"><strong>User ID:</strong> {post.userId}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>ID:</strong> {post.id}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>Title:</strong> {post.title}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>Body:</strong> {post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default Card;
