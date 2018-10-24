function getToken() {
    return getCookie("token");
}

function getAllDelayedPosts() {
    req_body = {
        'token': getToken()
    }

    return fetch(API_URL + '/posts', {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(handle_errors)
    .then(response => response.json())
    .then(data => posts = data);
}

function editDelayedPost(post_id, msg, attachments) {
    req_body = {
        'post_id': post_id,
        'token': getToken(),
        'attachments': attachments,
        'msg': msg
    }

    return fetch(API_URL + '/edit', {
        method: 'POST',
        body: JSON.stringify(req_body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

function addTypesToForm() {
    fetch(API_URL + '/types')
    .then(resp => resp.json())
    .then(data => {
        for (i = 0; i < data.len; i++) {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', i);
            optionElement.textContent = data.getters[i];

            selectElement.appendChild(optionElement);
        }
    });
}