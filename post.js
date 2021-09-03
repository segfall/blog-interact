import { request } from "https://cdn.skypack.dev/@octokit/request";


// Every request to a Deno Deploy program is considered as a fetch event.
// So let's register our listener that will respond with the result of
// our request handler on "fetch" events.
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

function getName(data) {
    let mapAct = {
        'comment': '💬',
        'upvote': '👍',
        'downvote': '👎'
    }
    let date = new Date();
    return `${date.toJSON().slice(0,10)}__${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}__${mapAct[data.action]}.json`
}

async function handleRequest(req) {
    if (req.method !== "POST") {
        return new Response("Must be a POST", {
            status: 415
        });
    }

    // We want the 'content-type' header to be present to be able to determine
    // the type of data sent by the client. So we respond to the client with
    // "Bad Request" status if the header is not available on the request.
    if (!req.headers.has("content-type")) {
        return new Response(
            JSON.stringify({ error: "please provide 'content-type' header" }),
            {
                status: 400,
                statusText: "Bad Request",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
            },
        );
    }

    const responseInit = {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    };

    const json = await req.json();
    let body = {
        action: json.action || 'comment',
    };
    let data = await request('PUT /repos/segfall/blog/contents/logs/' + getName(body), {
        owner: 'segfall',
        repo: 'blog',
        branch: 'main',
        message: "Adding new " + body.action,
        content: btoa(JSON.stringify({
            text: body.text || "",
            article: body.article || "",
            comment: body.comment || "",
        }, null, 4) + '\n'),
        headers: {
            'authorization': 'token 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'
        }
    })

    return new Response(JSON.stringify({ data }, null, 2), responseInit);




    // // Handle form data.
    // if (
    //     contentType.includes("application/x-www-form-urlencoded") ||
    //     contentType.includes("multipart/form-data")
    // ) {
    //     const formData = await request.formData();
    //     const formDataJSON = {};
    //     for (const [key, value] of formData.entries()) {
    //         formDataJSON[key] = value;
    //     }
    //     return new Response(
    //         JSON.stringify({ form: formDataJSON }, null, 2),
    //         responseInit,
    //     );
    // }
    //
    // // Handle plain text.
    // if (contentType.includes("text/plain")) {
    //     const text = await request.text();
    //     return new Response(JSON.stringify({ text }, null, 2), responseInit);
    // }

    // Reaching here implies that we don't support the provided content-type
    // of the request so we reflect that back to the client.
    // return new Response(null, {
    //     status: 415,
    //     statusText: "Unsupported Media Type",
    // });
}
