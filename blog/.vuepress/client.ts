import {defineClientConfig} from "@vuepress/client";
import {addIcons} from "oh-vue-icons";
import {
    AiCv,
    AiGoogleScholarSquare,
    BiDiamondHalf,
    FaFortAwesome,
    FaPaw,
    FaSatelliteDish,
    FaTag,
    HiMail,
    OiRocket,
    RiFacebookBoxFill,
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
    RiTwitterFill,
    RiZhihuLine,
    HiMail,
    FaPaw,
    AiCv,
    BiDiamondHalf,
    AiGoogleScholarSquare
);

export default defineClientConfig({});
