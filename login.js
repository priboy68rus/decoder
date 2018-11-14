function setupToken(password) {
    // const token = getCookie("token");
    const token = Cookies.get('token');

    if (token == null) {
        req_body = {
            'password': password
        }

        return fetch(API_URL + "/login", {
            method: 'POST',
            body: JSON.stringify(req_body),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handle_errors)
        .then(resp => resp.json())
        // .then(data => setCookie("token", data.token, 86400));
        .then(data => Cookies.set('token', data.token, { expires: 86400 }));
    }
}