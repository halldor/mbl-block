blogs = {}
try {
    blog_elements = document.getElementsByClassName("newsblog")[0].getElementsByClassName("more");
} catch (err) {
    blog_elements = [];
}

for(var i = 0; i < blog_elements.length; i++) {
    var username, url=blog_elements[i].getElementsByTagName('a')[0].href;
    try {
        username = url.match(/http\:\/\/([^.]*)/)[1];
    } catch(err) {
        continue;
    }
    blogs[username] = {
        element: blog_elements[i]
    }
    chrome.extension.sendRequest({username: username}, function(response) {
        if(response.blocked) {
            hideBlog(username);
        }
    });
}

function hideBlog(username) {
    var blog = blogs[username].element;
    blog.parentElement.removeChild(blog);
}

function showBlog(username) {
    if(username in blogs) {
        var list = document.getElementsByClassName("newsblog")[0].getElementsByTagName("ul")[0];
        list.appendChild(blogs[username].element);
    }
}

function showOrHide(request, sender, sendResponse) {
    if(request.blocked) {
        for(var username in request.blocked) {
            hideBlog(username);
        }
    } else if(request.unblocked) {
        for(var username in request.unblocked) {
            showBlog(username);
        }
    }
    sendResponse();
}

chrome.extensions.onRequest.addListener(showOrHide);
