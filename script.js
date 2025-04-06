
window.onload = function() {
    loadLinks();
    loadNotes();
    loadEvents();
    showSection('links');
};

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(`${sectionId}-section`).classList.remove('hidden');
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    document.getElementById('theme-btn').textContent = document.body.classList.contains('dark-theme') ? 'Tema Escuro' : 'Tema Claro';
}

// Busca Inteligente
function searchContent() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const sections = ['link-list', 'note-list', 'event-list'];
    sections.forEach(section => {
        const items = document.getElementById(section)?.getElementsByTagName('li') || [];
        for (let item of items) {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? '' : 'none';
        }
    });
}

// Links
function addLink() {
    const linkInput = document.getElementById('link-input').value;
    const tagInput = document.getElementById('tag-input').value || 'Sem tag';
    if (linkInput) {
        const linkList = document.getElementById('link-list');
        const li = document.createElement('li');
        li.innerHTML = `<span><a href="${linkInput}" target="_blank">${linkInput}</a> [${tagInput}]</span>
                        <div><button onclick="pinLink(this.parentElement.parentElement)">Fixar</button>
                        <button onclick="this.parentElement.parentElement.remove(); saveLinks();">Excluir</button></div>`;
        linkList.insertBefore(li, linkList.firstChild);
        saveLinks();
        document.getElementById('link-input').value = '';
        document.getElementById('tag-input').value = '';
    }
}

function pinLink(element) {
    const pinnedLinks = document.getElementById('pinned-links');
    const clone = element.cloneNode(true);
    clone.querySelector('button').textContent = 'Desfixar';
    clone.querySelector('button').onclick = () => { clone.remove(); savePinnedLinks(); };
    pinnedLinks.appendChild(clone);
    savePinnedLinks();
}

function saveLinks() {
    localStorage.setItem('links', document.getElementById('link-list').innerHTML);
}

function savePinnedLinks() {
    localStorage.setItem('pinned-links', document.getElementById('pinned-links').innerHTML);
}

function loadLinks() {
    document.getElementById('link-list').innerHTML = localStorage.getItem('links') || '';
    document.getElementById('pinned-links').innerHTML = localStorage.getItem('pinned-links') || '<h3>Fixados</h3>';
}

// Notas
function saveNote() {
    const title = document.getElementById('note-title').value;
    const noteInput = document.getElementById('note-input').value;
    const attachment = document.getElementById('note-attachment').files[0];
    const background = document.getElementById('note-background').value;
    if (noteInput) {
        const noteList = document.getElementById('note-list');
        const li = document.createElement('li');
        const timestamp = new Date().toLocaleString('pt-BR');
        let attachmentLink = '';
        if (attachment) {
            attachmentLink = `<a href="${URL.createObjectURL(attachment)}" target="_blank">Anexo</a>`;
        }
        li.style.backgroundColor = background;
        li.innerHTML = `<span><strong>${title || 'Sem Título'}</strong> - ${noteInput} (${timestamp}) ${attachmentLink}</span>
                        <div><button onclick="pinNote(this.parentElement.parentElement)">Fixar</button>
                        <button onclick="this.parentElement.parentElement.remove(); saveNotes();">Excluir</button></div>`;
        noteList.insertBefore(li, noteList.firstChild);
        saveNotes();
        clearNoteInputs();
    }
}

function pinNote(element) {
    const pinnedNotes = document.getElementById('pinned-notes');
    const clone = element.cloneNode(true);
    clone.querySelector('button').textContent = 'Desfixar';
    clone.querySelector('button').onclick = () => { clone.remove(); savePinnedNotes(); };
    pinnedNotes.appendChild(clone);
    savePinnedNotes();
}

function saveNotes() {
    localStorage.setItem('notes', document.getElementById('note-list').innerHTML);
}

function savePinnedNotes() {
    localStorage.setItem('pinned-notes', document.getElementById('pinned-notes').innerHTML);
}

function loadNotes() {
    const notesData = localStorage.getItem('notes');
    const pinnedNotesData = localStorage.getItem('pinned-notes');
    
    // Validação para evitar carregar dados inválidos
    const noteList = document.getElementById('note-list');
    const pinnedNotes = document.getElementById('pinned-notes');
    
    // Carrega notas apenas se for HTML válido, caso contrário limpa
    if (notesData && notesData.startsWith('<li')) {
        noteList.innerHTML = notesData;
    } else {
        noteList.innerHTML = '';
        localStorage.removeItem('notes'); // Remove dados corrompidos
    }

    // Carrega notas fixadas, com fallback para o padrão
    if (pinnedNotesData && pinnedNotesData.includes('<h3>Fixados</h3>')) {
        pinnedNotes.innerHTML = pinnedNotesData;
    } else {
        pinnedNotes.innerHTML = '<h3>Fixados</h3>';
        localStorage.removeItem('pinned-notes'); // Remove dados corrompidos
    }
}

function clearNoteInputs() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-input').value = '';
    document.getElementById('note-attachment').value = '';
    document.getElementById('note-background').value = '';
}

// Agenda
function addEvent() {
    const datetime = document.getElementById('event-datetime').value;
    const eventInput = document.getElementById('event-input').value;
    if (datetime && eventInput) {
        const eventList = document.getElementById('event-list');
        const li = document.createElement('li');
        const formattedDate = new Date(datetime).toLocaleString('pt-BR');
        li.innerHTML = `<span>${formattedDate}: ${eventInput}</span>
                        <button onclick="this.parentElement.remove(); saveEvents();">Excluir</button>`;
        eventList.insertBefore(li, eventList.firstChild);
        saveEvents();
        document.getElementById('event-datetime').value = '';
        document.getElementById('event-input').value = '';
    }
}

function saveEvents() {
    localStorage.setItem('events', document.getElementById('event-list').innerHTML);
}

function loadEvents() {
    document.getElementById('event-list').innerHTML = localStorage.getItem('events') || '';
}

// Exportação e Impressão
function exportSection(section) {
    const data = { [section]: localStorage.getItem(section) };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xpgnotes-${section}.json`;
    a.click();
}

function printSection(section) {
    const content = document.getElementById(`${section}-section`).innerHTML;
    const win = window.open('', '', 'width=800,height=600');
    win.document.write(`<html><head><title>XPGNotes - ${section}</title><link rel="stylesheet" href="style.css"></head><body class="${document.body.className}">${content}</body></html>`);
    win.document.close();
    win.print();
}

function showInstructions() {
    window.open('instructions.html', '_blank', 'width=600,height=400');
}
