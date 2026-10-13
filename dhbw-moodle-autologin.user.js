// ==UserScript==
// @name         DHBW Moodle Auto-Login
// @namespace    https://moodle.dhbw.de/
// @version      1.1
// @description  Wählt den Studierenden-Login, setzt "DHBW Mannheim" und klickt auf Anmelden
// @match        https://moodle.dhbw.de/simplesaml/module.php/multiauth/discovery*
// @match        https://moodle.dhbw.de/simplesaml/module.php/core/loginuserpassorg*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const ORG = 'DHBW Mannheim';
  const WAIT_MS = 10000;     // max. Wartezeit auf den Passwort-Manager
  const LOOP_GUARD_MS = 15000; // kein erneuter Auto-Login direkt nach einem Fehlversuch

  const path = location.pathname;

  // Schritt 1: "Login für DHBW Studierende und Lehrbeauftragte" anklicken
  if (path.includes('/multiauth/discovery')) {
    const btn = [...document.querySelectorAll('button, a, input[type="submit"]')]
      .find(el => /Studierende/i.test(el.textContent || el.value || ''));
    if (btn) btn.click();
    return;
  }

  // Schritte 2-4: Zugangsdaten abwarten, Studienakademie wählen, anmelden
  if (path.includes('/core/loginuserpassorg')) {
    // Bei falschem Passwort landet man wieder hier -> nicht endlos neu absenden
    const last = Number(sessionStorage.getItem('dhbwAutoLogin') || 0);
    if (Date.now() - last < LOOP_GUARD_MS) return;

    const pass = document.querySelector('input[type="password"]');
    const form = pass && pass.form;
    if (!form) return;
    const user = form.querySelector('input[name="username"], #username, input[type="text"], input[type="email"]');

    // Die Seite hat auch ein Sprach-Dropdown -> gezielt das Dropdown mit "DHBW Mannheim" suchen
    const org = [...document.querySelectorAll('select')]
      .find(s => [...s.options].some(o => o.textContent.trim() === ORG));
    if (!user || !org) {
      console.warn('[DHBW Auto-Login] Felder oder Option "' + ORG + '" nicht gefunden.');
      return;
    }

    // Schritt 3: Studienakademie auswählen
    const selectOrg = () => {
      const opt = [...org.options].find(o => o.textContent.trim() === ORG);
      if (org.value === opt.value) return;
      org.value = opt.value;
      org.dispatchEvent(new Event('input', { bubbles: true }));
      org.dispatchEvent(new Event('change', { bubbles: true }));
    };
    selectOrg();

    const isFilled = el => {
      if (el.value.length > 0) return true;
      try { return el.matches(':autofill'); } catch (e) { /* älterer Browser */ }
      try { return el.matches(':-webkit-autofill'); } catch (e) { return false; }
    };

    // Schritt 2 übernimmt der Passwort-Manager – wir warten nur, bis er fertig ist
    const start = Date.now();
    const timer = setInterval(() => {
      if (isFilled(user) && isFilled(pass)) {
        clearInterval(timer);
        submit();
      } else if (Date.now() - start > WAIT_MS) {
        clearInterval(timer);
        console.warn('[DHBW Auto-Login] Zugangsdaten wurden nicht automatisch ausgefüllt.');
      }
    }, 200);

    // Schritt 4: "Anmelden" klicken
    function submit() {
      // Passwort-Manager oder Seite könnten das Dropdown zurückgesetzt haben -> nochmal setzen
      selectOrg();
      const btn = [...form.querySelectorAll('button, input[type="submit"]')]
        .find(el => /Anmelden|Login/i.test(el.textContent || el.value || ''));
      sessionStorage.setItem('dhbwAutoLogin', String(Date.now()));
      if (btn) btn.click();
      else form.requestSubmit();
    }
  }
})();
