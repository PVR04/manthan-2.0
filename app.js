/**
 * MANTHAN 2.0 — ARCHITECTING INTELLIGENT FUTURES
 * Official Web Application Logic | ANVIKSA & JAIN CMS
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initializations
  initParticleNetwork();
  initCountdownTimer();
  initNavigation();
  initTrackFilters();
  initJourneyTabs();
  initFaqAccordion();
  initRegistrationWizard();
  initModals();
  initOrganizerDesk();
});

/* ==========================================================================
   1. CYBER PARTICLE CANVAS
   ========================================================================== */
function initParticleNetwork() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.5 + 0.2
    });
  }

  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw and update particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${p.baseAlpha})`;
      ctx.fill();

      // Connect with mouse if close
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.35 * (1 - dist / 140)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 102, 255, ${0.2 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. COUNTDOWN TIMER TO OCTOBER 22, 2026
   ========================================================================== */
function initCountdownTimer() {
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMinutes');
  const secsEl = document.getElementById('cdSeconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Hackathon Kickoff Date: October 22, 2026 at 09:00:00 AM IST
  const targetDate = new Date('2026-10-22T09:00:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-drawer-cta');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    }

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Header scroll shadow
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.7)';
      header.style.borderBottomColor = 'rgba(0, 229, 255, 0.35)';
    } else {
      header.style.boxShadow = 'none';
      header.style.borderBottomColor = 'rgba(0, 229, 255, 0.15)';
    }
  });
}

/* ==========================================================================
   4. TRACKS FILTER & FORM SHORTCUT
   ========================================================================== */
function initTrackFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const trackCards = document.querySelectorAll('.track-card');
  const trackChoiceSelect = document.getElementById('trackChoice');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      trackCards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Shortcut from card to form
  const selectBtns = document.querySelectorAll('.track-select-btn');
  selectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const trackName = btn.getAttribute('data-track');
      if (trackChoiceSelect) {
        trackChoiceSelect.value = trackName;
      }
      const registerSection = document.getElementById('register');
      if (registerSection) {
        registerSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   5. THE MANTHAN JOURNEY TABS
   ========================================================================== */
function initJourneyTabs() {
  const tabBtns = document.querySelectorAll('.jtab-btn');
  const panels = {
    day1: document.getElementById('day1Panel'),
    day2: document.getElementById('day2Panel'),
    day3: document.getElementById('day3Panel')
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const day = btn.getAttribute('data-day');
      Object.keys(panels).forEach((k) => {
        if (panels[k]) {
          panels[k].classList.remove('active');
        }
      });

      if (panels[day]) {
        panels[day].classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach((i) => {
        i.classList.remove('active');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   7. REGISTRATION WIZARD & SUBMISSION FLOW
   ========================================================================== */
function initRegistrationWizard() {
  const form = document.getElementById('hackathonRegistrationForm');
  if (!form) return;

  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4')
  ];
  const progressSteps = document.querySelectorAll('.progress-step');

  let currentStep = 1;

  function showStep(stepNum) {
    steps.forEach((s, idx) => {
      if (s) {
        s.classList.toggle('active', idx + 1 === stepNum);
      }
    });

    progressSteps.forEach((ps) => {
      const num = parseInt(ps.getAttribute('data-step'), 10);
      ps.classList.toggle('active', num === stepNum);
      ps.classList.toggle('completed', num < stepNum);
    });

    currentStep = stepNum;
  }

  // Next Step Buttons
  const nextBtns = document.querySelectorAll('.next-step-btn');
  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.getAttribute('data-next'), 10);
      if (validateStep(currentStep)) {
        showStep(nextStep);
      }
    });
  });

  // Prev Step Buttons
  const prevBtns = document.querySelectorAll('.prev-step-btn');
  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.getAttribute('data-prev'), 10);
      showStep(prevStep);
    });
  });

  // Step Validation
  function validateStep(stepNum) {
    const currentFieldset = steps[stepNum - 1];
    if (!currentFieldset) return true;

    const requiredInputs = currentFieldset.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalid = null;

    requiredInputs.forEach((input) => {
      if (!input.checkValidity()) {
        isValid = false;
        input.style.borderColor = 'var(--accent-rose)';
        if (!firstInvalid) firstInvalid = input;
      } else {
        input.style.borderColor = 'var(--border-cyan)';
      }
    });

    if (!isValid && firstInvalid) {
      firstInvalid.focus();
      showFormAlert('Please fill out all required fields before proceeding.', 'error');
    } else {
      hideFormAlert();
    }

    return isValid;
  }

  // Team Size Dynamic Members Handling
  const teamSizeRadios = document.querySelectorAll('input[name="teamSize"]');
  const memberCard3 = document.getElementById('memberCard3');
  const memberCard4 = document.getElementById('memberCard4');

  function updateMemberFields(size) {
    if (size === 2) {
      if (memberCard3) memberCard3.classList.add('hidden');
      if (memberCard4) memberCard4.classList.add('hidden');
    } else if (size === 3) {
      if (memberCard3) memberCard3.classList.remove('hidden');
      if (memberCard4) memberCard4.classList.add('hidden');
    } else if (size === 4) {
      if (memberCard3) memberCard3.classList.remove('hidden');
      if (memberCard4) memberCard4.classList.remove('hidden');
    }
  }

  teamSizeRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      updateMemberFields(parseInt(e.target.value, 10));
    });
  });

  // Copy UPI ID button
  const btnCopyUpi = document.getElementById('btnCopyUpi');
  if (btnCopyUpi) {
    btnCopyUpi.addEventListener('click', () => {
      const upiText = '9027273632@okaxis';
      navigator.clipboard.writeText(upiText).then(() => {
        btnCopyUpi.innerHTML = '<i class="fa-solid fa-check" style="color:var(--accent-green)"></i>';
        setTimeout(() => {
          btnCopyUpi.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 2000);
      });
    });
  }

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateStep(4)) return;

    const submitBtn = document.getElementById('btnSubmitRegistration');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Registration...';
    }

    // Collect data
    const teamSize = document.querySelector('input[name="teamSize"]:checked')?.value || '2';
    const regId = 'MTH26-' + Math.floor(1000 + Math.random() * 9000);

    const registrationData = {
      regId: regId,
      timestamp: new Date().toISOString(),
      teamName: document.getElementById('teamName')?.value.trim() || '',
      track: document.getElementById('trackChoice')?.value || 'General Track',
      college: document.getElementById('collegeName')?.value.trim() || '',
      city: document.getElementById('collegeCity')?.value.trim() || '',
      synopsis: document.getElementById('projectSynopsis')?.value?.trim() || '',
      leader: {
        name: document.getElementById('leaderName')?.value.trim() || '',
        email: document.getElementById('leaderEmail')?.value.trim() || '',
        phone: document.getElementById('leaderPhone')?.value.trim() || '',
        degree: document.getElementById('leaderDegree')?.value.trim() || '',
        year: document.getElementById('leaderYear')?.value || ''
      },
      teamSize: teamSize,
      members: [
        {
          name: document.getElementById('m2Name')?.value.trim() || '',
          email: document.getElementById('m2Email')?.value.trim() || '',
          phone: document.getElementById('m2Phone')?.value.trim() || '',
          role: document.getElementById('m2Role')?.value.trim() || ''
        }
      ],
      payment: {
        fee: '1500',
        utr: document.getElementById('paymentUtr')?.value.trim() || '',
        payerName: document.getElementById('payerName')?.value.trim() || ''
      }
    };

    if (teamSize >= 3) {
      registrationData.members.push({
        name: document.getElementById('m3Name')?.value.trim() || '',
        email: document.getElementById('m3Email')?.value.trim() || '',
        phone: document.getElementById('m3Phone')?.value.trim() || '',
        role: document.getElementById('m3Role')?.value.trim() || ''
      });
    }

    if (teamSize >= 4) {
      registrationData.members.push({
        name: document.getElementById('m4Name')?.value.trim() || '',
        email: document.getElementById('m4Email')?.value.trim() || '',
        phone: document.getElementById('m4Phone')?.value.trim() || '',
        role: document.getElementById('m4Role')?.value.trim() || ''
      });
    }

    // 1. Store in localStorage
    saveToLocalStorage(registrationData);

    // 2. Prepare Formspree / Web3Forms POST payload or mailto fallback
    try {
      await sendViaStaticService(registrationData);
    } catch (err) {
      console.warn('Direct static API post fallback to client-side mail draft:', err);
    }

    // 3. Show Success Modal with Pass
    displayRegistrationPass(registrationData);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-check-circle"></i> Complete Registration & Send';
    }

    form.reset();
    showStep(1);
  });
}

function showFormAlert(msg, type = 'error') {
  const alertEl = document.getElementById('formStatusMsg');
  if (!alertEl) return;
  alertEl.className = `form-status-alert alert-${type}`;
  alertEl.textContent = msg;
  alertEl.classList.remove('hidden');
}

function hideFormAlert() {
  const alertEl = document.getElementById('formStatusMsg');
  if (alertEl) alertEl.classList.add('hidden');
}

/* ==========================================================================
   8. EMAIL DISPATCH & STORAGE ENGINE
   ========================================================================== */
function saveToLocalStorage(data) {
  try {
    const list = JSON.parse(localStorage.getItem('manthan_registrations') || '[]');
    list.unshift(data);
    localStorage.setItem('manthan_registrations', JSON.stringify(list));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

async function sendViaStaticService(data) {
  // Web3Forms or Formspree static submission
  // Web3Forms allows submissions with public key or direct email notification
  const bodyData = {
    access_key: 'PUBLIC_ANVIKSA_FORM_KEY', // Organizers can replace with their Web3Forms key
    subject: `[MANTHAN 2.0 REGISTRATION] Team: ${data.teamName} (${data.regId})`,
    from_name: 'MANTHAN 2.0 Portal',
    to_email: 'anviksa2025@gmail.com',
    Registration_ID: data.regId,
    Team_Name: data.teamName,
    Selected_Track: data.track,
    College: `${data.college}, ${data.city}`,
    Leader_Name: data.leader.name,
    Leader_Email: data.leader.email,
    Leader_Phone: data.leader.phone,
    Total_Members: data.teamSize,
    Members_Details: JSON.stringify(data.members),
    UPI_UTR_Number: data.payment.utr,
    Payer_Account_Name: data.payment.payerName,
    Fee_Amount: '₹ 1500/- INR',
    Idea_Synopsis: data.synopsis || 'N/A'
  };

  // Attempt fetch (non-blocking with timeout)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(bodyData),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
  } catch (e) {
    clearTimeout(timeoutId);
    // Silent catch, fallback is ready
  }
}

function generateMailtoLink(data) {
  const recipient = 'anviksa2025@gmail.com';
  const subject = encodeURIComponent(`[MANTHAN 2.0 REGISTRATION] Team: ${data.teamName} (${data.regId})`);

  let membersSummary = '';
  data.members.forEach((m, idx) => {
    membersSummary += `\n- Member ${idx + 2}: ${m.name} (${m.email}, Phone: ${m.phone || 'N/A'}, Role: ${m.role || 'N/A'})`;
  });

  const bodyContent =
`Dear ANVIKSA Organizing Team,

Here are our official registration details for MANTHAN 2.0 Hackathon (22 - 24 October 2026):

=== TEAM INFORMATION ===
Registration ID: ${data.regId}
Team Name: ${data.teamName}
Challenge Track: ${data.track}
College / University: ${data.college}, ${data.city}

=== TEAM LEADER ===
Name: ${data.leader.name}
Email: ${data.leader.email}
Phone: ${data.leader.phone}
Degree / Stream: ${data.leader.degree} (${data.leader.year})

=== TEAM MEMBERS (${data.teamSize} Members Total) ===${membersSummary}

=== PAYMENT VERIFICATION ===
Registration Fee: ₹ 1,500/-
UPI UTR / Transaction ID: ${data.payment.utr}
Payer Name: ${data.payment.payerName}

=== INITIAL SYNOPSIS ===
${data.synopsis || 'Will be submitted during Day 1 AI Blueprint ideation.'}

Looking forward to architecting intelligent futures at JAIN CMS!

Regards,
${data.leader.name} (Team ${data.teamName})
`;

  return `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;
}

/* ==========================================================================
   9. REGISTRATION PASS & MODALS
   ========================================================================== */
let lastSubmittedData = null;

function displayRegistrationPass(data) {
  lastSubmittedData = data;

  if (document.getElementById('passTeamName')) document.getElementById('passTeamName').textContent = data.teamName || '';
  if (document.getElementById('passRegId')) document.getElementById('passRegId').textContent = data.regId || '';
  if (document.getElementById('passTrack')) document.getElementById('passTrack').textContent = data.track || 'General Track';
  if (document.getElementById('passCollege')) document.getElementById('passCollege').textContent = data.college || '';
  if (document.getElementById('passLeader')) document.getElementById('passLeader').textContent = data.leader?.name || '';
  if (document.getElementById('passMembersCount')) document.getElementById('passMembersCount').textContent = `${data.teamSize} Members`;
  if (document.getElementById('passUtr')) document.getElementById('passUtr').textContent = data.payment?.utr || '';

  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.classList.add('open');
  }
}

function initModals() {
  // Success Modal
  const successModal = document.getElementById('successModal');
  const btnCloseSuccessModal = document.getElementById('btnCloseSuccessModal');
  const btnClosePassBtn = document.getElementById('btnClosePassBtn');
  const btnPrintPass = document.getElementById('btnPrintPass');
  const btnEmailDispatch = document.getElementById('btnEmailDispatch');

  if (btnCloseSuccessModal) {
    btnCloseSuccessModal.addEventListener('click', () => successModal.classList.remove('open'));
  }
  if (btnClosePassBtn) {
    btnClosePassBtn.addEventListener('click', () => successModal.classList.remove('open'));
  }
  if (btnPrintPass) {
    btnPrintPass.addEventListener('click', () => {
      window.print();
    });
  }
  if (btnEmailDispatch) {
    btnEmailDispatch.addEventListener('click', () => {
      if (lastSubmittedData) {
        const mailUrl = generateMailtoLink(lastSubmittedData);
        window.open(mailUrl, '_blank');
      }
    });
  }

  // Payment QR Modal
  const qrModal = document.getElementById('qrModal');
  const btnViewPaymentQr = document.getElementById('btnViewPaymentQr');
  const btnCloseQrModal = document.getElementById('btnCloseQrModal');
  const btnDoneQrModal = document.getElementById('btnDoneQrModal');

  if (btnViewPaymentQr && qrModal) {
    btnViewPaymentQr.addEventListener('click', () => qrModal.classList.add('open'));
  }
  if (btnCloseQrModal) {
    btnCloseQrModal.addEventListener('click', () => qrModal.classList.remove('open'));
  }
  if (btnDoneQrModal) {
    btnDoneQrModal.addEventListener('click', () => qrModal.classList.remove('open'));
  }

  // Brochure Modal
  const brochureModal = document.getElementById('brochureModal');
  const btnOpenBrochureModal = document.getElementById('btnOpenBrochureModal');
  const btnPreviewBrochure = document.getElementById('btnPreviewBrochure');
  const btnCloseBrochureModal = document.getElementById('btnCloseBrochureModal');
  const btnCloseBrochureModalBtn = document.getElementById('btnCloseBrochureModalBtn');

  function openBrochure() {
    if (brochureModal) brochureModal.classList.add('open');
  }
  function closeBrochure() {
    if (brochureModal) brochureModal.classList.remove('open');
  }

  if (btnOpenBrochureModal) btnOpenBrochureModal.addEventListener('click', openBrochure);
  if (btnPreviewBrochure) btnPreviewBrochure.addEventListener('click', openBrochure);
  if (btnCloseBrochureModal) btnCloseBrochureModal.addEventListener('click', closeBrochure);
  if (btnCloseBrochureModalBtn) btnCloseBrochureModalBtn.addEventListener('click', closeBrochure);

  // Close modals on overlay backdrop click
  document.querySelectorAll('.modal-overlay').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });
}

/* ==========================================================================
   10. ORGANIZER DESK & CSV EXPORT
   ========================================================================== */
function initOrganizerDesk() {
  const organizerModal = document.getElementById('organizerModal');
  const btnOpenDesk = document.getElementById('btnOpenOrganizerDesk');
  const btnCloseDesk = document.getElementById('btnCloseOrganizerModal');
  const adminAuthBox = document.getElementById('adminAuthBox');
  const adminDataBox = document.getElementById('adminDataBox');
  const adminPinInput = document.getElementById('adminPinInput');
  const btnVerifyPin = document.getElementById('btnVerifyAdminPin');
  const adminPinError = document.getElementById('adminPinError');
  const adminTableBody = document.getElementById('adminTableBody');
  const adminCount = document.getElementById('adminCount');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnClearSubmissions = document.getElementById('btnClearSubmissions');

  const SECRET_PIN = 'anviksa2026';

  if (btnOpenDesk && organizerModal) {
    btnOpenDesk.addEventListener('click', () => {
      organizerModal.classList.add('open');
    });
  }

  if (btnCloseDesk) {
    btnCloseDesk.addEventListener('click', () => {
      organizerModal.classList.remove('open');
    });
  }

  if (btnVerifyPin) {
    btnVerifyPin.addEventListener('click', () => {
      if (adminPinInput.value.trim() === SECRET_PIN) {
        adminAuthBox.classList.add('hidden');
        adminDataBox.classList.remove('hidden');
        adminPinError.classList.add('hidden');
        renderOrganizerTable();
      } else {
        adminPinError.classList.remove('hidden');
      }
    });
  }

  function renderOrganizerTable() {
    const records = JSON.parse(localStorage.getItem('manthan_registrations') || '[]');
    if (adminCount) adminCount.textContent = records.length;

    if (!adminTableBody) return;
    adminTableBody.innerHTML = '';

    if (records.length === 0) {
      adminTableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 2rem; color: var(--text-muted);">No registrations recorded yet on this browser.</td></tr>`;
      return;
    }

    records.forEach((r) => {
      const tr = document.createElement('tr');
      const timeStr = new Date(r.timestamp).toLocaleString();
      tr.innerHTML = `
        <td><strong style="color:var(--cyan-bright)">${r.regId}</strong></td>
        <td><strong>${r.teamName}</strong></td>
        <td>${r.track}</td>
        <td>${r.college}</td>
        <td>${r.leader.name}</td>
        <td>${r.leader.email}</td>
        <td>${r.leader.phone}</td>
        <td>${r.teamSize}</td>
        <td><code>${r.payment.utr}</code></td>
        <td style="font-size:0.75rem">${timeStr}</td>
      `;
      adminTableBody.appendChild(tr);
    });
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      const records = JSON.parse(localStorage.getItem('manthan_registrations') || '[]');
      if (records.length === 0) {
        alert('No registration data available to export.');
        return;
      }

      let csv = 'Reg ID,Team Name,Track,College,City,Leader Name,Leader Email,Leader Phone,Degree,Year,Team Size,Payment UTR,Payer Name,Fee,Timestamp,Synopsis\n';

      records.forEach((r) => {
        const row = [
          `"${r.regId}"`,
          `"${(r.teamName || '').replace(/"/g, '""')}"`,
          `"${(r.track || '').replace(/"/g, '""')}"`,
          `"${(r.college || '').replace(/"/g, '""')}"`,
          `"${(r.city || '').replace(/"/g, '""')}"`,
          `"${(r.leader?.name || '').replace(/"/g, '""')}"`,
          `"${(r.leader?.email || '').replace(/"/g, '""')}"`,
          `"${(r.leader?.phone || '').replace(/"/g, '""')}"`,
          `"${(r.leader?.degree || '').replace(/"/g, '""')}"`,
          `"${(r.leader?.year || '').replace(/"/g, '""')}"`,
          `"${r.teamSize || ''}"`,
          `"${(r.payment?.utr || '').replace(/"/g, '""')}"`,
          `"${(r.payment?.payerName || '').replace(/"/g, '""')}"`,
          `"1500"`,
          `"${r.timestamp || ''}"`,
          `"${(r.synopsis || '').replace(/"/g, '""')}"`
        ];
        csv += row.join(',') + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `manthan_2.0_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (btnClearSubmissions) {
    btnClearSubmissions.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the local registrations on this device?')) {
        localStorage.removeItem('manthan_registrations');
        renderOrganizerTable();
      }
    });
  }
}
