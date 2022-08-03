import { defineClientConfig } from "@vuepress/client";
import { addIcons } from "oh-vue-icons";
import {
  AiCv,
  AiGoogleScholarSquare,
  BiDiamondHalf,
  BiSteam,
  BiYoutube,
  BiBookHalf,
  FaFortAwesome,
  FaPaw,
  FaSatelliteDish,
  FaTag,
  HiMail,
  OiRocket,
  RiFacebookBoxFill,
  BiBookmarkHeartFill,
  ViFileTypeLightTodo,
  RiContactsBook2Fill,
  ViFolderTypeRedis,
  ViFileTypeHtml,
  IoLogoNodejs,
  ViFileTypeGo,
  ViFileTypeGit,
  ViFolderTypeMongodb,
  SiAiohttp,
  ViFileTypeNginx,
  ViFileTypeDocker2,
  SiCoronaengine,
  BiHypnotize,

  RiBook2Fill,
  RiBookReadFill,
  RiBookletFill,
  RiBookOpenFill,
  RiBookmark3Fill,
  RiContactsBookUploadFill,
  SiBookstack,
  MdLibrarybooksRound,
  MdBookRound,


  CoSpacemacs,
  FaTools,
  ViFileTypeJenkins,
  RiMessage3Fill,
  RiGithubFill,
  RiLinkedinBoxFill,
  RiLinkM,
  RiTwitterFill,
  RiZhihuLine
} from "oh-vue-icons/icons";

addIcons(
  FaFortAwesome,
  FaSatelliteDish,
  FaTag,
  OiRocket,
  RiLinkM,
  RiGithubFill,
  RiLinkedinBoxFill,
  RiFacebookBoxFill,
  BiBookmarkHeartFill,
  ViFileTypeLightTodo,
  RiContactsBook2Fill,
  ViFolderTypeRedis,
  ViFileTypeHtml,
  IoLogoNodejs,
  ViFileTypeGo,
  ViFileTypeGit,
  ViFolderTypeMongodb,
  SiAiohttp,
  ViFileTypeNginx,
  ViFileTypeDocker2,
  SiCoronaengine,
  BiHypnotize,

  RiBook2Fill,
  RiBookReadFill,
  RiBookletFill,
  RiBookOpenFill,
  // RiBookmark3Fill,
  // RiContactsBookUploadFill,
  // SiBookstack,
  // MdLibrarybooksRound,
  // MdBookRound,

  CoSpacemacs,
  FaTools,
  ViFileTypeJenkins,
  RiMessage3Fill,
  RiTwitterFill,
  RiZhihuLine,
  HiMail,
  FaPaw,
  AiCv,
  BiDiamondHalf,
  BiYoutube,
  BiSteam,
  BiBookHalf,
  AiGoogleScholarSquare
);

const isProd = process.env.NODE_ENV === "production";

export default defineClientConfig({
  enhance({ router }) {
    router.beforeEach((to) => {
      // if (isProd) {
        // document.head.innerHTML = document.head.innerHTML + '<script async defer data-website-id="ce8fe04d-bd4e-4d37-894b-5450f5f4fb0a" src="https://umami.alomerry.com/umami.js"></script>'
      // }
    })
  },
});
