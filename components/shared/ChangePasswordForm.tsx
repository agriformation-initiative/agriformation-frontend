'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { authService } from '@/services/authService';

type Errors = Partial<Record<'current' | 'next' | 'confirm', string>>;

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found: Errors = {};
    if (!current) found.current = 'Enter your current password.';
    if (next.length < 6) found.next = 'Use at least 6 characters.';
    else if (next === current) found.next = 'Choose a password different from the current one.';
    if (confirm !== next) found.confirm = 'The two passwords do not match.';
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      await authService.changePassword(current, next);
      toast.success('Password updated');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      // A wrong current password belongs under that field, anything else is a general failure
      if (message?.toLowerCase().includes('current password')) setErrors({ current: message });
      else toast.error(message || 'We could not update your password. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const clear = (key: keyof Errors) => setErrors((p) => ({ ...p, [key]: undefined }));

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <TextField id="current" name="current" type="password" label="Current password" autoComplete="current-password" value={current}
        onChange={(e) => { setCurrent(e.target.value); clear('current'); }} error={errors.current} />
      <TextField id="next" name="next" type="password" label="New password" autoComplete="new-password" hint="At least 6 characters." value={next}
        onChange={(e) => { setNext(e.target.value); clear('next'); }} error={errors.next} />
      <TextField id="confirm" name="confirm" type="password" label="Confirm new password" autoComplete="new-password" value={confirm}
        onChange={(e) => { setConfirm(e.target.value); clear('confirm'); }} error={errors.confirm} />
      <Button type="submit" loading={saving}>Update password</Button>
    </form>
  );
}
