import { request } from "https://cdn.skypack.dev/@octokit/request";
import { urlParse } from 'https://deno.land/x/url_parse/mod.ts';


// Every request to a Deno Deploy program is considered as a fetch event.
// So let's register our listener that will respond with the result of
// our request handler on "fetch" events.
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

function getName(data, timeChar='-', spaceChar='__') {
    let mapAct = {
        'comment': '💬',
        'upvote': '👍',
        'downvote': '👎'
    }
    let date = new Date();
    return `${date.toJSON().slice(0,10)}${spaceChar}${date.getHours()}${timeChar}${date.getMinutes()}${timeChar}${date.getSeconds()}${spaceChar}${mapAct[data.action]}`
}

async function handleRequest(req) {
    console.log(req)
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

    const formData = await req.formData();
    const form = {};
    for (const [key, value] of formData.entries()) {
        form[key] = value;
    }

    let body = {
        action: form.action || 'comment',
        text: form.text || "",
        time_created: new Date().getTime(),
        post_id: form.post_id || "",
        ip_address: req.headers.get('x-forwarded-for')
    };
    let data = await request('PUT /repos/segfall/blog/contents/logs/' + getName(body) + ".json", {
        owner: 'segfall',
        repo: 'blog',
        branch: 'master',
        message: "Adding new " + getName(body, ":", " "),
        content: btoa(JSON.stringify(body, null, 4) + '\n'),
        headers: {
            'authorization': 'token ' + Deno.env.get('PAT')
        }
    })

    console.log(form);

    return Response.redirect(
        "https://mushy-night.surge.sh/success#comment=" + data.data.content.sha.slice(0, 7) +
        "&redirect=" + urlParse(form.redirect).pathname,
        302);


    // return new Response(JSON.stringify({ data }, null, 2), responseInit);




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
