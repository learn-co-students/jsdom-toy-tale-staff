
function toggleFormVisibility() {
  // hide & seek with the form
  addToy = !addToy
  const toyFormContainer = document.querySelector('.container');
  if (addToy) {
    toyFormContainer.style.display = 'block'
  } else {
    toyFormContainer.style.display = 'none'
  }
}

function resetForm() {
  const toyForm = document.querySelector('.add-toy-form');
  toyForm.reset();
}

function handleFormSubmit(event) {
  event.preventDefault();
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    })
  }).then( (response) => {
    return response.json();
  }).then( (json) => {
    const toyCollection = document.querySelector('#toy-collection');
    const toyCard = addToyCard(json);
    toyCollection.appendChild(toyCard);
    resetForm();
    toggleFormVisibility();
  })
}

function increaseLikeCount(event) {
  const likeButton = event.target;
  const card = likeButton.parentElement;
  const id = card.getAttribute("toyId");
  const likesElement = card.querySelector('p');
  const likeCountSpan = likesElement.querySelector('#like-count');
  const likes = parseInt(likeCountSpan.innerHTML);

  fetch(`http://localhost:3000/toys/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": likes + 1
    })
  }).then( (response) => {
    return response.json();
  }).then( (json) => {
    updateLikeCount(json["id"], json["likes"]);
  })
}

function updateLikeCount(toyId, likeCount) {
  const card = document.querySelector(`[toyId='${toyId}']`);
  const likeCountSpan = card.querySelector('#like-count');
  likeCountSpan.innerHTML = likeCount;
}

function addToyCard(toyData) {
  const toyCard = document.createElement('div');
  toyCard.className = "card";
  toyCard.setAttribute("toyId", toyData["id"]);

  const toyHeading = document.createElement('h2');
  toyHeading.innerHTML = toyData["name"];
  toyCard.appendChild(toyHeading);

  const toyImage = document.createElement('img');
  toyImage.src = toyData["image"];
  toyImage.className = "toy-avatar";
  toyCard.appendChild(toyImage);

  const toyLikes = document.createElement('p');
  const likeCountSpan = document.createElement('span');
  const likeTextSpan = document.createElement('span');
  likeCountSpan.innerHTML = toyData["likes"];
  likeCountSpan.id = "like-count";
  likeTextSpan.innerHTML = " Likes ";
  toyLikes.appendChild(likeCountSpan);
  toyLikes.appendChild(likeTextSpan);
  toyCard.appendChild(toyLikes);

  const toyLikeButton = document.createElement('button');
  toyLikeButton.className = "like-btn";
  toyLikeButton.innerHTML = "Like <3";
  toyLikeButton.addEventListener("click", increaseLikeCount);
  toyCard.appendChild(toyLikeButton);

  return toyCard;
}

document.addEventListener("DOMContentLoaded", () => {
  // global to handle toggling form
  addToy = false;
  const addBtn = document.querySelector('#new-toy-btn');
  addBtn.addEventListener('click', toggleFormVisibility);

  const toyForm = document.querySelector('.add-toy-form');
  toyForm.addEventListener("submit", handleFormSubmit);

  fetch("http://localhost:3000/toys")
  .then( (response) => {
    return response.json();
  })
  .then( (json) => {
    const toyCollection = document.querySelector('#toy-collection');
    for (const toyData of json) {
      const toyCard = addToyCard(toyData);
      toyCollection.appendChild(toyCard);
    }
  });

});
