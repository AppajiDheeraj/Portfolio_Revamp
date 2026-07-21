const person = {
  firstName: "Appaji",
  lastName: "Dheeraj",
  fullName: "Appaji Dheeraj",
  email: "dheeraj.nagaraja@gmail.com",
};

const siteUrl = "https://dheerajbuilds.com";

export const siteConfig = {
  person,
  seo: {
    siteUrl,
    title: "Appaji Dheeraj — Product, Full-Stack, Systems & AI Builder",
    description:
      "Appaji Dheeraj is a computer science student, product builder, full-stack developer, and systems and AI builder creating practical, production-ready software.",
    icon: `${siteUrl}/global/Site_Icon.svg`,
    shareImage: `${siteUrl}/screenshots/Thumbnail.png`,
  },
  navigation: {
    badgeLabel: person.firstName.toUpperCase(),
    resumePath: "/Appaji_Dheeraj_Resume.pdf",
    menuItems: [
      { label: "Home", to: "/" },
      { label: "Work", to: "/work" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "FAQ", to: "/faq" },
    ],
    socialLinks: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/appaji_dheeraj/",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/appaji-dheeraj/",
      },
    ],
  },
  contact: {
    header: "Let’s Build Together",
    description:
      "Open to full-time roles, freelance projects, and collaboration on AI, systems, and full-stack products. Let’s discuss how I can help.",
    cta: {
      label: "Get in Touch",
      to: "/contact",
    },
    form: {
      eyebrow: "Let’s connect",
      scene: "(Update — 07)",
      copyright: "© 2026",
      title: "Start a Project",
      description:
        "Have a product idea, an AI workflow, or a system challenge? Share the details and I’ll reply with next steps.",
      availability: ["Open to opportunities", "Remote or on-site"],
      placeholders: {
        name: "Name",
        email: "Email",
        message: "Message",
      },
      submitLabel: "Send Message",
    },
  },
  home: {
    heroDescription:
      "Appaji Dheeraj designs and builds scalable, production-ready systems with a focus on clean architecture and thoughtful execution. From concept to deployment - structured, efficient, and purposeful.",
    heroHighlights: ["INTERFACE ALCHEMY", "SCROLL SORCERY"],
    introTagline: "Design. Code. Create.",
    introHeading: "Creating experiences that go beyond the screen.",
    introStateLabel: "/ Core State /",
    stickyNav: ["About Me", "Let’s Connect"],
    stickyFooter: ["Engineering with Intent", "Open to Collaborations"],
    stickyTitles: [
      "I build AI-first products and full-stack systems that solve real problems.",
      "Each project is driven by clarity, performance, and strong UX.",
      "This portfolio is a snapshot of the tools, systems, and products I ship.",
    ],
    workHeaderSuffix: "selects",
    hobbies: ["Systems", "AI", "Web", "Product"],
  },
  about: {
    establishedLabel: "Est",
    establishedYear: "1997",
    spotlightBottomBar: ["▸ Specs loaded", "/ Readme.md"],
    spotlightParagraphs: [
      "Welcome to the corner of the internet where things get built, not just for the scroll, but for the story. This is not just a site. Its a working archive of experiments, learnings, and quiet flexes.",
      "I am Appaji Dheeraj. I design with rhythm, build with care, and believe every detail deserves a reason to exist. From quick sketches to final deploy, everything here was made with intent and maybe a bit of caffeine. This space is built for motion, meaning, and messing around until it clicks.",
    ],
    spotlightKeywords: [
      "corner",
      "scroll",
      "archive",
      "learnings",
      "rhythm",
      "detail",
      "deploy",
      "caffeine",
      "messing",
    ],
    deskLabel: "About Me / Appaji Dheeraj",
    deskHeadline: "Create - Craft  Polish",
    deskBody:
      "I am Appaji Dheeraj. I build full-stack products, shape clean interfaces, and turn messy ideas into systems that feel thoughtful, useful, and ready to ship.",
    outroTitle: "Scroll ends but ideas do not",
    outroDescription:
      "This space is a running log of experiments, shipping notes, and design instincts tested in the wild.",
    outroTags: [
      "Frontend",
      "Motion",
      "Product Thinking",
      "Systems",
      "UI Craft",
      "Shipped Work",
    ],
    galleryCards: [
      { id: "X01-842", image: "/project/Logofy.jpeg" },
      { id: "V9-372K", image: "/project/Sparknotes.jpeg" },
      { id: "Z84-Q17", image: "/project/meet.jpeg" },
      { id: "L56-904", image: "/project/gofetch.png" },
      { id: "A23-7P1", image: "/project/banner.jpg" },
      { id: "T98-462", image: "/project/Logofy.jpeg" },
    ],
    intro: [
      "I'm " + person.fullName + " — a computer science student and full-stack developer focused on systems and AI. I enjoy building practical products with clean architecture and strong UX.",
      "I care about clarity, performance, and scalable design. Whether it’s an AI workflow, a SaaS app, or a developer tool, I aim for reliability and impact.",
      "Every project is a chance to learn, iterate, and ship. If it solves a real problem and feels solid to use, it’s a win.",
    ],
  },
  faq: {
    titleLine1: "Frequently",
    titleLine2: "Asked Questions",
  },
  marquee: {
    headlinePrimary: "Turning ideas into scalable products",
    headlineSecondary: "Designing intelligent digital experiences",
    bannerCopy: "Crafting systems that feels alive",
    bannerLogo: `[ ${person.firstName}.exe ]`,
    bannerImage: "/marquee-banner/marquee_banner_01.webp",
    bannerImageSmall: "/marquee-banner/marquee_banner_01-720.webp",
  },
  clubs: {
    title: "Clubs",
    members: [
      {
        id: "card-1",
        name: "IET NITK",
        img: "/Logos/IET_Logo.jpeg",
        alt: "IET NITK logo",
        position: "Executive Member | Web Team",
        description:
          "Revamped IET NITK website, developed a CTF platform for 60+ teams, and taught web development to 80+ students.",
        instagram: "https://www.instagram.com/ietnitk/",
      },
      {
        id: "card-2",
        name: "TEDx NITKSurathkal",
        img: "/Logos/Tedx_Logo.png",
        alt: "TEDx NITKSurathkal logo",
        position: "Executive Member | Web Developer & UI/UX Designer",
        description:
          "Contributing to the design and development of the TEDxNITK website, ensuring a consistent and impactful digital experience.",
        instagram: "https://www.instagram.com/tedxnitksurathkal/",
      },
      {
        id: "card-3",
        name: "GDG-WEC NITK",
        img: "/Logos/WEC_Nitk.png",
        alt: "WEC NITK logo",
        position: "Executive Member | Web Developer",
        description:
          "Developing Docker Integration Host, a platform for centralized management and monitoring of remote Docker hosts.",
        instagram: "https://www.instagram.com/wecnitk/",
      },
    ],
  },
  projectPage: {
    headerEyebrow: "Short film on self-discovery",
    headerTitle: "Fragments of Light",
    bannerImage: "/project/banner.jpg",
    overviewLabel: "Overview",
    overviewCopy:
      "A visual meditation on identity, *Fragments of Light* explores the quiet journey of self-discovery through minimalism, mood, and motion.",
    meta: [
      { label: "Year", value: "2024" },
      { label: "Category", value: "Short Film" },
      { label: "Running Time", value: "6:30" },
      { label: "Directed by", value: person.fullName },
    ],
    images: [
      "/project/Logofy.jpeg",
      "/project/Sparknotes.jpeg",
      "/project/meet.jpeg",
      "/project/gofetch.png",
      "/project/banner.jpg",
    ],
    credits: [
      { label: "Editor", value: person.fullName },
      { label: "Sound Design", value: "Elena Brooks" },
      { label: "Art Director", value: "Milo Vance" },
      { label: "Producer", value: "Asha Lennox" },
      { label: "Director", value: person.fullName },
    ],
    next: {
      index: "02 - 05",
      label: "Next",
      image: "/project/Sparknotes.jpeg",
      title: "Market Pulse",
    },
  },
  work: {
    selectedProjectLabel: "Selected Project",
    storySlidesFooterLabel: "Project Index",
    storySlidesFooterMeta: "( Since 2024 )",
  },
  footer: {
    brandLine1: person.firstName,
    brandLine2: person.lastName,
    copyrightYear: "2026",
    templateCredit: "Made with Love",
  },
};
