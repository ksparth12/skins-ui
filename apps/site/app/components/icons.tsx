import type { IconProps } from "@phosphor-icons/react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  Check,
  Copy,
  CornersOut,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Eye,
  FileCode,
  FileCss,
  FileTsx,
  Moon,
  Plus,
  Sun,
  TerminalWindow,
} from "@phosphor-icons/react/ssr";
import type { ComponentType } from "react";

/** Every site icon is Phosphor, 16px by default, regular weight, hidden from screen readers. */
const icon = (Glyph: ComponentType<IconProps>) =>
  function SiteIcon(props: IconProps) {
    return <Glyph size={16} weight="regular" aria-hidden="true" {...props} />;
  };

export const SunIcon = icon(Sun);
export const MoonIcon = icon(Moon);
export const DesktopIcon = icon(Desktop);
export const TabletIcon = icon(DeviceTablet);
export const PhoneIcon = icon(DeviceMobile);
export const ReplayIcon = icon(ArrowCounterClockwise);
export const ResetIcon = icon(ArrowCounterClockwise);
export const ExpandIcon = icon(CornersOut);
export const CopyIcon = icon(Copy);
export const CheckIcon = icon(Check);
export const EyeIcon = icon(Eye);
export const TerminalIcon = icon(TerminalWindow);
export const FileIcon = icon(FileCode);
export const PlusIcon = icon(Plus);
export const ArrowRightIcon = icon(ArrowRight);

/** The icon for a file, from its name. */
export function FileTypeIcon({ name, ...props }: IconProps & { name: string }) {
  const Glyph = name.endsWith(".tsx") ? FileTsx : name.endsWith(".css") ? FileCss : FileCode;
  return <Glyph size={16} weight="regular" aria-hidden="true" {...props} />;
}
