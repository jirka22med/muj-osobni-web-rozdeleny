// javascript.js

// Globální proměnná pro stav editačního módu
// Předpokládáme, že EDIT_MODE_KEY a supabaseClient jsou dostupné z supabase.js
let isEditMode = false; // Bude aktualizováno podle EDIT_MODE_MODE z localStorage

// Globální proměnné a pomocné funkce
let activeSection = 'about';
let galleryImagesData = [];
let savedCodesData = [];
let externalLinksData = [];
let currentModalImageIndex = 0;
let editableContentData = {}; // Nový objekt pro ukládání editovatelného obsahu

const STORAGE_KEYS = {
    GALLERY_IMAGES: 'portfolio_gallery_images',
    SAVED_CODES: 'portfolio_saved_codes',
    EXTERNAL_LINKS: 'portfolio_external_links',
    EDITABLE_CONTENT: 'portfolio_editable_content' // Nový klíč pro editovatelný obsah
};

const initialImageUrls = [
    { id: 'initial-1', url: 'https://img.freepik.com/free-photo/futuristic-background-with-colorful-abstract-design_1340-39 futuristic-technology-background-with-neon-lights_76964-11458.jpg?w=826&t=st=1716545000~exp=1716545600~hmac=e6108f60104301f3b2886131029b0f10151707f3020142e9950b1e22704c654a', name: 'Technologie'},
    { id: 'initial-2', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_4k18.jpg?ver=0', name: 'Srdce'},
    { id: 'initial-3', url: 'https://img.freepik.com/free-photo/glowing-spaceship-orbits-planet-starry-galaxy-generated-by-ai_188544-9655.jpg?w=1060&t=st=1716545052~exp=1716545652~hmac=c6a7d107b56da6822f221372f4476a3793075997b820160f494a887688068b14', name: 'Vesmírná loď'},
    { id: 'initial-4', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_4k7.jpg?ver=0', name: 'Mlhovina'},
    { id: 'initial-5', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_4k8.jpg?ver=0', name: 'Kyberpunk město'},
    { id: 'initial-6', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_4k13.jpg?ver=0', name: 'Notebook v akci'},
    { id: 'initial-7', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_4k14.jpg?ver=0', name: 'Galaxie'},
    { id: 'initial-8', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_1920x10804.jpg?ver=0', name: 'Lidský mozek'},
    { id: 'initial-9', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_15360x86402.jpg?ver=0', name: 'Vědecké laboratoře'},
    { id: 'initial-10', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/misurina-sunset.jpg?ver=0', name: 'Neuronová síť'},
    { id: 'initial-11', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/snowy-landscape-with-mountains-lake-with-snow-ground.jpg?ver=0', name: 'Datová mřížka'},
    { id: 'initial-12', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/wet-sphere-reflective-water-abstract-beauty-generated-by-ai.jpg?ver=0', name: 'Futuristické město'},
    { id: 'initial-13', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/vnon-pozadi-od-admirala-chatbota..jpg?ver=0', name: 'Světelná geometrie'},
    { id: 'initial-14', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_1024x1792.jpg?ver=0', name: 'Digitální plameny'},
    { id: 'initial-15', url: 'https://img41.rajce.idnes.cz/d4102/19/19244/19244630_db82ad174937335b1a151341387b7af2/images/image_300x3001_2.jpg?ver=0', name: 'Exoplaneta'},
    { id: 'initial-16', url: 'https://img36.rajce.idnes.cz/d3603/10/10185/10185286_0147349ad505c43a2d9f6eb372624417/images/CIMG0039.jpg?ver=3', name: 'Kybernetická maska'},
];

let initialExternalLinksData = [
    { title: 'Claude AI', url: 'https://claude.ai/' }, { title: 'SledujSerialy', url: 'https://sledujserialy.sx/' },
    { title: 'Kukaj.me', url: 'https://serial.kukaj.me/' }, { title: 'ProSebe.cz', url: 'https://prosebe.cz/user/project' },
    { title: 'Populace.cz', url: 'https://www.populace.cz' }, { title: 'My-Map.eu', url: 'https://www.my-map.eu/odmeny' },
    { title: 'Národní Panel', url: 'https://www.narodnipanel.cz/?backlink=expx2' }, { title: 'Lifepoints Panel', url: 'https://app.lifepointspanel.com/en-US/login' },
    { title: 'Voyo', url: 'https://voyo.nova.cz/' }, { title: 'Přehraj.to', url: 'https://prehrajto.cz/' },
    { title: 'SledovaniTV.cz', url: 'https://sledovanitv.cz/' }, { title: 'Bombuj', url: 'https://www.bombuj.si/' },
];

// --- Funkce pro ukládání a načítání z localStorage ---
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Chyba při ukládání do localStorage:', error);
        if (window.showAlertModal) showAlertModal("Chyba ukládání", "Nepodařilo se uložit data do trvalého úložiště. Možná je úložiště plné.");
        else alert("Chyba ukládání do localStorage.");
        return false;
    }
}

function loadFromLocalStorage(key, defaultValue = []) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Chyba při načítání z localStorage:', error);
        return defaultValue;
    }
}

function clearLocalStorageData() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        localStorage.removeItem(window.EDIT_MODE_KEY); // Používáme globální window.EDIT_MODE_KEY

        if (window.showAlertModal) showAlertModal("Data vymazána", "Všechna uložená data bylA úspěšně vymazána z trvalého úložiště.");
        else alert("Data vymazána.");

        galleryImagesData = [...initialImageUrls];
        savedCodesData = [];
        externalLinksData = [...initialExternalLinksData];
        editableContentData = {};
        applyEditableContent();

        updateGalleryDisplay();
        renderSavedCodesDisplay();
        renderExternalLinks();
        showAlertModal("Data vymazána", "Všechna data včetně upraveného textu byla vymazána a stránka se vrátila k výchozímu obsahu.");

        return true;
    } catch (error) {
        console.error('Chyba při mazání localStorage dat:', error);
        if (window.showAlertModal) showAlertModal("Chyba", "Nepodařilo se vymazat všechna data.");
        else alert("Chyba při mazání dat.");
        return false;
    }
}

function loadDataFromStorage() {
    const savedImages = loadFromLocalStorage(STORAGE_KEYS.GALLERY_IMAGES, []);
    galleryImagesData = savedImages.length > 0 ? savedImages : [...initialImageUrls];

    savedCodesData = loadFromLocalStorage(STORAGE_KEYS.SAVED_CODES, []);

    const savedLinks = loadFromLocalStorage(STORAGE_KEYS.EXTERNAL_LINKS, []);
    externalLinksData = savedLinks.length > 0 ? savedLinks : [...initialExternalLinksData];

    editableContentData = loadFromLocalStorage(STORAGE_KEYS.EDITABLE_CONTENT, {});
    applyEditableContent();
}

// --- Funkce pro aplikaci editovatelného obsahu ---
function applyEditableContent() {
    for (const id in editableContentData) {
        const element = document.querySelector(`[data-editable="${id}"]`);
        if (element) {
            if (element.tagName === 'A' && element.classList.contains('editable-link')) {
                element.href = editableContentData[id].url || '#';
                element.innerHTML = `${editableContentData[id].text || ''}<i class="fas fa-edit edit-icon ${isEditMode ? '' : 'hidden'}"></i>`;
            } else {
                element.innerHTML = editableContentData[id];
            }
        }
    }

    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        const itemId = item.dataset.itemId;
        if (editableContentData[`${itemId}-title`]) {
            item.querySelector(`[data-editable="${itemId}-title"]`).innerHTML = editableContentData[`${itemId}-title`];
        }
        if (editableContentData[`${itemId}-desc-1`]) {
            item.querySelector(`[data-editable="${itemId}-desc-1"]`).innerHTML = editableContentData[`${itemId}-desc-1`];
        }
        const desc2Element = item.querySelector(`[data-editable="${itemId}-desc-2"]`);
        if (desc2Element && editableContentData[`${itemId}-desc-2`]) {
            desc2Element.innerHTML = editableContentData[`${itemId}-desc-2`];
        }

        const linkElement = item.querySelector(`[data-link-id="${itemId}-link"]`);
        if (linkElement && editableContentData[`${itemId}-link-url`]) {
            linkElement.href = editableContentData[`${itemId}-link-url`];
            linkElement.innerHTML = `${editableContentData[`${itemId}-link-text`]}<i class="fas fa-edit edit-icon ${isEditMode ? '' : 'hidden'}"></i>`;
        }
    });
}

function initializeApp() {
    setupNavigation();
    setupHtmlEditor();
    setupGallery();
    setupDataManagement();

    loadDataFromStorage();

    renderExternalLinks();
    updateGalleryDisplay();
    renderSavedCodesDisplay();

    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    showSection(activeSection, true);
    console.log("Aplikace inicializována.");
}

// --- Funkce pro přepínání editačního módu ---
function toggleEditMode() {
    if (isEditMode) { // Pokud už je edit mód AKTIVNÍ (isEditMode === true)
        disableEditMode(); // Vypneme ho
        showAlertModal("Editace ukončena", "Režim úprav byl vypnut. Vaše změny byly uloženy do mezipaměti prohlížeče. Pro trvalé uložení klikněte na 'Uložit vše'.");
    } else { // Pokud edit mód NENÍ AKTIVNÍ (isEditMode === false)
        enableEditMode(); // Zapneme ho
        showAlertModal("Režim úprav", "Jste v režimu úprav. Klikněte na text pro úpravu, nebo použijte ikony pro obrázky/odkazy. Nezapomeňte uložit změny!");
    }
}

function enableEditMode() {
    isEditMode = true;
    document.body.classList.add('edit-mode');
    document.getElementById('login-button')?.classList.add('hidden');
    
    // Tady se mění text tlačítka, když edit mód ZAPÍNÁME
    document.getElementById('edit-mode-toggle-btn').textContent = 'Ukončit editaci'; 
    
    document.getElementById('edit-mode-toggle-btn')?.classList.remove('hidden');

    document.querySelectorAll('[data-editable]').forEach(el => {
        el.setAttribute('contenteditable', 'true');
    });

    document.querySelectorAll('.editable-image-wrapper .edit-icon').forEach(icon => {
        icon.classList.remove('hidden');
    });
    document.querySelectorAll('.editable-link .edit-icon').forEach(icon => {
        icon.classList.remove('hidden');
    });

    document.querySelectorAll('.portfolio-item .edit-controls').forEach(controls => {
        controls.classList.remove('hidden');
    });
    document.getElementById('add-portfolio-item-btn')?.classList.remove('hidden');
    document.getElementById('add-link-btn')?.classList.remove('hidden');
    document.getElementById('data-management')?.classList.remove('hidden');

    document.querySelectorAll('#links-table .edit-mode-only').forEach(el => {
        el.style.display = 'table-cell';
    });

    localStorage.setItem(window.EDIT_MODE_KEY, 'true');
}

function disableEditMode() {
    isEditMode = false;
    document.body.classList.remove('edit-mode');
    
    // Tady se mění text tlačítka, když edit mód VYPÍNÁME
    document.getElementById('edit-mode-toggle-btn').textContent = 'Přejít do editace'; 
    
    // Zobrazíme přihlašovací tlačítko, pokud není uživatel přihlášen
    window.supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            document.getElementById('login-button')?.classList.remove('hidden');
            document.getElementById('edit-mode-toggle-btn')?.classList.add('hidden');
        }
    });

    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.removeAttribute('contenteditable');
        const id = el.dataset.editable;
        if (id) {
            if (el.tagName === 'A' && el.classList.contains('editable-link')) {
                editableContentData[id] = { url: el.href, text: el.childNodes[0] ? el.childNodes[0].nodeValue.trim() : '' };
            } else {
                editableContentData[id] = el.innerHTML;
            }
        }
    });

    document.querySelectorAll('.editable-image-wrapper .edit-icon').forEach(icon => {
        icon.classList.add('hidden');
    });
    document.querySelectorAll('.editable-link .edit-icon').forEach(icon => {
        icon.classList.add('hidden');
    });

    document.querySelectorAll('.portfolio-item .edit-controls').forEach(controls => {
        controls.classList.add('hidden');
    });
    document.getElementById('add-portfolio-item-btn')?.classList.add('hidden');
    document.getElementById('add-link-btn')?.classList.add('hidden');
    document.getElementById('data-management')?.classList.add('hidden');

    document.querySelectorAll('#links-table .edit-mode-only').forEach(el => {
        el.style.display = 'none';
    });

    saveToLocalStorage(STORAGE_KEYS.EDITABLE_CONTENT, editableContentData);
    localStorage.removeItem(window.EDIT_MODE_KEY);
}

// --- Funkce pro načítání a skrývání indikátoru ---
function showLoading(message = "Načítání...") {
    const loadingIndicatorElement = document.getElementById('loading-indicator');
    if (loadingIndicatorElement) {
        loadingIndicatorElement.textContent = message;
        loadingIndicatorElement.classList.remove('hidden');
    }
}
function hideLoading() {
    const loadingIndicatorElement = document.getElementById('loading-indicator');
    if (loadingIndicatorElement) {
        loadingIndicatorElement.classList.add('hidden');
    }
}

// Tyto funkce musí být globálně dostupné, aby je mohl volat supabase.js
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.enableEditMode = enableEditMode;
window.disableEditMode = disableEditMode;
window.initializeApp = initializeApp; // Inicializace aplikace

// --- Správa dat ---
function setupDataManagement() {
    const dataManagementContainer = document.getElementById('data-management');
    if (dataManagementContainer) {
        dataManagementContainer.innerHTML = `
            <div class="data-management-buttons" style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 0.5rem;">
                <button id="save-all-data-btn" class="button btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">💾 Uložit vše</button>
                <button id="clear-all-data-btn" class="button btn-danger" style="padding: 0.5rem 1rem; font-size: 0.85rem;">🗑️ Vymazat vše</button>
                <button id="export-data-btn" class="button btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">📤 Export</button>
                <button id="import-data-btn" class="button btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">📥 Import</button>
                <input type="file" id="import-file-input" accept=".json" style="display: none;">
            </div>
        `;

        document.getElementById('save-all-data-btn')?.addEventListener('click', saveAllDataToStorage);
        document.getElementById('clear-all-data-btn')?.addEventListener('click', handleClearAllData);
        document.getElementById('export-data-btn')?.addEventListener('click', exportData);
        document.getElementById('import-data-btn')?.addEventListener('click', () => {
            document.getElementById('import-file-input')?.click();
        });
        document.getElementById('import-file-input')?.addEventListener('change', handleImportData);
    }
}

function saveAllDataToStorage() {
    document.querySelectorAll('[data-editable]').forEach(el => {
        const id = el.dataset.editable;
        if (id) {
            if (el.tagName === 'A' && el.classList.contains('editable-link')) {
                editableContentData[id] = { url: el.href, text: el.childNodes[0] ? el.childNodes[0].nodeValue.trim() : '' };
            } else {
                editableContentData[id] = el.innerHTML;
            }
        }
    });

    let savedCount = 0;
    if (saveToLocalStorage(STORAGE_KEYS.GALLERY_IMAGES, galleryImagesData)) savedCount++;
    if (saveToLocalStorage(STORAGE_KEYS.SAVED_CODES, savedCodesData)) savedCount++;
    if (saveToLocalStorage(STORAGE_KEYS.EXTERNAL_LINKS, externalLinksData)) savedCount++;
    if (saveToLocalStorage(STORAGE_KEYS.EDITABLE_CONTENT, editableContentData)) savedCount++;

    const message = savedCount === 4 ? "Všechna data byla úspěšně uložena." : `Uloženo ${savedCount} ze 4 kategorií dat.`;
    if (window.showAlertModal) showAlertModal(savedCount === 4 ? "Data uložena" : "Částečné uložení", message);
    else alert(message);
}

async function handleClearAllData() {
    const confirmed = await (window.showConfirmModal ?
        showConfirmModal("Vymazat všechna data?", "Opravdu chcete vymazat všechna uložená data? Tato akce je nevratná! Zahrnuje i texty upravené na stránce.", { okText: 'Ano, vymazat', cancelText: 'Zrušit' }) :
        confirm("Opravdu chcete vymazat všechna uložená data?")
    );

    if (confirmed) {
        clearLocalStorageData();
    }
}

function exportData() {
    document.querySelectorAll('[data-editable]').forEach(el => {
        const id = el.dataset.editable;
        if (id) {
            if (el.tagName === 'A' && el.classList.contains('editable-link')) {
                editableContentData[id] = { url: el.href, text: el.childNodes[0] ? el.childNodes[0].nodeValue.trim() : '' };
            } else {
                editableContentData[id] = el.innerHTML;
            }
        }
    });

    const exportObject = {
        galleryImages: galleryImagesData,
        savedCodes: savedCodesData,
        externalLinks: externalLinksData,
        editableContent: editableContentData,
        exportDate: new Date().toISOString(),
        version: "1.1"
    };

    const dataStr = JSON.stringify(exportObject, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if(window.showAlertModal) showAlertModal("Export dokončen", "Data byla exportována do souboru JSON.");
    else alert("Data exportována.");
}

function handleImportData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            const confirmed = await (window.showConfirmModal ?
                showConfirmModal("Importovat data?", "Importování přepíše všechna současná data (včetně textů na stránce). Chcete pokračovat?", { okText: 'Ano, importovat', cancelText: 'Zrušit' }) :
                confirm("Importování přepíše data. Pokračovat?")
            );

            if (confirmed) {
                if (importedData.galleryImages) galleryImagesData = importedData.galleryImages;
                if (importedData.savedCodes) savedCodesData = importedData.savedCodes;
                if (importedData.externalLinks) externalLinksData = importedData.externalLinks;
                if (importedData.editableContent) editableContentData = importedData.editableContent;

                saveAllDataToStorage();

                applyEditableContent();
                updateGalleryDisplay();
                renderSavedCodesDisplay();
                renderExternalLinks();

                if(window.showAlertModal) showAlertModal("Import dokončen", "Data byla úspěšně naimportována a uložena.");
                else alert("Data naimportována.");
            }
        } catch (error) {
            console.error('Chyba při importu:', error);
            if(window.showAlertModal) showAlertModal("Chyba importu", "Nepodařilo se načíst data ze souboru. Zkontrolujte, zda je soubor platný JSON.");
            else alert("Chyba importu dat.");
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// --- Navigace a sekce ---
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-container a.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            showSection(sectionId);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    const initialActiveLink = document.querySelector(`.nav-container a.nav-link[data-section="${activeSection}"]`);
    if (initialActiveLink) initialActiveLink.classList.add('active');
}

function showSection(id, isInitial = false) {
    if (!id) id = 'about';
    activeSection = id;
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
        if (!(isInitial && section.id === id)) {
            section.style.display = 'none';
        }
    });
    const sectionElement = document.getElementById(id);
    if (sectionElement) {
        sectionElement.style.display = 'block';
        setTimeout(() => sectionElement.classList.add('active'), 10);
    } else {
        console.warn(`Sekce s ID "${id}" nebyla nalezena. Zobrazuji 'about'.`);
        const aboutSection = document.getElementById('about');
        if(aboutSection) {
            aboutSection.style.display = 'block';
            setTimeout(() => aboutSection.classList.add('active'), 10);
            activeSection = 'about';
            document.querySelectorAll('.nav-container a.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelector('.nav-container a.nav-link[data-section="about"]')?.classList.add('active');
        }
    }
}

// Tyto funkce musí být globálně dostupné, aby je mohl volat supabase.js a další části HTML
window.showSection = showSection;

// --- HTML Editor ---
function setupHtmlEditor() {
    const editor = document.getElementById('html-editor');
    const preview = document.getElementById('html-preview');
    const saveBtn = document.getElementById('save-code-btn');

    if (!editor || !preview || !saveBtn) {
        console.error("HTML editor elementy nebyly nalezeny!");
        return;
    }

    editor.addEventListener('input', () => { preview.srcdoc = editor.value; });
    preview.srcdoc = editor.value;

    saveBtn.addEventListener('click', () => {
        if (!editor.value.trim()) {
            if(window.showAlertModal) showAlertModal("Prázdný kód", "Nelze uložit prázdný HTML kód.");
            else alert("Nelze uložit prázdný kód.");
            return;
        }
        const saveModal = document.getElementById('save-code-modal');
        if(saveModal) showModal(saveModal);
        document.getElementById('code-title-input')?.focus();
    });
}

function saveHtmlCodeLocally(title, code) {
    const newCode = {
        id: `local-code-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title, code, createdAt: new Date().toISOString()
    };
    savedCodesData.unshift(newCode);
    saveToLocalStorage(STORAGE_KEYS.SAVED_CODES, savedCodesData);
    renderSavedCodesDisplay();
    if(window.showAlertModal) showAlertModal("Kód uložen", `Kód "${title}" byl trvale uložen.`);
    else alert(`Kód "${title}" uložen.`);
}

function deleteHtmlCodeLocally(id) {
    savedCodesData = savedCodesData.filter(code => code.id !== id);
    saveToLocalStorage(STORAGE_KEYS.SAVED_CODES, savedCodesData);
    renderSavedCodesDisplay();
}

function renderSavedCodesDisplay() {
    const listEl = document.getElementById('saved-codes-list');
    if(!listEl) return;
    listEl.innerHTML = savedCodesData.length === 0 ? '<p>Žádné kódy nejsou aktuálně uloženy.</p>' : '';

    savedCodesData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'saved-code-item';
        div.innerHTML = `
            <div class="item-header">
                <h3>${item.title}</h3>
                <div class="actions">
                    <button class="button btn-secondary load-code">Načíst</button>
                    <button class="button btn-danger delete-code">Smazat</button>
                </div>
            </div>
            <p>Uloženo: ${new Date(item.createdAt).toLocaleString('cs-CZ')}</p>
        `;
        div.querySelector('.load-code').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('html-editor').value = item.code;
            document.getElementById('html-preview').srcdoc = item.code;
            showSection('editor');
            document.querySelector('.nav-container a.nav-link[data-section="editor"]')?.click();
        });
        div.querySelector('.delete-code').addEventListener('click', async (e) => {
            e.stopPropagation();
            const confirmed = await (window.showConfirmModal ?
                showConfirmModal("Smazat kód?", `Opravdu chcete smazat kód "${item.title}"?`) :
                confirm(`Smazat kód "${item.title}"?`)
            );
            if (confirmed) deleteHtmlCodeLocally(item.id);
        });
        div.addEventListener('click', () => {
            document.getElementById('html-editor').value = item.code;
            document.getElementById('html-preview').srcdoc = item.code;
            showSection('editor');
            document.querySelector('.nav-container a.nav-link[data-section="editor"]')?.click();
        });
        listEl.appendChild(div);
    });
}

// --- Galerie ---
function setupGallery() {
    const addBtn = document.getElementById('addImageUrlBtn');
    const closeBtn = document.getElementById('close-modal-btn');
    const prevBtn = document.getElementById('prev-image-btn');
    const nextBtn = document.getElementById('next-image-btn');
    const saveEditImageBtn = document.getElementById('save-edit-image-btn');
    const cancelEditImageBtn = document.getElementById('cancel-edit-image-btn');

    if(addBtn) addBtn.addEventListener('click', handleAddImageUrl);
    if(closeBtn) closeBtn.addEventListener('click', closeImageModal);
    if(prevBtn) prevBtn.addEventListener('click', () => navigateImageModal(-1));
    if(nextBtn) nextBtn.addEventListener('click', () => navigateImageModal(1));
    if(saveEditImageBtn) saveEditImageBtn.addEventListener('click', saveEditedImage);
    if(cancelEditImageBtn) cancelEditImageBtn.addEventListener('click', () => hideModal(document.getElementById('edit-image-modal')));
}

async function handleAddImageUrl() {
    const urlInput = document.getElementById('newImageUrl');
    if (!urlInput) {
        console.error("Element #newImageUrl not found for adding gallery image.");
        return;
    }
    const imageUrl = urlInput.value.trim();

    if (imageUrl && isValidHttpUrl(imageUrl)) {
        const imageNamePrompt = prompt(`Zadejte název pro obrázek (URL: ${imageUrl.substring(0,50)}...). Prázdné pro výchozí název.`, `Obrázek ${galleryImagesData.length + 1}`);
        let imageName = (imageNamePrompt && imageNamePrompt.trim() !== "") ? imageNamePrompt.trim() : `Obrázek ${galleryImagesData.length + 1}_${Math.floor(Math.random()*1000)}`;

        const newImage = {
            id: `local-img-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
            url: imageUrl, name: imageName, createdAt: new Date().toISOString()
        };
        galleryImagesData.unshift(newImage);
        saveToLocalStorage(STORAGE_KEYS.GALLERY_IMAGES, galleryImagesData);
        updateGalleryDisplay();
        if(window.showAlertModal) showAlertModal("Obrázek přidán", `Obrázek "${imageName}" byl uložen.`);
        else alert(`Obrázek "${imageName}" uložen.`);
        urlInput.value = '';
    } else {
        if(window.showAlertModal) showAlertModal("Neplatná URL", "Zadejte platnou URL adresu obrázku (http:// nebo https://).");
        else alert("Neplatná URL.");
    }
}

function isValidHttpUrl(string) {
    let url;
    try { url = new URL(string); }
    catch (_) { return false; }
    return url.protocol === "http:" || url.protocol === "https:";
}

async function deleteGalleryImageLocally(id) {
    const imageToDelete = galleryImagesData.find(img => img.id === id);
    if (!imageToDelete) return;

    const confirmed = await (window.showConfirmModal ?
        showConfirmModal("Smazat obrázek?", `Opravdu smazat "${imageToDelete.name || 'tento obrázek'}"?`) :
        confirm(`Smazat obrázek "${imageToDelete.name || 'tento obrázek'}"?`)
    );
    if (confirmed) {
        galleryImagesData = galleryImagesData.filter(img => img.id !== id);
        saveToLocalStorage(STORAGE_KEYS.GALLERY_IMAGES, galleryImagesData);
        updateGalleryDisplay();
    }
}

function updateGalleryDisplay() {
    const container = document.getElementById('gallery-container');
    if(!container) return;
    container.innerHTML = galleryImagesData.length === 0 ? '<p>Galerie je prázdná.</p>' : '';

    galleryImagesData.forEach((imgData, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-image-wrapper';
        div.innerHTML = `
            <img src="${imgData.url}" alt="${imgData.name || 'Obrázek z galerie'}" onerror="this.onerror=null;this.src='https://placehold.co/250x200/cccccc/ffffff?text=Obrázek+nelze+načíst';this.alt='Obrázek nelze načíst';">
            <button class="delete-img-btn ${isEditMode ? '' : 'hidden'}" title="Smazat obrázek">&times;</button>
            <i class="fas fa-edit edit-icon ${isEditMode ? '' : 'hidden'}" data-image-id="${imgData.id}"></i>
        `;
        div.querySelector('img').addEventListener('click', () => openImageModal(index));
        div.querySelector('.delete-img-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteGalleryImageLocally(imgData.id);
        });
        div.querySelector('.edit-icon')?.addEventListener('click', (e) => {
            e.stopPropagation();
            editImage(imgData.id);
        });
        container.appendChild(div);
    });
}

let editingImageId = null;
function editImage(imageId) {
    editingImageId = imageId;
    const image = galleryImagesData.find(img => img.id === imageId);
    if (image) {
        document.getElementById('edit-image-url').value = image.url;
        document.getElementById('edit-image-name').value = image.name;
        showModal(document.getElementById('edit-image-modal'));
    }
}

function saveEditedImage() {
    const url = document.getElementById('edit-image-url').value.trim();
    const name = document.getElementById('edit-image-name').value.trim();

    if (!isValidHttpUrl(url)) {
        showAlertModal("Neplatná URL", "Zadejte platnou URL adresu obrázku (http:// nebo https://).");
        return;
    }

    const index = galleryImagesData.findIndex(img => img.id === editingImageId);
    if (index !== -1) {
        galleryImagesData[index].url = url;
        galleryImagesData[index].name = name;
        saveToLocalStorage(STORAGE_KEYS.GALLERY_IMAGES, galleryImagesData);
        updateGalleryDisplay();
        hideModal(document.getElementById('edit-image-modal'));
        showAlertModal("Obrázek upraven", `Obrázek "${name}" byl úspěšně upraven.`);
    } else {
        showAlertModal("Chyba", "Obrázek k úpravě nebyl nalezen.");
    }
}

function openImageModal(index) {
    if (index < 0 || index >= galleryImagesData.length) return;
    currentModalImageIndex = index;
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    if(!modal || !modalImg) return;

    modalImg.src = galleryImagesData[index].url;
    modalImg.alt = galleryImagesData[index].name || 'Zvětšený obrázek';
    showModal(modal);
}

function closeImageModal() {
    hideModal(document.getElementById('image-modal'));
}

function navigateImageModal(direction) {
    const newIndex = currentModalImageIndex + direction;
    if (newIndex >= 0 && newIndex < galleryImagesData.length) {
        openImageModal(newIndex);
    } else if (galleryImagesData.length > 0) {
        currentModalImageIndex = (newIndex < 0) ? galleryImagesData.length - 1 : 0;
        openImageModal(currentModalImageIndex);
    }
}

// --- Externí odkazy ---
function renderExternalLinks() {
    const tableBody = document.querySelector('#links-table tbody');
    if (!tableBody) {
        console.error("Table body for links not found!");
        return;
    }
    tableBody.innerHTML = '';

    if (externalLinksData.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.colSpan = 4;
        cell.textContent = 'Žádné externí odkazy k zobrazení.';
        cell.style.textAlign = 'center';
        return;
    }

    externalLinksData.forEach((link, index) => {
        const row = tableBody.insertRow();
        row.insertCell().innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3 -3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;

        const titleCell = row.insertCell();
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.textContent = link.title;
        titleCell.appendChild(anchor);

        row.insertCell().textContent = link.url;

        const actionsCell = row.insertCell();
        actionsCell.className = 'edit-mode-only';
        actionsCell.innerHTML = `
            <button class="button btn-secondary edit-link-btn" data-index="${index}">Editovat</button>
            <button class="button btn-danger delete-link-btn" data-index="${index}">Smazat</button>
        `;
        actionsCell.querySelector('.edit-link-btn')?.addEventListener('click', () => editLink(index));
        actionsCell.querySelector('.delete-link-btn')?.addEventListener('click', () => deleteLink(index));
    });
}

document.getElementById('add-link-btn')?.addEventListener('click', addLink);

function addLink() {
    editingLinkIndex = -1;
    document.getElementById('edit-link-title').value = '';
    document.getElementById('edit-link-url').value = '';
    showModal(document.getElementById('edit-link-modal'));
}

let editingLinkIndex = null;
function editLink(index) {
    editingLinkIndex = index;
    const link = externalLinksData[index];
    if (link) {
        document.getElementById('edit-link-title').value = link.title;
        document.getElementById('edit-link-url').value = link.url;
        showModal(document.getElementById('edit-link-modal'));
    }
}

function saveEditedLink() {
    const title = document.getElementById('edit-link-title').value.trim();
    const url = document.getElementById('edit-link-url').value.trim();

    if (!title || !url || !isValidHttpUrl(url)) {
        showAlertModal("Chybějící/neplatné údaje", "Zadejte platný název a URL (http:// nebo https://) pro odkaz.");
        return;
    }

    if (editingLinkIndex === -1) {
        externalLinksData.push({ title, url });
        showAlertModal("Odkaz přidán", `Odkaz "${title}" byl přidán.`);
    } else {
        externalLinksData[editingLinkIndex] = { title, url };
        showAlertModal("Odkaz upraven", `Odkaz "${title}" byl upraven.`);
    }

    saveToLocalStorage(STORAGE_KEYS.EXTERNAL_LINKS, externalLinksData);
    renderExternalLinks();
    hideModal(document.getElementById('edit-link-modal'));
}
document.getElementById('save-edit-link-btn')?.addEventListener('click', saveEditedLink);
document.getElementById('cancel-edit-link-btn')?.addEventListener('click', () => hideModal(document.getElementById('edit-link-modal')));

async function deleteLink(index) {
    const linkToDelete = externalLinksData[index];
    const confirmed = await (window.showConfirmModal ?
        showConfirmModal("Smazat odkaz?", `Opravdu smazat odkaz "${linkToDelete.title}"?`) :
        confirm(`Smazat odkaz "${linkToDelete.title}"?`)
    );
    if (confirmed) {
        externalLinksData.splice(index, 1);
        saveToLocalStorage(STORAGE_KEYS.EXTERNAL_LINKS, externalLinksData);
        renderExternalLinks();
    }
}

// --- Modální okna (přepracované pro obecné použití) ---
function showModal(modalElement) {
    if(modalElement) modalElement.classList.add('visible');
}
function hideModal(modalElement) {
    if(modalElement) modalElement.classList.remove('visible');
}

// Tyto funkce musí být globálně dostupné, aby je mohl volat supabase.js a další části HTML
window.showModal = showModal;
window.hideModal = hideModal;

const saveCodeModalEl = document.getElementById('save-code-modal');
const codeTitleInputEl = document.getElementById('code-title-input');
const confirmSaveCodeBtnEl = document.getElementById('confirm-save-code-btn');
const cancelSaveCodeBtnEl = document.getElementById('cancel-save-code-btn');

if(confirmSaveCodeBtnEl && codeTitleInputEl) {
    confirmSaveCodeBtnEl.addEventListener('click', () => {
        const title = codeTitleInputEl.value.trim();
        const editor = document.getElementById('html-editor');
        const code = editor ? editor.value : '';
        if (title && code) {
            saveHtmlCodeLocally(title, code);
            if(saveCodeModalEl) hideModal(saveCodeModalEl);
            codeTitleInputEl.value = '';
        } else {
            if(window.showAlertModal) showAlertModal("Chybějící údaje", "Zadejte název a ujistěte se, že kód není prázdný.");
            else alert("Nelze uložit prázdný kód.");
        }
    });
}
if(cancelSaveCodeBtnEl) cancelSaveCodeBtnEl.addEventListener('click', () => {
    if(saveCodeModalEl) hideModal(saveCodeModalEl);
    if(codeTitleInputEl) codeTitleInputEl.value = '';
});

// Definice pro globální okna
if (!window.showAlertModal) {
    window.showAlertModal = (title, message) => {
        console.warn("Custom showAlertModal not fully initialized, using native alert.");
        return new Promise((resolve) => {
            alert(`${title}\n\n${message}`);
            resolve(true);
        });
    };
}
if (!window.showConfirmModal) {
    window.showConfirmModal = (title, message) => {
        console.warn("Custom showConfirmModal not fully initialized, using native confirm.");
        return new Promise((resolve) => {
            resolve(confirm(`${title}\n\n${message}`));
        });
    };
}

const alertModalEl = document.getElementById('alert-modal');
const alertModalTitleEl = document.getElementById('alert-modal-title');
const alertModalMessageEl = document.getElementById('alert-modal-message');
let alertModalOkBtnEl = document.getElementById('alert-modal-ok-btn');

if(alertModalEl && alertModalTitleEl && alertModalMessageEl && alertModalOkBtnEl) {
    window.showAlertModal = (title, message) => {
        return new Promise((resolve) => {
            alertModalTitleEl.textContent = title;
            alertModalMessageEl.textContent = message;

            const newOkBtn = alertModalOkBtnEl.cloneNode(true);
            alertModalOkBtnEl.parentNode.replaceChild(newOkBtn, alertModalOkBtnEl);
            alertModalOkBtnEl = newOkBtn;

            alertModalOkBtnEl.onclick = () => {
                hideModal(alertModalEl);
                resolve(true);
            };
            showModal(alertModalEl);
        });
    };
}

const confirmModalEl = document.getElementById('confirm-modal');
const confirmModalTitleEl = document.getElementById('confirm-modal-title');
const confirmModalMessageEl = document.getElementById('confirm-modal-message');
let confirmModalOkBtnEl = document.getElementById('confirm-modal-ok-btn');
let confirmModalCancelBtnEl = document.getElementById('confirm-modal-cancel-btn');

if(confirmModalEl && confirmModalTitleEl && confirmModalMessageEl && confirmModalOkBtnEl && confirmModalCancelBtnEl) {
    window.showConfirmModal = (title, message, buttonTexts = {}) => {
        return new Promise((resolve) => {
            confirmModalTitleEl.textContent = title;
            confirmModalMessageEl.textContent = message;

            const newOkBtn = confirmModalOkBtnEl.cloneNode(true);
            newOkBtn.textContent = buttonTexts.okText || 'Potvrdit';
            confirmModalOkBtnEl.parentNode.replaceChild(newOkBtn, confirmModalOkBtnEl);
            confirmModalOkBtnEl = newOkBtn;

            const newCancelBtn = confirmModalCancelBtnEl.cloneNode(true);
            newCancelBtn.textContent = buttonTexts.cancelText || 'Zrušit';
            confirmModalCancelBtnEl.parentNode.replaceChild(newCancelBtn, confirmModalCancelBtnEl);
            confirmModalCancelBtnEl = newCancelBtn;

            confirmModalOkBtnEl.onclick = () => {
                hideModal(confirmModalEl);
                resolve(true);
            };
            confirmModalCancelBtnEl.onclick = () => {
                hideModal(confirmModalEl);
                resolve(false);
            };
            showModal(confirmModalEl);
        });
    };
}

// --- Nové funkce pro editaci portfolia ---
let editingPortfolioItemId = null;

// Tyto funkce musí být globálně dostupné pro onclick atributy v HTML
window.editPortfolioItem = editPortfolioItem;
window.addPortfolioItem = addPortfolioItem;
window.deletePortfolioItem = deletePortfolioItem;


function editPortfolioItem(itemId) {
    editingPortfolioItemId = itemId;
    const item = document.querySelector(`.portfolio-item[data-item-id="${itemId}"]`);
    if (!item) return;

    document.getElementById('edit-portfolio-title').value = item.querySelector(`[data-editable="${itemId}-title"]`).textContent.trim();
    document.getElementById('edit-portfolio-desc-1').value = item.querySelector(`[data-editable="${itemId}-desc-1"]`).textContent.trim();

    const desc2Element = item.querySelector(`[data-editable="${itemId}-desc-2"]`);
    document.getElementById('edit-portfolio-desc-2').value = desc2Element ? desc2Element.textContent.trim() : '';

    const linkElement = item.querySelector(`[data-link-id="${itemId}-link"]`);
    document.getElementById('edit-portfolio-link-text').value = linkElement ? linkElement.childNodes[0].nodeValue.trim() : '';
    document.getElementById('edit-portfolio-link-url').value = linkElement ? linkElement.href : '';

    document.getElementById('delete-portfolio-btn')?.classList.remove('hidden');
    showModal(document.getElementById('edit-portfolio-modal'));
}


document.getElementById('save-edit-portfolio-btn')?.addEventListener('click', saveEditedPortfolioItem);
document.getElementById('cancel-edit-portfolio-btn')?.addEventListener('click', () => hideModal(document.getElementById('edit-portfolio-modal')));
document.getElementById('delete-portfolio-btn')?.addEventListener('click', deletePortfolioItem);
document.getElementById('add-portfolio-item-btn')?.addEventListener('click', addPortfolioItem);

function addPortfolioItem() {
    editingPortfolioItemId = null;
    document.getElementById('edit-portfolio-title').value = '';
    document.getElementById('edit-portfolio-desc-1').value = '';
    document.getElementById('edit-portfolio-desc-2').value = '';
    document.getElementById('edit-portfolio-link-text').value = '';
    document.getElementById('edit-portfolio-link-url').value = '';
    document.getElementById('delete-portfolio-btn')?.classList.add('hidden');
    showModal(document.getElementById('edit-portfolio-modal'));
}

function saveEditedPortfolioItem() {
    const title = document.getElementById('edit-portfolio-title').value.trim();
    const desc1 = document.getElementById('edit-portfolio-desc-1').value.trim();
    const desc2 = document.getElementById('edit-portfolio-desc-2').value.trim();
    const linkText = document.getElementById('edit-portfolio-link-text').value.trim();
    const linkUrl = document.getElementById('edit-portfolio-link-url').value.trim();

    if (!title || !desc1) {
        showAlertModal("Chybějící údaje", "Vyplňte prosím název a první popis položky portfolia.");
        return;
    }
    if (linkUrl && !isValidHttpUrl(linkUrl)) {
        showAlertModal("Neplatná URL", "Zadejte platnou URL adresu pro odkaz (http:// nebo https://).");
        return;
    }

    const newId = editingPortfolioItemId || `portfolio-item-${Date.now()}`;

    editableContentData[`${newId}-title`] = title;
    editableContentData[`${newId}-desc-1`] = desc1;
    editableContentData[`${newId}-desc-2`] = desc2;
    editableContentData[`${newId}-link-text`] = linkText;
    editableContentData[`${newId}-link-url`] = linkUrl;

    if (!editingPortfolioItemId) {
        const portfolioContainer = document.querySelector('.portfolio-items');
        const newItemHtml = `
            <div class="portfolio-item" data-item-id="${newId}" style="background-color: #f9f9f9; padding: 1rem; border-radius: 4px; border: 1px solid #ddd; position: relative;">
                <h3 data-editable="${newId}-title">${title}</h3>
                <p data-editable="${newId}-desc-1">${desc1}</p>
                ${desc2 ? `<p data-editable="${newId}-desc-2">${desc2}</p>` : ''}
                <a href="${linkUrl || '#'}" class="button editable-link" data-link-id="${newId}-link" data-editable-link-text="${linkText || 'Zobrazit projekt &rarr;'}" target="_blank" rel="noopener noreferrer">
                    ${linkText || 'Zobrazit projekt &rarr;'}<i class="fas fa-edit edit-icon ${isEditMode ? '' : 'hidden'}"></i>
                </a>
                <div class="edit-controls ${isEditMode ? '' : 'hidden'}">
                    <button onclick="editPortfolioItem('${newId}')">Editovat</button>
                </div>
            </div>
        `;
        portfolioContainer.insertAdjacentHTML('beforeend', newItemHtml);
        if (isEditMode) {
            const newlyAddedItem = portfolioContainer.lastElementChild;
            newlyAddedItem.querySelectorAll('[data-editable]').forEach(el => {
                el.setAttribute('contenteditable', 'true');
            });
        }
        showAlertModal("Položka přidána", `Nová položka portfolia "${title}" byla přidána.`);
    } else {
        applyEditableContent();
        showAlertModal("Položka upravena", `Položka portfolia "${title}" byla upravena.`);
    }

    saveToLocalStorage(STORAGE_KEYS.EDITABLE_CONTENT, editableContentData);
    hideModal(document.getElementById('edit-portfolio-modal'));
    editingPortfolioItemId = null;
}

async function deletePortfolioItem() {
    if (!editingPortfolioItemId) return;

    const confirmed = await (window.showConfirmModal ?
        showConfirmModal("Smazat položku portfolia?", "Opravdu chcete smazat tuto položku z portfolia? Tato akce je nevratná!", { okText: 'Ano, smazat', cancelText: 'Zrušit' }) :
        confirm("Opravdu chcete smazat tuto položku z portfolia? Tato akce je nevratná!")
    );

    if (confirmed) {
        const itemElement = document.querySelector(`.portfolio-item[data-item-id="${editingPortfolioItemId}"]`);
        if (itemElement) {
            itemElement.remove();
            delete editableContentData[`${editingPortfolioItemId}-title`];
            delete editableContentData[`${editingPortfolioItemId}-desc-1`];
            delete editableContentData[`${editingPortfolioItemId}-desc-2`];
            delete editableContentData[`${editingPortfolioItemId}-link-text`];
            delete editableContentData[`${editingPortfolioItemId}-link-url`];
            saveToLocalStorage(STORAGE_KEYS.EDITABLE_CONTENT, editableContentData);
            showAlertModal("Položka smazána", "Položka portfolia byla úspěšně smazána.");
        } else {
            showAlertModal("Chyba", "Položka k smazání nebyla nalezena.");
        }
        hideModal(document.getElementById('edit-portfolio-modal'));
        editingPortfolioItemId = null;
    }
}

// Inicializace aplikace po načtení DOM
document.addEventListener('DOMContentLoaded', function() {
    const loadingIndicatorElement = document.getElementById('loading-indicator');

    if (loadingIndicatorElement) {
        loadingIndicatorElement.textContent = "Načítání stránky...";
        loadingIndicatorElement.classList.remove('hidden');
    } else {
        console.error("Loading indicator element not found!");
    }

    // Supabase knihovna musí být načtena jako první ve tvém HTML!
    if (typeof supabase === 'undefined' || typeof supabase.createClient !== 'function') {
        console.error('Kritická chyba: Knihovna Supabase se nenačetla. Zkontroluj její načítání v HTML.');
        if (loadingIndicatorElement) {
            loadingIndicatorElement.textContent = 'Kritická chyba: Knihovna Supabase se nenačetla.';
        }
        document.body.style.visibility = 'visible';
        return;
    }

    // Listener pro přihlašovací tlačítko
    document.getElementById('login-button')?.addEventListener('click', () => {
        if (typeof showAuthModal === 'function') {
            showAuthModal(); // Použij showAuthModal, pokud je definováno, nebo přímé volání modalu.
        } else {
            showModal(document.getElementById('auth-modal'));
            document.getElementById('auth-email').focus();
            document.getElementById('auth-error-message').textContent = '';
        }
    });
    document.getElementById('cancel-auth-btn')?.addEventListener('click', () => hideModal(document.getElementById('auth-modal')));
    document.getElementById('login-auth-btn')?.addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        // Voláme globální funkci z supabase.js
        const result = await window.signInUser(email, password);
        if (result.success) {
            enableEditMode();
        }
    });
    document.getElementById('signup-auth-btn')?.addEventListener('click', async () => {
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        // Voláme globální funkci z supabase.js
        await window.signUpUser(email, password);
    });

    // Listener pro tlačítko přepínání edit módu
    document.getElementById('edit-mode-toggle-btn')?.addEventListener('click', toggleEditMode);

    // Listener pro odhlášení
    document.getElementById('logout-button')?.addEventListener('click', async () => {
        // Voláme globální funkci z supabase.js
        const result = await window.signOutUser();
        if (result.success) {
            disableEditMode();
        }
    });

    // Spuštění naslouchání na změny autentizace Supabase a kontrola počátečního stavu
    // Tyto části kódu jsou v supabase.js a volají enableEditMode/disableEditMode,
    // které nyní mají správně nastavený text tlačítka.
    window.setupSupabaseAuthStateChangeGlobal();
    window.checkInitialAuthStateGlobal();
});