function menuload(){
   const menupage = document.getElementById("webedmenu");
   menupage.innerHTML = `
   <div style="position: fixed;top: 0;left: 0;box-shadow: rgba(200, 200, 200, 0.4) 0px 4px 10px;width: 100%;margin-bottom: 10px;">
     <header class="" id="" style="color: rgb(0, 0, 0); font-size: 16px; outline: none; display: flex; justify-content: space-between;">      
       <div class="" style="outline: none; color: rgb(255, 255, 255); font-size: 16px; font-weight: 500; opacity: 1; display: flex; justify-content: center; align-items: center;" id="">
         <img src="https://webed-editor.github.io/WebEd/logo.png" alt="Uploaded Image" class="" content="false" id="" style="max-width: 100%; margin: 5px; opacity: 1; width: 40px; height: 40px; outline: none; border-radius: 5px; font-size: 16px; font-weight: 500; visibility: visible; display: block;" />
         <p class="" id="" style="color: rgb(255, 255, 255); font-size: 27px; font-weight: 300; opacity: 1; margin: 0px; outline: none;">
           WebEd
         </p>
       </div>
       <div class="" style="outline: none; color: rgb(255, 255, 255); font-size: 16px; font-weight: 500; opacity: 1; display: flex; justify-content: center; align-items: center;">
         <button onclick="closewebedmenu()" class="" id="" style="font-family: 'roboto', sans-serif; color: rgb(0, 0, 0); font-size: 16px; opacity: 1; top: 10px; right: 10px; margin: 10px; padding: 5px; border: none; border-radius: 5px; outline: none; cursor: pointer;">
           Open Editor
         </button>
       </div>
     </header>
    <div class="" style="background: #000; width: 100%; position: sticky; top: 0; left: 0; padding: 5px 0px; opacity: 1; display: flex; overflow: auto; gap: 5px;" id="">
      <button class="bb bb1" onclick="ooo('tt1','bb1')" style="font-size: 16px; opacity: 1; cursor: pointer; font-family: Roboto, sans-serif; padding: 5px 10px; outline: none; background-color: rgb(23, 23, 23); color: #888; border: none;border-bottom: 1px solid transparent;">
        Home
      </button>
      <button class="bb bb2" onclick="ooo('tt2','bb2')" class="" id="" style=" font-size: 16px; opacity: 1; cursor: pointer; font-family: Roboto, sans-serif; padding: 5px 10px; outline: none; background-color: rgb(23, 23, 23); color: #888; border: none; border-bottom: 1px solid transparent;">
         Custom_Code
      </button>
      <button class="bb bb3" onclick="ooo('tt3','bb3')" class="" id="" style=" font-size: 16px; opacity: 1; cursor: pointer; font-family: Roboto, sans-serif; padding: 5px 10px; outline: none; background-color: rgb(23, 23, 23); color: #888; border: none; border-bottom: 1px solid transparent">
         Projects
      </button>
      <button class="bb bb4" onclick="ooo('tt4','bb4'); rr()" class="" id="" style=" font-size: 16px; opacity: 1; cursor: pointer; font-family: Roboto, sans-serif; padding: 5px 10px; outline: none; background-color: rgb(23, 23, 23); color: #888; border: none;border-bottom: 1px solid transparent">
        Code_View
      </button>
      <button class="bb bb5" onclick="ooo('tt5','bb5')" class="" id="" style=" font-size: 16px; opacity: 1; cursor: pointer; font-family: Roboto, sans-serif; padding: 5px 10px; outline: none; background-color: rgb(23, 23, 23); color: #888; border: none;border-bottom: 1px solid transparent">
        Help
      </button>
    </div>
   </div>
    <div class="ttt tt1" style="width: 100%;">
        <div class="welcome">
           <video autoplay muted loop style="position: absolute;top: 100px; opacity: 0.5;width: 100%;" src="https://videos.pexels.com/video-files/7438482/7438482-sd_360_624_30fps.mp4"></video>
           <div style="position: relative;top: 120px; height: 100%; width: 100%; background: linear-gradient(0deg, #000, transparent, transparent);">
              <h1>Welcome to our Website builder tool</h1>
              <a href="https://auth-p1ny.onrender.com" style="text-decoration: none;color: black; background: white; padding: 10px;">Login</a>
              <p id="username"></p>
              <p>Make a site likes easy way, use WebEd for creating a website.</p>
              <button class="bbbttt" id="installAppBtn">Try Now As App</button>
              <div>
                 <video autoplay muted loop src="file:///storage/emulated/0/Android/data/com.teejay.trebedit/files/TrebEdit user files/Sample project - Acme/video /spider video.mp4"></video>
              </div>
           </div>
        </div>
    </div>
    <div class="ttt tt2" style="width: 100%; margin-top: 110px;">
        <button onclick="createFile('js')">+ JS File</button>
        <button onclick="createFile('css')">+ CSS File</button>
        <button onclick="applyFile()">Run</button>
        <button onclick="openFullPreview()">preview new tab</button>
        <button id="eundo">Undo</button>
        <button id="eredo">Redo</button>
        <button onclick="document.getElementById('toolboxx').style.display='flex'">Toolbar</button>
        <div id="toolboxx" style="background: black;position: fixed;bottom: 0;left: 0;display: none;align-items: center;gap: 2px;width: 100%;z-index: 109;">
           <div> Go to<input type="number" id="gotoline"/></div>
           <div class="toolbar" style="width: 60%;">
              <input type="text" id="searchText" placeholder="Search text..." style="margin: 2px 0; width: 95%;" /><br>
              <div style="display: flex;gap: 2px;">
                 <button id="findNext" style="width: 50%;">Next</button>
                 <button id="findPrev" style="width: 50%;">Previous</button>
              </div>
           </div>
           <button onclick="document.getElementById('toolboxx').style.display='none'">×</button>
        </div>
        <ul id="fileList"></ul>
        <div id="fileEditor" style="position: sticky;top: 0;left: 0;width: 100%;height: 400px;">/* write your code here. */</div>
    </div>
    <div class="ttt tt3" style="width: 100%;margin-top: 110px;">
       <button onclick="saveProject()">Save Project</button>
       <div id="projectList"></div>
    </div>
    <div class="ttt tt4" style="width: 100%;margin-top: 110px;">
       <textarea id="htmlcssjs" style="user-select: none;" readonly></textarea>
       <button onclick="downloadAsImg()">download as image</button>
       <div>wrap text: <input id="wrapCodeFull" onchange='document.getElementById("htmlcssjs").wrap = document.getElementById("wrapCodeFull").checked ? "off" : "hard";' type="checkbox"></div>
       <select id="viewport">
        <option value="desktop">Desktop</option>
        <option value="tablet">Tablet</option>
        <option value="mobile">Mobile</option>
       </select>
    </div>
    <script>
      const iframe = document.getElementById('canvas');
      document.getElementById('viewport').addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'desktop') {
          iframe.style.width = '1024px';
          iframe.style.transform = 'scale(1)';
        } else if (val === 'tablet') {
          iframe.style.width = '768px';
          iframe.style.transform = 'scale(1)';
        } else if (val === 'mobile') {
          iframe.style.width = '375px';
          iframe.style.transform = 'scale(1)';
        }
      });
    </script>
    <div class="ttt tt5" style="width: 100%;margin-top: 110px;">help page</div>
   
   `;
}
menuload();


// for closing menu
function closewebedmenu() {
  document.getElementById("webedmenu").style.display = "none";

  // Go back in history (remove the state)
  if (location.hash === "#webedmenu") {
    history.back(); // Will trigger popstate
  }
}

// Handle browser/mobile back button
window.addEventListener("popstate", function (event) {
  // If menu is open, close it
  if (document.getElementById("webedmenu").style.display === "block") {
    closewebedmenu(); // just close the menu
  }
});

function ooo(idd, btn){
   var t = document.querySelectorAll(".ttt");
   t.forEach(tb => { tb.style.display = 'none'; });
   document.querySelector("."+idd).style.display="block";
   
   var b = document.querySelectorAll(".bb");
   b.forEach(bt => { bt.classList.remove('btnhover') });
   document.querySelector("."+btn).classList.add('btnhover');
} 
ooo('tt1', 'bb1');

  let deferredPrompt;
  const installBtn = document.getElementById('installAppBtn');

  // Triggered only if PWA is installable
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();              // Stop default mini prompt
    deferredPrompt = e;             // Save the event for later
    installBtn.style.display = 'inline-block';  // Show the install button
  });

  // On click, prompt the user
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();      // Show the browser install popup
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      deferredPrompt = null;
      installBtn.style.display = 'none'; // Hide button after choice
    }
  });

  // Optional: Hide the button if already installed
  window.addEventListener('appinstalled', () => {
    console.log('✅ App installed');
    installBtn.style.display = 'none';
  });

async function getUser() {
  try {
    let res = await fetch("https://auth-p1ny.onrender.com/api/me", {
      method: "GET",
      credentials: "include" // cookies/session bhejne ke liye zaroori
    });

    if (!res.ok) {
      document.getElementById("username").innerText = "Not logged in";
      return;
    }

    let data = await res.json();
    document.getElementById("username").innerText = "Welcome, " + data.username;
  } catch (err) {
    console.error("Error fetching user:", err);
  }
}
getUser();


