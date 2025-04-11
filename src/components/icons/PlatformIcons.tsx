
import React from 'react';
import { Twitter, Globe, Linkedin, Instagram, Youtube } from 'lucide-react';

export const TwitterIcon = Twitter;
export const LinkedinIcon = Linkedin;
export const InstagramIcon = Instagram;
export const YoutubeIcon = Youtube;
export const WebIcon = Globe;
export const RedditIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M16.5 10.5c-.4-2.2-2.7-4-5.6-4s-5.2 1.8-5.6 4" />
    <circle cx="8" cy="13" r="1" />
    <circle cx="16" cy="13" r="1" />
    <path d="M9 17c.9.9 2.5.9 3.4 0" />
  </svg>
);

// Helper component to get the icon based on platform
interface PlatformIconProps {
  platform: string;
  size?: number;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, size = 24, className = "" }) => {
  const iconProps = { size, className };
  
  switch (platform) {
    case 'twitter':
      return <TwitterIcon {...iconProps} />;
    case 'reddit':
      return <RedditIcon className={className} />;
    case 'linkedin':
      return <LinkedinIcon {...iconProps} />;
    case 'instagram':
      return <InstagramIcon {...iconProps} />;
    case 'youtube':
      return <YoutubeIcon {...iconProps} />;
    case 'web':
      return <WebIcon {...iconProps} />;
    default:
      return <Globe {...iconProps} />;
  }
};
