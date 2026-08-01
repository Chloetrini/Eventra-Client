"use client";
"use client";

import { useState, type FormEvent, type ChangeEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Star, ArrowUpRight } from "lucide-react";
import { SiInstagram, SiFacebook, SiX } from "react-icons/si";
import { SlSocialLinkedin } from "react-icons/sl";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import crowdImage from "@/assets/crowd.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ContactFormState {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_FORM_STATE: ContactFormState = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

const EVENTRA_HQ: [number, number] = [6.5158, 3.3707]; // Yaba, Lagos
const MAP_LINK = "https://www.google.com/maps/search/?api=1&query=Yaba,Lagos,Nigeria";

const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/eventra", Icon: SiInstagram, style: { background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)" } },
  { name: "Facebook", href: "https://facebook.com/eventra", Icon: SiFacebook, style: { background: "#1877F2" } },
  { name: "X", href: "https://x.com/eventra", Icon: SiX, style: { background: "#000000" } },
  { name: "LinkedIn", href: "https://linkedin.com/company/eventra", Icon: SlSocialLinkedin, style: { background: "#0A66C2" } },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const handleChange =
    (field: keyof ContactFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
    setForm(INITIAL_FORM_STATE);
  };

  return (
    <div className="relative bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-white">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch xl:gap-14">
          <div className="flex flex-1 flex-col lg:max-w-[46%]">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest text-emerald-700">CONTACT</span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Let&rsquo;s make <span className="font-serif italic font-medium text-emerald-700">something</span> unforgettable.
            </h1>

            <p className="mt-6 max-w-md text-sm text-slate-600 sm:text-base">Questions, press, partnerships or need a hand with an event? Send us a message and we&rsquo;ll get back within a day.</p>

            <div className="relative mt-10 flex-1 z-10 rounded-3xl shadow-xl">
              <img src={crowdImage} alt="Crowd at an Eventra event" className=" w-full object-cover rounded-3xl h-full" />

              <div className="absolute -left-7 top-6 z-20 -rotate-6 rounded-lg bg-amber-400 px-3 py-2.5 shadow-lg sm:top-8 sm:px-4 sm:py-3">
                <p className="text-[9px] font-semibold tracking-wide text-emerald-950 sm:text-[10px]">eventra</p>
                <p className="text-base font-bold leading-tight text-emerald-950 sm:text-lg">VIP</p>
                <p className="text-[8px] font-medium tracking-widest text-emerald-900/80 sm:text-[9px]">No 0001 &middot; ADMIT ONE</p>
              </div>

              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 sm:h-3.5 sm:w-3.5" />
                4.9 &middot; 12k reviews
              </div> 


              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 sm:p-6 rounded-3xl">
                <p className="text-[10px] font-semibold tracking-widest text-amber-400 sm:text-[11px]">NOW TRENDING</p>
                <p className="text-xl font-bold text-white sm:text-2xl">6,214 events &middot; 42 cities</p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">&middot; Send a message</span>

            <h2 className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">How can we help?</h2>
            <p className="mt-1 text-sm text-slate-500">Tell us a little about you and what you&rsquo;re working on.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" placeholder="e.g Ada Okafor" value={form.fullName} onChange={handleChange("fullName")} required />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="eg you@email.com" value={form.email} onChange={handleChange("email")} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="General enquiry" value={form.subject} onChange={handleChange("subject")} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Let's know what's up...." className="min-h-32 resize-none" value={form.message} onChange={handleChange("message")} required />
              </div>

              <Button type="submit" disabled={status === "submitting"} className="w-full bg-emerald-800 text-white hover:bg-emerald-900">{status === "submitting" ? "Sending..." : status === "sent" ? "Message sent" : "Send message"}</Button>
            </form>

            <div className="my-7 h-px bg-slate-100" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-semibold tracking-widest text-slate-400">OR REACH US DIRECTLY ON</p>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map(({ name, href, Icon, style }) => (
                  <a key={name} href={href} aria-label={name} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-md  text-white shadow-sm transition hover:scale-105" style={style}>
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <ContactRow icon={<Mail className="h-4 w-4" />} label="EMAIL" value="hello@eventra.ng" href="mailto:hello@eventra.ng" />
              <ContactRow icon={<Phone className="h-4 w-4" />} label="PHONE" value="+234 800 000 0000" href="tel:+2348000000000" />
              <ContactRow icon={<MapPin className="h-4 w-4" />} label="OFFICE" value="Yaba, Lagos, Nigeria" href={MAP_LINK} />
            </div>
          </div>
        </div>

        <div className="mt-20 sm:mt-24">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-0.5 w-6 bg-amber-400" />
                <span className="text-xs font-semibold tracking-widest text-emerald-700">FIND US</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Yaba, Lagos &middot; Nigeria</h2>
            </div>

            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700">Open in map
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm sm:h-[400px] lg:h-[480px]">
            <MapContainer center={EVENTRA_HQ} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={EVENTRA_HQ}>
                <Popup>
                  <strong>Eventra HQ</strong>
                  <br />Yaba, Lagos, Nigeria
                </Popup>
              </Marker>
            </MapContainer>

            <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] max-w-[13rem] rounded-2xl bg-white/95 p-3.5 shadow-lg backdrop-blur sm:bottom-6 sm:left-6 sm:max-w-xs sm:p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><MapPin className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Eventra HQ</p>
                  <p className="text-xs text-slate-500">Yaba, Lagos &middot; Nigeria</p>
                  <p className="mt-1 text-xs text-slate-500">Weekdays &middot; 9AM &ndash; 6PM</p>
                  <p className="mt-1 text-xs font-medium text-emerald-700">&middot; Open now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactRow({ icon, label, value, href, }: { icon: ReactNode; label: string; value: string; href: string; }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/50">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm">{icon}</span>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-slate-400">{label}</p>
          <p className="text-sm font-medium text-slate-900">{value}</p>
        </div>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
    </a>
  );
}
