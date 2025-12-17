class Logger {
	msg = [];

	constructor(...msg) {
		if(msg) {
			for (let i=0;i<msg.length;i++) {
				let m = msg[i];
				if(typeof m == 'object') {
					msg[i] = window.JSON.stringify(m);
				}
			}
		}
		this.msg = msg;
	}

	log(name, level) {
		let time = format();
		let text = '%c[' + level.toString() + ']%c' + time + ' ' + name;
		console.log(text + "%c[text] => " + this.msg, 'color: ' + level.colour, 'color: black;', 'font-weight: bold');
		return this;
	}

	upload(name, level, callback) {
		setTimeout(() => {
			callback && callback(name, level, ...this.msg);
		})
	}
}



function localTime(i) {
	let date = new Date();

	if (typeof i !== 'number'){
		return date;
	}

	let len = date.getTime();
	let offset = date.getTimezoneOffset() * 60000;
	let utcTime = len + offset;
	return new Date(utcTime + 3600000 * i);
}

function format(formatStr = 'y-m-d h:i:s') {
	let date = localTime(8);//获取北京时间
	let year = date.getFullYear();
	let month = date.getMonth();
	let day = date.getDay();
	let hours = date.getHours();
	let min = date.getMinutes();
	let sec = date.getSeconds();

	month = month < 10 ? '0' + month : month;
	day = day < 10 ? '0' + day : day;
	hours = hours < 10 ? '0' + hours : hours;
	min = min < 10 ? '0' + min : min;
	sec = sec < 10 ? '0' + sec : sec;

	return formatStr.replace('y', year)
		.replace('m', month)
		.replace('d', day)
		.replace('h', hours)
		.replace('i', min)
		.replace('s', sec);
}

export default Logger;
