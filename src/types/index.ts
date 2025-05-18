import { MouseEventHandler } from 'react';

export interface ITableProps {
  response: any;
  structure: any;
  tableProperties?: any;
  query?: IQueryType;
  enablePagination?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  enableRowActions?: boolean;
  enableDnD?: boolean;
  setQuery?: Function;
  sort?: Function;
  sortContext?: string;
  searchPlaceHolder?: string;
  searchFieldWidth?: string;
  enableRowNumbers?: boolean;
  renderDetailPanel?: any;
  showGlobalFilter?: boolean;
  mantinePaperProps?: any;
  hasSerialNo?: boolean;
}

export interface ICountrySelect {
  value: string;
  label: string;
  flag: string;
}
// Define the type for the query arguments
export interface IAllBranchQueryArgs {
  page: number;
  limit: number;
  search?: string | null;
}
export interface IPagination {
  page: number;
  limit: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  totalDocs?: number;
  type?: string;
}

export interface IOption {
  label: string;
  value: string;
}

export type IResponse = {
  status: boolean;
  message: string;
  pagination?: IPagination;
  data: any;
  notificationLimit?: number;
};

export interface IAuthState {
  user?: any | undefined;
  role: string;
  isLoggedIn: boolean;
  accessToken: string | null;
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

// branch
export interface Branch {
  _id?: string;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  status?: boolean;
}

// SubAdmin
export interface ISubAdmin {
  _id?: string;
  retailerId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
  status: boolean;
  softDeleted?: boolean;
}

export interface ISubAdminResponse extends IResponse {
  data: {
    docs: ISubAdmin[];
    page: number;
    limit: number;
    totalPage: number;
    totalDocs: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
export interface ICreateSubAdmin {
  // Define the fields required to create a sub-admin
}

export interface IUpdateSubAdmin {
  id: string; // Assuming id is of type string, adjust if it's a different type
  updateSubAdminData: any; // Adjust the type according to the structure of values
}

export interface IDeleteSubAdmin {
  id: string;
}
// SubAdmin

// stamp image

export interface ICreateStampImage {
  retailerId: string;
  branchId: string;
  imageUrl: string;
}

export interface IUpdateStampImage {
  id: string;
  retailerId?: string;
  branchId?: string;
  imageUrl?: string;
}

export interface IDeleteStampImage {
  id: string;
}

export interface IAllBranchQueryArgs {
  page: number;
  limit: number;
}
// stamp image

export interface Subscription {
  _id: string;
  title: string;
  price: number;
  duration: number;
  descriptions: string[];
  slug: string;
  type: string;
  image: string;
  isBlocked?: boolean;
  allowTotalBranch?: number;
  allowTotalStamp?: number;
  isUnlimited?: boolean;
  unlimitedFieldName?: string;
}

export interface AddOn {
  _id: string;
  title: string;
  price: number;
  slug: string;
  descriptions: string[];
  isAddOnsSelect?: boolean;
}

export interface Coupon {
  _id: string;
  title: string;
  discountType: string;
  discount: number;
  minPurchaseAmount: number;
  limit: number;
  appliedSlugs: string[];
}

// General Settings

interface ITimezone {
  label?: string;
  value?: string;
}

interface IGeneral {
  timezone?: ITimezone;
  companyName?: string;
  dialCode: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  androidDownloadLink?: string;
  iosDownloadLink?: string;
  contactEmail?: string;
  facebook: string;
  linkedin: string;
  instagram: string;
  tiktok: string;
}

interface IMail {
  host?: string;
  port?: string;
  username?: string;
  password?: string;
}

interface INotification {
  firebaseServerKey?: string;
  firebaseTopics?: string;
}

interface IS3Bucket {
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsBucketName?: string;
}

export interface ICurrency {
  country?: string;
  currency?: string;
}

interface IStripe {
  stripeSecretKey?: string;
  stripePublishKey?: string;
  stripeWebhookSecretKey?: string;
  planChangeCost?: number | string;
  refundableThreshold?: number | string;
  taxTitle?: string;
  taxCost?: number | string;
  taxStatus?: string;
  defaultCurrency?: ICurrency;
}

interface IGoogleMap {
  googleMapsApiKey?: string;
}

interface IPage {
  policy?: string;
  terms?: string;
}

export interface IGeneralSettingData {
  general?: IGeneral;
  mail?: IMail;
  notification?: INotification;
  s3Bucket?: IS3Bucket;
  stripe?: IStripe;
  googleMap?: IGoogleMap;
  page?: IPage;
}

export interface IGeneralSetting {
  data?: IGeneralSettingData;
}
