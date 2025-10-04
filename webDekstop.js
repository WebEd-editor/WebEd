(() => {
  if(1020 < screen.width){
  	MyOpen = function (id) {
  		document.getElementById(id).style.display = "block";
  		if(id === 'sidebar') updateTree();
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
		document.querySelector("#editor-wrapper").style.display = "block";
		const s = document.querySelector("#sidebar");
		s.style.display = "block"; //sidebar tree, editor-wrapper add elements
	  s.style.left = "80%"; 
		document.querySelectorAll('summary').forEach(s => {s.style.fontSize = "13px";})
		document.querySelector('#editor-wrapper').style.left = "10px";
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
	 }else if(w === "768"){
	 		p.style.width = "768px";
	 }else if(w === "320"){
	 		p.style.width = "320px";
	 }
}
