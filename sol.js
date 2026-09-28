// Solsidan (/100-dagar-av-sol): storbildsvisning, markering av solar och
// synk med beställningsformulärets dagfält. Själva sändningen sköts av
// initArtworkInquiryForm i script.js (samma formulär-id som verkssidan).
(() => {
  const SUN_COUNT = 100;
  const grid = document.getElementById('sun-grid');
  if (!grid) {
    return;
  }
  const isEnglish = document.documentElement.lang === 'en';
  const dayLabel = document.body.dataset.dayLabel || 'Dag';
  const viewer = document.getElementById('sun-viewer');
  const viewerImage = document.getElementById('sun-viewer-image');
  const viewerDay = document.getElementById('sun-viewer-day');
  const viewerPick = document.getElementById('sun-viewer-pick');
  const daysInput = document.getElementById('sun-order-days');
  const summary = document.getElementById('sun-order-summary');
  const form = document.getElementById('artwork-inquiry-form');
  const titleField = form ? form.querySelector('input[name="inquiryTitle"]') : null;
  const priceField = form ? form.querySelector('input[name="inquiryPriceLabel"]') : null;
  const sizeSelect = document.getElementById('sun-order-size');
  const titleBase = titleField ? titleField.dataset.titleBase || titleField.value : '';
  const removeLabel = document.body.dataset.removeLabel || 'Ta bort dag';
  const pickedLists = ['sun-picked-form', 'sun-picked-tray'].map((id) => document.getElementById(id)).filter(Boolean);
  const tray = document.getElementById('sun-tray');
  const trayCount = document.getElementById('sun-tray-count');
  const trayTotal = document.getElementById('sun-tray-total');
  const totalBox = document.getElementById('sun-order-total');
  const totalLines = document.getElementById('sun-order-lines');
  const totalSum = document.getElementById('sun-order-sum');
  const orderSection = document.getElementById('bestall');
  let orderInView = false;
  // Vald dag -> format (värdet i formatväljaren). Varje sol kan ha eget format.
  const picks = new Map();
  const sizeOptions = sizeSelect
    ? Array.from(sizeSelect.options).map((option) => ({ value: option.value, price: option.dataset.price || '' }))
    : [];
  const defaultSize = () => (sizeSelect ? sizeSelect.value : '');
  const priceNumber = (label) => Number(String(label || '').replace(/[^0-9]/g, '')) || 0;
  const formatAmount = (amount) =>
    `${amount.toLocaleString('sv-SE')} ${isEnglish ? 'SEK' : 'kr'}`;
  // Kompakt etikett under miniatyren: "30 × 40 cm" -> "30×40".
  const sizeLabel = (value) => value.replace(/\s*cm$/, '').replace(/\s*×\s*/g, '×');
  let currentDay = 0;

  const parseDays = (value) => {
    const days = new Set();
    String(value || '')
      .split(/[^0-9-]+/)
      .filter(Boolean)
      .forEach((part) => {
        const range = part.match(/^(\d+)-(\d+)$/);
        if (range) {
          const from = Math.min(Number(range[1]), Number(range[2]));
          const to = Math.min(Math.max(Number(range[1]), Number(range[2])), SUN_COUNT);
          for (let d = Math.max(from, 1); d <= to; d += 1) {
            days.add(d);
          }
          return;
        }
        const day = Number(part.replace(/-/g, ''));
        if (Number.isInteger(day) && day >= 1 && day <= SUN_COUNT) {
          days.add(day);
        }
      });
    return days;
  };

  const sortedPicks = () => Array.from(picks.keys()).sort((a, b) => a - b);

  // 3, 10, 11, 12 -> "3, 10–12" så att titeln håller sig under API:ts 255 tecken.
  const compactDays = (list) => {
    const parts = [];
    for (let i = 0; i < list.length; i += 1) {
      let end = i;
      while (end + 1 < list.length && list[end + 1] === list[end] + 1) {
        end += 1;
      }
      parts.push(end - i >= 2 ? `${list[i]}–${list[end]}` : list.slice(i, end + 1).join(', '));
      i = end;
    }
    return parts.join(', ');
  };

  // Miniatyrer av valda solar: i formuläret och i listen längst ned i fönstret.
  const renderPicked = (list) => {
    const markupFor = (withSize) =>
      list
        .map((day) => {
          const thumb = document.querySelector(`#dag-${day} img`);
          const src = thumb ? thumb.getAttribute('src') : '';
          const chosen = picks.get(day);
          const sizeControl = withSize && sizeOptions.length > 1
            ? `<select class="sun-picked-size" data-sun-size="${day}" aria-label="${isEnglish ? 'Size for day' : 'Format för dag'} ${day}">${sizeOptions
                .map((option) => `<option value="${option.value}"${option.value === chosen ? ' selected' : ''}>${sizeLabel(option.value)}</option>`)
                .join('')}</select>`
            : '';
          return `<li class="sun-picked-item">
          <button type="button" class="sun-picked-open" data-sun-open="${day}" aria-label="${dayLabel} ${day}">
            <img src="${src}" alt="" width="40" height="60" />
            <span>${day}</span>
          </button>
          <button type="button" class="sun-picked-remove" data-sun-unpick="${day}" aria-label="${removeLabel} ${day}">×</button>
          ${sizeControl}
        </li>`;
        })
        .join('');
    pickedLists.forEach((node) => {
      const isForm = node.id === 'sun-picked-form';
      node.innerHTML = markupFor(isForm);
      if (isForm) {
        node.hidden = list.length === 0;
      }
    });
    if (trayCount) {
      trayCount.textContent = String(list.length);
    }
    updateTray();
  };

  const updateTray = () => {
    if (tray) {
      tray.hidden = picks.size === 0 || orderInView;
    }
  };

  pickedLists.forEach((node) => {
    node.addEventListener('change', (event) => {
      const select = event.target.closest('[data-sun-size]');
      if (select) {
        picks.set(Number(select.dataset.sunSize), select.value);
        updateOrderFields(sortedPicks());
      }
    });
    node.addEventListener('click', (event) => {
      const remove = event.target.closest('[data-sun-unpick]');
      if (remove) {
        setPick(Number(remove.dataset.sunUnpick), false);
        return;
      }
      const opener = event.target.closest('[data-sun-open]');
      if (opener) {
        show(Number(opener.dataset.sunOpen));
      }
    });
  });

  if (orderSection && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      orderInView = entries.some((entry) => entry.isIntersecting);
      updateTray();
    }).observe(orderSection);
  }

  const render = ({ fromInput = false } = {}) => {
    grid.querySelectorAll('[data-sun-pick]').forEach((box) => {
      const day = Number(box.dataset.sunPick);
      box.checked = picks.has(day);
      box.closest('.sun-tile')?.classList.toggle('is-picked', picks.has(day));
    });
    if (viewerPick && currentDay) {
      viewerPick.checked = picks.has(currentDay);
    }
    const list = sortedPicks();
    renderPicked(list);
    if (daysInput && !fromInput) {
      daysInput.value = list.join(', ');
    }
    updateOrderFields(list);
  };

  // Summa, titel och prisetikett. Solarna grupperas per format, t.ex.
  // "30 × 40 cm: dag 3, 37 · 50 × 70 cm: dag 88" (syns i mejlet och i Studio).
  const updateOrderFields = (list) => {
    const groups = sizeOptions
      .map((option) => ({ ...option, days: list.filter((day) => picks.get(day) === option.value) }))
      .filter((group) => group.days.length > 0);
    const total = groups.reduce((sum, group) => sum + priceNumber(group.price) * group.days.length, 0);
    if (summary) {
      summary.textContent =
        list.length === 0
          ? ''
          : isEnglish
            ? `${list.length} ${list.length === 1 ? 'sun' : 'suns'} selected`
            : `${list.length} ${list.length === 1 ? 'sol vald' : 'solar valda'}`;
    }
    // Totalsumma: en rad per format ("2 × Ram 30 × 40 cm à 1 800 kr   3 600 kr") och summan.
    if (totalBox && totalLines && totalSum) {
      totalBox.hidden = list.length === 0;
      const frame = isEnglish ? 'Frame' : 'Ram';
      const onRequest = isEnglish ? 'price on request' : 'pris på förfrågan';
      totalLines.innerHTML = groups
        .map((group) => {
          const unit = priceNumber(group.price);
          const amount = unit ? formatAmount(unit * group.days.length) : onRequest;
          return `<li><span>${group.days.length} × ${frame} ${group.value}${unit ? ` à ${group.price}` : ''}</span><span>${amount}</span></li>`;
        })
        .join('');
      totalSum.textContent = total > 0 ? formatAmount(total) : onRequest;
    }
    if (trayTotal) {
      trayTotal.textContent = total > 0 ? ` · ${formatAmount(total)}` : '';
    }
    if (titleField) {
      const days = groups
        .map((group) => `${group.value}: ${dayLabel.toLowerCase()} ${compactDays(group.days)}`)
        .join(' · ');
      titleField.value = days ? `${titleBase} – ${days}` : titleBase;
    }
    if (priceField) {
      const parts = groups.map((group) => `${group.value} ×${group.days.length}${group.price ? ` à ${group.price}` : ''}`);
      priceField.value = parts.length ? `${parts.join(', ')}${total > 0 ? ` = ${formatAmount(total)}` : ''}` : '';
    }
  };

  const setPick = (day, on) => {
    if (on) {
      if (!picks.has(day)) {
        picks.set(day, defaultSize());
      }
    } else {
      picks.delete(day);
    }
    render();
  };

  const tileFor = (day) => document.getElementById(`dag-${day}`);

  let viewerOpenedWithPointer = true;
  const show = (day) => {
    const tile = tileFor(day);
    const button = tile ? tile.querySelector('[data-sun-open]') : null;
    if (!button || !viewer || !viewerImage) {
      return;
    }
    currentDay = day;
    const thumb = button.querySelector('img');
    viewerImage.src = button.dataset.full || (thumb ? thumb.src : '');
    viewerImage.alt = thumb ? thumb.alt : '';
    if (viewerDay) {
      viewerDay.textContent = `${dayLabel} ${day} / ${SUN_COUNT}`;
    }
    if (viewerPick) {
      viewerPick.checked = picks.has(day);
    }
    if (!viewer.open) {
      viewerOpenedWithPointer =
        typeof window.olaLastInputModality === 'function' ? window.olaLastInputModality() === 'pointer' : true;
      viewer.showModal();
    }
    history.replaceState(null, '', `${location.pathname}${location.search}#dag-${day}`);
  };

  const close = () => {
    if (viewer && viewer.open) {
      viewer.close();
    }
  };

  grid.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-sun-open]');
    if (opener) {
      show(Number(opener.dataset.sunOpen));
    }
  });

  grid.addEventListener('change', (event) => {
    const box = event.target.closest('[data-sun-pick]');
    if (box) {
      setPick(Number(box.dataset.sunPick), box.checked);
    }
  });

  if (viewer) {
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer || event.target.closest('[data-sun-close]')) {
        close();
        return;
      }
      const step = event.target.closest('[data-sun-step]');
      if (step) {
        const next = ((currentDay - 1 + Number(step.dataset.sunStep) + SUN_COUNT) % SUN_COUNT) + 1;
        show(next);
        return;
      }
      if (event.target.closest('[data-sun-order]')) {
        if (currentDay) {
          setPick(currentDay, true);
        }
        close();
      }
    });
    viewer.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        show((currentDay % SUN_COUNT) + 1);
      } else if (event.key === 'ArrowLeft') {
        show(((currentDay - 2 + SUN_COUNT) % SUN_COUNT) + 1);
      }
    });
    viewer.addEventListener('close', () => {
      const opener = currentDay ? tileFor(currentDay)?.querySelector('[data-sun-open]') : null;
      if (opener && typeof window.olaRestoreFocusAfterDialog === 'function') {
        window.olaRestoreFocusAfterDialog(opener, viewerOpenedWithPointer);
      } else if (opener) {
        opener.focus({ preventScroll: true });
      }
    });
  }

  if (viewerPick) {
    viewerPick.addEventListener('change', () => {
      if (currentDay) {
        setPick(currentDay, viewerPick.checked);
      }
    });
  }

  if (daysInput) {
    daysInput.addEventListener('input', () => {
      const previous = new Map(picks);
      picks.clear();
      parseDays(daysInput.value).forEach((day) => picks.set(day, previous.get(day) || defaultSize()));
      render({ fromInput: true });
    });
    daysInput.addEventListener('blur', () => render());
  }

  // "Samma format för alla": sätter formatet på alla valda solar och på nya val.
  if (sizeSelect) {
    sizeSelect.addEventListener('change', () => {
      picks.forEach((_, day) => picks.set(day, sizeSelect.value));
      render();
    });
  }

  if (form) {
    form.addEventListener('reset', () => {
      picks.clear();
      window.setTimeout(() => render(), 0);
    });
  }

  // Stoppa sändning utan valda solar. Capture på document körs före
  // script.js:s submit-lyssnare på formuläret.
  document.addEventListener(
    'submit',
    (event) => {
      if (event.target !== form || picks.size > 0) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      const status = document.getElementById('artwork-inquiry-status');
      if (status) {
        status.textContent = isEnglish
          ? 'Enter which suns you want (day numbers).'
          : 'Skriv vilka solar du vill ha (dagnummer).';
        status.dataset.kind = 'error';
      }
      daysInput?.focus();
    },
    true
  );

  // Djuplänk: /100-dagar-av-sol#dag-37 öppnar dag 37 direkt (t.ex. från QR-kod på utställningen).
  const hashDay = Number((location.hash.match(/^#dag-(\d+)$/) || [])[1]);
  if (hashDay >= 1 && hashDay <= SUN_COUNT) {
    tileFor(hashDay)?.scrollIntoView({ block: 'center' });
    show(hashDay);
  }

  render();
})();
