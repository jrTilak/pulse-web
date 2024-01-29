import { Link } from "react-router-dom";
import { IconType } from "react-icons";

import { FaFacebook, FaLinkedinIn } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaXTwitter, FaGithub, FaYoutube, FaDiscord } from "react-icons/fa6";
import { IoLinkSharp } from "react-icons/io5";
import { RiExternalLinkFill } from "react-icons/ri";
import { FcReddit } from "react-icons/fc";
import { IUser } from "@/types/user-types";

export const supportedSocialLinks: Record<string, IconType> = {
  facebook: FaFacebook,
  instagram: AiFillInstagram,
  twitter: FaXTwitter,
  linkedin: FaLinkedinIn,
  github: FaGithub,
  portfolio: IoLinkSharp,
  website: IoLinkSharp,
  others: RiExternalLinkFill,
  youtube: FaYoutube,
  discord: FaDiscord,
  reddit: FcReddit,
} as const;

export type SupportedSocialLinksType = keyof typeof supportedSocialLinks;

const SocialLinkBadge = ({
  socialLink,
}: {
  socialLink: IUser["socialLinks"][0];
}) => {
  const { label, name, url } = socialLink;
  const Icon = supportedSocialLinks[label];
  return (
    <Link
      className="flex gap-2 opacity-70 hover:opacity-100"
      to={url}
      target="_blank"
    >
      <Icon className="text-2xl" />
      <span>{name}</span>
    </Link>
  );
};
export default SocialLinkBadge;
