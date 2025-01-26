import { Translations } from './types';

export const en: Translations = {
  'welcome.back': 'Welcome back',
  'sign.in': 'Sign in to your account',
  'signing.in': 'Signing in...',
  'no.account': 'Don’t have an account?',
  'register': 'Get started',
  'email': 'Email',
  'password': 'Password',
  'new.password': 'New password',
  'email.placeholder': 'Enter your email address',
  'password.placeholder': 'Enter your password',
  'new.password.placeholder': 'Enter new password',
  'phone.placeholder': 'Enter phone number',
  'token.placeholder': 'Enter verification code',
  'dark.mode': 'Dark mode',
  'light.mode': 'Light mode',
  'forgot.password': 'Forgot your password?',
  'send.recovery.link': 'Send recovery link',
  'sending.recovery.link': 'Sending recovery link...',
  'update.password': 'Save new password',
  'updating.password': 'Updating password...',
  'cancel': 'Cancel',
  'loading': 'Loading...',
  'reset.password': 'Reset password',
  'reset.password.success': 'Reset link has been sent',
  'password.updated': 'Password has been updated',
  // Navigation
  'nav.home': 'Home',
  'nav.checklist': 'Checklist',
  'nav.my.links': 'Deindexing',
  'nav.address.alerts': 'Address alerts',
  'nav.guides': 'Guides',
  'nav.admin.dashboard': 'Dashboard',
  'nav.admin.customers': 'Customers',
  // Profile menu
  'profile.manage': 'Manage profile',
  'profile.billing': 'Subscription',
  'profile.settings': 'Settings',
  'profile.sign.out': 'Sign out',
  'profile.signing.out': 'Signing out...',
  // Search
  'search.placeholder': 'Search...',
  'search.no.results': 'No search results found.',
  'search.category.pages': 'Pages',
  'search.category.settings': 'Settings',
  // Footer links
  'privacy': 'Privacy',
  'license': 'License terms',
  'terms': 'Terms of use',
  // Page titles
  'overview.title': 'Overview',
  'overview.welcome': 'Welcome to your overview.',
  // Error messages
  'error': 'Error',
  'error.title': 'Error',
  'error.invalid.credentials': 'Invalid username or password',
  'error.current.password': 'Current password is incorrect',
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
  'error.update.preferences': 'Failed to update notification settings',
  'error.passwords.dont.match': 'Passwords do not match',
  'error.invalidFileType': 'Invalid file type. Please upload an image.',
  'error.fileTooLarge': 'File is too large. Maximum size is 5MB.',
  'error.avatarUpload': 'Failed to upload avatar.',
  'success.avatarUpdated': 'Avatar has been updated',
  'success.avatarDeleted': 'Avatar has been deleted',
  'error.avatarDelete': 'Failed to delete avatar',
  'display.name': 'Name',
  // Toast messages
  'toast.signed.out.title': 'You have signed out',
  'toast.signed.out.description': 'You have signed out of your account.',
  'toast.error.title': 'Error',
  'toast.error.description': 'Could not sign out. Please try again.',
  'toast.error.unexpected': 'An unexpected error occurred. Please try again.',
  'toast.copied.title': 'Copied',
  'toast.copied.description': 'The message has been copied to clipboard',
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
  'settings.update.password': 'Save new password',
  'settings.updating.password': 'Updating password...',
  'settings.success': 'Done',
  'settings.password.updated': 'Password has been updated',
  'settings.notification.preferences': 'Notification settings',
  'settings.email.notifications': 'Email notifications',
  'settings.email.notifications.description': 'Receive important updates and alerts via email',
  'settings.inapp.notifications': 'In-app notifications',
  'settings.inapp.notifications.description': 'Receive notifications within the application',
  'settings.notifications.updated': 'Notification settings have been updated',
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
  'step.password.title': 'Choose your password',
  'step.password.description': 'Create a secure password for your account',
  'step.sites.title': 'Select sites',
  'step.sites.description': 'Choose which sites you want to hide your information from',
  'step.urls.title': 'Submit URLs',
  'step.urls.description': 'Submit URLs where your information appears',
  'step.info.title': 'Personal information',
  'step.info.description': 'Update your personal information',
  'step.1.title': 'Set your password',
  'step.2.title': 'Deindexing',
  'step.3.title': 'Submit URLs',
  'step.4.title': 'Personal information',
  // New translations for step 2
  'step.deindexing.title': 'Deindexing',
  'step.deindexing.description': 'Enter the links from Google you wish to remove',
  // Password related
  'set.password': 'Set password',
  'set.password.description': 'Create a secure password for your account',
  'current.password': 'Current password',
  // Status messages
  'success': 'Done',
  'completed': 'Completed',
  'pending.completion': 'Pending completion',
  // Checklist related
  'checklist': 'Checklist',
  'getting.started': 'Get started',
  // URL related
  
  // Guide related translations
  'guide.eniro.title': 'Eniro',
  'guide.eniro.step1': 'Visit https://www.eniro.se/person/removal',
  'guide.eniro.step2': 'Fill in your personal information',
  'guide.eniro.step3': 'Submit the form',
  'guide.eniro.step4': 'Wait for confirmation',
  
  'guide.mrkoll.title': 'Mrkoll',
  'guide.mrkoll.step1': 'Visit https://www.mrkoll.se/person/removal',
  'guide.mrkoll.step2': 'Enter your information',
  'guide.mrkoll.step3': 'Submit request',
  
  'guide.hitta.title': 'Hitta.se',
  'guide.hitta.step1': 'Visit https://www.hitta.se/removal',
  'guide.hitta.step2': 'Fill in the form',
  'guide.hitta.step3': 'Submit and wait',
  
  'guide.merinfo.title': 'Merinfo',
  'guide.merinfo.step1': 'Go to https://www.merinfo.se/removal',
  'guide.merinfo.step2': 'Follow removal process',
  
  'guide.ratsit.title': 'Ratsit',
  'guide.ratsit.step1': 'Visit https://www.ratsit.se/removal',
  'guide.ratsit.step2': 'Fill in removal form',
  'guide.ratsit.step3': 'Submit request',
  
  'guide.birthday.title': 'Birthday',
  'guide.birthday.step1': 'Visit the website',
  'guide.birthday.step2': 'Send message: "Please remove my information"',
  'guide.birthday.step3': 'Wait for confirmation',
  
  'guide.upplysning.title': 'Upplysning',
  'guide.upplysning.step1': 'Go to website',
  'guide.upplysning.step2': 'Send removal request',
  'guide.upplysning.step3': 'Wait for response',

  // Links
  'link.to.removal': 'Link to removal page',

  // Deindexing related
  'deindexing.incoming.links': 'Incoming links',
  'deindexing.deindexed.links': 'Deindexed links',
  
  // URL related
  'url.input.placeholder': 'Paste the URL (https://...)',
  'url.add.another': 'Add another link',
  'save.urls': 'Save URLs',
  'saving': 'Saving...',
  'url.limit.message': 'Your subscription allows up to {limit} URLs.',
  'url.no.plan': 'Your current subscription does not allow URL submissions. Upgrade to a 6 or 12-month plan to add URLs.',
} as const;
