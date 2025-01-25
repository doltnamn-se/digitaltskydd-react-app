import { Translations } from './types';

export const en: Translations = {
  // Auth related
  'welcome.back': 'Welcome back',
  'sign.in': 'Sign in to your account',
  'signing.in': 'Signing in...',
  'no.account': "Don't have an account?",
  'register': 'Get started',
  'email': 'Email',
  'password': 'Password',
  'new.password': 'New password',
  'email.placeholder': 'Enter your email',
  'password.placeholder': 'Enter your password',
  'new.password.placeholder': 'Enter new password',
  'phone.placeholder': 'Enter phone number',
  'token.placeholder': 'Enter verification code',
  'dark.mode': 'Dark mode',
  'light.mode': 'Light mode',
  'forgot.password': 'Forgot your password?',
  'send.recovery.link': 'Send recovery link',
  'sending.recovery.link': 'Sending recovery link...',
  'update.password': 'Update password',
  'updating.password': 'Updating password...',
  'cancel': 'Cancel',
  'loading': 'Loading...',
  'reset.password': 'Reset Password',
  'reset.password.success': 'Password reset email sent successfully',
  'password.updated': 'Password updated successfully',
  // Navigation
  'nav.home': 'Home',
  'nav.checklist': 'Checklist',
  'nav.my.links': 'My Links',
  'nav.address.alerts': 'Address Alerts',
  'nav.guides': 'Guides',
  'nav.admin.dashboard': 'Dashboard',
  'nav.admin.customers': 'Customers',
  // Profile menu
  'profile.manage': 'Manage Profile',
  'profile.billing': 'Subscription',
  'profile.settings': 'Settings',
  'profile.sign.out': 'Sign out',
  'profile.signing.out': 'Signing out...',
  // Search
  'search.placeholder': 'Search...',
  'search.no.results': 'No results found.',
  'search.category.pages': 'Pages',
  'search.category.settings': 'Settings',
  // Footer links
  'privacy': 'Privacy',
  'license': 'License',
  'terms': 'Terms',
  // Page titles
  'overview.title': 'Overview',
  'overview.welcome': 'Welcome to your overview.',
  // Error messages
  'error': 'Error',
  'error.title': 'Error',
  'error.invalid.credentials': 'Invalid login credentials',
  'error.email.not.confirmed': 'Please confirm your email before logging in',
  'error.user.not.found': 'No user found with these credentials',
  'error.invalid.email.password': 'Invalid email or password',
  'error.missing.email.phone': 'Missing email or phone',
  'error.missing.password': 'Missing password',
  'error.password.too.short': 'Password must be at least 6 characters',
  'error.email.taken': 'Email is already taken',
  'error.phone.taken': 'Phone number is already taken',
  'error.weak.password': 'Password is too weak',
  'error.invalid.email': 'Invalid email',
  'error.invalid.phone': 'Invalid phone number',
  'error.generic': 'An error occurred. Please try again later.',
  'error.signin': 'Error signing in',
  'error.signout': 'Error signing out',
  'error.password.update': 'Error updating password',
  'error.missing.email': 'Please enter your email',
  'error.invalid.recovery.link': 'Invalid or expired recovery link',
  'error.password.requirements': 'Please ensure your password meets all requirements',
  'error.current.password': 'Current password is incorrect',
  'error.update.preferences': 'Failed to update notification preferences',
  'error.passwords.dont.match': 'Passwords do not match',
  'error.invalidFileType': 'Invalid file type. Please upload an image.',
  'error.fileTooLarge': 'File is too large. Maximum size is 5MB.',
  'error.avatarUpload': 'Failed to upload avatar.',
  'success.avatarUpdated': 'Avatar has been updated',
  'display.name': 'Display Name',
  // Toast messages
  'toast.signed.out.title': 'Signed out successfully',
  'toast.signed.out.description': 'You have been logged out of your account.',
  'toast.error.title': 'Error',
  'toast.error.description': 'Could not sign out. Please try again.',
  'toast.error.unexpected': 'An unexpected error occurred. Please try again.',
  'toast.copied.title': 'Copied',
  'toast.copied.description': 'Message has been copied to clipboard',
  // Table related
  'table.userId': 'UID',
  'table.email': 'Email',
  'table.role': 'Role',
  'table.created': 'Created',
  'table.subscription': 'Subscription',
  'table.actions': 'Actions',
  // Settings related
  'settings.change.password': 'Change password',
  'settings.current.password': 'Current password',
  'settings.new.password': 'New password',
  'settings.confirm.password': 'Confirm new password',
  'settings.update.password': 'Update password',
  'settings.updating.password': 'Updating password...',
  'settings.password.updated': 'Password updated successfully',
  'settings.success': 'Success',
  'settings.notification.preferences': 'Notification Preferences',
  'settings.email.notifications': 'Email Notifications',
  'settings.email.notifications.description': 'Receive important updates and alerts via email',
  'settings.inapp.notifications': 'App Notifications',
  'settings.inapp.notifications.description': 'Receive notifications within the application',
  'settings.notifications.updated': 'Notification preferences updated successfully',
  // Notifications
  'notifications.title': 'Notifications',
  'notifications': 'Notifications',
  'notifications.mark.all.read': 'Mark all as read',
  'notifications.empty': 'No notifications',
  // UI elements
  'messages': 'Messages',
  'copy': 'Copy',
  // Step related translations
  'step.number': 'Step {number}',
  'step.progress': 'Step {current} of {total}',
  'step.password.title': 'Set Password',
  'step.password.description': 'Create a secure password for your account',
  'step.sites.title': 'Select Sites',
  'step.sites.description': 'Choose which sites to hide your information from',
  'step.urls.title': 'Submit URLs',
  'step.urls.description': 'Submit URLs where your information appears',
  'step.info.title': 'Personal Information',
  'step.info.description': 'Update your personal information',
  'step.1.title': 'Set Password',
  'step.2.title': 'Select Sites',
  'step.3.title': 'Submit URLs',
  'step.4.title': 'Personal Information',
  // Password related
  'set.password': 'Set Password',
  'set.password.description': 'Create a secure password for your account',
  'current.password': 'Current Password',
  // Status messages
  'success': 'Success',
  'completed': 'Completed',
  'pending.completion': 'Pending completion',
  // Checklist related
  'checklist': 'Checklist',
  'getting.started': 'Getting Started',
  // Links
  'link.to.removal': 'Link to removal page',
  // Guide related translations
  'guide.eniro.title': 'Eniro',
  'guide.eniro.step1': 'Visit https://www.eniro.se/person/removal',
  'guide.eniro.step2': 'Fill in your personal information',
  'guide.eniro.step3': 'Submit the form',
  'guide.eniro.step4': 'Wait for confirmation',
  
  'guide.mrkoll.title': 'Mrkoll',
  'guide.mrkoll.step1': 'Visit https://www.mrkoll.se/person/removal',
  'guide.mrkoll.step2': 'Enter your details',
  'guide.mrkoll.step3': 'Submit request',
  
  'guide.hitta.title': 'Hitta.se',
  'guide.hitta.step1': 'Visit https://www.hitta.se/removal',
  'guide.hitta.step2': 'Complete the form',
  'guide.hitta.step3': 'Submit and wait',
  
  'guide.merinfo.title': 'Merinfo',
  'guide.merinfo.step1': 'Go to https://www.merinfo.se/removal',
  'guide.merinfo.step2': 'Follow removal process',
  
  'guide.ratsit.title': 'Ratsit',
  'guide.ratsit.step1': 'Visit https://www.ratsit.se/removal',
  'guide.ratsit.step2': 'Fill out removal form',
  'guide.ratsit.step3': 'Submit request',
  
  'guide.birthday.title': 'Birthday',
  'guide.birthday.step1': 'Visit website',
  'guide.birthday.step2': 'Send message: "Please remove my information"',
  'guide.birthday.step3': 'Wait for confirmation',
  
  'guide.upplysning.title': 'Upplysning',
  'guide.upplysning.step1': 'Go to website',
  'guide.upplysning.step2': 'Send removal request',
  'guide.upplysning.step3': 'Await response',

  // Subscription translations
  'subscription.1month': '1 MO',
  'subscription.6months': '6 MO',
  'subscription.12months': '12 MO',
  'subscription.none': 'No Plan',
  'subscription.tooltip.1month': 'Monthly plan',
  'subscription.tooltip.6months': 'Half-year plan',
  'subscription.tooltip.12months': 'Yearly plan'
} as const;
