import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTemplate(templateData: {
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  previewUrl: string;
  blueprints: Array<{
    position: number;
    componentKey: string;
    fixedConfig: Record<string, any>;
    editableSchema: Record<string, any>;
  }>;
}) {
  const template = await prisma.template.upsert({
    where: { slug: templateData.slug },
    update: {
      name: templateData.name,
      category: templateData.category,
      price: templateData.price,
      description: templateData.description,
      previewUrl: templateData.previewUrl,
      isActive: true,
    },
    create: {
      name: templateData.name,
      slug: templateData.slug,
      category: templateData.category,
      price: templateData.price,
      description: templateData.description,
      previewUrl: templateData.previewUrl,
      isActive: true,
    },
  });

  console.log(`✓ Template upserted: ${template.name} (${template.slug})`);

  // Delete existing blueprints for clean recreation
  await prisma.templatePageBlueprint.deleteMany({
    where: { templateId: template.id },
  });

  for (const bp of templateData.blueprints) {
    const created = await prisma.templatePageBlueprint.create({
      data: {
        templateId: template.id,
        position: bp.position,
        componentKey: bp.componentKey,
        fixedConfig: bp.fixedConfig,
        editableSchema: bp.editableSchema,
      },
    });
    console.log(`  [${bp.position}] Created blueprint ${bp.componentKey} (${created.id})`);
  }
}

async function main() {
  console.log("🌱 Seeding database with textured templates...");


  // ==========================================
  // 1. Neon Birthday Blast Template (Cyber & Dots)
  // Textures: cyber-grid, dots, subtle-noise
  // ==========================================
  await seedTemplate({
    name: "Neon Birthday Blast",
    slug: "birthday-blast",
    category: "Birthday Celebration",
    price: 4900, // ₹49
    description:
      "A high-energy, vibrant neon party tribute filled with confetti, dynamic compliments, and birthday wishes.",
    previewUrl: "/3.png",
    blueprints: [
      {
        position: 1,
        componentKey: "NOTIFICATION",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#06b6d4",
          cardBg: "rgba(22, 14, 45, 0.9)",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["🎉", "🥳"],
        },
        editableSchema: {
          title: "Birthday Protocol Alert",
          description: "A high-energy birthday dispatch on the lockscreen.",
          fields: [
            {
              name: "notificationTitle",
              label: "Notification Title",
              type: "text",
              required: true,
              default: "🚨 BIRTHDAY PROTOCOL ACTIVATED 🎂",
            },
            {
              name: "notificationText",
              label: "Notification Message",
              type: "textarea",
              required: true,
              default:
                "WARNING: Excessive celebrations, cake, and birthday cheers detected! Tap to unlock your VIP birthday experience.",
            },
            {
              name: "sender",
              label: "Sender / App Name",
              type: "text",
              required: false,
              default: "Party Headquarters",
            },
            {
              name: "time",
              label: "Subtitle / Time",
              type: "text",
              required: false,
              default: "Birthday Dispatch",
            },
            {
              name: "replyText",
              label: "Surprise Note (revealed on tap)",
              type: "text",
              required: false,
              default: "Level Up Complete! Another year of pure greatness 🚀",
            },
          ],
        },
      },
      {
        position: 2,
        componentKey: "DEFINITION",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#a855f7",
          cardBg: "rgba(22, 14, 45, 0.85)",
          backgroundTexture: "dots",
          emojiDecor: ["✨", "🌟"],
        },
        editableSchema: {
          title: "The Birthday Lexicon",
          description: "Define the birthday star in dictionary style.",
          fields: [
            {
              name: "word",
              label: "Special Word",
              type: "text",
              required: true,
              default: "Iconic",
            },
            {
              name: "phonetic",
              label: "Phonetic Pronunciation",
              type: "text",
              required: false,
              default: "/aɪˈkɑː.nɪk/",
            },
            {
              name: "partOfSpeech",
              label: "Part of Speech",
              type: "text",
              required: false,
              default: "adjective",
            },
            {
              name: "definition",
              label: "Your Personal Definition",
              type: "textarea",
              required: true,
              default:
                "Living life at maximum volume, lighting up every room entered, and aging like the finest wine known to humanity.",
            },
            {
              name: "exampleSentence",
              label: "Example Sentence or Memory",
              type: "text",
              required: false,
              default: "They literally invented the concept of main character energy.",
            },
            {
              name: "photoUrl",
              label: "Polaroid Photo",
              type: "image",
              required: true,
              default: "/3.png",
            },
          ],
        },
      },
      {
        position: 3,
        componentKey: "LOADING",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#fbbf24",
          cardBg: "rgba(22, 14, 45, 0.9)",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["🎊", "🥳"],
        },
        editableSchema: {
          title: "Birthday Vibe Calculation",
          description: "An electric loading calculation confirming VIP status.",
          fields: [
            {
              name: "loadingLabel",
              label: "Loading Stage Label",
              type: "text",
              required: true,
              default: "SYNCHRONIZING BIRTHDAY CAKE & CONFETTI...",
            },
            {
              name: "awardTitle",
              label: "Award / Result Title",
              type: "text",
              required: true,
              default: "LEGEND STATUS CONFIRMED",
            },
            {
              name: "rewardText",
              label: "Award Reason & Praise",
              type: "textarea",
              required: true,
              default:
                "All systems report 100% legendary vibes. You are officially licensed to eat all the cake and celebrate without limits!",
            },
            {
              name: "subtitle",
              label: "Subtitle / Note",
              type: "text",
              required: false,
              default: "Annual Birthday Certification",
            },
          ],
        },
      },
      {
        position: 4,
        componentKey: "CERTIFICATE",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#38bdf8",
          cardBg: "rgba(18, 12, 38, 0.95)",
          backgroundTexture: "paper-grain",
          emojiDecor: ["🎂", "🌟"],
        },
        editableSchema: {
          title: "Official Birthday Honor",
          description: "An official certificate honoring the birthday legend.",
          fields: [
            {
              name: "title",
              label: "Certificate Header",
              type: "text",
              required: true,
              default: "The Official Birthday Hall of Fame",
            },
            {
              name: "recipientName",
              label: "Birthday Star's Name",
              type: "text",
              required: true,
              default: "The Birthday Legend",
            },
            {
              name: "message",
              label: "Dedication Message",
              type: "textarea",
              required: true,
              default:
                "Certified for being an absolute superstar, bringing laughter to everyone around you, and mastering the art of being awesome.",
            },
            {
              name: "issuer",
              label: "Your Name / Crew",
              type: "text",
              required: true,
              default: "The Birthday Crew",
            },
            {
              name: "date",
              label: "Date",
              type: "text",
              required: false,
              default: "Birthday Edition",
            },
          ],
        },
      },
      {
        position: 5,
        componentKey: "LABELED_PHOTO",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#06b6d4",
          cardBg: "rgba(22, 14, 45, 0.9)",
          backgroundTexture: "dots",
          emojiDecor: ["✨", "🎉"],
        },
        editableSchema: {
          title: "Anatomy of the Birthday Star",
          description: "A fun annotated breakdown of the birthday star.",
          fields: [
            {
              name: "title",
              label: "Section Title",
              type: "text",
              required: false,
              default: "Anatomy of the Birthday Star",
            },
            {
              name: "subtitle",
              label: "Section Subtitle",
              type: "text",
              required: false,
              default: "A scientific breakdown of your legendary existence",
            },
            {
              name: "photoUrl",
              label: "Photo to Annotate",
              type: "image",
              required: true,
              default: "/1.png",
            },
            {
              name: "label1",
              label: "Label 1 (Top Left)",
              type: "text",
              required: true,
              default: "Main character energy",
            },
            {
              name: "label2",
              label: "Label 2 (Top Right)",
              type: "text",
              required: true,
              default: "Ready for cake 24/7",
            },
            {
              name: "label3",
              label: "Label 3 (Bottom Left)",
              type: "text",
              required: true,
              default: "Unstoppable dance moves",
            },
            {
              name: "label4",
              label: "Label 4 (Bottom Right)",
              type: "text",
              required: true,
              default: "Heart of gold",
            },
          ],
        },
      },
      {
        position: 6,
        componentKey: "SEARCH",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#a855f7",
          cardBg: "rgba(22, 14, 45, 0.85)",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["🥳", "🎊"],
        },
        editableSchema: {
          title: "Search Results for the Birthday Star",
          description: "Top 3 party and celebration highlights.",
          fields: [
            {
              name: "searchQuery",
              label: "Search Bar Query",
              type: "text",
              required: true,
              default: "why is today the best day of the year?",
            },
            {
              name: "resultsCount",
              label: "Results Counter Text",
              type: "text",
              required: false,
              default: "Found 3 unforgettable party highlights",
            },
            {
              name: "photo1",
              label: "Highlight 1 Photo",
              type: "image",
              required: true,
              default: "/3.png",
            },
            {
              name: "title1",
              label: "Highlight 1 Title",
              type: "text",
              required: false,
              default: "Another Year Cooler",
            },
            {
              name: "photo2",
              label: "Highlight 2 Photo",
              type: "image",
              required: true,
              default: "/1.png",
            },
            {
              name: "title2",
              label: "Highlight 2 Title",
              type: "text",
              required: false,
              default: "Wildest Moments",
            },
            {
              name: "photo3",
              label: "Highlight 3 Photo",
              type: "image",
              required: true,
              default: "/2.png",
            },
            {
              name: "title3",
              label: "Highlight 3 Title",
              type: "text",
              required: false,
              default: "Making Unforgettable Memories",
            },
          ],
        },
      },
      {
        position: 7,
        componentKey: "LETTER",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#06b6d4",
          cardBg: "rgba(22, 14, 45, 0.9)",
          backgroundTexture: "subtle-noise",
          emojiDecor: ["🎂", "💖"],
        },
        editableSchema: {
          title: "A Birthday Wish for You",
          description: "A heartfelt birthday card message.",
          fields: [
            {
              name: "recipientName",
              label: "Dear...",
              type: "text",
              required: true,
              default: "Birthday Star",
            },
            {
              name: "message",
              label: "Your Message",
              type: "textarea",
              required: true,
              default:
                "Happy Birthday!\n\nWishing you a year filled with big wins, wild adventures, endless laughter, and all the happiness you deserve.\n\nMay this year be your best one yet!",
            },
            {
              name: "senderName",
              label: "With love, (Your Name)",
              type: "text",
              required: true,
              default: "Cheers & Hugs,",
            },
            {
              name: "date",
              label: "Date / Header Note",
              type: "text",
              required: false,
              default: "Best Wishes Always",
            },
            {
              name: "photoUrl",
              label: "Attached Photo (optional)",
              type: "image",
              required: false,
              default: "/3.png",
            },
          ],
        },
      },
    ],
  });

  // ==========================================
  // 2. Secret Surprises & Mystery Notes Template (Light / Pastel / Interactive)
  // Featuring PICK_REVEAL interactive choice pages
  // ==========================================
  await seedTemplate({
    name: "Secret Surprises",
    slug: "secret-surprises",
    category: "Surprise",
    price: 4900, // ₹49
    description:
      "A delightful interactive mystery story on warm aesthetic beige canvas. Scratch to uncover secret notes, tap cute bears and message bottles, and explore glowing pink memory surprises.",
    previewUrl: "/2.png",
    blueprints: [
      {
        position: 1,
        componentKey: "SCRATCH_REVEAL",
        fixedConfig: {
          backgroundColor: "#F7F2EA",
          textColor: "#2D1822",
          accentColor: "#f43f5e",
          accentTextColor: "#e11d48",
          cardBg: "rgba(255, 255, 255, 0.96)",
          backgroundTexture: "paper-grain",
          emojiDecor: ["💌", "✨"],
        },
        editableSchema: {
          title: "Scratch & Reveal Opener",
          description: "An interactive foil scratch card revealing your secret opener.",
          fields: [
            {
              name: "title",
              label: "Revealed Title",
              type: "text",
              required: true,
              default: "A Secret Story For You 💖",
            },
            {
              name: "subtitle",
              label: "Opener Tagline",
              type: "text",
              required: true,
              default: "Someone created a mystery just for you",
            },
            {
              name: "secretMessage",
              label: "Secret Message",
              type: "textarea",
              required: true,
              default:
                "Every great memory begins with a spark.\nUnfold the surprises waiting for you inside!",
            },
            {
              name: "sender",
              label: "Sender Label",
              type: "text",
              required: false,
              default: "MysteryFlix Surprise 🎁",
            },
            {
              name: "photoUrl",
              label: "Preview Photo (optional)",
              type: "image",
              required: false,
              default: "/2.png",
            },
          ],
        },
      },
      {
        position: 2,
        componentKey: "PICK_REVEAL",
        fixedConfig: {
          backgroundColor: "#F7F2EA",
          textColor: "#2D1822",
          accentColor: "#f43f5e",
          accentTextColor: "#e11d48",
          cardBg: "rgba(255, 255, 255, 0.95)",
          backgroundTexture: "paper-grain",
          characterSet: "bears",
          emojiDecor: ["🐻", "💕"],
        },
        editableSchema: {
          title: "Bear's Secret Notes",
          description: "Choose 1 of 3 cute bears to unfold a hidden note.",
          fields: [
            {
              name: "prompt",
              label: "Prompt Text",
              type: "text",
              required: true,
              default: "Pick one to open 🐻",
            },
            {
              name: "option1Text",
              label: "Bear 1 Secret Message",
              type: "textarea",
              required: true,
              default: "You have the warmest energy in any room we walk into ✨",
            },
            {
              name: "option1Photo",
              label: "Bear 1 Photo (optional)",
              type: "image",
              required: false,
              default: "/1.png",
            },
            {
              name: "option2Text",
              label: "Bear 2 Secret Message",
              type: "textarea",
              required: true,
              default: "Remember our midnight conversations? They're my favorite memories 🌙",
            },
            {
              name: "option2Photo",
              label: "Bear 2 Photo (optional)",
              type: "image",
              required: false,
              default: "/2.png",
            },
            {
              name: "option3Text",
              label: "Bear 3 Secret Message",
              type: "textarea",
              required: true,
              default: "Through every high and low, I am forever grateful for you ❤️",
            },
            {
              name: "option3Photo",
              label: "Bear 3 Photo (optional)",
              type: "image",
              required: false,
              default: "/3.png",
            },
          ],
        },
      },
      {
        position: 3,
        componentKey: "LABELED_PHOTO",
        fixedConfig: {
          backgroundColor: "#F7F2EA",
          textColor: "#2D1822",
          accentColor: "#f43f5e",
          cardBg: "rgba(255, 255, 255, 0.96)",
          backgroundTexture: "dots",
          emojiDecor: ["📸", "✨"],
        },
        editableSchema: {
          title: "Anatomy of Our Favorite Day",
          description: "Break down a memorable photo with interactive callouts.",
          fields: [
            {
              name: "title",
              label: "Page Title",
              type: "text",
              required: true,
              default: "Anatomy of a Perfect Day",
            },
            {
              name: "subtitle",
              label: "Subtitle",
              type: "text",
              required: false,
              default: "Every little detail captured in time",
            },
            {
              name: "photoUrl",
              label: "Featured Photo",
              type: "image",
              required: true,
              default: "/2.png",
            },
            {
              name: "label1",
              label: "Callout 1",
              type: "text",
              required: true,
              default: "Your genuine bright smile",
            },
            {
              name: "label2",
              label: "Callout 2",
              type: "text",
              required: true,
              default: "The sunlit view behind us",
            },
            {
              name: "label3",
              label: "Callout 3",
              type: "text",
              required: true,
              default: "Uncontrollable laughter",
            },
            {
              name: "label4",
              label: "Callout 4",
              type: "text",
              required: true,
              default: "A memory we will keep forever",
            },
          ],
        },
      },
      {
        position: 4,
        componentKey: "PICK_REVEAL",
        fixedConfig: {
          backgroundColor: "#F7F2EA",
          textColor: "#2D1822",
          accentColor: "#0d9488",
          accentTextColor: "#0f766e",
          cardBg: "rgba(255, 255, 255, 0.95)",
          backgroundTexture: "linen",
          characterSet: "bottles",
          emojiDecor: ["🍾", "🔮"],
        },
        editableSchema: {
          title: "Message in a Bottle",
          description: "Pick 1 of 3 message bottles to uncork a special wish.",
          fields: [
            {
              name: "prompt",
              label: "Prompt Text",
              type: "text",
              required: true,
              default: "Pick a bottle to uncork its secret 🍾",
            },
            {
              name: "option1Text",
              label: "Bottle 1 Wish / Message",
              type: "textarea",
              required: true,
              default: "Wandering with you makes every ordinary street look like an adventure 🌊",
            },
            {
              name: "option1Photo",
              label: "Bottle 1 Photo (optional)",
              type: "image",
              required: false,
              default: "/3.png",
            },
            {
              name: "option2Text",
              label: "Bottle 2 Wish / Message",
              type: "textarea",
              required: true,
              default: "Here's to a lifetime of late-night laughing fits and impromptu road trips 🚗",
            },
            {
              name: "option2Photo",
              label: "Bottle 2 Photo (optional)",
              type: "image",
              required: false,
              default: "/1.png",
            },
            {
              name: "option3Text",
              label: "Bottle 3 Wish / Message",
              type: "textarea",
              required: true,
              default: "May every wish you hold close to your heart come true in the most magical way ✨",
            },
            {
              name: "option3Photo",
              label: "Bottle 3 Photo (optional)",
              type: "image",
              required: false,
              default: "/2.png",
            },
          ],
        },
      },
      {
        position: 5,
        componentKey: "LETTER",
        fixedConfig: {
          backgroundColor: "#F7F2EA",
          textColor: "#2D1822",
          accentColor: "#f43f5e",
          cardBg: "rgba(255, 255, 255, 0.95)",
          backgroundTexture: "paper-grain",
          emojiDecor: ["💌", "💕"],
        },
        editableSchema: {
          title: "Heartfelt Final Letter",
          description: "A beautiful personalized letter with attached memory.",
          fields: [
            {
              name: "recipientName",
              label: "Dear...",
              type: "text",
              required: true,
              default: "My Favorite Person",
            },
            {
              name: "message",
              label: "Your Message",
              type: "textarea",
              required: true,
              default:
                "Thank you for being the person who makes life so much brighter, funnier, and more meaningful.\n\nI created this little story to remind you of just how much you mean to me. Keep shining always!",
            },
            {
              name: "senderName",
              label: "With love, (Your Name)",
              type: "text",
              required: true,
              default: "Yours Always ❤️",
            },
            {
              name: "date",
              label: "Date / Header Note",
              type: "text",
              required: false,
              default: "Forever & Always",
            },
            {
              name: "photoUrl",
              label: "Attached Photo (optional)",
              type: "image",
              required: false,
              default: "/1.png",
            },
          ],
        },
      },
    ],
  });

  // ==========================================
  // 3. Surprise in an Envelope (data-driven branching-scene experience)
  // Cohesive warm rose-gold "party" palette across every scene — deep
  // rose-black background + rose/gold accents throughout, so it reads as
  // one premium experience instead of a patchwork of clashing screens.
  // Envelope open -> Yes/No question (No loops to a "how dare you" gag)
  // -> accept -> gift pick -> photo reveal -> confetti.
  // ==========================================
  await seedTemplate({
    name: "Surprise in an Envelope",
    slug: "birthday-envelope-surprise",
    category: "Birthday Celebration",
    price: 5900, // ₹59
    description:
      "A wax-sealed envelope opens into a branching, click-driven birthday surprise — dare to say no and you'll be sent right back to the question.",
    previewUrl: "/1.png",
    blueprints: [
      {
        position: 1,
        componentKey: "SCENE_ENVELOPE",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fb7185",
          sceneId: "envelope",
          isEntry: true,
          next: "question",
          backgroundTexture: "roses",
          emojiDecor: ["💕", "✨", "🐻"],
        },
        editableSchema: {
          title: "The Envelope",
          description: "The opening moment, before the surprise unfolds.",
          fields: [
            { name: "recipientName", label: "Recipient's Name", type: "text", required: true, default: "Ananya" },
            { name: "openingNote", label: "Note on the opened letter", type: "textarea", required: false, default: "A little surprise, just for you..." },
            { name: "accentColor", label: "Seal & Glow Color", type: "color", required: false, default: "#fb7185" },
          ],
        },
      },
      {
        position: 2,
        componentKey: "SCENE_YESNO_QUESTION",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fb7185",
          sceneId: "question",
          fontId: "quicksand",
          choices: [
            { key: "yes", label: "YES", targetSceneId: "accept" },
            { key: "no", label: "NO", targetSceneId: "reaction" },
          ],
          backgroundTexture: "roses",
          emojiDecor: ["🎈", "✨", "💖"],
        },
        editableSchema: {
          title: "The Big Question",
          description: "They tap YES or NO — NO bounces to a funny reaction and loops back here.",
          fields: [
            { name: "questionText", label: "Question", type: "text", required: true, default: "Wanna see what I made?" },
            { name: "recipientName", label: "Recipient's Name (small tag above)", type: "text", required: false, default: "Ananya" },
          ],
        },
      },
      {
        position: 3,
        componentKey: "SCENE_REACTION_GAG",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          accentColor: "#fb923c",
          sceneId: "reaction",
          fontId: "righteous",
          next: "question",
          backgroundTexture: "roses",
          emojiDecor: ["😤", "😠"],
        },
        editableSchema: {
          title: "The \"How Dare You\" Reaction",
          description: "Shown only if they tap NO — the try-again button loops back to the question.",
          fields: [
            { name: "reactionTitle", label: "Reaction Headline", type: "text", required: false, default: "HOW DARE YOU!" },
            {
              name: "reactionSubtitle",
              label: "Reaction Subtext",
              type: "text",
              required: false,
              default: "That was the wrong answer. Try again... please 🥺",
            },
          ],
        },
      },
      {
        position: 4,
        componentKey: "SCENE_MESSAGE_BEAT",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fb7185",
          sceneId: "accept",
          fontId: "quicksand",
          next: "memory1",
          backgroundTexture: "roses",
          emojiDecor: ["🎉", "💖", "🐻"],
        },
        editableSchema: {
          title: "Accepting the Surprise",
          description: "A short beat before the gifts appear.",
          fields: [
            { name: "message", label: "Message", type: "textarea", required: true, default: "Get ready... I made something just for you." },
            { name: "ctaLabel", label: "Button Label", type: "text", required: false, default: "Show me!" },
          ],
        },
      },
      {
        position: 5,
        componentKey: "SCENE_PHOTO_MOMENT",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fb7185",
          sceneId: "memory1",
          next: "memory2",
          side: "left",
          cornerSticker: "💕",
          backgroundTexture: "roses",
          fontId: "dancing-script",
          emojiDecor: ["✨", "🐻"],
        },
        editableSchema: {
          title: "Memory 1 of 3 (full-screen photo moment)",
          description: "A big torn-edge photo on the left, a note on the right.",
          fields: [
            { name: "heading", label: "Heading", type: "text", required: false, default: "The day it all began" },
            { name: "message", label: "Note", type: "textarea", required: true, default: "I still remember exactly how it felt — like the whole day got a little brighter." },
            { name: "photoUrl", label: "Photo", type: "image", required: true, default: "/1.png" },
            { name: "accentColor", label: "Accent Color", type: "color", required: false, default: "#fb7185" },
          ],
        },
      },
      {
        position: 6,
        componentKey: "SCENE_PHOTO_MOMENT",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fbbf24",
          sceneId: "memory2",
          next: "memory3",
          side: "right",
          cornerSticker: "🌟",
          backgroundTexture: "roses",
          fontId: "quicksand",
          emojiDecor: ["🎈", "💛"],
        },
        editableSchema: {
          title: "Memory 2 of 3 (full-screen photo moment)",
          description: "A big torn-edge photo on the right, a note on the left.",
          fields: [
            { name: "heading", label: "Heading", type: "text", required: false, default: "The one that always makes me laugh" },
            { name: "message", label: "Note", type: "textarea", required: true, default: "No context needed — just look at this and try not to smile." },
            { name: "photoUrl", label: "Photo", type: "image", required: true, default: "/2.png" },
            { name: "accentColor", label: "Accent Color", type: "color", required: false, default: "#fbbf24" },
          ],
        },
      },
      {
        position: 7,
        componentKey: "SCENE_PHOTO_MOMENT",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fb7185",
          sceneId: "memory3",
          next: "gifts",
          side: "left",
          cornerSticker: "💖",
          characterSticker: "panda-sleep",
          backgroundTexture: "roses",
          fontId: "pacifico",
          emojiDecor: ["💕", "✨"],
        },
        editableSchema: {
          title: "Memory 3 of 3 (full-screen photo moment)",
          description: "A big torn-edge photo on the left, a note on the right.",
          fields: [
            { name: "heading", label: "Heading", type: "text", required: false, default: "Right here, right now" },
            { name: "message", label: "Note", type: "textarea", required: true, default: "Whatever else happens this year, I hope you know how much you're loved." },
            { name: "photoUrl", label: "Photo", type: "image", required: true, default: "/3.png" },
            { name: "accentColor", label: "Accent Color", type: "color", required: false, default: "#fb7185" },
          ],
        },
      },
      {
        position: 8,
        componentKey: "SCENE_GIFT_PICKER",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          accentColor: "#fbbf24",
          sceneId: "gifts",
          fontId: "fredoka",
          choices: [
            { key: "gift1", label: "Memory", targetSceneId: "reveal-memory" },
            { key: "gift2", label: "Teddy", targetSceneId: "reveal-teddy" },
            { key: "gift3", label: "Moment", targetSceneId: "reveal-moment" },
          ],
          animationPreset: "ribboned-boxes",
          itemCount: 3,
          backgroundTexture: "roses",
          emojiDecor: ["🎉", "🎊", "✨"],
        },
        editableSchema: {
          title: "Pick a Gift",
          description: "3 clickable gift boxes — each one opens a different surprise, so replaying with a different pick shows something new.",
          fields: [
            { name: "prompt", label: "Prompt", type: "text", required: false, default: "Pick one to open 🎁" },
            { name: "gift1Label", label: "Gift 1 Label", type: "text", required: false, default: "Memory" },
            { name: "gift2Label", label: "Gift 2 Label", type: "text", required: false, default: "Teddy" },
            { name: "gift3Label", label: "Gift 3 Label", type: "text", required: false, default: "Moment" },
            { name: "accentColor", label: "Gift Color", type: "color", required: false, default: "#fbbf24" },
          ],
        },
      },
      {
        position: 9,
        componentKey: "SCENE_MESSAGE_BEAT",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fb7185",
          sceneId: "reveal-memory",
          fontId: "dancing-script",
          next: "finale",
          backgroundTexture: "roses",
          emojiDecor: ["📸", "💗"],
        },
        editableSchema: {
          title: "The Memory Reveal (opens if \"Memory\" is picked)",
          description: "A favorite photo with a caption.",
          fields: [
            { name: "title", label: "Heading", type: "text", required: false, default: "A memory worth reliving" },
            { name: "message", label: "Caption", type: "textarea", required: true, default: "This moment with you is one I'll treasure forever." },
            { name: "photoUrl", label: "Photo", type: "image", required: true, default: "/1.png" },
            { name: "ctaLabel", label: "Button Label", type: "text", required: false, default: "Continue" },
          ],
        },
      },
      {
        position: 10,
        componentKey: "SCENE_MESSAGE_BEAT",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fbbf24",
          sceneId: "reveal-teddy",
          fontId: "dancing-script",
          next: "finale",
          backgroundTexture: "roses",
          emojiDecor: ["🐻", "💛"],
        },
        editableSchema: {
          title: "The Teddy Reveal (opens if \"Teddy\" is picked)",
          description: "A cozy, comforting note.",
          fields: [
            { name: "title", label: "Heading", type: "text", required: false, default: "A hug, whenever you need one" },
            { name: "message", label: "Caption", type: "textarea", required: true, default: "Here's a little teddy hug to remind you I'm always in your corner. 🧸" },
            { name: "photoUrl", label: "Photo", type: "image", required: false, default: "" },
            { name: "ctaLabel", label: "Button Label", type: "text", required: false, default: "Continue" },
          ],
        },
      },
      {
        position: 11,
        componentKey: "SCENE_MESSAGE_BEAT",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          textColor: "#fff1f2",
          accentColor: "#fb7185",
          sceneId: "reveal-moment",
          fontId: "dancing-script",
          next: "finale",
          backgroundTexture: "roses",
          emojiDecor: ["✨", "💖"],
        },
        editableSchema: {
          title: "The Moment Reveal (opens if \"Moment\" is picked)",
          description: "A sweet, present-tense note.",
          fields: [
            { name: "title", label: "Heading", type: "text", required: false, default: "Right here, right now" },
            { name: "message", label: "Caption", type: "textarea", required: true, default: "Every little moment with you turns into my favorite memory." },
            { name: "photoUrl", label: "Photo", type: "image", required: false, default: "" },
            { name: "ctaLabel", label: "Button Label", type: "text", required: false, default: "Continue" },
          ],
        },
      },
      {
        position: 12,
        componentKey: "SCENE_CONFETTI_FINALE",
        fixedConfig: {
          backgroundColor: "#1b0a12",
          accentColor: "#fb7185",
          sceneId: "finale",
          fontId: "pacifico",
          next: "envelope",
          animationPreset: "paper-confetti",
          backgroundTexture: "roses",
          emojiDecor: ["🎉", "💖", "🎈"],
          characterSticker: "panda-popcorn",
        },
        editableSchema: {
          title: "The Final Wish",
          description: "Closing message with a confetti burst. \"Replay\" loops back to the envelope.",
          fields: [
            {
              name: "finalMessage",
              label: "Final Message",
              type: "textarea",
              required: true,
              default: "May all the good things you've been waiting for\nfinally find you this year.\n\nHappy Birthday. 🎂",
            },
            { name: "senderName", label: "From", type: "text", required: false, default: "With love" },
            { name: "accentColor", label: "Confetti Accent", type: "color", required: false, default: "#fb7185" },
          ],
        },
      },
    ],
  });

  // ==========================================
  // 4. Countdown Confetti Blast (data-driven branching-scene experience)
  // Neon/party theme, deliberately different opening mechanic (scratch-off
  // countdown instead of an envelope) — proves 2 templates can share the
  // same scene-type library while feeling completely different.
  // ==========================================
  await seedTemplate({
    name: "Countdown Confetti Blast",
    slug: "birthday-countdown-blast",
    category: "Birthday Celebration",
    price: 5900, // ₹59
    description:
      "Scratch off a foil card to trigger a glowing 3-2-1 countdown, pick a mystery orb, and blast into a neon confetti finale.",
    previewUrl: "/3.png",
    blueprints: [
      {
        position: 1,
        componentKey: "SCENE_SCRATCH_COUNTDOWN",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#22d3ee",
          sceneId: "countdown",
          fontId: "righteous",
          isEntry: true,
          next: "question",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["✨", "💫", "🎉"],
        },
        editableSchema: {
          title: "Scratch to Start",
          description: "Scratching the foil card triggers a glowing 3-2-1 countdown.",
          fields: [
            { name: "title", label: "Scratch Card Title", type: "text", required: false, default: "Scratch to start the countdown" },
            { name: "subtitle", label: "Hint Text", type: "text", required: false, default: "Drag or tap anywhere to uncover" },
          ],
        },
      },
      {
        position: 2,
        componentKey: "SCENE_YESNO_QUESTION",
        fixedConfig: {
          backgroundColor: "#130a2e",
          textColor: "#f8fafc",
          accentColor: "#22d3ee",
          sceneId: "question",
          fontId: "bebas-neue",
          choices: [
            { key: "yes", label: "YES", targetSceneId: "memory1" },
            { key: "no", label: "NO", targetSceneId: "reaction" },
          ],
          backgroundTexture: "cyber-grid",
          emojiDecor: ["🎊", "💜", "✨"],
        },
        editableSchema: {
          title: "The Big Question",
          description: "They tap YES or NO — NO bounces to a reaction and loops back here.",
          fields: [
            { name: "questionText", label: "Question", type: "text", required: true, default: "Ready to see your neon surprise?" },
            { name: "recipientName", label: "Recipient's Name (small tag above)", type: "text", required: false, default: "" },
          ],
        },
      },
      {
        position: 3,
        componentKey: "SCENE_REACTION_GAG",
        fixedConfig: {
          backgroundColor: "#130a2e",
          accentColor: "#f472b6",
          sceneId: "reaction",
          fontId: "righteous",
          next: "question",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["😤", "😠"],
        },
        editableSchema: {
          title: "The Reaction",
          description: "Shown only if they tap NO — the try-again button loops back to the question.",
          fields: [
            { name: "reactionTitle", label: "Reaction Headline", type: "text", required: false, default: "NOT YET!" },
            { name: "reactionSubtitle", label: "Reaction Subtext", type: "text", required: false, default: "Wrong button — try again ✨" },
          ],
        },
      },
      {
        position: 4,
        componentKey: "SCENE_PHOTO_MOMENT",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#22d3ee",
          sceneId: "memory1",
          next: "memory2",
          side: "left",
          cornerSticker: "🌟",
          backgroundTexture: "cyber-grid",
          fontId: "poppins",
          emojiDecor: ["✨", "💫"],
        },
        editableSchema: {
          title: "Memory 1 of 3 (full-screen photo moment)",
          description: "A big torn-edge photo on the left, a note on the right.",
          fields: [
            { name: "heading", label: "Heading", type: "text", required: false, default: "Turning up the energy" },
            { name: "message", label: "Note", type: "textarea", required: true, default: "This is the kind of energy you bring wherever you go." },
            { name: "photoUrl", label: "Photo", type: "image", required: true, default: "/1.png" },
            { name: "accentColor", label: "Accent Color", type: "color", required: false, default: "#22d3ee" },
          ],
        },
      },
      {
        position: 5,
        componentKey: "SCENE_PHOTO_MOMENT",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#a855f7",
          sceneId: "memory2",
          next: "memory3",
          side: "right",
          cornerSticker: "🎊",
          backgroundTexture: "cyber-grid",
          fontId: "outfit",
          emojiDecor: ["🎉", "💜"],
        },
        editableSchema: {
          title: "Memory 2 of 3 (full-screen photo moment)",
          description: "A big torn-edge photo on the right, a note on the left.",
          fields: [
            { name: "heading", label: "Heading", type: "text", required: false, default: "Iconic, honestly" },
            { name: "message", label: "Note", type: "textarea", required: true, default: "No caption does this one justice. You just had to be there." },
            { name: "photoUrl", label: "Photo", type: "image", required: true, default: "/2.png" },
            { name: "accentColor", label: "Accent Color", type: "color", required: false, default: "#a855f7" },
          ],
        },
      },
      {
        position: 6,
        componentKey: "SCENE_PHOTO_MOMENT",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#f472b6",
          sceneId: "memory3",
          next: "gifts",
          side: "left",
          cornerSticker: "💜",
          characterSticker: "panda-popcorn",
          backgroundTexture: "cyber-grid",
          fontId: "righteous",
          emojiDecor: ["🐼", "✨"],
        },
        editableSchema: {
          title: "Memory 3 of 3 (full-screen photo moment)",
          description: "A big torn-edge photo on the left, a note on the right.",
          fields: [
            { name: "heading", label: "Heading", type: "text", required: false, default: "Here's to another one" },
            { name: "message", label: "Note", type: "textarea", required: true, default: "Cheers to a year that's even louder, brighter, and better than the last." },
            { name: "photoUrl", label: "Photo", type: "image", required: true, default: "/3.png" },
            { name: "accentColor", label: "Accent Color", type: "color", required: false, default: "#f472b6" },
          ],
        },
      },
      {
        position: 7,
        componentKey: "SCENE_GIFT_PICKER",
        fixedConfig: {
          backgroundColor: "#0b0817",
          accentColor: "#a855f7",
          sceneId: "gifts",
          fontId: "outfit",
          choices: [
            { key: "gift1", label: "Spark", targetSceneId: "reveal-spark" },
            { key: "gift2", label: "Glow", targetSceneId: "reveal-glow" },
            { key: "gift3", label: "Shine", targetSceneId: "reveal-shine" },
          ],
          animationPreset: "glowing-orbs",
          itemCount: 3,
          backgroundTexture: "cyber-grid",
          emojiDecor: ["🎉", "✨", "🐼"],
        },
        editableSchema: {
          title: "Pick an Orb",
          description: "3 glowing orbs — each one opens a different surprise, so replaying with a different pick shows something new.",
          fields: [
            { name: "prompt", label: "Prompt", type: "text", required: false, default: "Pick an orb to unlock ✨" },
            { name: "gift1Label", label: "Orb 1 Label", type: "text", required: false, default: "Spark" },
            { name: "gift2Label", label: "Orb 2 Label", type: "text", required: false, default: "Glow" },
            { name: "gift3Label", label: "Orb 3 Label", type: "text", required: false, default: "Shine" },
            { name: "accentColor", label: "Orb Color", type: "color", required: false, default: "#a855f7" },
          ],
        },
      },
      {
        position: 8,
        componentKey: "SCENE_MESSAGE_BEAT",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#22d3ee",
          sceneId: "reveal-spark",
          fontId: "poppins",
          next: "finale",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["📸", "💫"],
        },
        editableSchema: {
          title: "The Spark Reveal (opens if \"Spark\" is picked)",
          description: "A favorite photo with a caption.",
          fields: [
            { name: "title", label: "Heading", type: "text", required: false, default: "This one's for you" },
            { name: "message", label: "Caption", type: "textarea", required: true, default: "Another year of pure, unstoppable main-character energy." },
            { name: "photoUrl", label: "Photo", type: "image", required: true, default: "/3.png" },
            { name: "ctaLabel", label: "Button Label", type: "text", required: false, default: "Let's go" },
          ],
        },
      },
      {
        position: 9,
        componentKey: "SCENE_MESSAGE_BEAT",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#a855f7",
          sceneId: "reveal-glow",
          fontId: "poppins",
          next: "finale",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["💜", "✨"],
        },
        editableSchema: {
          title: "The Glow Reveal (opens if \"Glow\" is picked)",
          description: "A short, warm note.",
          fields: [
            { name: "title", label: "Heading", type: "text", required: false, default: "You light up every room" },
            { name: "message", label: "Caption", type: "textarea", required: true, default: "No filter, no funny angle needed — you're just naturally glowing." },
            { name: "photoUrl", label: "Photo", type: "image", required: false, default: "" },
            { name: "ctaLabel", label: "Button Label", type: "text", required: false, default: "Let's go" },
          ],
        },
      },
      {
        position: 10,
        componentKey: "SCENE_MESSAGE_BEAT",
        fixedConfig: {
          backgroundColor: "#0b0817",
          textColor: "#f8fafc",
          accentColor: "#f472b6",
          sceneId: "reveal-shine",
          fontId: "poppins",
          next: "finale",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["🎊", "🌟"],
        },
        editableSchema: {
          title: "The Shine Reveal (opens if \"Shine\" is picked)",
          description: "A short, hype note.",
          fields: [
            { name: "title", label: "Heading", type: "text", required: false, default: "Main character energy, confirmed" },
            { name: "message", label: "Caption", type: "textarea", required: true, default: "Here's to another year of you being effortlessly, unapologetically iconic." },
            { name: "photoUrl", label: "Photo", type: "image", required: false, default: "" },
            { name: "ctaLabel", label: "Button Label", type: "text", required: false, default: "Let's go" },
          ],
        },
      },
      {
        position: 11,
        componentKey: "SCENE_CONFETTI_FINALE",
        fixedConfig: {
          backgroundColor: "#0b0817",
          accentColor: "#22d3ee",
          sceneId: "finale",
          fontId: "righteous",
          next: "countdown",
          animationPreset: "neon-burst",
          backgroundTexture: "cyber-grid",
          emojiDecor: ["🎉", "🐻", "💜", "🎊"],
        },
        editableSchema: {
          title: "The Finale",
          description: "Closing message with a neon confetti burst. \"Replay\" loops back to the start.",
          fields: [
            {
              name: "finalMessage",
              label: "Final Message",
              type: "textarea",
              required: true,
              default: "Wishing you a year filled with big wins,\nwild adventures, and endless neon nights.\n\nHappy Birthday! 🎉",
            },
            { name: "senderName", label: "From", type: "text", required: false, default: "Your party crew" },
            { name: "accentColor", label: "Confetti Accent", type: "color", required: false, default: "#22d3ee" },
          ],
        },
      },
    ],
  });

  console.log("\n✅ All 4 templates seeded — including 2 data-driven branching Birthday experiences!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
