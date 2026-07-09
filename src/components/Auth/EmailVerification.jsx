// components/auth/EmailVerification.jsx
import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmailVerification = ({ email }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerification } = useAuth();
  
  const [status, setStatus] = useState('pending'); // pending, verifying, success, error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      handleVerifyEmail(token);
    }
  }, [token]);

  const handleVerifyEmail = async (verificationToken) => {
    setStatus('verifying');
    try {
      await verifyEmail(verificationToken);
      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    
    try {
      await resendVerification(email);
      setCountdown(60);
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {status === 'pending' && (
            <>
              <div className="w-20 h-20 bg-[#f06d00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-[#f06d00]" />
              </div>
              <h2 className="text-2xl font-bold text-[#2d333f] mb-3">Check your email</h2>
              <p className="text-gray-500 mb-6">
                We've sent a verification link to{' '}
                <span className="font-medium text-[#2d333f]">{email}</span>
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 text-left">
                    Click the link in the email to verify your account. If you don't see it, check your spam folder.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResendVerification}
                disabled={loading || countdown > 0}
                className="w-full bg-gray-50 text-[#2d333f] py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 mb-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend verification email
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/login')}
                className="text-sm text-[#f06d00] hover:underline font-medium"
              >
                Back to sign in
              </button>
            </>
          )}

          {status === 'verifying' && (
            <>
              <div className="w-20 h-20 border-4 border-[#f06d00] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#2d333f] mb-3">Verifying your email</h2>
              <p className="text-gray-500">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2d333f] mb-3">Email verified!</h2>
              <p className="text-gray-500 mb-6">
                Your account has been successfully verified. Redirecting you to your dashboard...
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1 mb-4">
                <div className="bg-[#f06d00] h-1 rounded-full animate-progress" />
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#2d333f] mb-3">Verification failed</h2>
              <p className="text-gray-500 mb-6">{error || 'The verification link is invalid or has expired.'}</p>
              
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full bg-[#f06d00] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#d96200] transition-all mb-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Request new link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-500 hover:text-[#2d333f] font-medium"
              >
                Back to sign in
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EmailVerification;