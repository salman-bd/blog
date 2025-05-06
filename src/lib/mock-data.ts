import type { Post, Category, Comment, User } from "@/types/types"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Junayed Ahmed",
    email: "junayed@example.com",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  },
  {
    id: "user-2",
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "user-3",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "/placeholder.svg?height=200&width=200",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-01"),
  },
]

// Mock Categories
export const mockCategories: Category[] = [
  { name: "Travel", slug: "travel", count: 12 },
  { name: "Politics", slug: "politics", count: 8 },
  { name: "Religion", slug: "religion", count: 5 },
  { name: "History", slug: "history", count: 7 },
  { name: "Nature", slug: "nature", count: 10 },
]

// Mock Tags
export const mockTags = [
  "Bangladesh",
  "Dhaka",
  "Sylhet",
  "Asia",
  "Culture",
  "Food",
  "Adventure",
  "Photography",
  "Landscape",
  "Wildlife",
]

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "My Journey Through Bangladesh",
    slug: "journey-through-bangladesh",
    excerpt:
      "Join me as I explore the beautiful landscapes and rich culture of Bangladesh, from the bustling streets of Dhaka to the serene tea gardens of Sylhet.",
    content: `
      <h2>Exploring the Heart of Bangladesh</h2>
      <p>Bangladesh, a country of rivers, lush landscapes, and warm people, has always been close to my heart. As someone born and raised here, I've had the privilege of experiencing its beauty in ways that many travelers might miss.</p>
      
      <p>My journey began in Dhaka, the capital city that never sleeps. The bustling streets, the historical sites like Lalbagh Fort, and the vibrant markets create an atmosphere that's both chaotic and charming. The food scene in Dhaka deserves special mention – from street food to high-end restaurants, the flavors of Bengali cuisine are unforgettable.</p>
      
      <h2>The Serene Beauty of Sylhet</h2>
      <p>From Dhaka, I traveled to Sylhet, known for its tea gardens that stretch as far as the eye can see. The rolling hills covered in tea plantations create a mesmerizing landscape that's perfect for photography enthusiasts. I spent days walking through these gardens, interacting with tea workers, and learning about the process of tea production.</p>
      
      <p>Sylhet is also home to numerous waterfalls and natural attractions. Ratargul Swamp Forest, the only freshwater swamp forest in Bangladesh, offers a unique ecosystem that's best explored by boat. The experience of gliding through the water under a canopy of trees is truly magical.</p>
      
      <h2>Cultural Experiences</h2>
      <p>Throughout my journey, I was constantly amazed by the rich cultural heritage of Bangladesh. From traditional folk music performances to religious festivals, there's always something happening that provides insight into the local way of life.</p>
      
      <p>The hospitality of Bangladeshi people is legendary, and I experienced it firsthand. Strangers invited me into their homes for meals, shared stories of their lives, and showed genuine interest in my experiences. These interactions were perhaps the most valuable part of my journey.</p>
      
      <h2>Conclusion</h2>
      <p>Bangladesh may not be on the top of most travelers' lists, but it offers experiences that are authentic, enriching, and unforgettable. As I continue to explore more of this beautiful country, I'm excited to share more stories and insights with you.</p>
      
      <p>If you're planning a trip to Bangladesh or have any questions about the places I've visited, feel free to leave a comment below!</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-20"),
    published: true,
    featured: true,
    readingTime: 8,
    categories: ["Travel", "Culture"],
    tags: ["Bangladesh", "Dhaka", "Sylhet", "Travel Tips"],
    author: {
      id: "user-1",
      name: "Junayed Ahmed",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "post-2",
    title: "The History of Kishoregonj",
    slug: "history-of-kishoregonj",
    excerpt:
      "Discover the rich history and cultural heritage of Kishoregonj, one of Bangladesh's most historically significant districts. ",
    content: `
      <h2>Introduction to Kishoregonj</h2>
      <p>Kishoregonj, a district in the Dhaka division of Bangladesh, has a rich history that dates back centuries. As someone who was born in this region, I've always been fascinated by its historical significance and cultural heritage.</p>
      
      <h2>Ancient History</h2>
      <p>The history of Kishoregonj can be traced back to ancient times when it was part of the Kamarupa kingdom. Archaeological findings suggest that the area was inhabited as early as the 4th century. The region later came under the influence of various dynasties, including the Palas, Senas, and the Mughals.</p>
      
      <p>During the Mughal period, Kishoregonj gained prominence as an administrative center. Several architectural marvels from this era still stand today, though many are in need of preservation.</p>
      
      <h2>Colonial Era</h2>
      <p>When the British East India Company took control of Bengal in the 18th century, Kishoregonj became part of their territory. The colonial period brought significant changes to the region's administrative structure, economy, and social fabric.</p>
      
      <p>The British established schools, improved transportation networks, and introduced new agricultural practices. However, this period also saw exploitation of local resources and people, leading to several resistance movements.</p>
      
      <h2>Role in Bangladesh's Independence</h2>
      <p>Kishoregonj played a significant role in Bangladesh's struggle for independence. During the Liberation War of 1971, the district was a center of resistance against Pakistani forces. Many freedom fighters from Kishoregonj made the ultimate sacrifice for the country's independence.</p>
      
      <p>Several memorials and museums in the district commemorate these heroes and preserve the memories of the liberation struggle.</p>
      
      <h2>Cultural Heritage</h2>
      <p>Beyond its political history, Kishoregonj is known for its rich cultural heritage. The district has produced numerous poets, writers, musicians, and artists who have contributed significantly to Bengali culture.</p>
      
      <p>Traditional crafts like pottery, weaving, and metalwork are still practiced in various parts of the district, though they face challenges in the modern economy.</p>
      
      <h2>Conclusion</h2>
      <p>Understanding the history of Kishoregonj provides valuable insights into the broader history of Bangladesh. As we move forward, it's essential to preserve this rich heritage for future generations.</p>
      
      <p>In my next post, I'll explore some of the key historical sites in Kishoregonj that are worth visiting. Stay tuned!</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date("2023-06-22"),
    updatedAt: new Date("2023-06-25"),
    published: true,
    featured: true,
    readingTime: 10,
    categories: ["History", "Bangladesh"],
    tags: ["Kishoregonj", "Bangladesh History", "Cultural Heritage"],
    author: {
      id: "user-1",
      name: "Junayed Ahmed",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "post-3",
    title: "Political Landscape of South Asia",
    slug: "political-landscape-south-asia",
    excerpt:
      "An analysis of the current political dynamics in South Asia, focusing on regional cooperation, conflicts, and future prospects.",
    content: `
      <h2>Introduction</h2>
      <p>South Asia, home to nearly a quarter of the world's population, has a complex political landscape shaped by historical events, cultural diversity, and geopolitical interests. As someone who has closely followed political developments in this region, I'd like to share my perspectives on the current dynamics and future prospects.</p>
      
      <h2>Regional Cooperation: SAARC and Beyond</h2>
      <p>The South Asian Association for Regional Cooperation (SAARC) was established in 1985 with the goal of promoting economic and regional integration. However, political tensions, particularly between India and Pakistan, have limited its effectiveness.</p>
      
      <p>Despite these challenges, there have been some positive developments in regional cooperation. Bilateral agreements, sub-regional initiatives like BBIN (Bangladesh, Bhutan, India, Nepal), and increased trade have created alternative pathways for collaboration.</p>
      
      <h2>Major Political Challenges</h2>
      <p>Several political challenges continue to affect the region:</p>
      
      <ul>
        <li>India-Pakistan Relations: The ongoing tensions between these two nuclear powers impact regional stability.</li>
        <li>Democratic Consolidation: Countries like Bangladesh, Nepal, and Sri Lanka are working to strengthen their democratic institutions.</li>
        <li>Religious and Ethnic Tensions: These continue to influence political discourse across the region.</li>
        <li>External Influences: The growing presence of China and the strategic interests of the United States add another layer of complexity.</li>
      </ul>
      
      <h2>Bangladesh's Role</h2>
      <p>Bangladesh has emerged as a significant player in South Asian politics. Its strategic location, growing economy, and diplomatic initiatives have increased its regional influence.</p>
      
      <p>The country has maintained a balanced approach in its foreign relations, fostering good relationships with both India and China while also engaging with Western powers. This balanced approach has served Bangladesh well in navigating the complex geopolitical environment.</p>
      
      <h2>Future Prospects</h2>
      <p>Looking ahead, several factors will shape the political landscape of South Asia:</p>
      
      <ul>
        <li>Economic Integration: Increased economic interdependence could help overcome political differences.</li>
        <li>Climate Change: As a region highly vulnerable to climate change, collaborative approaches to this challenge could foster cooperation.</li>
        <li>Technological Advancement: The digital revolution offers new opportunities for regional connectivity and cooperation.</li>
        <li>Youth Engagement: With a large youth population, their political participation will significantly influence future directions.</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>The political landscape of South Asia is at a critical juncture. While challenges remain, there are also opportunities for greater cooperation and development. As citizens of this region, our understanding and engagement with these political dynamics are crucial for shaping a better future.</p>
      
      <p>I welcome your thoughts and perspectives on this topic. What do you see as the most significant political challenges and opportunities in South Asia?</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date("2023-07-10"),
    updatedAt: new Date("2023-07-15"),
    published: true,
    featured: false,
    readingTime: 12,
    categories: ["Politics"],
    tags: ["South Asia", "International Relations", "Regional Cooperation"],
    author: {
      id: "user-1",
      name: "Junayed Ahmed",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "post-4",
    title: "Religious Harmony in Bangladesh",
    slug: "religious-harmony-bangladesh",
    excerpt:
      "Exploring the tradition of religious harmony in Bangladesh and how different communities coexist peacefully despite challenges.",
    content: `
      <h2>Introduction</h2>
      <p>Bangladesh, though predominantly a Muslim country, has a long tradition of religious harmony. Various religious communities, including Hindus, Buddhists, Christians, and others, have coexisted peacefully for centuries. This post explores this tradition of harmony, the challenges it faces, and the efforts to preserve it.</p>
      
      <h2>Historical Context</h2>
      <p>The Bengal region, which includes present-day Bangladesh, has historically been characterized by religious syncretism. Sufism, with its emphasis on love and tolerance, played a significant role in shaping the religious landscape. Many religious practices and festivals in Bangladesh reflect this syncretic tradition, incorporating elements from various faiths.</p>
      
      <p>During the Liberation War of 1971, people of all religions fought together for independence, further strengthening the bonds of unity.</p>
      
      <h2>Current Scenario</h2>
      <p>Today, Bangladesh's constitution recognizes Islam as the state religion but also guarantees equal rights and freedoms for all religious communities. Major religious festivals of different communities are celebrated as national holidays, and it's common to see people participating in each other's celebrations.</p>
      
      <p>In many villages and towns, mosques, temples, and churches stand side by side, symbolizing the peaceful coexistence of different faiths.</p>
      
      <h2>Challenges to Religious Harmony</h2>
      <p>Despite this tradition of harmony, there have been challenges:</p>
      
      <ul>
        <li>Political Exploitation: Sometimes, religious sentiments are exploited for political gains.</li>
        <li>Extremist Ideologies: The rise of extremist ideologies globally has had some impact locally.</li>
        <li>Socioeconomic Factors: Disparities in socioeconomic conditions can sometimes manifest along religious lines.</li>
      </ul>
      
      <h2>Efforts to Preserve Harmony</h2>
      <p>Various initiatives are underway to preserve and strengthen religious harmony:</p>
      
      <ul>
        <li>Interfaith Dialogues: Regular dialogues between religious leaders promote understanding and cooperation.</li>
        <li>Educational Programs: Schools and universities emphasize the importance of religious tolerance.</li>
        <li>Cultural Activities: Cultural programs that celebrate diversity help build bridges between communities.</li>
        <li>Legal Protections: Laws against hate speech and discrimination provide a framework for peaceful coexistence.</li>
      </ul>
      
      <h2>Personal Reflections</h2>
      <p>Growing up in Bangladesh, I've witnessed firsthand the beauty of religious harmony. Some of my closest friends belong to different faiths, and participating in their religious celebrations has enriched my understanding and appreciation of diversity.</p>
      
      <p>I believe that this tradition of harmony is one of Bangladesh's greatest strengths and something that the world can learn from, especially in times of increasing polarization.</p>
      
      <h2>Conclusion</h2>
      <p>Religious harmony in Bangladesh is not just an abstract ideal but a lived reality for millions of people. While challenges exist, the deep-rooted tradition of tolerance and respect provides a strong foundation for addressing them.</p>
      
      <p>As we move forward, preserving and strengthening this harmony requires continuous effort from all sections of society – religious leaders, policymakers, educators, and ordinary citizens.</p>
      
      <p>I'd love to hear your experiences and thoughts on religious harmony, whether in Bangladesh or elsewhere. Please share in the comments below!</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date("2023-08-05"),
    updatedAt: new Date("2023-08-10"),
    published: true,
    featured: false,
    readingTime: 9,
    categories: ["Religion", "Culture"],
    tags: ["Religious Harmony", "Bangladesh", "Interfaith Dialogue"],
    author: {
      id: "user-1",
      name: "Junayed Ahmed",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "post-5",
    title: "The Natural Beauty of Sylhet",
    slug: "natural-beauty-sylhet",
    excerpt:
      "Discover the breathtaking landscapes, tea gardens, and natural wonders that make Sylhet one of Bangladesh's most beautiful regions.",
    content: `
      <h2>Introduction to Sylhet</h2>
      <p>Sylhet, located in the northeastern part of Bangladesh, is a region blessed with extraordinary natural beauty. From rolling tea gardens to pristine waterfalls, from dense forests to winding rivers, Sylhet offers a diverse range of natural attractions that captivate visitors from around the world.</p>
      
      <h2>The Famous Tea Gardens</h2>
      <p>Perhaps the most iconic image of Sylhet is its vast tea gardens that stretch across the horizon. These lush green carpets of tea plants create a mesmerizing landscape, especially during the early morning when mist hangs over them.</p>
      
      <p>Some of the most famous tea estates include Malnicherra, which is the oldest tea garden in Bangladesh, and Lakkatura. Visitors can tour these estates, learn about the tea production process, and of course, sample some of the finest tea in the world.</p>
      
      <h2>Waterfalls and Rivers</h2>
      <p>Sylhet is home to numerous waterfalls that cascade down from the hills. Madhabkunda, the largest waterfall in Bangladesh, is a spectacular sight, especially during the monsoon season when it's at its full force.</p>
      
      <p>The region is also crisscrossed by rivers and streams. The Surma and Kushiyara rivers are not only important for transportation and agriculture but also offer scenic beauty and opportunities for boat rides.</p>
      
      <h2>Forests and Wildlife</h2>
      <p>The Ratargul Swamp Forest, often called the "Amazon of Bangladesh," is a freshwater swamp forest that offers a unique ecosystem. Exploring this forest by boat is a magical experience as you glide through water under a canopy of trees.</p>
      
      <p>Lawachara National Park is another natural gem where visitors can trek through dense forest and spot wildlife, including the endangered hoolock gibbons.</p>
      
      <h2>Haors: A Unique Ecosystem</h2>
      <p>The haors of Sylhet are bowl-shaped wetland ecosystems that transform with the seasons. During the monsoon, they become vast inland seas, while in the dry season, they turn into fertile plains. Tanguar Haor, a Ramsar site of international importance, is particularly notable for its biodiversity and bird population.</p>
      
      <h2>Cultural Connection to Nature</h2>
      <p>The natural beauty of Sylhet has deeply influenced the local culture. Folk songs often reference the tea gardens, rivers, and hills. Traditional crafts use materials from the natural environment, and local cuisine features ingredients unique to the region.</p>
      
      <h2>Conservation Challenges</h2>
      <p>Despite its natural wealth, Sylhet faces conservation challenges. Deforestation, unplanned urbanization, and climate change threaten some of these natural wonders. Various initiatives by government agencies, NGOs, and local communities aim to address these challenges and preserve the region's natural heritage.</p>
      
      <h2>Travel Tips</h2>
      <p>For those planning to explore the natural beauty of Sylhet, here are some tips:</p>
      
      <ul>
        <li>Best Time to Visit: October to March offers pleasant weather.</li>
        <li>Transportation: Local buses, CNGs (auto-rickshaws), and hired cars are available for getting around.</li>
        <li>Accommodation: Options range from luxury resorts to budget guesthouses.</li>
        <li>Local Guides: Hiring a local guide can enhance your experience, especially for forest treks and haor visits.</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>The natural beauty of Sylhet is a treasure that deserves to be experienced firsthand. Whether you're a nature enthusiast, a photographer, or simply someone seeking tranquility away from urban life, Sylhet offers a refreshing escape into the heart of nature.</p>
      
      <p>Have you visited Sylhet? What natural attractions impressed you the most? Share your experiences in the comments below!</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date("2023-09-12"),
    updatedAt: new Date("2023-09-15"),
    published: true,
    featured: true,
    readingTime: 11,
    categories: ["Nature", "Travel"],
    tags: ["Sylhet", "Tea Gardens", "Waterfalls", "Bangladesh"],
    author: {
      id: "user-1",
      name: "Junayed Ahmed",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
  {
    id: "post-6",
    title: "Traditional Bangladeshi Cuisine",
    slug: "traditional-bangladeshi-cuisine",
    excerpt:
      "Explore the rich flavors, unique ingredients, and cultural significance of traditional Bangladeshi cuisine.",
    content: `
      <h2>Introduction to Bangladeshi Cuisine</h2>
      <p>Bangladeshi cuisine is a culinary treasure that reflects the country's history, geography, and cultural diversity. Rich in flavors, aromatic spices, and unique cooking techniques, it offers a gastronomic experience that's both distinctive and delightful.</p>
      
      <h2>Regional Variations</h2>
      <p>Bangladesh's cuisine varies significantly by region:</p>
      
      <ul>
        <li>Dhaka: The capital city is known for its refined Mughal-influenced dishes like biryani and kebabs.</li>
        <li>Chittagong: Coastal cuisine featuring seafood and distinctive spice blends.</li>
        <li>Sylhet: Known for its unique preparation of fish and the use of citrus flavors.</li>
        <li>Khulna: Famous for freshwater fish and sweet dishes.</li>
        <li>Rajshahi: Known for its wide variety of sweets and fruit-based dishes.</li>
      </ul>
      
      <h2>Staple Foods</h2>
      <p>Rice is the staple food of Bangladesh, served with a variety of curries, vegetables, and fish. Different varieties of rice are used for different dishes – fine-grained aromatic rice for special occasions and coarser varieties for everyday meals.</p>
      
      <p>Fish is another staple, reflecting Bangladesh's geography with its numerous rivers and coastal areas. Hilsa, often called the "king of fish," holds a special place in Bengali cuisine and culture.</p>
      
      <h2>Signature Dishes</h2>
      <p>Some signature dishes of Bangladeshi cuisine include:</p>
      
      <ul>
        <li>Panta Bhat: Fermented rice soaked in water, typically served with fried fish, pickles, and green chilies.</li>
        <li>Hilsa with Mustard: A classic preparation of hilsa fish cooked with a mustard seed paste.</li>
        <li>Bhuna Khichuri: A hearty dish of rice and lentils cooked with spices, often served during rainy days.</li>
        <li>Beef Tehari: A flavorful one-pot rice dish with beef, popular in urban areas.</li>
        <li>Shorshe Ilish: Hilsa fish cooked in a mustard sauce, a delicacy of Bengali cuisine.</li>
        <li>Pitha: Rice cakes in various forms, often prepared during festivals.</li>
      </ul>
      
      <h2>Spices and Flavors</h2>
      <p>Bangladeshi cuisine uses a wide array of spices and flavors. The "panch phoron" (five-spice blend) consisting of fenugreek, nigella, cumin, black mustard, and fennel seeds is commonly used. Mustard oil, with its pungent flavor, is a preferred cooking medium in many dishes.</p>
      
      <p>The use of green chilies, ginger, and garlic forms the base of many preparations, while turmeric, coriander, and cumin add depth and color.</p>
      
      <h2>Sweet Delights</h2>
      <p>Bangladeshis have a special fondness for sweets. Some popular desserts include:</p>
      
      <ul>
        <li>Roshogolla: Soft cheese balls soaked in sugar syrup.</li>
        <li>Chamcham: Oblong-shaped sweet made from chhana (cottage cheese) and soaked in syrup.</li>
        <li>Patishapta: Thin crepes with a filling of coconut and jaggery.</li>
        <li>Mishti Doi: Sweetened yogurt, often served in earthen pots.</li>
      </ul>
      
      <h2>Festive Foods</h2>
      <p>Food plays a central role in Bangladeshi festivals. During Eid, dishes like biryani, rezala, and various meat preparations take center stage. Pohela Boishakh (Bengali New Year) is celebrated with panta bhat and fried fish. Various pithas (rice cakes) are prepared during the winter harvest festival.</p>
      
      <h2>Modern Influences</h2>
      <p>While traditional dishes remain popular, Bangladeshi cuisine is also evolving with global influences. Fusion dishes that combine traditional flavors with international cooking techniques are becoming popular, especially in urban areas.</p>
      
      <h2>Conclusion</h2>
      <p>Bangladeshi cuisine, with its rich flavors, diverse dishes, and cultural significance, offers a window into the country's heritage and way of life. Whether you're savoring a simple meal of rice and fish curry or indulging in elaborate festive dishes, the experience is bound to be memorable.</p>
      
      <p>What's your favorite Bangladeshi dish? Have you tried cooking any at home? Share your culinary experiences in the comments!</p>
    `,
    coverImage: "/placeholder.svg?height=600&width=1200",
    publishedAt: new Date("2023-10-08"),
    updatedAt: new Date("2023-10-10"),
    published: true,
    featured: false,
    readingTime: 10,
    categories: ["Culture", "Travel"],
    tags: ["Bangladeshi Food", "Cuisine", "Cultural Heritage"],
    author: {
      id: "user-1",
      name: "Junayed Ahmed",
      image: "/placeholder.svg?height=200&width=200",
    },
  },
]

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: "comment-1",
    content: "Great article! I really enjoyed reading about your experiences in Bangladesh.",
    createdAt: new Date("2023-07-15"),
    user: {
      id: "user-2",
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "comment-2",
    content:
      "I've been to Sylhet as well and your descriptions brought back so many memories. Looking forward to more travel posts!",
    createdAt: new Date("2023-07-22"),
    user: {
      id: "user-3",
      name: "Jane Smith",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "comment-3",
    content: "This is very informative. I learned a lot about the history of Kishoregonj.",
    createdAt: new Date("2023-08-05"),
    user: {
      id: "user-2",
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "comment-4",
    content: "Your analysis of South Asian politics is spot on. I appreciate the balanced perspective.",
    createdAt: new Date("2023-08-12"),
    user: {
      id: "user-3",
      name: "Jane Smith",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "comment-5",
    content:
      "The photos of the tea gardens are stunning! I'm planning a trip to Sylhet next month and will definitely visit these places.",
    createdAt: new Date("2023-09-18"),
    user: {
      id: "user-2",
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
]

// Helper function to get mock posts with filters
export function getMockPosts(
  options: {
    page?: number
    limit?: number
    category?: string
    search?: string
    featured?: boolean
  } = {},
): { posts: Post[]; totalPages: number } {
  const { page = 1, limit = 10, category, search, featured } = options

  let filteredPosts = [...mockPosts]

  // Apply filters
  if (featured !== undefined) {
    filteredPosts = filteredPosts.filter((post) => post.featured === featured)
  }

  if (category) {
    filteredPosts = filteredPosts.filter((post) => post.categories.includes(category))
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower),
    )
  }

  // Calculate pagination
  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / limit)
  const start = (page - 1) * limit
  const end = start + limit

  return {
    posts: filteredPosts.slice(start, end),
    totalPages,
  }
}

// Helper function to get a mock post by slug
export function getMockPostBySlug(slug: string): Post | null {
  return mockPosts.find((post) => post.slug === slug) || null
}

// Helper function to get related posts
export function getMockRelatedPosts(postId: string, categories: string[]): Post[] {
  if (!categories.length) return []

  return mockPosts
    .filter((post) => post.id !== postId && post.categories.some((category) => categories.includes(category)))
    .slice(0, 3)
}

// Helper function to get mock comments for a post
export function getMockComments(postId: string): Comment[] {
  // In a real app, we would filter by postId
  // For mock data, we'll just return all comments
  return mockComments
}

// Helper function to get mock categories
export function getMockCategories(): Category[] {
  return mockCategories
}

// Helper function to get mock recent posts
export function getMockRecentPosts(limit = 5): Post[] {
  return mockPosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, limit)
}
