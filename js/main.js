// ========== Navbar ==========
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Profile dropdown
const profileBtn = document.getElementById('profileBtn');
const dropdownMenu = document.getElementById('dropdownMenu');
if (profileBtn) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdownMenu.classList.remove('open'));
}

// Set active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ========== Skill Test Quiz ==========
const quizData = [
  {
    q: 'เมื่อเพื่อนร่วมงานแสดงความวิตกกังวลเกี่ยวกับการรักษา คุณจะทำอย่างไร?',
    opts: ['ให้ข้อมูลทางการแพทย์ทันที', 'รับฟังและแสดงความเข้าใจก่อน', 'บอกให้รอพบแพทย์', 'เปลี่ยนเรื่องสนทนา'],
    answer: 1, skill: 'Empathy'
  },
  {
    q: 'คุณมีงานด่วน 3 อย่างพร้อมกัน คุณจัดลำดับความสำคัญอย่างไร?',
    opts: ['ทำทุกอย่างพร้อมกัน', 'ขอความช่วยเหลือจากทีม', 'ประเมินความเร่งด่วนและผลกระทบ', 'ทำอย่างที่ง่ายที่สุดก่อน'],
    answer: 2, skill: 'Critical Thinking'
  },
  {
    q: 'ในการทำงานเป็นทีม คุณมีความเห็นต่างกับสมาชิกคนอื่น คุณจะ?',
    opts: ['ยืนหยัดในความเห็นของตน', 'ยอมตามโดยไม่แสดงความเห็น', 'นำเสนอเหตุผลอย่างสุภาพและรับฟัง', 'หลีกเลี่ยงการถกเถียง'],
    answer: 2, skill: 'Teamwork'
  },
  {
    q: 'คุณต้องอธิบายขั้นตอนการรักษาให้ผู้ป่วยสูงอายุเข้าใจ คุณเลือกวิธีใด?',
    opts: ['ใช้คำศัพท์ทางการแพทย์ให้ครบถ้วน', 'ใช้ภาษาง่ายๆ พร้อมสื่อภาพ', 'มอบเอกสารให้อ่านเอง', 'ให้ญาติมาฟังแทน'],
    answer: 1, skill: 'Communication'
  },
  {
    q: 'เมื่อเกิดสถานการณ์ฉุกเฉินในหน่วยงาน คุณรู้สึกอย่างไรและทำอะไร?',
    opts: ['ตื่นตระหนกและรอคำสั่ง', 'ประเมินสถานการณ์อย่างสงบและดำเนินการตามโปรโตคอล', 'หลีกเลี่ยงและปล่อยให้คนอื่นจัดการ', 'รีบโทรหาผู้บังคับบัญชาทันที'],
    answer: 1, skill: 'Stress Management'
  }
];

let currentQ = 0;
let answers = [];

function openQuiz() {
  currentQ = 0; answers = [];
  renderQuestion();
  document.getElementById('quizModal').classList.add('open');
}
function closeQuiz() {
  document.getElementById('quizModal').classList.remove('open');
}

function renderQuestion() {
  const modal = document.getElementById('quizModal');
  if (!modal) return;
  const fill = Math.round((currentQ / quizData.length) * 100);
  modal.querySelector('.quiz-progress-fill').style.width = fill + '%';
  modal.querySelector('.quiz-question').textContent = `${currentQ + 1}. ${quizData[currentQ].q}`;
  const optsEl = modal.querySelector('.quiz-options');
  optsEl.innerHTML = quizData[currentQ].opts.map((o, i) =>
    `<button class="quiz-option${answers[currentQ] === i ? ' selected' : ''}" onclick="selectAnswer(${i})">${o}</button>`
  ).join('');
  modal.querySelector('.q-counter').textContent = `ข้อ ${currentQ + 1} / ${quizData.length}`;
  modal.querySelector('#prevBtn').disabled = currentQ === 0;
  modal.querySelector('#nextBtn').textContent = currentQ === quizData.length - 1 ? 'ดูผล' : 'ถัดไป ›';
}

function selectAnswer(i) {
  answers[currentQ] = i;
  document.querySelectorAll('.quiz-option').forEach((el, idx) => {
    el.classList.toggle('selected', idx === i);
  });
}

function quizNext() {
  if (answers[currentQ] === undefined) {
    alert('กรุณาเลือกคำตอบก่อนดำเนินการต่อ');
    return;
  }
  if (currentQ < quizData.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    showResult();
  }
}

function quizPrev() {
  if (currentQ > 0) { currentQ--; renderQuestion(); }
}

function showResult() {
  const correct = answers.filter((a, i) => a === quizData[i].answer).length;
  const pct = Math.round((correct / quizData.length) * 100);
  const skills = { Empathy: 0, 'Critical Thinking': 0, Teamwork: 0, Communication: 0, 'Stress Management': 0 };
  quizData.forEach((q, i) => { if (answers[i] === q.answer) skills[q.skill] = 100; else skills[q.skill] = Math.floor(Math.random() * 40 + 30); });

  const modal = document.getElementById('quizModal');
  modal.querySelector('.quiz-content').innerHTML = `
    <div class="result-card">
      <div class="result-emoji">${pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
      <div class="result-score">${pct}%</div>
      <p class="result-label">${pct >= 80 ? 'ยอดเยี่ยม! ทักษะของคุณอยู่ในระดับสูง' : pct >= 60 ? 'ดี! ยังมีจุดที่พัฒนาได้อีก' : 'มีพื้นที่ในการพัฒนาอีกมาก'}</p>
      <div class="skill-bars">
        ${Object.entries(skills).map(([k, v]) => `
          <div class="skill-bar-item">
            <div class="skill-bar-label"><span>${k}</span><span>${v}%</span></div>
            <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${v}%"></div></div>
          </div>`).join('')}
      </div>
      <div style="margin-top:1.5rem;display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap">
        <a href="courses.html" class="btn btn-green">ดูคอร์สที่แนะนำ →</a>
        <button class="btn btn-outline" style="border:2px solid #e5ede9;color:#6b7280" onclick="openQuiz()">ทำแบบทดสอบอีกครั้ง</button>
      </div>
    </div>`;
}

// Expose globally
window.openQuiz = openQuiz;
window.closeQuiz = closeQuiz;
window.selectAnswer = selectAnswer;
window.quizNext = quizNext;
window.quizPrev = quizPrev;

// ========== Course Filter ==========
function initCourseFilter() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.course-card');
  const searchInput = document.querySelector('.search-bar input');

  function applyFilter() {
    const active = document.querySelector('.filter-chip.active');
    const category = active ? active.dataset.filter : 'all';
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    cards.forEach(card => {
      const matchCat = category === 'all' || card.dataset.category === category;
      const matchSearch = card.textContent.toLowerCase().includes(q);
      card.style.display = matchCat && matchSearch ? '' : 'none';
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applyFilter();
    });
  });
  if (searchInput) searchInput.addEventListener('input', applyFilter);
}

// ========== Calendar ==========
function renderCalendar(year, month) {
  const events = {
    5: [{ day: 8, label: 'Communication Workshop', color: 'green' }],
    10: [{ day: 10, label: 'Teamwork Seminar', color: 'blue' }],
    15: [{ day: 15, label: 'Leadership Talk', color: '' }],
    20: [{ day: 20, label: 'Role Play Clinic', color: 'green' }],
    25: [{ day: 25, label: 'AI Skills Expo', color: 'blue' }],
  };

  const monthNames = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  const el = document.getElementById('calendarGrid');
  const titleEl = document.getElementById('calMonthTitle');
  if (!el) return;

  titleEl.textContent = `${monthNames[month]} ${year + 543}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const days = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (days.length % 7 !== 0) days.push(null);

  el.innerHTML = ['อา','จ','อ','พ','พฤ','ศ','ส'].map(d => `<div class="cal-header-cell">${d}</div>`).join('') +
    days.map(d => {
      if (!d) return `<div class="cal-cell other-month"></div>`;
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
      const evts = events[d] || [];
      return `<div class="cal-cell${isToday ? ' today' : ''}">
        <div class="day-num">${d}</div>
        ${evts.map(e => `<div class="event-dot ${e.color}">${e.label}</div>`).join('')}
      </div>`;
    }).join('');
}

let calYear, calMonth;
function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear(); calMonth = now.getMonth();
  renderCalendar(calYear, calMonth);
  document.getElementById('calPrev')?.addEventListener('click', () => {
    calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar(calYear, calMonth);
  });
  document.getElementById('calNext')?.addEventListener('click', () => {
    calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar(calYear, calMonth);
  });
}

// ========== Tabs ==========
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(group)?.classList.add('active');
    });
  });
}

// ========== Podcast Player ==========
function initPodcast() {
  document.querySelectorAll('.podcast-play').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.podcast-card');
      const title = card.querySelector('h4').textContent;
      btn.textContent = btn.textContent === '▶' ? '⏸' : '▶';
      console.log(`${btn.textContent === '⏸' ? 'Playing' : 'Paused'}: ${title}`);
    });
  });
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', () => {
  initCourseFilter();
  initCalendar();
  initTabs();
  initPodcast();
});
