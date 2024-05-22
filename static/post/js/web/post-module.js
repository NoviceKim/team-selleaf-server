const replyService = (() => {
    const write = async (reply) => {
        const response = await fetch("/post/replies/write/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify(reply)
        });
        return response.json()
    }

    const getList = async (post_id, page, callback) => {
        const response = await fetch(`/post/replies/list/${post_id}/${page}/`);
        const replies = await response.json();
        if(callback){
            return callback(replies);
        }
        return replies;
    }

    const remove = async (replyId) => {
        await fetch(`/post/replies/${replyId}/`, {
            method: 'delete',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    const update = async (reply) => {
        const response = await fetch(`/post/replies/${reply.replyId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({'reply_content': reply.replyContent})
        });
        return response.json()
    }

    const like = async (post_id, reply_id, member_id, like_status, callback) => {
        const response = await fetch(`/post/like/${post_id}/${reply_id}/${member_id}/${like_status}/`);
        const likes = await response.json();
        if (callback){
            return callback(likes);
        }
        return likes;

        }

    return {write: write, getList: getList, remove: remove, update: update, like:like}
})();

const postService = (() => {

    const getList = async (page, filters, sorting, types, callback) => {
        const response = await fetch(`/post/list/${page}/${filters}/${sorting}/${types}`);
        const posts = await response.json();
        if(callback){
            return callback(posts);
        }
        return posts;
    }

    const getScrap = async (post_id, member_id, scrap_status, callback) => {
        const response = await fetch(`/post/scrap/${post_id}/${member_id}/${scrap_status}/`);
        const scraps = await response.json();
        if (callback){
            return callback(scraps);
        }
        return scraps;

    }

    const getLike = async (post_id, member_id, like_status, callback) => {
        const response = await fetch(`/post/like/${post_id}/${member_id}/${like_status}/`);
        const likes = await response.json();
        if (callback){
            return callback(likes);
        }
        return likes;

        }

    const likeCount = async (post_id, callback) => {
        const response = await fetch(`/post/like/count/${post_id}/`)
        const likeCounting = await response.json();
        if (callback){
            return callback(likeCounting);
        }
        return likeCounting;
    }

    const scrapCount = async (post_id, callback) => {
        const response = await fetch(`/post/scrap/count/${post_id}/`)
        const scrapCounting = await response.json();
        if (callback){
            return callback(scrapCounting);
        }
        return scrapCounting;
    }

    const aiPost = async (postTitle, postContent) => {
        const loading = document.querySelector('.loading')
        const info = document.querySelector('.tag-input2')
        loading.style.display = 'block'
        info.style.display = 'none'
        const response = await fetch('/ai/api/post-detail/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({ title: postTitle, content: postContent })
        });
        loading.style.display = 'none'
        info.style.display = 'inline-block'
        return await response.json();
    };

    return {
        getList: getList,
        getScrap: getScrap,
        getLike: getLike,
        likeCount: likeCount,
        scrapCount: scrapCount,
        aiPost : aiPost,
    }
})();















