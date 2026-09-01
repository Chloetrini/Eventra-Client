import { type Event } from "@/types/event-types"
import { UserAvatar } from "@/components/ui/user-avatar"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth.context"
import { useFollowOrganizer, useUnfollowOrganizer } from "@/hooks/use-follow"
import { toast } from "react-toastify"

// The backend's public event endpoint (getEventBySlug) populates
// `organizer` as a SINGLE populated User document — not an array — via
// `.populate('organizer', 'fullname organizerProfile.businessName')`.
// `organizer` is typed `z.any()` in schema.ts (its shape differs by
// endpoint), so this describes what this component actually expects.
//
// avatarUrl and organizerProfile.approvalStatus aren't in that populate
// select yet, so they'll read undefined until the backend adds them —
// this component already handles that gracefully (falls back to
// initials / hides the verified badge) so it's ready the moment they do.
type EventOrganizerData = {
  _id?: string;
  fullname?: string;
  avatarUrl?: string;
  organizerProfile?: {
    businessName?: string;
    approvalStatus?: "draft" | "pending" | "approved" | "rejected";
  };
};

export const EventOrganizer = ({ event }: { event: Event }) => {
  // Was `event.organizer[0]` — the backend sends organizer as a single
  // object, not an array, so that index access always read undefined.
  // Name, the verified badge, and the photo were all silently blank
  // because of this, not just the photo.
  const organizer = event.organizer as EventOrganizerData | undefined;
  const { user } = useAuth();
  const followMutation = useFollowOrganizer();
  const unfollowMutation = useUnfollowOrganizer();

  if (!organizer) return null;

  const displayName = organizer.organizerProfile?.businessName || organizer.fullname;
  const isVerified = organizer.organizerProfile?.approvalStatus === "approved";

  // Only a logged-in attendee sees the button — organizers/admins don't
  // follow other organizers, and a logged-out visitor has no account for
  // this to attach to.
  const canFollow = user?.role === "attendee" && organizer._id;
  const isFollowing = Array.isArray((user as any)?.following) && (user as any).following.includes(organizer._id);

  const handleToggleFollow = () => {
    if (!organizer._id) return;
    if (isFollowing) {
      unfollowMutation.mutate(organizer._id, {
        onError: () => toast.error("Could not unfollow. Please try again."),
      });
    } else {
      followMutation.mutate(organizer._id, {
        onSuccess: () => toast.success(`Following ${displayName}`),
        onError: () => toast.error("Could not follow. Please try again."),
      });
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Organizer</h2>
      <div className="bg-muted flex items-center justify-between gap-3 rounded-xl border p-4">
        <div className="flex items-center gap-3">
          <UserAvatar
            avatarUrl={organizer.avatarUrl}
            name={displayName}
            className="h-12 w-12 text-sm font-bold bg-gray-900 text-white"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold">{displayName}</p>
              {isVerified && (
                <Check className="h-4 w-4 bg-[#0F6E56] text-[#FFFFFF] rounded-full" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {isVerified ? "Verified organizer" : "Organizer"}
            </p>
          </div>
        </div>

        {canFollow && (
          <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={handleToggleFollow}
            disabled={followMutation.isPending || unfollowMutation.isPending}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        )}
      </div>
    </section>
  )
}