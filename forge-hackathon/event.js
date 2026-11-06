const eventDate = new Date("2027-02-12T09:00:00+07:00");
const countdownParts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};
const countdownEnded = document.getElementById("countdownEnded");
const countdown = document.getElementById("countdown");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const registerForm = document.getElementById("registerForm");
const formResult = document.getElementById("formResult");

function updateCountdown() {
  const remaining = eventDate.getTime() - Date.now();

  if (remaining <= 0) {
    countdown.hidden = true;
    countdownEnded.hidden = false;
    return;
  }

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);

  countdownParts.days.textContent = String(days).padStart(2, "0");
  countdownParts.hours.textContent = String(hours).padStart(2, "0");
  countdownParts.minutes.textContent = String(minutes).padStart(2, "0");
  countdownParts.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute(
    "aria-label",
    isExpanded ? "Buka navigasi" : "Tutup navigasi",
  );
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
    siteNav.classList.remove("is-open");
  }
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const name = formData.get("nama").trim();
  const track = formData.get("minat");

  formResult.textContent = `Terima kasih, ${name}! Minatmu di track ${track} sudah tercatat di demo ini.`;
  formResult.hidden = false;
  registerForm.reset();
});
