PHYSIO TRAINER OFFLINE 1.0.0
=============================

Diese Version benötigt beim Training KEINEN Windows-PC und keinen lokalen Server.

Direkt auf dem iPhone gespeichert:
- Übungen
- Trainingspläne
- Historie
- Einstellungen
- Fotos
- Videos

Technik:
- IndexedDB für lokale Daten und Medien
- Service Worker für Offline-Betrieb
- installierbare Home-Screen-Web-App
- aktive Trainings werden lokal wiederhergestellt
- Vollbackup inkl. Medien möglich

Für die ERSTE Installation braucht die App einmal eine kostenlose HTTPS-Adresse.
Eine eigene Domain ist nicht nötig. Das Paket ist direkt für GitHub Pages oder
Cloudflare Pages vorbereitet.

Danach:
Safari -> kostenlose Webadresse -> Teilen -> Zum Home-Bildschirm.
Nach erfolgreicher Installation funktioniert das Training offline und ohne PC.

Die Webadresse enthält nur die Programmdateien.
Persönliche Trainingsdaten, Fotos und Videos bleiben lokal auf dem iPhone.


UPDATE 1.1.0
============
- Versionsnummer direkt im Kopfbereich
- automatische Prüfung auf neue Version über version.json
- Hinweis "Neue Version verfügbar" mit "Jetzt aktualisieren"
- Dynamic-Island-Schutz verbessert
- black-translucent Statusleiste entfernt, damit Inhalt nicht unter iOS-Systemflächen liegt
- TV-Modus mit größerer seitlicher Safe-Zone
- Navbar am iPhone starr ganz unten fixiert
- Soundfehler im Offline-/App-Modus korrigiert:
  Audiodateien verwenden keine wechselnden Netzwerk-Query-URLs mehr
- Service Worker behandelt Audio cache-sicher und offline
- Pausendauer-Sprachansage korrigiert
- "Ton testen / aktivieren" testet Signalton + "Weiter"

WIE KÜNFTIGE UPDATES FUNKTIONIEREN
==================================
Ab Version 1.1.0 prüft die App bei Internetverbindung version.json.
Wenn auf GitHub eine neuere Version liegt, erscheint in der App:
"Neue Version verfügbar" -> "Jetzt aktualisieren".

Die lokalen Trainingsdaten in IndexedDB werden dadurch nicht ersetzt.
Vor größeren Updates bleibt ein Vollbackup trotzdem empfohlen.


UPDATE 1.1.1 – IPHONE HOME-SCREEN UPDATE-REPARATUR
===================================================
Problem:
Safari kann bereits die neue GitHub-Pages-Version zeigen, während die
installierte Home-Screen-Web-App noch die alte Version aus ihrem App-Cache
verwendet.

Neu:
- Home-Screen-App prüft version.json mit no-store
- bei neuer Version wird der alte Physio-Service-Worker abgemeldet
- nur Caches mit Namen "physio-trainer-shell-..." werden gelöscht
- IndexedDB wird NICHT gelöscht
- Übungen, Pläne, Historie, Fotos und Videos bleiben erhalten
- anschließend wird index.html mit einer Cache-Busting-URL neu geladen
- unter Backup & Speicher gibt es zusätzlich "App-Update reparieren"

WICHTIG:
Die Update-Reparatur löscht NICHT den lokalen Trainingsdatenbestand.
Vor größeren Änderungen bleibt ein Vollbackup trotzdem empfehlenswert.


UPDATE 1.1.2 – OFFLINE-STATUS
==============================
Behoben:
Im Reiter Backup konnte dauerhaft "Offline-Funktion wird vorbereitet ..."
stehen bleiben, obwohl die App bereits registriert war.

Ursache:
iOS kann navigator.serviceWorker.ready in einer Home-Screen-Web-App sehr
lange offen halten.

Jetzt:
- Statusprüfung hat kein endloses Warten mehr
- "Offline-App bereit" wenn Service Worker + Cache aktiv sind
- "Offline-Dateien gespeichert" wenn Cache vorhanden, Worker aber erst
  beim nächsten Start vollständig übernimmt
- verständliche Fehlermeldung, wenn die Einrichtung fehlt
- Button "Offline-Status prüfen"
- erneute Prüfung beim Zurückkehren in die App
