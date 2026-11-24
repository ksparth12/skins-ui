import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="2.75" />
    <path d="M8 1.75v1.25M8 13v1.25M1.75 8H3M13 8h1.25M3.6 3.6l.9.9M11.5 11.5l.9.9M3.6 12.4l.9-.9M11.5 4.5l.9-.9" />
  </Icon>
);
export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.25 9.6A5.5 5.5 0 0 1 6.4 2.75a5.5 5.5 0 1 0 6.85 6.85Z" />
  </Icon>
);
export const DesktopIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="1.75" y="2.75" width="12.5" height="8.5" rx="1.5" />
    <path d="M5.5 13.75h5M8 11.25v2.5" />
  </Icon>
);
export const TabletIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.25" y="1.75" width="9.5" height="12.5" rx="1.5" />
    <path d="M7.25 12h1.5" />
  </Icon>
);
export const PhoneIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4.75" y="1.75" width="6.5" height="12.5" rx="1.5" />
    <path d="M7.25 12h1.5" />
  </Icon>
);
export const ReplayIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.75 8a5.25 5.25 0 1 0 1.54-3.71" />
    <path d="M2.75 2.75v2.5h2.5" />
  </Icon>
);
export const ExpandIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9.75 2.25h4v4M6.25 13.75h-4v-4M13.75 2.25 9.5 6.5M2.25 13.75 6.5 9.5" />
  </Icon>
);
export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="2" />
    <path d="M10.75 5.25V4A1.75 1.75 0 0 0 9 2.25H4A1.75 1.75 0 0 0 2.25 4v5A1.75 1.75 0 0 0 4 10.75h1.25" />
  </Icon>
);
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.25 8.5 6.5 11.75l6.25-7.5" />
  </Icon>
);
export const FileIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9.25 1.75H4.5a1.25 1.25 0 0 0-1.25 1.25v10a1.25 1.25 0 0 0 1.25 1.25h7a1.25 1.25 0 0 0 1.25-1.25V5.25Z" />
    <path d="M9.25 1.75v3.5h3.5M6 9.75l-1 1 1 1M10 9.75l1 1-1 1" />
  </Icon>
);
export const TerminalIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="1.75" y="2.75" width="12.5" height="10.5" rx="1.75" />
    <path d="m4.5 6.25 2 1.75-2 1.75M8.25 10h3" />
  </Icon>
);
export const ResetIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.75 8a5.25 5.25 0 1 0 1.54-3.71" />
    <path d="M2.75 2.75v2.5h2.5" />
  </Icon>
);
