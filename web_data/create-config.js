pages_id = new Int16Array();

String.prototype.format = function()
{
    var newStr = this, i = 0;
    while (/%s/.test(newStr))
        newStr = newStr.replace("%s", arguments[i++]);
    return newStr;
};

function addAnswers(answer){
    var cloneAnswer = "<div class='answer-field qustion-answer'><input type='text' class='qust answer' value=%s" +
    "><select class='qust next-qustion'><option disabled selected value>Переход</option></select>"+
    "<i class='bi bi-eraser-fill delete-answer'></i></div>";
    return cloneAnswer.format(answer['text']);
}


function addQustion(page_id, text, answer, answer_type){
    var type = ['','',''];
    type[answer_type- 1] = 'selected';
    var cloneQustion ='<div class="qustion-form"><div class="icon-head">' +
    '<i class="bi bi-trash icon-delete-qustion"></i></div><div class="qust-field qustion-answer">' +
    '<label class="qust qustion-id">ID:%s</label><textarea class="qust enter-qustion">%s</textarea>' + 
    '<select class="qust select-qustion"><option disabled selected value>Тип вопроса</option>' +
    '<option %s>Один вариант</option><option %s >Несколько вариантов</option><option %s'+
    '>Свой ответ</option></select></div><div class="answers"> </div>';
    cloneQustion = cloneQustion.format(page_id, text, type[1], type[2], type[3])
    pages_id.append(page_id)
    var answers = '<div class="answers">'
    for (var i = 0; i!=answer.length; ++i){
        answers += addAnswers(answer[i]);
    }
    answers += '</div>'

    var end = '<div class="icon-answer"><div class="icon add-answer">' +
    '<i class="bi bi-plus-circle icon-add-answer"> Ответ</i></div></div></div>'
    $('#quiz').append(cloneQustion + answers + end);
}

$(document).ready(function(data){
    url = 'api/quiz'
    var dfr =$.ajax({
        type: 'GET',
        url: url,
        dataType: 'json'
    });
    
    dfr.done(function(data){
        console.log('Get quiz')
        for (var i = 0; i != data['pages'].length; ++i){
            var page = data['pages'][i];
			addQustion(page['page_id'], page['text'], page['answer'], page['answer_type']);
		}
    });
});

$(document).on('click', '.icon-add-answer', function(){
    console.log('icon add answer is click');
    var cloneAnswer = '<div class="answer-field qustion-answer"><input type="text" class="qust answer">' +
    '<select class="qust next-qustion"><option disabled selected value>Переход</option></select>'+
    '<i class="bi bi-eraser-fill delete-answer"></i></div>'
    $(this).parent()
            .parent()
            .parent()
            .find('.answers')
            .append(cloneAnswer);
});

$(document).on('click', '#add-qustion', function(){
    console.log('add qustion');
    var cloneQustion ='<div class="qustion-form"><div class="icon-head">' +
    '<i class="bi bi-trash icon-delete-qustion"></i></div><div class="qust-field qustion-answer">' +
    '<label class="qust qustion-id">ID:1</label><textarea class="qust enter-qustion"></textarea>' + 
    '<select class="qust select-qustion"><option disabled selected value>Тип вопроса</option>' +
    '<option>Один вариант</option><option>Несколько вариантов</option><option>Свой ответ</option></select></div>' +    
    '<div class="answers"> </div><div class="icon-answer"><div class="icon add-answer">' +
    '<i class="bi bi-plus-circle icon-add-answer"> Ответ</i></div></div></div>'
    $('#quiz').append(cloneQustion);
});

$(document).on('click', '.icon-delete-qustion', function(){
    console.log('deleted qustion')
    $(this).parent()
        .parent()    
        .remove();
});

$(document).on('click', '.delete-answer', function(){
    console.log('deleted qustion')
    $(this).parent() 
        .remove();
});

$(document).on('change', '.select-qustion', function(){
    console.log('update seletc');
    var freeAnswer = '<div class="free-answer qustion-answer"><i class="bi bi-fonts icon-select-answer"></i>'+
    '<select><option disabled selected value>Выбирите тип ответа</option><option>Только цифры</option>' +
    '<option>Только буквы</option><option>Свободный</option></select></div>';
    var cloneAnswer = '<div class="answer-field qustion-answer"><input type="text" class="qust answer">' +
    '<select class="qust next-qustion"><option disabled selected value>Переход</option></select>'+
    '<i class="bi bi-eraser-fill delete-answer"></i></div>'
    $(this).parent()
    .parent()
    .find('.answers')
    .empty();
    switch($(this).val()){
        case 'Свой ответ':
            $(this).parent()
                .parent()
                .find('.answers')
                .append(freeAnswer);
            break;
        default:
            $(this).parent()
                .parent()
                .find('.answers')
                .append(cloneAnswer);
            break;
    }
});