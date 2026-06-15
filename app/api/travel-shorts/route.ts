// app/api/travel-shorts/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface VerifiedVideo {
  id: string;
  title: string;
  author: string;
}

const VERIFIED_YOUTUBE_VIDEOS: VerifiedVideo[] = [
  { id: "tHCEFssGPxQ", title: "LADAKH on SOCIAL MEDIA vs REALITY😱 #adventuretravel #shortvideo", author: "The Unknown Artist" },
  { id: "8g_fxFoptOk", title: "Train food🚃 #food #foodie #foodblogger #train #trainfood #india #shorts #youtube #indian #minivlog", author: "Adrija Roy" },
  { id: "47hGCsuHaxc", title: "Bag packing for Manali #shorts #ashortaday #relatable #shoppinghaul #Manali #fyp #explore #vacation", author: "LifeInTheLoop " },
  { id: "MQ-Fq1fsd-k", title: "must have for travel 🧳 ( can hold up to 240 pounds) #travel #viral #amazonfinds #shorts #asmrsounds", author: "The Hayeks" },
  { id: "Zz0IPY2I-ak", title: "3 must have flight gadgets! #shorts #youtubeshorts", author: "Shreemani Tripathi" },
  { id: "s0dXpgK8-Qo", title: "CHINA TRAVEL DAY - UK To Chengdu with Air China", author: "travelshorts" },
  { id: "A6msCWYhUQw", title: "Have you tried these Travel Products !? #travelshorts #tanyakhanijowshorts", author: "Tanya Khanijow" },
  { id: "hJJSFyhaWB4", title: "Top Beautiful Places in 6 Amazing Destinations 🌍😍 #travel #shorts", author: "Xzan Bzz" },
  { id: "VoFnvxvqWUI", title: "Thailand Vibes 😍🇹🇭 India to Thailand #shorts", author: "Chattambees" },
  { id: "ZCreWsPX3q4", title: "Dubai is unbelievable! 😰 (BUS ME DANGER)  #shorts #vlogs", author: "Real Thugesh " },
  { id: "pgcuGGlFx3Y", title: "Sabarimala Holy Pamba River | Swamiye Saranam Ayyappa Pilgrimage #god #travel #shorts #thelastcholas", author: "TheLastCholas" },
  { id: "M3xnyum4YGs", title: "Last One Is SO Smart 😭 #travelhacks #travelling #travel #amazon #shorts", author: "Mik Zenon" },
  { id: "WT4ts3IVqWw", title: "This suite is a dream✨ #greece #travel #shorts", author: "Elite Stays" },
  { id: "YkOxEwrOQMg", title: "Beautiful place #travel #shorts #camping #nature", author: "Explore And Eat" },
  { id: "DQYc93f7FJw", title: "Best places to visit in Italy #shorts #travel", author: "Travel Pleasure" },
  { id: "mKSwfJZbLXU", title: "Buss pahadu pai ghoomna hai😍🏔️🍃 #viralshorts #travel #shorts #viralyoutubeshorts #trendingshorts", author: "Huzzain" },
  { id: "yzyZCBkMVlk", title: "Relatable? #viral #shortvideo #trending #trendingshorts #travel #shorts", author: "Just neha6" },
  { id: "WNQJlRHLJFs", title: "#672 I ate SALSA in TRAIN", author: "therainbowgirl" },
  { id: "PSlChNv65EU", title: "Most beautiful place On Earth 🌎#explore #travel #shorts #travelvlog", author: "NATUREXPLORA CINEMA" },
  { id: "PkaVuvQ6xPs", title: "Try this creative transition video idea on your next trip📱🔥 #travel #shorts #transition #creative", author: "Mitesh Patil" },
  { id: "CcOFCg6rQtY", title: "New Country With My Husband 🇺🇸❤️ #shorts #couple #travel", author: "Manasi Mau" },
  { id: "UceymAMsACo", title: "I finally visited my Dream Destination in Europe - Croatia   | #schengen #europe #travel #shorts", author: "Richi Shah" },
  { id: "fcNJ_2Ui62Q", title: "Best Travel Accessories 🤩🤩 #telugu  #viral #travel #trending #shorts", author: "SimpleGhar Telugu" },
  { id: "0E07Rl-naGU", title: "Packing for Macao Trip 😱 #crafteraditi #shorts #macao #travel  #macaotrip #packing @CrafterAditi", author: "Crafter Aditi" },
  { id: "eOzZ61PSMeY", title: "Trying *ASR Shatabadi *ka Khana For the first time | train food ​​⁠😱@Param_aedy#shorts #shortsfeed", author: "Param Aedy" },
  { id: "7K53pLX8tNk", title: "Places on Earth That Don't Feel Real 🌎💫#shorts #travel #trending #viral #explore #usa #dubai #turky", author: "Earth View 4K " },
  { id: "C7Uy0sCUyzk", title: "Chicago City Road View 2025 | Stunning Urban Drive in 4K. #chicago #shorts", author: "Amazing World" },
  { id: "AoaS60l1Rg4", title: "📍Dubai 🇦🇪✌🏻#dubai #burjkhalifa #shortsfeed #shorts #fyp #trending #viralshorts #views #travel", author: "Travel finds" },
  { id: "diNatbV8PEo", title: "Maharashtra Monsoon Train Ride. #travelshorts #indianrailways #monsoon", author: "Destinium With Amit " },
  { id: "btXTWLCwMmE", title: "Chongqing City In China 🇨🇳 4k Shorts #chongqing #shorts", author: "world tour " },
  { id: "PB2qDNtngM0", title: "Marine  drive Mumbai ❤️ #beach #travel #shorts #trending #ytshorts", author: "Travels Vloger" },
  { id: "o9LPMD2uU28", title: "This Is Why Scotland Is Breathtaking 🇬🇧✨#shorts #scotland #traveltheworld", author: "Travel The World" },
  { id: "w6KKqh-K8TA", title: "Luxury Cruise #travel #satisfying #shorts #trending #ship", author: "4K Trends" },
  { id: "wU5Y4X2M5dk", title: "Nature's Love is Pure Magic ✨❤️✨”#nature #cinematic #shorts #earth #travel #4k #viralshorts#amazing", author: "Itznatureeditz" },
  { id: "g-8k4O1FHBw", title: "Dublin street #ireland #travel #street #walk #shorts #drop a subscription for ireland❤️", author: "Wanderlust tales" },
  { id: "FcbVxagevVY", title: "𝐄𝐬𝐜𝐚𝐩𝐞 𝐑𝐞𝐚𝐥𝐢𝐭𝐲 🏔️ 𝟒𝐊 𝐂𝐢𝐧𝐞𝐦𝐚𝐭𝐢𝐜 𝐉𝐨𝐮𝐫𝐧𝐞𝐲 #shorts #wildlife #nature", author: "𝙈𝘼𝙃𝘼𝙎𝙄𝙉 𝙎𝙆 " },
  { id: "0RrUngmV5yk", title: "Bora Bora: A Hidden Tropical Paradise in French Polynesia - Travel #shorts", author: "Nice Trip" },
  { id: "D_JN7FGTNKI", title: "Kasol Himachal Pradesh #shorts #travel #mountains", author: "Traveling Eyesight" },
  { id: "xXuxPLDkVmQ", title: "Is this the best travel camera?😍 (INSTA360 X5)", author: "Luuk | Travel is Happiness" },
  { id: "9CXLHeZLLbM", title: "🌄 Best Aerial View of Darjeeling | Stunning Drone Short 4K|| #Darjeeling #DroneView #viral #shorts", author: "Explore Shreepal singh vlog" },
  { id: "1Loy8edh9IA", title: "Darjeeling vibes #darjeeling #shortvideo #hindi #bengali #vibes #reels #video #nature", author: "Enjamul lifestyles" },
  { id: "G9NRzrx7m4U", title: "switzerland 4k | switzerland 4k video | switzerland", author: "Smart info" },
  { id: "lGAupfP-qfc", title: "Northsikkim #travel #northsikkim #sikkim #mountains #sikkimtour #sikkimtrip #sikkimtourplan #visits", author: "Sikkimwithsam" },
  { id: "-zTk4XdObDU", title: "This is Thailand?! 🤯 Paradise in #8k   #shorts   #4k  #hd60x  #dolbyvision  #travel", author: "8K Vista Vision" },
  { id: "9YydvaWQqqc", title: "📍switzerland summer in 4k 🌿 | nature's paradise 🏔️", author: "Soul of Nature Shorts" },
  { id: "iuhq2Hq8MKc", title: "iPhone Vs GoPro, which is better for travel content creation? #travelshorts #TanyaKhanijowshorts", author: "Tanya Khanijow" },
  { id: "h9xJ3J_Hecc", title: "📍beautiful places 😍 on earth 🌎”#nature #cinematic #shorts #earth #travel #4k #viralshorts#amazing", author: "Itznatureeditz" },
  { id: "DFKt4MPhLK4", title: "INCREDIBLE Maldives. Is this REAL? #shorts #maldives Cc: ishotmaldives", author: "Maldives Arena" },
  { id: "1_TPZAixlyQ", title: "Vishwanath travels new sleeper luxury bus || bus chessis || #shorts #tranding #4k #travel", author: "travels hub" },
  { id: "RpNi6qCB488", title: "Nature's Most Beautiful Migration Journey 🦢✨#4k #wildlife #birds #nature #shorts #viral", author: "Wild Birds TV Official" },
  { id: "vz9LAQa5Fcw", title: "“Nature’s Most Beautiful Flowers 🌸 | 4K Ultra HD” #shorts \"", author: "Beautiful Natural flowers 773" },
  { id: "NJmz3f9FOD4", title: "Heaven isn't a place, it's a view🌿⛰️🌎#nature #beautiful #travel #4k #cinematic #shorts", author: "NatureFrame" },
  { id: "sOxloXyOAKA", title: "Nature View Cristal beach Beuti of nature 4k View shorts video 📸😍", author: "Love The Nature " },
  { id: "oKwq9yhOa-I", title: "FLYING OVER BARBUDA (4K UHD) – Soothing Music Along With Beautiful Nature Video - 4K Video ULTRA HD", author: "Enjoy Relaxation" },
  { id: "KLuTLF3x9sA", title: "Norway 4K • Scenic Relaxation Film with Peaceful Relaxing Music and Nature Video Ultra HD", author: "Relaxation Film" },
  { id: "AKeUssuu3Is", title: "10 Hours Fantastic Views of Nature 4K with Relaxation Music", author: "PRIMAL EARTH " },
  { id: "FvssOT4EIU8", title: "Switzerland 🇨🇭 #nature #foryou #shortsfeed #explore #mountains #suisse #switzerland #viral #shorts", author: "Wonderland Suisse 🇨🇭" },
  { id: "lRWx9e29yJ8", title: "Beautiful Switzerland 4k Short video || Titanic Song #switzerland #nature", author: "SwissVista " },
  { id: "e9VRAC_JHdA", title: "Beautiful places 💚 🌍 #beautiful #place #travel #nature #switzerland #4k #shorts #trending", author: "My Dreams" },
  { id: "Dsvmzg9nMkU", title: "Nature view | Summer rain, Rain weather | Nature 4k videos | short video #village #foryou #ai", author: "Nature Trip" },
  { id: "xQknAlRnaM4", title: "Nature view | Summer rain, Rain weather | Nature 4k videos | short video", author: "Nature shorts" },
  { id: "UPnzC6-hdMc", title: "Monsoon Magic in Meghalaya: Exploring the Wettest Place on Earth 🌧️ | 4K Visual Journey #advanture", author: "Eklavya Travels" },
  { id: "KLIzmqIapaU", title: "Nature 4k ultra HD video | Vertical video 4k nature", author: "Amazing Videos" },
  { id: "uDOLjJ3DDQs", title: "Rainy Forest Soundscape 4K Nature Video: sleep, meditation, study, soothing, relaxation, anxiety", author: "Serene Atmosphere" },
  { id: "5ztx1MhFQu8", title: "4K Nature Edit", author: "Chase 21" },
  { id: "XvIreonihwc", title: "🌳🌿☄️| Nature 4k shorts video #nature #shorts #youtubeshorts #aesthetic", author: "Noor Vibes" },
  { id: "VwUp3pOzHqs", title: "Amazing Nature Beauty 🌿 | Peaceful Scenery 4K 😍Relaxing Nature Video #shorts #ytshorts #naturevideo", author: "EDX_music " },
  { id: "85ugTXSEkk4", title: "The Most Beautiful Places In China 4K...🇨🇳 #travel #china #explore #relaxing #nature", author: "4K WORLD TOUR" },
  { id: "iSq9wun25F4", title: "Perfect Dive, Perfect Catch 🦅🐟#4k #wildlife #birds #nature #shorts #viral", author: "Wild Birds TV Official" },
  { id: "Xjm34qwrZGI", title: "Bird Songs - Birds Singing in the Forest - Nature Relaxation Video in 4K Ultra HD", author: "Nature's symphony" },
  { id: "kLXZ5rwBjy0", title: "🌍 Places That Don't Feel Real 😍✨  #shortsviral #4k #nature #travel", author: "ASLOWD7" },
  { id: "EwldlI4PTzQ", title: "We are running the nature😣✨#aesthetic #wildlife #4kvideo #short viral", author: "PEACE WITH NATURE" },
  { id: "O5hHMkA-FhI", title: "Earth without Noice🌫✨️ | A Cinematic Vibes of Nature #nature #shorts", author: "Shiva_editz " },
  { id: "dyy_8c-__7c", title: "Nature Videos 4k #short", author: "4k Nature & Relaxing music 242" },
  { id: "WNCl-69POro", title: "Beautiful Nature Video in 4K (Ultra HD) - Autumn River Sounds - 5 Hours Long", author: "4K Relaxation Channel" },
  { id: "w6uX9jamcwQ", title: "Free Waterfall 4k Videoclip | Nature Videos | Youstock", author: "Youstock" },
  { id: "xEvuokjFftc", title: "Switzerland 4K 🦋 A Fairytale Carved by Nature | Lakes, Alps & Hidden Villages", author: "Scenic World 4K" },
  { id: "p04JtTCQc3o", title: "Top Beautiful Places in 6 Amazing Destinations 🌍😍 #travel #shorts", author: "Xzan Bzz" },
  { id: "3QWB73Idg7U", title: "These Places Don't Look Real! 🌍 #love #nature #beautiful #shorts #adventure", author: "Paradise On Earth" },
  { id: "wFrCkz3IcuU", title: "📍Most Beautiful Places In The World🌍#nature #travel #adventure #explore #shorts #viral", author: "Nature Vision " },
  { id: "qgXCHxgZ8SI", title: "beautiful places in the world 🌍😍 #shorts #trendingshorts #viralshorts #travel #beautiful #new", author: "Beautiful places " },
  { id: "0Yl6IOYJtL0", title: "📍Most Beautiful Places On Earth 🌎🤗😍#shorts #nature #travel #adventure", author: "Wanderora" },
  { id: "5-Xu3Iy3kmw", title: "Part:15 ✨Most Beautiful Places In The World🌎 #india #shorts #short", author: "Learn Empire Uk" },
  { id: "BG1Fww8wDDI", title: "Most beautiful 💞 places in the world🌎 #travel #nature #shortsfeed #shorts #viralreels #youtube #love", author: "world nature" },
  { id: "tcFUYwy5wdE", title: "Most beautiful places in the Earth|nature love #shorts​ #travel​ #nature​ #naturelovers​ #viral​", author: "Travel Tonic" },
  { id: "Vr0lxmIYyTs", title: "The Most Beautiful Places On Earth😍 | Ultimate Bucket List Destinations For 2026! #shorts #trending", author: "SkyLine World" },
  { id: "Tz_Zl1fsiPE", title: "Most beautiful places in the world 🌎😱#beautifulworld #worldexplorer #earth #shorts", author: "NatureX-k" },
  { id: "HQn0sDO_yr4", title: "Beautiful places in different countries of the world 🌎🤯 #adventure #nature #love #travel #shorts", author: "Hudson Creation" },
  { id: "GdLCeynvEdk", title: "Most Beautiful Place in the 🌎 #trending #love #explore #shorts #travel #nature #shortsfeed #tiktok", author: "Nature Beauty" },
  { id: "6e5xhivGMxU", title: "Most beautiful places in the world #travel #adventure", author: "iSmartOli" },
  { id: "qqU9AgS7qZ0", title: "Most Beautiful Places in Japan 🇯🇵 | #shorts #travel #explore #nature #viral #adventure", author: "Wonderland Network" },
  { id: "fACwnYswQmo", title: "Most beautiful places on Earth🌎❣️#shorts #travel #beautiful #trending #nature #scenery", author: "swapan_4.o" },
  { id: "lXO_fDZrQ3E", title: "Most beautiful places on Earth #world #nature #ytshorts #shortvideo #shorts", author: " daily Nature Views " },
  { id: "bsLUPPZBEwQ", title: "🤯 Top 3 Most Beautiful Places You Must See 🌍✨ #shorts", author: "VYROX 143" },
  { id: "P5Aae4Bhg2Q", title: "Dangerous roads #traveling#beautiful places#viral#youtubeshorts#shorts", author: "UH travel" },
  { id: "LKnB0Os3Rzk", title: "📍Most beautiful places on earth🩷🌎// #beautiful #beautifuldestinations #beautifulplaces#travel#nature", author: "wonderscyz" },
  { id: "Yi4TX8gumxs", title: "Top 3 Most Beautiful Places On Earth #shortsfeed #shorts #incredibleindia #nature", author: "Scene Sculptor 68" },
  { id: "OhBygmfdBS0", title: "This Place Doesn't Feel Real... 😱 #shorts #travel#amazing #beautiful", author: "natural short " },
  { id: "Pem24IZeGKc", title: "Most beautiful places on earth #nature #naturelovers #short #adventure #travel #explore", author: "Natureexplore05" },
  { id: "jQHKFm7vWlw", title: "Amazing Places In The World 😍🌎 #place #nature #explore #travel", author: "Incredible_World 😮🌏" },
  { id: "mXm0m3U8yLU", title: "The BEST women’s hiking shorts. #hiking #grwm #ootd", author: "Andrea Ference" },
  { id: "ieJtf_2OZiU", title: "What To Wear Backpacking CHEAP! #shorts", author: "MyLifeOutdoors" },
  { id: "On87dvXmICw", title: "everything I packed for a solo backpacking trip in Yosemite #backpackinggear #hikinggear #camping", author: "The Adventure Addicts | Zoe & Kelby" },
  { id: "BdPt9p0piBw", title: "What to wear for summer backpacking - fit check #hiking #outdoorgearreview #backpacking #outdoors", author: "Skye Stoury & Garrett Arnold" },
  { id: "0jZzKCJxvb4", title: "Pack my bag with me for school trip🎒🩷 #shorts #whatsinmybag #packwithme", author: "sahithya sudeesh vlogs" },
  { id: "K6iocUEnJgE", title: "Why I'm Done With Hiking Shorts!!", author: "Whatever It May Be" },
  { id: "7uNF47Mxq0w", title: "My Top Five Pairs of Hiking Shorts: Hike Farther Feel Fresher", author: "BackpackingTV" },
  { id: "TVyVB4rnU7M", title: "Zpacks Trail Cool Hiking Shorts | Full Review | Backpacking and Hiking Shorts", author: "Backpacking Grub" },
  { id: "OwmmuNkW2OA", title: "Hiking Shorts Recs: 5’9” Curvy, Athletic Body Type👇🏻", author: "Quin Gable" },
  { id: "_sup47uR25w", title: "What Would A.I. Take Backpacking? #shorts", author: "MyLifeOutdoors" },
  { id: "Wq15Rf_mhcs", title: "My backpacking gear for the Pacific Crest Trail. Go to my channel for the full video!", author: "jess ferri" },
  { id: "y2_oyUz5rSk", title: "Comparing Patagonia Baggies shorts 🩳 #hiking #hikinglife #hikinggear #hikingadventures", author: "Jacey Out West" },
  { id: "xUXw7o8uMRA", title: "Useful picnic gadgets! #shorts", author: "Shreemani Tripathi" },
  { id: "7y0GbnzVx5M", title: "Aren't you TIRED OF SMALL BAGS? #shorts", author: "Brevitē" },
  { id: "eC7dANjESVE", title: "Pack With Me For Our Girls Trip 🩷✨🌸 #youtubeshorts #shorts #packwithme #packing", author: "Yashita Rai" },
  { id: "R-vjHiTUUSg", title: "HIKING CLOTHES + WHAT TO WEAR HIKING? | OUTFITS for HIKING #shorts #hiking #traveltips", author: "Miss Anna" },
  { id: "IKj9r2XVzEo", title: "My New Favorite Hiking Shorts", author: "The Trek" },
  { id: "jNsnwcpMIXQ", title: "more info in pinned comment! #solofemaletraveler #backpacking", author: "Kayli King" },
  { id: "7gB-0JYR1ng", title: "Everything I’ve packed for 3 months backpacking #shorts #backpacking #travel", author: "Lia Sophie" },
  { id: "GNGMeLEaA3A", title: "THE CULT OF BACKPACKING #shorts", author: "AS THE CROW FLIES HIKING" },
  { id: "xnoWjP6tpoU", title: "FULL GEAR LIST for coastal backpacking #shorts", author: "Krysta Norwick" },
  { id: "EB302PVnRvA", title: "Everything You Need to Go Ultralight Backpacking #shorts", author: "MyLifeOutdoors" },
  { id: "wvchDnXLg24", title: "Backpacking Gear Review: The Basics #longdistancehiking #backpacking #shorts #gearreview", author: "Elise Ott" },
  { id: "Arwotu37aSM", title: "Dich:Survival Hack: Clean Your Gear in Just 5 Minutes While Backpacking#UsÙeulTip #Camping#survival", author: "Baby Cute" },
  { id: "PiK4E3zuqNY", title: "This Layering Mistake is Making You Cold in Winter Hiking #shorts #hiking #outdoors", author: "Oscar Hikes" },
  { id: "YoXqBuYs45w", title: "Best hiking pants: Fjallraven Keb Review. Bought them myself, not sp0nzrd ☺️", author: "Madison Clysdale" },
  { id: "klReZulzhH8", title: "Hammock Camping's Cold Secret: The Hammock Freeze! #shorts", author: "Speir Outdoors" },
  { id: "s0A1uectljw", title: "New Backpack! #shorts", author: "Lafloca and mimi" },
  { id: "m5ajOw4Kq_A", title: "Patagonia strider pro 5 shorts review | The only backpacking shorts you'll wanna wear", author: "Russ Hepton Hikes" },
  { id: "J_hUIjAp_L8", title: "Best Men's Hiking Shorts: Top Quick-Dry Picks for the Trail", author: "The Gear Reviewer" },
  { id: "2hurQMMbELc", title: "The Most Comfortable and Budget Friendly Hiking Shorts I Have Worn", author: "That Hiking Guy" },
  { id: "mwtGTmcNhRU", title: "Top 5 Hiking Shorts For Women", author: "The Adventure Junkies" },
  { id: "oGERi7Dt05U", title: "Best Hiking Short In 2025  - Top 10 New Hiking Shorts Review", author: "Fashion While" },
  { id: "FSfIZITZR2c", title: "Men's Hiking Shorts Review | KPSUN Quick Dry Cargo Shorts", author: "Home Smart by AE Mind" },
  { id: "2r-qDD6Pwog", title: "Difference Between Cargo Shorts vs  Hiking Shorts: Which Is Better?", author: "Go Handsome" },
  { id: "TZbo0L5-Avo", title: "Trail running shoes for hiking! #hiking #travel #trailrunning #northface", author: "S&K Adventures" },
  { id: "-t_5SA_zCi8", title: "Gorpcore Hiking Outfit 🏔️ | Functional & Stylish Outdoor Look #gorpcore #salomon #acg", author: "Ilir" },
  { id: "hbRPfdAGRJQ", title: "Hiking outfits for the HOT summer!! #hiking #trailrunning #hikinginthesummer", author: "Brianna Finn" },
  { id: "GTZTt1e99Ao", title: "Are PANTS or SHORTS Better For Backpacking?!", author: "Tayson Whittaker" },
  { id: "Ohu14DENSX0", title: "The Ultimate Challenge #ytshorts #travel #nature #trending #mountains #kedarkantha #hiking #shorts", author: "Sachin Nayak" },
  { id: "7hZJxAQmpZ0", title: "Petite Hiking and Camping Outfits. Short Girls Hiking And Camping Outfits. #womenwhohike #petite", author: "With Sunshine Sol" },
  { id: "vmYzS5pIUKo", title: "Hiking boots or hiking shoes shoes? 🥾👟", author: "Columbia Sportswear" },
  { id: "r70PoH5_umE", title: "Ootd for a hike! #hiking #outfitideas #ootd #outfitoftheday #workout", author: "Mar S." },
  { id: "JEGGE4V4LOc", title: "Trek Pants vs. Track Pants #shorts", author: "Indiahikes" },
  { id: "vnxqqgDCA64", title: "Hiking SHORTS Recs: 5’9” Curvy, Athletic Body Type👇🏻", author: "Quin Gable" },
  { id: "KqLo2vvI0I0", title: "This is how hiking Videos are filmed #hike #travel #solo", author: "Wothius" },
  { id: "PrfY_25GdkU", title: "🥾Hiking Outfit Ideas!🌲", author: "Izzythrills" },
  { id: "9-UzqDFmJ8Q", title: "Nanda Devi Hike with my Dog(Logan🐶  #travel #hiking #dog #shorts #ytshorts #trending #johar", author: "DiksH The Rider" },
  { id: "77obYmmHR9k", title: "My Hammock Essentials 100ft up! #shorts", author: "Yehslacks " },
  { id: "ytbPpvZvGzo", title: "Harihar Fort trek #shorts #travel", author: "Farentu Dogra" },
  { id: "eomGY3XHQ8A", title: "AFTER COMPLETING MULTIDAY HIKE. #funny #memes #youtubeshorts #ytshorts #shorts #hiking #hike", author: "Camping Dan85" },
  { id: "_Zs6ohzymR4", title: "Epic Via Ferrata in Switzerland🇨🇭🤯#mountainhiking #swissalps #hiking #shorts", author: "Mr & Mrs Travelino" },
  { id: "Jpf0jM9PKrc", title: "Patagonia Strider Pro 5\" Shorts - First Impressions", author: "Tim Schwartz" },
  { id: "zXwiVwmFeK0", title: "Tiger Leaping Gorge High Road Cliff Hiking#Shorts #amazingchina", author: "Son Of China" },
  { id: "aDTBwt7YD2s", title: "14 Hikers Share FAVORITE CLOTHES after 2,000 Miles", author: "Chris Cage" },
  { id: "qWYsB8TUuWg", title: "KETL Shenanigan Hiking Shorts: Lightweight, Stretchy, Packable Men's Travel Shorts", author: "KETL Mtn." },
  { id: "lk_hutyW9Jo", title: "My 5 favorite hiking shorts 🩳 #granolagirl #outdoorsyfits", author: "Bee's Wild Life" },
  { id: "DhzirrwmwQ0", title: "My top 3 hiking pants. Which ones should I try next? #gearreview #hikingadventures #hikinggear #hike", author: "The Adventure Addicts | Zoe & Kelby" },
  { id: "J-f4D2Ld1ik", title: "Bring less clothes on your hikes #shorts", author: "Dan Becker" },
  { id: "btlYJHJJv_M", title: "What to look for when buying hiking pants  #hiking #hikingtips #hikinggear", author: "Columbia Sportswear" },
  { id: "TzWXQ43d_-I", title: "POV 🇹🇷 Old City Tourist Style in Istanbul ☀️#shorts #shortsfeed #walkingtour #istanbul4k", author: "Walk With Me in Turkey" },
  { id: "IRzEL4DIv1s", title: "📍Covent Garden London 🇬🇧", author: "KEEP WALKING 4K" },
  { id: "26aOF3cNVKU", title: "Canary Wharf London #london #canarywharf #walk  #uk #view", author: "The Accidental Entertainers" },
  { id: "W7KRXWUEUw8", title: "London Street Walk 🇬🇧 #london #street #walk #shorts", author: "Step Out London" },
  { id: "OAsrx2riyc8", title: "City Walk Dubai Night 🇦🇪  #dubai #citywalk #shorts", author: "Ali Hassan" },
  { id: "jaWnPECCZtE", title: "Finland small City walks: Sunny Autumn walk in Matinkylä Espoo#shorts #travel", author: "Finland Walks" },
  { id: "XMhzpiH4b0U", title: "IRAN WALKING TOUR | Inside Tehran Metro – Urban Life Underground #shorts", author: "Stepsera" },
  { id: "fVqYekUcj6g", title: "😍 Paris walking tour 4k 🇫🇷 #travel #trending #shorts #viral #paris #virtualtour #france", author: "WORLD ON WHEELS 🛞 " },
  { id: "Us38TDGryqQ", title: "London Street Walk, #Shorts", author: "Travel with Mandakini" },
  { id: "iRL20hjlY14", title: "London walking tour #travel #vacation #explore #london", author: "THE WALKING JOURNEYS " },
  { id: "GDyAlOfX-1Q", title: "The Beauty of London City", author: "Beautiful Paradise in Earth" },
  { id: "jWBnGwuwPBw", title: "Would you WALK here? BEVERLY HILLS 🌴 California 🇺🇸", author: "I am WalKing" },
  { id: "Tx6bI1rAjXU", title: "London edit | London city | London walk | London city Tour | london aesthetic video #london", author: "Dream Destination" },
  { id: "0PpbWlLjjaw", title: "Paris city walks  Paris, France…😳#shorts#paris", author: "Paris city walks" },
  { id: "NeVtALv17Go", title: "New York City Walking tour #travel #usa", author: "TravelUSA_withme" },
  { id: "40w8Cy2RqFs", title: "Walking in New York City", author: "Waqar Hussain" },
  { id: "EcMmEwvFvAM", title: "Nights In London 🎇  #shorts #london #night #oxfordstreet #street #uk #unitedkingdom", author: "London Vibes MK" },
  { id: "h9_fr06kbPg", title: "City Walk Dubai #shorts #citywalk #dubai", author: "Ashu On The Dubai " },
  { id: "MeYEY3SZyXQ", title: "SHANGHAI CITY WALK", author: "SHANGHAI CITY WALK" },
  { id: "Uw8QGhJ97SY", title: "Walking Through Barcelona 🇪🇸 | Relaxing 4K City Walk #shorts #spain #barcelona #4kwalk #europe", author: "Worldwide Footsteps" },
  { id: "-DZKAAKIIyQ", title: "City walking, travel walk, street walk, city tour,  St. Petersburg, beautiful Russian girls", author: "Travelholic TV" },
  { id: "WggrDrnRwuc", title: "The video that started it all. Walking in NYC ❤️💕✨ #nyc #timessquare", author: "Haley Kalil" },
  { id: "fmxFDjgJukg", title: "Manchester Is Full of Surprises 🇬🇧✨ #shorts", author: "BV4K" },
  { id: "mxazX_Eczr4", title: "New York City Times Square #travel #shorts #walking", author: "Travel Man TV" },
  { id: "Mv0F5xtzJ_I", title: "Snowy Michigan Avenue in Downtown Chicago | Winter Wonderland 2026 ❄️🏙️!#shorts #travel #city", author: "Epic travel reel" },
  { id: "qwhLqnISVnM", title: "beach outfits #spring #shorts #fashion", author: "Kelly Doan" },
  { id: "l5Nw03JfxeM", title: "Urbanic Find | Beach Dress #whatiorderedvswhatigot #dress #shorts", author: "IsThisYouAparna" },
  { id: "FvoVRCUmj4Q", title: "Back From Bali Womens Sarong Beach Wrap bathing suit cover up Leaf", author: "Back From Bali" },
  { id: "V0hAo8fsGog", title: "Goa Beach Transition 🏖️😍 #priyalkukreja #shorts #ytshorts", author: "Priyal Kukreja" },
  { id: "lJ9OBtEk9MQ", title: "OUTFITS I WORE IN PHUKET THAILAND 🇹🇭🏝️ #beach #outfitideas #phuket #thailand #ytshorts #shorts", author: "Vaibhav and Shweta" },
  { id: "uv8LFKnvCw8", title: "BEACH SHORT DIARY | Cinematic video", author: "grainy moody" },
  { id: "-ZK_IpssIGA", title: "The #Maldives is calling 🌊🐠❤️ #shorts", author: "Waldorf Astoria Maldives Ithaafushi" },
  { id: "FaT6Bp2innQ", title: "Rio De Janeiro Beach Beyond The View", author: "Best beaches and cities" },
  { id: "dC9eMWyW6Sc", title: "Different ways of bikini hacks, provide you the most confidence boosting ever! ✨ #cupshe #hacks", author: "Cupshe" },
  { id: "It2bYtVpLBg", title: "What’s in my beach bag 🌺🌴🏄🏼‍♀️#shorts #beachbag #vacation #summer #summervibes", author: "Cary Ashley" },
  { id: "-tsRN693nYk", title: "Do we even have “beach wear” section? 😂 #ytshorts #shorts #goa #travel #funny", author: "Gavarchi Sheng" },
  { id: "PVzFUicZ4JM", title: "Vizag Beach 🌊🩵 #beach #vizag #trendingnow #reels #shorts #latest #travel #vlog #transition #capcut", author: "Groove and Giggle" },
  { id: "iONMcMaRxW4", title: "That Couple on Beach #shorts #couple #couplegoals #beach #comedy #funny #explore #love #nostalgia", author: "Baccha Mat Bolna" },
  { id: "_LU8QTMNlcU", title: "Cute girl Beach Side videography😍 #shorts #video", author: "Stephen Raja" },
  { id: "AGsC-lxhirw", title: "How to style Bermuda Shorts or Jorts #shorts #howtostyle #stylingtips #jorts", author: "Kinnari Jain" },
  { id: "saN8Yb4LujE", title: "Mypadu Beach ! #shorts #beachvibes #travel ! Nellore Mypadu Beach", author: "Svr Creative Vlogs" },
  { id: "eRhIUut4ckQ", title: "Outfits we wore in Andaman #outfitideas #beachwear #ytshorts", author: "Hauls and Vlogs" },
  { id: "zgde1fdVvvM", title: "🏖️🌊🩵#gang#trendingshorts #beach #squeaky #reels #Ruhi❤️", author: "♥️Ruhi♥️@Australialoammakuchi" },
  { id: "J-AAqKzfUxk", title: "Shorts 🩳 Guide: All Body Types⭕️🔺 #shorts #short #mensfashion #summerfashion", author: "The Formal Edit" },
  { id: "PxXvuYH3LQ4", title: "shopping for bathing suits! #beach #bathingsuit #shopping #fyp #shorts", author: "lexi faith" },
  { id: "qImmym5KG-s", title: "Beach Pose ideas ✨ #shorts #viral", author: "Trendyistic" },
  { id: "8NuQdX5cmjE", title: "beach wear haul, beach wear haul meesho#beach #beachwear #outfit #goals #fashion #meesho #shorts #1k", author: " Susmita official " },
  { id: "iWLVZ5Xd4kE", title: "Pose idea to try at beach.🌊 #howtopose #posesideas #poses #posing #posingtips #shorts #viralshorts", author: "WanderessKriti" }
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
