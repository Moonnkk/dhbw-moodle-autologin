# DHBW Moodle Auto-Login

Userscript für [moodle.dhbw.de](https://moodle.dhbw.de), das den Login automatisiert:

1. Wählt „Login für DHBW Studierende und Lehrbeauftragte“
2. Wartet, bis der Passwort-Manager Benutzername und Passwort ausgefüllt hat
3. Wählt „DHBW Mannheim“ als Studienakademie
4. Klickt auf „Anmelden“

Das Skript speichert oder liest keine Zugangsdaten – das Ausfüllen übernimmt der Passwort-Manager.
Nach einem Fehlversuch pausiert es 15 Sekunden, um Endlosschleifen zu vermeiden.

## Installation

- **Desktop (Edge/Chrome/Firefox):** [Tampermonkey](https://www.tampermonkey.net/) oder [Violentmonkey](https://violentmonkey.github.io/) installieren, neues Skript anlegen und den Inhalt von `dhbw-moodle-autologin.user.js` einfügen.
- **iPad/iPhone (Safari):** App [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) installieren, Datei in den Skript-Ordner legen, Erweiterung in den Safari-Einstellungen aktivieren.
- **Android:** Firefox mit Violentmonkey oder Tampermonkey (Chrome für Android unterstützt keine Erweiterungen).

Für eine andere Studienakademie die Konstante `ORG` im Skript anpassen.
