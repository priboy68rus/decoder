const statusEl = document.querySelector(".status");

function getPostHours(post) {
    var time = post.date;
    var date = new Date();
    date.setTime(time * 1000);
    return date.getUTCHours();
}

function getPostDay(post) {
    var time = post.date;
    var date = new Date();
    date.setTime(time * 1000);
    return date.getUTCDate();
}

function handle_errors(response) {
    if (!response.ok) {
        alert(response.statusText)
    }
    return response;
}

function statusSending() {
    statusEl.textContent = "Sending...";
    statusEl.style.color = "#55a4ff";
    statusEl.style.textAlign = "center";
}

function statusOK() {
    statusEl.textContent = "Success!";
    statusEl.style.color = "#1ed81e";
    window.setTimeout(statusHide, 2000);
}

function statusHide() {
    statusEl.textContent = "";
}

function statusGetting() {
    statusEl.textContent = "Getting...";
    statusEl.style.color = "#55a4ff";
    statusEl.style.textAlign = "center";
}