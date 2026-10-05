import { SocialImage, socialAlt, socialContentType, socialSize } from "@/lib/social-image";

export const alt = socialAlt;
export const size = socialSize;
export const contentType = socialContentType;

export default function OpenGraphImage() {
  return SocialImage();
}
