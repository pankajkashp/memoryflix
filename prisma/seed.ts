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
  // 1. Friendship Day Template (Pastel & Playful)
  // Textures: soft-stripes, dots, paper-grain
  // ==========================================
  await seedTemplate({
    name: "Friendship Day",
    slug: "friendship-day",
    category: "Friendship",
    price: 4900, // ₹49
    description:
      "Celebrate your closest bond with an interactive, cinematic tribute designed to make your best friend smile, laugh, and cherish your journey together.",
    previewUrl: "/1.png",
    blueprints: [
      {
        position: 1,
        componentKey: "NOTIFICATION",
        fixedConfig: {
          backgroundColor: "#0c0a09",
          textColor: "#fafafa",
          accentColor: "#f43f5e",
          cardBg: "rgba(24, 24, 27, 0.9)",
          backgroundTexture: "soft-stripes",
        },
        editableSchema: {
          title: "Priority Notification",
          description: "A fun notification that appears on a phone lockscreen.",
          fields: [
            {
              name: "notificationTitle",
              label: "Notification Title",
              type: "text",
              required: true,
              default: "Priority Delivery for Best Friend 💌",
            },
            {
              name: "notificationText",
              label: "Notification Message",
              type: "textarea",
              required: true,
              default:
                "Hey bestie! Just a quick reminder that you are irreplaceable. Tap to open!",
            },
            {
              name: "sender",
              label: "Sender / App Name",
              type: "text",
              required: false,
              default: "MemoryFlix",
            },
            {
              name: "time",
              label: "Subtitle / Time",
              type: "text",
              required: false,
              default: "Priority Message",
            },
            {
              name: "replyText",
              label: "Surprise Note (revealed on tap)",
              type: "text",
              required: false,
              default: "Unlocked: Unlimited laughs and a lifetime friend pass ❤️",
            },
          ],
        },
      },
      {
        position: 2,
        componentKey: "DEFINITION",
        fixedConfig: {
          backgroundColor: "#09090b",
          textColor: "#f4f4f5",
          accentColor: "#ec4899",
          cardBg: "rgba(24, 24, 27, 0.85)",
          backgroundTexture: "dots",
        },
        editableSchema: {
          title: "The Living Dictionary",
          description: "Define a special word that sums up your friendship.",
          fields: [
            {
              name: "word",
              label: "Special Word",
              type: "text",
              required: true,
              default: "Unconditional",
            },
            {
              name: "phonetic",
              label: "Phonetic Pronunciation",
              type: "text",
              required: false,
              default: "/ʌnkənˈdɪʃən(ə)l/",
            },
            {
              name: "partOfSpeech",
              label: "Part of Speech",
              type: "text",
              required: false,
              default: "noun / adjective",
            },
            {
              name: "definition",
              label: "Your Personal Definition",
              type: "textarea",
              required: true,
              default:
                "Knowing all your deepest secrets, embarrassing stories, and still being the first to answer the phone at 2 AM.",
            },
            {
              name: "exampleSentence",
              label: "Example Sentence or Memory",
              type: "text",
              required: false,
              default: "They define true loyalty in every possible dimension.",
            },
            {
              name: "photoUrl",
              label: "Polaroid Photo",
              type: "image",
              required: true,
              default: "/2.png",
            },
          ],
        },
      },
      {
        position: 3,
        componentKey: "LOADING",
        fixedConfig: {
          backgroundColor: "#09090b",
          textColor: "#fafafa",
          accentColor: "#eab308",
          cardBg: "rgba(24, 24, 27, 0.9)",
          backgroundTexture: "dots",
        },
        editableSchema: {
          title: "Friendship Compatibility Test",
          description: "A playful progress bar that calculates a 100% match.",
          fields: [
            {
              name: "loadingLabel",
              label: "Loading Stage Label",
              type: "text",
              required: true,
              default: "CALCULATING FRIENDSHIP SCORE...",
            },
            {
              name: "awardTitle",
              label: "Award / Result Title",
              type: "text",
              required: true,
              default: "OFFICIAL BEST FRIEND OF THE DECADE",
            },
            {
              name: "rewardText",
              label: "Award Reason & Praise",
              type: "textarea",
              required: true,
              default:
                "After analyzing 10,000 inside jokes, 500 late-night calls, and infinite memories: You have achieved a certified 100% bond rating.",
            },
            {
              name: "subtitle",
              label: "Subtitle / Note",
              type: "text",
              required: false,
              default: "Presented with immense gratitude & love",
            },
          ],
        },
      },
      {
        position: 4,
        componentKey: "CERTIFICATE",
        fixedConfig: {
          backgroundColor: "#09090b",
          textColor: "#f5f5f4",
          accentColor: "#eab308",
          cardBg: "rgba(20, 20, 24, 0.95)",
          backgroundTexture: "paper-grain",
        },
        editableSchema: {
          title: "Official Friendship Certificate",
          description: "An official certificate honoring your friendship.",
          fields: [
            {
              name: "title",
              label: "Certificate Header",
              type: "text",
              required: true,
              default: "Certificate of Eternal Friendship",
            },
            {
              name: "recipientName",
              label: "Best Friend's Name",
              type: "text",
              required: true,
              default: "Ananya Sharma",
            },
            {
              name: "message",
              label: "Dedication Message",
              type: "textarea",
              required: true,
              default:
                "For bringing infinite joy, listening without judgment, and turning ordinary days into unforgettable adventures.",
            },
            {
              name: "issuer",
              label: "Your Name",
              type: "text",
              required: true,
              default: "Rohan Kapoor",
            },
            {
              name: "date",
              label: "Date",
              type: "text",
              required: false,
              default: "Friendship Day",
            },
          ],
        },
      },
      {
        position: 5,
        componentKey: "LABELED_PHOTO",
        fixedConfig: {
          backgroundColor: "#09090b",
          textColor: "#fafafa",
          accentColor: "#ec4899",
          cardBg: "rgba(24, 24, 27, 0.9)",
          backgroundTexture: "soft-stripes",
        },
        editableSchema: {
          title: "Anatomy of Our Memory",
          description: "A memorable photo with 4 custom callout labels.",
          fields: [
            {
              name: "title",
              label: "Section Title",
              type: "text",
              required: false,
              default: "Anatomy of Our Friendship",
            },
            {
              name: "subtitle",
              label: "Section Subtitle",
              type: "text",
              required: false,
              default: "The little things that make us invincible",
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
              default: "Your iconic smile",
            },
            {
              name: "label2",
              label: "Label 2 (Top Right)",
              type: "text",
              required: true,
              default: "That day in the sun",
            },
            {
              name: "label3",
              label: "Label 3 (Bottom Left)",
              type: "text",
              required: true,
              default: "Always having my back",
            },
            {
              name: "label4",
              label: "Label 4 (Bottom Right)",
              type: "text",
              required: true,
              default: "Our favorite song",
            },
          ],
        },
      },
      {
        position: 6,
        componentKey: "SEARCH",
        fixedConfig: {
          backgroundColor: "#09090b",
          textColor: "#fafafa",
          accentColor: "#3b82f6",
          cardBg: "rgba(24, 24, 27, 0.85)",
          backgroundTexture: "dots",
        },
        editableSchema: {
          title: "Search Results for Us",
          description: "A search query with 3 memorable photo cards.",
          fields: [
            {
              name: "searchQuery",
              label: "Search Bar Query",
              type: "text",
              required: true,
              default: "what is the definition of a true friend?",
            },
            {
              name: "resultsCount",
              label: "Results Counter Text",
              type: "text",
              required: false,
              default: "Found 3 unforgettable memories",
            },
            {
              name: "photo1",
              label: "Memory 1 Photo",
              type: "image",
              required: true,
              default: "/1.png",
            },
            {
              name: "title1",
              label: "Memory 1 Title",
              type: "text",
              required: false,
              default: "Late Night Talks",
            },
            {
              name: "photo2",
              label: "Memory 2 Photo",
              type: "image",
              required: true,
              default: "/2.png",
            },
            {
              name: "title2",
              label: "Memory 2 Title",
              type: "text",
              required: false,
              default: "Unplanned Road Trips",
            },
            {
              name: "photo3",
              label: "Memory 3 Photo",
              type: "image",
              required: true,
              default: "/3.png",
            },
            {
              name: "title3",
              label: "Memory 3 Title",
              type: "text",
              required: false,
              default: "Laughing Until It Hurt",
            },
          ],
        },
      },
      {
        position: 7,
        componentKey: "LETTER",
        fixedConfig: {
          backgroundColor: "#0c0a09",
          textColor: "#f5f5f4",
          accentColor: "#f43f5e",
          cardBg: "rgba(28, 25, 23, 0.9)",
          backgroundTexture: "paper-grain",
        },
        editableSchema: {
          title: "A Letter from the Heart",
          description: "A personal letter to wrap up your story.",
          fields: [
            {
              name: "recipientName",
              label: "Dear...",
              type: "text",
              required: true,
              default: "Ananya",
            },
            {
              name: "message",
              label: "Your Message",
              type: "textarea",
              required: true,
              default:
                "Looking back at everything we've been through, I'm just so grateful to have you in my corner.\n\nThank you for always being you and making every moment brighter.",
            },
            {
              name: "senderName",
              label: "With love, (Your Name)",
              type: "text",
              required: true,
              default: "Rohan",
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
              default: "/3.png",
            },
          ],
        },
      },
    ],
  });

  // ==========================================
  // 2. Romantic Anniversary Template (Linen & Grain)
  // Textures: linen, paper-grain, canvas
  // ==========================================
  await seedTemplate({
    name: "Romantic Anniversary",
    slug: "romantic-anniversary",
    category: "Anniversary & Love",
    price: 5900, // ₹59
    description:
      "An elegant, candlelit cinematic love letter to celebrate your anniversary, milestone, or lifelong romance.",
    previewUrl: "/2.png",
    blueprints: [
      {
        position: 1,
        componentKey: "NOTIFICATION",
        fixedConfig: {
          backgroundColor: "#0f050b",
          textColor: "#faf5f0",
          accentColor: "#e2b153",
          cardBg: "rgba(32, 10, 22, 0.9)",
          backgroundTexture: "linen",
        },
        editableSchema: {
          title: "Anniversary Alert",
          description: "A romantic notification arriving on your partner's phone.",
          fields: [
            {
              name: "notificationTitle",
              label: "Notification Title",
              type: "text",
              required: true,
              default: "Anniversary Alert 💖",
            },
            {
              name: "notificationText",
              label: "Notification Message",
              type: "textarea",
              required: true,
              default:
                "Happy Anniversary my love! Another 365 days of falling deeper in love with you. Tap to open our story.",
            },
            {
              name: "sender",
              label: "Sender / App Name",
              type: "text",
              required: false,
              default: "Forever Yours",
            },
            {
              name: "time",
              label: "Subtitle / Time",
              type: "text",
              required: false,
              default: "Special Delivery",
            },
            {
              name: "replyText",
              label: "Surprise Note (revealed on tap)",
              type: "text",
              required: false,
              default: "You + Me = Our best chapter yet ✨",
            },
          ],
        },
      },
      {
        position: 2,
        componentKey: "DEFINITION",
        fixedConfig: {
          backgroundColor: "#0d0408",
          textColor: "#faf5f0",
          accentColor: "#f43f5e",
          cardBg: "rgba(30, 8, 20, 0.85)",
          backgroundTexture: "paper-grain",
        },
        editableSchema: {
          title: "The Living Dictionary",
          description: "Define what your partner means to you.",
          fields: [
            {
              name: "word",
              label: "Special Word",
              type: "text",
              required: true,
              default: "Soulmate",
            },
            {
              name: "phonetic",
              label: "Phonetic Pronunciation",
              type: "text",
              required: false,
              default: "/ˈsoʊl.meɪt/",
            },
            {
              name: "partOfSpeech",
              label: "Part of Speech",
              type: "text",
              required: false,
              default: "noun",
            },
            {
              name: "definition",
              label: "Your Personal Definition",
              type: "textarea",
              required: true,
              default:
                "A person with whom one has a feeling of deep and natural affinity, shared laughter, and quiet understanding that needs no words.",
            },
            {
              name: "exampleSentence",
              label: "Example Sentence or Memory",
              type: "text",
              required: false,
              default: "From day one, meeting you felt like finally coming home.",
            },
            {
              name: "photoUrl",
              label: "Polaroid Photo",
              type: "image",
              required: true,
              default: "/2.png",
            },
          ],
        },
      },
      {
        position: 3,
        componentKey: "LOADING",
        fixedConfig: {
          backgroundColor: "#0d0408",
          textColor: "#faf5f0",
          accentColor: "#e2b153",
          cardBg: "rgba(32, 10, 22, 0.9)",
          backgroundTexture: "linen",
        },
        editableSchema: {
          title: "Love Compatibility Analysis",
          description: "A romantic calculation measuring your bond.",
          fields: [
            {
              name: "loadingLabel",
              label: "Loading Stage Label",
              type: "text",
              required: true,
              default: "MEASURING COMPATIBILITY & MEMORIES...",
            },
            {
              name: "awardTitle",
              label: "Award / Result Title",
              type: "text",
              required: true,
              default: "OFFICIAL PERFECT MATCH FOR LIFE",
            },
            {
              name: "rewardText",
              label: "Award Reason & Praise",
              type: "textarea",
              required: true,
              default:
                "Calculated across 1,000+ shared glances, endless adventures, and unconditional warmth: Compatibility score is infinity/100.",
            },
            {
              name: "subtitle",
              label: "Subtitle / Note",
              type: "text",
              required: false,
              default: "Certified by the Universe",
            },
          ],
        },
      },
      {
        position: 4,
        componentKey: "CERTIFICATE",
        fixedConfig: {
          backgroundColor: "#0d0408",
          textColor: "#faf5f0",
          accentColor: "#e2b153",
          cardBg: "rgba(28, 8, 18, 0.95)",
          backgroundTexture: "paper-grain",
        },
        editableSchema: {
          title: "Certificate of Endless Devotion",
          description: "An official certificate honoring your anniversary.",
          fields: [
            {
              name: "title",
              label: "Certificate Header",
              type: "text",
              required: true,
              default: "Certificate of Endless Devotion",
            },
            {
              name: "recipientName",
              label: "Partner's Name",
              type: "text",
              required: true,
              default: "My Beloved Partner",
            },
            {
              name: "message",
              label: "Dedication Message",
              type: "textarea",
              required: true,
              default:
                "Awarded for being the most patient, loving, and extraordinary partner in the entire world. Here's to all our yesterdays and all our tomorrows.",
            },
            {
              name: "issuer",
              label: "Your Name",
              type: "text",
              required: true,
              default: "Yours Always",
            },
            {
              name: "date",
              label: "Date",
              type: "text",
              required: false,
              default: "Happy Anniversary",
            },
          ],
        },
      },
      {
        position: 5,
        componentKey: "LABELED_PHOTO",
        fixedConfig: {
          backgroundColor: "#0d0408",
          textColor: "#faf5f0",
          accentColor: "#fb7185",
          cardBg: "rgba(30, 8, 20, 0.9)",
          backgroundTexture: "canvas",
        },
        editableSchema: {
          title: "Anatomy of Our Love",
          description: "An annotated photo marking sweet details of your love.",
          fields: [
            {
              name: "title",
              label: "Section Title",
              type: "text",
              required: false,
              default: "Anatomy of Our Love",
            },
            {
              name: "subtitle",
              label: "Section Subtitle",
              type: "text",
              required: false,
              default: "The four little things that make my heart skip a beat",
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
              default: "The way you hold my hand",
            },
            {
              name: "label2",
              label: "Label 2 (Top Right)",
              type: "text",
              required: true,
              default: "Our spontaneous road trips",
            },
            {
              name: "label3",
              label: "Label 3 (Bottom Left)",
              type: "text",
              required: true,
              default: "How you make me laugh",
            },
            {
              name: "label4",
              label: "Label 4 (Bottom Right)",
              type: "text",
              required: true,
              default: "Your heart of pure gold",
            },
          ],
        },
      },
      {
        position: 6,
        componentKey: "SEARCH",
        fixedConfig: {
          backgroundColor: "#0d0408",
          textColor: "#faf5f0",
          accentColor: "#e2b153",
          cardBg: "rgba(30, 8, 20, 0.85)",
          backgroundTexture: "linen",
        },
        editableSchema: {
          title: "Search Results for Us",
          description: "Three memorable milestone moments.",
          fields: [
            {
              name: "searchQuery",
              label: "Search Bar Query",
              type: "text",
              required: true,
              default: "how did I get so lucky to find you?",
            },
            {
              name: "resultsCount",
              label: "Results Counter Text",
              type: "text",
              required: false,
              default: "Found 3 unforgettable milestones",
            },
            {
              name: "photo1",
              label: "Milestone 1 Photo",
              type: "image",
              required: true,
              default: "/1.png",
            },
            {
              name: "title1",
              label: "Milestone 1 Title",
              type: "text",
              required: false,
              default: "Our Very First Date",
            },
            {
              name: "photo2",
              label: "Milestone 2 Photo",
              type: "image",
              required: true,
              default: "/2.png",
            },
            {
              name: "title2",
              label: "Milestone 2 Title",
              type: "text",
              required: false,
              default: "Midnight Beach Walks",
            },
            {
              name: "photo3",
              label: "Milestone 3 Photo",
              type: "image",
              required: true,
              default: "/3.png",
            },
            {
              name: "title3",
              label: "Milestone 3 Title",
              type: "text",
              required: false,
              default: "Making a Home Together",
            },
          ],
        },
      },
      {
        position: 7,
        componentKey: "LETTER",
        fixedConfig: {
          backgroundColor: "#0f050b",
          textColor: "#faf5f0",
          accentColor: "#f43f5e",
          cardBg: "rgba(32, 10, 22, 0.9)",
          backgroundTexture: "paper-grain",
        },
        editableSchema: {
          title: "A Love Letter from the Heart",
          description: "An intimate love letter dedicated to your partner.",
          fields: [
            {
              name: "recipientName",
              label: "Dear...",
              type: "text",
              required: true,
              default: "My Dearest",
            },
            {
              name: "message",
              label: "Your Message",
              type: "textarea",
              required: true,
              default:
                "Happy Anniversary my love.\n\nEvery day with you is my favorite adventure. Thank you for your warmth, your kindness, and the thousand little ways you make our life feel like magic.\n\nHere is to forever and a day.",
            },
            {
              name: "senderName",
              label: "With love, (Your Name)",
              type: "text",
              required: true,
              default: "Yours Eternally",
            },
            {
              name: "date",
              label: "Date / Header Note",
              type: "text",
              required: false,
              default: "Our Anniversary",
            },
            {
              name: "photoUrl",
              label: "Attached Photo (optional)",
              type: "image",
              required: false,
              default: "/2.png",
            },
          ],
        },
      },
    ],
  });

  // ==========================================
  // 3. Neon Birthday Blast Template (Cyber & Dots)
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

  console.log("\n✅ All 3 templates seeded with textured canvas backgrounds!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
