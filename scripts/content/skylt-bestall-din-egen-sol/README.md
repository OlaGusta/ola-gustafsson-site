# Skylt: Beställ din egen sol (A4)

Utskriftsskylt till utställningen för print av solarna i *100 dagar av sol*.

- `bestall-din-egen-sol.html` – källan. Öppna i webbläsaren och skriv ut (A4 stående, utan sidhuvud/sidfot).
- `bestall-din-egen-sol.pdf` – färdig PDF, renderad med headless Chrome:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --print-to-pdf=bestall-din-egen-sol.pdf file://$PWD/bestall-din-egen-sol.html`
- `bestall-qr.png` – QR till beställningssidan (qrco.de-länk på Olas betalkonto → /100-dagar-av-sol).
- `swish-foretag-qr.png` – officiell Swish Företag-QR (123 704 88 20), beskuren från Swish-appen. Innehåll: `https://app.swish.nu/1/p/sw/?sw=1237048820&edit=msg`.

Uppgifterna på skylten (priser, frakt 150 kr, Swish 123 704 88 20, bankkonto, leveranstid) ska stämma med sajten.
Ändras något där: uppdatera HTML-filen och rendera om PDF:en.
