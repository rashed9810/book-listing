
document.addEventListener('DOMContentLoaded', () => {
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const fontUploadForm = document.getElementById('font-upload-form');
  const fontNameInput = document.getElementById('font-name');
  const fontFileInput = document.getElementById('font-file');
  const fontStyleSelect = document.getElementById('font-style');
  const fontCategorySelect = document.getElementById('font-category');
  const fontPreview = document.getElementById('font-preview');
  const fontSearch = document.getElementById('font-search');
  const categoryFilter = document.getElementById('category-filter');
  const fontsContainer = document.getElementById('fonts-container');
  const emptyFonts = document.getElementById('empty-fonts');
  const createGroupForm = document.getElementById('create-group-form');
  const groupNameInput = document.getElementById('group-name');
  const groupDescriptionInput = document.getElementById('group-description');
  const fontSelection = document.getElementById('font-selection');
  const emptyFontSelection = document.getElementById('empty-font-selection');
  const groupsContainer = document.getElementById('groups-container');
  const emptyGroups = document.getElementById('empty-groups');

  
  let fonts = [];
  let fontGroups = [];
  let selectedFontFile = null;
  let previewFontFamily = '';

  
  init();

  
  function init() {
    loadFonts();
    loadFontGroups();

   
    setupEventListeners();

    
    renderFontList();
    renderFontSelection();
    renderFontGroups();
  }

  
  function setupEventListeners() {
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

   
    fontUploadForm.addEventListener('submit', handleFontUpload);

    
    fontFileInput.addEventListener('change', handleFontFileChange);

    
    fontNameInput.addEventListener('input', updateFontPreview);
    fontStyleSelect.addEventListener('change', updateFontPreview);

    
    fontSearch.addEventListener('input', filterFonts);

    
    categoryFilter.addEventListener('change', filterFonts);

    
    createGroupForm.addEventListener('submit', handleCreateGroup);
  }

  /**
   * Switch between tabs
   * @param {string} tabId - ID of the tab to switch to
   */
  function switchTab(tabId) {
   
    tabButtons.forEach(button => {
      if (button.getAttribute('data-tab') === tabId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });

   
    tabPanes.forEach(pane => {
      if (pane.id === `${tabId}-tab`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });
  }

  /**
   * Handle font file input change
   * @param {Event} e - Event object
   */
  function handleFontFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    
    const placeholder = e.target.parentElement.querySelector('.file-input-placeholder span');
    placeholder.textContent = file.name;

    
    selectedFontFile = file;

   
    const fontUrl = URL.createObjectURL(file);

    
    previewFontFamily = `preview-font-${Date.now()}`;

    
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: "${previewFontFamily}";
        src: url("${fontUrl}") format("truetype");
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);

   
    updateFontPreview();
  }

  
  function updateFontPreview() {
    if (!previewFontFamily) return;

    const fontName = fontNameInput.value || 'Preview Font';
    const fontStyle = fontStyleSelect.value;

    
    let fontWeight = 'normal';
    let fontStyleValue = 'normal';

    if (fontStyle === 'bold' || fontStyle === 'bold-italic') {
      fontWeight = 'bold';
    }

    if (fontStyle === 'italic' || fontStyle === 'bold-italic') {
      fontStyleValue = 'italic';
    }

    
    fontPreview.style.fontFamily = `"${previewFontFamily}", sans-serif`;
    fontPreview.style.fontWeight = fontWeight;
    fontPreview.style.fontStyle = fontStyleValue;
  }

  /**
   * Handle font upload form submission
   * @param {Event} e - Event object
   */
  function handleFontUpload(e) {
    e.preventDefault();

    if (!selectedFontFile) {
      alert('Please select a font file');
      return;
    }

    const fontName = fontNameInput.value.trim();
    const fontStyle = fontStyleSelect.value;
    const fontCategory = fontCategorySelect.value;

    if (!fontName) {
      alert('Please enter a font name');
      return;
    }

    
    const reader = new FileReader();
    reader.onload = function(event) {
      const fontDataUrl = event.target.result;

      
      const newFont = {
        id: Date.now().toString(),
        name: fontName,
        dataUrl: fontDataUrl,
        style: fontStyle,
        category: fontCategory,
        fileName: selectedFontFile.name,
        dateAdded: new Date().toISOString()
      };

      
      fonts.push(newFont);

     
      saveFonts();

      
      fontUploadForm.reset();
      selectedFontFile = null;
      previewFontFamily = '';
      fontPreview.style.fontFamily = '';
      fontPreview.style.fontWeight = 'normal';
      fontPreview.style.fontStyle = 'normal';

      
      renderFontList();
      renderFontSelection();

      
      showNotification('Font uploaded successfully!');

      
      switchTab('list');
    };

    reader.readAsDataURL(selectedFontFile);
  }

 
  function loadFonts() {
    const storedFonts = localStorage.getItem('fonts');
    fonts = storedFonts ? JSON.parse(storedFonts) : [];
  }

 
  function saveFonts() {
    localStorage.setItem('fonts', JSON.stringify(fonts));
  }

  
  function loadFontGroups() {
    const storedGroups = localStorage.getItem('fontGroups');
    fontGroups = storedGroups ? JSON.parse(storedGroups) : [];
  }

  
  function saveFontGroups() {
    localStorage.setItem('fontGroups', JSON.stringify(fontGroups));
  }

  
  function renderFontList() {
    
    const searchTerm = fontSearch.value.toLowerCase();
    const categoryValue = categoryFilter.value;
    
    const filteredFonts = fonts.filter(font => {
      const matchesSearch = font.name.toLowerCase().includes(searchTerm);
      const matchesCategory = !categoryValue || font.category === categoryValue;
      return matchesSearch && matchesCategory;
    });

   
    fontsContainer.innerHTML = '';

    
    if (filteredFonts.length === 0) {
      if (fonts.length === 0) {
        fontsContainer.appendChild(emptyFonts);
      } else {
        const noResults = document.createElement('div');
        noResults.className = 'empty-state';
        noResults.innerHTML = `
          <i class="fas fa-search empty-icon"></i>
          <h3>No fonts found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        `;
        fontsContainer.appendChild(noResults);
      }
      return;
    }

    
    filteredFonts.forEach(font => {
      const fontCard = createFontCard(font);
      fontsContainer.appendChild(fontCard);
    });

    
    loadFontStyles();
  }

  /**
   * Create a font card element
   * @param {Object} font - Font object
   * @returns {HTMLElement} - Font card element
   */
  function createFontCard(font) {
    const card = document.createElement('div');
    card.className = 'font-card';
    card.dataset.id = font.id;

   
    let fontWeight = 'normal';
    let fontStyle = 'normal';

    if (font.style === 'bold' || font.style === 'bold-italic') {
      fontWeight = 'bold';
    }

    if (font.style === 'italic' || font.style === 'bold-italic') {
      fontStyle = 'italic';
    }

    card.innerHTML = `
      <div class="font-card-header">
        <h3 class="font-name">${font.name}</h3>
        <div class="font-actions">
          <button class="font-action-btn delete-font" title="Delete Font">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="font-card-body">
        <p class="font-sample" style="font-family: 'font-${font.id}'; font-weight: ${fontWeight}; font-style: ${fontStyle};">
          The quick brown fox jumps over the lazy dog.
        </p>
        <div class="font-meta">
          <span class="font-meta-item">${font.style}</span>
          <span class="font-meta-item">${font.category}</span>
          <span class="font-meta-item">${font.fileName}</span>
        </div>
      </div>
    `;

    
    const deleteBtn = card.querySelector('.delete-font');
    deleteBtn.addEventListener('click', () => {
      deleteFont(font.id);
    });

    return card;
  }

  
  function loadFontStyles() {
    
    const existingStyles = document.querySelectorAll('style[data-font-id]');
    existingStyles.forEach(style => style.remove());

    
    fonts.forEach(font => {
      const style = document.createElement('style');
      style.setAttribute('data-font-id', font.id);
      style.textContent = `
        @font-face {
          font-family: 'font-${font.id}';
          src: url("${font.dataUrl}") format("truetype");
          font-weight: normal;
          font-style: normal;
        }
      `;
      document.head.appendChild(style);
    });
  }

  /**
   * Delete a font
   * @param {string} fontId - ID of the font to delete
   */
  function deleteFont(fontId) {
    if (!confirm('Are you sure you want to delete this font?')) {
      return;
    }

    
    fonts = fonts.filter(font => font.id !== fontId);

    
    fontGroups.forEach(group => {
      group.fonts = group.fonts.filter(id => id !== fontId);
    });

    saveFonts();
    saveFontGroups();

    
    renderFontList();
    renderFontSelection();
    renderFontGroups();

    
    showNotification('Font deleted successfully');
  }
  function filterFonts() {
    renderFontList();
  }

  
  function renderFontSelection() {
    
    fontSelection.innerHTML = '';

    
    if (fonts.length === 0) {
      fontSelection.appendChild(emptyFontSelection);
      return;
    }

    
    fonts.forEach(font => {
      const checkbox = document.createElement('div');
      checkbox.className = 'font-checkbox';
      checkbox.innerHTML = `
        <input type="checkbox" id="font-${font.id}" name="selectedFonts" value="${font.id}">
        <label for="font-${font.id}">${font.name} (${font.style}, ${font.category})</label>
      `;
      fontSelection.appendChild(checkbox);
    });
  }

  /**
   * Handle create group form submission
   * @param {Event} e - Event object
   */
  function handleCreateGroup(e) {
    e.preventDefault();

    const groupName = groupNameInput.value.trim();
    const groupDescription = groupDescriptionInput.value.trim();
    
    if (!groupName) {
      alert('Please enter a group name');
      return;
    }

    
    const selectedFonts = Array.from(
      document.querySelectorAll('input[name="selectedFonts"]:checked')
    ).map(checkbox => checkbox.value);

    if (selectedFonts.length === 0) {
      alert('Please select at least one font');
      return;
    }

    
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDescription,
      fonts: selectedFonts,
      dateCreated: new Date().toISOString()
    };

    
    fontGroups.push(newGroup);

    
    saveFontGroups();

    
    createGroupForm.reset();

    
    renderFontGroups();

    
    showNotification('Font group created successfully!');
  }

  
  function renderFontGroups() {
    
    groupsContainer.innerHTML = '';

    
    if (fontGroups.length === 0) {
      groupsContainer.appendChild(emptyGroups);
      return;
    }

    
    fontGroups.forEach(group => {
      const groupCard = createGroupCard(group);
      groupsContainer.appendChild(groupCard);
    });
  }

  /**
   * Create a group card element
   * @param {Object} group - Group object
   * @returns {HTMLElement} - Group card element
   */
  function createGroupCard(group) {
    const card = document.createElement('div');
    card.className = 'group-card';
    card.dataset.id = group.id;

    
    const groupFonts = group.fonts.map(fontId => {
      const font = fonts.find(f => f.id === fontId);
      return font ? font.name : 'Unknown Font';
    });

    card.innerHTML = `
      <div class="group-card-header">
        <h3 class="group-name">${group.name}</h3>
        <div class="group-actions">
          <button class="group-action-btn delete-group" title="Delete Group">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="group-card-body">
        ${group.description ? `<p class="group-description">${group.description}</p>` : ''}
        <div class="group-fonts">
          ${groupFonts.map(fontName => `<span class="group-font-item">${fontName}</span>`).join('')}
        </div>
      </div>
    `;

    // Add event listener for delete button
    const deleteBtn = card.querySelector('.delete-group');
    deleteBtn.addEventListener('click', () => {
      deleteGroup(group.id);
    });

    return card;
  }

  /**
   * Delete a font group
   * @param {string} groupId - ID of the group to delete
   */
  function deleteGroup(groupId) {
    if (!confirm('Are you sure you want to delete this font group?')) {
      return;
    }

    // Remove group from array
    fontGroups = fontGroups.filter(group => group.id !== groupId);

    // Save changes
    saveFontGroups();

    // Update UI
    renderFontGroups();

    // Show notification
    showNotification('Font group deleted successfully');
  }

  /**
   * Show a notification message
   * @param {string} message - Message to display
   */
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add visible class after a small delay (for animation)
    setTimeout(() => {
      notification.classList.add('visible');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});
