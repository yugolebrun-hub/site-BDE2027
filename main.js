document.addEventListener("DOMContentLoaded", () => {
  const data = window.NETRA_DATA;
  if (!data) return;

  // 1. RÈGLE DES 48H POUR LES PETITS-DÉJEUNERS
  const checkPetitDejVisibility = () => {
    const eventTime = new Date(data.petitDejDate).getTime();
    const now = Date.now();
    const fortyEightHoursMs = 48 * 60 * 60 * 1000;

    // Visible uniquement entre H-48 et l'heure de l'événement (ou si forcé en mode test)
    const isVisible = data.forceAffichagePetitDej || (now >= (eventTime - fortyEightHoursMs) && now <= eventTime);

    const navItem = document.getElementById("nav-petitdej-item");
    const section = document.getElementById("petit-dej");
    if (navItem) navItem.hidden = !isVisible;
    if (section) section.hidden = !isVisible;
  };
  checkPetitDejVisibility();

  // 2. REMPLISSAGE DE L'ORGANIGRAMME (organigramme.html)
  const bureauGrid = document.getElementById("bureau-grid");
  const polesGrid = document.getElementById("poles-grid");
  if (bureauGrid && polesGrid) {
    data.organigramme.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3 class="card__role">${item.pole}</h3>
        <ul class="member-list">
          ${item.membres.map((m) => `<li>${m}</li>`).join("")}
        </ul>
      `;
      if (item.bureau) bureauGrid.appendChild(card);
      else polesGrid.appendChild(card);
    });
  }

  // 3. REMPLISSAGE DU PROGRAMME (programme.html)
  const progContainer = document.getElementById("programme-container");
  if (progContainer) {
    data.programme.forEach((p) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <h3 class="card__role">${p.axe}</h3>
        <p style="color: var(--text-muted); margin-bottom: 16px;">${p.description}</p>
        <ul class="member-list">
          ${p.mesures.map((m) => `<li>${m}</li>`).join("")}
        </ul>
      `;
      progContainer.appendChild(card);
    });
  }

  // 4. REMPLISSAGE DE LA TIMELINE (index.html)
  const tlContainer = document.getElementById("timeline-container");
  if (tlContainer) {
    data.timeline.forEach((ev) => {
      const div = document.createElement("div");
      div.className = "timeline-item";
      div.innerHTML = `
        <span class="timeline-date">${ev.date}</span>
        <h3 style="margin: 4px 0;">${ev.titre}</h3>
        <p style="color: var(--text-muted);">${ev.desc}</p>
      `;
      tlContainer.appendChild(div);
    });
  }

  // 5. REMPLISSAGE DES CLIPS YOUTUBE (index.html)
  const clipsContainer = document.getElementById("clips-container");
  if (clipsContainer) {
    data.clips.forEach((clip) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = clip.youtubeId
        ? `<h3 class="card__role">${clip.titre}</h3>
           <div class="video-wrapper"><iframe src="https://www.youtube-nocookie.com/embed/${clip.youtubeId}" allowfullscreen></iframe></div>`
        : `<h3 class="card__role">${clip.titre}</h3>
           <p style="color: var(--text-muted);">Vidéo bientôt disponible sur notre chaîne YouTube !</p>`;
      clipsContainer.appendChild(card);
    });
  }

  // 6. MENU & ENVOI COMMANDE PETIT-DÉJ VERS LE BACKEND PYTHON
  const selectMenu = document.getElementById("select-menu");
  if (selectMenu) {
    data.menuPetitDej.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = `${m.nom} — ${m.detail}`;
      selectMenu.appendChild(opt);
    });
  }

  const formPetitDej = document.getElementById("form-petitdej");
  if (formPetitDej) {
    formPetitDej.addEventListener("submit", async (e) => {
      e.preventDefault();
      const feedback = document.getElementById("order-feedback");
      const formData = Object.fromEntries(new FormData(formPetitDej));

      try {
        const res = await fetch(data.apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error("Erreur serveur");
        feedback.textContent = "✅ Commande enregistrée ! Rendez-vous à ton créneau.";
        formPetitDej.reset();
      } catch (err) {
        feedback.textContent = "⚠️ Serveur Python non démarré (voir backend/app.py).";
      }
    });
  }
});
