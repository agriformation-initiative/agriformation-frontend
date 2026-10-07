import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function VolunteerAreaLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout area="volunteer">{children}</DashboardLayout>;
}
