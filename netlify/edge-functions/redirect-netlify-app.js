// netlify/edge-functions/redirect-netlify-app.js
export default async (req) => {
    const host = req.headers.get("host") || "";
    if (host === "muleml.netlify.app") {
        const url = new URL(req.url);
        url.host = "www.muleml.com";
        url.protocol = "https:";
        return Response.redirect(url.toString(), 301);
    }
    return fetch(req);
};
