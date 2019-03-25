
var token = '';
var channel = '';

const baseApiUrl    = 'https://slack.com/api/';
var historyApiUrl = '';
var deleteApiUrl  = '';
let   delay         = 300; // Delay between delete operations in milliseconds
var   ts            = '';

function makeRequest(urlApiSlack,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',urlApiSlack, true);
    xhr.send();
    xhr.onreadystatechange = function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
                callback(JSON.parse(xhr.responseText));
        }
    }
}

function extractIdMessages(response){
    const messages = [];
    if (response.messages && response.messages.length > 0) {
            listMessages=response.messages;
            for (let i = 0; i < listMessages.length; i++) {
                messages.push(listMessages[i].ts);
            }
        deleteMessagesProcess(messages);
    }else{
        div = document.getElementById('log');
        div.innerHTML += 'Not messages found!<br>';
    }
}


function deleteMessagesProcess(messages){
    for (var i = 0; i < messages.length; i++) {
        sleep(delay)
        ts=messages[i];
        makeRequest(deleteApiUrl + messages[i],logMessages);
    }
    div = document.getElementById('log');
    div.innerHTML += 'Message cleaning finished <br>';
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function logMessages(responseMessageDeleted){
    div = document.getElementById('log');

    if (responseMessageDeleted.ok === true) {
        div.innerHTML += ts+' deleted!<br>';
    } else if (responseMessageDeleted.ok === false) {
        div.innerHTML +=ts + ' could not be deleted! (' + responseMessageDeleted.error + ')<br>';

        if (responseMessageDeleted.error === 'ratelimited') {
            delay += 100; // If rate limited error caught then we need to increase delay.
            messages.push(ts);
        }
    }
}

function clearMessages(){
    token = document.getElementById("tokenSlack").value;
    channel = document.getElementById("channelId").value;

    if (token.length >0 && channel.length) {
        
        historyApiUrl = baseApiUrl + 'conversations.history?token=' + this.token + '&count=1000&channel=' + this.channel + '&cursor=';
        deleteApiUrl  = baseApiUrl + 'chat.delete?token=' + token + '&channel=' + channel + '&ts='

        makeRequest(historyApiUrl,extractIdMessages);
        div = document.getElementById('log');
        div.innerHTML += 'Messages cleaning started <br>';
    }else{
        div = document.getElementById('log');
        div.innerHTML += 'Enter token or channel correct <br>';
    }
}