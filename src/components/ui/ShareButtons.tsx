'use client';

import { useState } from 'react';
import styles from './ShareButtons.module.css';
import { 
  TwitterIcon, 
  FacebookIcon, 
  LinkedinIcon, 
  LinkIcon 
} from 'lucide-react';

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className={styles.shareContainer}>
      <span className={styles.shareLabel}>Share this article:</span>
      <div className={styles.buttons}>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.shareBtn} aria-label="Share on X/Twitter">
          <TwitterIcon size={18} />
        </a>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.shareBtn} aria-label="Share on Facebook">
          <FacebookIcon size={18} />
        </a>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className={styles.shareBtn} aria-label="Share on LinkedIn">
          <LinkedinIcon size={18} />
        </a>
        <button onClick={copyToClipboard} className={`${styles.shareBtn} ${copied ? styles.copied : ''}`} aria-label="Copy link">
          <LinkIcon size={18} />
          {copied && <span className={styles.copyTooltip}>Copied!</span>}
        </button>
      </div>
    </div>
  );
}
