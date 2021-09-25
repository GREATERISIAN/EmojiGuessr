import { CompactEmoji, Emoji, FetchEmojisOptions, FlatCompactEmoji, FlatEmoji, Locale } from './types';
declare function fetchEmojis(locale: Locale, options?: FetchEmojisOptions & {
    compact?: false;
    flat?: false;
}): Promise<Emoji[]>;
declare function fetchEmojis(locale: Locale, options: FetchEmojisOptions & {
    compact?: false;
    flat: true;
}): Promise<FlatEmoji[]>;
declare function fetchEmojis(locale: Locale, options: FetchEmojisOptions & {
    compact: true;
    flat?: false;
}): Promise<CompactEmoji[]>;
declare function fetchEmojis(locale: Locale, options: FetchEmojisOptions & {
    compact: true;
    flat: true;
}): Promise<FlatCompactEmoji[]>;
export default fetchEmojis;
//# sourceMappingURL=fetchEmojis.d.ts.map