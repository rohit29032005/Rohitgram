import { FeedList } from "@/features/feed/FeedList";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Your Feed</h1>
        <p className="text-muted-foreground">Premium selection from your favorite creators.</p>
      </header>

      {/* Stories-like Creator List (Preview) */}
      <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full bg-black p-[2px]">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} 
                  alt="story" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">creator_{i}</span>
          </div>
        ))}
      </div>

      <FeedList />
    </div>
  );
}
