const stream = document.getElementById("stream");
const video = document.getElementById("bgVideo");
const visible = document.getElementById("visible");
const mute = document.getElementById("mute");
const text = document.getElementById("text");

let thoughts = [];
var current = newThought();
let interval = 0;

function newThought() {
  if (current) {
    current.classList.remove("current");
    thoughts.push([current, 0.5]); // velocity
  }
  let p = document.createElement("p");
  p.classList.add("thought", "current");
  p.style.transform = "translateX(0px)";
  stream.append(p);
  return p;
}

document.addEventListener("keydown", event => {
  interval = 0;
  switch (event.key) {
    case 'Meta':
    case 'Alt':
    case 'Shift':
    case 'Control':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowDown':
    case 'Enter':
    case 'Tab':
    case 'Escape':
    case 'CapsLock':
    case 'Dead':
    case 'F1':
    case 'F2':
    case 'F3':
    case 'F4':
    case 'F5':
    case 'F6':
    case 'F7':
    case 'F8':
    case 'F9':
    case 'F10':
    case 'F11':
    case 'F12':
      return;
    case 'Backspace':
      event.preventDefault();
      event.stopPropagation();
      current.textContent = current.textContent.substring(0, current.textContent.length - 1);
      break;
    case "'": // bypassing browser keyboard shortcuts
    case '/':
      event.preventDefault();
      event.stopPropagation();
    default:
      current.textContent += event.key;
      break;
  }
});

// move thoughts across screen
setInterval(() => {
  if (current.textContent.length > 0) {
    interval += 1;
    if (interval > 50) {
      current = newThought();
    }
  }

  for (let i = thoughts.length - 1; i >= 0; i--) {
    // https://zellwk.com/blog/css-translate-values-in-javascript/
    const style = window.getComputedStyle(thoughts[i][0]);
    const matrix = style.transform || style.webkitTransform || style.mozTransform;
    if (matrix) {
      const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
      const x = Number(matrixValues[4]);
      if (x > window.innerWidth) {
        thoughts[i][0].remove();
      } else {
        thoughts[i][0].style.transform = `translateX(${x + thoughts[i][1]}px)`;
        thoughts[i][1] += 0.01;
      }
    }
  }
}, 10);

// toggles

visible.addEventListener("click", event => {
  visible.textContent = (text.classList.contains("hidden")) ? "Hide text" : "Show text";
  text.classList.toggle("hidden");
});

mute.addEventListener("click", event => {
  mute.textContent = (bgVideo.muted) ? "Mute" : "Unmute";
  bgVideo.muted = !bgVideo.muted;
});