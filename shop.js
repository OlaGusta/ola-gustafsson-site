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
    // Ett original kan bara ligga en gång; prints och solar slås ihop per format.
    add: (newItems) => {
      const items = memoryCart.slice();
      newItems.forEach((entry) => {
        const key = `${entry.kind}:${entry.ref}:${entry.size || ''}`;
        const existing = items.find((item) => `${item.kind}:${item.ref}:${item.size || ''}` === key);
        if (existing) {
          if (entry.kind === 'original') {
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
  const bindAddButtons = () => {
    document.querySelectorAll('[data-shop-add]').forEach((button) => {
      button.addEventListener('click', () => {
        const kind = button.dataset.shopAdd;
        const ref = button.dataset.ref || '';
        const sizeSelect = button.dataset.sizeSelect ? document.getElementById(button.dataset.sizeSelect) : null;
        const matBox = button.dataset.matCheckbox ? document.getElementById(button.dataset.matCheckbox) : null;
        const entry = { kind, ref, qty: 1 };
        if (sizeSelect) {
          entry.size = sizeSelect.value;
        }
        if (matBox) {
          entry.mat = matBox.checked;
        }
        cart.add([entry]);
        window.location.href = withLang('/kassa');
      });
    });

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
        cart.add(picks.map((pick) => ({ kind: 'sun', ref: String(pick.day), size: pick.size, qty: 1 })));
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
    let catalog = { artworks: {}, sunPrints: [], shippingPrint: 150, editionSize: 20 };
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
    const frameLabel = (format) => `${T('Ram', 'Frame')} ${format}`;

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
          if (!art.originalForSale) {
            problems.push({ index, text: T(`"${art.title}" är inte längre tillgänglig.`, `"${art.title}" is no longer available.`) });
            return;
          }
          lines.push({ index, kind: 'original', title: art.title, detail: `${T('Original, akvarell', 'Original, watercolour')}${art.format ? `, ${art.format}` : ''}`, qty: 1, unit: art.price, vat: 0, src: art.src, matOption: art.matPrice > 0 ? { price: art.matPrice, class: art.matClass } : null, mat: Boolean(item.mat) });
          if (item.mat && art.matPrice > 0) {
            lines.push({ index, kind: 'mat', title: `${T('Passepartout med bakstycke till', 'Mat with backing board for')} ${art.title}`, detail: `${T('Ramformat', 'Frame size')} ${art.matClass.replace('x', ' × ')} cm`, qty: 1, unit: art.matPrice, vat: 25, attached: true });
          }
          return;
        }
        if (item.kind === 'print') {
          const art = catalog.artworks[item.ref];
          const size = art ? art.prints.find((p) => formatKey(p.format) === formatKey(item.size)) : null;
          if (!art || !size) {
            problems.push({ index, text: T('Printformatet finns inte.', 'The print size is not available.') });
            return;
          }
          lines.push({ index, kind: 'print', title: `Fine Art Print – ${art.title}`, detail: `${frameLabel(size.format)}${size.image ? ` (${T('bild', 'image')} ${size.image})` : ''}`, qty: Number(item.qty) || 1, unit: size.price, vat: 25, src: art.src });
          return;
        }
        if (item.kind === 'sun') {
          const day = Number(item.ref);
          const size = catalog.sunPrints.find((p) => formatKey(p.format) === formatKey(item.size));
          if (!(day >= 1 && day <= 100) || !size) {
            problems.push({ index, text: T('Solen finns inte.', 'The sun is not available.') });
            return;
          }
          lines.push({ index, kind: 'sun', title: `${T('100 dagar av sol – dag', '100 days of sun – day')} ${day}`, detail: `Fine Art Print, ${frameLabel(size.format)}${size.image ? ` (${T('bild', 'image')} ${size.image})` : ''}`, qty: Number(item.qty) || 1, unit: size.price, vat: 25, src: `images/sol/thumb/dag-${String(day).padStart(3, '0')}.jpg` });
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
      const shipping = lines.length ? catalog.shippingPrint : 0;
      if (taxable) {
        vat += Math.round(shipping - shipping / 1.25);
      }
      return { subtotal, shipping, total: subtotal + shipping, vat };
    };

    const render = () => {
      const { lines, problems } = resolveLines();
      const sums = totals(lines);
      if (lines.length === 0 && problems.length === 0) {
        app.innerHTML = `<div class="checkout-empty surface-soft"><p>${esc(T('Kundvagnen är tom.', 'Your cart is empty.'))}</p><p><a class="btn btn-primary" href="${esc(withLang('/gallery.html'))}">${esc(T('Till galleriet', 'To the gallery'))}</a> <a class="btn btn-ghost" href="${esc(withLang('/100-dagar-av-sol'))}">${esc(T('100 dagar av sol', '100 days of sun'))}</a></p></div>`;
        return;
      }
      const rows = lines
        .map((line) => {
          const thumb = line.src && !line.attached ? `<img class="checkout-thumb" src="${esc(line.src)}" alt="" loading="lazy" />` : '<span class="checkout-thumb checkout-thumb-empty"></span>';
          const qty = line.kind === 'print' || line.kind === 'sun'
            ? `<label class="checkout-qty">${esc(T('Antal', 'Qty'))} <input type="number" min="1" max="20" value="${line.qty}" data-qty-index="${line.index}" /></label>`
            : '';
          const mat = line.kind === 'original' && line.matOption
            ? `<label class="checkout-mat"><input type="checkbox" data-mat-index="${line.index}" ${line.mat ? 'checked' : ''} /> ${esc(T('Passepartout med bakstycke', 'Mat with backing board'))} (${esc(T('ramformat', 'frame size'))} ${esc(line.matOption.class.replace('x', ' × '))} cm, +${esc(money(line.matOption.price))})</label>`
            : '';
          const remove = line.attached ? '' : `<button type="button" class="checkout-remove" data-remove-index="${line.index}">${esc(T('Ta bort', 'Remove'))}</button>`;
          return `<li class="checkout-line${line.attached ? ' is-attached' : ''}">${thumb}<div class="checkout-line-body"><strong>${esc(line.qty > 1 ? `${line.qty} × ${line.title}` : line.title)}</strong><span class="checkout-detail">${esc(line.detail)}</span>${mat}<div class="checkout-line-tools">${qty}${remove}</div></div><span class="checkout-amount">${esc(money(line.unit * line.qty))}</span></li>`;
        })
        .join('');
      const problemRows = problems
        .map((problem) => `<li class="checkout-line is-problem"><div class="checkout-line-body"><strong>${esc(problem.text)}</strong></div><button type="button" class="checkout-remove" data-remove-index="${problem.index}">${esc(T('Ta bort', 'Remove'))}</button></li>`)
        .join('');
      const canOrder = lines.length > 0 && problems.length === 0;
      app.innerHTML = `
        <div class="checkout-layout">
          <section class="checkout-cart">
            <h2>${esc(T('Din kundvagn', 'Your cart'))}</h2>
            <ul class="checkout-lines">${rows}${problemRows}</ul>
            <dl class="checkout-sums">
              <div><dt>${esc(T('Varor', 'Items'))}</dt><dd>${esc(money(sums.subtotal))}</dd></div>
              <div><dt>${esc(T('Frakt inom Sverige', 'Shipping within Sweden'))}</dt><dd>${esc(money(sums.shipping))}</dd></div>
              <div class="checkout-sum-total"><dt>${esc(T('Att betala', 'To pay'))}</dt><dd>${esc(money(sums.total))}</dd></div>
              <div class="checkout-sum-vat"><dt>${esc(T('Varav moms', 'Of which VAT'))}</dt><dd>${esc(money(sums.vat))}</dd></div>
            </dl>
            <p class="field-hint">${esc(T('Original är momsfria konstverk. Print, passepartout och frakt har 25 % moms. Ram (passepartout ingår), hämtning och leverans utanför Sverige ordnas på förfrågan: mejla ola@olagustafsson.com.', 'Originals are VAT-exempt works of art. Prints, mats and shipping carry 25% VAT. Frames (mat included), pickup and delivery outside Sweden are arranged on request: email ola@olagustafsson.com.'))}</p>
          </section>
          <form class="checkout-form contact-form surface-soft" id="checkout-form" novalidate ${canOrder ? '' : 'hidden'}>
            <h2>${esc(T('Dina uppgifter', 'Your details'))}</h2>
            <label>${esc(T('Namn', 'Name'))}<input type="text" name="name" autocomplete="name" required /></label>
            <label>${esc(T('E-post', 'Email'))}<input type="email" name="email" autocomplete="email" required /></label>
            <label>${esc(T('Telefon', 'Phone'))} <small>${esc(T('(för aviseringen)', '(for delivery notice)'))}</small><input type="tel" name="phone" autocomplete="tel" /></label>
            <label>${esc(T('Gatuadress', 'Street address'))}<input type="text" name="address" autocomplete="street-address" required /></label>
            <div class="checkout-form-row">
              <label>${esc(T('Postnummer', 'Postal code'))}<input type="text" name="postal" autocomplete="postal-code" inputmode="numeric" required /></label>
              <label>${esc(T('Ort', 'City'))}<input type="text" name="city" autocomplete="address-level2" required /></label>
            </div>
            <label>${esc(T('Meddelande', 'Message'))} <small>${esc(T('(valfritt)', '(optional)'))}</small><textarea name="note" rows="3"></textarea></label>
            <label class="contact-honeypot" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label>
            <label class="checkout-terms"><input type="checkbox" name="terms" required /> <span>${esc(T('Jag godkänner köpvillkoren: betalning med Swish eller bankgiro inom 7 dagar, leverans inom Sverige, 14 dagars ångerrätt från mottagandet.', 'I accept the terms: payment by Swish or bank transfer within 7 days, delivery within Sweden, 14-day right of withdrawal from receipt.'))} <a href="${esc(app.dataset.termsUrl || '/#faq')}" target="_blank" rel="noopener">${esc(T('Läs mer', 'Read more'))}</a></span></label>
            <div id="checkout-turnstile" class="contact-turnstile" hidden></div>
            <p class="field-hint">${esc(T('När du skickat beställningen får du betalningsuppgifter med Swish-kod direkt på skärmen och i ett mejl. Ordern bekräftas när betalningen kommit in.', 'After sending the order you get payment details with a Swish code on screen and by email. The order is confirmed when the payment has arrived.'))}</p>
            <div class="artwork-inquiry-actions"><button class="btn btn-primary" type="submit">${esc(T('Skicka beställning', 'Send order'))}</button></div>
            <p id="checkout-status" class="contact-form-status" data-kind="info" aria-live="polite"></p>
          </form>
        </div>`;

      app.querySelectorAll('[data-remove-index]').forEach((button) => button.addEventListener('click', () => { cart.remove(Number(button.dataset.removeIndex)); render(); }));
      app.querySelectorAll('[data-qty-index]').forEach((input) => input.addEventListener('change', () => { cart.update(Number(input.dataset.qtyIndex), { qty: Math.max(1, Math.min(20, Number(input.value) || 1)) }); render(); }));
      app.querySelectorAll('[data-mat-index]').forEach((box) => box.addEventListener('change', () => { cart.update(Number(box.dataset.matIndex), { mat: box.checked }); render(); }));

      const form = document.getElementById('checkout-form');
      if (form && canOrder) {
        restoreCustomer(form);
        form.addEventListener('input', () => saveCustomer(form));
        form.addEventListener('submit', (event) => submitOrder(event, form, lines));
        mountTurnstile();
      }
    };

    // Kunduppgifterna sparas lokalt så att de inte försvinner om vagnen ritas om.
    const CUSTOMER_STORE = 'ola-checkout-customer';
    const saveCustomer = (form) => {
      try {
        const data = new FormData(form);
        window.sessionStorage.setItem(CUSTOMER_STORE, JSON.stringify(['name', 'email', 'phone', 'address', 'postal', 'city', 'note'].map((key) => [key, String(data.get(key) || '')])));
      } catch (error) { /* ingen lagring */ }
    };
    const restoreCustomer = (form) => {
      try {
        const stored = JSON.parse(window.sessionStorage.getItem(CUSTOMER_STORE) || 'null');
        if (Array.isArray(stored)) {
          stored.forEach(([key, value]) => { const field = form.elements[key]; if (field) field.value = value; });
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

    const submitOrder = async (event, form, lines) => {
      event.preventDefault();
      if (submitting) {
        return;
      }
      const data = new FormData(form);
      const customer = Object.fromEntries(['name', 'email', 'phone', 'address', 'postal', 'city', 'note'].map((key) => [key, String(data.get(key) || '').trim()]));
      if (!customer.name || !customer.email || !customer.address || !customer.postal || !customer.city) {
        setStatus(T('Fyll i namn, e-post och leveransadress.', 'Fill in name, email and delivery address.'), 'error');
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
          if (payload && payload.error === 'invalid_cart') render();
          return;
        }
        cart.clear();
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


  const start = () => {
    renderCartLink();
    bindAddButtons();
    initCheckout();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
