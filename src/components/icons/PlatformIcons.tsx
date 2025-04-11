
import React from 'react';
import { Twitter, Globe } from 'lucide-react';

export const TwitterIcon = Twitter;
export const GlobeIcon = Globe;

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
