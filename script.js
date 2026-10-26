
const panels = [...document.querySelectorAll(".panel")];

function openPanel(id) {
  panels.forEach(panel => {
    panel.hidden = panel.id !== id;
  });

  const target = document.getElementById(id);

  if (target) {
    target.hidden = false;

    setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }
}

document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    openPanel(button.dataset.open);
  });
});

document.querySelectorAll("[data-close]").forEach(button => {
  button.addEventListener("click", () => {
    button.closest(".panel").hidden = true;

    document.querySelector(".section-heading").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const value = document.getElementById(
      button.dataset.copy
    ).textContent;

    try {
      await navigator.clipboard.writeText(value);
      button.textContent = "Copied!";
    } catch {
      button.textContent = value;
    }

    setTimeout(() => {
      button.textContent = "Copy";
    }, 1500);
  });
});

const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

function localDate(date) {
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

const today = new Date();

checkin.min = localDate(today);

checkout.min = localDate(
  new Date(today.getTime() + 86400000)
);

checkin.addEventListener("change", () => {
  const nextDay = new Date(checkin.value + "T12:00:00");

  nextDay.setDate(nextDay.getDate() + 1);

  checkout.min = localDate(nextDay);

  if (checkout.value && checkout.value <= checkin.value) {
    checkout.value = localDate(nextDay);
  }
});

document.getElementById("bookingForm").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    if (checkout.value <= checkin.value) {
      document.getElementById("bookingStatus").textContent =
        "Check-out must be after check-in.";
      return;
    }

    const form = new FormData(event.target);

    const message =
`DEMO BOOKING REQUEST - Aashish Raikwar
Name: ${form.get("guestName")}
Phone: ${form.get("phone")}
Check-in: ${form.get("checkin")}
Check-out: ${form.get("checkout")}
Guests: ${form.get("guests")}
Room: ${form.get("roomType")}
Special requests: ${form.get("notes") || "None"}

Please confirm availability and price.`;

    document.getElementById("bookingStatus").textContent =
      "Opening WhatsApp draft. This is not a confirmed reservation.";

    // Replace with the hotel's real WhatsApp number.
    window.open(
      "https://wa.me/910000000000?text=" +
        encodeURIComponent(message),
      "_blank"
    );
  }
);

let selectedRating = 5;

document.querySelectorAll("[data-rating]").forEach(button => {
  button.addEventListener("click", () => {
    selectedRating = Number(button.dataset.rating);

    document.querySelectorAll("[data-rating]").forEach(star => {
      star.classList.toggle(
        "selected",
        Number(star.dataset.rating) <= selectedRating
      );
    });
  });
});

document.getElementById("feedbackForm").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const comments = document.getElementById(
      "comments"
    ).value.trim();

    const name = document.getElementById(
      "feedbackName"
    ).value.trim();

    document.getElementById("feedbackStatus").textContent =
      `Preview: ${selectedRating}/5 stars, ` +
      `${name || "Guest"} — "${comments}". ` +
      "Feedback has not been saved.";
  }
);
