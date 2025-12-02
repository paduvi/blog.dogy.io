import PinnedPosts from '@/components/home/PinnedPosts';
import LatestPosts from '@/components/home/LatestPosts';
import TagCloud from '@/components/common/TagCloud';
import BuyMeACoffee from '@/components/common/BuyMeACoffee';
import { getHashnodeHost, hashnodeApi, mapHashnodePostToPost } from '@/lib/hashnode';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return {
    title: 'Dogy.io - Personal Blog',
    description: 'A personal blog sharing insights on technology, coding, and more.',
    openGraph: {
      title: 'Dogy.io - Personal Blog',
      description: 'A personal blog sharing insights on technology, coding, and more.',
      url: 'https://dogy.io',
      siteName: 'Dogy.io',
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: 'https://dogy.io',
      languages: {
        'en': 'https://dogy.io/en',
        'vi': 'https://dogy.io/vi',
      },
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const host = getHashnodeHost(locale);
  const data = await hashnodeApi.getPosts(host);

  const pinnedPost = data.pinnedPost ? mapHashnodePostToPost(data.pinnedPost) : null;
  const posts = data.posts.edges.map((edge: any) => mapHashnodePostToPost(edge.node));

  // Create list of pinned posts
  // If there's a pinned post from API, use it as the first pinned post
  // Then take the first 2 regular posts to fill up to 3 pinned posts total
  let pinnedPosts: any[] = [];
  let regularPosts: any[] = [];

  if (pinnedPost) {
    pinnedPosts.push({ ...pinnedPost, isPinned: true });
    // Filter out the pinned post from regular posts if it exists there
    regularPosts = posts.filter((p: any) => p.id !== pinnedPost.id);
  } else {
    regularPosts = posts;
  }

  // Take first 2 posts from regular posts to fill pinned section (up to 3 total)
  const additionalPinnedCount = Math.min(3 - pinnedPosts.length, regularPosts.length);
  if (additionalPinnedCount > 0) {
    const additionalPinned = regularPosts.slice(0, additionalPinnedCount).map((p: any) => ({ ...p, isPinned: true }));
    pinnedPosts = [...pinnedPosts, ...additionalPinned];
    regularPosts = regularPosts.slice(additionalPinnedCount);
  }

  const allPosts = [...pinnedPosts, ...regularPosts];

  // Extract tags from posts
  const tagsMap = new Map();
  allPosts.forEach((post: any) => {
    post.tags.forEach((tag: any) => {
      if (!tagsMap.has(tag.slug)) {
        tagsMap.set(tag.slug, tag);
      }
    });
  });
  const tags = Array.from(tagsMap.values());

  // Show first 3 pinned posts in pinned section
  const displayedPinnedPosts = pinnedPosts.slice(0, 3);
  // Remaining pinned posts (after 3rd) go to latest posts (shouldn't happen with current logic)
  const remainingPinnedPosts = pinnedPosts.slice(3);

  // Combine remaining pinned posts with regular latest posts
  const latestPosts = [...remainingPinnedPosts, ...regularPosts];

  return (
    <div className="container py-8">
      <PinnedPosts posts={displayedPinnedPosts} />

      <div className="grid grid-cols-1 lg-grid-cols-12 gap-8">
        <div className="lg-col-span-8">
          <LatestPosts posts={latestPosts} />
        </div>

        <aside className="lg-col-span-4">
          <div className="sticky top-24 flex flex-col gap-6">
            <BuyMeACoffee />
            <TagCloud />
          </div>
        </aside>
      </div>
    </div>
  );
}
