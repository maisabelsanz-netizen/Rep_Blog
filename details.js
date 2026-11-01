let post = [];
let comments = [];

const id = new URLSearchParams(window.location.search).get('id');
const postId = new URLSearchParams(location.search).get('id');

// Constant
const postsContainer = document.querySelector(".post-details");
const comment_form = document.getElementById("comment-form");
const titlePost = document.getElementById('title');
const bodyPost = document.getElementById('body');
const tagsPost = document.getElementById('tags');
const reactions = document.getElementById('reactions');
const views = document.getElementById('views'); 

// EDIT POST CONTENT VARIABLES
const edit_form = document.getElementById('edit_form');
const edit_title = document.getElementById('edit_title');
const edit_body = document.getElementById('edit_body');
const togglebtn = document.querySelector(".togglebtn");
const editContainer = document.getElementById('edit-container');

// Hidden form buttontoggle
togglebtn.addEventListener('click', () => {
    editContainer.classList.toggle('active');
});

// PUT HTTP METHOD for update post.title using async/await and response.ok
async function changeTitle() {
    const response = await fetch(`https://dummyjson.com/post/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title: edit_title.value}),
    });

    if (!response.ok) { 
        throw new Error("The title could't be updated");
    }
    return await response.json();
}    

// PATCH HTTP METHOD for update post.body using async/await and response.ok
async function changeBody() {
    const response = await fetch(`https://dummyjson.com/post/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({body: edit_body.value}),
    });

    if(!response.ok) { 
        throw new Error("The content could't be updated");
    
    }
    return await response.json();
}   

// Function that runs both PUT and PATCH methods by EventListener "submit" (async/await) & (try/catch)
async function updatedPost(postId) {
    if(!postId) {
        titlePost.textContent = "No post has been found in the URL";
        return;
    }
    try {
        const updatedTitle = await changeTitle(postId);
        const updatedBody = await changeBody(postId);
    
        titlePost.textContent = updatedTitle.title;
        bodyPost.textContent = updatedBody.body;
    } catch (error) {
        console.error(error);
    }
}   

edit_form.addEventListener('submit', (event) => {
    event.preventDefault();
    updatedPost(id);

});

// GET METHOD using Promise.all() to fetch both APIs -- async/await and error handling try/catch
async function PostDetails() {
    if (!id) {
        titlePost.textContent = "No post has been found in the URL";
        return;
    }
    try {
        const [postsResponse, commentsResponse] = await Promise.all([
            fetch(`https://dummyjson.com/posts/${id}`),
            fetch(`https://dummyjson.com/posts/${id}/comments`)
        ]);

        if (!postsResponse.ok ||!commentsResponse.ok) {
            throw new Error ("The post couldn't load");    
    }

    const posts = await postsResponse.json();
    const commentsData = await commentsResponse.json();
    // console.log(commentsData)
    comments = commentsData.comments;
    displayComments (comments);

    titlePost.textContent = posts.title;
    body.textContent = posts.body;
    tags.textContent = `Tags: ${posts.tags.join(",")}`;
    reactions.textContent = `Likes: ${posts.reactions.likes} Dislikes: ${posts.reactions.dislikes}`;
    views.textContent = `Views: ${posts.views}`;

    } catch (error) {
        console.error(error); 
    }
}
PostDetails()

// Display div comments function with with forEach 
function displayComments(comments) {
    const commentsList = document.getElementById("comments");
    commentsList.innerHTML = '';

    if (comments.length === 0) {
        commentsList.textContent = "No comments yet";
        return;
    }
    comments.forEach(comment => {
        const card = document.createElement('div');
        card.className = 'commentList';
        let nickname = comment.user.nickname || comment.user.username;
        card.innerHTML = `
            <h2 class="fullname">${comment.user.fullName || comment.user.username }</h2>
            <p>${comment.body}</p>
            <p class="username">@${nickname}</p>
        `;
        commentsList.append(card);
    });
}

// POST HTTP METHOD call to update a newcomment using async/await and try/catch (error)
async function addComment(postId, userId, text, userName, nickname) {
    try {
      const response = await fetch(`https://dummyjson.com/comments/add`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            body: text,
            postId: postId,
            userId: userId
        })
    });

    if(!response.ok) {
        console.log(`HTTP error! Status: ${response.status}, Status Text: ${response.statusText}, URL: ${response.url}`);
        return;
        }
        const newComment = await response.json();
        newComment.user.fullName = userName,
        newComment.user.nickname = nickname
       
        comments.push(newComment);
        displayComments(comments);

    } catch (error) {
        console.log(`Error occured: ${error.message}`);
    }
}   

// Comments form event listener that fetch the form data and display a new comment card (Async-await)
comment_form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(comment_form);
    const data = Object.fromEntries(formData);
    const text = data.comment.trim();

    addComment(id, postId, text, data.user_name, data.nickname);
    console.log(data);
    comment_form.reset();

});   
PostDetails();

  

