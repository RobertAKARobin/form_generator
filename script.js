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
				if($[field.field] === undefined && field.type != 'readonly'){
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
			if(field.type == 'select' || field.type == 'multiselect'){
				return m('select', {
					name: field.field,
					multiple: (field.type == 'multiselect' ? true : false),
					onchange: updateData
				}, [
					m('option', ' '),
					field.values.map((value)=>{
						return m('option', {
							value: value,
							selected: ($[field.field] === value)
						}, value)
					})
				])
			}else if(field.type == 'boolean'){
				return m('select', {
					name: field.field,
					onchange: updateData
				}, [
					m('option', ' '),
					m('option', {
						value: 'Yes',
						selected: ($[field.field] === 'Yes')
					}, 'Yes'),
					m('option', {
						value: 'No',
						selected: ($[field.field] === 'No')
					}, 'No')
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
