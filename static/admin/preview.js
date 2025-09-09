import CMS from "decap-cms-app";
import React from "react";

/** Utility: risolve i path immagine del markdown in Blob/asset URL */
function resolveMarkdownImages(md, getAsset) {
  if (!md) return "";
  // ![alt](src "title")  -> risolviamo solo il 'src'
  return md.replace(/(!\[[^\]]*\]\()([^)\s]+)(\s*"(?:[^"]*)")?(\))/g, (m, p1, src, titlePart = "", p4) => {
    try {
      const asset = getAsset(src);
      const url = asset ? asset.toString() : src;
      return `${p1}${url}${titlePart || ""}${p4}`;
    } catch {
      return m;
    }
  });
}

/** Utility: converte markdown -> HTML con marked se presente, altrimenti lascia testo grezzo */
function renderMarkdown(md) {
  if (typeof window !== "undefined" && window.marked && window.marked.parse) {
    return window.marked.parse(md);
  }
  // fallback minimo: escape basilare per evitare HTML “grezzo”
  const escaped = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<pre style="white-space:pre-wrap;line-height:1.5">${escaped}</pre>`;
}

/** Wrapper layout semplice per uniformare la preview */
const Shell = ({ children }) => (
  <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", lineHeight: 1.6, padding: "24px", maxWidth: 900, margin: "0 auto" }}>
    <style>{`
      .preview h1,h2,h3,h4 { margin: 1rem 0 .5rem; line-height: 1.25; }
      .preview img { max-width: 100%; height: auto; }
      .preview code { background:#f6f8fa; padding:.1rem .3rem; border-radius:4px; }
      .preview pre code { display:block; padding:1rem; overflow:auto; }
      .avatar { width:120px; height:120px; object-fit:cover; border-radius:9999px; display:block; margin:0 auto 1rem; }
      .muted { color:#666; }
      .center { text-align:center; }
    `}</style>
    <div className="preview">{children}</div>
  </div>
);

/** Preview BLOG (EN/FR) */
const BlogPreview = ({ entry, getAsset }) => {
  const title = entry.getIn(["data", "title"]) || "";
  const date = entry.getIn(["data", "date"]);
  const cover = entry.getIn(["data", "image"]);
  const rawBody = entry.getIn(["data", "body"]) || "";

  // risolvi immagini interne al markdown
  const body = resolveMarkdownImages(rawBody, getAsset);
  const html = renderMarkdown(body);

  // risolvi la cover (anche se è draft)
  const coverUrl = cover ? (getAsset(cover)?.toString() || cover) : null;

  return (
    <Shell>
      {coverUrl ? <img className="avatar" src={coverUrl} alt="" /> : null}
      <h1>{title}</h1>
      {date ? <div className="muted">{new Date(date).toLocaleDateString()}</div> : null}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Shell>
  );
};

/** Preview AUTHORS (EN) */
const AuthorPreview = ({ entry, getAsset }) => {
  const name = entry.getIn(["data", "title"]) || "";
  const photo = entry.getIn(["data", "image"]);
  const social = entry.getIn(["data", "social"]) || [];
  const rawBody = entry.getIn(["data", "body"]) || "";

  // immagini nel markdown della bio
  const body = resolveMarkdownImages(rawBody, getAsset);
  const html = renderMarkdown(body);

  // foto autore (draft-aware)
  const photoUrl = photo ? (getAsset(photo)?.toString() || photo) : null;

  return (
    <Shell>
      {photoUrl ? <img className="avatar" src={photoUrl} alt="" /> : <div className="center muted">Nessuna foto</div>}
      <h1 className="center">{name}</h1>
      <div className="center" style={{ marginBottom: "1rem" }}>
        {social.map((s, i) => {
          const raw = (s.get ? s.get("link") : (s.link || "")) || "";
          const url = /^(https?:\/\/|\/\/|mailto:|tel:)/i.test(raw) ? raw : (raw ? `https://${raw}` : "");
          const icon = s.get ? s.get("icon") : s.icon;
          return url ? (
            <a key={i} href={url} target="_blank" rel="noopener" style={{ margin: "0 .35rem", textDecoration: "none" }}>
              <span className="muted">{icon || "link"}</span>
            </a>
          ) : null;
        })}
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Shell>
  );
};

// Registra le preview per le tue collection
CMS.registerPreviewTemplate("blog-en", BlogPreview);
CMS.registerPreviewTemplate("blog-fr", BlogPreview);
CMS.registerPreviewTemplate("authors-en", AuthorPreview);
