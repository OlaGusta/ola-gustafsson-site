# Skylt: Poster 100 dagar av sol (A4)

Utskriftsskylt för postern med alla hundra solar, 350 kr inkl. moms, betalning med Swish på plats.

- `poster-100-dagar-av-sol.html` – källan. Öppna i webbläsaren och skriv ut (A4 stående).
- `poster-100-dagar-av-sol.pdf` – färdig PDF, renderad med headless Chrome:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --print-to-pdf=poster-100-dagar-av-sol.pdf file://$PWD/poster-100-dagar-av-sol.html`
- `swish-poster-qr.png` – Swish Företag-QR (123 704 88 20) med 350 kr låst och meddelandet "Poster 100 dagar av sol" ifyllt men ändringsbart. Hämtad från Swish egen generator:
  `curl -X POST https://mpc.getswish.net/qrg-swish/api/v1/prefilled -H 'Content-Type: application/json' -d '{"format":"png","size":900,"border":0,"payee":{"value":"1237048820","editable":false},"amount":{"value":350,"editable":false},"message":{"value":"Poster 100 dagar av sol","editable":true}}' -o swish-poster-qr.png`