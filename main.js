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
			if(field.type == 'select' || field.type == 'multiselect'){
				return m('select', {
					name: field.name,
					multiple: (field.type == 'multiselect' ? true : false)
				}, field.values.map((value)=>{
					return m('option', {
						value: value
					}, value)
				}))
			}
		}
	}
}

window.addEventListener('DOMContentLoaded', ()=>{
	var form = new Form()
	m.mount(document.getElementById('form'), form)
})
