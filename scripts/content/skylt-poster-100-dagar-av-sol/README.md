# Skylt: Poster 100 dagar av sol (A4)

Utskriftsskylt för postern med alla hundra solar, 350 kr inkl. moms, betalning med Swish på plats.

- `poster-100-dagar-av-sol.html` – källan. Öppna i webbläsaren och skriv ut (A4 stående).
- `poster-100-dagar-av-sol.pdf` – färdig PDF, renderad med headless Chrome:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --print-to-pdf=poster-100-dagar-av-sol.pdf file://$PWD/poster-100-dagar-av-sol.html`
- `swish-poster-qr.png` – Swish-QR (Swish Företag 123 704 88 20) med belopp och meddelande ifyllda, som Swish-länk så att den fungerar både i kameran och i Swish-appen:
  `https://app.swish.nu/1/p/sw/?sw=1237048820&amt=350&cur=SEK&msg=Poster%20100%20dagar%20av%20sol&edit=msg`
  Ny kod: `~/.npm/_npx/*/node_modules/.bin/qrcode -o swish-poster-qr.png -w 900 -m 2 -e M "<länken>" </dev/null`
