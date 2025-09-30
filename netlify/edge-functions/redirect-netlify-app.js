export default async (request, context) => {
    const host = request.headers.get("host") || "";

    // Redirect solo se l'host è il subdomain Netlify
    if (host === "muleml.netlify.app") {
        const url = new URL(request.url);
        url.protocol = "https:";
        url.host = "www.muleml.com";
        return Response.redirect(url.toString(), 301);
    }

    // IMPORTANTE: NON usare fetch(request) qui
    return context.next();
};
