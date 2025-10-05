import { FormEvent, useState } from 'react';
import { requestOtp, verifyOtp } from '@/services/auth';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as any;

  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await requestOtp();
      if (res.success) {
        setStep('verify');
        setMessage('OTP sent to your email. Please check your inbox.');
      } else {
        setMessage(res.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await verifyOtp(code);
      if (res.success && res.data?.token) {
        localStorage.setItem('admin_token', res.data.token);
        const to = location.state?.from?.pathname || '/careers';
        navigate(to, { replace: true });
      } else {
        setMessage(res.message || 'Invalid code');
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>CBM Admin Login</h1>
      {message && <div style={{ marginBottom: 12, color: '#111827' }}>{message}</div>}
      {step === 'request' ? (
        <form onSubmit={handleRequest}>
          <button disabled={loading} type="submit" style={{ width: '100%', padding: 10, background: '#111827', color: 'white', borderRadius: 6 }}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <label style={{ display: 'block', marginBottom: 8 }}>Enter OTP</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="6-digit code"
            style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6, marginBottom: 12 }}
          />
          <button disabled={loading} type="submit" style={{ width: '100%', padding: 10, background: '#111827', color: 'white', borderRadius: 6 }}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <button type="button" onClick={() => setStep('request')} style={{ width: '100%', padding: 10, background: 'transparent', color: '#111827', borderRadius: 6, marginTop: 8, border: '1px solid #d1d5db' }}>
            Resend OTP
          </button>
        </form>
      )}
    </div>
  );
}

