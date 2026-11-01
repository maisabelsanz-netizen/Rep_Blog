let posts = [];
let comments = [];

// Constant
const postsContainer = document.querySelector('.posts-cards');
const searchPost = document.getElementById('userInput');
const tagSelector = document.getElementById('tag-selector');
const sortReact = document.getElementById('sort-reactions');

// Display function appending each card to post div
function displayPost (list) {
    postsContainer.innerHTML = '';

    if (list.lenght === 0) {
        postsContainer.textContent = "No post found";
        return;
    }
    list.forEach(post => {
        postsContainer.append(createCard(post));
        
    });
}
// console.log(postsContainer)

// Filter function using filter() method and an addEventListener
function findPosts(list, text) {
    const searchText = text.trim().toLowerCase();

    return list.filter(post =>
        post.title.toLowerCase().includes(searchText)
    );
}
searchPost.addEventListener('input', () => {
    const results = findPosts(posts, searchPost.value);
    displayPost(results);
    // console.log(results)
});

// function select by tags and eventListener
function getTags(posts) {
    const singleTags = posts
    .flatMap(post => post.tags)
    .filter((tags, index, posts) => posts.indexOf(tags) === index)
    .sort();

    tagSelector.innerHTML = '<option value="">All tags</option>' + 
        singleTags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
}

tagSelector.addEventListener('change', () => {
    const selected = tagSelector.value;

    if (!selected) {
        displayPost(posts);
        return; 
    } 
    displayPost(posts.filter(post => post.tags.includes(selected)));
    // console.log(posts.filter(post => post.tags.includes(selected)))
});

// toSorted function display the posts with most likes
function sortReactions () {
    return posts.toSorted((a, b) => b.reactions.likes - a.reactions.likes);

}
sortReact.addEventListener('change', () => {
    const selected = sortReact.value;

    if (!selected) {
        displayPost(posts);
        return; 
    } 
    displayPost(sortReactions(posts));
    // console.log(sortReactions(posts))
});

// Function declaring content of each div card (Posts)
function createCard(post) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body.slice(0, 100)}...</p>
        <p class="tags">${post.tags.join(",")}</p>
        <p class="reactions">Likes ${post.reactions.likes}<br>Dislikes ${post.reactions.dislikes}</p>
        <button class="delete">Delete</button>
        <button class="details">More details</button>
        `;
    
    // More details button with its eventListener
        const btnDetails = card.querySelector('.details');
        btnDetails.addEventListener('click', () => {
        window.location.href = `post-details.html?id=${post.id}`;
    });    
    // Delete button with its eventListener
        const buttonDelete = card.querySelector('.delete');
        buttonDelete.addEventListener('click', () => {

        card.remove();
        posts = posts.filter(p => p.id !== post.id);
        // console.log(posts.filter(p => p.id !== post.id))
        
});
    return card;
}; 

// DELETE METHOD by postId with async/await and error handling with try/catch
async function deletePost(postId) {
    try{
        let response = await fetch(`https://dummyjson.com/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
        throw new Error (`HTTP-error: ${response.status}`);
    }
    const result = await response.json();
    return result;
   
    } catch (error) {
        console.error("Something went wrong:", error);
    }
}

// GET METHOD using Promise.all() to fetch both APIs -- async/await and error handling try/catch
async function getPosts() {
    try {
        const [postsResponse, commentsResponse] = await Promise.all([
            fetch("https://dummyjson.com/posts?limit=10"),
            fetch("https://dummyjson.com/comments?limit=10")
        ]);

        if(!postsResponse.ok || !postsResponse.ok) {
            console.log(`HTTP error! Status: ${response.status} Status Text: ${response.statusText}, URL: ${response.url}`);
            return;
        }
        const [postsData, commentsData] = await Promise.all([
            postsResponse.json(),
            commentsResponse.json(),
            console.log("The post and comments fetched with success!")
        ]);     
        posts = postsData.posts;
        comments = commentsData.comments;
        getTags(posts); 
    
        // Foreach loop create each post div
        posts.forEach(post => {
            const card = createCard(post);
            postsContainer.append(card);
        });
        
    } catch (error) {
        console.log(`Error occured: ${error.message}`);
    }    
}
getPosts();


