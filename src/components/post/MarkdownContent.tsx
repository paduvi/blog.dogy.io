'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import {useMemo} from 'react';

interface MarkdownContentProps {
    content: string;
    className?: string;
}

export default function MarkdownContent({content, className}: MarkdownContentProps) {
    // Preprocess content to convert \( \) and \[ \] to $ and $$, and fix Hashnode image syntax
    const processedContent = useMemo(() => {
        if (!content) return '';

        let processed = content;

        // Fix Hashnode image syntax: ![](url align="center") -> ![](url)
        // This removes the align attribute that Hashnode adds to markdown images
        processed = processed.replace(/!\[(.*?)\]\((.*?)\s+align=["']?(left|center|right)["']?\)/g, (match, alt, url, align) => {
            // Return clean markdown image syntax
            return `![${alt}](${url})`;
        });

        // Convert \[ \] to $$ $$ for display math
        processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (match, equation) => {
            return `$$${equation}$$`;
        });

        // Convert \( \) to $ $ for inline math
        processed = processed.replace(/\\\\\(([\s\S]*?)\\\\\)/g, (match, equation) => {
            return `$${equation}$`;
        });

        return processed;
    }, [content]);

    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
                components={{
                    // Custom components for better styling
                    h1: ({node, ...props}) => <h1 {...props} />,
                    h2: ({node, ...props}) => <h2 {...props} />,
                    h3: ({node, ...props}) => <h3 {...props} />,
                    h4: ({node, ...props}) => <h4 {...props} />,
                    h5: ({node, ...props}) => <h5 {...props} />,
                    h6: ({node, ...props}) => <h6 {...props} />,
                    p: ({node, ...props}) => <p {...props} />,
                    a: ({node, ...props}) => (
                        <a
                            {...props}
                            target={props.href?.startsWith('http') ? '_blank' : undefined}
                            rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        />
                    ),
                    code: ({node, inline, className, children, ...props}: any) => {
                        return !inline ? (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    pre: ({node, ...props}) => <pre {...props} />,
                    blockquote: ({node, ...props}) => <blockquote {...props} />,
                    ul: ({node, ...props}) => <ul {...props} />,
                    ol: ({node, ...props}) => <ol {...props} />,
                    li: ({node, ...props}) => <li {...props} />,
                    table: ({node, ...props}) => (
                        <div style={{overflowX: 'auto'}}>
                            <table {...props} />
                        </div>
                    ),
                    img: ({node, src, alt, ...props}: any) => {
                        // Use standard img tag for external images from Hashnode CDN
                        if (!src) return null;

                        return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={src}
                                alt={alt || ''}
                                loading="lazy"
                                style={{maxWidth: '100%', height: 'auto'}}
                                {...props}
                            />
                        );
                    },
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
