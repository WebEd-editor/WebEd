function dek(){
  if(1020 < screen.width){
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
		document.querySelector("#sidebar").style.display = "block";
		document.querySelectorAll('summary').forEach(s => {s.style.fontSize = "13px";})
		document.querySelector('#editor-wrapper').style.left = "10px";
		const footer = document.querySelector('#foo');
		footer.style = "position: fixed;bottom: 0;left: 50%;z-index: 102;transform: translateX(-50%);";
		footer.classList.remove('drag-box');
		footer.querySelectorAll('button').forEach(f => {
			f.style.padding = "10px"
			f.style.cursor = "pointer";
		});

		// preview
		document.querySelector('ppp').style = "background: #000;position: fixed;bottom: 15px;left: 50%;transform: translateX(-50%);height: 90%;width: 25%;overflow: auto;border-radius: 5px;resize: both;border: 2px solid #222;"
	}
}
dek();
