export const routes = {
  home: "/admin",
  adminLogin: "/login",
  admin: {
    dashboard: "/admin/dashboard",
    contentManagement: {
      home: "/admin/content-management",
      create: "/admin/content-management/create",
      edit: (id: number | string) => `/admin/content-management/update/${id}`
    },
    song: {
      home: "/admin/songs",
      create: "/admin/songs/create",
      edit: (id: number | string) => `/admin/songs/update/${id}`
    },
    songBook: {
      home: "/admin/song-book",
      create: "/admin/song-book/create",
      edit: (id: number | string) => `/admin/song-book/update/${id}`
    },
    video: {
      home: "/admin/videos",
      create: "/admin/videos/create",
      edit: (id: number | string) => `/admin/videos/update/${id}`
    },
    videoCategory: {
      home: "/admin/video-category",
      create: "/admin/video-category/create",
      edit: (id: number | string) => `/admin/video-category/update/${id}`
    },
    language: {
      home: "/admin/language",
      create: "/admin/language/create",
      edit: (id: number | string) => `/admin/language/update/${id}`
    },
    version: {
      home: "/admin/version",
      create: "/admin/version/create",
      edit: (id: number | string) => `/admin/version/update/${id}`
    },
    book: {
      home: "/admin/book",
      create: "/admin/book/create",
      edit: (id: number | string) => `/admin/book/update/${id}`
    },
    chapter: {
      home: "/admin/chapter",
      create: "/admin/chapter/create",
      edit: (id: number | string) => `/admin/chapter/update/${id}`
    },
    verse: {
      home: "/admin/verse",
      create: "/admin/verse/create",
      edit: (id: number | string) => `/admin/verse/update/${id}`
    },
    dailyManna: {
      home: "/admin/daily-manna",
      create: "/admin/daily-manna/create",
      edit: (id: number | string) => `/admin/daily-manna/update/${id}`
    },
    dailyVerse: {
      home: "/admin/daily-verse",
      create: "/admin/daily-verse/create",
      edit: (id: number | string) => `/admin/daily-verse/update/${id}`
    },
    prayer: {
      home: "/admin/prayer",
      create: "/admin/prayer/create",
      edit: (id: number | string) => `/admin/prayer/update/${id}`
    },
    poster: {
      home: "/admin/poster",
      create: "/admin/poster/create",
      edit: (id: number | string) => `/admin/poster/update/${id}`
    },
    posterCategory: {
      home: "/admin/poster-category",
      create: "/admin/poster-category/create",
      edit: (id: number | string) => `/admin/poster-category/update/${id}`
    },
    questionAnswer: {
      home: "/admin/question-answers",
      create: "/admin/question-answers/create",
      edit: (id: number | string) => `/admin/question-answers/update/${id}`
    },
    questionAnswerCategory: {
      home: "/admin/question-answers-categories",
      create: "/admin/question-answers-categories/create",
      edit: (id: number | string) => `/admin/question-answers-categories/update/${id}`
    },
    tag: {
      home: "/admin/tag",
      create: "/admin/tag/create",
      edit: (id: number | string) => `/admin/tag/update/${id}`
    },
    // example: {
    //   home: "/admin/example",
    //   create: "/admin/example/create",
    //   edit: (id: number | string) => `/admin/example/update/${id}`
    // },

    dictionary: {
      home: "/admin/dictionary",
      create: "/admin/dictionary/create",
      edit: (id: number | string) => `/admin/dictionary/update/${id}`
    },
    user: {
      home: `/admin/users`,
      create: "/admin/users/create",
      edit: (id: number | string) => `/admin/users/update/${id}`
    },
    manageAdmin: "/admin/manage-admins",
    generalSettings: "/admin/general-settings",
    manageLive: {
      home: "/admin/manage-live-matches",
      create: "/admin/manage-live-matches/create",
      details: (id: string) => `/admin/manage-live-matches/${id}`,
      edit: (id: number) => `/admin/manage-live-matches/update/${id}`
    }
  }
};
