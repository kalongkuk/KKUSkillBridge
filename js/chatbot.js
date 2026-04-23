// ========== AI Chatbot Logic ==========
const BOT_NAME = 'SkillBot';
let chatMode = 'qa';

const responses = {
  qa: {
    patterns: [
      { k: ['communication','การสื่อสาร','พูด','ฟัง'], r: 'ทักษะการสื่อสารเป็นหัวใจสำคัญของบุคลากรทางการแพทย์ 💬 การสื่อสารที่ดีประกอบด้วย: (1) การฟังเชิงรุก (Active Listening) (2) การใช้ภาษาที่เข้าใจง่าย (3) การสังเกตภาษากาย และ (4) การถามคำถามแบบเปิด คุณต้องการเรียนรู้ทักษะข้อไหนเพิ่มเติม?' },
      { k: ['empathy','ความเห็นอกเห็นใจ','เอาใจใส่'], r: 'Empathy หรือความเห็นอกเห็นใจ คือการรับรู้และเข้าใจความรู้สึกของผู้อื่น 🤝 ในทางการแพทย์ มีงานวิจัยพบว่าแพทย์ที่มี Empathy สูงช่วยให้ผู้ป่วยร่วมมือในการรักษาได้ดีขึ้น 40%! เริ่มต้นด้วยการพูดว่า "ฉันเข้าใจว่าคุณรู้สึก..." แทนการตัดสิน' },
      { k: ['teamwork','การทำงานเป็นทีม','ทีม'], r: 'การทำงานเป็นทีมในสายสุขภาพต้องอาศัย: ✅ การสื่อสารที่ชัดเจน ✅ การเคารพบทบาทกันและกัน ✅ การแบ่งปันข้อมูล ✅ การสนับสนุนซึ่งกันและกัน ลองทำ Role Play เพื่อฝึกทักษะนี้ไหมครับ?' },
      { k: ['stress','ความเครียด','burnout','หมดไฟ'], r: 'ความเครียดในสายสุขภาพเป็นเรื่องปกติมากครับ 💙 เทคนิคที่ช่วยได้: (1) หายใจลึก 4-7-8 (2) Mindfulness 5 นาทีก่อนนอน (3) Journal เพื่อ Reflect ความรู้สึก (4) พูดคุยกับเพื่อนร่วมงานที่ไว้ใจ คุณกำลังรู้สึกเครียดเรื่องอะไรอยู่ไหม?' },
      { k: ['leadership','ผู้นำ','ภาวะผู้นำ'], r: 'ภาวะผู้นำในสายสุขภาพไม่ได้หมายถึงตำแหน่งเสมอไป 👑 แต่คือความสามารถในการ: นำทีมในสถานการณ์ฉุกเฉิน, ตัดสินใจได้อย่างรวดเร็ว, สร้างแรงบันดาลใจให้ทีม และรับผิดชอบต่อผลลัพธ์' },
      { k: ['คอร์ส','course','เรียน','แนะนำ'], r: 'ขอแนะนำคอร์สยอดนิยมครับ! 📚 (1) "การสื่อสารกับผู้ป่วย" - เรียนรู้ภาษาที่เข้าใจง่าย (2) "Teamwork in Healthcare" - ฝึกการทำงานเป็นทีม (3) "Mindfulness สำหรับบุคลากรการแพทย์" ไปที่หน้า Course เพื่อดูรายละเอียดเพิ่มเติม' },
      { k: ['สวัสดี','hello','hi','ดีจ้า','ดีครับ'], r: 'สวัสดีครับ! 👋 ผมคือ SkillBot ผู้ช่วย AI สำหรับพัฒนา Soft Skills ด้านสุขภาพของคุณ วันนี้ต้องการพัฒนาทักษะด้านไหนครับ? เช่น การสื่อสาร, การทำงานเป็นทีม, ภาวะผู้นำ หรือการจัดการความเครียด' },
    ],
    default: 'ขอบคุณสำหรับคำถามครับ 🤔 ผมยังเรียนรู้อยู่เสมอ! ลองถามเรื่อง การสื่อสาร, Empathy, การทำงานเป็นทีม, ภาวะผู้นำ หรือ การจัดการความเครียด ในบริบทสายสุขภาพได้เลยครับ'
  },
  roleplay: {
    scenarios: [
      { title: 'ผู้ป่วยวิตกกังวลเรื่องการผ่าตัด', bot: 'ผมกลัวมากเลยครับ... ไม่รู้ว่าการผ่าตัดจะเป็นยังไง ปลอดภัยไหม?' },
      { title: 'ญาติผู้ป่วยต้องการข้อมูล', bot: 'คุณหมอครับ แม่ผมเป็นยังไงบ้าง ทำไมถึงไม่ฟื้นเร็วกว่านี้? ผมกังวลมากเลย' },
      { title: 'เพื่อนร่วมงานมีความขัดแย้ง', bot: 'ฉันคิดว่าวิธีที่คุณทำกับคนไข้มันไม่ถูกต้อง คุณควรฟังฉันบ้าง!' },
    ],
    currentScenario: 0,
    feedbacks: [
      'ดีมากครับ! การตอบสนองของคุณแสดงถึง Empathy ที่ดี 👍 คุณใช้คำที่อ่อนโยนและฟังก่อนพูด',
      'การสื่อสารของคุณชัดเจนดี แต่ลองเพิ่ม Empathy ด้วยการพูดว่า "ฉันเข้าใจว่าคุณรู้สึก..." ก่อนให้ข้อมูลนะครับ 💬',
      'โอเคครับ! ครั้งต่อไปลองใช้ภาษาที่อ่อนน้อมมากขึ้น และถามความต้องการของอีกฝ่ายก่อนตัดสิน 🌱',
    ]
  },
  reflection: {
    questions: [
      'วันนี้คุณเจอสถานการณ์ที่ท้าทายทักษะ Soft Skills ด้านไหนบ้าง?',
      'มีช่วงไหนที่คุณรู้สึกว่าการสื่อสารของคุณไม่ได้ผลตามที่หวัง? เกิดอะไรขึ้น?',
      'ถ้าย้อนเวลากลับไปได้ คุณจะจัดการสถานการณ์นั้นต่างออกไปอย่างไร?',
      'คุณได้เรียนรู้อะไรใหม่เกี่ยวกับตัวเองในฐานะบุคลากรทางการแพทย์วันนี้?',
    ],
    qIndex: 0
  }
};

let roleplayActive = false;
let reflectionActive = false;
let roleplayFeedbackPending = false;

function getCurrentTime() {
  return new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, isUser = false) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const msg = document.createElement('div');
  msg.className = `message ${isUser ? 'user' : 'bot'}`;
  msg.innerHTML = `
    <div class="msg-avatar">${isUser ? '👤' : '🤖'}</div>
    <div>
      <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
      <div class="msg-time">${getCurrentTime()}</div>
    </div>`;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'message bot'; typing.id = 'typingIndicator';
  typing.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
  return typing;
}

function getBotResponse(input) {
  const lower = input.toLowerCase();

  if (reflectionActive) {
    const r = responses.reflection;
    const feedback = ['ขอบคุณที่แบ่งปันครับ 🙏 การ Reflect ตัวเองเป็นทักษะที่สำคัญมาก', 'นั่นเป็นประสบการณ์ที่มีคุณค่ามากครับ', 'ดีมากที่คุณตระหนักถึงสิ่งนี้!'];
    const fb = feedback[Math.floor(Math.random() * feedback.length)];
    r.qIndex++;
    if (r.qIndex < r.questions.length) return `${fb}\n\n${r.questions[r.qIndex]}`;
    else { reflectionActive = false; r.qIndex = 0; return `${fb}\n\nคุณทำการ Reflection ครบแล้วครับ! 🎉 การทบทวนตัวเองเป็นประจำจะช่วยพัฒนา Soft Skills ของคุณได้อย่างต่อเนื่อง มีอะไรอยากถามหรือฝึกเพิ่มเติมไหมครับ?`; }
  }

  if (roleplayActive) {
    if (roleplayFeedbackPending) {
      roleplayFeedbackPending = false;
      const scenario = responses.roleplay.scenarios[responses.roleplay.currentScenario];
      const feedback = responses.roleplay.feedbacks[responses.roleplay.currentScenario % responses.roleplay.feedbacks.length];
      responses.roleplay.currentScenario = (responses.roleplay.currentScenario + 1) % responses.roleplay.scenarios.length;
      const next = responses.roleplay.scenarios[responses.roleplay.currentScenario];
      return `${feedback}\n\n---\nสถานการณ์ถัดไป: **${next.title}**\n\n"${next.bot}"\n\nคุณจะตอบสนองอย่างไรในฐานะบุคลากรการแพทย์?`;
    } else {
      roleplayFeedbackPending = true;
      return `ดี! ผมได้รับคำตอบของคุณแล้ว 📝 กำลังวิเคราะห์...`;
    }
  }

  for (const { k, r } of responses.qa.patterns) {
    if (k.some(kw => lower.includes(kw))) return r;
  }
  return responses.qa.default;
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = '';
  input.style.height = 'auto';

  const typing = showTyping();
  setTimeout(() => {
    typing.remove();
    const response = getBotResponse(text);
    addMessage(response, false);

    if (roleplayActive && roleplayFeedbackPending) {
      setTimeout(() => {
        typing.remove();
        const fb = responses.roleplay.feedbacks[responses.roleplay.currentScenario % responses.roleplay.feedbacks.length];
        const next = responses.roleplay.scenarios[(responses.roleplay.currentScenario + 1) % responses.roleplay.scenarios.length];
        responses.roleplay.currentScenario = (responses.roleplay.currentScenario + 1) % responses.roleplay.scenarios.length;
        addMessage(`${fb}\n\n---\nสถานการณ์ถัดไป: **${next.title}**\n\n"${next.bot}"\n\nคุณจะตอบสนองอย่างไร?`, false);
        roleplayFeedbackPending = false;
      }, 1200);
    }
  }, 800 + Math.random() * 600);
}

function setMode(mode) {
  chatMode = mode;
  roleplayActive = false;
  reflectionActive = false;
  roleplayFeedbackPending = false;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`mode-${mode}`)?.classList.add('active');

  const container = document.getElementById('chatMessages');
  if (!container) return;

  const prompts = document.querySelector('.quick-prompts');

  if (mode === 'qa') {
    addMessage('โหมด Q&A พร้อมแล้วครับ! 💬 ถามเรื่อง Soft Skills ที่คุณอยากรู้ได้เลย', false);
    if (prompts) prompts.innerHTML = `
      <button class="quick-prompt" onclick="quickSend('อธิบาย Empathy คืออะไร')">Empathy คืออะไร?</button>
      <button class="quick-prompt" onclick="quickSend('วิธีพัฒนาการสื่อสาร')">พัฒนาการสื่อสาร</button>
      <button class="quick-prompt" onclick="quickSend('จัดการความเครียด')">จัดการ Stress</button>
      <button class="quick-prompt" onclick="quickSend('แนะนำคอร์สเรียน')">แนะนำคอร์ส</button>`;
  } else if (mode === 'roleplay') {
    roleplayActive = true; roleplayFeedbackPending = false;
    const s = responses.roleplay.scenarios[responses.roleplay.currentScenario];
    addMessage(`โหมด Role Play เริ่มแล้วครับ! 🎭\n\nคุณจะสวมบทบาทเป็นบุคลากรทางการแพทย์\nสถานการณ์: **${s.title}**\n\n"${s.bot}"\n\nคุณจะตอบสนองอย่างไร?`, false);
    if (prompts) prompts.innerHTML = '';
  } else if (mode === 'reflection') {
    reflectionActive = true; responses.reflection.qIndex = 0;
    addMessage(`โหมด Reflection พร้อมแล้วครับ 🪞 เราจะทบทวนประสบการณ์ของคุณด้วยกัน\n\n${responses.reflection.questions[0]}`, false);
    if (prompts) prompts.innerHTML = '';
  } else if (mode === 'analysis') {
    addMessage(`โหมดวิเคราะห์ทักษะ 📊 เล่าให้ฟังหน่อยได้ไหมครับว่าคุณทำงานสายไหน และทักษะด้านไหนที่คิดว่าต้องพัฒนาที่สุด?`, false);
    if (prompts) prompts.innerHTML = `
      <button class="quick-prompt" onclick="quickSend('ผมเป็นนักศึกษาพยาบาล')">นักศึกษาพยาบาล</button>
      <button class="quick-prompt" onclick="quickSend('ผมเป็นนักศึกษาแพทย์')">นักศึกษาแพทย์</button>
      <button class="quick-prompt" onclick="quickSend('ผมเป็นนักกายภาพบำบัด')">นักกายภาพบำบัด</button>`;
  }
}

function quickSend(text) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = text; sendMessage(); }
}

window.setMode = setMode;
window.quickSend = quickSend;
window.sendMessage = sendMessage;

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });
  }

  // Default welcome message
  setTimeout(() => {
    addMessage('สวัสดีครับ! 🌿 ผมคือ SkillBot ผู้ช่วย AI ด้าน Soft Skills สำหรับนักศึกษาสายสุขภาพ KKU\n\nผมช่วยคุณได้ด้วย:\n💬 ตอบคำถามด้าน Soft Skills\n🎭 Role Play ฝึกสถานการณ์จริง\n🪞 Reflection หลังเรียน\n📊 วิเคราะห์ทักษะส่วนตัว\n\nเลือกโหมดจากแถบซ้าย หรือพิมพ์คำถามได้เลยครับ!', false);
  }, 300);
});
