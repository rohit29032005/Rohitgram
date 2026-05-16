import { FeedList } from "@/features/feed/FeedList";

export default function Home() {
  return (
    <div className="h-screen w-full overflow-hidden bg-black">
      <FeedList />
    </div>
  );
}
