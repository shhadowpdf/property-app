function query(e) {
    return document.querySelector(e)
}
const callBTN = query(".left-box");
const emailBTN = query(".right-box");

callBTN.addEventListener('click', () => {
    window.location.href = "tel:+919669399568"
});
emailBTN.addEventListener('click', () => {
    window.location.href = "mailto:sakshamkushwah06@gmail.com"
});
const menuToggle = document.getElementById("menuToggle");
const navBar = query(".nav-options")
const everything = query("*")
everything.style.transition = "filter 0.3s ease";
const blur1 = query(".hero-section");
const blur2 = query(".nav-text");
const navOption = document.querySelectorAll(".nav-options a");
const formStatus = query(".form-status");

menuToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isVisible = navBar.style.opacity === "1";
    if (!isVisible) {
        navBar.style.opacity = "1";
        navBar.style.pointerEvents = "auto";
        blur1.style.filter = "blur(20px)";
        blur2.style.filter = "blur(20px)";
        menuToggle.style.filter = "none";
        navBar.style.filter = "none"
    } else {
        blur1.style.filter = "none";
        blur2.style.filter = "none";
        navBar.style.opacity = "0";
        navBar.style.pointerEvents = "none";
        everything.style.filter = "none";
    }
});

if (!window.matchMedia("(min-width:768px)").matches) {
    navOption.forEach((option) => {
        option.addEventListener('click', (e) => {
            blur1.style.filter = "none";
            blur2.style.filter = "none";
            navBar.style.opacity = "0";
            navBar.style.pointerEvents = "none";
            everything.style.filter = "none";
        });
    });
}
function showMessage(message, color) {
    formStatus.innerText = message;
    formStatus.style.color = color;
    formStatus.style.display = "block";

    setTimeout(() => {
        formStatus.innerText = "";
        formStatus.style.display = "none";
    }, 4000);
}
query(".contact-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        const re = await fetch('/contactus/user-count');
        const u = await re.json();
        const userCount = u.count;
        const formData = new FormData(e.target);
        const data = {
            number: userCount+1,
            name: formData.get("fullname"),
            email: formData.get("email"),
            phone: formData.get("contactno"),
        }
        
        const response = await fetch('/contactus', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showMessage("✅Form submitted successfully", " #1AA260");
            e.target.reset();
        } else {
            showMessage("❌Form submission failed", "#CD5C5C");
        }
    } catch (err) {
        console.log(err);
        showMessage("❌Form submission failed due to some internal error", "#CD5C5C");

    }


})