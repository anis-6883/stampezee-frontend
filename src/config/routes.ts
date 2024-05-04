export const routes = {
  home: '/project-admin',
  adminLogin: '/login',
  user: {
    profile: '/profile',
  },
  admin: {
    dashboard: '/project-admin/dashboard',
    contentManagement: {
      home: '/project-admin/content-management',
      create: '/project-admin/content-management/create',
      edit: (id: number | string) => `/project-admin/content-management/update/${id}`,
    },
    song: {
      home: '/project-admin/songs',
      create: '/project-admin/songs/create',
      edit: (id: number | string) => `/project-admin/songs/update/${id}`,
    },
    songBook: {
      home: '/project-admin/song-book',
      create: '/project-admin/song-book/create',
      edit: (id: number | string) => `/project-admin/song-book/update/${id}`,
    },
    video: {
      home: '/project-admin/videos',
      create: '/project-admin/videos/create',
      edit: (id: number | string) => `/project-admin/videos/update/${id}`,
    },
    videoCategory: {
      home: '/project-admin/video-category',
      create: '/project-admin/video-category/create',
      edit: (id: number | string) => `/project-admin/video-category/update/${id}`,
    },
    language: {
      home: '/project-admin/language',
      create: '/project-admin/language/create',
      edit: (id: number | string) => `/project-admin/language/update/${id}`,
    },
    version: {
      home: '/project-admin/version',
      create: '/project-admin/version/create',
      edit: (id: number | string) => `/project-admin/version/update/${id}`,
    },
    book: {
      home: '/project-admin/book',
      create: '/project-admin/book/create',
      edit: (id: number | string) => `/project-admin/book/update/${id}`,
    },
    chapter: {
      home: '/project-admin/chapter',
      create: '/project-admin/chapter/create',
      edit: (id: number | string) => `/project-admin/chapter/update/${id}`,
    },
    verse: {
      home: '/project-admin/verse',
      create: '/project-admin/verse/create',
      edit: (id: number | string) => `/project-admin/verse/update/${id}`,
    },
    dailyManna: {
      home: '/project-admin/daily-manna',
      create: '/project-admin/daily-manna/create',
      edit: (id: number | string) => `/project-admin/daily-manna/update/${id}`,
    },
    dailyVerse: {
      home: '/project-admin/daily-verse',
      create: '/project-admin/daily-verse/create',
      edit: (id: number | string) => `/project-admin/daily-verse/update/${id}`,
    },
    prayer: {
      home: '/project-admin/prayer',
      create: '/project-admin/prayer/create',
      edit: (id: number | string) => `/project-admin/prayer/update/${id}`,
    },
    poster: {
      home: '/project-admin/poster',
      create: '/project-admin/poster/create',
      edit: (id: number | string) => `/project-admin/poster/update/${id}`,
    },
    posterCategory: {
      home: '/project-admin/poster-category',
      create: '/project-admin/poster-category/create',
      edit: (id: number | string) => `/project-admin/poster-category/update/${id}`,
    },
    questionAnswer: {
      home: '/project-admin/question-answers',
      create: '/project-admin/question-answers/create',
      edit: (id: number | string) => `/project-admin/question-answers/update/${id}`,
    },
    questionAnswerCategory: {
      home: '/project-admin/question-answers-categories',
      create: '/project-admin/question-answers-categories/create',
      edit: (id: number | string) => `/project-admin/question-answers-categories/update/${id}`,
    },
    tag: {
      home: '/project-admin/tag',
      create: '/project-admin/tag/create',
      edit: (id: number | string) => `/project-admin/tag/update/${id}`,
    },

    dictionary: {
      home: '/project-admin/dictionary',
      create: '/project-admin/dictionary/create',
      edit: (id: number | string) => `/project-admin/dictionary/update/${id}`,
    },
    user: {
      home: `/project-admin/users`,
      create: '/project-admin/users/create',
      edit: (id: number | string) => `/project-admin/users/update/${id}`,
    },
    manageAdmin: '/project-admin/manage-admins',
    generalSettings: '/project-admin/general-settings',
    manageLive: {
      home: '/project-admin/manage-live-matches',
      create: '/project-admin/manage-live-matches/create',
      details: (id: string) => `/project-admin/manage-live-matches/${id}`,
      edit: (id: number) => `/project-admin/manage-live-matches/update/${id}`,
    },
  },
};
