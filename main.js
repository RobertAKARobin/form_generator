class Form{

	view(){
		return m('p', 'Hello, world!')
	}

}

window.addEventListener('DOMContentLoaded', ()=>{
	var form = new Form()
	m.mount(document.getElementById('form'), form)
});
