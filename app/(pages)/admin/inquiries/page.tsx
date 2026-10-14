'use client';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Inbox } from 'lucide-react';
import { inquiryService, AdminInquiry, InquiryType } from '@/services/inquiryService';
import { formatDate, titleCase } from '@/lib/format';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/Field';
import { Table, Th, Td, rowClass } from '@/components/ui/table';
import { PageHeader, EmptyState, ErrorState, DashboardSkeleton } from '@/components/ui/dashboard';

const TYPE_LABEL: Record<InquiryType, string> = {
  contact: 'Message',
  school: 'School request',
  partner: 'Partnership',
};

const STATUS_STYLE: Record<AdminInquiry['status'], string> = {
  new: 'bg-amber-50 text-amber-900',
  contacted: 'bg-sky-50 text-sky-900',
  closed: 'bg-stone-100 text-stone-700',
};

export default function InquiriesPage() {
  const [items, setItems] = useState<AdminInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<AdminInquiry | null>(null);

  const load = useCallback(async () => {
    setFailed(false);
    try {
      setItems(await inquiryService.list({
        type: (type || undefined) as InquiryType | undefined,
        status: status || undefined,
      }));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [type, status]);

  useEffect(() => { load(); }, [load]);

  const setItemStatus = async (item: AdminInquiry, next: AdminInquiry['status']) => {
    try {
      const updated = await inquiryService.updateStatus(item._id, next);
      setItems((list) => list.map((i) => (i._id === updated._id ? updated : i)));
      setSelected(updated);
      toast.success(`Marked as ${next}`);
    } catch {
      toast.error('We could not update that enquiry. Try again.');
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Inquiries"
        description="Messages, school requests and partnership enquiries from the website."
        action={
          <div className="flex gap-3">
            <div className="w-44">
              <SelectField id="type" label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All</option>
                <option value="contact">Messages</option>
                <option value="school">School requests</option>
                <option value="partner">Partnerships</option>
              </SelectField>
            </div>
            <div className="w-40">
              <SelectField id="status" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </SelectField>
            </div>
          </div>
        }
      />

      {failed ? (
        <ErrorState message="We could not load the inquiries." onRetry={load} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white">
          {items.length === 0 ? (
            <EmptyState icon={Inbox} title="No inquiries yet" description="Messages from the contact, school and partner forms appear here." />
          ) : (
            <Table caption="Inquiries">
              <thead>
                <tr><Th>From</Th><Th>Type</Th><Th>Received</Th><Th>Status</Th><Th><span className="sr-only">Actions</span></Th></tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i._id} className={rowClass}>
                    <Td>
                      <p className="font-medium text-stone-900">{i.organization || i.name}</p>
                      <p className="text-sm text-stone-600">{i.organization ? `${i.name} · ` : ''}{i.email}</p>
                    </Td>
                    <Td>{TYPE_LABEL[i.type]}</Td>
                    <Td className="whitespace-nowrap">{formatDate(i.createdAt, 'short')}</Td>
                    <Td>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[i.status]}`}>{titleCase(i.status)}</span>
                    </Td>
                    <Td className="text-right">
                      <Button variant="secondary" className="!min-h-10 !py-1.5 text-sm" onClick={() => setSelected(i)}>
                        Open<span className="sr-only"> enquiry from {i.name}</span>
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}

      {selected && (
        <Modal
          title={selected.organization || selected.name}
          onClose={() => setSelected(null)}
          footer={
            <>
              <Button variant="secondary" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject || TYPE_LABEL[selected.type]}`)}`}>Reply by email</Button>
              {selected.status !== 'contacted' && <Button variant="secondary" onClick={() => setItemStatus(selected, 'contacted')}>Mark contacted</Button>}
              {selected.status !== 'closed' && <Button onClick={() => setItemStatus(selected, 'closed')}>Mark closed</Button>}
              {selected.status === 'closed' && <Button onClick={() => setItemStatus(selected, 'new')}>Reopen</Button>}
            </>
          }
        >
          <dl className="space-y-4">
            <div><dt className="text-sm text-stone-600">Type</dt><dd className="font-medium">{TYPE_LABEL[selected.type]}</dd></div>
            <div><dt className="text-sm text-stone-600">Contact</dt><dd className="font-medium">{selected.name}</dd></div>
            <div><dt className="text-sm text-stone-600">Email</dt><dd><a href={`mailto:${selected.email}`} className="text-brand-700 underline underline-offset-4">{selected.email}</a></dd></div>
            {selected.phone && <div><dt className="text-sm text-stone-600">Phone</dt><dd><a href={`tel:${selected.phone}`} className="text-brand-700 underline underline-offset-4">{selected.phone}</a></dd></div>}
            {selected.location && <div><dt className="text-sm text-stone-600">Location</dt><dd className="font-medium">{selected.location}</dd></div>}
            {selected.studentCount && <div><dt className="text-sm text-stone-600">Students</dt><dd className="font-medium">{selected.studentCount}</dd></div>}
            {selected.subject && <div><dt className="text-sm text-stone-600">Subject</dt><dd className="font-medium">{selected.subject}</dd></div>}
            <div>
              <dt className="text-sm text-stone-600">Message</dt>
              <dd className="mt-1 whitespace-pre-wrap rounded-md bg-stone-50 p-4 text-stone-800">{selected.message}</dd>
            </div>
          </dl>
        </Modal>
      )}
    </div>
  );
}
