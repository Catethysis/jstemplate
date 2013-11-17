var template = 
	"{{ category }}"+
	"{% irems %}" +
	"<ba>{% . %}" +
	"<li>{{ . }}</li>" +
	"{% / %}</ba>" +
	"{% / %}" +
	"</ol>\n" +
	"{% idems %}" +
	// "<TR>{% . %}" +
	"<HG>{{ . }}</HG>" +
	// "{% / %}</TR>" +
	"{% / %}" +
	"</ol>\n"
	data={
	category: "Fruits",
	items: ["Mango", "Banana", "Orange" ], irems: [[1,2], [3,4], [5,6]], idems: [5,6]
};

ar=template.replace(/\{#[^]*\#}/g, '').replace(/\n/g,'\\n').split(/(\{{ [\s\S]*? }}|\{% [\s\S]*? %})/g);

function mod(str) {
	return str;
}

for(i in ar) {
	switch(ar[i].slice(0,2)) {
		case '{{': ar[i]={data: ar[i].match(/\{{([\s\S]*?)}}/)[1].trim(), type: 'varbl'}; break;
		case '{%': dat=ar[i].match(/\{%([\s\S]*?)%}/)[1].trim(); ar[i]={data: dat, type: (dat=='/'?'clend':'cycle')}; break;
		default: ar[i]={data: ar[i], type: 'text'}; break;
	}
}
for(i in ar) if((ar[i].type=='varbl')&&(ar[i].data!='.')) { ar[i].data=mod(data[ar[i].data]); ar[i].type='text'; }
deep=1;
deeps=[];
cyc=1;
for(i in ar)
	switch(ar[i].type) {
		case 'clend': ar[i].deep=--deep; ar[deeps.pop()].cyclend=cyc; ar[i].cyclend=cyc; cyc++; break;
		case 'cycle': ar[i].deep=deep++; deeps.push(i); break;
		default     : ar[i].deep=deep;
}

for(i in ar) { if((ar[i].deep==1)&&(ar[i].type=='cycle')) ar[i].data=data[ar[i].data]; }

insert = function (elem, data) { tmp={}; for(p in elem) tmp[p]=elem[p]; tmp.deep--; if((tmp.deep==1)&&(tmp.data=='.')) tmp.data=data; return tmp; }
i=0;
while(i<ar.length) {
	if(ar[i].type=='cycle') {
		body=[];
		deep=ar[i].deep;
		popped={};
		data=ar[i].data; ar.splice(i, 1);
		while((popped.type=='cycle')||(popped.deep!=deep)) { popped=ar.splice(i, 1)[0]; body.push(popped); } body.pop();
		for(k in data) for(l in body) ar.splice(i++, 0, insert(body[l], data[k]));
		i=0;
	}
	i++;
}/*
s='';
ar.forEach(function(elem, index) {
	s+=elem.data;
});*/
console.log(ar.map(function(elem) { return elem.data; }).join(''));