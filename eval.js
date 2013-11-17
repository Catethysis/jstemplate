function render (template, data) {
	count=1;
	template='s="'+template.replace(/\n/g,'\\n'); // Экранируем \n
	template=template.replace(/\{#[^]*\#}/g, ''); // Удаляем комментарии вида {# ... #}

	// Теперь идём по шаблону в поисках управляющих конструкций.
	// Каждую встреченную конструкцию передаём в функцию-обработчик
	template=template.replace(/(\{{ ([\s\S]*?) }}|\{% ([\s\S]*?) %})/g, function (str, match, obj1, obj2) {
		// Объект 
		obj=(obj2==undefined ? obj1:obj2);

		// Попытаемся выделить модификаторы из переменной
		mods=obj.split(':'); 
		obj=mods[0];
		mods.splice(0, 1);

		// Разбираем конструкции
		if(match[1]=='{') { // Обращение к переменным
			if(obj!='.') {
				value=data[obj];
				if(value!=undefined) result=value; // Вернуть значение переменной из data
				else
					for(i in mods) {
						fnd=mods[i].match(/default\(([\s\S]*?)\)/);
						if(fnd!=null) result=fnd[1];
					}
			}
			else { // Вставить текущую переменную
				index=''; for(i=1;i<count;i++) index+='[i'+i+']';
				result='"+data1'+index+'+"';
			}
			for(i in mods) // Применяем модификаторы
				switch(mods[i]) {
					case 'lower': result=result.toLowerCase(); break;
					case 'upper': result=result.toUpperCase(); break;
					case 'trim': result=result.trim(); break;
					case 'escape': result=result.replace(/&/g, "&amp;amp;").replace(/</g, "&amp;lt;").
						replace(/>/g, "&amp;gt;").replace(/"/g, "&amp;quot;").replace(/'/g, "&amp;#039;"); break;
					case 'capitalize':
						words=result.split(' ');
						for(i in words)
							words[i]=words[i][0].toUpperCase() + words[i].slice(1);
						result=words.join(' '); break;
				}
			return result;
		}
		else { //Создание цикла
			switch(obj) {
				case '/': count--; return '";} s+="';// Завершение цикла
				case '.': // Цикл по текущей переменной
					count++;
					index='';
					for(i=1;i<count-1;i++)
					index+='[i'+i+']';
					return '"; for(i'+(count-1)+' in data1'+index+') { s+="'; 
				default : count++; return '"; data1=data.'+obj+'; for(i1 in data1) { s+="'; // Цикл по переменной obj
			}
		}
		return '';
	})+'";';
	eval(template);
	return s;
}