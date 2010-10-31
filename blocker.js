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
    };
    (function(username) {
		chrome.extension.sendRequest({username: username}, function(response) {
			if(response.blocked) {
				hideBlog(username);
			}
		});
	})(username);
}

function hideBlog(username) {
    var blog = blogs[username].element,
		name = blog.getElementsByTagName('div')[0],
		anchor = blog.getElementsByTagName('a')[0];
	name.style.color = '#eee';
	anchor.style.color = '#ddd';
	anchor.onclick = function() {
		// TODO(halldor): subtle notification that this blog might be aweful
		return false;
	}
}

function showBlog(username) {
    if(username in blogs) {
		var blog = blogs[username].element,
			name = blog.getElementsByTagName('div')[0],
			anchor = blog.getElementsByTagName('a')[0];
		name.style.color = '';
		anchor.style.color = '';
		anchor.onclick = null;
    }
}

function showOrHide(request, sender, sendResponse) {
    if(request.blocked) {
        for(var idx in request.blocked) {
            hideBlog(request.blocked[idx]);
        }
    } else if(request.unblocked) {
        for(var idx in request.unblocked) {
            showBlog(request.unblocked[idx]);
        }
    }
    sendResponse();
}

chrome.extension.onRequest.addListener(showOrHide);
