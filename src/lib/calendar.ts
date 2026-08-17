// Client-side "Add to calendar" support — generates a standard .ics file
// and triggers a download. No backend endpoint exists for this (checked),
// and none is actually needed: everything an .ics file needs (title, date,
// location) is already available wherever a ticket is shown.
//
// The generated file opens in Apple Calendar, Outlook, Google Calendar
// (via import), and pretty much anything else that understands iCalendar.

interface IcsEventInput {
  title: string;
  description?: string;
  location?: string;
  /** Event start — ISO string or Date. */
  start: string | Date;
  /** Event end — defaults to 3 hours after start if not provided. */
  end?: string | Date;
}

function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Builds a .ics file for the given event and triggers a browser download.
 * Silently no-ops if the start date can't be parsed, rather than
 * downloading a broken calendar file.
 */
export function downloadEventIcs({ title, description, location, start, end }: IcsEventInput) {
  const startDate = typeof start === "string" ? new Date(start) : start;
  if (Number.isNaN(startDate.getTime())) return;

  const endDate = end
    ? typeof end === "string"
      ? new Date(end)
      : end
    : new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  const uid = `${startDate.getTime()}-${Math.random().toString(36).slice(2)}@eventra`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Eventra//Ticket//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(startDate)}`,
    `DTEND:${toIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    location ? `LOCATION:${escapeIcsText(location)}` : null,
    description ? `DESCRIPTION:${escapeIcsText(description)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  const icsContent = lines.join("\r\n");
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(title || "event").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
