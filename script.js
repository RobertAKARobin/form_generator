// Form data
const $ = {}

// Form component
class Form{

	constructor(){
		const form = this
	}

	oninit(){
		const form = this
		form._loadURLParams()
	}

	_loadURLParams(){
		let urlParams
		let param
		try{
			urlParams = JSON.parse('{"' + decodeURIComponent(location.search.substring(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\+/g, ' ') + '"}')
		}catch(error){
			urlParams = {}
		}
		for(param in urlParams){
			$[param] = urlParams[param]
		}
	}

	view(){
		const form = this
		let isLastFieldWithValue = false
		return formFieldsJSON.map((field)=>{
			let doSkip = false
			if(field.show_if && evalCode(field.show_if) == false){
				doSkip = true
			}else if(field.type == 'readonly'){
				doSkip = false
			}else if(isLastFieldWithValue){
				doSkip = true
			}

			if(doSkip){
				return false
			}else if(field.code){
				evalCode(field.code)
			}else{
				if($[field.name] === undefined && field.type != 'readonly'){
					console.log()
					isLastFieldWithValue = true
				}
				return m('label.field', [
					m('span.label', field.label),
					m('span.input', evalField(field))
				])
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
			let {name, type, label = '', options = [], multiple = (type == 'multiselect')} = field
			if(type == 'select' || type == 'multiselect'){
				return viewAsSelect()
			}else if(type == 'boolean'){
				options = ['Yes', 'No']
				return viewAsSelect()
			}else if(type == 'readonly'){
				return m('span', $[name])
			}else{
				return m('input', {
					type,
					name,
					onchange: updateData,
					value: ($[name] || '')
				})
			}

			function viewAsSelect(input){
				return m('select', {
					name,
					multiple,
					onchange: updateData
				}, [
					m('option', ' '),
					options.map(value=>{
						return m('option', {
							value,
							selected: ($[name] === value)
						}, value)
					})
				])
			}
		}

		function updateData(event){
			const input = event.target
			if(input.hasAttribute('multiple')){
				const options = Array.from(input.querySelectorAll('option'))
				$[input.name] = options.filter(option => (option.selected && option.value)).map(option => option.value)
			}else{
				$[input.name] = input.value
			}
		}
	}
}

window.addEventListener('DOMContentLoaded', ()=>{
	const form = new Form()
	m.mount(document.getElementById('form'), form)
})
