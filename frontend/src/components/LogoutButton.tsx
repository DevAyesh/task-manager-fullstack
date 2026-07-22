'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { clearToken } from '@/lib/auth';

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    toast.success('Logged out');
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
    >
      Log out
    </button>
  );
}
