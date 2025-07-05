import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    userType: 'customer' as 'customer' | 'laborer',
    skills: [] as string[],
    hourlyRate: '',
    experience: ''
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({ ...prev, skills }));
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setError('');
    try {
      const currentLocation = await api.getCurrentLocation();
      setLocation(currentLocation);
      console.log('Location captured:', currentLocation);
    } catch (err: any) {
      console.error('Location error:', err);
      setError('Failed to get location. Please enable location access and try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!location) {
      setError('Please get your location first');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        ...formData,
        location,
        hourlyRate: formData.userType === 'laborer' ? parseFloat(formData.hourlyRate) : undefined,
        skills: formData.userType === 'laborer' ? formData.skills : undefined,
        experience: formData.userType === 'laborer' ? formData.experience : undefined
      };

      await register(userData);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Join LabourEase
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="userType" className="label">
                I am a
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="input"
              >
                <option value="customer">Customer</option>
                <option value="laborer">Laborer</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="address" className="label">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="input"
                rows={3}
                placeholder="Enter your address"
              />
            </div>

            {/* Location Section */}
            <div>
              <label className="label">Location</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="btn btn-outline w-full"
                >
                  {locationLoading ? 'Getting location...' : 'Get My Location'}
                </button>
                {location && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    Location captured: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </div>

            {/* Laborer-specific fields */}
            {formData.userType === 'laborer' && (
              <>
                <div>
                  <label htmlFor="skills" className="label">
                    Skills (comma-separated)
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    type="text"
                    required
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="input"
                    placeholder="e.g., Plumbing, Electrical, Carpentry"
                  />
                </div>

                <div>
                  <label htmlFor="hourlyRate" className="label">
                    Hourly Rate (₹)
                  </label>
                  <input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    required
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter your hourly rate"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="label">
                    Experience
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="input"
                    rows={3}
                    placeholder="Describe your experience"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !location}
              className="btn btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 