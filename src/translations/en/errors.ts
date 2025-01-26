import { ErrorTranslations } from '../types/errors';

export const errors: ErrorTranslations = {
  'error': 'Error',
  'error.title': 'Error',
  'error.invalid.credentials': 'Invalid username or password',
  'error.email.not.confirmed': 'Please confirm your email address before logging in',
  'error.user.not.found': 'No user found with these credentials',
  'error.invalid.email.password': 'Invalid email address or password',
  'error.missing.email.phone': 'Email address or phone number is missing',
  'error.missing.password': 'Password is missing',
  'error.password.too.short': 'Password must be at least 6 characters',
  'error.email.taken': 'Email address is already in use',
  'error.phone.taken': 'Phone number is already in use',
  'error.weak.password': 'Password is too weak',
  'error.invalid.email': 'Invalid email address',
  'error.invalid.phone': 'Invalid phone number',
  'error.generic': 'An error occurred. Please try again later.',
  'error.signin': 'Error signing in',
  'error.signout': 'Error signing out',
  'error.password.update': 'Error updating password',
  'error.missing.email': 'Please enter your email address',
  'error.invalid.recovery.link': 'Invalid or expired recovery link',
  'error.password.requirements': 'Make sure your password meets all requirements',
  'error.current.password': 'Current password is incorrect',
  'error.update.preferences': 'Failed to update notification settings',
  'error.passwords.dont.match': 'Passwords do not match',
  'error.invalidFileType': 'Invalid file type. Please upload an image.',
  'error.fileTooLarge': 'File is too large. Maximum size is 5MB.',
  'error.avatarUpload': 'Failed to upload avatar.',
};