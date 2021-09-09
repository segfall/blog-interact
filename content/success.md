+++
title = "Success"
date = "2014-04-09"
+++

Nice, you just submitted your comment.
Once it's ready, this page will automatically redirect.

<script>
    
    let cow = async function() {
        let params = new URLSearchParams(window.location.hash.slice(1));
        let res = await fetch('/comment/' + params.get('comment'));
        if (res.status !== 200) {
            return setTimeout(cow, 2000);
        } else {
            window.location.href = params.get('redirect') + "#" + params.get('comment');
        }
    };

    setTimeout(cow, 20000);


</script>