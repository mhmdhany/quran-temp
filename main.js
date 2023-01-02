let fixedNav = document.querySelector(".header"),
  hadithBox = document.querySelector(".hadith-box"),
  hadithNumber = document.querySelector(".hadith-btns .number"),
  nextBtn = document.querySelector(".hadith-btns .next"),
  prevBtn = document.querySelector(".hadith-btns .prev"),
  scrollBtn = document.querySelector(".scroll-btn"),
  hadithIndex = 0;

window.addEventListener("scroll", () => {
  // Navbar
  window.scrollY > 100
    ? fixedNav.classList.add("scrolling")
    : fixedNav.classList.remove("scrolling");
  // Scroll to top Button
  window.scrollY > 500
    ? scrollBtn.classList.add("show")
    : scrollBtn.classList.remove("show");
});
scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
// LInks Position
document.querySelectorAll(".links li").forEach((li) => {
  li.addEventListener("click", () => {
    document.querySelector(`${li.dataset.filter}`).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// FETCH Data
fetch("https://api.hadith.gading.dev/books/bukhari?range=300-500")
  .then((response) => response.json())
  .then((result) => {
    let hadiths = result.data.hadiths;
    getHadith(hadiths);
    nextBtn.addEventListener("click", () => {
      hadithIndex == 200 ? (hadithIndex = 0) : hadithIndex++;
      getHadith(hadiths);
    });
    prevBtn.addEventListener("click", () => {
      hadithIndex == 0 ? (hadithIndex = 200) : hadithIndex--;
      getHadith(hadiths);
    });
  });
function getHadith(hadiths) {
  hadithBox.innerHTML = hadiths[hadithIndex].arab;
  hadithNumber.innerHTML = `201 - ${hadithIndex + 1}`;
}
// Get Sorahs
let SorahsContainer = document.querySelector(".sorah-container");
fetch("http://api.alquran.cloud/v1/meta")
  .then((res) => res.json())
  .then((data) => {
    let sorahs = data.data.surahs.references;
    for (let sorah of sorahs) {
      SorahsContainer.innerHTML += `
    <div class="sorah-box">
    <p>${sorah.name}</p>
    <p>${sorah.englishName}</p>
    </div>
    `;
    }
    // Get Ayat
    let sorahsBox = document.querySelectorAll(".sorah-box"),
      ayahsContainer = document.querySelector(".ayahs-container"),
      sorahsOverlay = document.querySelector(".sorahs-overlay"),
      closeBtn = document.querySelector(".sorahs-overlay .close");
    sorahsBox.forEach((box, index) => {
      box.addEventListener("click", () => {
        fetch(`http://api.alquran.cloud/v1/surah/${index + 1}`)
          .then((res) => res.json())
          .then((data) => {
            ayahsContainer.innerHTML = "";
            let ayahs = data.data.ayahs;
            ayahs.forEach((ayah) => {
              sorahsOverlay.classList.add("open");
              ayahsContainer.innerHTML += `<p class="ayah">${ayah.text}</p>`;
              closeBtn.addEventListener("click", () => {
                sorahsOverlay.classList.remove("open");
              });
            });
          });
      });
    });
  });
// get prayer times
let cards = document.querySelector(".cards");
getTimes();
function getTimes() {
  fetch(
    "http://api.aladhan.com/v1/timingsByCity?city=cairo&country=egypt&method=8"
  )
    .then((res) => res.json())
    .then((data) => {
      let times = data.data.timings;
      console.log(times);
      cards.innerHTML = "";
      for (let time in times) {
        cards.innerHTML += `
        <div class="card">
        <div class="circle">
          <svg>
            <Circle cx = '100' cy = '100' r = '100'></Circle>
          </svg>
          <div class="pray-time">${times[time]}</div>
        </div>
        <p>${time}</p>
      </div>
    </div>`;
      }
    });
}
// On pressing Escape Removing Ayat Overlay
window.onkeyup = function (e) {
  if (e.key === "Escape") {
    document.querySelector(".sorahs-overlay").classList.remove("open");
  }
};
