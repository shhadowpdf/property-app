function query(e) {
    return document.querySelector(e);
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        query('.nav-text').style.display = "none"
        const menuToggle = document.getElementById("menuToggle");
        query("*").style.transition = "filter 0.3s ease";
        const blur1 = query("header");
        const blur2 = query(".nav-text");
        const blur3 = query(".user-listing")
        const navOption = document.querySelectorAll(".nav-options a");
        const navBar = query(".nav-options");

        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isVisible = navBar.style.opacity === "1";
            if (!isVisible) {
                navBar.style.opacity = "1";
                navBar.style.pointerEvents = "auto";
                blur1.style.filter = "";
                blur1.style.backgroundColor = "#fff"
                blur3.style.filter = "blur(20px)";
                blur3.style.backgroundColor = "#fff"
                blur2.style.filter = "blur(20px)";
                menuToggle.style.filter = "none";
                navBar.style.filter = "none"
                menuToggle.style.color = "#121212"
                navOption.forEach(option => {
                    option.style.color = "#121212";
                    option.style.borderColor = "#121212"
                })


            } else {
                blur1.style.filter = "none";
                blur1.style.backgroundColor = ""
                blur3.style.backgroundColor = ""
                blur2.style.filter = "none";
                blur3.style.filter = "none";
                blur3.style.backgroundColor = ""
                blur1.style.backgroundColor = ""
                navBar.style.opacity = "0";
                navBar.style.pointerEvents = "none";
                menuToggle.style.color = ""
            }
        });
        const response = await fetch('/contactus/fetch-users');
        const users = await response.json();
        const container = query('.user-listing');
        for(const u of users){
            const usercard = document.createElement('div');
            usercard.className = 'user-card'
            usercard.innerHTML =`
                  <p id="id">USER ID: ${u.number}</p>
      <p id="name">Customer Name: ${u.name}</p>
      <p id="phoneno">Phone No: ${u.phone}</p>
      <p id="email">Email: ${u.email != null ? u.email : "Not available"}</p>
      <div class="call-btn">
        <button type="button" class="callbtn" id="callbtn">
          Click here to call now
        </button>
      </div>
            `

            usercard.querySelector("#callbtn").addEventListener('click', () =>{
                window.location.href = `+91${u.phone}`
            });
            container.appendChild(usercard);
        }
    } catch (err) {
        console.log(err);
    }
})