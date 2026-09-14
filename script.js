(() => {
  "use strict";

  const screens = Array.from(document.querySelectorAll(".screen"));
  let current = 0;
  let silkyIndex = 0;
  let silkyTimer = null;

  const popupOverlay = document.getElementById("popup-overlay");
  const popupText = document.getElementById("popup-text");
  const popupEmoji = document.getElementById("popup-emoji");
  const popupButton = document.getElementById("popup-button");

  function show(index) {
    if (!screens.length) return;

    current = Math.max(0, Math.min(index, screens.length - 1));

    screens.forEach((screen, i) => {
      screen.classList.toggle("active", i === current);
    });
  }

  function nextScreen() {
    show(current + 1);
  }

  function restartStory() {
    clearTimeout(silkyTimer);

    if (popupOverlay) {
      popupOverlay.classList.remove("show");
      popupOverlay.setAttribute("aria-hidden", "true");
    }

    silkyIndex = 0;
    show(0);
  }

  function answerQuestion(noteId, choice, messages, correctChoice) {
    const note = document.getElementById(noteId);

    if (note) {
      note.textContent = messages[choice] || "Try again. 👀";
    }

    // IMPORTANT:
    // Wrong answers stay on the same question.
    // Only the correct answer moves to the next screen.
    if (choice === correctChoice) {
      window.setTimeout(nextScreen, 1100);
    }
  }

  function handleNickname(choice) {
    answerQuestion(
      "quiz-nickname-note",
      choice,
      [
        "Close, but that's not the nickname. 😂 Try again.",
        "Nice try, but no pulling allowed here. 😂 Try again.",
        "CORRECT. Puliiiiiii. Obviously. 😂",
        "Almost. But you know the full version. 👀 Try again."
      ],
      2
    );
  }

  function handleSleep(choice) {
    answerQuestion(
      "quiz-sleep-note",
      choice,
      [
        "CORRECT. She sleeps first, I wake up first. 🌙☀️",
        "Nope — our routine works the other way around. 😂 Try again.",
        "That would be suspiciously convenient. 😂 Try again.",
        "There is definitely a routine. 😂 Try again."
      ],
      0
    );
  }

  function handleSohil(choice) {
    answerQuestion(
      "quiz-sohil-note",
      choice,
      [
        "CORRECT. He's our one and only saala. 😂📱",
        "Responsible answer... but not the answer we're looking for. 😭 Try again.",
        "Funny proposal, but the gift committee rejected it. 😂 Try again.",
        "The enthusiasm is appreciated. But choose again. 👀"
      ],
      0
    );
  }

  function handleChapter3(choice) {
    answerQuestion(
      "answer-note",
      choice,
      [
        "Possible... but the evidence is inconclusive. 😂 Try again.",
        "Also possible, but that's not the official answer. 👀 Try again.",
        "The evidence points elsewhere. 😂 Try again.",
        "CORRECT. We simply stopped using our names. 😂"
      ],
      3
    );
  }

  function handleChapter4(choice) {
    answerQuestion(
      "chapter4-note",
      choice,
      [
        "Definitely part of it. But there was more. 👀 Try again.",
        "“Baby” was a major milestone, but that's not the full answer. 😂 Try again.",
        "Jealousy definitely entered the story. 🕵️ But that's not the answer. Try again.",
        "Sharing personal things definitely brought us closer. ❤️ But that's not the answer. Try again.",
        "CORRECT. There wasn't a single moment. It just happened."
      ],
      4
    );
  }

  const silkyPopups = [
    {
      emoji: "🥺",
      text: "Close your eyes and think about him, if he make you feel special then the option “Yes” will come of its own ❤️",
      duration: 5000
    },
    {
      emoji: "👀",
      text: "Still thinking...",
      duration: 5000
    },
    {
      emoji: "🫡",
      text: "I will inform Boss to install the dating apps again, silky ain't interested.\n\nSigning off.....",
      duration: 5000
    },
    {
      emoji: "😏",
      text: "Kya bole pyaar karte ho aur abhi aa jaaun lene...",
      duration: 5000
    },
    {
      emoji: "🙄",
      text: "Kya bole beham hai mera...",
      duration: 5000
    },
    {
      emoji: "💔",
      text: "Bhula dena mujhe, tujhe jeena hai mere bina",
      duration: 5000
    }
  ];

  function startSilky() {
    clearTimeout(silkyTimer);
    silkyIndex = 0;
    showSilkyPopup();
  }

  function showSilkyPopup() {
    if (!popupOverlay || !popupText || !popupEmoji || !popupButton) return;

    clearTimeout(silkyTimer);

    if (silkyIndex >= silkyPopups.length) {
      popupOverlay.classList.remove("show");
      popupOverlay.setAttribute("aria-hidden", "true");
      nextScreen();
      return;
    }

    const item = silkyPopups[silkyIndex];

    popupEmoji.textContent = item.emoji;
    popupText.textContent = item.text;

    // Only the first popup has the OK button.
    popupButton.style.display = silkyIndex === 0 ? "inline-flex" : "none";

    popupOverlay.classList.add("show");
    popupOverlay.setAttribute("aria-hidden", "false");

    silkyTimer = window.setTimeout(() => {
      silkyIndex += 1;
      showSilkyPopup();
    }, item.duration);
  }

  function advanceSilky() {
    clearTimeout(silkyTimer);
    silkyIndex += 1;
    showSilkyPopup();
  }

  document.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");

    if (actionElement) {
      const action = actionElement.getAttribute("data-action");

      if (action === "next") {
        event.preventDefault();
        nextScreen();
        return;
      }

      if (action === "restart") {
        event.preventDefault();
        restartStory();
        return;
      }

      if (action === "silky-start") {
        event.preventDefault();
        startSilky();
        return;
      }

      if (action === "popup-next") {
        event.preventDefault();
        advanceSilky();
        return;
      }
    }

    const answerOption = event.target.closest(".answer-option");

    if (!answerOption) return;

    event.preventDefault();

    const choice = Number(answerOption.getAttribute("data-answer"));
    const screen = screens[current];

    if (!screen) return;

    switch (screen.id) {
      case "screen-14":
        handleChapter3(choice);
        break;

      case "screen-21":
        handleChapter4(choice);
        break;

      case "screen-32":
        handleNickname(choice);
        break;

      case "screen-33":
        handleSleep(choice);
        break;

      case "screen-34":
        handleSohil(choice);
        break;
    }
  });

  // Always start from the first page.
  show(0);
})();
