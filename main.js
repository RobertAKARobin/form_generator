// Form data
const $ = {}

// Form component
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
		return form.fields.map((field)=>{
			if(field.code) evalCode(field)
			else return [
				m('label.field', [
					m('span.label', field.label),
					m('span.input', evalField(field))
				])
			]
		})

		function evalCode(){

		}

		function evalField(field){
			if(field.type == 'select' || field.type == 'multiselect'){
				return m('select', {
					name: field.field,
					multiple: (field.type == 'multiselect' ? true : false),
					onchange: updateData
				}, field.values.map((value)=>{
					return m('option', {
						value: value
					}, value)
				}))
			}else{
				return m('input', {
					type: field.type,
					name: field.field,
					onchange: updateData
				})
			}
		}

		function updateData(event){
			const input = event.target
			let value
			if(input.hasAttribute('multiple')){
				const options = Array.from(input.querySelectorAll('option'))
				value = options.filter(option => option.selected).map(option => option.value)
			}else if(input.type == 'checkbox'){
				value = (input.checked ? true : false)
			}else{
				value = input.value
			}
			$[input.name] = value
		}
	}
}

window.addEventListener('DOMContentLoaded', ()=>{
	const form = new Form()
	m.mount(document.getElementById('form'), form)
})
