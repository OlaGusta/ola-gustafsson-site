window.PORTFOLIO_CONTENT = {
  site: {
    title: 'Ola Gustafsson | Akvarellkonstnär',
    metaDescription:
      'Ola Gustafsson är akvarellkonstnär. Online-galleri med akvarellmålningar i nordiskt ljus: landskap, natur och stadsvyer.',
    brandName: 'Ola Gustafsson',
    brandTag: 'Akvarellgalleri',
    footerText: '© 2026 Ola Gustafsson'
  },

  // Tema: ändra dessa färger för hela sajten.
  theme: {
    background: '#f3efe6',
    surface: '#fcf8f1',
    ink: '#10131b',
    softInk: '#4f5766',
    primary: '#123a62',
    accent: '#b98c56',
    border: 'rgba(16, 19, 27, 0.12)',
    fontDisplay: 'fraunces',
    fontBody: 'jakarta',
    fontDisplayWeight: 700,
    fontBodyWeight: 400
  },

  // Hero: ändra bild + texter här.
  hero: {
    eyebrow: 'Ola Gustafsson · Akvarellmålare',
    title: 'Skiftningar i akvarell',
    intro: 'Jag målar främst landskap och stadsmiljöer i akvarell.',
    line: 'Jag bygger bilderna med förenklade valörer och medvetna kanter och låter resten vara lite öppet.',
    ctaPrimaryLabel: 'Se målningar',
    ctaSecondaryLabel: 'Läs om processen',
    mode: 'slideshow',
    slideDurationMs: 8000,
    slides: [
      { src: 'images/ola-02.jpg', alt: 'Slussen, eftermiddag i September', durationMs: 8000 },
      { src: 'images/ola-01.jpg', alt: 'Varm sommarkväll på Borrby Strand', durationMs: 8000 },
      { src: 'images/ola-03.jpg', alt: 'På väg hem', durationMs: 8000 }
    ],
    overlayEnabled: true,
    overlayOpacity: 55,
    copyPanelOpacity: 40,
    image: 'images/ola-02.jpg',
    imageAlt: 'Akvarell i blå toner med stadsvy och långa skuggor.'
  },

  // Studio-auth-läge:
  // - secure-auth: app-login med lösenord + 2FA + reset + bruteforce-skydd (rekommenderat för live)
  // - server-auth: legacy (HTTP Basic / Directory Privacy)
  // - local-password: endast lokal utveckling
  studioAccess: {
    mode: 'secure-auth',
    password: ''
  },

  // Google Analytics 4 (valfritt).
  // Sätt gaMeasurementId till ditt G-... ID för att aktivera.
  analytics: {
    gaMeasurementId: '',
    anonymizeIp: true,
    trackStudio: false
  },

  gallery: {
    eyebrow: 'Senaste målningar',
    heading: 'Akvareller',
    pageHeading: 'Hela galleriet',
    subheading:
      'Ett urval av målningar där impressionism möter semi-abstraktion: realistiska former balanserade med oförutsägbara flöden.',

    // Kategori-etiketter som visas i filterknappar.
    categoryLabels: {
      all: 'Alla',
      sea: 'Havsbilder',
      portrait: 'Porträtt',
      city: 'Stadsvyer',
      nature: 'Natur'
    },

    // Sortering i dropdown.
    sortOptions: [
      { value: 'manual', label: 'Standard' },
      { value: 'title-asc', label: 'Titel A-Ö' },
      { value: 'title-desc', label: 'Titel Ö-A' },
      { value: 'newest', label: 'Nyast först' },
      { value: 'oldest', label: 'Äldst först' }
    ],

    // Automatisk inläsning av nya bilder med filnamnsmall.
    // Laddar t.ex. images/ola-01.jpg, ola-02.jpg, osv.
    // Lägg bara in nya filer i images/ så dyker de upp.
    // Vill du byta titel/kategori/featured för en auto-bild, lägg till den i artworks-listan nedan.
    autoDiscover: {
      enabled: true,
      path: 'images',
      prefix: 'ola-',
      extension: 'jpg',
      start: 1,
      pad: 2,
      max: 200,
      stopAfterMisses: 6,
      defaultMedium: 'Akvarell på papper',
      defaultCategory: 'nature',
      titlePrefix: 'Verk'
    },

    // Manuell metadata för verk.
    // featured: true = visas på startsidan (under Galleri)
    // category styr filter (sea/portrait/city/nature eller valfri egen kategori)
    // year används för sortering Nyast/Äldst
    artworks: [
      {
        src: 'images/ola-01.jpg',
        title: 'Varm sommarkväll på Borrby Strand',
        medium: 'Akvarell på papper',
        alt: 'Båt vid borrby strand',
        category: 'sea',
        featured: true,
        year: 2025,
        order: 1
      },
      {
        src: 'images/ola-02.jpg',
        title: 'Slussen, eftermiddag i September',
        medium: 'Akvarell på papper',
        alt: 'Solnedgång över vatten med träd och figur i förgrund.',
        category: 'city',
        featured: true,
        year: 2025,
        order: 2
      },
      {
        src: 'images/ola-03.jpg',
        title: 'På väg hem',
        medium: 'Akvarell på papper',
        alt: 'Mörkgröna trädkronor med ljusöppning i landskapet.',
        category: 'nature',
        featured: true,
        year: 2025,
        order: 3,
        objectPosition: 'center 100%',
        zoom: 1.45
      },
      {
        src: 'images/ola-04.jpg',
        title: 'I skuggan',
        medium: 'Akvarell på papper',
        alt: 'Eftermiddag i Borrby',
        category: 'nature',
        featured: true,
        year: 2025,
        order: 4
      },
      {
        src: 'images/ola-05.jpg',
        title: 'Interiör i kvällsvärme',
        medium: 'Akvarell på papper',
        alt: 'Figur i interiör med varma orange och violetta toner.',
        category: 'portrait',
        featured: true,
        year: 2025,
        order: 5
      },
      {
        src: 'images/ola-06.jpg',
        title: 'Morgon över viken',
        medium: 'Akvarell på papper',
        alt: 'Ljus kustlinje i mjuka blå och gyllene övergångar.',
        category: 'nature',
        featured: true,
        year: 2025,
        order: 6
      },
      {
        src: 'images/ola-07.jpg',
        title: 'Verk 07',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 07',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 7
      },
      {
        src: 'images/ola-08.jpg',
        title: 'Verk 08',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 08',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 8
      },
      {
        src: 'images/ola-09.jpg',
        title: 'Verk 09',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 09',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 9
      },
      {
        src: 'images/ola-10.jpg',
        title: 'Verk 10',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 10',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 10
      },
      {
        src: 'images/ola-11.jpg',
        title: 'Verk 11',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 11',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 11
      },
      {
        src: 'images/ola-12.jpg',
        title: 'Verk 12',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 12',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 12
      },
      {
        src: 'images/ola-13.jpg',
        title: 'Verk 13',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 13',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 13
      },
      {
        src: 'images/ola-14.jpg',
        title: 'Verk 14',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 14',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 14
      },
      {
        src: 'images/ola-15.jpg',
        title: 'Verk 15',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 15',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 15
      },
      {
        src: 'images/ola-16.jpg',
        title: 'Verk 16',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 16',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 16
      },
      {
        src: 'images/ola-17.jpg',
        title: 'Verk 17',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 17',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 17
      },
      {
        src: 'images/ola-18.jpg',
        title: 'Verk 18',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 18',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 18
      },
      {
        src: 'images/ola-19.jpg',
        title: 'Verk 19',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 19',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 19
      },
      {
        src: 'images/ola-20.jpg',
        title: 'Verk 20',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 20',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 20
      },
      {
        src: 'images/ola-21.jpg',
        title: 'Verk 21',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 21',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 21
      },
      {
        src: 'images/ola-22.jpg',
        title: 'Verk 22',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 22',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 22
      },
      {
        src: 'images/ola-23.jpg',
        title: 'Verk 23',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 23',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 23
      },
      {
        src: 'images/ola-24.jpg',
        title: 'Verk 24',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 24',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 24
      },
      {
        src: 'images/ola-25.jpg',
        title: 'Verk 25',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 25',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 25
      },
      {
        src: 'images/ola-26.jpg',
        title: 'Verk 26',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 26',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 26
      },
      {
        src: 'images/ola-27.jpg',
        title: 'Verk 27',
        medium: 'Akvarell på papper',
        alt: 'Akvarell verk 27',
        category: 'nature',
        featured: false,
        year: 2025,
        order: 27
      }
    ]
  },

  about: {
    eyebrow: 'Artist statement',
    heading: 'Om mitt måleri',
    portraitImage: 'images/ola-portrait.jpg',
    portraitAlt: 'Porträtt av Ola Gustafsson',
    materialImage: 'images/ola-22.jpg',
    materialImageAlt: 'Färgrik akvarellstudie nära materialet.',
    featureImage: 'images/ola-plein-air-sandemar.jpg',
    featureImageAlt: 'Ola Gustafsson målar ute i Sandemar.',
    paragraphs: [
      'Jag dras till landskap, natur och min plats i dem men det jag letar efter är oftare ett skifte än en utsikt.',
      'Akvarell är mitt val för att mötet mellan vatten, pigment och tajming faktiskt syns i resultatet.',
      'Jag jobbar med valör som ryggrad och låter kanterna göra mycket av berättandet: hårda, mjuka, förlorade.',
      'Ibland är motivet tydligt. Ibland får det vara mindre tydligt och det är ofta där bilden börjar leva.'
    ],
    dayJobLine:
      'Till vardags är jag visuell kommunikatör på Stockholm School of Entrepreneurship, vilket har gjort mig ganska sträng med komposition och enkelhet.',
    materialsHeading: 'Material',
    materialsBody:
      'Jag målar oftast på Arches 300 g fine eller Arches 640 g rough, ibland på Baohong eller Saunders Waterford. Färgerna växlar mellan Daniel Smith, Winsor & Newton, Schmincke, Sennelier och Old Holland. Några penslar jag ofta återkommer till är Escoda Perla, koreanska Eo eo, Princeton Nautilus och kinesiska kalligrafipenslar i olika storlekar.',
    inspirationHeading: 'Inspiration',
    inspirationBody:
      'Jag inspireras bland annat av Ylva Carlgren, Lars A Persson, Nicolas Lopez, Herman Pekel, Nita Engle, David Lidbetter och Mitchell Albala. Gemensamt är målare som rör sig mellan kontroll och upplösning, struktur och flöde, den balans jag själv jagar.',
    ambitionsHeading: 'Just nu',
    ambitions: [
      'Mer tydlig valörstruktur, mindre överarbete.',
      'Fler motiv i serie: samma plats, olika ljus, olika utfall.',
      'Mer negativt måleri och mer vatten får synas när det gör bilden bättre.',
      'Fortsätta öppna upp mot mer abstrakta ytor utan att tappa fästet i valör och kant.'
    ],
    recognitionHeading: 'Utmärkelser & utställningar',
    recognitionItems: [
      'Fabriano in Aquarello 2025 - jurybedömd internationell utställning.',
      'NAS triennale 2025 - jurybedömd utställning i Frederikshavn, Danmark.',
      'Fler utställningar och meriter uppdateras löpande.'
    ],
    sideNote: ''
  },

  project: {
    eyebrow: 'Projekt',
    heading: '100 dagar av sol',
    description:
      'Sommaren 2025 genomförde jag projektet 100 dagar av sol. Varje dag tog jag en bild av solen i stunden och målade en liten akvarell (18 × 26 cm). Varje målning fick ta max 20 minuter. Projektet blev ett sätt att träna snabb valörbedömning, närvaro och konsekvent arbete över tid.',
    collageImage: 'images/monterade-solar.jpg',
    collageAlt: 'Dokumentation av projektet 100 dagar av sol.',
    sampleHeading: 'Exempel från serien',
    samples: [
      { src: 'images/sol1.jpg', alt: 'Solstudie i mjuk dimma.' },
      { src: 'images/sol2.jpg', alt: 'Solnedgång i varma orange toner.' },
      { src: 'images/sol3.jpg', alt: 'Abstrakt solstudie med stark kontrast.' },
      { src: 'images/sol4.jpg', alt: 'Ljusstudie i blått och guld.' }
    ]
  },

  contact: {
    eyebrow: 'Kontakt',
    heading: 'Kontakt',
    body: 'För utställningar, samarbeten eller frågor: skicka gärna ett mejl eller skriv på Instagram.',
    email: 'ola@example.com',
    emailPublic: false,
    emailLabel: 'Skicka e-post',
    form: {
      enabled: true,
      turnstileSiteKey: ''
    },
    socialLinks: [
      { label: 'Instagram', url: 'https://instagram.com' }
    ],
    instagramUrl: '',
    facebookUrl: ''
  },

  ui: {
    menuButton: 'Meny',
    menuAriaLabel: 'Öppna meny',
    navAriaLabel: 'Huvudmeny',
    navHome: 'Hem',
    navGallery: 'Galleri',
    navAbout: 'Om',
    navContact: 'Kontakt',
    homeToGallery: 'Till galleriet',
    galleryBackHome: 'Tillbaka till startsidan',
    scrollTop: 'Till toppen',
    languageSwitcherAria: 'Välj språk',
    languageOptionSv: 'Svenska',
    languageOptionEn: 'English',
    themeSwitcherAria: 'Välj färgläge',
    themeOptionLight: 'Ljus',
    themeOptionDark: 'Mörk',
    lightboxAriaLabel: 'Bildvisning',
    lightboxClose: 'Stäng',
    lightboxCloseAria: 'Stäng bildvisning',
    lightboxPrevAria: 'Föregående bild',
    lightboxNextAria: 'Nästa bild',
    galleryControlsAria: 'Filtrera och sortera galleri',
    categoryFilterAria: 'Kategorifilter',
    sortLabel: 'Sortera',
    galleryEmpty: 'Inga verk matchar filtret.',
    galleryLoadError: 'Något gick fel vid inläsning av galleriet.',
    openInLightbox: 'Öppna i stor bild.',
    missingImage: 'Kunde inte ladda',
    heroImageFallbackAlt: 'Hero-bild',
    portraitFallbackAlt: 'Porträtt av Ola Gustafsson',
    emailButtonFallback: 'Skicka e-post',
    studioLogin: 'Studio-login',
    studioLogout: 'Logga ut Studio',
    studioPasswordMissing: 'Studio-lösenord saknas i content.js',
    studioPasswordPrompt: 'Ange Studio-lösenord:',
    studioPasswordWrong: 'Fel lösenord.',
    mediumDefault: 'Akvarell på papper',
    artworkDefaultPrefix: 'Verk',
    watercolorDefaultAltPrefix: 'Akvarellverk',
    slideLabel: 'Bild',
    captchaVerifyError: 'Captcha kunde inte verifieras. Försök igen.',
    captchaLoadError: 'Captcha kunde inte laddas. Ladda om sidan och försök igen.',
    formSlowDown: 'Vänta en kort stund innan du skickar formuläret.',
    formCaptchaRequired: 'Verifiera captcha innan du skickar formuläret.',
    formSending: 'Skickar meddelande...',
    formSendFailed: 'Kunde inte skicka meddelandet. Försök igen.',
    formSendSuccess: 'Tack, ditt meddelande är skickat.',
    formNetworkError: 'Nätverksfel. Försök igen om en stund.'
  }
};

window.PORTFOLIO_TRANSLATIONS = {
  en: {
    site: {
      title: 'Ola Gustafsson | Watercolor Gallery',
      metaDescription:
        'Online gallery for Ola Gustafsson: watercolor paintings focused on light, mood, nature, and Nordic landscapes.',
      brandTag: 'Watercolor Gallery'
    },
    hero: {
      eyebrow: 'Ola Gustafsson · Watercolor Artist',
      title: 'Shifts in watercolor',
      intro: 'I mainly paint landscapes and urban scenes in watercolor.',
      line: 'I build images with simplified values and deliberate edges, and let the rest stay slightly open.',
      ctaPrimaryLabel: 'View paintings',
      ctaSecondaryLabel: 'Read about the process',
      imageAlt: 'Watercolor in blue tones with a city view and long shadows.',
      slides: [
        { src: 'images/ola-02.jpg', alt: 'Slussen, September afternoon', durationMs: 8000 },
        { src: 'images/ola-01.jpg', alt: 'Warm summer evening at Borrby Beach', durationMs: 8000 },
        { src: 'images/ola-03.jpg', alt: 'On the way home', durationMs: 8000 }
      ]
    },
    gallery: {
      eyebrow: 'Latest works',
      heading: 'Watercolors',
      pageHeading: 'Full gallery',
      subheading:
        'A selection of paintings where Impressionism meets semi-abstraction: recognizable forms balanced with unpredictable watercolor flows.',
      categoryLabels: {
        all: 'All',
        sea: 'Seascapes',
        portrait: 'Portraits',
        city: 'Cityscapes',
        nature: 'Nature'
      },
      sortOptions: [
        { value: 'manual', label: 'Default' },
        { value: 'title-asc', label: 'Title A-Z' },
        { value: 'title-desc', label: 'Title Z-A' },
        { value: 'newest', label: 'Newest first' },
        { value: 'oldest', label: 'Oldest first' }
      ],
      autoDiscover: {
        defaultMedium: 'Watercolor on paper',
        titlePrefix: 'Work'
      },
      artworkTextBySrc: {
        'images/ola-01.jpg': {
          title: 'Warm summer evening at Borrby Beach',
          medium: 'Watercolor on paper',
          alt: 'Boat at Borrby beach'
        },
        'images/ola-02.jpg': {
          title: 'Slussen, September afternoon',
          medium: 'Watercolor on paper',
          alt: 'Sunset over water with trees and a figure in the foreground.'
        },
        'images/ola-03.jpg': {
          title: 'On the way home',
          medium: 'Watercolor on paper',
          alt: 'Dark green tree canopies with an opening of light in the landscape.'
        },
        'images/ola-04.jpg': {
          title: 'In the shade',
          medium: 'Watercolor on paper',
          alt: 'Afternoon in Borrby'
        },
        'images/ola-05.jpg': {
          title: 'Interior in evening warmth',
          medium: 'Watercolor on paper',
          alt: 'Figure in an interior with warm orange and violet tones.'
        },
        'images/ola-06.jpg': {
          title: 'Morning over the bay',
          medium: 'Watercolor on paper',
          alt: 'Bright coastline in soft blue and golden transitions.'
        }
      }
    },
    about: {
      heading: 'About my painting',
      portraitAlt: 'Portrait of Ola Gustafsson',
      materialImageAlt: 'Color-rich watercolor study close to the material.',
      featureImageAlt: 'Ola Gustafsson painting outdoors in Sandemar.',
      paragraphs: [
        'I am drawn to landscapes, nature, and my place in them, but what I look for is more often a shift than a view.',
        'Watercolor is my medium of choice because the interaction between water, pigment, and timing is visible in the result.',
        'I work with value as a backbone and let edges carry much of the narrative: hard, soft, and lost.',
        'Sometimes the motif is clear. Sometimes it stays less defined, and that is often where the painting starts to come alive.'
      ],
      dayJobLine:
        'By day, I work as a visual communicator at Stockholm School of Entrepreneurship, which has made me fairly strict about composition and simplicity.',
      materialsHeading: 'Materials',
      materialsBody:
        'I most often paint on Arches 300 g fine or Arches 640 g rough, and sometimes on Baohong or Saunders Waterford. My palette varies between Daniel Smith, Winsor & Newton, Schmincke, Sennelier, and Old Holland. Brushes I frequently return to include Escoda Perla, Korean Eo eo, Princeton Nautilus, and Chinese calligraphy brushes in different sizes.',
      inspirationHeading: 'Inspiration',
      inspirationBody:
        'Among others, I am inspired by Ylva Carlgren, Lars A Persson, Nicolas Lopez, Herman Pekel, Nita Engle, David Lidbetter, and Mitchell Albala. What they share is a movement between control and dissolution, structure and flow, the balance I pursue in my own work.',
      ambitionsHeading: 'Right now',
      ambitions: [
        'Clearer value structure, less overworking.',
        'More motifs in series: the same place, different light, different outcomes.',
        'More negative painting and more visible water when it improves the image.',
        'Continue opening up toward more abstract surfaces without losing grounding in value and edge.'
      ],
      recognitionHeading: 'Awards & exhibitions',
      recognitionItems: [
        'Fabriano in Aquarello 2025 - jury-selected international exhibition.',
        'NAS triennale 2025 - jury-selected exhibition in Frederikshavn, Denmark.',
        'More exhibitions and merits are updated continuously.'
      ],
      sideNote: ''
    },
    project: {
      eyebrow: 'Project',
      heading: '100 days of sun',
      description:
        'During the summer of 2025, I carried out the project 100 days of sun. Each day, I took a photo of the sun in the moment and painted a small watercolor (18 × 26 cm). Each painting was limited to 20 minutes. The project became a way to train quick value decisions, presence, and consistent daily practice.',
      collageImage: 'images/monterade-solar.jpg',
      collageAlt: 'Documentation of the 100 days of sun project.',
      sampleHeading: 'Examples from the series',
      samples: [
        { src: 'images/sol1.jpg', alt: 'Sun study in soft haze.' },
        { src: 'images/sol2.jpg', alt: 'Sunset study in warm orange tones.' },
        { src: 'images/sol3.jpg', alt: 'Abstract sun study with strong contrast.' },
        { src: 'images/sol4.jpg', alt: 'Light study in blue and gold.' }
      ]
    },
    contact: {
      eyebrow: 'Contact',
      heading: 'Contact',
      body: 'For exhibitions, collaborations, or questions: feel free to send an email or write on Instagram.',
      emailLabel: 'Send email'
    },
    ui: {
      menuButton: 'Menu',
      menuAriaLabel: 'Open menu',
      navAriaLabel: 'Main menu',
      navHome: 'Home',
      navGallery: 'Gallery',
      navAbout: 'About',
      navContact: 'Contact',
      homeToGallery: 'Go to gallery',
      galleryBackHome: 'Back to homepage',
      scrollTop: 'Back to top',
      languageSwitcherAria: 'Choose language',
      languageOptionSv: 'Swedish',
      languageOptionEn: 'English',
      themeSwitcherAria: 'Choose color mode',
      themeOptionLight: 'Light',
      themeOptionDark: 'Dark',
      lightboxAriaLabel: 'Image viewer',
      lightboxClose: 'Close',
      lightboxCloseAria: 'Close image viewer',
      lightboxPrevAria: 'Previous image',
      lightboxNextAria: 'Next image',
      galleryControlsAria: 'Filter and sort gallery',
      categoryFilterAria: 'Category filter',
      sortLabel: 'Sort',
      galleryEmpty: 'No artworks match the filter.',
      galleryLoadError: 'Something went wrong while loading the gallery.',
      openInLightbox: 'Open in large view.',
      openArtworkPage: 'Open artwork page',
      copyArtworkLink: 'Copy link',
      linkCopied: 'Link copied.',
      missingImage: 'Could not load',
      heroImageFallbackAlt: 'Hero image',
      portraitFallbackAlt: 'Portrait of Ola Gustafsson',
      emailButtonFallback: 'Send email',
      studioLogin: 'Studio login',
      studioLogout: 'Log out of Studio',
      studioPasswordMissing: 'Studio password is missing in content.js',
      studioPasswordPrompt: 'Enter Studio password:',
      studioPasswordWrong: 'Incorrect password.',
      mediumDefault: 'Watercolor on paper',
      artworkDefaultPrefix: 'Work',
      watercolorDefaultAltPrefix: 'Watercolor work',
      slideLabel: 'Slide',
      captchaVerifyError: 'Captcha could not be verified. Please try again.',
      captchaLoadError: 'Captcha could not be loaded. Refresh the page and try again.',
      formSlowDown: 'Please wait a moment before submitting the form.',
      formCaptchaRequired: 'Please verify captcha before submitting the form.',
      formSending: 'Sending message...',
      formSendFailed: 'Could not send the message. Please try again.',
      formSendSuccess: 'Thanks, your message has been sent.',
      formNetworkError: 'Network error. Please try again in a moment.'
    }
  }
};
