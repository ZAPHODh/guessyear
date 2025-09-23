import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/server/auth/session';

export default async function NewLobbyPage() {
  const { user } = await getCurrentSession();

  if (!user) {
    redirect('/login');
  }

  // Redirect to lobby browser - the dialog will intercept this route
  redirect('/lobby');
}