// src/2048/loadResources.ts
type ScriptType = "module" | "text/javascript";

export function loadResources(urls: string[], type: ScriptType = "module"): Promise<HTMLScriptElement[]> {
  return Promise.all(
    urls.map((url) => new Promise<HTMLScriptElement>((resolve, reject) => {
      if (document.querySelector(`script[src="${url}"]`)) return resolve(document.querySelector(`script[src="${url}"]`) as HTMLScriptElement);
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.type = type;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.body.appendChild(script);
    }))
  );
}

export function loadCss(href: string): Promise<HTMLLinkElement> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`link[href="${href}"]`) as HTMLLinkElement | null;
    if (existing) return resolve(existing);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve(link);
    link.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.appendChild(link);
  });
}
