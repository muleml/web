exports.handler = async (event, context) => {
    const { password } = event.queryStringParameters;
    const correctPassword = process.env.SITE_PASSWORD;

    if (password === correctPassword) {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    }

    return {
        statusCode: 401,
        body: JSON.stringify({ success: false })
    };
};
