'use client'
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome, {user?.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/gallery" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-green-700">Gallery</h3>
          <p className="text-gray-600 mt-2">Manage photo folders & excursions</p>
        </Link>

        <Link href="/dashboard/programs" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-yellow-600">Programs</h3>
          <p className="text-gray-600 mt-2">2025–2026 Cycle & Updates</p>
        </Link>

        <Link href="/dashboard/volunteers" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-blue-600">Volunteers</h3>
          <p className="text-gray-600 mt-2">Applications & Assignments</p>
        </Link>

        {user?.role === 'superadmin' && (
          <Link href="/auth/register" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-2 border-dashed border-purple-300">
            <h3 className="text-xl font-semibold text-purple-600">Create Admin</h3>
            <p className="text-gray-600 mt-2">Add new admin users</p>
          </Link>
        )}
      </div>
    </div>
  );
}