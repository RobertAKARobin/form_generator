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
		const $ = {}
		return form.fields.map((field)=>{
			if(field.code) evalCode(field)
			else return [
				m('label', [
					m('span', field.label),
					evalField(field)
				])
			]
		})

		function evalCode(){

		}

		function evalField(field){
			switch(field.type){
				case 'select':
					return m('select', {
						name: field.name
					}, field.values.map((value)=>{
						return m('option', {
							value: value
						}, value)
					}))
					break
			}
		}
	}

}

window.addEventListener('DOMContentLoaded', ()=>{
	var form = new Form()
	m.mount(document.getElementById('form'), form)
})
