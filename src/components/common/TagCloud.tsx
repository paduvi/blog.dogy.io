import Link from 'next/link';
import { Tag } from '@/data/mockData';

interface TagCloudProps {
    tags: Tag[];
}

export default function TagCloud({ tags }: TagCloudProps) {
    return (
        <section className="bg-white rounded-xl p-6 border h-fit">
            <h3 className="font-bold text-lg mb-4">Discover more</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Link
                        key={tag.id}
                        href={`/tag/${tag.slug}`}
                        className="badge bg-blue-50 text-blue-700 hover-bg-blue-100 transition-colors"
                    >
                        #{tag.name}
                    </Link>
                ))}
            </div>
        </section>
    );
}
