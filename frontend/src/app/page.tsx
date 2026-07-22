import { redirect } from 'next/navigation';

// Middleware already handles the auth check; this just picks a sensible
// default destination for "/".
export default function Home() {
  redirect('/dashboard');
}
