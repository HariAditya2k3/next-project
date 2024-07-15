'use client';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './globals.css';
import ThemeToggle from './components/ThemeToggle';
import Card from './components/Card';

// Initialize a new QueryClient instance
const queryClient = new QueryClient();

interface LayoutProps {
  children: React.ReactNode;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showContent, setShowContent] = useState(false);

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      await queryClient.prefetchQuery('dummyData', fetchDummyData);
      setShowContent(true);
      console.log('Data fetched successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const refreshData = () => {
    setShowContent(false);
    queryClient.removeQueries('dummyData');
    console.log('Data refreshed');
  };

  const fetchDummyData = async (): Promise<Post[]> => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <HtmlHead />
      <BodyContent showContent={showContent} fetchData={fetchData} refreshData={refreshData}>
        {children}
      </BodyContent>
    </QueryClientProvider>
  );
};

const HtmlHead: React.FC = () => {
  return (
    <html lang="en">
      <HeadContent />
    </html>
  );
};

const HeadContent: React.FC = () => {
  return (
    <head>
      <title>My Website</title>
      <link rel="icon" href="/favicon.ico" />
    </head>
  );
};

interface BodyContentProps {
  showContent: boolean;
  fetchData: () => void;
  refreshData: () => void;
  children: React.ReactNode;
}

const BodyContent: React.FC<BodyContentProps> = ({ showContent, fetchData, refreshData, children }) => {
  return (
    <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <header className="p-4 shadow-md dark:bg-gray-800">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">My Website</h1>
          <ThemeToggle />
        </nav>
      </header>
      <main className="container mx-auto flex-grow p-4">
        {children}
        <div className="flex justify-center mt-8">
          <Card showContent={showContent} />
        </div>
      </main>
      <footer className="p-4 shadow-inner dark:bg-gray-800">
        <div className="container mx-auto flex justify-center space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={fetchData}
          >
            Get
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={refreshData}
          >
            Refresh
          </button>
        </div>
        <div className="container mx-auto text-center mt-4">
          <p>© 2024 My Website</p>
        </div>
      </footer>
    </body>
  );
};

export default Layout;
