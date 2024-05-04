import { routes } from "@/config/routes";
import { BiVideoRecording } from "react-icons/bi";
import { BsFilePost } from "react-icons/bs";
import { FaCogs } from "react-icons/fa";
import { FaRegNoteSticky } from "react-icons/fa6";
import { GiPrayer } from "react-icons/gi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoBookOutline } from "react-icons/io5";
import { LuBook, LuFileText, LuHighlighter, LuLayoutDashboard, LuMusic, LuUserCog, LuUsers } from "react-icons/lu";
import { RiQuestionAnswerLine } from "react-icons/ri";

// Note: do not add href in the label object, it is rendering as label
export const menuItems = [
  // label start
  // {
  //   name: 'Overview',
  // },
  // label end
  {
    name: "Dashboard",
    href: routes.admin.dashboard,
    icon: <LuLayoutDashboard />
  },
  {
    name: "Highlight",
    href: "#",
    icon: <LuHighlighter />
  },
  {
    name: "Note",
    href: "#",
    icon: <FaRegNoteSticky />
  },
  {
    name: "CMS Management",
    href: routes.admin.contentManagement.home,
    icon: <LuFileText />
  },
  {
    name: "Prayer Requests",
    href: routes.admin.prayer.home,
    icon: <GiPrayer />
  },
  {
    name: "Videos",
    href: "#",
    icon: <BiVideoRecording />,
    dropdownItems: [
      {
        name: "Videos",
        href: routes.admin.video.home
      },
      {
        name: "Video Categories",
        href: routes.admin.videoCategory.home
      }
    ]
  },
  {
    name: "Songs",
    href: "#",
    icon: <LuMusic />,
    dropdownItems: [
      {
        name: "Songs",
        href: routes.admin.song.home
      },
      {
        name: "Song Books",
        href: routes.admin.songBook.home
      }
    ]
  },
  {
    name: "Bible",
    href: "#",
    icon: <IoBookOutline />,
    dropdownItems: [
      {
        name: "Language",
        href: routes.admin.language.home
      },
      {
        name: "Version",
        href: routes.admin.version.home
      },
      {
        name: "Book",
        href: routes.admin.book.home
      },
      {
        name: "Chapter",
        href: routes.admin.chapter.home
      },
      {
        name: "Verse",
        href: routes.admin.verse.home
      }
    ]
  },
  {
    name: "Daily Notifications",
    href: "#",
    icon: <IoMdNotificationsOutline />,
    dropdownItems: [
      {
        name: "Manna",
        href: routes.admin.dailyManna.home
      },
      {
        name: "Verse",
        href: routes.admin.dailyVerse.home
      }
    ]
  },
  {
    name: "Poster",
    href: "#",
    icon: <BsFilePost />,
    dropdownItems: [
      {
        name: "Poster",
        href: routes.admin.poster.home
      },
      {
        name: "Poster Category",
        href: routes.admin.posterCategory.home
      }
    ]
  },
  {
    name: "Questions/Answers",
    href: "#",
    icon: <RiQuestionAnswerLine />,
    dropdownItems: [
      {
        name: "Questions/Answers",
        href: routes.admin.questionAnswer.home
      },
      {
        name: "Questions/Answers Category",
        href: routes.admin.questionAnswerCategory.home
      }
    ]
  },
  {
    name: "Dictionary",
    href: "#",
    icon: <LuBook />,
    dropdownItems: [
      {
        name: "Tag",
        href: routes.admin.tag.home
      },
      // {
      //   name: "Example",
      //   href: routes.admin.example.home
      // },
      {
        name: "Dictionary",
        href: routes.admin.dictionary.home
      }
    ]
  },
  {
    name: "Manage Users",
    href: routes.admin.user.home,
    icon: <LuUsers />
  },
  {
    name: "Manage Admins",
    href: routes.admin.manageAdmin,
    icon: <LuUserCog />
  },
  {
    name: "General Settings",
    href: routes.admin.generalSettings,
    icon: <FaCogs />
  }
];
