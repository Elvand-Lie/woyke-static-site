import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

const readGenerated = (filename: string) =>
  fs.readFileSync(path.join(process.cwd(), "app", filename), "utf8");

export default function HomePage() {
  const markup = readGenerated("legacy-home.html");
  const styles = readGenerated("legacy-home.css");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      <Script src="/assets/js/home.js" strategy="afterInteractive" />
    </>
  );
}
