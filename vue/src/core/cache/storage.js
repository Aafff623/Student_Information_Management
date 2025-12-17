class Storage {
	constructor(name = "APP") {
		this.name = name;
		this.index = 0;
	}

	setName (name) {
		this.name = name;
	}

	getName () {
		return this.name + "_" + this.index;
	}

	getIndex () {
		return this.index;
	}

	use(index) {
		if(index<0 || index>16){
			throw Error("最大创建数不得超过16");
		}

		this.index = index;
		return this;
	}

	remove(key){
		let data;
		if(localStorage[this.getName()]){
			data = window.JSON.parse(localStorage[this.getName()]);
		}else{
			data = {};
		}

		delete data[key];
		localStorage[this.getName()] = window.JSON.stringify(data);
	}

	set(key, value, expire){
		let data;
		if(localStorage[this.getName()]){
			data = window.JSON.parse(localStorage[this.getName()]);
		}else{
			data = {};
		}
		let d = new Date();
		let obj = {
			value: window.JSON.stringify(value),
			time:(d.getTime()/1000).toFixed(0),
			expire:expire?expire:0
		};

		data[key] = obj;
		localStorage[this.getName()] = window.JSON.stringify(data);
	}

	get(key){
		let data;
		if(localStorage[this.getName()]){
			data = window.JSON.parse(localStorage[this.getName()]);
		}else{
			return null;
		}
		if(!data[key]){
			return null;
		}

		let obj = data[key];
		if(obj.expire>0){
			//检查过期时间
			if(getTime() - obj.time > obj.expire){
				delete data[key];
				localStorage[this.getName()] = window.JSON.stringify(data);
				return null;
			}
		}
		if(! obj || !obj.value) {
			return "";
		}
		return window.JSON.parse(obj.value);
	}

	getExpire(key){
		let data;
		if(localStorage[this.getName()]){
			data = window.JSON.parse(localStorage[this.getName()]);
		}else{
			return 0;
		}

		let obj = data[key];
		if(!obj){
			return 0;
		}
		return obj.expire ? obj.expire : 0;
	}

	drop(){
		localStorage.removeItem(this.getName());
	}

	flush() {
		for (let i=0;i<16;i++) {
			localStorage.removeItem(this.name + "_" + i);
		}
	}

	sizeof(charset = 'utf-8'){
		let total = 0, charCode, i, len;
		let str = localStorage[this.getName()];
		if(!str) {
			return total;
		}

		charset = charset ? charset.toLowerCase() : '';
		if(charset === 'utf-16' || charset === 'utf16'){
			for(i = 0, len = str.length; i < len; i++){
				charCode = str.charCodeAt(i);
				if(charCode <= 0xffff){
					total += 2;
				}else{
					total += 4;
				}
			}
		}else{
			for(i = 0, len = str.length; i < len; i++){
				charCode = str.charCodeAt(i);
				if(charCode <= 0x007f) {
					total += 1;
				}else if(charCode <= 0x07ff){
					total += 2;
				}else if(charCode <= 0xffff){
					total += 3;
				}else{
					total += 4;
				}
			}
		}
		return total;
	}
}

function getTime(){
	let d = new Date();
	return (d.getTime()/1000).toFixed(0);
}

export default Storage;

