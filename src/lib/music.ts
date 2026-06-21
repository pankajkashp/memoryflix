export type MusicTrack = {
  id: string;
  title: string;
  emoji: string;
  url: string;
};

export const MUSIC_TRACKS: MusicTrack[] = [
  { 
    id: "romantic_piano", 
    title: "Romantic Piano", 
    emoji: "❤️", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  },
  { 
    id: "wedding_strings", 
    title: "Wedding Strings", 
    emoji: "💍", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
  },
  { 
    id: "travel_adventure", 
    title: "Travel Adventure", 
    emoji: "✈️", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" 
  },
  {
    id: "sunset_memories",
    title: "Sunset Memories",
    emoji: "🌅",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3"
  },
  { 
    id: "celebration", 
    title: "Celebration", 
    emoji: "🎂", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" 
  },
  { 
    id: "family_memories", 
    title: "Family Memories", 
    emoji: "👨‍👩‍👧", 
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" 
  },
];
