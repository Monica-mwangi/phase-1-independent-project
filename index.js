// index.js
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resultsDiv = document.getElementById('results');

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
        
    window.showCharacterDetails = function(characterId) {
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
        }else {
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
            resultsDiv.appendChild(resultItem);
        });
         }
    }

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

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = ''; // Clear previous results
        resultsDiv.appendChild(characterDetailsDiv);
    }

    const likeButton = document.getElementById("likeButton");

//likeButton.addEventListener("click", function() {
  //likeButton.classList.toggle("liked");
//});

    function toggleFavorite(characterName) {
        // Implement your logic for toggling favorites
        // You can use local storage to store favorites
        console.log('Toggling favorite for:', characterName);
    }

    function isFavorite(characterName) {
        // Implement your logic for checking favorites
        // You can use local storage to store favorites
        return false;
    }

    function addComment(characterId, comment) {
        // Implement your logic for adding comments
        // Make a POST request to the API endpoint for adding comments
        // Example: fetch(`https://thronesapi.com/api/v2/Characters/${characterId}/comments`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ comment })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     // Handle success or failure
        //     console.log('Comment added:', data);
        // })
        // .catch(error => console.error(error));

        console.log('Adding comment for character ID', characterId, ':', comment);
    }
});








  
  