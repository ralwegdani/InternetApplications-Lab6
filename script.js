function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + "=" + encodeURIComponent(value) +
      "; expires=" + date.toUTCString() + "; path=/";
  }
  
  function getCookie(name) {
    const parts = document.cookie.split("; ");
    for (const part of parts) {
      const [key, val] = part.split("=");
      if (key === name) return decodeURIComponent(val);
    }
    return null;
  }
  
  function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  }
  
  const likeBtn = document.getElementById("likeBtn");
  const dislikeBtn = document.getElementById("dislikeBtn");
  const likeCount = document.getElementById("likeCount");
  const dislikeCount = document.getElementById("dislikeCount");
  const commentInput = document.getElementById("commentInput");
  const submitBtn = document.getElementById("submitBtn");
  const clearBtn = document.getElementById("clearBtn");
  const commentList = document.getElementById("commentList");
  const resetBtn = document.getElementById("resetBtn");
  const message = document.getElementById("message");
  
  const BASE_LIKES = 100;
  const BASE_DISLIKES = 20;
  let likes = BASE_LIKES;
  let dislikes = BASE_DISLIKES;
  let comments = [];
  
  function loadState() {
    const vote = getCookie("vote");
    likes = BASE_LIKES + (vote === "like" ? 1 : 0);
    dislikes = BASE_DISLIKES + (vote === "dislike" ? 1 : 0);
  
    const saved = getCookie("comments");
    comments = saved ? JSON.parse(saved) : [];
  
    updateUI();
  }
  
  function updateUI() {
    const vote = getCookie("vote");
    const commented = getCookie("commented");
  
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;
  
    likeBtn.disabled = vote !== null;
    dislikeBtn.disabled = vote !== null;
    likeBtn.classList.toggle("selected", vote === "like");
    dislikeBtn.classList.toggle("selected", vote === "dislike");
  
    commentInput.disabled = commented !== null;
    submitBtn.disabled = commented !== null;
    commentInput.placeholder = commented
      ? "You already left a comment."
      : "Write a comment...";
  
    commentList.innerHTML = "";
    comments.forEach(function (c) {
      const li = document.createElement("li");
      li.textContent = c; 
      commentList.appendChild(li);
    });
  }
  
  function vote(type) {
    if (getCookie("vote")) return; 
  
    if (type === "like") {
      likes++;
      likeBtn.classList.add("pop");
    } else {
      dislikes++;
      dislikeBtn.classList.add("pop");
    }
  
    setCookie("vote", type, 30);
    updateUI();
  }
  
  likeBtn.addEventListener("click", function () { vote("like"); });
  dislikeBtn.addEventListener("click", function () { vote("dislike"); });
  
  [likeBtn, dislikeBtn].forEach(function (btn) {
    btn.addEventListener("animationend", function () {
      btn.classList.remove("pop");
    });
  });
  
  submitBtn.addEventListener("click", function () {
    const text = commentInput.value.trim();
    if (text === "") {
      showMessage("Please write a comment first.", "red");
      return;
    }
    if (getCookie("commented")) return; 
  
    comments.push(text);
    setCookie("comments", JSON.stringify(comments), 30);
    setCookie("commented", "true", 30);
  
    commentInput.value = "";
    showMessage("Comment added!", "green");
    updateUI();
  });
  
  clearBtn.addEventListener("click", function () {
    commentInput.value = "";
  });
  
  resetBtn.addEventListener("click", function () {
    if (!confirm("Reset your vote and comment?")) return;
  
    deleteCookie("vote");
    deleteCookie("comments");
    deleteCookie("commented");
  
    likes = BASE_LIKES;
    dislikes = BASE_DISLIKES;
    comments = [];
  
    updateUI();
    showMessage("Your vote and comment have been reset. You can vote again.", "green");
  });
  
  function showMessage(text, color) {
    message.textContent = text;
    message.style.color = color;
    setTimeout(function () { message.textContent = ""; }, 3000);
  }
  
  loadState();