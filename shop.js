// Kassan: kundvagn i webbläsaren, "Lägg i kundvagn" på verkssidan och solsidan,
// kassasidan (/kassa) och Swish-QR på ordersidan. Priserna i kundvagnen är bara
// för visning; api/shop.php räknar om allt mot katalogen när ordern skapas.
(() => {
  const STORE = 'ola-cart-v1';
  const lang = document.documentElement.lang === 'en' ? 'en' : 'sv';
  const T = (sv, en) => (lang === 'en' ? en : sv);
  const money = (amount) => `${Number(amount || 0).toLocaleString('sv-SE')} ${lang === 'en' ? 'SEK' : 'kr'}`;
  const esc = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const withLang = (path) => (lang === 'en' ? `${path}${path.includes('?') ? '&' : '?'}lang=en` : path);

  // ---- Kundvagn -----------------------------------------------------------
  const readCart = () => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORE) || '[]');
      return Array.isArray(stored) ? stored.filter((item) => item && typeof item === 'object' && item.kind) : [];
    } catch (error) {
      return [];
    }
  };
  const writeCart = (items) => {
    try {
      window.localStorage.setItem(STORE, JSON.stringify(items));
    } catch (error) {
      // Utan lagring (privat läge) lever vagnen bara i minnet.
    }
    memoryCart = items;
    renderCartLink();
  };
  let memoryCart = readCart();
  const cart = {
    items: () => memoryCart.slice(),
    count: () => memoryCart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0),
    // Ett original kan bara ligga en gång; prints och solar slås ihop per format och ram.
    add: (newItems) => {
      const items = memoryCart.slice();
      const itemKey = (item) => `${item.kind}:${item.ref}:${item.size || ''}:${item.frame || ''}:${item.id || ''}`;
      newItems.forEach((entry) => {
        const key = itemKey(entry);
        const existing = items.find((item) => itemKey(item) === key);
        if (existing) {
          if (entry.kind === 'original' || entry.kind === 'giftcard') {
            existing.mat = Boolean(entry.mat);
          } else {
            existing.qty = Math.min(20, (Number(existing.qty) || 1) + (Number(entry.qty) || 1));
          }
        } else {
          items.push({ ...entry, qty: entry.kind === 'original' ? 1 : Number(entry.qty) || 1 });
        }
      });
      writeCart(items);
    },
    remove: (index) => writeCart(memoryCart.filter((_, i) => i !== index)),
    update: (index, patch) => writeCart(memoryCart.map((item, i) => (i === index ? { ...item, ...patch } : item))),
    clear: () => writeCart([])
  };
  window.olaCart = cart;

  // Länk i huvudmenyn: "Kundvagn (2)". Visas bara när vagnen har något.
  const renderCartLink = () => {
    const nav = document.getElementById('main-nav');
    if (!nav) {
      return;
    }
    let link = nav.querySelector('[data-cart-link]');
    if (!link) {
      link = document.createElement('a');
      link.setAttribute('data-cart-link', '');
      link.className = 'cart-link';
      link.href = withLang('/kassa');
      nav.appendChild(link);
    }
    const count = cart.count();
    link.hidden = count === 0 && document.body.dataset.page !== 'checkout';
    link.textContent = count > 0 ? `${T('Kundvagn', 'Cart')} (${count})` : T('Kundvagn', 'Cart');
  };

  // ---- Lägg i kundvagn (verkssidan) ----------------------------------------
  // Ramvalet visar priset för det valda formatet: "Ekram (+600 kr)". Formatet utan rampris
  // går inte att rama.
  const syncFrameOptions = (sizeSelect, frameSelect) => {
    const price = Number((sizeSelect && sizeSelect.selectedOptions[0] && sizeSelect.selectedOptions[0].dataset.framePrice) || 0);
    Array.from(frameSelect.options).forEach((option) => {
      if (!option.value) {
        return;
      }
      option.textContent = price > 0 ? `${option.dataset.label} (+${money(price)})` : option.dataset.label;
      option.disabled = price <= 0;
    });
    if (price <= 0) {
      frameSelect.value = '';
    }
  };

  const bindAddButtons = () => {
    // Köprutans val följer med till formuläret längre ned (samma format och ram).
    document.querySelectorAll('select[data-sync-to]').forEach((source) => {
      const target = document.getElementById(source.dataset.syncTo);
      if (!target) {
        return;
      }
      source.addEventListener('change', () => {
        if (Array.from(target.options).some((option) => option.value === source.value && !option.disabled)) {
          target.value = source.value;
          target.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });

    document.querySelectorAll('select[data-frame-for]').forEach((frameSelect) => {
      const sizeSelect = document.getElementById(frameSelect.dataset.frameFor);
      syncFrameOptions(sizeSelect, frameSelect);
      if (sizeSelect) {
        sizeSelect.addEventListener('change', () => syncFrameOptions(sizeSelect, frameSelect));
      }
    });

    document.querySelectorAll('[data-shop-add]').forEach((button) => {
      button.addEventListener('click', () => {
        const kind = button.dataset.shopAdd;
        const ref = button.dataset.ref || '';
        const sizeSelect = button.dataset.sizeSelect ? document.getElementById(button.dataset.sizeSelect) : null;
        const frameSelect = button.dataset.frameSelect ? document.getElementById(button.dataset.frameSelect) : null;
        const matBox = button.dataset.matCheckbox ? document.getElementById(button.dataset.matCheckbox) : null;
        const qtySelect = button.dataset.qtySelect ? document.getElementById(button.dataset.qtySelect) : null;
        const entry = { kind, ref, qty: qtySelect ? Math.max(1, Number(qtySelect.value) || 1) : 1 };
        if (sizeSelect) {
          entry.size = sizeSelect.value;
        }
        if (matBox) {
          entry.mat = matBox.checked;
        }
        if (frameSelect && frameSelect.value) {
          entry.frame = frameSelect.value;
        }
        if (button.dataset.token) {
          entry.token = button.dataset.token;
        }
        cart.add([entry]);
        window.location.href = withLang('/kassa');
      });
    });

    // Presentkortssidan: belopp, mottagare, avsändare och hälsning.
    const giftForm = document.getElementById('giftcard-form');
    if (giftForm) {
      giftForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(giftForm);
        const choice = String(data.get('amount') || '');
        const amount = choice === 'custom' ? Math.round(Number(data.get('customAmount')) || 0) : Number(choice);
        const status = document.getElementById('giftcard-status');
        if (!(amount >= 300 && amount <= 20000)) {
          if (status) {
            status.textContent = T('Välj ett belopp mellan 300 och 20 000 kr.', 'Choose an amount between 300 and 20,000 SEK.');
            status.dataset.kind = 'error';
          }
          return;
        }
        cart.add([{
          kind: 'giftcard',
          ref: String(amount),
          amount,
          to: String(data.get('to') || '').trim().slice(0, 120),
          from: String(data.get('from') || '').trim().slice(0, 120),
          message: String(data.get('message') || '').trim().slice(0, 400),
          id: Date.now().toString(36),
          qty: 1
        }]);
        window.location.href = withLang('/kassa');
      });
      const custom = giftForm.querySelector('input[name="customAmount"]');
      if (custom) {
        custom.addEventListener('focus', () => {
          const radio = giftForm.querySelector('input[name="amount"][value="custom"]');
          if (radio) radio.checked = true;
        });
      }
    }

    // Solsidan: formuläret "Till kassan" läser de markerade solarna från sol.js.
    const sunForm = document.getElementById('sun-order-form');
    if (sunForm) {
      sunForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const picks = typeof window.olaSunPicks === 'function' ? window.olaSunPicks() : [];
        if (picks.length === 0) {
          const status = document.getElementById('sun-order-status');
          if (status) {
            status.textContent = T('Markera vilka solar du vill ha först.', 'Pick which suns you want first.');
          }
          return;
        }
        const sunFrame = document.getElementById('sun-order-frame');
        const frame = sunFrame ? sunFrame.value : '';
        cart.add(picks.map((pick) => ({ kind: 'sun', ref: String(pick.day), size: pick.size, qty: 1, ...(frame ? { frame } : {}) })));
        window.location.href = withLang('/kassa');
      });
    }
  };

  // ---- Kassasidan -----------------------------------------------------------
  const initCheckout = () => {
    const app = document.getElementById('checkout-app');
    const catalogNode = document.getElementById('shop-catalog');
    if (!app || !catalogNode) {
      return;
    }
    let catalog = { artworks: {}, sunPrints: [], frames: [], shippingPrint: 150, shippingPoster: 99, shippingFramed: 250, editionSize: 20, poster: { enabled: false, available: 0 } };
    try {
      catalog = { ...catalog, ...JSON.parse(catalogNode.textContent || '{}') };
    } catch (error) {
      // Katalogen saknas: visa tom vagn.
    }
    const turnstileSiteKey = app.dataset.turnstileSiteKey || '';
    const mountedAt = Date.now();
    let turnstileToken = '';
    let submitting = false;

    const formatKey = (value) => {
      const match = String(value || '').match(/(\d+(?:[.,]\d+)?)\s*[×x]\s*(\d+(?:[.,]\d+)?)/);
      if (!match) {
        return '';
      }
      const a = Number(match[1].replace(',', '.'));
      const b = Number(match[2].replace(',', '.'));
      return `${Math.min(a, b)}x${Math.max(a, b)}`;
    };
    const frameLabel = (format) => `${format}, ${T('utan ram', 'unframed')}`;
    const frameInfo = (key) => (catalog.frames || []).find((frame) => frame.key === key) || null;
    // "50 × 70 cm, utan ram", eller bara formatet när en ram följer på nästa rad.
    const printFormatDetail = (item, size) => (item.frame && frameInfo(item.frame) && Number(size.framePrice) > 0 ? size.format : frameLabel(size.format));
    // Ramrad under en print/sol (samma regler som shop_frame_line i shop_lib.php).
    const pushFrameLine = (lines, problems, index, item, size, forTitle) => {
      if (!item.frame) {
        return;
      }
      const frame = frameInfo(item.frame);
      if (!frame || !(Number(size.framePrice) > 0)) {
        problems.push({ index, text: T('Ram finns inte för det printformatet.', 'A frame is not available for that print size.') });
        return;
      }
      lines.push({ index, kind: 'frame', title: T(frame.titleSv, frame.titleEn), detail: `${T('till', 'for')} ${forTitle}, ${size.format}`, qty: Number(item.qty) || 1, unit: Number(size.framePrice), vat: 25, attached: true });
    };

    // Samma prisregler som shop_lib.php, för visning innan ordern skickas.
    const resolveLines = () => {
      const lines = [];
      const problems = [];
      cart.items().forEach((item, index) => {
        if (item.kind === 'original') {
          const art = catalog.artworks[item.ref];
          if (!art) {
            problems.push({ index, text: T('Verket finns inte längre.', 'The work no longer exists.') });
            return;
          }
          const viaBuyLink = art.availability === 'reserved' && art.price > 0 && typeof item.token === 'string' && item.token !== '';
          if (!art.originalForSale && !viaBuyLink) {
            problems.push({ index, text: T(`"${art.title}" är inte längre tillgänglig.`, `"${art.title}" is no longer available.`) });
            return;
          }
          lines.push({ index, kind: 'original', title: art.title, detail: `${T('Original, akvarell', 'Original, watercolour')}${art.format ? `, ${art.format}` : ''}`, qty: 1, unit: art.price, vat: 0, src: art.src, matOption: art.matPrice > 0 ? { price: art.matPrice, class: art.matClass } : null, mat: Boolean(item.mat) });
          if (item.mat && art.matPrice > 0) {
            lines.push({ index, kind: 'mat', title: `${T('Passepartout med bakstycke till', 'Mat with backing board for')} ${art.title}`, detail: `${T('Ramformat', 'Frame size')} ${art.matClass.replace('x', ' × ')} cm`, qty: 1, unit: art.matPrice, vat: 25, attached: true });
          }
          return;
        }
        if (item.kind === 'giftcard') {
          const amount = Math.round(Number(item.amount || item.ref) || 0);
          if (!(amount >= 300 && amount <= 20000)) {
            problems.push({ index, text: T('Presentkortets belopp är ogiltigt.', 'The gift card amount is not valid.') });
            return;
          }
          const detail = [T('Skickas med e-post', 'Sent by email'), item.to ? `${T('till', 'to')} ${item.to}` : ''].filter(Boolean).join(', ');
          lines.push({ index, kind: 'giftcard', title: `${T('Presentkort', 'Gift card')} ${money(amount)}`, detail, qty: Math.max(1, Number(item.qty) || 1), unit: amount, vat: 0 });
          return;
        }
        if (item.kind === 'poster') {
          const poster = catalog.poster || {};
          if (!poster.enabled || !(Number(poster.available) > 0)) {
            problems.push({ index, text: poster.enabled ? T('Postern är slutsåld.', 'The poster is sold out.') : T('Postern säljs inte just nu.', 'The poster is not for sale right now.') });
            return;
          }
          const qty = Math.min(Number(item.qty) || 1, Number(poster.available), Number(poster.maxPerOrder) || 10);
          lines.push({ index, kind: 'poster', title: poster.title, detail: poster.description || T('Tryckt poster', 'Printed poster'), qty, unit: Number(poster.price) || 0, vat: 25, src: poster.src || '', maxQty: Math.min(Number(poster.available), Number(poster.maxPerOrder) || 10) });
          return;
        }
        if (item.kind === 'print') {
          const art = catalog.artworks[item.ref];
          const size = art ? art.prints.find((p) => formatKey(p.format) === formatKey(item.size)) : null;
          if (!art || !size) {
            problems.push({ index, text: T('Printformatet finns inte.', 'The print size is not available.') });
            return;
          }
          lines.push({ index, kind: 'print', title: `Fine Art Print – ${art.title}`, detail: `${printFormatDetail(item, size)}${size.image ? ` (${T('bild ca', 'image approx.')} ${size.image})` : ''}`, qty: Number(item.qty) || 1, unit: size.price, vat: 25, src: art.src, framePrice: Number(size.framePrice) || 0, frame: item.frame || '' });
          pushFrameLine(lines, problems, index, item, size, `Fine Art Print – ${art.title}`);
          return;
        }
        if (item.kind === 'sun') {
          const day = Number(item.ref);
          const size = catalog.sunPrints.find((p) => formatKey(p.format) === formatKey(item.size));
          if (!(day >= 1 && day <= 100) || !size) {
            problems.push({ index, text: T('Solen finns inte.', 'The sun is not available.') });
            return;
          }
          lines.push({ index, kind: 'sun', title: `${T('100 dagar av sol – dag', '100 days of sun – day')} ${day}`, detail: `Fine Art Print, ${printFormatDetail(item, size)}${size.image ? ` (${T('bild ca', 'image approx.')} ${size.image})` : ''}`, qty: Number(item.qty) || 1, unit: size.price, vat: 25, src: `images/sol/thumb/dag-${String(day).padStart(3, '0')}.jpg`, framePrice: Number(size.framePrice) || 0, frame: item.frame || '' });
          pushFrameLine(lines, problems, index, item, size, `${T('100 dagar av sol – dag', '100 days of sun – day')} ${day}`);
        }
      });
      return { lines, problems };
    };

    const totals = (lines) => {
      let subtotal = 0;
      let vat = 0;
      let taxable = false;
      lines.forEach((line) => {
        const amount = line.unit * line.qty;
        subtotal += amount;
        if (line.vat > 0) {
          taxable = true;
          vat += Math.round(amount - amount / 1.25);
        }
      });
      const physical = lines.filter((line) => line.kind !== 'giftcard');
      const posterOnly = physical.length > 0 && physical.every((line) => line.kind === 'poster');
      let shipping = physical.length ? (posterOnly ? catalog.shippingPoster : catalog.shippingPrint) : 0;
      if (lines.some((line) => line.kind === 'frame')) {
        shipping = Math.max(shipping, Number(catalog.shippingFramed) || 0);
      }
      if (taxable) {
        vat += Math.round(shipping - shipping / 1.25);
      }
      const total = subtotal + shipping;
      const giftcardUsed = appliedGiftcard && !lines.some((line) => line.kind === 'giftcard') ? Math.min(appliedGiftcard.balance, total) : 0;
      return { subtotal, shipping, total, vat, giftcardUsed, due: total - giftcardUsed, physical: physical.length > 0 };
    };

    // Inlöst presentkort i kassan: {code, balance}. Sparas för sessionen.
    const GIFTCARD_STORE = 'ola-checkout-giftcard';
    let appliedGiftcard = null;
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(GIFTCARD_STORE) || 'null');
      if (stored && typeof stored.code === 'string' && Number(stored.balance) > 0) {
        appliedGiftcard = { code: stored.code, balance: Number(stored.balance) };
      }
    } catch (error) { /* ingen lagring */ }
    const setGiftcard = (value) => {
      appliedGiftcard = value;
      try {
        if (value) window.sessionStorage.setItem(GIFTCARD_STORE, JSON.stringify(value));
        else window.sessionStorage.removeItem(GIFTCARD_STORE);
      } catch (error) { /* ingen lagring */ }
    };
    const checkGiftcard = async (code, statusNode) => {
      try {
        const response = await fetch('api/giftcard.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ code, language: lang })
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload || payload.ok !== true) {
          if (statusNode) {
            statusNode.textContent = payload && payload.message ? payload.message : T('Koden kunde inte kontrolleras.', 'The code could not be checked.');
            statusNode.dataset.kind = 'error';
          }
          return;
        }
        setGiftcard({ code: payload.code, balance: Number(payload.balance) || 0 });
        render();
      } catch (error) {
        if (statusNode) {
          statusNode.textContent = T('Nätverksfel. Försök igen.', 'Network error. Please try again.');
          statusNode.dataset.kind = 'error';
        }
      }
    };

    // Kassan visar kronor (det som betalas). Har besökaren valt € eller $ (script.js) visas
    // summan i den valutan på en egen rad.
    const currencyNote = (total) => {
      const currency = window.olaCurrency || {};
      if (!currency.code || currency.code === 'SEK' || typeof currency.format !== 'function' || !(total > 0)) {
        return '';
      }
      return `<p class="field-hint checkout-currency-note" data-currency-skip>${esc(T(
        `Ca ${currency.format(total)}. Du betalar i kronor.`,
        `About ${currency.format(total)}. You pay in Swedish kronor.`
      ))}</p>`;
    };
    document.addEventListener('ola:currency-change', () => render());

    const render = () => {
      const { lines, problems } = resolveLines();
      const sums = totals(lines);
      if (lines.length === 0 && problems.length === 0) {
        app.innerHTML = `<div class="checkout-empty surface-soft"><p>${esc(T('Kundvagnen är tom.', 'Your cart is empty.'))}</p><p><a class="btn btn-primary" href="${esc(withLang('/gallery.html'))}">${esc(T('Till galleriet', 'To the gallery'))}</a> <a class="btn btn-ghost" href="${esc(withLang('/100-dagar-av-sol'))}">${esc(T('100 dagar av sol', '100 days of sun'))}</a> <a class="btn btn-ghost" href="${esc(withLang('/presentkort'))}">${esc(T('Presentkort', 'Gift card'))}</a></p></div>`;
        return;
      }
      const rows = lines
        .map((line) => {
          const thumb = line.src && !line.attached ? `<img class="checkout-thumb" src="${esc(line.src)}" alt="" loading="lazy" />` : '<span class="checkout-thumb checkout-thumb-empty"></span>';
          const qty = line.kind === 'print' || line.kind === 'sun' || line.kind === 'poster'
            ? `<label class="checkout-qty">${esc(T('Antal', 'Qty'))} <input type="number" min="1" max="${line.maxQty || 20}" value="${line.qty}" data-qty-index="${line.index}" /></label>`
            : '';
          const mat = line.kind === 'original' && line.matOption
            ? `<label class="checkout-mat"><input type="checkbox" data-mat-index="${line.index}" ${line.mat ? 'checked' : ''} /> ${esc(T('Passepartout med bakstycke', 'Mat with backing board'))} (${esc(T('ramformat', 'frame size'))} ${esc(line.matOption.class.replace('x', ' × '))} cm, +${esc(money(line.matOption.price))})</label>`
            : '';
          const frame = (line.kind === 'print' || line.kind === 'sun') && line.framePrice > 0 && (catalog.frames || []).length > 0
            ? `<label class="checkout-frame">${esc(T('Ram', 'Frame'))} <select data-frame-index="${line.index}"><option value="">${esc(T('Utan ram', 'No frame'))}</option>${catalog.frames.map((option) => `<option value="${esc(option.key)}" ${line.frame === option.key ? 'selected' : ''}>${esc(T(option.sv, option.en))} (+${esc(money(line.framePrice))})</option>`).join('')}</select></label>`
            : '';
          const remove = line.attached ? '' : `<button type="button" class="checkout-remove" data-remove-index="${line.index}">${esc(T('Ta bort', 'Remove'))}</button>`;
          return `<li class="checkout-line${line.attached ? ' is-attached' : ''}">${thumb}<div class="checkout-line-body"><strong>${esc(line.qty > 1 ? `${line.qty} × ${line.title}` : line.title)}</strong><span class="checkout-detail">${esc(line.detail)}</span>${mat}${frame}<div class="checkout-line-tools">${qty}${remove}</div></div><span class="checkout-amount">${esc(money(line.unit * line.qty))}</span></li>`;
        })
        .join('');
      const problemRows = problems
        .map((problem) => `<li class="checkout-line is-problem"><div class="checkout-line-body"><strong>${esc(problem.text)}</strong></div><button type="button" class="checkout-remove" data-remove-index="${problem.index}">${esc(T('Ta bort', 'Remove'))}</button></li>`)
        .join('');
      const canOrder = lines.length > 0 && problems.length === 0;
      const hasGiftcardLines = lines.some((line) => line.kind === 'giftcard');
      if (hasGiftcardLines && appliedGiftcard) {
        setGiftcard(null);
      }
      app.innerHTML = `
        <div class="checkout-layout">
          <section class="checkout-cart">
            <h2>${esc(T('Din kundvagn', 'Your cart'))}</h2>
            <ul class="checkout-lines">${rows}${problemRows}</ul>
            <dl class="checkout-sums">
              <div><dt>${esc(T('Varor', 'Items'))}</dt><dd>${esc(money(sums.subtotal))}</dd></div>
              ${sums.physical ? `<div><dt>${esc(T('Frakt inom Sverige', 'Shipping within Sweden'))}</dt><dd>${esc(money(sums.shipping))}</dd></div>` : ''}
              ${sums.giftcardUsed > 0 ? `<div><dt>${esc(T('Summa', 'Total'))}</dt><dd>${esc(money(sums.total))}</dd></div><div class="checkout-sum-giftcard"><dt>${esc(T('Presentkort', 'Gift card'))} ${esc(appliedGiftcard.code)} <button type="button" class="checkout-remove" data-giftcard-remove>${esc(T('Ta bort', 'Remove'))}</button></dt><dd>−${esc(money(sums.giftcardUsed))}</dd></div>` : ''}
              <div class="checkout-sum-total"><dt>${esc(T('Att betala', 'To pay'))}</dt><dd>${esc(money(sums.due))}</dd></div>
              <div class="checkout-sum-vat"><dt>${esc(T('Varav moms', 'Of which VAT'))}</dt><dd>${esc(money(sums.vat))}</dd></div>
            </dl>
            ${sums.giftcardUsed > 0 && appliedGiftcard.balance > sums.giftcardUsed ? `<p class="field-hint">${esc(T(`Kvar på presentkortet efter köpet: ${money(appliedGiftcard.balance - sums.giftcardUsed)}.`, `Left on the gift card after this purchase: ${money(appliedGiftcard.balance - sums.giftcardUsed)}.`))}</p>` : ''}
            ${!hasGiftcardLines && !appliedGiftcard ? `<details class="checkout-giftcard"><summary>${esc(T('Har du ett presentkort?', 'Have a gift card?'))}</summary><div class="checkout-giftcard-row"><input type="text" id="checkout-giftcard-code" placeholder="XXXX-XXXX-XXXX" autocomplete="off" autocapitalize="characters" aria-label="${esc(T('Presentkortets kod', 'Gift card code'))}" /><button type="button" class="btn btn-ghost" data-giftcard-apply>${esc(T('Använd', 'Apply'))}</button></div><p id="checkout-giftcard-status" class="contact-form-status" data-kind="info" aria-live="polite"></p></details>` : ''}
            ${currencyNote(sums.due)}
            <p class="field-hint" ${sums.physical ? '' : 'hidden'}>${esc(T(`Original är momsfria konstverk. Print, ram, passepartout och frakt har 25 % moms. Frakten är ${money(catalog.shippingFramed)} när en ram ingår. Vill du ha en annan ram, skriv det i meddelandet. Ram till original, hämtning och leverans utanför Sverige ordnas på förfrågan: mejla ola@olagustafsson.com.`, `Originals are VAT-exempt works of art. Prints, frames, mats and shipping carry 25% VAT. Shipping is ${money(catalog.shippingFramed)} when a frame is included. Want a different frame? Write it in the message. Frames for originals, pickup and delivery outside Sweden are arranged on request: email ola@olagustafsson.com.`))}</p>
          </section>
          <form class="checkout-form contact-form surface-soft" id="checkout-form" novalidate ${canOrder ? '' : 'hidden'}>
            <h2>${esc(T('Dina uppgifter', 'Your details'))}</h2>
            <label>${esc(T('Namn', 'Name'))}<input type="text" name="name" autocomplete="name" required /></label>
            <label>${esc(T('E-post', 'Email'))}<input type="email" name="email" autocomplete="email" required /></label>
            ${sums.physical ? `<label>${esc(T('Telefon', 'Phone'))} <small>${esc(T('(för aviseringen)', '(for delivery notice)'))}</small><input type="tel" name="phone" autocomplete="tel" /></label>` : ''}
            ${sums.physical ? `<label>${esc(T('Gatuadress', 'Street address'))}<input type="text" name="address" autocomplete="street-address" required /></label>
            <div class="checkout-form-row">
              <label>${esc(T('Postnummer', 'Postal code'))}<input type="text" name="postal" autocomplete="postal-code" inputmode="numeric" required /></label>
              <label>${esc(T('Ort', 'City'))}<input type="text" name="city" autocomplete="address-level2" required /></label>
            </div>` : `<p class="field-hint">${esc(T('Presentkortet skickas till din e-postadress när betalningen kommit in. Ingen adress behövs.', 'The gift card is sent to your email address when the payment has arrived. No address needed.'))}</p>`}
            <label>${esc(T('Meddelande', 'Message'))} <small>${esc(T('(valfritt)', '(optional)'))}</small><textarea name="note" rows="3"></textarea></label>
            <fieldset class="checkout-payment" ${sums.due > 0 ? '' : 'hidden'}>
              <legend>${esc(T('Betalsätt', 'Payment method'))}</legend>
              ${app.dataset.swish ? `<label class="checkout-payment-option"><input type="radio" name="payment" value="swish" checked /> <span><strong>Swish</strong><small>${esc(T('Du får en Swish-kod med belopp och ordernummer ifyllda.', 'You get a Swish code with the amount and order number filled in.'))}</small></span></label>` : ''}
              ${app.dataset.bank ? `<label class="checkout-payment-option"><input type="radio" name="payment" value="bank" ${app.dataset.swish ? '' : 'checked'} /> <span><strong>${esc(T('Bankkonto', 'Bank transfer'))}</strong><small>${esc(T('Överföring till', 'Transfer to'))} ${esc(app.dataset.bank)}. ${esc(T('Ordernumret som meddelande.', 'Order number as the message.'))}${app.dataset.iban ? ` ${esc(T('Från utlandet', 'From abroad'))}: IBAN ${esc(app.dataset.iban)}, BIC ${esc(app.dataset.bic)}.` : ''}</small></span></label>` : ''}
            </fieldset>
            <label class="contact-honeypot" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
            <label class="checkout-terms"><input type="checkbox" name="newsletter" /> <span>${esc(T('Skicka mig ateljébrevet om nya målningar och utställningar, några gånger om året.', 'Send me the studio letter about new paintings and exhibitions, a few times a year.'))}</span></label>
            <label class="checkout-terms"><input type="checkbox" name="terms" required /> <span>${esc(T('Jag godkänner köpvillkoren: betalning med Swish eller bankgiro inom 7 dagar, leverans inom Sverige, 14 dagars ångerrätt från mottagandet.', 'I accept the terms: payment by Swish or bank transfer within 7 days, delivery within Sweden, 14-day right of withdrawal from receipt.'))} <a href="${esc(app.dataset.termsUrl || '/#faq')}" target="_blank" rel="noopener">${esc(T('Läs mer', 'Read more'))}</a></span></label>
            <div id="checkout-turnstile" class="contact-turnstile" hidden></div>
            <p class="field-hint">${esc(T('När du skickat beställningen får du betalningsuppgifter med Swish-kod direkt på skärmen och i ett mejl. Ordern bekräftas när betalningen kommit in.', 'After sending the order you get payment details with a Swish code on screen and by email. The order is confirmed when the payment has arrived.'))}</p>
            <div class="artwork-inquiry-actions"><button class="btn btn-primary" type="submit">${esc(T('Skicka beställning', 'Send order'))}</button></div>
            <p id="checkout-status" class="contact-form-status" data-kind="info" aria-live="polite"></p>
          </form>
        </div>`;

      const giftApply = app.querySelector('[data-giftcard-apply]');
      if (giftApply) {
        const input = document.getElementById('checkout-giftcard-code');
        const go = () => {
          const code = String(input && input.value || '').trim();
          if (code) checkGiftcard(code, document.getElementById('checkout-giftcard-status'));
        };
        giftApply.addEventListener('click', go);
        if (input) input.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); go(); } });
      }
      const giftRemove = app.querySelector('[data-giftcard-remove]');
      if (giftRemove) giftRemove.addEventListener('click', () => { setGiftcard(null); render(); });

      app.querySelectorAll('[data-remove-index]').forEach((button) => button.addEventListener('click', () => { cart.remove(Number(button.dataset.removeIndex)); render(); }));
      app.querySelectorAll('[data-qty-index]').forEach((input) => input.addEventListener('change', () => { cart.update(Number(input.dataset.qtyIndex), { qty: Math.max(1, Math.min(20, Number(input.value) || 1)) }); render(); }));
      app.querySelectorAll('[data-mat-index]').forEach((box) => box.addEventListener('change', () => { cart.update(Number(box.dataset.matIndex), { mat: box.checked }); render(); }));
      app.querySelectorAll('[data-frame-index]').forEach((select) => select.addEventListener('change', () => { cart.update(Number(select.dataset.frameIndex), { frame: select.value || undefined }); render(); }));

      const form = document.getElementById('checkout-form');
      if (form && canOrder) {
        restoreCustomer(form);
        form.addEventListener('input', () => saveCustomer(form));
        form.addEventListener('submit', (event) => submitOrder(event, form, sums));
        mountTurnstile();
      }
    };

    // Kunduppgifterna sparas lokalt så att de inte försvinner om vagnen ritas om.
    const CUSTOMER_STORE = 'ola-checkout-customer';
    const saveCustomer = (form) => {
      try {
        const data = new FormData(form);
        window.sessionStorage.setItem(CUSTOMER_STORE, JSON.stringify(['name', 'email', 'phone', 'address', 'postal', 'city', 'note', 'payment'].map((key) => [key, String(data.get(key) || '')])));
      } catch (error) { /* ingen lagring */ }
    };
    const restoreCustomer = (form) => {
      try {
        const stored = JSON.parse(window.sessionStorage.getItem(CUSTOMER_STORE) || 'null');
        if (Array.isArray(stored)) {
          stored.forEach(([key, value]) => {
            const field = form.elements[key];
            if (!field) return;
            if (key === 'payment') { const radio = form.querySelector(`input[name="payment"][value="${value}"]`); if (radio) radio.checked = true; return; }
            field.value = value;
          });
        }
      } catch (error) { /* ingen lagring */ }
    };

    const setStatus = (text, kind = 'info') => {
      const node = document.getElementById('checkout-status');
      if (node) {
        node.textContent = text;
        node.dataset.kind = kind;
      }
    };

    const mountTurnstile = () => {
      const host = document.getElementById('checkout-turnstile');
      if (!host || !turnstileSiteKey) {
        return;
      }
      const renderWidget = () => {
        host.hidden = false;
        window.turnstile.render(host, {
          sitekey: turnstileSiteKey,
          callback: (token) => { turnstileToken = typeof token === 'string' ? token : ''; },
          'expired-callback': () => { turnstileToken = ''; },
          'error-callback': () => { turnstileToken = ''; }
        });
        // Rutan är 300 px bred; krymp den i smala formulär (samma som script.js).
        const fit = () => {
          const widget = host.firstElementChild;
          if (!(widget instanceof HTMLElement)) return;
          const scale = Math.min(1, host.clientWidth / 300);
          widget.style.transformOrigin = '0 0';
          widget.style.transform = scale < 1 ? `scale(${scale.toFixed(3)})` : '';
          widget.style.width = '300px';
          host.style.height = scale < 1 ? `${Math.ceil(65 * scale)}px` : '';
        };
        fit();
        window.setTimeout(fit, 300);
        if ('ResizeObserver' in window) new ResizeObserver(fit).observe(host);
      };
      if (window.turnstile && typeof window.turnstile.render === 'function') {
        renderWidget();
        return;
      }
      const existing = document.querySelector('script[data-turnstile-loader]');
      const onReady = () => {
        if (window.turnstile && typeof window.turnstile.render === 'function') renderWidget();
      };
      if (existing) {
        existing.addEventListener('load', onReady);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      script.setAttribute('data-turnstile-loader', '1');
      script.addEventListener('load', onReady);
      document.head.appendChild(script);
    };

    const submitOrder = async (event, form, sums) => {
      event.preventDefault();
      if (submitting) {
        return;
      }
      const data = new FormData(form);
      const customer = Object.fromEntries(['name', 'email', 'phone', 'address', 'postal', 'city', 'note', 'payment'].map((key) => [key, String(data.get(key) || '').trim()]));
      if (!customer.name || !customer.email || (sums.physical && (!customer.address || !customer.postal || !customer.city))) {
        setStatus(sums.physical ? T('Fyll i namn, e-post och leveransadress.', 'Fill in name, email and delivery address.') : T('Fyll i namn och e-post.', 'Fill in name and email.'), 'error');
        return;
      }
      if (!data.get('terms')) {
        setStatus(T('Godkänn köpvillkoren för att beställa.', 'Accept the terms to order.'), 'error');
        return;
      }
      if (turnstileSiteKey && !turnstileToken) {
        setStatus(T('Vänta tills verifieringen är klar, eller ladda om sidan.', 'Wait for the verification to finish, or reload the page.'), 'error');
        return;
      }
      submitting = true;
      setStatus(T('Skickar beställningen …', 'Sending the order …'));
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      try {
        const response = await fetch('api/shop.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            language: lang,
            items: cart.items(),
            customer,
            acceptTerms: true,
            newsletter: Boolean(data.get('newsletter')),
            giftcardCode: sums.giftcardUsed > 0 && appliedGiftcard ? appliedGiftcard.code : '',
            website: String(data.get('website') || ''),
            elapsedMs: Date.now() - mountedAt,
            turnstileToken
          })
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload || payload.ok !== true) {
          const message = payload && typeof payload.message === 'string' ? payload.message : T('Beställningen kunde inte skickas.', 'The order could not be sent.');
          setStatus(message, 'error');
          submitting = false;
          if (button) button.disabled = false;
          if (window.turnstile && typeof window.turnstile.reset === 'function') {
            try { window.turnstile.reset(); } catch (error) { /* ignorera */ }
            turnstileToken = '';
          }
          if (payload && payload.error === 'invalid_giftcard') { setGiftcard(null); render(); setStatus(message, 'error'); }
          if (payload && payload.error === 'invalid_cart') render();
          return;
        }
        cart.clear();
        setGiftcard(null);
        try { window.sessionStorage.removeItem(CUSTOMER_STORE); } catch (error) { /* ignorera */ }
        window.location.href = payload.path || payload.url;
      } catch (error) {
        setStatus(T('Nätverksfel. Försök igen.', 'Network error. Please try again.'), 'error');
        submitting = false;
        if (button) button.disabled = false;
      }
    };

    render();
  };


  // Ordersidan: kunden kan avbryta en obetald beställning.
  const initOrderCancel = () => {
    const button = document.querySelector('[data-order-cancel]');
    if (!button) {
      return;
    }
    button.addEventListener('click', async () => {
      if (!window.confirm(T('Avbryta beställningen? Reserverade verk släpps och ingenting debiteras.', 'Cancel the order? Reserved works are released and nothing is charged.'))) {
        return;
      }
      button.disabled = true;
      try {
        const response = await fetch('api/order-cancel.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ token: button.dataset.orderCancel })
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload || payload.ok !== true) {
          window.alert(payload && payload.message ? payload.message : T('Beställningen kunde inte avbrytas.', 'The order could not be cancelled.'));
          button.disabled = false;
          return;
        }
        window.location.reload();
      } catch (error) {
        button.disabled = false;
      }
    });
  };

  // ---- Ateljébrevet ---------------------------------------------------------
  // Anmälningsrutor: i sidfoten på publika sidor och i [data-newsletter-slot]
  // (sålda verk, /ateljebrev). Dubbel bekräftelse sköts av api/newsletter.php.
  const NEWSLETTER_PITCH = T(
    'Några gånger om året skickar jag ett brev om nya målningar och utställningar. Nya original visar jag i brevet innan de kommer ut på sajten.',
    'A few times a year I send a letter about new paintings and exhibitions. New originals are shown in the letter before they appear on the site.'
  );
  const newsletterForm = (variant, source) => {
    const unsubscribe = variant === 'unsubscribe';
    const heading = variant === 'footer'
      ? `<h2 class="newsletter-heading">${esc(T('Ateljébrev', 'Studio letter'))}</h2><p class="newsletter-pitch">${esc(NEWSLETTER_PITCH)}</p>`
      : variant === 'sold'
        ? `<p class="newsletter-pitch">${esc(T('Vill du veta när jag målar något liknande? Anmäl dig till ateljébrevet. Nya original visar jag där innan de kommer ut på sajten.', 'Want to know when I paint something similar? Sign up for the studio letter. New originals are shown there before they appear on the site.'))}</p>`
        : '';
    return `<form class="newsletter-form newsletter-form-${esc(variant)}" novalidate data-newsletter-form data-action="${unsubscribe ? 'unsubscribe_request' : 'subscribe'}" data-source="${esc(source)}">
      ${heading}
      <div class="newsletter-row">
        <input type="email" name="email" required autocomplete="email" placeholder="${esc(T('Din e-postadress', 'Your email address'))}" aria-label="${esc(T('E-postadress', 'Email address'))}" />
        <button type="submit" class="btn btn-primary">${esc(unsubscribe ? T('Skicka länk', 'Send link') : T('Anmäl mig', 'Sign me up'))}</button>
      </div>
      <label class="contact-honeypot" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
      <p class="contact-form-status newsletter-status" data-kind="info" aria-live="polite"></p>
    </form>`;
  };
  const bindNewsletterForm = (form) => {
    const mountedAt = Date.now();
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.newsletter-status');
      const setNote = (text, kind) => { if (status) { status.textContent = text; status.dataset.kind = kind; } };
      const data = new FormData(form);
      const email = String(data.get('email') || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setNote(T('Skriv en giltig e-postadress.', 'Enter a valid email address.'), 'error');
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      try {
        const response = await fetch('api/newsletter.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ action: form.dataset.action, email, language: lang, source: form.dataset.source || '', website: String(data.get('website') || ''), elapsedMs: Date.now() - mountedAt })
        });
        const payload = await response.json().catch(() => null);
        setNote(payload && payload.message ? payload.message : T('Något gick fel. Försök igen.', 'Something went wrong. Please try again.'), response.ok && payload && payload.ok ? 'success' : 'error');
        if (response.ok && payload && payload.ok) form.reset();
      } catch (error) {
        setNote(T('Nätverksfel. Försök igen.', 'Network error. Please try again.'), 'error');
      }
      if (button) button.disabled = false;
    });
  };
  const initNewsletter = () => {
    document.querySelectorAll('[data-newsletter-pitch]').forEach((node) => { node.textContent = NEWSLETTER_PITCH; });
    document.querySelectorAll('[data-newsletter-slot]').forEach((slot) => {
      slot.innerHTML = newsletterForm(slot.dataset.newsletterSlot || 'page', slot.dataset.newsletterSource || '');
    });
    const page = document.body.dataset.page || '';
    const footer = document.querySelector('.site-footer');
    if (footer && !['checkout', 'order', 'giftcard-card', 'newsletter'].includes(page) && !document.querySelector('[data-newsletter-slot="sold"]')) {
      const block = document.createElement('div');
      block.className = 'container footer-newsletter';
      block.innerHTML = newsletterForm('footer', `sidfot:${page || 'sida'}`);
      footer.prepend(block);
    }
    document.querySelectorAll('[data-newsletter-form]').forEach(bindNewsletterForm);
  };

  const start = () => {
    renderCartLink();
    initNewsletter();
    bindAddButtons();
    initCheckout();
    initOrderCancel();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
