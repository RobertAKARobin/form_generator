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
			if(field.code){
				evalCode(field.code)
			}else{
				let doShow = true
				if(field.show_if){
					doShow = !!(evalCode(field.show_if))
				}
				if(doShow){
					return m('label.field', [
						m('span.label', field.label),
						m('span.input', evalField(field))
					])
				}
			}
		})

		function evalCode(codeString){
			codeString = codeString.replace('\\n', '\n')
			try{
				return eval(codeString)
			}catch(error){
				console.log(`${error.message}: ${codeString}`)
				return false
			}
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
			}else if(field.type == 'boolean'){
				return m('select', {
					name: field.field,
					onchange: updateData
				}, [
					m('option', ' '),
					m('option', {value: 'Yes'}, 'Yes'),
					m('option', {value: 'No'}, 'No')
				])
			}else if(field.type == 'readonly'){
				return m('span', $[field.field])
			}else{
				return m('input', {
					type: field.type,
					name: field.field,
					onchange: updateData,
					value: ($[field.field] || '')
				})
			}
		}

		function updateData(event){
			const input = event.target
			let value
			if(input.hasAttribute('multiple')){
				const options = Array.from(input.querySelectorAll('option'))
				value = options.filter(option => option.selected).map(option => option.value)
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
