import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, KeyRound, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import Card, { CardContent, CardFooter, CardHeader } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS } from '../config';

interface ProfileFormData {
  name: string;
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { 
    register: registerProfile, 
    handleSubmit: handleProfileSubmit, 
    formState: { errors: profileErrors } 
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || ''
    }
  });
  
  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm<PasswordFormData>();
  
  const newPassword = watchPassword('newPassword');
  
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdatingProfile(true);
      setProfileError(null);
      setProfileSuccess(null);
      await updateProfile(data);
      setProfileSuccess('Profile updated successfully');
    } catch (err: any) {
      setProfileError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsUpdatingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(null);
      
      // In a real app, we'd validate the current password on the backend
      // and then update the password
      await updateProfile({ password: data.newPassword });
      
      setPasswordSuccess('Password updated successfully');
      resetPassword();
    } catch (err: any) {
      setPasswordError(err.response?.data?.detail || 'Failed to update password. Please try again.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await deleteAccount();
      navigate('/login');
    } catch (err: any) {
      setProfileError(err.response?.data?.detail || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Profile</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <User className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>
          </CardHeader>
          
          <CardContent>
            {profileError && (
              <Alert 
                variant="error" 
                title="Error" 
                onClose={() => setProfileError(null)}
                className="mb-4"
              >
                {profileError}
              </Alert>
            )}
            
            {profileSuccess && (
              <Alert 
                variant="success" 
                title="Success" 
                onClose={() => setProfileSuccess(null)}
                className="mb-4"
              >
                {profileSuccess}
              </Alert>
            )}
            
            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  {...registerProfile('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  error={profileErrors.name?.message}
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  {...registerProfile('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={profileErrors.email?.message}
                />
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={isUpdatingProfile}
                  >
                    Update Profile
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <KeyRound className="h-5 w-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            </div>
          </CardHeader>
          
          <CardContent>
            {passwordError && (
              <Alert 
                variant="error" 
                title="Error" 
                onClose={() => setPasswordError(null)}
                className="mb-4"
              >
                {passwordError}
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert 
                variant="success" 
                title="Success" 
                onClose={() => setPasswordSuccess(null)}
                className="mb-4"
              >
                {passwordSuccess}
              </Alert>
            )}
            
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  {...registerPassword('currentPassword', { 
                    required: 'Current password is required'
                  })}
                  error={passwordErrors.currentPassword?.message}
                />
                
                <Input
                  label="New Password"
                  type="password"
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: PASSWORD_REGEX,
                      message: PASSWORD_REQUIREMENTS
                    }
                  })}
                  error={passwordErrors.newPassword?.message}
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: value => value === newPassword || 'Passwords do not match'
                  })}
                  error={passwordErrors.confirmPassword?.message}
                />
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    isLoading={isUpdatingPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-error-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Danger Zone</h2>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-gray-600 mb-4">
              Once you delete your account, all of your products and data will be permanently removed.
              This action cannot be undone.
            </p>
            
            {showDeleteConfirm ? (
              <div>
                <Alert 
                  variant="error" 
                  title="Are you absolutely sure?" 
                  className="mb-4"
                >
                  This action will permanently delete your account and all associated data.
                </Alert>
                
                <div className="flex space-x-4">
                  <Button
                    variant="error"
                    isLoading={isDeleting}
                    onClick={handleDeleteAccount}
                  >
                    Yes, Delete My Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="error"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;