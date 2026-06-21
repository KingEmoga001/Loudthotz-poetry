import { useEffect, useState } from "react";
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, limit, setDoc, increment,
  serverTimestamp, arrayUnion, type Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInAnonymously } from "firebase/auth";
import { db, storage, auth } from "./firebase";

/* ───────────────────────────── Types ───────────────────────────── */
export interface FirePoem {
  id: string;
  title: string;
  author: string;
  country: string;
  content: string;
  publishedAt: string;
  averageRating: number;
  ratingCount: number;
  ratingSum: number;
  isFeatured: boolean;
  isPoemOfMonth?: boolean;
  season?: string;
  theme?: string;
  poetId?: string;
}

export interface FireSubmission {
  id: string;
  title: string;
  author: string;
  country: string;
  content: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  adminNote?: string;
}

export interface FireLppSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  poemTitle: string;
  bio: string;
  month: string;
  fileName: string;
  fileUrl: string;
  submittedAt: string;
}

export interface FireBook {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  amazonUrl: string;
  imageUrl?: string;
  accentColor: string;
  coverTagline?: string;
}

export interface FireLivestreamStatus {
  isLive: boolean;
  viewerCount: number;
  title: string;
  description: string;
  season: string;
  episode: number;
  streamUrl?: string;
  embedUrl?: string;
  scheduledAt?: string;
}

export interface FireLivestreamSession {
  id: string;
  title: string;
  description: string;
  date: string;
  season: string;
  episode: number;
  recordingUrl?: string;
  blogUrl?: string;
  theme: string;
  imageUrl?: string;
}

export interface FirePoet {
  id: string;
  name: string;
  bio?: string;
  country?: string;
  imageUrl?: string;
  social?: string;
}

export interface FireSiteSettings {
  // Home page
  heroHeadline: string;
  heroSubtext: string;
  upcomingEventTitle: string;
  upcomingEventDate: string;
  aboutText: string;
  donationMessage: string;
  totalCommunityVoices: number;

  // Site-wide display stats
  statsPoems: string;
  statsPoets: string;
  statsSessions: string;
  statsCountries: string;

  // Membership page
  membershipFreeLink: string;
  membershipFreeDescription: string;
  membershipFreeBenefits: string;
  membershipBasicPrice: string;
  membershipBasicLink: string;
  membershipBasicDescription: string;
  membershipBasicBenefits: string;
  membershipFullPrice: string;
  membershipFullLink: string;
  membershipFullDescription: string;
  membershipFullBenefits: string;
  membershipGoldenPrice: string;
  membershipGoldenLink: string;
  membershipGoldenDescription: string;
  membershipGoldenBenefits: string;

  // Prize page
  prizeCashAmount: string;
  prizeEntryFee: string;
  prizePaystackLink: string;
  prizeEmail: string;
  prizeRules: string;
  prizeDeadline: string; // ISO datetime string for the countdown

  // Archive suppression — keys of static sessions hidden by admin delete
  excludedArchiveKeys: string[];

  // Homepage hero & cards
  homeHeadline: string;
  homeSubtext: string;
  potmReadingTitle: string;
  potmReadingSubtext: string;
  potmReadingCtaLabel: string;

  // Donate page
  donationHeadline: string;
  donationPaystackLink: string;

  // Featured video
  featuredVideoUrl: string;

  // Footer socials & contact
  socialX: string;
  socialYoutube: string;
  socialFacebook: string;
  socialSpotify: string;
  socialInstagram: string;
  socialTiktok: string;
  contactWhatsapp: string;

  // Poets page
  poetPageDescription: string;
  poetPageBlogUrl: string;

  // About page
  aboutPageHeadline: string;
  aboutPageSubtext: string;

  // Privacy policy
  privacyPolicyText: string;
  privacyPolicyUpdatedAt: string;
}

/* ───────────────────────── Helpers ───────────────────────── */
function tsToIso(ts: Timestamp | string | undefined): string {
  if (!ts) return new Date().toISOString();
  if (typeof ts === "string") return ts;
  return ts.toDate().toISOString();
}

/* ───────────────────────── Poems ───────────────────────── */
export function usePoems(search?: string, sort?: string): { data: FirePoem[]; loading: boolean } {
  const [data, setData] = useState<FirePoem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "poems");
    const unsub = onSnapshot(ref, (snap) => {
      let poems: FirePoem[] = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          title: raw.title ?? "",
          author: raw.author ?? "",
          country: raw.country ?? "",
          content: raw.content ?? "",
          publishedAt: tsToIso(raw.publishedAt),
          averageRating: raw.averageRating ?? 0,
          ratingCount: raw.ratingCount ?? 0,
          ratingSum: raw.ratingSum ?? 0,
          isFeatured: raw.isFeatured ?? false,
          isPoemOfMonth: raw.isPoemOfMonth ?? false,
          season: raw.season,
          theme: raw.theme,
        };
      });

      if (search) {
        const s = search.toLowerCase();
        poems = poems.filter((p) => p.title.toLowerCase().includes(s) || p.author.toLowerCase().includes(s));
      }

      if (sort === "popular") poems.sort((a, b) => b.averageRating - a.averageRating);
      else if (sort === "alphabetical") poems.sort((a, b) => a.author.localeCompare(b.author));
      else poems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      setData(poems);
      setLoading(false);
    });
    return unsub;
  }, [search, sort]);

  return { data, loading };
}

export function useFeaturedPoems(): { data: FirePoem[]; loading: boolean } {
  const [data, setData] = useState<FirePoem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "poems");
    const unsub = onSnapshot(ref, (snap) => {
      const all: FirePoem[] = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id, title: raw.title ?? "", author: raw.author ?? "",
          country: raw.country ?? "", content: raw.content ?? "",
          publishedAt: tsToIso(raw.publishedAt),
          averageRating: raw.averageRating ?? 0, ratingCount: raw.ratingCount ?? 0,
          ratingSum: raw.ratingSum ?? 0, isFeatured: raw.isFeatured ?? false,
          season: raw.season, theme: raw.theme,
        };
      });
      const featured = all
        .filter((p) => p.isFeatured)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 6);
      setData(featured.length ? featured : all.sort((a, b) => b.averageRating - a.averageRating).slice(0, 6));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export function usePoem(id: string): { data: FirePoem | null; loading: boolean } {
  const [data, setData] = useState<FirePoem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const ref = doc(db, "poems", id);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const raw = snap.data();
        setData({
          id: snap.id, title: raw.title ?? "", author: raw.author ?? "",
          country: raw.country ?? "", content: raw.content ?? "",
          publishedAt: tsToIso(raw.publishedAt),
          averageRating: raw.averageRating ?? 0, ratingCount: raw.ratingCount ?? 0,
          ratingSum: raw.ratingSum ?? 0, isFeatured: raw.isFeatured ?? false,
          season: raw.season, theme: raw.theme,
        });
      } else { setData(null); }
      setLoading(false);
    });
    return unsub;
  }, [id]);

  return { data, loading };
}

export async function ratePoem(id: string, stars: number) {
  const ref = doc(db, "poems", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Poem not found");
  const data = snap.data();
  const newSum = (data.ratingSum ?? 0) + stars;
  const newCount = (data.ratingCount ?? 0) + 1;
  await updateDoc(ref, {
    ratingSum: newSum, ratingCount: newCount,
    averageRating: parseFloat((newSum / newCount).toFixed(2)),
  });
}

export async function updatePoem(id: string, data: Partial<Omit<FirePoem, "id">>) {
  await updateDoc(doc(db, "poems", id), data as Record<string, unknown>);
}

export async function deletePoem(id: string) {
  await deleteDoc(doc(db, "poems", id));
}

/* ───────────────────────── Submissions ───────────────────────── */
export function useSubmissions(): { data: FireSubmission[]; loading: boolean } {
  const [data, setData] = useState<FireSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "submissions");
    const unsub = onSnapshot(ref, (snap) => {
      const subs: FireSubmission[] = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id, title: raw.title ?? "", author: raw.author ?? "",
          country: raw.country ?? "", content: raw.content ?? "",
          submittedAt: tsToIso(raw.submittedAt), status: raw.status ?? "pending",
          adminNote: raw.adminNote,
        };
      });
      subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setData(subs);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export function usePendingCount(): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const ref = collection(db, "submissions");
    const unsub = onSnapshot(ref, (snap) => {
      setCount(snap.docs.filter((d) => d.data().status === "pending").length);
    });
    return unsub;
  }, []);
  return count;
}

/* ─────────────────── Poem of the Month ─────────────────── */
export function usePoemOfMonth(): { data: FirePoem | null; loading: boolean } {
  const [data, setData] = useState<FirePoem | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simple where-only query to avoid requiring a composite Firestore index
    const q = query(collection(db, "poems"), where("isPoemOfMonth", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        // Sort client-side by publishedAt descending and take first
        const sorted = snap.docs.sort((a, b) => {
          const aAt = a.data().publishedAt?.seconds ?? 0;
          const bAt = b.data().publishedAt?.seconds ?? 0;
          return bAt - aAt;
        });
        const d = sorted[0];
        const raw = d.data();
        setData({
          id: d.id, title: raw.title ?? "", author: raw.author ?? "",
          country: raw.country ?? "", content: raw.content ?? "",
          publishedAt: tsToIso(raw.publishedAt), averageRating: raw.averageRating ?? 0,
          ratingCount: raw.ratingCount ?? 0, ratingSum: raw.ratingSum ?? 0,
          isFeatured: raw.isFeatured ?? false, isPoemOfMonth: true,
          season: raw.season, theme: raw.theme, poetId: raw.poetId,
        });
      } else { setData(null); }
      setLoading(false);
    });
    return unsub;
  }, []);
  return { data, loading };
}

/* ─────────────────── LPP Prize Submissions ─────────────────── */
export function useLppSubmissions(): { data: FireLppSubmission[]; loading: boolean } {
  const [data, setData] = useState<FireLppSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lpp_submissions"), (snap) => {
      const subs: FireLppSubmission[] = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          name: raw.name ?? "",
          email: raw.email ?? "",
          phone: raw.phone ?? "",
          poemTitle: raw.poemTitle ?? "",
          bio: raw.bio ?? "",
          month: raw.month ?? "",
          fileName: raw.fileName ?? "",
          fileUrl: raw.fileUrl ?? "",
          submittedAt: tsToIso(raw.submittedAt),
        };
      });
      subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setData(subs);
      setLoading(false);
    });
    return unsub;
  }, []);
  return { data, loading };
}

/* ── Feedback ── */
export interface FireFeedback {
  id: string;
  name: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export function useFeedback(): { data: FireFeedback[]; loading: boolean } {
  const [data, setData] = useState<FireFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const q = query(collection(db, "feedback"), orderBy("submittedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setData(snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          name: raw.name ?? "",
          message: raw.message ?? "",
          submittedAt: tsToIso(raw.submittedAt),
          read: raw.read ?? false,
        };
      }));
      setLoading(false);
    });
    return unsub;
  }, []);
  return { data, loading };
}

export async function addFeedback(name: string, message: string): Promise<void> {
  await addDoc(collection(db, "feedback"), {
    name,
    message,
    read: false,
    submittedAt: serverTimestamp(),
  });
}

export async function markFeedbackRead(id: string, read: boolean): Promise<void> {
  await setDoc(doc(db, "feedback", id), { read }, { merge: true });
}

export async function deleteFeedback(id: string): Promise<void> {
  await deleteDoc(doc(db, "feedback", id));
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
    ),
  ]);
}

export async function addLppSubmission(
  data: { name: string; email: string; phone: string; poemTitle: string; bio: string; month: string },
  file: File
): Promise<void> {
  if (!auth.currentUser) {
    await withTimeout(
      signInAnonymously(auth),
      15000,
      "Anonymous sign-in"
    );
  }

  const storageRef = ref(storage, `lpp_submissions/${Date.now()}_${file.name}`);
  await withTimeout(uploadBytes(storageRef, file), 30000, "File upload");
  const fileUrl = await withTimeout(getDownloadURL(storageRef), 10000, "Get download URL");

  await addDoc(collection(db, "lpp_submissions"), {
    ...data,
    fileName: file.name,
    fileUrl,
    submittedAt: serverTimestamp(),
  });
}

export function usePoetPoems(poetName: string): { data: FirePoem[]; loading: boolean } {
  const [data, setData] = useState<FirePoem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!poetName) { setLoading(false); return; }
    const q = query(collection(db, "poems"), where("author", "==", poetName));
    const unsub = onSnapshot(q, (snap) => {
      const poems: FirePoem[] = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          title: raw.title ?? "",
          author: raw.author ?? "",
          country: raw.country ?? "",
          content: raw.content ?? "",
          publishedAt: tsToIso(raw.publishedAt),
          averageRating: raw.averageRating ?? 0,
          ratingCount: raw.ratingCount ?? 0,
          ratingSum: raw.ratingSum ?? 0,
          isFeatured: raw.isFeatured ?? false,
          season: raw.season,
          theme: raw.theme,
          poetId: raw.poetId,
        };
      });
      poems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      setData(poems);
      setLoading(false);
    });
    return unsub;
  }, [poetName]);

  return { data, loading };
}

export async function createPoetPoem(
  poetId: string,
  poetName: string,
  data: { title: string; content: string; country?: string; season?: string; theme?: string },
) {
  await addDoc(collection(db, "poems"), {
    title: data.title,
    content: data.content,
    author: poetName,
    poetId,
    country: data.country ?? "",
    season: data.season ?? "",
    theme: data.theme ?? "",
    publishedAt: serverTimestamp(),
    averageRating: 0,
    ratingCount: 0,
    ratingSum: 0,
    isFeatured: false,
  });
}

export async function submitPoem(data: { title: string; author: string; country: string; content: string }) {
  await addDoc(collection(db, "submissions"), { ...data, submittedAt: serverTimestamp(), status: "pending" });
}

export async function approveSubmission(sub: FireSubmission) {
  await updateDoc(doc(db, "submissions", sub.id), { status: "approved" });
  await addDoc(collection(db, "poems"), {
    title: sub.title, author: sub.author, country: sub.country, content: sub.content,
    publishedAt: serverTimestamp(), averageRating: 0, ratingCount: 0, ratingSum: 0, isFeatured: false,
  });
}

export async function rejectSubmission(id: string, note?: string) {
  await updateDoc(doc(db, "submissions", id), { status: "rejected", adminNote: note ?? "" });
}

/* ───────────────────────── Books ───────────────────────── */
export function useBooks(): { data: FireBook[]; loading: boolean } {
  const [data, setData] = useState<FireBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "books");
    const unsub = onSnapshot(ref, (snap) => {
      setData(snap.docs.map((d) => ({ id: d.id, ...d.data() } as FireBook)));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export async function createBook(data: Omit<FireBook, "id">) {
  await addDoc(collection(db, "books"), data);
}

export async function updateBook(id: string, data: Partial<Omit<FireBook, "id">>) {
  await updateDoc(doc(db, "books", id), data as Record<string, unknown>);
}

export async function deleteBook(id: string) {
  await deleteDoc(doc(db, "books", id));
}

/* ─────────────────── Livestream ─────────────────── */
const LIVE_DOC = "livestream_status/current";

export function useLivestreamStatus(): { data: FireLivestreamStatus | null; loading: boolean } {
  const [data, setData] = useState<FireLivestreamStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "livestream_status", "current");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const raw = snap.data();
        setData({
          isLive: raw.isLive ?? false, viewerCount: raw.viewerCount ?? 0,
          title: raw.title ?? "Loudthotz Virtual Open Readings",
          description: raw.description ?? "Monthly poetry open readings",
          season: raw.season ?? "Season 14", episode: raw.episode ?? 1,
          streamUrl: raw.streamUrl, embedUrl: raw.embedUrl,
          scheduledAt: raw.scheduledAt ? tsToIso(raw.scheduledAt) : undefined,
        });
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export async function updateLivestreamStatus(data: Partial<FireLivestreamStatus>) {
  await setDoc(doc(db, "livestream_status", "current"), data, { merge: true });
}

export function useLivestreamSessions(): { data: FireLivestreamSession[]; loading: boolean } {
  const [data, setData] = useState<FireLivestreamSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "livestream_sessions");
    const unsub = onSnapshot(ref, (snap) => {
      const sessions: FireLivestreamSession[] = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id, title: raw.title ?? "", description: raw.description ?? "",
          date: tsToIso(raw.date), season: raw.season ?? "", episode: raw.episode ?? 1,
          recordingUrl: raw.recordingUrl, blogUrl: raw.blogUrl, theme: raw.theme ?? "",
          imageUrl: raw.imageUrl,
        };
      });
      sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setData(sessions);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export async function addLivestreamSession(data: Omit<FireLivestreamSession, "id">) {
  await addDoc(collection(db, "livestream_sessions"), { ...data, date: new Date(data.date) });
}

export async function updateLivestreamSession(id: string, data: Partial<Omit<FireLivestreamSession, "id">>) {
  const upd: Record<string, unknown> = { ...data };
  if (data.date) upd.date = new Date(data.date);
  await updateDoc(doc(db, "livestream_sessions", id), upd);
}

export async function deleteLivestreamSession(id: string) {
  await deleteDoc(doc(db, "livestream_sessions", id));
}

/* ─────────────────── Site Settings ─────────────────── */
export function useSiteSettings(): { data: FireSiteSettings | null; loading: boolean } {
  const [data, setData] = useState<FireSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "settings", "main");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setData(snap.data() as FireSiteSettings);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export async function updateSiteSettings(data: Partial<FireSiteSettings>) {
  await setDoc(doc(db, "settings", "main"), data, { merge: true });
}

export function archiveKey(date: string, title: string): string {
  return `${date.slice(0, 10)}-${title.toLowerCase().trim()}`;
}

export async function suppressArchiveEntry(date: string, title: string): Promise<void> {
  await updateDoc(doc(db, "settings", "main"), {
    excludedArchiveKeys: arrayUnion(archiveKey(date, title)),
  });
}

/* ─────────────────── Stats ─────────────────── */
export function useSiteStats() {
  const { data: poems } = usePoems();
  const { data: sessions } = useLivestreamSessions();
  const { data: settings } = useSiteSettings();

  const totalPoems = poems.length;
  const totalPoets = new Set(poems.map((p) => p.author)).size;
  const totalCountries = new Set(poems.map((p) => p.country)).size;
  const totalSessions = sessions.length;

  return {
    totalPoems, totalPoets, totalCountries, totalSessions,
    displayPoems: settings?.statsPoems || "3000+",
    displayPoets: settings?.statsPoets || "85+",
    displaySessions: settings?.statsSessions || "204",
    displayCountries: settings?.statsCountries || "5+",
    upcomingEventTitle: settings?.upcomingEventTitle ?? "Brothers — Spotlights on Kinship",
    upcomingEventDate: settings?.upcomingEventDate ?? null,
    totalCommunityVoices: settings?.totalCommunityVoices ?? totalPoets,
  };
}

/* ─────────────────── Hero Images ─────────────────── */
export interface FireHeroImage {
  id: string;
  url: string;
  caption: string;
  credit?: string;
  order: number;
  active: boolean;
}

export function useHeroImages(): { data: FireHeroImage[]; loading: boolean } {
  const [data, setData] = useState<FireHeroImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "hero_images");
    const unsub = onSnapshot(ref, (snap) => {
      const imgs: FireHeroImage[] = snap.docs.map((d) => ({
        id: d.id,
        url: d.data().url ?? "",
        caption: d.data().caption ?? "",
        credit: d.data().credit,
        order: d.data().order ?? 0,
        active: d.data().active ?? true,
      }));
      imgs.sort((a, b) => a.order - b.order);
      setData(imgs.filter((i) => i.active));
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export function useAllHeroImages(): { data: FireHeroImage[]; loading: boolean } {
  const [data, setData] = useState<FireHeroImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "hero_images");
    const unsub = onSnapshot(ref, (snap) => {
      const imgs: FireHeroImage[] = snap.docs.map((d) => ({
        id: d.id,
        url: d.data().url ?? "",
        caption: d.data().caption ?? "",
        credit: d.data().credit,
        order: d.data().order ?? 0,
        active: d.data().active ?? true,
      }));
      imgs.sort((a, b) => a.order - b.order);
      setData(imgs);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

/* ─────────────────── Poets ─────────────────── */
export function usePoets(): { data: FirePoet[]; loading: boolean } {
  const [data, setData] = useState<FirePoet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "poets");
    const unsub = onSnapshot(ref, (snap) => {
      const poets: FirePoet[] = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          name: raw.name ?? "",
          bio: raw.bio ?? "",
          country: raw.country ?? "",
          imageUrl: raw.imageUrl ?? "",
          social: raw.social ?? "",
        };
      });
      poets.sort((a, b) => a.name.localeCompare(b.name));
      setData(poets);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export async function createPoet(data: Omit<FirePoet, "id">) {
  await addDoc(collection(db, "poets"), data);
}

export async function updatePoet(id: string, data: Partial<Omit<FirePoet, "id">>) {
  await updateDoc(doc(db, "poets", id), data as Record<string, unknown>);
}

export async function deletePoet(id: string) {
  await deleteDoc(doc(db, "poets", id));
}

export async function seedStaticPoets(): Promise<number> {
  const staticNames = [
    "Akeem Adetayo Oyalowo", "Lolade Ajayi Oye", 'Chukwuemeka "Deus" Njoku',
    "Ifeanyi Emmanuel", "Tolu Daniel", "Henry Ahmami", "Wale O. Stevens",
    "Jovita Ekene", "Elijah Ekiyan", "Ubong Abasi", "Florence Salawu",
    'Kemi "Kemibon" Ahmed', "Joy Nwamaka Chime", "Chris N. John",
    "Ifeanyi Okwosha", "Olamide J. Santos", "Andrew White", "Erhio Obodo",
    "Soonest Nathaniel", 'Ugochukwu "Hitch" Emebiriodo', "Ifeanyi Mbah",
    'Philip "Dokita Feel" Chukwu', "Stephen Tolulope Alayande", "Ilupeju Adebayo",
    "Marilyn Maduka", "Nneoma Onyeukwu", "Ijeoma Opoko", "Oyinda Fakile",
    "Ajibola Adeoya", "Immanuel Unekwuojo Ogu", "Michael Achile Umameh",
    "Teddy Ugonna Richard", 'Priscilla "zaraahaiwe" Ahaiwe', "Fabian Mac-robe Ugbechie",
    "Amar Basil",
  ];
  const snap = await getDocs(collection(db, "poets"));
  const existing = new Set(snap.docs.map((d) => d.data().name as string));
  const toAdd = staticNames.filter((n) => !existing.has(n));
  await Promise.all(toAdd.map((name) => addDoc(collection(db, "poets"), { name })));
  return toAdd.length;
}

/* ─────────────────── Events ─────────────────── */
export interface FireEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  season?: string;
  episode?: number;
  theme?: string;
  venue?: string;
  youtubeUrl?: string;
  blogUrl?: string;
  imageUrl?: string;
}

export function useEvents(): { data: FireEvent[]; loading: boolean } {
  const [data, setData] = useState<FireEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "events");
    const unsub = onSnapshot(ref, (snap) => {
      const events: FireEvent[] = snap.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          title: raw.title ?? "",
          description: raw.description,
          date: tsToIso(raw.date),
          season: raw.season,
          episode: raw.episode,
          theme: raw.theme,
          venue: raw.venue,
          youtubeUrl: raw.youtubeUrl,
          blogUrl: raw.blogUrl,
          imageUrl: raw.imageUrl,
        };
      });
      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setData(events);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

export async function createEvent(data: Omit<FireEvent, "id">) {
  await addDoc(collection(db, "events"), { ...data, date: new Date(data.date) });
}

export async function updateEvent(id: string, data: Partial<Omit<FireEvent, "id">>) {
  const upd: Record<string, unknown> = { ...data };
  if (data.date) upd.date = new Date(data.date);
  await updateDoc(doc(db, "events", id), upd);
}

export async function deleteEvent(id: string) {
  await deleteDoc(doc(db, "events", id));
}

export async function addHeroImage(data: Omit<FireHeroImage, "id">) {
  await addDoc(collection(db, "hero_images"), data);
}

export async function updateHeroImage(id: string, data: Partial<Omit<FireHeroImage, "id">>) {
  await updateDoc(doc(db, "hero_images", id), data as Record<string, unknown>);
}

export async function deleteHeroImage(id: string) {
  await deleteDoc(doc(db, "hero_images", id));
}

export async function uploadHeroImage(file: File): Promise<string> {
  const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageRef = ref(storage, `hero_images/${Date.now()}_${safeFilename}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return await getDownloadURL(storageRef);
}

/* ─────────────────── Import Historical Sessions ─────────────────── */
const HISTORICAL_SESSIONS = [
  { date: "2023-09-19", title: "Poems Read at Our Last Poetry Reading — September 14, 2023", season: "Season 14", theme: "" },
  { date: "2023-08-09", title: "Season 14 Episode 08 — Strings", season: "Season 14", theme: "Strings" },
  { date: "2023-03-03", title: "Season 14 Episode 03 — Slits", season: "Season 14", theme: "Slits" },
  { date: "2023-02-05", title: "Season 14 Episode 02 — Bent", season: "Season 14", theme: "Bent" },
  { date: "2023-01-11", title: "Season 14 Episode 01 — Season Premier", season: "Season 14", theme: "" },
  { date: "2022-12-04", title: "Season 13 Episode 12 — Cease", season: "Season 13", theme: "Cease" },
  { date: "2022-10-08", title: "October 2022 Open Reading", season: "Season 13", theme: "" },
  { date: "2022-08-06", title: "Season 13 Episode 08 — Seven", season: "Season 13", theme: "Seven" },
  { date: "2022-07-02", title: "Season 13 Episode 07 — Good Times", season: "Season 13", theme: "Good Times" },
  { date: "2022-06-14", title: "Season 12 Episode 06 — Changes (Poems Read)", season: "Season 12", theme: "Changes" },
  { date: "2022-06-02", title: "Next Reading — June 9, 2022", season: "Season 13", theme: "" },
  { date: "2022-05-15", title: "Season 13 Episode 05 — Self (Poems Read)", season: "Season 13", theme: "Self" },
  { date: "2022-05-10", title: "Season 13 Episode 04 — Greed (Poems Read)", season: "Season 13", theme: "Greed" },
  { date: "2022-01-27", title: "Season 13 Episode 01 — Alpha (Poems Read)", season: "Season 13", theme: "Alpha" },
  { date: "2022-01-11", title: "Season 13 Episode 01 — Alpha (Season Premier)", season: "Season 13", theme: "Alpha" },
  { date: "2021-12-11", title: "Season 12 Episode 12 — Distance (Poems Read)", season: "Season 12", theme: "Distance" },
  { date: "2021-12-08", title: "Season 12 Episode 12 — Distance (Season Finale)", season: "Season 12", theme: "Distance" },
  { date: "2021-11-16", title: "Season 12 — Reason (Poems Read)", season: "Season 12", theme: "Reason" },
  { date: "2021-11-16", title: "Season 12 Episode 06 — Elegant (October 2021, Poems Read)", season: "Season 12", theme: "Elegant" },
  { date: "2021-09-16", title: "Season 12 Episode 10 — Elegant", season: "Season 12", theme: "Elegant" },
  { date: "2021-09-11", title: "Season 12 Episode 09 — Tree (Poems Read)", season: "Season 12", theme: "Tree" },
  { date: "2021-09-06", title: "Season 12 Episode 09 — Tree", season: "Season 12", theme: "Tree" },
  { date: "2021-08-15", title: "Season 12 Episode 08 — Jungle (Poems Read)", season: "Season 12", theme: "Jungle" },
  { date: "2021-07-21", title: "Season 12 Episode 08 — Jungle (August 12)", season: "Season 12", theme: "Jungle" },
  { date: "2021-07-21", title: "Season 12 Episode 07 — Sent (Poems Read)", season: "Season 12", theme: "Sent" },
  { date: "2021-06-16", title: "Season 12 Episode 06 — These Times (Poems Read)", season: "Season 12", theme: "These Times" },
  { date: "2021-05-21", title: "Season 12 Episode 05 — Drain (Poems Read)", season: "Season 12", theme: "Drain" },
  { date: "2021-04-11", title: "Season 12 Episode 04 — Gain (Poems Read)", season: "Season 12", theme: "Gain" },
  { date: "2021-03-19", title: "Season 12 Episode 03 — Storm (Poems Read)", season: "Season 12", theme: "Storm" },
  { date: "2021-02-18", title: "Season 12 Episode 02 — Awake (Poems Read)", season: "Season 12", theme: "Awake" },
];

export async function importStaticSessions(): Promise<number> {
  const snap = await getDocs(collection(db, "livestream_sessions"));
  const existingKeys = new Set(
    snap.docs.map((d) => {
      const raw = d.data();
      const dateStr = raw.date?.toDate?.()?.toISOString?.()?.slice(0, 10) ?? "";
      return `${dateStr}|${(raw.title ?? "").toLowerCase().trim()}`;
    })
  );
  const toAdd = HISTORICAL_SESSIONS.filter((s) => {
    const key = `${s.date}|${s.title.toLowerCase().trim()}`;
    return !existingKeys.has(key);
  });
  await Promise.all(
    toAdd.map((s) =>
      addDoc(collection(db, "livestream_sessions"), {
        title: s.title, season: s.season, theme: s.theme,
        description: "", episode: 0, recordingUrl: "", blogUrl: "",
        date: new Date(s.date),
      })
    )
  );
  return toAdd.length;
}

/* ─────────────────── Seed Data ─────────────────── */
export async function seedDatabase() {
  const poems = [
    { title: "BETRAYED", author: "Cl_Mayende", country: "Uganda", isFeatured: true, season: "Season 14", theme: "Kinship & Brotherhood", averageRating: 4.7, ratingCount: 23, ratingSum: 108, content: `They said they had my back\nwhen the storms came rolling in —\nbut I looked behind me\nand found only rain.\n\nI trusted you with the soft parts,\nthe parts that bruise at a whisper.\nYou folded them into paper cranes\nand sent them into the wind.\n\nNow I collect the pieces\nlike a man gathering feathers —\ntoo light to hold,\ntoo many to count.\n\nBetrayal does not always arrive\nwearing your enemy's face.\nSometimes it walks through the door\nwearing your name on its lips.`, publishedAt: new Date(Date.now() - 5 * 86400000) },
    { title: "MOTHER TONGUE", author: "Adaeze Obi", country: "Nigeria", isFeatured: true, season: "Season 14", theme: "Identity & Heritage", averageRating: 4.9, ratingCount: 41, ratingSum: 201, content: `My mother never taught me\nthe language of goodbye —\nonly the one where every farewell\nfolds itself into a prayer.\n\nIgbo lives in the curve of her hand,\nin the way she hums while pounding yam,\nin the silence that follows\nwhen she calls my full name.\n\nI went to school and came back\nwith borrowed words,\nclean and precise as a surgeon's knife —\nbut they cut the wrong things.\n\nGive me back the muddy grammar\nof her voice at dawn,\nthe conjugations of her worry,\nthe syntax of her love.`, publishedAt: new Date(Date.now() - 12 * 86400000) },
    { title: "BROTHERS", author: "Kwame Asante", country: "Ghana", isFeatured: true, season: "Season 14", theme: "Kinship & Brotherhood", averageRating: 4.8, ratingCount: 35, ratingSum: 168, content: `We grew from the same soil\nbut you grew taller —\nand somewhere in that difference\nwe lost the language of ease.\n\nBrothers are the first mirrors\nand the first stones.\nYou can see yourself in them\nand still draw blood.\n\nI remember the fights,\nthe laughter louder than war,\nthe way we could sit in silence\nand fill the room.\n\nNow there are oceans between us —\nnot water, just choices,\neach one small and permanent\nas a scar.`, publishedAt: new Date(Date.now() - 45 * 86400000) },
    { title: "THE GONG SPEAKS", author: "Emeka Eze", country: "Nigeria", isFeatured: true, season: "Season 13", theme: "The Craft of Poetry", averageRating: 4.5, ratingCount: 18, ratingSum: 81, content: `Before the microphone,\nbefore the notebook and the pen,\nthere was the gong —\n\nstruck once for silence,\ntwice for gathering,\nthree times for the dead.\n\nWe poets are gong-bearers,\nsummoners of attention,\nkeepers of the communal ear.\n\nEvery verse is a strike —\nsend it ringing\nacross the compound,\nacross the border,\nacross the forgetting.`, publishedAt: new Date(Date.now() - 20 * 86400000) },
    { title: "LAGOS AT 3AM", author: "Tunde Babatunde", country: "Nigeria", isFeatured: false, season: "Season 13", theme: "Urban Life", averageRating: 4.2, ratingCount: 15, ratingSum: 63, content: `The city doesn't sleep —\nit just changes shifts.\n\nThe generators hum a different song\nwhen the bankers have gone home,\nwhen the children have stopped crying\nand the hawkers have counted\ntheir last naira.\n\nAt 3am, Lagos belongs\nto the watchmen, the lovers,\nthe insomniacs and the ghosts\nof everyone who left.`, publishedAt: new Date(Date.now() - 30 * 86400000) },
    { title: "SOIL", author: "Nkechi Okafor", country: "Nigeria", isFeatured: false, season: "Season 12", theme: "Nature & Memory", averageRating: 4.3, ratingCount: 12, ratingSum: 52, content: `My grandmother pressed seeds\ninto the earth with bare fingers —\nno gloves, no ceremony,\njust trust.\n\nShe knew what the land could hold,\nwhat it would give back doubled,\nwhat it needed to rest.\n\nWe have forgotten how to listen\nto what lies beneath our feet.\nWe build towers instead of roots.\nWe reach up instead of down.`, publishedAt: new Date(Date.now() - 60 * 86400000) },
  ];

  const books = [
    { title: "FIRST GONG", subtitle: "Anthology Vol. I", description: "The debut collective voice of the Loudthotz community — a showcase print containing poetry submitted by foundation members.", price: "", amazonUrl: "https://www.amazon.com/FIRST-GONG-VOL-3-NIGERIAN-STANDING/dp/1300751797/ref=sr_1_2?crid=2JBU0QIQB6963&dib=eyJ2IjoiMSJ9.S2WYsTYY5irJpKyttk8ZwYOFNDYSeqiNVBm4HDn8SKFwvDZS5q3f8WsYBanlT3IZzc6kXGr2t_RAQ6x6Bkf_yyI_C_jj7MjE3C1xZp1d1NY.kKdHOfm4T9zKKj0B1jh42sR-AYGlvptPffmY56NrW3g&dib_tag=se&keywords=Chisom+Ohuaka&qid=1781643803&sprefix=chisom+ohuaka+%2Caps%2C438&sr=8-2", accentColor: "lime", coverTagline: "The debut collective voice of Loudthotz Independent Poets" },
  ];

  const sessions = [
    { title: "Brothers — Spotlights on Kinship", description: "An evening of poetry exploring brotherhood, loyalty, and complex bonds between men across Africa.", date: new Date(Date.now() - 7 * 86400000), season: "Season 14", episode: 9, theme: "Kinship & Brotherhood" },
    { title: "Roots & Routes — On Diaspora", description: "Poets from the African diaspora share verses about belonging, migration, and the places we carry inside us.", date: new Date(Date.now() - 35 * 86400000), season: "Season 14", episode: 8, recordingUrl: "https://www.youtube.com/watch?v=example", theme: "Diaspora & Identity" },
    { title: "Women Who Thunder", description: "A special edition spotlighting the voices of African women poets — rage, joy, and everything between.", date: new Date(Date.now() - 65 * 86400000), season: "Season 14", episode: 7, recordingUrl: "https://www.youtube.com/watch?v=example", theme: "Womanhood & Power" },
    { title: "The City Speaks", description: "Urban poetry from Lagos, Nairobi, Accra, and Johannesburg — concrete, neon, and heartbeats.", date: new Date(Date.now() - 95 * 86400000), season: "Season 13", episode: 12, recordingUrl: "https://www.youtube.com/watch?v=example", theme: "Urban Africa" },
  ];

  const submissions = [
    { title: "THE WEIGHT OF SILENCE", author: "Amara Diallo", country: "Senegal", status: "pending", content: `Silence is not the absence of sound —\nit is the presence of everything\nwe were too afraid to say.\n\nI have carried silences\nheavier than grief,\nquieter than regret.`, submittedAt: new Date(Date.now() - 2 * 86400000) },
    { title: "HARMATTAN", author: "Yemi Fadeyi", country: "Nigeria", status: "pending", content: `The harmattan comes like an old relative —\nunannounced and certain of its welcome,\ncarrying dust from the Sahara\nlike letters from a forgotten home.\n\nIt cracks the lips of the city,\nsplits the bark of trees,\nreminds us that the world\nis mostly dry.`, submittedAt: new Date(Date.now() - 1 * 86400000) },
    { title: "DIGITAL GRIOT", author: "Kelechi Nmachi", country: "Nigeria", status: "pending", content: `My grandfather told stories by firelight.\nI tell mine by screen glow —\nsame hunger, different medium.\n\nThe griot lives in the algorithm now,\nnavigating feeds and timelines\ninstead of village squares.`, submittedAt: new Date(Date.now() - 3 * 3600000) },
  ];

  const liveStatus = {
    isLive: false, viewerCount: 0,
    title: "Brothers — Next Edition Live Reading",
    description: "Join us for another evening of poetry exploring kinship, loyalty, and brotherhood across Africa",
    season: "Season 14", episode: 10, streamUrl: null, embedUrl: null,
    scheduledAt: new Date(Date.now() + 14 * 86400000),
  };

  const siteSettings = {
    heroHeadline: "Where Words Ignite Loud Thoughts",
    heroSubtext: "Formerly managed under the Independent Poets Concerns, Loudthotz Poetry is now proudly hosted as an official event and literary vehicle under the Naija Art Initiative.",
    upcomingEventTitle: "Next Open Reading",
    upcomingEventDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    aboutText: "A living literary space for African and global spoken-word poets — raw and electric, like an open mic in a dimly lit Lagos art house.",
    donationMessage: "Loudthotz operates on community-led volunteering under the Naija Art Initiative.",
    donationPaystackLink: "https://paystack.shop/pay/loudthotzdonate",
    totalCommunityVoices: 5000,
  };

  // Write all
  await Promise.all([
    ...poems.map((p) => addDoc(collection(db, "poems"), p)),
    ...books.map((b) => addDoc(collection(db, "books"), b)),
    ...sessions.map((s) => addDoc(collection(db, "livestream_sessions"), s)),
    ...submissions.map((s) => addDoc(collection(db, "submissions"), s)),
    setDoc(doc(db, "livestream_status", "current"), liveStatus),
    setDoc(doc(db, "settings", "main"), siteSettings),
  ]);
}
