import { cn } from "@/services/utils";

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string;
  /** Sizing + font-size classes, e.g. "h-9 w-9 text-sm" — applied to both the image and the initials fallback so they swap in place. */
  className?: string;
}

/**
 * A user's profile picture if they've uploaded one, otherwise their
 * initials in a filled circle — used everywhere a user's avatar shows up
 * (navbar, dashboard topbar, profile page) so uploading a photo once
 * replaces the initials app-wide.
 */
export function UserAvatar({ avatarUrl, name, className }: UserAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ? `${name}'s profile picture` : "Profile picture"}
        className={cn("rounded-full object-cover shrink-0", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[#333333] text-white font-bold shrink-0",
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
