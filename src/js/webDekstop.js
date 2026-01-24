(() => {
  if(1020 < screen.width){
  	MyOpen = function (id) {
  		document.getElementById(id).style.display = "block";
  		if(id === 'sidebar') updateTree();
    if(id === 'seticon'){
        ['addSh','previewIconTab','treeTabForIcon','iconEditor'].forEach(t => {
          document.getElementById(t).style.display="none";
       });
    }
  	}
  	startFloatDrag = function () {
  		console.log('d3d3d3d3d3');
  	}
		let at = document.querySelectorAll('.tab');
		at.forEach(allt => {
			allt.classList.remove('drag-el');
			allt.style.width = "18%";
			allt.style.height = "98%";
			allt.style.top = "5px";
			allt.style.right = "5px";
			allt.style.resize = "none";
		});
		const a = document.querySelector("#editor-wrapper");
  a.style.display = "block";
  a.style.left= "42px";
  a.style.width="100px"; a.style.height="92%";
  a.style.top="40px";
		const s = document.querySelector("#sidebar");
		s.style.display = "block"; //sidebar tree, editor-wrapper add elements
	  s.style.left = "80%";
	  s.style.top="40px";
	  s.style.height="92%";
   const ed = document.getElementById("editModal");
   ed.style.left="80%";
   ed.style.top="40px";
   ed.style.height="92%";

   const icoed = document.getElementById("seticon");
   icoed.style="width:90%; height:80%; z-index:103; top: 50px; left: 50%; transform: translateX(-50%);";
   document.getElementById("iconEditor").style="width:400px; height:500px; z-index:103; top: 50px; left:40px;";
   document.getElementById("iconGrid").style.width = "300px";
   document.getElementById("addSh").style="width: 100px; height: 130px; top: 50px; left: 450px;";
   document.getElementById("treeTabForIcon").style="top: 50px; left: 510px; width: 100px; height: 120px;";
   document.getElementById("previewIconTab").style="top: 50px; left: 620px; width: 100px; height: 120px;";
		document.querySelectorAll('summary').forEach(s => {s.style.fontSize = "13px";})
		
		const footer = document.querySelector('#foo');
		footer.style = "position: fixed;left: 0;top: 50%;z-index: 102;transform: translateY(-50%);display:flex;flex-direction: column;";
		footer.classList.remove('drag-box');
		footer.querySelectorAll('button').forEach(f => {
			f.style.padding = "10px"
			f.style.cursor = "pointer";
		});
	}
})();

function preDec() {
	if(1020 < screen.width){
			document.querySelector('ppp').style = "background: #000;position: fixed;bottom: 15px;left: 50%;transform: translateX(-50%);height: 90%;width: 25%;overflow: auto;border-radius: 5px;resize: both;border: 2px solid #222;"
	}
}
preDec();

// dekstop header
function headDec(){
  if(1020 < screen.width){
	 const h = document.querySelector('.headDec');
	 h.style = "border-bottom: 1px solid #000;z-index:102;display: flex;justify-content: space-between;position: fixed; top: 0; background: #1c2644;color: white; width: 100%; padding: 5px;";
  }
}
headDec();

//preview converter
function precon(w){
	 const p = document.querySelector('ppp');
	 if(w === "1024"){
	 		p.style.width = "1024px";
	 		document.getElementById('respMode').value = w;
	 		respMode(w);
	 }else if(w === "768"){
	 		p.style.width = "768px";
	 		document.getElementById('respMode').value = w;
	 		respMode(w);
	 }else if(w === "320"){
	 		p.style.width = "320px";
	 		document.getElementById('respMode').value = w;
	 		respMode(w);
	 }else if(w === "default"){
	 		document.getElementById('respMode').value = w;
	 	  console.log('apply default styles.');
	 }else if(w === "hv"){
	 		document.getElementById('respMode').value = w;
	 		respMode(w);
	 }
}

