import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        about: 'About',
        skills: 'Skills',
        liveStore: 'Live Store',
        projects: 'Projects',
        contact: 'Contact',
        manageProjects: 'Manage Projects',
        inbox: 'Inbox',
        backendTitle: 'Backend & Database Status',
        dbConnected: 'MongoDB Connected',
        apiJson: 'Node API + JSON',
        fullStack: 'Full-Stack',
        hireMe: 'Hire Me',
        toggleMenu: 'Toggle Menu'
      },
      hero: {
        badge: 'Software Engineer • Full-Stack Web Developer • React • Node.js • MongoDB',
        greeting: "Hi, I'm",
        headline: 'Software Engineer crafting modern & scalable web applications.',
        lead: 'Software Engineer and Full-Stack Web Developer building high-converting React interfaces, reliable Node.js/Express & Laravel backends, and structured MongoDB/MySQL databases—with instant live site previews right inside the portfolio.',
        openLiveStore: 'Open Live Store Instantly',
        embeddedStore: 'Embedded Store',
        viewInbox: 'View Inbox',
        frontendLabel: 'Frontend',
        frontendStack: 'React • JS (ES6+) • CSS3',
        backendLabel: 'Backend',
        backendStack: 'Node.js • PHP • Laravel',
        databasesLabel: 'Databases',
        databasesStack: 'MongoDB • MySQL',
        setupAlt: 'Full-Stack Engineering Setup',
        instantReady: '● Instant Embedded Ready',
        storeTitle: 'Aurelle Fine Jewelry',
        storeDesc: 'Runs directly inside the portfolio without leaving the page',
        jewelryAlt: 'Aurelle Fine Jewelry Showcase',
        deskAlt: 'Clean Modern Development Desk'
      },
      about: {
        bannerAlt: 'Collaborative Software Engineering',
        eyebrow: 'About Me',
        title: 'End-to-End Web Engineering With Visual Precision',
        p1: "I'm Aya Gabr, a Software Engineer and Full-Stack Web Developer passionate about bridging sleek user interface design with dependable backend architecture and structured databases.",
        p2Prefix: 'Whether developing an e-commerce storefront like',
        storeName: 'Aurelle Fine Jewelry',
        p2Suffix: 'or building RESTful APIs with Node.js, Mongoose, and MySQL, I deliver scalable solutions built for real-world use.',
        feat1Title: 'Component-Driven Frontend',
        feat1Desc: 'Reusable React architectures with smooth micro-interactions.',
        feat2Title: 'Database-Backed REST APIs',
        feat2Desc: 'Structured schemas & endpoints via Node.js, MongoDB, and MySQL.',
        feat3Title: 'Production Deployment',
        feat3Desc: 'Git version control and live cloud hosting via Vercel.'
      },
      skills: {
        eyebrow: 'Technical Arsenal',
        title: 'Full-Stack Skills & Technologies',
        subtitle: 'Core languages, frameworks, databases, and tools I use to build complete web solutions.'
      },
      showcase: {
        eyebrow: 'Instant Embedded Live Site',
        title: 'Aurelle Fine Jewelry — Live Inside Portfolio',
        subtitle: 'The live website is embedded directly inside the portfolio (not just a link) so clicking and interacting with it feels immediate and seamless.',
        instantReady: '● Instant Ready',
        preloading: '● Preloading...',
        desktop: 'Desktop',
        mobile: 'Mobile',
        fastStageTitle: 'Open Fast Pop-up Stage',
        fastStage: 'Fast Stage',
        reloadTitle: 'Reload Preview',
        openFullTitle: 'Open Full Website',
        iframeTitle: 'Aurelle Fine Jewelry Live Store',
        footerNote: 'Embedded directly inside the page with eager loading & instant pop-up stage.',
        launchStage: 'Launch Instant In-Portfolio Stage'
      },
      projects: {
        eyebrow: 'Selected Work',
        title: 'Featured Full-Stack Projects',
        subtitle: 'Click "Live Demo" to launch the website directly inside the portfolio for instant interaction.',
        filterAll: 'All',
        filterEcommerce: 'E-Commerce',
        filterFullStack: 'Full-Stack',
        filterBackend: 'Backend',
        manageBtn: 'Add / Manage Project',
        liveDemo: 'Live Demo',
        openNewTab: 'Open in New Tab',
        code: 'Code'
      },
      contact: {
        eyebrow: 'Contact',
        title: "Let's Build Something Great Together",
        subtitle: 'Open to Software Engineer and Full-Stack Web Developer roles, React & Node.js freelance projects, and product collaborations. Messages submitted here are saved directly to the Inbox database.',
        studioAlt: 'Creative Collaboration Studio',
        linkedin: 'LinkedIn Profile',
        github: 'GitHub Repositories',
        nameLabel: 'Your Name',
        emailLabel: 'Email Address',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'Full-Stack Project / Job Opportunity',
        messageLabel: 'Message',
        messagePlaceholder: 'Tell me about your project goals...',
        saving: 'Saving to Database...',
        sendBtn: 'Send Message',
        fallbackSuccess: 'Thank you, {{name}}! Your message has been recorded.'
      },
      inbox: {
        title: 'Contact Form Inbox',
        titleWithCount: 'Contact Form Inbox ({{count}})',
        subtitle: 'Incoming inquiries saved in MongoDB / server storage',
        searchPlaceholder: 'Search by sender name, email, subject, or keyword...',
        refresh: 'Refresh',
        close: 'Close',
        empty: 'No messages match your search yet.',
        defaultSubject: 'Portfolio Inquiry',
        recent: 'Recent',
        deleteTitle: 'Delete Message'
      },
      projectManager: {
        title: 'Manage Portfolio Projects',
        projectTitleLabel: 'Project Title *',
        projectTitlePlaceholder: 'e.g. Smart Task Manager App',
        categoryLabel: 'Category *',
        descriptionLabel: 'Description *',
        descriptionPlaceholder: 'Briefly explain what the project does and what problem it solves...',
        presetsLabel: 'Quick Cover Image Presets',
        liveUrlLabel: 'Live Demo URL',
        githubUrlLabel: 'GitHub Repo URL',
        techLabel: 'Tech Stack (comma separated)',
        customImageLabel: 'Custom Cover Image URL',
        adding: 'Adding Project...',
        addBtn: 'Add Project',
        addedSuccess: 'Project added successfully!',
        addedLocal: 'Project added to local preview list.',
        currentProjects: 'Current Projects ({{count}})',
        deleteTitle: 'Delete Project'
      },
      embeddedModal: {
        defaultTitle: 'Live Website Preview',
        reloadTitle: 'Reload',
        iframeTitle: 'Embedded Website'
      },
      footer: {
        copyright: '© 2026 All rights reserved.'
      }
    }
  },
  ar: {
    translation: {
      nav: {
        about: 'نبذة عني',
        skills: 'المهارات',
        liveStore: 'المتجر المباشر',
        projects: 'المشاريع',
        contact: 'تواصل معي',
        manageProjects: 'إدارة المشاريع',
        inbox: 'Inbox',
        backendTitle: 'حالة Backend وقاعدة البيانات',
        dbConnected: 'MongoDB متصل',
        apiJson: 'Node API + JSON',
        fullStack: 'Full-Stack',
        hireMe: 'توظيف / تعاون',
        toggleMenu: 'القائمة'
      },
      hero: {
        badge: 'مهندسة برمجيات • مطورة ويب Full-Stack • React • Node.js • MongoDB',
        greeting: 'مرحباً، أنا',
        headline: 'مهندسة برمجيات وأقوم بتطوير تطبيقات ويب حديثة وقابلة للتوسع.',
        lead: 'مهندسة برمجيات ومطورة ويب Full-Stack؛ أعمل على بناء واجهات React احترافية، وأنظمة Backend موثوقة بـ Node.js وExpress وLaravel، وقواعد بيانات MongoDB وMySQL—مع إمكانية تجربة الموقع الحي مباشرة داخل البورتفوليو.',
        openLiveStore: 'افتح المتجر المباشر فوراً',
        embeddedStore: 'المتجر المدمج',
        viewInbox: 'عرض Inbox',
        frontendLabel: 'Frontend',
        frontendStack: 'React • JS (ES6+) • CSS3',
        backendLabel: 'Backend',
        backendStack: 'Node.js • PHP • Laravel',
        databasesLabel: 'Databases',
        databasesStack: 'MongoDB • MySQL',
        setupAlt: 'بيئة عمل تطوير الويب',
        instantReady: '● جاهز للعرض الفوري',
        storeTitle: 'أورييل للمجوهرات الفاخرة',
        storeDesc: 'يعمل مباشرة داخل البورتفوليو دون مغادرة الصفحة',
        jewelryAlt: 'معرض أورييل للمجوهرات الفاخرة',
        deskAlt: 'مكتب تطوير برمجيات حديث'
      },
      about: {
        bannerAlt: 'هندسة برمجيات تعاونية',
        eyebrow: 'نبذة عني',
        title: 'تطوير ويب متكامل من الفكرة حتى النشر الفعلي',
        p1: 'أنا المهندسة آية جبر، مهندسة برمجيات ومطورة ويب Full-Stack أجمع بين تصميم واجهات المستخدم الواضحة وهيكلة Backend الموثوقة وقواعد البيانات المنظمة.',
        p2Prefix: 'سواء في تطوير متجر إلكتروني مثل',
        storeName: 'أورييل للمجوهرات الفاخرة',
        p2Suffix: 'أو بناء RESTful APIs باستخدام Node.js وMongoose وMySQL، أقدم حلولاً عملية وقابلة للتوسع.',
        feat1Title: 'واجهات Frontend منظمة',
        feat1Desc: 'بنية React قابلة لإعادة الاستخدام مع تفاعلات سلسة.',
        feat2Title: 'واجهات API وقواعد بيانات',
        feat2Desc: 'هيكلة البيانات والـ endpoints عبر Node.js وMongoDB وMySQL.',
        feat3Title: 'النشر والتشغيل المباشر',
        feat3Desc: 'إدارة الكود عبر Git والنشر السحابي المباشر عبر Vercel.'
      },
      skills: {
        eyebrow: 'الخبرات والتقنيات',
        title: 'مهارات وتقنيات Full-Stack',
        subtitle: 'اللغات، Frameworks، Databases، والأدوات التي أستخدمها لبناء تطبيقات ويب متكاملة.'
      },
      showcase: {
        eyebrow: 'معاينة حية مدمجة فوراً',
        title: 'أورييل للمجوهرات الفاخرة — مباشر داخل البورتفوليو',
        subtitle: 'الموقع المباشر مدمج داخل الصفحة نفسها وليس مجرد رابط خارجي، لتجربة التصفح والتفاعل معه بسلاسة.',
        instantReady: '● جاهز فوراً',
        preloading: '● جاري التحميل...',
        desktop: 'Desktop',
        mobile: 'Mobile',
        fastStageTitle: 'فتح نافذة العرض السريع',
        fastStage: 'عرض سريع',
        reloadTitle: 'إعادة تحميل المعاينة',
        openFullTitle: 'فتح الموقع في تبويب جديد',
        iframeTitle: 'متجر أورييل للمجوهرات المباشر',
        footerNote: 'مدمج مباشرة داخل الصفحة مع تحميل مسبق ونافذة عرض فورية.',
        launchStage: 'تشغيل العرض الفوري داخل البورتفوليو'
      },
      projects: {
        eyebrow: 'أعمال مختارة',
        title: 'أبرز مشاريع Full-Stack',
        subtitle: 'اضغط على "Live Demo" لتشغيل المشروع مباشرة داخل البورتفوليو والتفاعل معه فوراً.',
        filterAll: 'الكل',
        filterEcommerce: 'E-Commerce',
        filterFullStack: 'Full-Stack',
        filterBackend: 'Backend',
        manageBtn: 'إضافة / إدارة مشروع',
        liveDemo: 'Live Demo',
        openNewTab: 'فتح في تبويب جديد',
        code: 'الكود',
        items: {
          'Aurelle Fine Jewelry': {
            title: 'أورييل للمجوهرات الفاخرة',
            description: 'متجر إلكتروني للمجوهرات بتصميم عصري، تصفح منظم للمنتجات، وتجربة تسوق مريحة.'
          },
          'Full-Stack Developer Portfolio & MongoDB API': {
            title: 'بورتفوليو مطور Full-Stack وMongoDB API',
            description: 'بورتفوليو تفاعلي مبني بـ React وNode.js/Express وMongoDB/Mongoose، يضم معاينة مباشرة، فلترة وإدارة للمشاريع، وصندوق Inbox للرسائل.'
          },
          'Laravel & MySQL Inventory & Order Engine': {
            title: 'نظام مخزون وطلبات بـ Laravel وMySQL',
            description: 'نظام Backend متكامل لإدارة المنتجات والطلبات وصلاحيات المستخدمين مع تحسين قاعدة بيانات MySQL.'
          }
        }
      },
      contact: {
        eyebrow: 'تواصل معي',
        title: 'لنبدأ مشروعاً مميزاً معاً',
        subtitle: 'متاحة لفرص العمل كمهندسة برمجيات ومطورة Full-Stack ومشاريع الفريلانس بـ React وNode.js. الرسائل المرسلة هنا تُحفظ مباشرة في قاعدة بيانات Inbox.',
        studioAlt: 'استوديو تطوير وتعاون',
        linkedin: 'حساب LinkedIn',
        github: 'مستودعات GitHub',
        nameLabel: 'الاسم',
        emailLabel: 'البريد الإلكتروني',
        subjectLabel: 'الموضوع',
        subjectPlaceholder: 'مشروع Full-Stack / فرصة عمل',
        messageLabel: 'الرسالة',
        messagePlaceholder: 'اكتب تفاصيل المشروع أو متطلباتك...',
        saving: 'جاري الحفظ في قاعدة البيانات...',
        sendBtn: 'إرسال الرسالة',
        fallbackSuccess: 'شكراً لك يا {{name}}، تم تسجيل رسالتك بنجاح.'
      },
      inbox: {
        title: 'Contact Form Inbox',
        titleWithCount: 'Contact Form Inbox ({{count}})',
        subtitle: 'الرسائل الواردة المحفوظة في MongoDB / السيرفر',
        searchPlaceholder: 'ابحث بالاسم، البريد الإلكتروني، الموضوع، أو كلمة مفتاحية...',
        refresh: 'تحديث',
        close: 'إغلاق',
        empty: 'لا توجد رسائل مطابقة لبحثك حالياً.',
        defaultSubject: 'استفسار من البورتفوليو',
        recent: 'حديثاً',
        deleteTitle: 'حذف الرسالة'
      },
      projectManager: {
        title: 'إدارة مشاريع البورتفوليو',
        projectTitleLabel: 'اسم المشروع *',
        projectTitlePlaceholder: 'مثال: تطبيق إدارة مهام',
        categoryLabel: 'التصنيف *',
        descriptionLabel: 'الوصف *',
        descriptionPlaceholder: 'اشرح باختصار فكرة المشروع والمشكلة التي يحلها...',
        presetsLabel: 'صور غلاف جاهزة',
        liveUrlLabel: 'رابط Live Demo',
        githubUrlLabel: 'رابط GitHub',
        techLabel: 'التقنيات المستخدمة (مفصولة بفاصلة)',
        customImageLabel: 'رابط صورة غلاف مخصصة',
        adding: 'جاري الإضافة...',
        addBtn: 'إضافة مشروع',
        addedSuccess: 'تمت إضافة المشروع بنجاح!',
        addedLocal: 'تمت إضافة المشروع للقائمة المحلية مؤقتاً.',
        currentProjects: 'المشاريع الحالية ({{count}})',
        deleteTitle: 'حذف المشروع'
      },
      embeddedModal: {
        defaultTitle: 'معاينة الموقع المباشرة',
        reloadTitle: 'إعادة تحميل',
        iframeTitle: 'معاينة موقع مدمج'
      },
      footer: {
        copyright: '© 2026 جميع الحقوق محفوظة.'
      }
    }
  }
};

const applyDocumentDirection = (lng) => {
  const isArabic = lng?.startsWith('ar');
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  document.documentElement.lang = isArabic ? 'ar' : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

applyDocumentDirection(i18n.language);
i18n.on('languageChanged', applyDocumentDirection);

export default i18n;