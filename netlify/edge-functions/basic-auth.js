// Deno runtime (Edge Function)
// Semplice Basic Auth con password unica.
// USERNAME è opzionale; se non definita, accettiamo qualunque username purché la password sia corretta.

const EXCLUSIONS = [
    /^\/\.netlify\//i,
/^\/favicon\.ico$/i,
/^\/robots\.txt$/i,
/^\/sitemap\.xml$/i,
/^\/admin\//i,     // evita doppia auth sul CMS
/^\/images\//i,    // lascia libere le immagini (preview CMS)
/^\/assets\//i,
/^\/css\//i,
/^\/js\//i,
/^\/fonts\//i,
];

function isExcluded(pathname) {
    return EXCLUSIONS.some((re) => re.test(pathname));
}

function parseBasicAuth(header = "") {
    // header es. "Basic dXNlcjpwYXNz"
    if (!header.startsWith("Basic ")) return null;
    try {
        const b64 = header.slice(6).trim();
        const [user, pass] = atob(b64).split(":");
        return { user, pass };
    } catch {
        return null;
    }
}

export default async (request, context) => {
    const url = new URL(request.url);

    // Salta il controllo per le esclusioni
    if (isExcluded(url.pathname)) return context.next();

    const PASSWORD = Deno.env.get("SITE_PASSWORD") || "";
    const USERNAME = Deno.env.get("SITE_USERNAME") || ""; // opzionale

    // Leggi Authorization
    const auth = parseBasicAuth(request.headers.get("authorization") || "");

    // Regola: se USERNAME è definito, deve combaciare; se è vuoto, ignoriamo l'username
    const passOk = !!auth && auth.pass === PASSWORD;
    const userOk = USERNAME ? (auth && auth.user === USERNAME) : !!auth;

    if (passOk && userOk) {
        return context.next();
    }

    // Prompt Basic Auth
    return new Response("Authentication required", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Private preview", charset="UTF-8"',
            "Cache-Control": "no-store",
        },
    });
};
