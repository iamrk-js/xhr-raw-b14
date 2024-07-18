const cl = console.log;
const postsContainer = document.getElementById('postsContainer');
const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const userIdControl = document.getElementById('userId');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const loader = document.getElementById('loader');
// api_url  ?? API_BUS

const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`; // this url will be used for GET and POST methods
// const EDIT_URL = `${BASE_URL}/posts/:editid` >>  here editid is params
let postsArr = [];
const templating = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += `
            <div class="col-md-4 mb-3">
                <div class="card postCard h-100" id="${post.id}">
                    <div class="card-header">
                        <h3 class="m-0">
                           ${post.title} 
                        </h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">
                           ${post.body}
                        </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                        <button onclick="onDelete(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                    </div>
                </div>
            </div>
                `
    });

    postsContainer.innerHTML = result;
}

const fetchPosts = () => {
    // API call Start >> Loder Show
    loader.classList.remove('d-none')
    // 1 create xhr object

    let xhr = new XMLHttpRequest()  /// object
    // 2 configration 
    // xhr.open(METHOD_NAME, API_URL)
    xhr.open("GET", POST_URL, true);
    // 4 after getting response
    xhr.onload = function () {
        cl(xhr.status);
        if (xhr.status >= 200 && xhr.status < 300) {
            // API call success
            postsArr = JSON.parse(xhr.response)
            cl(postsArr)  // tempalting
            templating(postsArr)
        }

        // here we get resplose (success or error) >> Loder Hide
        loader.classList.add('d-none')
    }
    // 3 
    xhr.send(null);
}

fetchPosts();

const onEdit = (ele) => {
    let editId = ele.closest('.card').id;
    localStorage.setItem("editId", editId);
    let EDIT_URL = `${BASE_URL}/posts/${editId}`;
    // API call >> loader show
    loader.classList.remove('d-none');

    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL);
    xhr.onload = function () {
        setTimeout(() => {
            if (xhr.status >= 200 && xhr.status < 300) {
                cl(xhr.response)
                let post = JSON.parse(xhr.response);
                titleControl.value = post.title;
                contentControl.value = post.body;
                userIdControl.value = post.userId;
                updateBtn.classList.remove('d-none');
                submitBtn.classList.add('d-none');
            }

            // here we get response (success or error) >> Loader Hide
            loader.classList.add('d-none')
        }, 500);
    }
    xhr.send()
}

const onDelete = (ele) => {
    let removeId = ele.closest('.card').id;
    // removeUrl = `${baseUrl}/posts/${removeId}`
    let REMOVE_URL = `${BASE_URL}/posts/${removeId}`;

    // let getConfirm = confirm()
    // loader show
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();

    xhr.open('DELETE', REMOVE_URL);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            ele.closest('.col-md-4').remove()
        }


        loader.classList.add('d-none')
    }

    xhr.send()

}

const onPostUpdate = () => {
    // updated Obj
    let updatedObj = {
        title: titleControl.value,
        body: contentControl.value.trim(),
        userId: userIdControl.value,
    }
    cl(updatedObj)
    let updateId = localStorage.getItem('editId');


    // API_URL >> updateId
    // ${baseUrl}/posts/:updateId
    let UPDATE_URL = `${BASE_URL}/posts/${updateId}`;
    // API call to update POST on DB >> Loader Show
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", UPDATE_URL);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            cl(xhr.response)
            let card = [...document.getElementById(updateId).children];
            cl(card)
            card[0].innerHTML = `<h3 class="m-0">${updatedObj.title}</h3>`;
            card[1].innerHTML = `<p class="m-0">${updatedObj.body}</p>`;
            postForm.reset();
            updateBtn.classList.add('d-none')
            submitBtn.classList.remove('d-none')
        }

        // get response >> Loder Hide
        loader.classList.add('d-none')
    }

    xhr.send(JSON.stringify(updatedObj));
}


const onPostSubmit = (eve) => {
    eve.preventDefault();
    // get new Post Object from form
    let newPost = {
        title: titleControl.value,
        body: contentControl.value.trim(),
        userId: userIdControl.value,
    }
    cl(newPost);
    postForm.reset();
    // API call start >> Loader Show
    loader.classList.remove('d-none')
    // 1 XMLHttprequest ka instance

    let xhr = new XMLHttpRequest();

    xhr.open("POST", POST_URL);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            cl(xhr.response)
            newPost.id = JSON.parse(xhr.response).id;
            // postsArr.unshift(newPost);
            // templating(postsArr)

            let div = document.createElement('div');
            div.className = 'col-md-4 mb-3';
            div.innerHTML = `
                            <div class="card postCard h-100" id="${newPost.id}">
                                <div class="card-header">
                                    <h3 class="m-0">
                                    ${newPost.title} 
                                    </h3>
                                </div>
                                <div class="card-body">
                                    <p class="m-0">
                                    ${newPost.body}
                                    </p>
                                </div>
                                 <div class="card-footer d-flex justify-content-between">
                                    <button onclick="onEdit(this)" class="btn btn-outline-primary btn-sm">Edit</button>
                                    <button onclick="onDelete(this)" class="btn btn-outline-danger btn-sm">Remove</button>
                                </div>
                            </div>
                            `
            postsContainer.prepend(div)

        }

        // here we get response >> Loader Hide
        loader.classList.add('d-none')
    }

    xhr.send(JSON.stringify(newPost))

}

postForm.addEventListener('submit', onPostSubmit);
updateBtn.addEventListener('click', onPostUpdate)
// xhr.status >> 200 to 299  success
// GET success >> 200 >>>> POST Success 201
// xhr.status  >> 400 to 499  client side error  (End end)
// xhr.status  >> 500 to 599  server side error (Back end)