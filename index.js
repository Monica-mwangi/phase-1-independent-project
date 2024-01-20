document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const dropDown = document.getElementById('searchDropdown');
    const searchButton = document.getElementById('search-button');
    const resultsDiv = document.getElementById('results');

    // Populate dropdown on page load
    fetch('https://thronesapi.com/api/v2/Characters')
        .then(response => response.json())
        .then(data => {
            const names = data.map(character => character.firstName);
            names.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                dropDown.appendChild(option);
            });
        })
        .catch(error => console.error(error));

    dropDown.addEventListener('change', () => {
        const selectedCharacter = dropDown.value;
        if (selectedCharacter) {
            searchInput.value = selectedCharacter;
        }
    });

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

        if (results.length === 0) {
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
                    <span id="likes-${result.id}" class="likes-count"></span>
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

                commentButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const comment = commentInput.value.trim();
                    if (comment !== '') {
                        addComment(result.id, comment);
                        fetch('http://localhost:3000/comments', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                characterId: result.id,
                                comment: commentInput.value,
                            }),
                        })
                            .then(res => res.json())
                            .then((data) => {
                                console.log(data);
                            })
                            .catch((err) => console.log(err));

                        const commentOutput = document.createElement('p');
                        commentOutput.textContent = commentInput.value;
                        commentSection.appendChild(commentOutput);

                        const deleteButton = createDeleteButton(result.id, commentOutput);
                        commentSection.appendChild(deleteButton);

                        console.log('comment added successfully');
                        commentInput.value = '';
                    } else {
                        alert('Please enter a comment');
                    }
                });

                commentSection.appendChild(commentButton);
                resultItem.appendChild(commentSection);
                resultsDiv.appendChild(resultItem);
            });
        }
    }

    function createDeleteButton(characterId, commentOutput) {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();

            fetch('http://localhost:3000/comments')
                .then(res => res.json())
                .then(comments => {
                    const comment = comments.find(c => c.characterId === characterId && c.comment === commentOutput.textContent);

                    if (comment) {
                        fetch(`http://localhost:3000/comments/${comment.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then(res => res.json())
                            .then(data => console.log(data))
                            .catch(err => console.log(err));

                        commentOutput.remove();
                        deleteButton.remove();
                    }
                });
        });

        return deleteButton;
    }

    function addComment(characterId, comment) {
        console.log('Adding comment for character ID', characterId, ':', comment);
        // Implement your logic for adding comments
    }

    window.showCharacterDetails = function(characterId) {
        fetch(`https://thronesapi.com/api/v2/Characters/${characterId}`)
            .then(response => response.json())
            .then(data => displayCharacterDetails(data))
            .catch(error => console.error(error));
    }

    function displayCharacterDetails(details) {
        const characterDetailsDiv = document.createElement('div');
        characterDetailsDiv.classList.add('character-details');

        characterDetailsDiv.innerHTML = `
            <h2>${details.fullName}</h2>
            <p>Title: ${details.title || 'No Title'}</p>
            <p>Family: ${details.family || 'Unknown'}</p>
        `;

        resultsDiv.innerHTML = ''; // Clear previous results
        resultsDiv.appendChild(characterDetailsDiv);
    }
});






























  
  