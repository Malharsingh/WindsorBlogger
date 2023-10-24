// JavaScript code in home.js

local = sessionStorage.getItem("username");

if(local == null){
    window.location.replace("http://localhost:7000/index.html")
}

document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display existing blog posts
    fetch('http://localhost:8000/blog')
        .then(response => response.json())
        .then(data => {
            const blogPostList = document.getElementById('blog-post-list');

            data.forEach(blogPost => {
                const blogPostDiv = document.createElement('div');
                blogPostDiv.classList.add('blog-post');

                blogPostDiv.innerHTML = `
                    <a href="comments.html?Key=${blogPost.title}">
                    <h3>${blogPost.title}</h3>
                    </a>
                    <p>${blogPost.content}</p>
                    <p>Author: ${blogPost.author.username}</p>
                    <p>Created on: ${new Date(blogPost.creation_date).toLocaleDateString()}</p>
                    <p>Tags: ${blogPost.tags || 'N/A'}</p>

                    <button class="update-button" data-blogpost-id="${blogPost.id}">Update</button>
                    <button class="delete-button" data-blogpost-id="${blogPost.id}">Delete</button>
                `;

                // Append the blog post div to the container
                blogPostList.appendChild(blogPostDiv);

                const updateButton = blogPostDiv.querySelector('.update-button');
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
                    const postId = deleteButton.getAttribute('data-blogpost-id');
                    deleteBlogPost(postId);
                    blogPostDiv.remove();
                });
            });
        })
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
