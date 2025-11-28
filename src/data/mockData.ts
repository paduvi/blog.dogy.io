export interface Author {
    name: string;
    avatar: string;
    username: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    coverImage?: string;
    sortOrder?: 'newest' | 'oldest';
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
}

export interface CategoryGroup {
    id: string;
    name: string;
    slug: string;
    categories: Category[];
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author: Author;
    publishedAt: string;
    readTime: string;
    category: Category;
    tags: Tag[];
    isPinned?: boolean;
}

export const categories: Category[] = [
    {
        id: '1',
        name: 'Development',
        slug: 'development',
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072',
        sortOrder: 'newest'
    },
    {
        id: '2',
        name: 'Design',
        slug: 'design',
        coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=2000',
        sortOrder: 'oldest'
    },
    {
        id: '3',
        name: 'Productivity',
        slug: 'productivity',
        coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072',
        sortOrder: 'newest'
    },
    {
        id: '4',
        name: 'AI',
        slug: 'ai',
        coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070',
        sortOrder: 'newest'
    },
];

export const categoryGroups: CategoryGroup[] = [
    {
        id: '1',
        name: 'Engineering',
        slug: 'engineering',
        categories: [
            { id: '1', name: 'Development', slug: 'development' },
            { id: '4', name: 'AI', slug: 'ai' },
        ]
    },
    {
        id: '2',
        name: 'Lifestyle',
        slug: 'lifestyle',
        categories: [
            { id: '2', name: 'Design', slug: 'design' },
            { id: '3', name: 'Productivity', slug: 'productivity' },
        ]
    }
];

export const tags: Tag[] = [
    { id: '1', name: 'React', slug: 'react' },
    { id: '2', name: 'Next.js', slug: 'nextjs' },
    { id: '3', name: 'TypeScript', slug: 'typescript' },
    { id: '4', name: 'CSS', slug: 'css' },
    { id: '5', name: 'JavaScript', slug: 'javascript' },
    { id: '6', name: 'Web Development', slug: 'web-development' },
    { id: '7', name: 'Coding', slug: 'coding' },
    { id: '8', name: 'Tutorial', slug: 'tutorial' },
    { id: '9', name: 'Node.js', slug: 'nodejs' },
    { id: '10', name: 'GraphQL', slug: 'graphql' },
    { id: '11', name: 'Docker', slug: 'docker' },
    { id: '12', name: 'Kubernetes', slug: 'kubernetes' },
    { id: '13', name: 'AWS', slug: 'aws' },
    { id: '14', name: 'Cloud Computing', slug: 'cloud-computing' },
    { id: '15', name: 'DevOps', slug: 'devops' },
    { id: '16', name: 'Machine Learning', slug: 'machine-learning' },
    { id: '17', name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
    { id: '18', name: 'Data Science', slug: 'data-science' },
    { id: '19', name: 'Python', slug: 'python' },
    { id: '20', name: 'Java', slug: 'java' },
    { id: '21', name: 'C#', slug: 'csharp' },
    { id: '22', name: 'Go', slug: 'go' },
    { id: '23', name: 'Rust', slug: 'rust' },
    { id: '24', name: 'Swift', slug: 'swift' },
    { id: '25', name: 'Kotlin', slug: 'kotlin' },
    { id: '26', name: 'Mobile Development', slug: 'mobile-development' },
    { id: '27', name: 'iOS', slug: 'ios' },
    { id: '28', name: 'Android', slug: 'android' },
    { id: '29', name: 'Flutter', slug: 'flutter' },
    { id: '30', name: 'React Native', slug: 'react-native' },
    { id: '31', name: 'UI Design', slug: 'ui-design' },
    { id: '32', name: 'UX Design', slug: 'ux-design' },
    { id: '33', name: 'Figma', slug: 'figma' },
    { id: '34', name: 'Adobe XD', slug: 'adobe-xd' },
    { id: '35', name: 'Sketch', slug: 'sketch' },
    { id: '36', name: 'Prototyping', slug: 'prototyping' },
    { id: '37', name: 'Wireframing', slug: 'wireframing' },
    { id: '38', name: 'User Research', slug: 'user-research' },
    { id: '39', name: 'Accessibility', slug: 'accessibility' },
    { id: '40', name: 'Performance', slug: 'performance' },
    { id: '41', name: 'SEO', slug: 'seo' },
    { id: '42', name: 'Marketing', slug: 'marketing' },
    { id: '43', name: 'Content Creation', slug: 'content-creation' },
    { id: '44', name: 'Blogging', slug: 'blogging' },
    { id: '45', name: 'Writing', slug: 'writing' },
    { id: '46', name: 'Career Advice', slug: 'career-advice' },
    { id: '47', name: 'Interview Prep', slug: 'interview-prep' },
    { id: '48', name: 'Remote Work', slug: 'remote-work' },
    { id: '49', name: 'Freelancing', slug: 'freelancing' },
    { id: '50', name: 'Entrepreneurship', slug: 'entrepreneurship' },
    { id: '51', name: 'Startups', slug: 'startups' },
    { id: '52', name: 'Product Management', slug: 'product-management' },
    { id: '53', name: 'Agile', slug: 'agile' },
    { id: '54', name: 'Scrum', slug: 'scrum' },
    { id: '55', name: 'Kanban', slug: 'kanban' },
];

const authors: Author[] = [
    {
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        username: 'johndoe',
    },
    {
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        username: 'janesmith',
    },
    {
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        username: 'alexj',
    },
    {
        name: 'Sarah Williams',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        username: 'sarahw',
    },
];

// Helper function to generate posts
const generatePost = (id: number, isPinned: boolean = false): Post => {
    const titles = [
        'Getting Started with Next.js 14',
        'Mastering TypeScript Generics',
        'The Future of AI in Web Development',
        'CSS Grid vs Flexbox',
        '10 Productivity Tips for Developers',
        'Understanding React Server Components',
        'Building Scalable APIs with Node.js',
        'Modern UI Design Principles',
        'Advanced React Patterns',
        'Web Performance Optimization',
        'Introduction to GraphQL',
        'Docker for Beginners',
        'Microservices Architecture',
        'State Management in React',
        'Testing Best Practices',
        'Serverless Functions Explained',
        'Database Design Fundamentals',
        'Authentication and Authorization',
        'Progressive Web Apps',
        'Responsive Design Techniques',
    ];

    const excerpts = [
        'Learn the basics and how to build modern web applications.',
        'Deep dive into advanced concepts and how to use them effectively.',
        'Exploring how modern tools are reshaping the development landscape.',
        'A comprehensive guide to making the right choice for your project.',
        'Boost your productivity with these essential tips and tools.',
        'A guide to understanding and using cutting-edge features.',
        'Best practices for building robust and scalable solutions.',
        'Essential principles every developer should know.',
        'Advanced techniques for building better applications.',
        'Optimize your application for better user experience.',
    ];

    const titleIndex = id % titles.length;
    const excerptIndex = id % excerpts.length;
    const authorIndex = id % authors.length;
    const categoryIndex = id % categories.length;
    // const categoryIndex = 1;

    const date = new Date();
    date.setDate(date.getDate() - id);

    return {
        id: id.toString(),
        title: `${titles[titleIndex]} ${id > 20 ? `Part ${Math.floor(id / 20)}` : ''}`,
        slug: `${titles[titleIndex].toLowerCase().replace(/\s+/g, '-')}-${id}`,
        excerpt: excerpts[excerptIndex],
        content: 'Full content of the post goes here...',
        coverImage: `https://picsum.photos/seed/post${id}/800/400`,
        author: authors[authorIndex],
        publishedAt: date.toISOString().split('T')[0],
        readTime: `${3 + (id % 8)} min read`,
        category: categories[categoryIndex],
        tags: [tags[id % tags.length], tags[(id + 1) % tags.length]],
        isPinned,
    };
};

export const posts: Post[] = [
    // First 5 pinned posts
    generatePost(1, true),
    generatePost(2, true),
    generatePost(3, true),
    generatePost(4, true),
    generatePost(5, true),
    // Generate 55 more regular posts (total 60 posts)
    ...Array.from({ length: 55 }, (_, i) => generatePost(i + 6, false)),
];
