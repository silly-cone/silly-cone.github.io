var reveal = 0
var question_txt = ""
var answer_txt = ""
var question_id = 0
var show_answer = false

var number_div
var question_div
var answer_div

var list = []

window.onload = function () {
    document.getElementById('file')
      .addEventListener('change', readSingleFile, false);
    number_div = document.getElementById('number')
    question_div = document.getElementById('question')
    answer_div = document.getElementById('answer')
}

function listenKey(e) {
    console.log(e)
    if (e.code == 'Space') {
        ++reveal
        reveal = Math.min(reveal, question_txt.length)
        console.log(reveal)
    }
    if (e.code == 'Backspace') {
        --reveal
        reveal = Math.max(reveal, 0)
        console.log(reveal)
    }
    if (e.code == 'Enter') {
        show_answer = true
    }
    if (e.code == 'ArrowRight') {
        resetProgress()
        ++question_id
        question_id = Math.min(question_id, list.length - 1)
        updateQuestion()
    }
    if (e.code == 'ArrowLeft') {
        resetProgress()
        --question_id
        question_id = Math.min(question_id, list.length)
        question_id = Math.max(question_id, 0)
        updateQuestion()
    }
    render()
}

function resetProgress() {
    show_answer = false
    reveal = 0
}

function updateQuestion() {
    if (list.length) {
        question_txt = list[question_id][0]
        answer_txt = list[question_id][1]
    }
}

function render() {
    number_div.textContent = "問題 " + (question_id + 1)
    if (show_answer) {
        question_div.textContent = question_txt
        answer_div.textContent = answer_txt
    }
    else {
        question_div.textContent = question_txt.substring(0, reveal)
        answer_div.textContent = ""
    }
}

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('file').style.display = 'None'
    var contents = e.target.result;
    list = csvStringToArray(contents)
    console.log(list)
    updateQuestion()
    render()
  };
  reader.readAsText(file);
  window.addEventListener('keydown', function(e){
    listenKey(e)
  }, false);
}

const csvStringToArray = strData =>
{
    const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^\\,\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",")arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ?
            arrMatches[2].replace(new RegExp( "\"\"", "g" ), "\"") :
            arrMatches[3]);
    }
    return arrData;
}
