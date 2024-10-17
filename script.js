
const apiUrl = 'http://localhost:3000/contacts'; // Ensure this matches your server
let contacts = [];
let editIndex = -1;

// Fetch contacts from the server
async function fetchContacts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
    }
}

// Add a new contact
async function addContact(contact) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        if (response.ok) {
            const newContact = await response.json();
            contacts.push(newContact);
            displayContacts(contacts);
        } else {
            throw new Error('Failed to add contact');
        }
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}

// Edit a contact
async function editContact(index) {
    const contact = contacts[index];
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email;
    document.getElementById('birthday').value = contact.birthday;
    document.getElementById('notes').value = contact.notes;
    document.getElementById('favorite').checked = contact.favorite;
    document.getElementById('social-media').value = contact.socialMedia;

    editIndex = index;
    document.querySelector('button[type="submit"]').textContent = 'Update Contact'; // Change button text
}

// Update a contact
async function updateContact(index) {
    const contact = contacts[index];
    try {
        const response = await fetch(`${apiUrl}/${contact.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        if (response.ok) {
            contacts[index] = await response.json();
            displayContacts(contacts);
        } else {
            throw new Error('Failed to update contact');
        }
    } catch (error) {
        console.error('Error updating contact:', error);
    }
}

// Delete a contact
async function deleteContact(index) {
    const contact = contacts[index];
    try {
        const response = await fetch(`${apiUrl}/${contact.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            contacts.splice(index, 1);
            displayContacts(contacts);
        } else {
            throw new Error('Failed to delete contact');
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

// Display contacts
function displayContacts(contactsToDisplay) {
    const contactList = document.getElementById('contact-list');
    contactList.innerHTML = '';

    contactsToDisplay.forEach((contact, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${contact.name}</strong> - ${contact.phone}<br>
            <small>Email: ${contact.email}</small><br>
            <small>Birthday: ${contact.birthday}</small><br>
            ${contact.profilePic ? `<img src="${contact.profilePic}" alt="${contact.name}'s profile picture" width="50">` : ''}
            <p>${contact.notes}</p>
            ${contact.favorite ? '<strong>⭐ Favorite</strong>' : ''}
            <p>Social Media: ${contact.socialMedia}</p>
            <button onclick="editContact(${index})">Edit</button>
            <button onclick="deleteContact(${index})">Delete</button>
            <hr>
        `;
        contactList.appendChild(li);
    });
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const birthday = document.getElementById('birthday').value;
    const profilePic = document.getElementById('profile-pic').files[0];
    const notes = document.getElementById('notes').value;
    const favorite = document.getElementById('favorite').checked;
    const socialMedia = document.getElementById('social-media').value;

    const newContact = {
        name,
        phone,
        email,
        birthday,
        profilePic: profilePic ? URL.createObjectURL(profilePic) : null,
        notes,
        favorite,
        socialMedia
    };

    if (editIndex >= 0) {
        updateContact(editIndex); // Call update function
    } else {
        addContact(newContact); // Call add function
    }

    document.getElementById('contact-form').reset();
}

// Call fetchContacts on page load
fetchContacts();
