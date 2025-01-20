interface UserProfile {
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  email?: string | null;
}

export const getUserInitials = (userProfile: UserProfile | null): string => {
  if (!userProfile) return 'U';
  
  if (userProfile.display_name) {
    const names = userProfile.display_name.split(' ');
    if (names.length >= 2) {
      return `${names[0]?.[0] || ''}${names[names.length - 1]?.[0] || ''}`.toUpperCase();
    }
    return (userProfile.display_name[0] || 'U').toUpperCase();
  }
  
  if (userProfile.first_name || userProfile.last_name) {
    return `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}`.toUpperCase();
  }
  
  if (userProfile.email) {
    return userProfile.email[0].toUpperCase();
  }
  
  return 'U';
};

export const getFullName = (userProfile: UserProfile | null, userEmail: string | null): string => {
  if (!userProfile) return userEmail || '';
  if (userProfile.display_name) return userProfile.display_name;
  if (userProfile.first_name || userProfile.last_name) {
    return `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim();
  }
  return userEmail || '';
};