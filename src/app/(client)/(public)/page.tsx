import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Home Page")
};

export default async function Page() {
  return <div>Home Page</div>;
}
