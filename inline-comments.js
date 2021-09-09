import {
    parse,
} from "https://deno.land/std@0.106.0/encoding/toml.ts";


// let comments = JSON.parse(Deno.readTextFileSync("data/comments.json"));
// for (const dirEntry of Deno.readDirSync('content/post')) {
//     if (!dirEntry.name.endsWith(".md")) {
//         continue;
//     }
//     let file = Deno.readTextFileSync("content/post/" + dirEntry.name);
//     let regex = /\+\+\+([\s\S]*)\+\+\+/gm;
//     let match = regex.exec(file);
//     if (match) {
//         let parsed = parse(match[1]);
//         parsed.comments = comments.posts[parsed.id] || [];
//         file = file.replace(regex, JSON.stringify(parsed));
//         Deno.writeTextFileSync("content/post/" + dirEntry.name, file);
//     }
//
// }
//


