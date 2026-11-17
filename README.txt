OptiDesk PWA – GitHub Pages Setup
=================================

CONTENTS
--------
This folder contains the existing OptiDesk application packaged as a
Progressive Web App (PWA), its web app manifest, service worker and launcher
icons. The application code and its LocalStorage key/data structure have not
been intentionally changed; only the PWA manifest reference and service
worker registration were added to index.html.

1. EXTRACT THE ZIP
------------------
Extract OptiDesk_PWA_GitHub_Pages.zip. Open the OptiDesk-PWA folder.

2. UPLOAD TO YOUR GITHUB REPOSITORY ROOT
----------------------------------------
Create or open your GitHub repository (for example, a repository named
"optidesk"). Upload the CONTENTS of the OptiDesk-PWA folder to the root of
that repository, not the outer OptiDesk-PWA folder itself.

The repository root should contain:
  index.html
  manifest.json
  service-worker.js
  README.txt
  icons/ (with the four PNG icons)

Keep the icons folder and its filenames unchanged.

3. ENABLE GITHUB PAGES
----------------------
In the GitHub repository, open Settings > Pages.
Under "Build and deployment", choose "Deploy from a branch".
Choose your publishing branch (commonly main) and the "/ (root)" folder,
then Save. Wait for GitHub Pages to publish the site.

For a repository named "optidesk", its project URL is normally:
  https://USERNAME.github.io/optidesk/
Replace USERNAME with your GitHub username. Use the actual repository name
and URL shown by GitHub Pages. The PWA uses relative paths, so it supports a
project URL beneath /repository-name/ rather than assuming the domain root.

4. OPEN AND INSTALL ON ANDROID CHROME
-------------------------------------
On the Android phone, open the published HTTPS URL in Chrome while online.
Allow the page to finish loading. The service worker installs and caches the
application shell. If Chrome does not show the install option immediately,
reload the page once after it has loaded, then open Chrome's three-dot menu
and choose "Install app" or "Add to Home screen" (the wording can vary by
Chrome/Android version). Confirm the installation. OptiDesk should then
launch from its own home-screen icon in a standalone window without the
normal browser address bar or tab strip.

PWA installation availability and the exact menu wording depend on the
Android/Chrome version and device policy. HTTPS is required; GitHub Pages
provides HTTPS for its published sites.

5. TEST OFFLINE
---------------
First open the published OptiDesk URL online and wait for the page to finish
loading and the service worker to install. Reload once to ensure the worker
controls the page. Then enable Airplane mode and launch OptiDesk from its
home-screen icon. The cached application shell should open offline.

The service worker caches only the app shell and same-scope static GET
resources. Customer names, phone numbers, orders, payment details, inventory
and other private records are not uploaded to a server or added to the service
worker cache. Existing app data continues to use browser LocalStorage.

IMPORTANT LOCAL DATA NOTE
------------------------
Browser LocalStorage is isolated by website origin and browser storage
context. Data previously saved while using a local HTML file or a different
website address will not automatically appear at the new GitHub Pages URL.
Before switching, use OptiDesk's existing JSON backup/export feature to save
your records, then use its existing import feature after opening the GitHub
Pages version. This package does not clear or reset existing data.

UPDATES
-------
When you publish a new version, replace the repository files. If you change
cached file names, update APP_SHELL in service-worker.js and increase the
cache version (for example, v1 to v2). The worker removes only older caches
whose names begin with "optidesk-pwa-".

TESTING SCOPE
-------------
The package was checked for HTML/JavaScript syntax, valid manifest JSON,
icon dimensions/references, relative project-path resolution and ZIP layout.
A live GitHub Pages deployment, actual Android installation, and a physical
offline-device test cannot be performed from this package-generation
runtime; complete those checks after publishing on your GitHub account.
