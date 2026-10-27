import { Survey } from '../types';

// Standard exchange rate: 1 USD = 18.66 ZAR/NAD
const USD_TO_NAD_RATE = 18.66;

export const DYNAMIC_SURVEYS: Survey[] = [
  {
    id: 'srv_netflix_stranger_things',
    logo: '🍿',
    companyName: 'Netflix Studios',
    surveyName: 'Stranger Things Season 5: Teaser & Final Arc Preview',
    title: 'Stranger Things Season 5: Teaser & Final Arc Preview',
    company: 'Netflix Studios',
    reward: 35.00,
    rewardUsd: 35.00,
    rewardNad: Math.round(35.00 * USD_TO_NAD_RATE * 100) / 100,
    duration: 3,
    estimatedTimeMin: 3,
    description: 'Help the Netflix Original Series panel evaluate the final season teaser pacing, Hawkins lore resolution, and Upside Down visual effects tone.',
    status: 'active',
    created_at: '2026-07-01T10:00:00Z',
    category: 'Streaming Originals',
    available: true,
    completed: false,
    spotsLeft: 310,
    urgencyText: '🔥 PREMIERE SCREENING',
    rating: 4.9,
    participantsCount: 18450,
    difficulty: 'Easy',
    badge: 'NETFLIX ORIGINAL',
    imageUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'st_q1',
        question: 'Which element of the Stranger Things final season teaser resonated most with you?',
        type: 'single',
        answers: [
          'The darker, 80s synth horror atmosphere',
          'Vecna & the Upside Down visual monster designs',
          'The original Hawkins kids reuniting for the finale',
          'The nostalgic emotional tone and soundtrack'
        ]
      },
      {
        id: 'st_q2',
        question: 'What is your preferred release model for high-budget Netflix prestige seasons?',
        type: 'single',
        answers: [
          'All episodes released at once (classic binge model)',
          'Two Volumes separated by 4 weeks (Volume 1 & 2)',
          'Weekly episode releases to build global anticipation',
          'Feature-length 2-hour episodes'
        ]
      },
      {
        id: 'st_q3',
        question: 'How do you rate the visual fidelity and CGI monster renders in recent Netflix 4K HDR productions?',
        type: 'rating',
        answers: ['Poor Quality', 'Average', 'Good', 'Hollywood Theatrical Standard', 'Pioneering Masterpiece']
      },
      {
        id: 'st_q4',
        question: 'Do you watch Netflix releases with Spatial Audio / Dolby Atmos enabled when available?',
        type: 'yesno',
        answers: ['Yes, audio immersion is essential for cinema', 'No, standard TV or phone audio']
      },
      {
        id: 'st_q5',
        question: 'Overall excitement level for this season premiere:',
        type: 'emoji',
        answers: ['😐 Neutral', '🍿 Very Excited', '🔥 Hyped & Counting Days']
      }
    ]
  },
  {
    id: 'srv_marvel_secret_wars',
    logo: '🎬',
    companyName: 'Marvel Studios',
    surveyName: 'Avengers: Multiverse & Phase 6 Theatrical Concept Audit',
    title: 'Avengers: Multiverse & Phase 6 Theatrical Concept Audit',
    company: 'Marvel Studios',
    reward: 40.00,
    rewardUsd: 40.00,
    rewardNad: Math.round(40.00 * USD_TO_NAD_RATE * 100) / 100,
    duration: 4,
    estimatedTimeMin: 4,
    description: 'Provide critical audience feedback on upcoming MCU theatrical release schedules, X-Men & Fantastic Four team-ups, and IMAX aspect ratio previews.',
    status: 'active',
    created_at: '2026-06-29T14:30:00Z',
    category: 'Box Office Blockbusters',
    available: true,
    completed: false,
    spotsLeft: 185,
    urgencyText: '⚡ THEATRICAL SCREENING',
    rating: 4.8,
    participantsCount: 22100,
    difficulty: 'Medium',
    badge: 'IMAX PREVIEW',
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'mcu_q1',
        question: 'Which upcoming Marvel Cinematic Universe crossover are you most eager to see in IMAX theaters?',
        type: 'single',
        answers: [
          'Avengers vs Doctor Doom (Secret Wars)',
          'The Fantastic Four First Steps in 1960s retro-futurism',
          'The live-action introduction of the MCU X-Men mutants',
          'Spider-Man street-level team up with Daredevil'
        ]
      },
      {
        id: 'mcu_q2',
        question: 'What factors make you buy an opening weekend cinema ticket over waiting for Disney+ streaming?',
        type: 'multiple',
        answers: [
          'Avoiding social media spoilers and leaks',
          'IMAX 3D / Dolby Cinema giant screen and explosive sound',
          'Watching with an energetic crowd of fellow fans',
          'Exclusive post-credits scene reveals'
        ]
      },
      {
        id: 'mcu_q3',
        question: 'Rate your satisfaction with Marvel Studios practical sets vs full CGI green screen environments:',
        type: 'rating',
        answers: ['Strongly Prefer Practical Sets', 'Slightly Prefer Practical Sets', 'Balanced Mix is Best', 'CGI is Great', 'No Preference']
      },
      {
        id: 'mcu_q4',
        question: 'Do you believe superhero cinema is entering a creative renaissance with R-rated hits like Deadpool?',
        type: 'yesno',
        answers: ['Yes, creative freedom and mature tone revive the genre', 'No, audiences want family-friendly blockbusters']
      },
      {
        id: 'mcu_q5',
        question: 'How do you rate the anticipation for Robert Downey Jr as Doctor Doom?',
        type: 'emoji',
        answers: ['🤔 Skeptical', '😲 Shocked & Intrigued', '🤯 Legendary Casting']
      }
    ]
  },
  {
    id: 'srv_nolan_imax_experience',
    logo: '🎥',
    companyName: 'Syncopy Films',
    surveyName: 'Christopher Nolan 70mm IMAX Sound & Visual Study',
    title: 'Christopher Nolan 70mm IMAX Sound & Visual Study',
    company: 'Syncopy / Warner Bros',
    reward: 28.00,
    rewardUsd: 28.00,
    rewardNad: Math.round(28.00 * USD_TO_NAD_RATE * 100) / 100,
    duration: 3,
    estimatedTimeMin: 3,
    description: 'Audit theatrical sound mix clarity, practical stunt cinematography, and audience appetite for 70mm analog film projection.',
    status: 'active',
    created_at: '2026-06-28T09:15:00Z',
    category: 'Film Guild & IMAX',
    available: true,
    completed: false,
    spotsLeft: 420,
    urgencyText: '🎟️ CRITIC PANEL',
    rating: 4.95,
    participantsCount: 14200,
    difficulty: 'Easy',
    badge: '70MM FILM PRINT',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'nol_q1',
        question: 'When watching Nolan films (Oppenheimer, Interstellar, Inception), what cinema format do you prioritize?',
        type: 'single',
        answers: [
          'IMAX 70mm / Dual Laser (1.43:1 expanded ratio)',
          'Dolby Cinema with Atmos audio immersion',
          'Standard digital theatrical screen',
          'High-end home theater with 4K UHD Blu-ray'
        ]
      },
      {
        id: 'nol_q2',
        question: 'How would you describe your experience with dialogue intelligibility during loud orchestral action sequences?',
        type: 'single',
        answers: [
          'Perfect, part of the intended visceral sound wall',
          'Sometimes difficult to understand without subtitles',
          'I prefer clear center-channel dialogue mix',
          'I turn on theater assistive headsets'
        ]
      },
      {
        id: 'nol_q3',
        question: 'Rate your appreciation for real practical explosions and camera stunt work over CGI replacements:',
        type: 'rating',
        answers: ['Not Important', 'Nice to Have', 'Appreciated', 'Very Important', 'Crucial to Pure Cinema']
      },
      {
        id: 'nol_q4',
        question: 'Would you pay a 50% price premium on tickets for verified 70mm film projection reels?',
        type: 'yesno',
        answers: ['Yes, cinema heritage is worth the premium', 'No, standard digital ticket is fine']
      }
    ]
  },
  {
    id: 'srv_hbo_dune_westeros',
    logo: '🐉',
    companyName: 'HBO Max Studios',
    surveyName: 'House of the Dragon & Dune: Worldbuilding & Lore Rating',
    title: 'House of the Dragon & Dune: Worldbuilding & Lore Rating',
    company: 'HBO Max / Warner Bros',
    reward: 32.00,
    rewardUsd: 32.00,
    rewardNad: Math.round(32.00 * USD_TO_NAD_RATE * 100) / 100,
    duration: 3,
    estimatedTimeMin: 3,
    description: 'Evaluate prestige television pacing, costume accuracy, dragon aerial combat choreography, and subscription streaming quality.',
    status: 'active',
    created_at: '2026-06-27T11:45:00Z',
    category: 'Prestige TV & Fantasy',
    available: true,
    completed: false,
    spotsLeft: 512,
    urgencyText: '🛡️ AUDIENCE GUILD',
    rating: 4.75,
    participantsCount: 9800,
    difficulty: 'Medium',
    badge: '4K DOLBY VISION',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'hbo_q1',
        question: 'What sets HBO prestige productions apart from other streaming originals?',
        type: 'single',
        answers: [
          'Intricate political dialogue & complex morally-grey characters',
          'Cinema-level costume, prosthetic and set construction',
          'Iconic musical scores (Ramin Djawadi / Hans Zimmer)',
          'High production value with uncompromising adult themes'
        ]
      },
      {
        id: 'hbo_q2',
        question: 'Which fantasy epic universe are you most invested in following in 2026/2027?',
        type: 'single',
        answers: [
          'A Knight of the Seven Kingdoms / Game of Thrones Universe',
          'Dune: Prophecy & Dune Messiah',
          'The Lord of the Rings: The Rings of Power',
          'The Witcher saga & spinoffs'
        ]
      },
      {
        id: 'hbo_q3',
        question: 'How do you rate HBO Max streaming bitrate and dark scene compression on your TV?',
        type: 'rating',
        answers: ['Poor banding/artifacts', 'Fair', 'Good', 'Excellent 4K HDR', 'Reference Master Quality']
      },
      {
        id: 'hbo_q4',
        question: 'Do you rewatch previous seasons before a new season premiere airs?',
        type: 'yesno',
        answers: ['Yes, always do a complete recap marathon', 'No, just watch a 5-minute YouTube recap']
      }
    ]
  },
  {
    id: 'srv_a24_indie_cinema',
    logo: '🎞️',
    companyName: 'A24 Films',
    surveyName: 'Psychological Horror & Indie Cinema Distribution Panel',
    title: 'Psychological Horror & Indie Cinema Distribution Panel',
    company: 'A24 Films',
    reward: 18.00,
    rewardUsd: 18.00,
    rewardNad: Math.round(18.00 * USD_TO_NAD_RATE * 100) / 100,
    duration: 2,
    estimatedTimeMin: 2,
    description: 'Give feedback on arthouse trailer editing, poster typography design, film festival buzz, and physical merchandise exclusivity.',
    status: 'active',
    created_at: '2026-06-26T16:00:00Z',
    category: 'Indie & Arthouse',
    available: true,
    completed: false,
    spotsLeft: 640,
    urgencyText: '✨ FILM FESTIVAL PICK',
    rating: 4.88,
    participantsCount: 8400,
    difficulty: 'Easy',
    badge: 'DIRECTOR CUT',
    imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'a24_q1',
        question: 'What usually draws your attention first to an indie or A24 theatrical film release?',
        type: 'single',
        answers: [
          'Distinctive, minimalist poster artwork and font design',
          'Unusual premise and atmospheric trailer teaser',
          'Praise and awards from film festivals (Cannes, Sundance, Venice)',
          'Director or lead auteur actor reputation'
        ]
      },
      {
        id: 'a24_q2',
        question: 'Which modern horror subgenre do you find most compelling?',
        type: 'single',
        answers: [
          'Folk horror & cult dread (Midsommar, The Witch)',
          'Psychological surrealism & grief metaphors (Hereditary)',
          'Creature features & sci-fi isolation (Alien, Annihilation)',
          'Slasher & retro 80s grindhouse (X, Pearl, MaXXXine)'
        ]
      },
      {
        id: 'a24_q3',
        question: 'Rate your willingness to attend limited-release independent films in boutique cinemas:',
        type: 'rating',
        answers: ['Rarely', 'Occasionally', 'Monthly', 'Frequent Cinephile', 'First Day Ticket Buyer']
      },
      {
        id: 'a24_q4',
        question: 'Do you collect physical cinema media (Special Edition Blu-rays, Screenplay books, Vinyl soundtracks)?',
        type: 'yesno',
        answers: ['Yes, physical cinema media collection is a passion', 'No, digital streaming only']
      }
    ]
  },
  {
    id: 'srv_the_batman_dc_noir',
    logo: '🦇',
    companyName: 'DC Studios',
    surveyName: 'The Batman Part II & Neo-Noir Cinema Trailer Reaction',
    title: 'The Batman Part II & Neo-Noir Cinema Trailer Reaction',
    company: 'DC Studios / Matt Reeves',
    reward: 22.00,
    rewardUsd: 22.00,
    rewardNad: Math.round(22.00 * USD_TO_NAD_RATE * 100) / 100,
    duration: 3,
    estimatedTimeMin: 3,
    description: 'Provide confidential viewer reaction to the Gotham City winter cinematography, Batmobile acoustics, and detective narrative complexity.',
    status: 'active',
    created_at: '2026-06-25T13:20:00Z',
    category: 'Neo-Noir & Comic Cinema',
    available: true,
    completed: false,
    spotsLeft: 710,
    urgencyText: '🌑 EARLY PREVIEW',
    rating: 4.82,
    participantsCount: 16400,
    difficulty: 'Easy',
    badge: 'CONFIDENTIAL SCREENING',
    imageUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'bat_q1',
        question: 'Which villain dynamic do you want explored in the cold, flooded Gotham City of Part II?',
        type: 'single',
        answers: [
          'Mr. Freeze with an emotional tragic romance backstory',
          'Court of Owls secret society pulling the strings',
          'The Penguin crime empire consolidating street power',
          'Hush / Bruce Wayne psychological mirror identity'
        ]
      },
      {
        id: 'bat_q2',
        question: 'How did the tactical, muscle-car style Batmobile engine roar sound in the screening sample?',
        type: 'single',
        answers: [
          'Terrifying and visceral — pure cinema perfection',
          'Very powerful, felt the low bass vibrations',
          'Exciting but slightly overpowering on treble',
          'Would prefer more high-tech gadgets'
        ]
      },
      {
        id: 'bat_q3',
        question: 'Rate the grungy, rain-soaked cinematography of Greig Fraser in modern crime cinema:',
        type: 'rating',
        answers: ['Too Dark', 'Average', 'Atmospheric', 'Stunning Film Noir', 'Oscar-Worthy Benchmark']
      },
      {
        id: 'bat_q4',
        question: 'Do you prefer standalone detective Elseworlds stories over interconnected multiverse universes?',
        type: 'yesno',
        answers: ['Yes, grounded standalone detective stories are superior', 'No, prefer large interconnected universes']
      }
    ]
  },
  {
    id: 'srv_streaming_habits_tech',
    logo: '📺',
    companyName: 'Global Stream Lab',
    surveyName: '4K Dolby Vision, Audio Latency & Binge Viewing Habits',
    title: '4K Dolby Vision, Audio Latency & Binge Viewing Habits',
    company: 'Global Cinema Stream Lab',
    reward: 10.00,
    rewardUsd: 10.00,
    rewardNad: Math.round(10.00 * USD_TO_NAD_RATE * 100) / 100,
    duration: 2,
    estimatedTimeMin: 2,
    description: 'Analyze home theater streaming tech: frame-rate matching, smart subtitle styling, ad-tier tolerance, and mobile offline viewing.',
    status: 'active',
    created_at: '2026-06-24T18:00:00Z',
    category: 'Streaming Tech & Habits',
    available: true,
    completed: false,
    spotsLeft: 920,
    urgencyText: '⚡ QUICK CRITIC TASK',
    rating: 4.7,
    participantsCount: 31200,
    difficulty: 'Easy',
    badge: 'TECH LAB AUDIT',
    imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'str_q1',
        question: 'On which device do you watch the majority of your movies and streaming series?',
        type: 'single',
        answers: [
          'Smart 4K TV (OLED / QLED) with soundbar/surround sound',
          'Laptop or Desktop computer screen',
          'Smartphone with headphones (on the go or bed)',
          'Tablet / iPad'
        ]
      },
      {
        id: 'str_q2',
        question: 'How do you react to streaming platforms adding 15-30 second unskippable commercial ads?',
        type: 'single',
        answers: [
          'Unacceptable, I cancel or upgrade to ad-free immediately',
          'Tolerable if the monthly subscription price is heavily discounted',
          'I mute the audio and check my phone during ads',
          'I do not mind short pauses'
        ]
      },
      {
        id: 'str_q3',
        question: 'How often do you keep subtitles on, even when watching movies in your native language?',
        type: 'single',
        answers: [
          'Always on (100% of the time, ensures I never miss dialogue)',
          'Frequently (especially for action or whispering scenes)',
          'Rarely (only when character accents are heavy)',
          'Never (distracts from the visual cinematography)'
        ]
      },
      {
        id: 'str_q4',
        question: 'Would you pay extra for IMAX Enhanced aspect ratio streaming at home?',
        type: 'yesno',
        answers: ['Yes, fills my 16:9 TV screen with extra picture', 'No, standard theatrical letterbox is fine']
      }
    ]
  },
  {
    id: 'srv_spiderverse_animation',
    logo: '🎨',
    companyName: 'Sony Pictures Animation',
    surveyName: 'Spider-Verse Beyond: Visual Shader & Art Style Panel',
    title: 'Spider-Verse Beyond: Visual Shader & Art Style Panel',
    company: 'Sony Pictures Animation',
    reward: 15.00,
    rewardUsd: 15.00,
    rewardNad: Math.round(15.00 * USD_TO_NAD_RATE * 100) / 100,
    duration: 3,
    estimatedTimeMin: 3,
    description: 'Critique experimental comic-book halftone shading, variable frame-rate animation pacing, and hip-hop orchestral soundtrack balance.',
    status: 'active',
    created_at: '2026-06-23T15:10:00Z',
    category: 'Animation & Visual Arts',
    available: true,
    completed: false,
    spotsLeft: 340,
    urgencyText: '🎨 ART GUILD REVIEW',
    rating: 4.96,
    participantsCount: 19800,
    difficulty: 'Easy',
    badge: 'ANIMATION BENCHMARK',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    questions: [
      {
        id: 'spv_q1',
        question: 'What do you consider the most revolutionary achievement of modern cinematic animation?',
        type: 'single',
        answers: [
          'Blending 2D hand-drawn ink lines with 3D CGI camera moves',
          'Unique art styles for each dimension (punk rock, watercolor, cyberpunk)',
          'Emotional character writing that rivals live-action drama',
          'Seamless integration of licensed soundtrack and orchestral themes'
        ]
      },
      {
        id: 'spv_q2',
        question: 'How do you feel about animated feature films receiving nominations for Best Picture at the Academy Awards?',
        type: 'single',
        answers: [
          'They should compete equally with live-action films',
          'Only exceptional masterpieces should cross over',
          'Keep them strictly in Best Animated Feature category'
        ]
      },
      {
        id: 'spv_q3',
        question: 'Rate your visual enjoyment of animated films in 3D glasses at a cinema:',
        type: 'rating',
        answers: ['Dislike 3D', 'Neutral', 'Fun Experience', 'Immersive & Vivid', 'Best Way to Experience Animation']
      },
      {
        id: 'spv_q4',
        question: 'Will you see the Spider-Verse conclusion on opening night in theaters?',
        type: 'yesno',
        answers: ['Yes, Day One cinema ticket guaranteed', 'Will wait for streaming release']
      }
    ]
  }
];
