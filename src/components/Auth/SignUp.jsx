// components/auth/SignUp.jsx
import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmailVerification from './EmailVerification';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [accountType, setAccountType] = useState('customer');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    serviceType: '',
    phone: '',
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      minLength: false,
      hasUpper: false,
      hasLower: false,
      hasNumber: false,
      hasSpecial: false,
    },
  });

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    const score = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength({ score, requirements });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const signupData = {
        ...formData,
        accountType,
      };

      await signup(signupData);
      setStep(2); // Move to email verification step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    if (passwordStrength.score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  if (step === 2) {
    return <EmailVerification email={formData.email} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f06d00] rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2d333f] mb-2">Create your account</h1>
          <p className="text-gray-500">Join thousands of satisfied customers</p>
        </div>

        {/* Account Type Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setAccountType('customer')}
              className={`relative py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                accountType === 'customer'
                  ? 'bg-[#f06d00] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#2d333f]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-4 h-4" />
                Customer
              </div>
            </button>
            <button
              onClick={() => setAccountType('provider')}
              className={`relative py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                accountType === 'provider'
                  ? 'bg-[#f06d00] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#2d333f]'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Briefcase className="w-4 h-4" />
                Service Provider
              </div>
            </button>
          </div>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#2d333f] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f06d00]/20 focus:border-[#f06d00] transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#2d333f] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f06d00]/20 focus:border-[#f06d00] transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Service Provider Fields */}
          {accountType === 'provider' && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#2d333f] mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f06d00]/20 focus:border-[#f06d00] transition-all"
                  placeholder="Your company name"
                  required={accountType === 'provider'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d333f] mb-1.5">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f06d00]/20 focus:border-[#f06d00] transition-all text-gray-600"
                  required={accountType === 'provider'}
                >
                  <option value="">Select your service</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC</option>
                  <option value="roofing">Roofing</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="painting">Painting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d333f] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f06d00]/20 focus:border-[#f06d00] transition-all"
                  placeholder="(555) 123-4567"
                  required={accountType === 'provider'}
                />
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#2d333f] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f06d00]/20 focus:border-[#f06d00] transition-all"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-3">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        level <= passwordStrength.score
                          ? getStrengthColor()
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Password strength: <span className="font-medium">{getStrengthText()}</span>
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {Object.entries(passwordStrength.requirements).map(([key, met]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      {met ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-gray-300" />
                      )}
                      <span className={`text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
                        {key === 'minLength' && '8+ characters'}
                        {key === 'hasUpper' && 'Uppercase letter'}
                        {key === 'hasLower' && 'Lowercase letter'}
                        {key === 'hasNumber' && 'Number'}
                        {key === 'hasSpecial' && 'Special character'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 rounded border-gray-300 text-[#f06d00] focus:ring-[#f06d00]"
              required
            />
            <label htmlFor="terms" className="text-xs text-gray-500">
              I agree to the{' '}
              <a href="#" className="text-[#f06d00] hover:underline font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#f06d00] hover:underline font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f06d00] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#d96200] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#f06d00] hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;