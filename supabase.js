// supabase.js

// --- Supabase Konstanty ---
// Zde je důležité, aby se supabaseClient stal globálně dostupným
const SUPABASE_URL = 'https://aknjpurxdbtsxillmqbd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrbmpwdXJ4ZGJ0c3hpbGxtcWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTEzMzAsImV4cCI6MjA2Mzc2NzMzMH0.otk-74BBM-SwC_zA0WqqcwGVab5lBfrLiyeYOmh4Xio';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// NOVINKA: Konstanta pro klíč v localStorage pro uložení stavu edit módu
const EDIT_MODE_KEY = 'portfolio_edit_mode_active';

// --- Supabase autentizace a přesměrování ---
// Tyto funkce budou volat pomocné funkce, které se očekávají v globálním rozsahu
// nebo budou definovány v javascript.js.
// Aby se zabránilo chybám "function not defined", je nutné načíst javascript.js AŽ PO supabase.js,
// a také je ideální, aby javascript.js definoval tyto pomocné funkce globálně (nebo aby se volaly na DOMContentLoaded).

/**
 * Funkce pro přihlášení uživatele.
 */
async function signInUser(email, password) {
    // showLoading a hideLoading musí být globálně dostupné (např. definované v javascript.js)
    if (typeof showLoading === 'function') showLoading("Přihlašování...");
    const errorMessageEl = document.getElementById('auth-error-message');
    if (errorMessageEl) errorMessageEl.textContent = '';

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        console.error('Chyba při přihlašování:', error.message);
        if (errorMessageEl) errorMessageEl.textContent = `Chyba: ${error.message}`;
        if (typeof hideLoading === 'function') hideLoading();
        return { success: false, error: error.message };
    } else {
        // hideAuthModal a enableEditMode musí být globálně dostupné
        if (typeof hideAuthModal === 'function') hideAuthModal();
        if (typeof hideLoading === 'function') hideLoading();
        return { success: true };
    }
}

/**
 * Funkce pro registraci uživatele.
 */
async function signUpUser(email, password) {
    if (typeof showLoading === 'function') showLoading("Registrace...");
    const errorMessageEl = document.getElementById('auth-error-message');
    if (errorMessageEl) errorMessageEl.textContent = '';

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
        console.error('Chyba při registraci:', error.message);
        if (errorMessageEl) errorMessageEl.textContent = `Chyba: ${error.message}`;
        if (typeof hideLoading === 'function') hideLoading();
        return { success: false, error: error.message };
    } else {
        if (data && data.user) {
            if (typeof showAlertModal === 'function') showAlertModal("Registrace úspěšná", "Registrace proběhla úspěšně! Nyní se můžete přihlásit.");
        } else {
            if (typeof showAlertModal === 'function') showAlertModal("Registrace vyžaduje potvrzení", "Zkontrolujte svůj email pro potvrzení registrace. Poté se můžete přihlásit.");
        }
        if (typeof hideAuthModal === 'function') hideAuthModal();
        if (typeof hideLoading === 'function') hideLoading();
        return { success: true };
    }
}

/**
 * Funkce pro odhlášení uživatele.
 */
async function signOutUser() {
    const confirmed = await (window.showConfirmModal ?
        showConfirmModal("Odhlásit se?", "Opravdu se chcete odhlásit?", { okText: 'Ano, odhlásit', cancelText: 'Zůstat přihlášen' }) :
        confirm("Opravdu se chcete odhlásit?")
    );

    if (confirmed) {
        if (typeof showLoading === 'function') showLoading("Odhlašování...");
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Chyba při odhlašování:', error.message);
            if (typeof showAlertModal === 'function') showAlertModal("Chyba odhlášení", `Nepodařilo se odhlásit: ${error.message}`);
            if (typeof hideLoading === 'function') hideLoading();
            return { success: false, error: error.message };
        } else {
            if (typeof showAlertModal === 'function') showAlertModal("Odhlášení", "Byli jste úspěšně odhlášeni. Pro úpravy se opět přihlaste.");
            if (typeof disableEditMode === 'function') disableEditMode(); // Voláme globální funkci
            if (typeof hideLoading === 'function') hideLoading();
            return { success: true };
        }
    }
    return { success: false, message: "Odhlášení zrušeno." };
}

// listener pro změny stavu autentizace Supabase.
// Tato funkce musí být volána po inicializaci DOM v javascript.js
// a spoléhá se na globálně dostupné funkce.
function setupSupabaseAuthStateChangeGlobal() {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log('Supabase Auth State Change:', event, session);
        if (event === 'SIGNED_OUT') {
            if (typeof disableEditMode === 'function') disableEditMode();
            localStorage.removeItem(EDIT_MODE_KEY);
            if (window.location.pathname !== '/login.html' && window.location.pathname !== '/signup.html') {
                console.log('Uživatel odhlášen, editační režim vypnut.');
                document.getElementById('login-button')?.classList.remove('hidden');
                document.getElementById('edit-mode-toggle-btn')?.classList.add('hidden');
                document.getElementById('user-id-display')?.classList.add('hidden');
            }
        } else if (event === 'SIGNED_IN') {
            console.log('Uživatel je přihlášen.');
            document.getElementById('login-button')?.classList.add('hidden');
            document.getElementById('edit-mode-toggle-btn')?.classList.remove('hidden');

            const userIdDisplaySpan = document.getElementById('firebase-user-id');
            const userIdContainer = document.getElementById('user-id-display');
            if (session && session.user && userIdDisplaySpan && userIdContainer) {
                userIdDisplaySpan.textContent = session.user.id;
                userIdContainer.classList.remove('hidden');
            }
            if (typeof initializeApp === 'function') initializeApp();
            const loadingIndicatorElement = document.getElementById('loading-indicator');
            if (loadingIndicatorElement) loadingIndicatorElement.classList.add('hidden');
            document.body.style.visibility = 'visible';

            if (localStorage.getItem(EDIT_MODE_KEY) === 'true') {
                if (typeof enableEditMode === 'function') enableEditMode();
                document.getElementById('edit-mode-toggle-btn').textContent = 'Ukončit editaci';
            } else {
                if (typeof disableEditMode === 'function') disableEditMode();
                document.getElementById('edit-mode-toggle-btn').textContent = 'Přejít do editace';
            }
        }
    });
}

// Kontrola počátečního stavu autentizace.
// Tato funkce musí být volána po inicializaci DOM v javascript.js
function checkInitialAuthStateGlobal() {
    const loadingIndicatorElement = document.getElementById('loading-indicator');
    supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
            console.error("Chyba při získávání session:", error);
            if (loadingIndicatorElement) {
                loadingIndicatorElement.textContent = `Chyba ověření: ${error.message}. Zkuste obnovit.`;
            }
            document.body.style.visibility = 'visible';
            return;
        }

        if (session) {
            console.log('Uživatel je již přihlášen:', session.user.email);
            document.getElementById('login-button')?.classList.add('hidden');
            document.getElementById('edit-mode-toggle-btn')?.classList.remove('hidden');

            const userIdDisplaySpan = document.getElementById('firebase-user-id');
            const userIdContainer = document.getElementById('user-id-display');
            if (session.user && userIdDisplaySpan && userIdContainer) {
                userIdDisplaySpan.textContent = session.user.id;
                userIdContainer.classList.remove('hidden');
            }

            if (localStorage.getItem(EDIT_MODE_KEY) === 'true') {
                if (typeof enableEditMode === 'function') enableEditMode();
                document.getElementById('edit-mode-toggle-btn').textContent = 'Ukončit editaci';
            } else {
                if (typeof disableEditMode === 'function') disableEditMode();
                document.getElementById('edit-mode-toggle-btn').textContent = 'Přejít do editace';
            }

            if (typeof initializeApp === 'function') initializeApp();
            if (loadingIndicatorElement) loadingIndicatorElement.classList.add('hidden');
            document.body.style.visibility = 'visible';
        } else {
            console.log('Uživatel není přihlášen.');
            if (typeof initializeApp === 'function') initializeApp();
            if (loadingIndicatorElement) loadingIndicatorElement.classList.add('hidden');
            document.body.style.visibility = 'visible';
            document.getElementById('login-button')?.classList.remove('hidden');
            document.getElementById('edit-mode-toggle-btn')?.classList.add('hidden');
            document.getElementById('user-id-display')?.classList.add('hidden');
            if (typeof disableEditMode === 'function') disableEditMode();
            localStorage.removeItem(EDIT_MODE_KEY);
        }
    });
}

// Zde definujeme globální funkce, které bude volat javascript.js pro autentizaci
// Protože pracujeme bez modulů, můžeme je takto "sdílet"
window.signInUser = signInUser;
window.signUpUser = signUpUser;
window.signOutUser = signOutUser;
window.setupSupabaseAuthStateChangeGlobal = setupSupabaseAuthStateChangeGlobal;
window.checkInitialAuthStateGlobal = checkInitialAuthStateGlobal;
window.supabaseClient = supabaseClient; // Aby byl supabaseClient dostupný globálně
window.EDIT_MODE_KEY = EDIT_MODE_KEY; // A také klíč pro edit mód