import type { RevenuePageData } from "@/types/revenue";
import { ur } from "zod/v4/locales";

export function exportRevenueCsv(data: RevenuePageData) {
    // lines: string[] — we build the CSV as an array of individual text lines first,
    //  then join them at the end with "\n" (newline characters) — much easier to read/debug
    //  than concatenating one giant string manually.
    const lines: string[] = []

    lines.push("Eventra Revenue Report");
    lines.push("")

    lines.push("Summary");
    lines.push(`Platform Revenue, ${data.summary.platformRevenueChangePct}`);
    lines.push(`Commission (${data.summary.commissionRatePct}%),${data.summary.commission}`);
    lines.push(`Promotions,${data.summary.promotions}`);
    lines.push(`Gross Ticket Sales,${data.summary.grossTicketSales}`);
    lines.push("");

    lines.push("Top Earning Events");
    lines.push("Event,Organizer,Commission");

    // Wrapping event/organizer names in quotes ("${event.eventTitle}") —
    //  this is standard CSV convention: if a text value happens to contain a comma, wrapping it in quotes
    //  tells spreadsheet software "treat everything between these quotes as one single value," preventing the comma from accidentally splitting into an extra column.

    data.topEarningEvents.forEach((event) =>{
        lines.push(`"${event.eventTitle}", "${event.organizer}", "${event.commission}"`)
    });
    lines.push("")

     lines.push("Monthly Breakdown");
     lines.push("Month,Gross Sales,Commission,Promotion,Total");

     data.monthlyBreakdown.forEach((row) =>{
        lines.push(`${row.month},${row.grossSales},${row.commission},${row.promotion},${row.total}`);
     });

     const csvContent = lines.join("\n");
    //  new Blob([csvContent], ...) — a Blob is a browser object representing raw file-like data
    //  in memory. We're essentially saying "treat this text string as if it were a file."
     const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});

    //  URL.createObjectURL(blob) — generates a special,
    //  temporary browser-only URL pointing at that in-memory Blob 
    // (something like blob:http://localhost:4001/a1b2c3...).
     const url = URL.createObjectURL(blob)

    //  Creating an invisible <a> link and clicking it programmatically — 
    // this is the standard trick for triggering a file download without the user 
    // manually right-clicking "Save As." We create a link element, point it at our Blob URL,
    //  set download="filename.csv" (which tells the browser "download this instead of navigating to it"), add it to the page, simulate a click, then immediately remove it — the user never actually sees this link exist.

     const link = document.createElement("a");
     link.href = url
     link.download = `eventra-revenue-${new Date().toISOString().slice(0, 10)}.csv`;
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);

    //  URL.revokeObjectURL(url) — cleanup, freeing the memory the browser allocated for
    //  that temporary Blob URL, since we no longer need it after the download starts.
     URL.revokeObjectURL(url)
}