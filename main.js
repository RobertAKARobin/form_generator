class Form{

	constructor(){
		const form = this
		form.fields = []
	}

	oninit(){
		const form = this
		m.request('./fields.json').then((response)=>{
			form.fields = response
		})
	}

	view(){
		const form = this
		return m('p', 'Hello, world!')
	}

}

window.addEventListener('DOMContentLoaded', ()=>{
	var form = new Form()
	m.mount(document.getElementById('form'), form)
});
