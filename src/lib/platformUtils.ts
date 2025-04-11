
// Platform utility functions

/**
 * Returns the display name for a given platform identifier
 */
export const getPlatformDisplayName = (platform: string): string => {
  const displayNames: Record<string, string> = {
    twitter: 'X (Twitter)',
    reddit: 'Reddit',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    youtube: 'YouTube',
    web: 'Web Articles'
  };
  
  return displayNames[platform] || platform;
};
