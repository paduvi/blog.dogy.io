import PinnedPosts from '@/components/home/PinnedPosts';
import LatestPosts from '@/components/home/LatestPosts';
import TagCloud from '@/components/common/TagCloud';
import BuyMeACoffee from '@/components/common/BuyMeACoffee';
import { posts, tags } from '@/data/mockData';

export default function Home() {
  const pinnedPosts = posts.filter(post => post.isPinned);

  // Show first 3 pinned posts in pinned section
  const displayedPinnedPosts = pinnedPosts.slice(0, 3);
  // Remaining pinned posts (after 3rd) go to latest posts
  const remainingPinnedPosts = pinnedPosts.slice(3);

  const regularLatestPosts = posts.filter(post => !post.isPinned);
  // Combine remaining pinned posts with regular latest posts
  const latestPosts = [...remainingPinnedPosts, ...regularLatestPosts];

  return (
    <div className="container py-8">
      <PinnedPosts posts={displayedPinnedPosts} />

      <div className="grid grid-cols-1 lg_grid-cols-12 gap-8">
        <div className="lg_col-span-8">
          <LatestPosts posts={latestPosts} />
        </div>

        <aside className="lg_col-span-4">
          <div className="sticky top-24 flex flex-col gap-6">
            <BuyMeACoffee />
            <TagCloud tags={tags} />
          </div>
        </aside>
      </div>
    </div>
  );
}
