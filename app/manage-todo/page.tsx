'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { Header } from '@/components/layout/header';
import { TodoTable } from '@/components/todo/todo-table';


export default function Dashboard() {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

  if (!token || !isClient) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 space-y-4 mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <TodoTable />
      </main>
    </div>
  );
}