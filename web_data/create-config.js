pages_id = new Array();
dictType = {'Один вариант':2,'Несколько вариантов':3, 'Свой ответ':4};
freeAnswer = '<div class="free-answer question-answer get-answer"><i class="bi bi-fonts icon-select-answer"></i>'+
'<select><option disabled selected value>Выбирите тип ответа</option><option>Только цифры</option>' +
'<option>Только буквы</option><option>Свободный</option></select><select class="qust next-question">%s</select></div>';

cloneAnswer = "<div class='answer-field question-answer get-answer'><input type='text' class='qust answer' value=%s" +
"><select class='qust next-question'>%s</select><i class='bi bi-eraser-fill delete-answer'></i></div>";

String.prototype.format = function(){
    var newStr = this, i = 0;
    while (/%s/.test(newStr))
        newStr = newStr.replace("%s", arguments[i++]);
    return newStr;
};

function getOptions(link){
    var options = "<option class ='head-option' selected value>Переход</option>";
    var selected = "";
    for (var i = 0; i < pages_id.length; ++i){
        if (pages_id[i] == link)
            selected = "selected";
        options += "<option %s value='%s'>%s</option>".format(selected, pages_id[i], pages_id[i]);
        selected = "";
    }
    return options;
}

function addOptions(id){
    var select = $(".next-question");
    select.append("<option value='%s'>%s</option>".format(id, id));
}

function removeLink(id){
    var index = pages_id.indexOf(+id);
    pages_id.splice(index, 1);
    var deleteLink = $('.next-question option[value="%s"]'.format(id));
    deleteLink.remove();
}

function addAnswers(answer){
    var text = answer['text'] == undefined ? "" : answer['text'];
    return cloneAnswer.format(text, getOptions(answer['link']));
}

function createSelectQuestion(selectedIndex, values)
{
    var formSelect = document.createElement('select');
    formSelect.className = "select-question";
    for (var i = 0; i != values.length; ++i){
        var option = document.createElement('option');
        option.value = values[i];
        option.text = values[i];
        if (i == selectedIndex){
            option.setAttribute('selected', true);
        }
        formSelect.appendChild(option);
    }
    return formSelect.outerHTML;
}

function addQuestion(page_id, text, answer, answer_type){
    var type = ['Один вариант','Несколько вариантов', 'Свой ответ'];
    var cloneQuestion ='<div class="question-form"><div class="icon-head">' +
    '<i class="bi bi-trash icon-delete-question"></i></div><div class="qust-field question-answer">' +
    '<label class="qust question-id">%s</label><textarea class="qust enter-question">%s</textarea>%s</div>';
    cloneQuestion = cloneQuestion.format(page_id, text, createSelectQuestion(answer_type - 2, type));
    var answers = '<div class="answers">';
    if  (type[answer_type - 2]=='Свой ответ'){
        answers += freeAnswer.format(getOptions(answer[0]['link']));
    }
    else{
        for (var i = 0; i != answer.length; ++i){
            answers += addAnswers(answer[i]);
        }
    }
    answers += '</div>';
    var end = '<div class="icon-answer"><div class="icon add-answer">' +
    '<i class="bi bi-plus-circle icon-add-answer"> Ответ</i></div></div></div>';
    $('#quiz').append(cloneQuestion + answers + end);
}

function getAnswers(answers){
    var result = new Array();
    for (var i = 0; i != answers.length; ++i){
        var answer = $(answers[i]).find('.answer').val();
        var link = +$(answers[i]).find('.next-question').val();
        console.log(link);
        if (answer == undefined)
            answer = "";
        
        result.push({
            'text': answer,
            'link': link
        });;
    }
    return result;
}

function getQuizData(){
    var quiz =[]
    var questions = $('.question-form');
    pages = new Option();
    for (var i = 0; i != questions.length; ++i){
        var page_id = $(questions[i]).find('.question-id').text();
        var text = $(questions[i]).find('.enter-question').val();
        var answer_type = dictType[$(questions[i]).find('.select-question').val()];
        var answers = getAnswers($(questions[i]).find('.get-answer'));
        console.log(page_id, text, answer_type, answers);
        quiz.push({
            "page_id": +page_id,
            "text": text,
            "answer_type": answer_type,
            "answer": answers
        });
    }
    pages.pages = quiz;
    return JSON.stringify(pages);
}

$(document).ready(function(data){
    url = 'api/quiz'
    var dfr =$.ajax({
        type: 'GET',
        url: url,
        dataType: 'json'
    });
    
    dfr.done(function(data){
        console.log('Get quiz');
        for (var i = 0; i != data['pages'].length; ++i){
            pages_id.push(data['pages'][i]['page_id']);
        }
        for (var i = 0; i != data['pages'].length; ++i){
            var page = data['pages'][i];
			addQuestion(page['page_id'], page['text'], page['answer'], page['answer_type']);
		}
    });
});

$(document).on('click', '.icon-add-answer', function(){
    console.log('icon add answer is click');
    $(this).parent()
            .parent()
            .parent()
            .find('.answers')
            .append(addAnswers([]));
});

$(document).on('click', '#add-question', function(){
    console.log('add question');
    if (pages_id.length != 0)
        pages_id.push(Math.max.apply(Math, pages_id) + 1);
    else
        page_id.push(1);
    addQuestion(Math.max.apply(Math, pages_id), '', [], '');
    addOptions(Math.max.apply(Math, pages_id));
});

$(document).on('click', '.icon-delete-question', function(){
    console.log('deleted question');
    var questionForm = $(this).parent().parent();
    var questionId = questionForm.find('.question-id').text();
    removeLink(questionId);
    questionForm.remove();
});

$(document).on('click', '.delete-answer', function(){
    console.log('deleted answer');
    $(this).parent().remove();
});

$(document).on('change', '.select-question', function(){
    console.log('update seletc');
    var answers = $(this).parent().parent().find('.answers');
    answers.empty();
    switch($(this).val()){
        case 'Свой ответ':
                answers.append(freeAnswer);
            break;
        default:
                answers.append(addAnswers([]));
            break;
    }
});

$(document).on('click', '#save-quiz', function(){

    url = 'api/quiz';
    var dfr =$.ajax({
        type: 'POST',
        url: url,
        data: {
            'data': getQuizData()
        },
        dataType: 'json'
    });
    dfr.done(function(){
        console.log('Quiz add in database');
    });
});