# Skylt: Poster 100 dagar av sol (A4)

Utskriftsskylt för postern med alla hundra solar, 350 kr inkl. moms, betalning med Swish på plats.

- `poster-100-dagar-av-sol.html` – källan. Öppna i webbläsaren och skriv ut (A4 stående).
- `poster-100-dagar-av-sol.pdf` – färdig PDF, renderad med headless Chrome:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --print-to-pdf=poster-100-dagar-av-sol.pdf file://$PWD/poster-100-dagar-av-sol.html`
- `swish-poster-qr.png` – Swish-QR med belopp och meddelande ifyllda. Innehåll (Swish C-format):
  `C0704333674;350;Poster 100 dagar av sol;4` – nummer och belopp låsta, meddelandet går att ändra (4 = MESSAGE_EDITABLE).
  Ny kod: `npx --yes qrcode -o swish-poster-qr.png -w 900 -m 2 -e M "C0704333674;350;Poster 100 dagar av sol;4"`

Byts Swish-nummer eller pris: generera om QR-koden, uppdatera HTML-filen och rendera om PDF:en.
