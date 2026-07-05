// app/api/travel-shorts/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface VerifiedVideo {
  id: string;
  title: string;
  author: string;
}

const VERIFIED_YOUTUBE_VIDEOS: VerifiedVideo[] = [
  
];

const POSITIVE_KEYWORDS = [
  "scenery",
  "landscape",
  "nature",
  "mountain",
  "mountains",
  "waterfall",
  "waterfalls",
  "forest",
  "lake",
  "lakes",
  "river",
  "rivers",
  "ocean",
  "sea",
  "beach",
  "sunrise",
  "sunset",
  "drone",
  "aerial",
  "4k",
  "cinematic",
  "earth",
  "planet",
  "wilderness",
  "national park",
  "valley",
  "fjord",
  "alps",
  "nature sounds",
  "nature view",
  "beautiful places",
  "places on earth",
  "landscape photography",
  "nature cinematic",
  "drone footage",
  "scenic drive",
  "nature relax"
];

const NEGATIVE_KEYWORDS = [
  // humans
  "girl",
  "girls",
  "boy",
  "boys",
  "man",
  "men",
  "woman",
  "women",
  "person",
  "people",
  "human",
  "humans",
  "couple",
  "friend",
  "friends",

  // creators
  "vlog",
  "vlogger",
  "travel vlog",
  "traveling",
  "travelling",
  "my trip",
  "day in my life",

  // influencers
  "outfit",
  "fashion",
  "style",
  "model",
  "posing",
  "photo shoot",

  // faces
  "selfie",
  "portrait",
  "reaction",

  // tourism
  "things to do",
  "travel tips",
  "travel hack",
  "guide",
  "itinerary",

  // food
  "food",
  "restaurant",
  "cafe",
  "street food",
  "eat",
  "eating",

  // transportation
  "flight",
  "airplane",
  "airport",
  "business class",

  // social
  "wife",
  "husband",
  "girlfriend",
  "boyfriend",
  "dating",

  // camera creators
  "shot on iphone",
  "camera test",
  "cinematographer",
  "filmmaker",
  "photographer",

  // shorts bait
  "wait for it",
  "you won't believe",
  "must visit",
  "top 10"
];

const COUNTRY_KEYWORDS = [
  "iceland",
  "norway",
  "switzerland",
  "new zealand",
  "canada",
  "alaska",
  "finland",
  "japan",
  "scotland",
  "bhutan"
];

// Simple deterministic seeded random generator
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Seeded Fisher-Yates shuffle to guarantee deterministic sorting
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let m = shuffled.length, t, i;
  while (m) {
    const r = seededRandom(seed + m);
    i = Math.floor(r * m--);
    t = shuffled[m];
    shuffled[m] = shuffled[i];
    shuffled[i] = t;
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageToken = searchParams.get('pageToken') || '1';
    const page = parseInt(pageToken, 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: 'Invalid pageToken' }, { status: 400 });
    }

    const pageSize = 24;
    
    // Filter the verified videos based on scoring system
    const filteredVideos = VERIFIED_YOUTUBE_VIDEOS.filter(video => {
      const title = video.title.toLowerCase();
      let score = 0;

      for (const word of POSITIVE_KEYWORDS) {
        if (title.includes(word)) score += 3;
      }

      for (const word of COUNTRY_KEYWORDS) {
        if (title.includes(word)) score += 5;
      }

      for (const word of NEGATIVE_KEYWORDS) {
        if (title.includes(word)) score -= 10;
      }

      return score >= 5;
    });

    // Shuffle the filtered video list deterministically using a fixed seed (e.g. 42)
    const shuffledVideos = seededShuffle(filteredVideos, 42);
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageItems = shuffledVideos.slice(startIndex, endIndex);

    // Format the items for frontend consumption
    const videos = pageItems.map((item, idx) => ({
      id: `${item.id}_${page}_${idx}`, // Unique ID for key mapping
      videoId: item.id,
      thumbnail: `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`,
      title: item.title,
      channelTitle: item.author
    }));

    // If there are more items in the pool, set the next page token
    const hasMore = endIndex < shuffledVideos.length;
    const nextPageToken = hasMore ? String(page + 1) : null;

    // Simulate small latency to show loading state skeletons
    await new Promise((resolve) => setTimeout(resolve, 400));

    return NextResponse.json({
      videos,
      nextPageToken
    });
  } catch (error) {
    console.error('Failed to fetch travel shorts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
