// index.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsDiv = document.getElementById('results');
    const selectDropdown = document.createElement('select');

    
    searchButton.addEventListener('click', searchCharacters);

    function searchCharacters() {
        const searchTerm = searchInput.value;

        fetch('https://thronesapi.com/api/v2/Characters')
            .then(response => response.json())
            .then(data => filterSearchResults(data, searchTerm))
            .catch(error => console.error(error));
    }
    

    function filterSearchResults(data, searchTerm) {
        const filteredResults = data.filter(character => character.firstName.toLowerCase().includes(searchTerm.toLowerCase()));
        displaySearchResults(filteredResults);
    }

    function displaySearchResults(results) {
        resultsDiv.innerHTML = '';

        window.showCharacterDetails = function (characterId) {
            fetch(`https://thronesapi.com/api/v2/Characters/${characterId}`)
                .then(response => response.json())
                .then(data => displayCharacterDetails(data))
                .catch(error => console.error(error));
        }

        if (results.length === 0) {
            // Handle case when no results are found
            const noResultsMessage = document.createElement('p');
            noResultsMessage.textContent = 'No results found.';
            resultsDiv.appendChild(noResultsMessage);
        } else {
            results.forEach(result => {

                const resultItem = document.createElement('div');
                resultItem.classList.add('result-item');

                resultItem.innerHTML = `
                    <h3>${result.fullName}</h3>
                    <img id="character-image-${result.id}" src="${result.imageUrl}" alt="${result.fullName}">
                    <p>${result.title || 'No Title'}</p>
                    <button onclick="showCharacterDetails(${result.id})">Details</button>
                `;
                
             

                const commentSection = document.createElement('div');
                commentSection.classList.add('comment-section');

                const commentInput = document.createElement('input');
                commentInput.classList.add('comment-input');
                commentInput.type = 'text';
                commentInput.placeholder = 'Leave a comment...';
                commentSection.appendChild(commentInput);

                const commentButton = document.createElement('button');
                commentButton.classList.add('comment-button');
                commentButton.textContent = 'Submit';
                commentButton.addEventListener('click', () => {
                    const comment = commentInput.value.trim();
                    if (comment !== '') {
                        addComment(result.id, comment);
                        console.log('comment added successfully');
                        commentInput.value = '';
                    }
                });
                commentSection.appendChild(commentButton);

                resultItem.appendChild(commentSection);

                // Add delete button for each comment
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    // Assuming addComment function returns a unique identifier for the comment
                    const commentId = addComment(result.id, commentInput.value.trim());
                    deleteComment(result.id, commentId);
                    console.log('comment deleted successfully');
                    commentInput.value = '';
                });
                commentSection.appendChild(deleteButton);

                resultsDiv.appendChild(resultItem);
            });
        }
    }
    function likeCharacter(characterId) {
        // Assuming you have an API endpoint to handle like functionality
        fetch(`https://thronesapi.com/api/v2/Characters/${characterId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(`Liked character ${characterId}. New votes: ${data.votes}`);
                // Update UI or perform other actions based on the liked character

            })
            .catch(error => console.error(error));
    }
 const inputCharacter = document.getElementById('search-input');
 likeButton.addEventListener('click',() => {
    const characterId = inputCharacter.value;
    likeCharacter(characterId);
 });


    function displayCharacterDetails(details) {
        const characterDetailsDiv = document.createElement('div');
        characterDetailsDiv.classList.add('character-details');

        characterDetailsDiv.innerHTML = `
            <h2>${details.fullName}</h2>
            <p>Title: ${details.title || 'No Title'}</p>
            <p>Family: ${details.family || 'Unknown'}</p>
        `;

        const characterImage = document.getElementById(`character-image-${details.id}`);
        characterImage.insertAdjacentElement('afterend', characterDetailsDiv);

        resultsDiv.innerHTML = ''; // Clear previous results
        resultsDiv.appendChild(characterDetailsDiv);
    }

    function addComment(characterId, comment) {
        console.log('Adding comment for character ID', characterId, ':', comment);
       //  Implement your logic for adding comments
        // Return a unique identifier for the comment (assuming)
      //  return new Date().getTime(); // Example: Using timestamp as a comment identifier
    }

    function deleteComment(characterId, commentId) {
        console.log('Deleting comment for character ID', characterId, ', Comment ID:', commentId);
        // Implement your logic for deleting comments
        // Example: Make a DELETE request to the API endpoint for deleting comments
      //  const deleteCommentEndpoint = (`https://thronesapi.com/api/v2/Characters/{characterId}/comments/{commentId}`);

       // fetch(deleteCommentEndpoint, {
           //  method: 'DELETE',
         //})
         //.then(response => {
            // if (response.ok) {
              //   console.log('Comment deleted successfully');
            // } else {
              //  console.error('Failed to delete comment');
           // }
        // })
        // .catch(error => console.error(error));
    }
});









  
  