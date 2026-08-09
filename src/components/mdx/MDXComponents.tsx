import Callout from './Callout';
import CopyButton from './CopyButton';
import styles from '@/app/blog/[slug]/post.module.css';

export const mdxComponents = {
  Callout,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h1 id={slugify(props.children)} {...props} />,
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h2 id={slugify(props.children)} {...props} />,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <h3 id={slugify(props.children)} {...props} />,
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <div className={styles.codeBlock}>
      <pre {...props}>{children}</pre>
      <CopyButton content={extractText(children)} />
    </div>
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="link-animated"
      {...props}
    >
      {children}
    </a>
  ),
};

function slugify(children: React.ReactNode): string {
  const text = typeof children === 'string' ? children : '';
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in (node as any)) {
    return extractText((node as any).props.children);
  }
  return '';
}

