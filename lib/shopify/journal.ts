// lib/shopify/journal.ts
import { ShopifyStorefrontClient } from './client';
import { getEnvironment } from '@/utils/env';

export interface ShopifyArticle {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  contentHtml: string;
  publishedAt: string;
  authorV2: {
    name: string;
  };
  image: {
    url: string;
    altText?: string;
  };
  tags: string[];
}

export const MOCK_ARTICLES: ShopifyArticle[] = [
  {
    id: "mock_art_1",
    title: "Wanderlust in Kyoto: A Sanctuary of Moss & Bamboo",
    handle: "wanderlust-in-kyoto",
    excerpt: "Discovering quietness in the ancient streets of Japan's cultural capital, where temples sit nestled between towering stalks of bamboo.",
    contentHtml: `
      <p class="lead text-lg font-sans text-black/80 leading-relaxed mb-6">There is a specific kind of quietness that belongs only to Kyoto in the early morning. Before the city wakes, before the tourists arrive at Arashiyama, the bamboo stalks stand like silent sentinels under a pale blue sky. The wind moves through them, producing a dry, rustling hiss—a sound known in Japanese as <em>sasa-no-ha</em>.</p>
      
      <h2 class="text-2xl font-serif font-normal text-black mt-8 mb-4">Finding Sanctuary in the Stone</h2>
      <p class="font-sans text-black/70 leading-relaxed mb-6">Kyoto is a city built on details. In the moss gardens of Saihō-ji, over 120 varieties of moss carpet the ground beneath maple trees, creating an organic, velvet world that feels completely insulated from the modern century. Travelers come here not to rush through checklists, but to slow down, match their breathing to the forest, and observe the patterns of shadow and light.</p>
      
      <blockquote class="border-l-4 border-[#7A5C3E] pl-6 my-8 italic font-serif text-xl text-black/80">
        "To travel is to discover that everyone is wrong about other countries." — Aldous Huxley
      </blockquote>
      
      <h2 class="text-2xl font-serif font-normal text-black mt-8 mb-4">A Guide to the Perfect Morning Walk</h2>
      <ul class="list-disc pl-6 mb-6 space-y-2 font-sans text-black/70">
        <li><strong>Start Early:</strong> Arrive at the bamboo groves by 6:30 AM to experience the natural soundscape without crowds.</li>
        <li><strong>Visit Gio-ji:</strong> A tiny temple nestled in a moss forest, offering the most serene tea-drinking experience in Western Kyoto.</li>
        <li><strong>Respect the Space:</strong> Remember that these temples are active places of worship and reflection.</li>
      </ul>
      
      <p class="font-sans text-black/70 leading-relaxed">As the sun rises higher, the emerald light filtering through the canopy turns gold. You leave the grove not with a gallery of photos, but with a deeper sense of space, silence, and wanderlust.</p>
    `,
    publishedAt: "2026-06-12T08:00:00Z",
    authorV2: { name: "Elena Rostova" },
    image: {
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      altText: "Kyoto bamboo path"
    },
    tags: ["Guides", "Japan", "Slow Travel"]
  },
  {
    id: "mock_art_2",
    title: "The Art of Slow Travel: Hiking Through the Swiss Alps",
    handle: "art-of-slow-travel-swiss-alps",
    excerpt: "Trading high-speed transit for dusty trails and alpine meadows. An editorial exploration of the benefits of slow travel.",
    contentHtml: `
      <p class="lead text-lg font-sans text-black/80 leading-relaxed mb-6">In our hyper-connected world, speed is often treated as the ultimate virtue. We fly across continents in hours, snap photos of monuments from train windows, and rush through cities. But what do we lose when we travel so fast? In the high alpine valleys of Switzerland, the answer becomes clear: we lose the journey itself.</p>
      
      <h2 class="text-2xl font-serif font-normal text-black mt-8 mb-4">Trading Trains for Trails</h2>
      <p class="font-sans text-black/70 leading-relaxed mb-6">Slow travel is a philosophy, a conscious decision to reject the rushed itinerary in favor of deep immersion. In the Bernese Oberland, hiking from village to village allows you to experience the landscape in a completely tactile way. You smell the wild thyme growing in the meadows, hear the distant, hollow ring of cowbells echoing off granite cliffs, and feel the cold spray of glacial waterfalls on your face.</p>
      
      <h2 class="text-2xl font-serif font-normal text-black mt-8 mb-4">Why Slowing Down Matters</h2>
      <p class="font-sans text-black/70 leading-relaxed mb-6">When you walk, the scale of the world changes. A mountain range isn't a backdrop anymore; it's a physical challenge that you meet step by step. You begin to appreciate the micro-seasons of the valleys, the changing textures of the soil, and the warm hospitality of family-run refuges where dinner is made from cheese produced on the slopes outside.</p>
      
      <p class="font-sans text-black/70 leading-relaxed">By the time you reach your destination, you haven't just visited Switzerland—you have let its landscape reshape the rhythm of your thoughts.</p>
    `,
    publishedAt: "2026-06-08T09:30:00Z",
    authorV2: { name: "Marc Dubois" },
    image: {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      altText: "Scenic Swiss Alps hike"
    },
    tags: ["Perspectives", "Switzerland", "Hiking"]
  },
  {
    id: "mock_art_3",
    title: "Hidden Canyons and Red Rocks: A Weekend in Utah",
    handle: "hidden-canyons-red-rocks-utah",
    excerpt: "A visual guide to the slot canyons and sandstone arches of southern Utah, a desert oasis for the modern adventurer.",
    contentHtml: `
      <p class="lead text-lg font-sans text-black/80 leading-relaxed mb-6">The desert is not empty; it is merely patient. In southern Utah, millions of years of water and wind have carved the red sandstone into labyrinthine slot canyons, monumental arches, and towering mesas that glow like embers in the setting sun. For those willing to venture off the paved roads, it represents one of the most raw landscapes on earth.</p>
      
      <h2 class="text-2xl font-serif font-normal text-black mt-8 mb-4">Descending into the Sandstone</h2>
      <p class="font-sans text-black/70 leading-relaxed mb-6">Entering a slot canyon is like stepping inside a sculpture. The walls twist and curve in organic waves, narrowing until you can touch both sides simultaneously. The light filters down from a thin slit of sky far above, reflecting off the orange walls to create a warm, ambient glow that feels almost spiritual. Here, the silence is heavy, broken only by the crunch of sand underfoot.</p>
      
      <h2 class="text-2xl font-serif font-normal text-black mt-8 mb-4">Desert Backpacking Essentials</h2>
      <ol class="list-decimal pl-6 mb-6 space-y-2 font-sans text-black/70">
        <li><strong>Water is Life:</strong> Always carry at least one gallon of water per person per day. Water sources in slot canyons are rare and often contaminated.</li>
        <li><strong>Watch the Weather:</strong> Flash floods are a constant hazard. A storm fifty miles away can send a wall of water roaring through a dry canyon in minutes.</li>
        <li><strong>Leave No Trace:</strong> The desert ecosystem is fragile. Pack out all trash, stay on established trails, and avoid stepping on biological soil crusts.</li>
      </ol>
      
      <p class="font-sans text-black/70 leading-relaxed">As night falls, the desert sky opens up into a dazzling dome of stars, far from the light pollution of any city. Under the shadow of ancient red rock cliffs, you realize that the most beautiful journeys are often the most rugged ones.</p>
    `,
    publishedAt: "2026-06-04T14:15:00Z",
    authorV2: { name: "Sarah Jenkins" },
    image: {
      url: "https://images.unsplash.com/photo-1472214222541-d510753a8707?auto=format&fit=crop&w=1200&q=80",
      altText: "Utah red rock canyons"
    },
    tags: ["Destinations", "USA", "Adventure"]
  },
  {
    id: "mock_art_4",
    title: "Chasing Golden Light: A Guide to the Amalfi Coast",
    handle: "chasing-golden-light-amalfi-coast",
    excerpt: "Sailing under dramatic cliffs and wandering colorful towns. A cinematic itinerary for the Italian shoreline.",
    contentHtml: `
      <p class="lead text-lg font-sans text-black/80 leading-relaxed mb-6">To understand Italy's timeless charm, one must travel to the Amalfi Coast. Here, pastel-colored houses hang suspended between steep cliffs and the cobalt waters of the Tyrrhenian Sea, catching the late afternoon sun like jewels.</p>
      
      <h2 class="text-2xl font-serif font-normal text-black mt-8 mb-4">The Clifftop Villages</h2>
      <p class="font-sans text-black/70 leading-relaxed mb-6">From Positano to Ravello, each village has its own personality. Positano is a vertical maze of steep stairs and bougainvillea-shaded terraces, while Ravello, perched high above the coast, offers peaceful gardens and historic villas with views that stretch to the horizon. Wandering through these lanes, you discover artisan workshops, tiny lemon groves, and family-owned cafes serving fresh espresso and sfogliatella.</p>
      
      <blockquote class="border-l-4 border-[#7A5C3E] pl-6 my-8 italic font-serif text-xl text-black/80">
        "Positano bites deep. It is a dream place that isn’t quite real when you are there and becomes beckoningly real after you have gone." — John Steinbeck
      </blockquote>
      
      <h2 class="text-2xl font-serif font-normal text-black mt-8 mb-4">Sailing into the Sunset</h2>
      <p class="font-sans text-black/70 leading-relaxed">The best way to see the Amalfi Coast is from the water. Chartering a wooden gozzo boat at golden hour allows you to look up at the towering cliffs and swim in hidden sea grottoes. As the sun dips behind the mountains, the villages light up one by one, reflecting in the water like stars, confirming that the journey is complete.</p>
    `,
    publishedAt: "2026-05-30T17:00:00Z",
    authorV2: { name: "Luca Moretti" },
    image: {
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      altText: "Amalfi Coast, Italy"
    },
    tags: ["Destinations", "Italy", "Summer"]
  }
];

export function getStorefrontClient() {
  const env = getEnvironment();
  const shopUrl = env.shopUrl || 'cstjac-4d.myshopify.com';
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '6cec455322cd9c4cfb7ead74eda57e4a';
  return new ShopifyStorefrontClient(shopUrl, storefrontToken);
}

export async function getBlogArticles(first = 10, after?: string, cacheOptions?: { cache?: RequestCache; next?: { revalidate?: number | false } }) {
  try {
    const client = getStorefrontClient();
    const query = `
      query GetBlogArticles($first: Int!, $after: String) {
        blog(handle: "news") {
          id
          title
          handle
          articles(first: $first, after: $after) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                id
                title
                handle
                excerpt
                contentHtml
                publishedAt
                authorV2 {
                  name
                }
                image {
                  url
                  altText
                }
                tags
              }
            }
          }
        }
      }
    `;
    const data = await client.request(query, { first, after }, 'storefront', cacheOptions);
    const articles = data?.blog?.articles?.edges?.map((edge: any) => edge.node) || [];
    const pageInfo = data?.blog?.articles?.pageInfo || { hasNextPage: false, endCursor: null };

    // Fallback if empty array returned from Shopify
    if (articles.length === 0) {
      return {
        articles: MOCK_ARTICLES.slice(0, first),
        pageInfo: {
          hasNextPage: false,
          endCursor: null
        }
      };
    }

    return { articles, pageInfo };
  } catch (err) {
    console.error("Failed to fetch blog articles, falling back to mock:", err);
    return {
      articles: MOCK_ARTICLES.slice(0, first),
      pageInfo: {
        hasNextPage: false,
        endCursor: null
      }
    };
  }
}

export async function getArticleByHandle(handle: string) {
  try {
    const mock = MOCK_ARTICLES.find(a => a.handle === handle);

    const client = getStorefrontClient();
    const query = `
      query GetArticleByHandle($handle: String!) {
        blog(handle: "news") {
          articleByHandle(handle: $handle) {
            id
            title
            handle
            contentHtml
            excerpt
            publishedAt
            authorV2 {
              name
            }
            image {
              url
              altText
            }
            tags
          }
        }
      }
    `;
    const data = await client.request(query, { handle }, 'storefront', { cache: 'no-store' });
    const article = data?.blog?.articleByHandle;

    if (article) {
      return article;
    }

    if (mock) return mock;
    return null;
  } catch (err) {
    console.error(`Failed to fetch article with handle ${handle}, falling back to mock:`, err);
    const mock = MOCK_ARTICLES.find(a => a.handle === handle);
    return mock || null;
  }
}

export function getReadingTime(html: string): number {
  const text = (html || '').replace(/<[^>]*>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

