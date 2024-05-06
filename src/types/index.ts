import { MouseEventHandler } from 'react';

export interface IPagination {
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalDocs: number;
}

export interface IOption {
  label: string;
  value: string;
}

export interface IAuthState {
  user?: any | undefined;
  role: string;
}

export interface IQueryType {
  pageIndex: number;
  pageSize: number;
  search?: string | null;
}

export type ITableOption = {
  name: string | React.ReactNode;
  action: MouseEventHandler<HTMLButtonElement>;
};

export interface IUser {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  image?: string;
  status?: string;
  emailVerified: number;
  provider?: string;
  role: string;
  refreshToken?: string;
}

export interface IContent {
  id?: string;
  title: string;
  content: string;
  status?: string;
}

export interface IPrayer {
  id?: string;
  email: string;
  title: string;
  description: string;
  admin_reply?: string;
  user: string | IUser;
}

export interface ISongBook {
  id?: string;
  name: string;
  image: string;
  status?: '0' | '1';
}
export interface ISong {
  id?: string;
  bookName: string | ISongBook;
  songTitle: string;
  lyrics: string;
  status?: '0' | '1';
}

export interface IVideoCategory {
  id?: string;
  name: string;
  status?: '1' | '0';
}

export interface IVideo {
  id?: string;
  category: string | IVideoCategory;
  videoIds: string[];
  status?: '1' | '0';
}

export interface ILanguage {
  id?: string;
  code: string;
  name: string;
  nameLocal: string;
  script?: string;
  scriptDirection: 'LTR' | 'RTL';
  status?: '0' | '1';
}

export interface IDailyManna {
  id?: string;
  title: string;
  description: string;
  date: string;
}

export interface IDailyVerse {
  id?: string;
  content: string;
  image: string;
  date: string;
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface ICountry {
  id?: string;
  code: string;
  name: string;
  nameLocal: string;
}

export interface IVersion {
  id?: string;
  language: ILanguage;
  countries: ICountry[];
  audioVersion?: IVersion[];
  compositeKey: string;
  versionId: string;
  name: string;
  nameLocal: string;
  type: 'text' | 'audio' | 'Both';
  abbreviation?: string;
  abbreviationLocal?: string;
  description?: string;
  descriptionLocal?: string;
  copyrightText?: string;
  copyrightInfo?: string;
  status?: '0' | '1';
}

export interface IBook {
  id?: string;
  language: ILanguage;
  version: IVersion;
  compositeKey: string;
  collectionCode?: 'OT' | 'NT' | 'Both';
  bookId: string;
  name: string;
  nameLong: string;
  bookOrder?: string;
  numberOfChapters?: number;
  type: 'text' | 'audio' | 'Both';
  status?: '0' | '1';
}

export interface IChapter {
  id?: string;
  language: ILanguage;
  version: IVersion;
  book: IBook;
  compositeKey: string;
  chapterId: string;
  numberOfVerses?: number;
  resourceUrl?: string;
  resourceExpiry?: string;
  number: number;
  type: 'text' | 'audio' | 'Both';
  status?: '0' | '1';
}

export interface IAudio {
  startTime?: string;
  endTime?: string;
}

export interface IVerse {
  id?: string;
  language: ILanguage;
  version: IVersion;
  book: IBook;
  chapter: IChapter;
  audio?: IAudio;
  compositeKey: string;
  content: string;
  verseId: string;
  position: number;
  status?: '0' | '1';
}

export interface IQaCategory {
  id?: string;
  name: string;
  status?: '0' | '1';
}

export interface IQa {
  id?: string;
  category: IQaCategory;
  question: string;
  answer: string;
  status?: '0' | '1';
}

export interface IPosterCategory {
  id?: string;
  name: string;
  status?: '0' | '1';
}

export interface IPoster {
  id?: string;
  category: IPosterCategory;
  image?: string;
  title: string;
  description?: string;
  status?: '0' | '1';
}

export interface ITag {
  id?: string;
  word: string;
  version: IVersion;
  book: IBook;
  chapter: IChapter;
  verse: IVerse;
}

export interface IExample {
  tags: ITag[];
}

export interface IDictionary {
  id?: string;
  word: string;
  wordInEnglish: string;
  defination: string;
  image?: string;
  caption?: string;
  tags: ITag[];
  examples: IExample[];
  status?: '0' | '1';
}
