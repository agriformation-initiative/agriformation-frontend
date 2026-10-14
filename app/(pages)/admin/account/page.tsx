'use client';
import { useAuthStore } from '@/store/authStore';
import ChangePasswordForm from '@/components/shared/ChangePasswordForm';
import { PageHeader } from '@/components/ui/dashboard';

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="My account" description={user ? `Signed in as ${user.email}` : undefined} />
      <section className="rounded-xl bg-white p-6" aria-labelledby="password-heading">
        <h2 id="password-heading" className="mb-5 font-sans text-lg font-semibold">Change password</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
