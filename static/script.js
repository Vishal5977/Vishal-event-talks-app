document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const spinner = document.getElementById('spinner');
    const btnText = refreshBtn.querySelector('.btn-text');
    const notesContainer = document.getElementById('notes-container');
    const errorMessage = document.getElementById('error-message');

    // Modal elements
    const tweetModal = document.getElementById('tweet-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelTweetBtn = document.getElementById('cancel-tweet-btn');
    const sendTweetBtn = document.getElementById('send-tweet-btn');
    const tweetTextarea = document.getElementById('tweet-textarea');
    const charCount = document.getElementById('char-count');
    const previewTitle = document.getElementById('preview-title');

    // Initial load
    fetchNotes();

    refreshBtn.addEventListener('click', fetchNotes);

    async function fetchNotes() {
        // UI Loading state
        spinner.classList.remove('hidden');
        btnText.textContent = 'Refreshing...';
        refreshBtn.disabled = true;
        errorMessage.classList.add('hidden');

        try {
            const response = await fetch('/api/notes');
            const data = await response.json();

            if (data.status === 'success') {
                renderNotes(data.notes);
            } else {
                showError(data.message || 'Failed to fetch notes.');
            }
        } catch (error) {
            showError('Network error occurred while fetching notes.');
            console.error(error);
        } finally {
            // UI Reset state
            spinner.classList.add('hidden');
            btnText.textContent = 'Refresh';
            refreshBtn.disabled = false;
        }
    }

    function renderNotes(notes) {
        notesContainer.innerHTML = '';
        
        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>No release notes found.</p>';
            return;
        }

        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const dateStr = new Date(note.published).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            card.innerHTML = `
                <div class="note-header">
                    <div>
                        <h2 class="note-title"><a href="${note.link}" target="_blank">${note.title}</a></h2>
                        <p class="note-date">${dateStr}</p>
                    </div>
                    <button class="tweet-btn" data-title="${encodeURIComponent(note.title)}" data-link="${encodeURIComponent(note.link)}">
                        <svg style="width:16px;height:16px;margin-right:6px;" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                        Tweet
                    </button>
                </div>
                <div class="note-summary">${note.summary}</div>
            `;
            
            notesContainer.appendChild(card);
        });
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    // Modal Events
    notesContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.tweet-btn');
        if (btn) {
            const title = decodeURIComponent(btn.getAttribute('data-title'));
            const link = decodeURIComponent(btn.getAttribute('data-link'));
            openTweetModal(title, link);
        }
    });

    function openTweetModal(title, link) {
        // We include the link in the tweet text. Twitter shortens links to 23 chars.
        const initialText = `Check out this BigQuery update: ${title}\n\n${link}`;
        tweetTextarea.value = initialText;
        previewTitle.textContent = title;
        updateCharCount();
        tweetModal.classList.remove('hidden');
        tweetTextarea.focus();
    }

    function closeTweetModal() {
        tweetModal.classList.add('hidden');
    }

    function updateCharCount() {
        // Twitter typically counts links as 23 characters regardless of length, 
        // but for simplicity we'll just do a strict 280 string length here.
        const remaining = 280 - tweetTextarea.value.length;
        charCount.textContent = `${remaining} characters remaining`;
        charCount.style.color = remaining < 0 ? '#ef4444' : '#94a3b8';
        sendTweetBtn.disabled = remaining < 0 || tweetTextarea.value.trim() === '';
    }

    tweetTextarea.addEventListener('input', updateCharCount);
    closeModalBtn.addEventListener('click', closeTweetModal);
    cancelTweetBtn.addEventListener('click', closeTweetModal);
    
    sendTweetBtn.addEventListener('click', () => {
        const text = encodeURIComponent(tweetTextarea.value);
        const tweetUrl = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(tweetUrl, '_blank');
        closeTweetModal();
    });

    // Close modal on outside click
    tweetModal.addEventListener('click', (e) => {
        if (e.target === tweetModal) {
            closeTweetModal();
        }
    });
});
