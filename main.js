const alphabetContainer = document.getElementById('alphabet');
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
alphabet.split('').forEach(letter => {
    const letterElement = document.createElement('button');
    letterElement.className = 'button primary';
    letterElement.textContent = letter;
    letterElement.addEventListener('click', () => displayContactsByLetter(letter));
    alphabetContainer.appendChild(letterElement);
});

document.addEventListener("DOMContentLoaded", function() {
    displayContacts();
    document.getElementById("searchInput").addEventListener("input", searchContacts);
    document.getElementById("saveContactBtn").addEventListener("click", initForm);
    document.getElementById("deleteContactBtn").addEventListener("click", deleteContact);
    document.getElementById("deleteContactBtn").hidden = true;
});

async function initForm() {
    const lastId = getLastId()
    let contactId = document.getElementById("contactId").value ?
        document.getElementById("contactId").value : lastId;

    const contactData = {
        name: document.getElementById("contactName").value,
        surname: document.getElementById("contactSurname").value,
        company: document.getElementById("contactCompany").value,
        phone: document.getElementById("contactPhone").value,
        id: contactId
    };

    await saveContact(contactData);
}

function openSearch() {
    Metro.dialog.open('#searchDialog');
    searchContacts();
}

function searchContacts() {
    const input = document.getElementById("searchInput").value.toUpperCase();
    const contacts = getContacts();
    const filteredContacts = contacts.filter(contact =>
        contact.name.toUpperCase().includes(input) || contact.surname.toUpperCase().includes(input)
    );
    drawContacts(filteredContacts, 'searchResults');
}


function addContact(){
    const lastId = getLastId()
    document.getElementById("deleteContactBtn").hidden = true;
    document.getElementById('contactName').value = "";
    document.getElementById('contactSurname').value = "";
    document.getElementById('contactCompany').value = "";
    document.getElementById('contactPhone').value = "";
    document.getElementById('contactId').value = lastId;
    Metro.dialog.open('#contactDialog');
}

function deleteContact(){
    window.localStorage.removeItem(document.getElementById("contactId").value);
    displayContacts();
    searchContacts();
}

function editContact(contact){
    document.getElementById("deleteContactBtn").hidden = false;
    document.getElementById('contactName').value = contact.name;
    document.getElementById('contactSurname').value = contact.surname;
    document.getElementById('contactCompany').value = contact.company;
    document.getElementById('contactPhone').value = contact.phone;
    document.getElementById('contactId').value = contact.id;

    Metro.dialog.open('#contactDialog');
}

function saveContact(contactData) {
    const form = document.querySelector('#contactForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const lastId = getLastId();
    if (contactData.id == null){
        contactData.id = lastId;
    }
    localStorage.setItem(contactData.id.toString(), JSON.stringify(contactData));
    displayContacts();
    searchContacts();
    Metro.dialog.close('#contactDialog');
}

function getLastId() {
    let contacts = getContacts();
    let maxId = contacts.length > 0 ? contacts.reduce((max, contact) => contact.id > max ? contact.id : max, contacts[0].id) : 0;
    return ~~maxId + 1;
}

function getContacts() {
    const contacts = Object.keys(localStorage).reduce((acc, key) => {
        const contact = JSON.parse(localStorage.getItem(key));
        acc.push(contact);
        return acc;
    }, []);
    return contacts;
}

function ClearList(){
    const contactsContainer = document.getElementById('contacts');
    contactsContainer.innerHTML = ''; // Очистка текущего списка контактов

    localStorage.clear();
}

// display section
function displayContacts(){
    drawContacts(getContacts());
}

function getContactsByLetter(letter) {
    const contacts = Object.keys(localStorage).reduce((acc, key) => {
        const contact = JSON.parse(localStorage.getItem(key));
        if (contact.name.toUpperCase().startsWith(letter)) {
            acc.push(contact);
        }
        return acc;
    }, []);
    return contacts;
}

function displayContactsByLetter(letter){
    drawContacts(getContactsByLetter(letter));
}

function drawContacts(contacts, containerId = 'contacts') {
    const contactsContainer = document.getElementById(containerId);
    contactsContainer.innerHTML = '';
    contacts.forEach(contact => {
        const contactTile = document.createElement('div');
        contactTile.className = "contact-tile";
        contactTile.setAttribute('data-role', 'tile');
        contactTile.setAttribute('data-size', 'wide');

        const nameElement = document.createElement('div');
        nameElement.textContent = `Name: ${contact.name} ${contact.surname}`;
        contactTile.appendChild(nameElement);

        const phoneElement = document.createElement('div');
        phoneElement.textContent = `Phone number: ${contact.phone}`;
        contactTile.appendChild(phoneElement);

        const companyElement = document.createElement('div');
        companyElement.textContent = `Company: ${contact.company}`;
        contactTile.appendChild(companyElement);

        contactTile.addEventListener("click", ()=> editContact(contact));

        contactsContainer.appendChild(contactTile);
    });
}