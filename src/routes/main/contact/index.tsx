"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Star, ArrowUpRight } from "lucide-react";
import { SiInstagram, SiFacebook, SiX } from "react-icons/si";
import { SlSocialLinkedin } from "react-icons/sl";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import crowdImage from "@/assets/crowd.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBox } from "@/components/ui/form-box";
import { contactSchema } from "@/lib/schema";
import { z } from "zod";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PageWrapper from "@/components/page-wrapper";

// Ensure leaflet marker images resolve correctly
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type ContactFormValues = z.infer<typeof contactSchema>;

const DEFAULT_FORM_VALUES: ContactFormValues = {
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
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onBlur",
  });

  const onSubmit = async (_data: ContactFormValues) => {
    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("sent");
    reset(DEFAULT_FORM_VALUES);
  };

  return (
    <div className="relative bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-white dark:from-background dark:via-background dark:to-background">
     <PageWrapper className="p-[20px]">

        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch xl:gap-14">
          <div className="flex flex-1 flex-col lg:max-w-[46%]">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-0.5 w-6 bg-amber-400" />
              <span className="text-xs font-semibold tracking-widest text-emerald-700 dark:text-emerald-400">CONTACT</span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Let&rsquo;s make <span className="font-serif italic font-medium text-emerald-700 dark:text-emerald-400">something</span> unforgettable.
            </h1>

            <p className="mt-6 max-w-md text-sm text-muted-foreground sm:text-base">Questions, press, partnerships or need a hand with an event? Send us a message and we&rsquo;ll get back within a day.</p>

            <div className="relative mt-10 flex-1 z-10 rounded-3xl shadow-xl">
              <img src={crowdImage} alt="Crowd a-t an Eventra event" className="w-full object-cover rounded-3xl h-full" />

              <div className="absolute -left-2 -top-3 z-20 -rotate-8 rounded-lg bg-[#F5A524] pt-1 pl-2  md:pt-2.5 shadow-lg md:-top-3 md:pl-4 w-[110px] h-[68px] md:h-[125px] md:w-[203px]">
                <p className="text-[11px] font-[700] font-grotesk tracking-wide text-[#4A4451] md:text-[20px]">eventra</p>
                <p className="text-[18px] font-[800] leading-tight text-[#4A4451] md:text-[34px] mb-2">VIP</p>
                <p className="text-[6.5px] font-mono font-[400] tracking-widest text-[#6E6577] md:text-[12px]">No 0001 &middot; ADMIT ONE</p>
              </div>

              <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-[700] text-slate-900 shadow sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 md:text-[18px] font-sans">
                <Star className="h-3 w-3 fill-[#3A3A3A] text-[#3A3A3A] sm:h-3.5 sm:w-3.5 " />
                4.9 &middot; 12k reviews
              </div>


              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 sm:p-6 rounded-3xl">
                <p className="text-[10px] font-semibold tracking-widest text-amber-400 sm:text-[11px]">NOW TRENDING</p>
                <p className="text-xl font-bold text-white sm:text-2xl">6,214 events &middot; 42 cities</p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
            <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 dark:bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">&middot; Send a message</span>

            <h2 className="mt-4 text-xl font-bold text-foreground sm:text-2xl">How can we help?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tell us a little about you and what you&rsquo;re working on.</p>

     
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <FormBox
                label="Full name"
                type="text"
                id="fullName"
                name="fullName"
                register={register}
                errors={errors.fullName}
                placeholder="e.g Ada Okafor"
                classname="space-y-2"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <FormBox
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  register={register}
                  errors={errors.email}
                  placeholder="eg you@email.com"
                  classname="space-y-2"
                />
                <FormBox
                  label="Subject"
                  type="text"
                  id="subject"
                  name="subject"
                  register={register}
                  errors={errors.subject}
                  placeholder="General enquiry"
                  classname="space-y-2"
                />
              </div>

              <FormBox
                label="Message"
                type="text"
                id="message"
                name="message"
                register={register}
                errors={errors.message}
                placeholder="Let's know what's up...."
                classname="space-y-2"
                inputType="textarea"
              />

              <Button type="submit" disabled={status === "submitting"} className="w-full bg-emerald-800 text-white hover:bg-emerald-900">
                {status === "submitting" ? "Sending..." : status === "sent" ? "Message sent" : "Send message"}
              </Button>
            </form>

            <div className="my-7 h-px bg-border" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-semibold tracking-widest text-muted-foreground">OR REACH US DIRECTLY ON</p>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map(({ name, href, Icon, style }) => (
                  <a key={name} href={href} aria-label={name} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-md text-white shadow-sm transition hover:scale-105" style={style}>
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
                <span className="text-xs font-semibold tracking-widest text-emerald-700 dark:text-emerald-400">FIND US</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Yaba, Lagos &middot; Nigeria</h2>
            </div>

            <a href={MAP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-400">Open in map
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="relative h-[320px] w-full overflow-hidden rounded-3xl border border-border shadow-sm sm:h-[400px] lg:h-[480px]">
            <MapContainer center={EVENTRA_HQ} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={EVENTRA_HQ}>
                <Popup>
                  <strong>Eventra HQ</strong>
                  <br />Yaba, Lagos, Nigeria
                </Popup>
              </Marker>
            </MapContainer>

            <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] max-w-[13rem] rounded-2xl bg-card/95 p-3.5 shadow-lg backdrop-blur sm:bottom-6 sm:left-6 sm:max-w-xs sm:p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"><MapPin className="h-4 w-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Eventra HQ</p>
                  <p className="text-xs text-muted-foreground">Yaba, Lagos &middot; Nigeria</p>
                  <p className="mt-1 text-xs text-muted-foreground">Weekdays &middot; 9AM &ndash; 6PM</p>
                  <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">&middot; Open now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
     </PageWrapper>
      
    </div>
  );
}

function ContactRow({ icon, label, value, href, }: { icon: ReactNode; label: string; value: string; href: string; }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="flex items-center justify-between rounded-xl border border-border bg-muted/60 px-4 py-3 transition hover:border-emerald-200 dark:hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-emerald-700 dark:text-emerald-400 shadow-sm">{icon}</span>
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
      </div>
      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
    </a>
  );
}