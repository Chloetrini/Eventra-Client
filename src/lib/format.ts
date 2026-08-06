export const Format = {
  /**
   * Formats numbers into Nigerian Naira (₦) currency format or specified currency
   */
  amount: (value: number, currency: string = "NGN"): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  },

  /**
   * Formats ISO date strings or Date objects into human-readable format (e.g. "Sat, Nov 18")
   */
  date: (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  },

  /**
   * Formats time into 12-hour AM/PM string (e.g. "8:00 PM")
   */
  time: (dateInput: string | Date): string => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  },

shortDate: (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }); // → "Fri 20 Feb"
},

shortLocation: (location: string) => {
  // Returns just the venue name, before the comma
  return location.split(",")[0].trim(); // "V.I. Rooftop, Lagos" → "V.I. Rooftop"
},
};