const API_URL = "http://178.128.204.49:5000";

const loginDiv = document.querySelector(".login");
const loginButton = document.querySelector("#login-button");
const passwordInput = document.querySelector("#password-input");
const selectElement = document.querySelector("#type-select");
const postsElement = document.querySelector(".posts");
const textareaElement = document.querySelector("textarea");
const img = document.querySelector("#preview");
const img_url = document.querySelector("#img-url");

posts = []
posts_by_day = [[], [], []]

function startup() {
    const token = getCookie("token");
    
    if (token != null) {
        loginDiv.innerHTML = "";
        getAllDelayedPosts()
        .then(() => {
           populatePosts();
           addTypesToForm();
        });
    } else {
        loginButton.addEventListener("click", (event) => {
            event.preventDefault();

            const password = passwordInput.value;
            setupToken(password)
            .then((r) => loginDiv.innerHTML = "")
            .then(() => window.location.reload());
        });
    }

    setPreviewListener();
}

function populatePosts() {
    var j = 0;
    var d = getPostDay(posts[0]);

    for (var i = 0; i < posts_by_day.length; i++) {
        posts_by_day[i] = []
    }

    for (var i = 0; i < posts.length; i++) {
        if (getPostDay(posts[i]) != d) {
            j++;
        }
        posts_by_day[j].push(posts[i]);
        d = getPostDay(posts[i]);       
    }

    if (posts_by_day[2].length != 0) {
        document.querySelector("#day2").style.display = 'inline-block';
    }

    setPostsContent();
    setDayButtonsCallbacks();
    setNewMsgButtonCallback();
    setNewUserButtonCallback();
    setSaveButtonCallback();
}

function setPostsContent() {
    var selected_day_num = document.querySelector(".day.selected").id.slice(3);
    
    postsElement.innerHTML = "";

    for (var i = 0; i < posts_by_day[selected_day_num].length; i++) {
        post = posts_by_day[selected_day_num][i];
        const postElement = document.createElement('div');
        postElement.setAttribute('class', 'post');
        postElement.setAttribute('post_id', i);
        postElement.textContent = post.text;

        postElement.style.borderColor = "red";
        if (post["attachments"] != null && post["attachments"][0]["photo"] != null) {
            postElement.style.borderColor = "#1ed81e";
        }

        postElement.addEventListener("click", (event) => {
            event.preventDefault();

            var id = event.target.getAttribute('post_id');
            removeSelectedFromPosts();
            event.target.classList.add('selected');
            setPostDetails(selected_day_num, id);
        });

        postsElement.appendChild(postElement);
    }  
}

function removeSelectedFromPosts() {
    var p = document.querySelector(".post.selected")
    if (p != null) {
        p.classList.remove('selected');
    }
}

function setDayButtonsCallbacks() {
    const days = document.querySelectorAll(".day");
    for (var i = 0; i < days.length; i++) {
        days[i].addEventListener("click", (event) => {
            event.preventDefault();
            
            document.querySelector(".day.selected").classList.remove("selected");

            event.target.classList.add("selected");
            setPostsContent();
        })
    }   
}


function setNewMsgButtonCallback() {
    const new_msg_btn = document.querySelector("#new-msg");
    new_msg_btn.addEventListener('click', (event) => {
        statusGetting();
        event.preventDefault();

        const msg_type = selectElement.value;

        req_body = {
            'msg_type': msg_type,
            'name_added': 'off'
        }

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(req_body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(data => {
            var old_text = textareaElement.textContent;
            var new_text = old_text.split(",")[0] + "," + data[0];

            textareaElement.textContent = new_text;
        })
        .then(() => statusHide());   
    });
}

function setNewUserButtonCallback() {
    const new_user_btn = document.querySelector("#new-user");
    new_user_btn.addEventListener('click', (event) => {
        event.preventDefault();

        fetch(API_URL + '/user')
        .then(resp => resp.json())
        .then(data => {
            var old_text = textareaElement.textContent.split(",");
            old_text[0] = data;
            var new_text = old_text.join(",");
            
            textareaElement.textContent = new_text;
        });
    });
}

function setSaveButtonCallback() {
    const save_btn = document.querySelector("#save");
    save_btn.addEventListener('click', (event) => {
        statusSending();
        event.preventDefault();

        var selected_day_num = document.querySelector(".day.selected").id.slice(3);
        var postEl = document.querySelector(".post.selected");

        var post_i = postEl.getAttribute("post_id");
        var post = posts_by_day[selected_day_num][post_i];

        var url = img_url.value;

        editDelayedPost(post.id, textareaElement.textContent, url)
        .then(() => {
            getAllDelayedPosts()
            .then(() => populatePosts());
        })
        .then(() => statusOK());
    });
}


function setPreviewListener() {
    img_url.addEventListener('input', (event) => {
        img.setAttribute('src', event.target.value);
    });
}

function setPostDetails(day_i, i) {
    post = posts_by_day[day_i][i];

    textareaElement.textContent = post.text;

    if (post["attachments"] != null && post["attachments"][0]["photo"] != null) {
        img_url.value = post["attachments"][0]["photo"]["sizes"][2]["url"];
    } else {
        img_url.value = "";
    }
    var e = new Event('input');
    img_url.dispatchEvent(e);


    var options = document.querySelectorAll('option');
    for (var i = 0; i < options.length; i++) {
        var val = options[i].textContent;

        var post_beginning = post.text.split(",").slice(1).join(",").slice(1);
        if (post_beginning.includes(val)) {
            selectElement.selectedIndex = i;
        }
    }
    
}

startup();
