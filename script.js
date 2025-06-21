const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const copyBtn = document.querySelector('.copy-btn');

const map = {
  '0':'color-0','1':'color-1','2':'color-2','3':'color-3',
  '4':'color-4','5':'color-5','6':'color-6','7':'color-7',
  '8':'color-8','9':'color-9','a':'color-a','b':'color-b',
  'c':'color-c','d':'color-d','e':'color-e','f':'color-f',
  'g':'color-g', // Minecoin Gold
  'l':'bold','o':'italic','n':'underline','m':'strikethrough'
};

function apply(code) {
  const s = editor.selectionStart;
  const e = editor.selectionEnd;
  const t = editor.value;
  editor.value = t.slice(0,s) + code + t.slice(s,e) + t.slice(e);
  editor.focus();
  editor.selectionStart = s + code.length;
  editor.selectionEnd = e + code.length;
  updatePreview();
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
}

function updatePreview() {
  const raw = editor.value;
  let result = '';
  let styles = ['color-f'];  // default white color
  let currentText = '';

  const colorClasses = Object.values(map).filter(c => c.startsWith('color-'));

  function flush() {
    if (currentText) {
      result += `<span class="${styles.join(' ')}">${escapeHTML(currentText)}</span>`;
      currentText = '';
    }
  }

  for(let i = 0; i < raw.length; i++) {
    if(raw[i] === '§' && i + 1 < raw.length) {
      flush();
      const code = raw[++i].toLowerCase();

      if(code === 'r') {
        styles = ['color-f']; // reset to white by default, clearing styles
      } else if(map[code]) {
        if(code >= '0' && code <= '9' || (code >= 'a' && code <= 'g')) {
          styles = styles.filter(s => !colorClasses.includes(s));
          styles.push(map[code]);
        } else {
          if(!styles.includes(map[code])) {
            styles.push(map[code]);
          }
        }
      }
      continue;
    }
    currentText += raw[i];
  }
  flush();

  preview.innerHTML = result;
}

editor.addEventListener('input', updatePreview);
window.addEventListener('load', updatePreview);

copyBtn.addEventListener('click', () => {
  editor.select();
  document.execCommand('copy');
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.textContent = 'Copy', 1500);
});

// Attach event listeners for buttons (colors and formatting)
document.querySelectorAll('.color-btn, .format-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    apply(btn.dataset.code);
  });
});
