// JavaScript code in home.js

local = sessionStorage.getItem("username");

if (local == null) {
    window.location.replace("http://localhost:7000/index.html")
}

const tagsFilter = document.getElementById("tags-filter");
let blogsData;

document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display existing blog posts
    fetch('http://localhost:8000/blog')
        .then(response => response.json())
        .then(data => { blogsData = data; gettags(data); filterbytag(data); })
        .catch(error => {
            console.error('An error occurred:', error);
        });
});

document.getElementById("blog-post-form").addEventListener("submit", event => {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const tags = document.getElementById("tags").value;

    const t = { title: title, content: content, author: { username: sessionStorage.getItem("username") }, tags: tags };
    console.log(tags);
    alert();
    fetch('http://localhost:8000/blog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(t)
    })
        .then(response => {
            console.log(response);
            if (response.ok) {
                window.location.reload(); // Reload the page to display the new post
            } else {
                alert('Error: Failed to create a new post.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

const deleteBlogPost = (id) => {
    fetch(`http://localhost:8000/blog/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                console.log('Blog post deleted successfully.');
            } else {
                console.error('Blog post deletion failed.');
            }
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
};

function gettags(data) {
    console.log(data);
    const uniquetags = Array.from(new Set(data.flatMap(blog => blog.tags )));
    console.log(uniquetags);
    uniquetags.forEach(tags => {
        tags = tags.trim().length ? tags : "No tags";
        console.log(tags);
        const option = document.createElement("option");
        option.value = tags === "No tags" ? "" : tags;
        option.textContent = tags;
        tagsFilter.appendChild(option);
    });
}

tagsFilter.addEventListener("change", () => {
    // Filter and display blogs based on the selected category
    filterbytag(blogsData);
});

function filterbytag(data) {

    const selectedtags = tagsFilter.value;

    // Filter blogs based on the selected category
    const filteredBlogs = data.filter(blog => {
        if (selectedtags === "All") {
            return true; // Show all blogs
        } else {
            return (blog.tags.trim().split(",") || []).includes(selectedtags);
        }
    });

    const blogPostList = document.getElementById('blog-post-list');
    blogPostList.innerHTML = '';

    
    if (filteredBlogs) {
        filteredBlogs.forEach(blogPost => {
            const blogPostDiv = document.createElement('div');
            blogPostDiv.classList.add('blog-post');
    
            let update = `
                    <a href="comments.html?Key=${blogPost.title}">
                    <h3>${blogPost.title}</h3>
                    </a>
                    <p>${blogPost.content}</p>
                    <p>Author: ${blogPost.author.username}</p>
                    <p>Created on: ${new Date(blogPost.creation_date).toLocaleDateString()}</p>
                    <p>Tags: ${blogPost.tags || 'N/A'}</p>
                `;
    
            if (blogPost.author.username === local) {
    
                update += `<button class="update-button" data-blogpost-id="${blogPost.id}">Update</button>
                    <button class="delete-button" data-blogpost-id="${blogPost.id}">Delete</button>`
            }
            blogPostDiv.innerHTML = update;
    
            // Append the blog post div to the container
            blogPostList.appendChild(blogPostDiv);
    
            const updateButton = blogPostDiv.querySelector('.update-button');
            if (updateButton != null) {
                updateButton.addEventListener('click', () => {
                    const postId = updateButton.getAttribute('data-blogpost-id');
    
                    fetch(`http://localhost:8000/blog/${postId}`)
                        .then(response => response.json())
                        .then(blogPostData => {
                            document.getElementById('update-title').value = blogPostData.title;
                            document.getElementById('update-content').value = blogPostData.content;
                            document.getElementById('update-tags').value = blogPostData.tags;
    
                            document.getElementById('update-form').style.display = 'block';
    
                            document.getElementById('update-save-button').addEventListener('click', () => {
                                const updatedData = {
                                    title: document.getElementById('update-title').value,
                                    content: document.getElementById('update-content').value,
                                    author: { username: sessionStorage.getItem("username") },
                                    tags: document.getElementById('update-tags').value
                                };
                                fetch(`http://localhost:8000/blog/${postId}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(updatedData)
                                })
                                    .then(response => response.json())
                                    .then(updatedBlogPost => {
                                        document.getElementById('update-form').style.display = 'none';
                                        // Optionally, you can update the blog post on the UI here.
                                    })
                                    .catch(error => {
                                        console.error('Update failed:', error);
                                    });
                            });
                        })
                        .catch(error => {
                            console.error('Error fetching blog post data:', error);
                        });
                });
    
                const deleteButton = blogPostDiv.querySelector('.delete-button');
                deleteButton.addEventListener('click', () => {
                    if (confirm("Want to delete?")) {
                        const postId = deleteButton.getAttribute('data-blogpost-id');
                        deleteBlogPost(postId);
                        blogPostDiv.remove();
                    }
                });
            }
        });
    }
}
