var message = '';
var messageSplit = '';
var key = '';
var keySplit = key.split('');
var messageEncrypted = [];
var stopLoop;

String.prototype.shuffle = function() {
    var a = this.split(''),
        n = a.length;

    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join('');
};

shuffleKeyChars = () => {
    var keyCharsSchufled = document.getElementById('key').value.shuffle();
    document.getElementById('key').value = keyCharsSchufled;
};

encrypteMessage = () => {
    message = document.getElementById('message').value;
    messageSplit = message.split('');
    key = document.getElementById('key').value;
    keySplit = key.split('');

    //under construction - remove duplicates
    messageCharSet = [...new Set(messageSplit)];
    console.log(messageCharSet);
    keyCharSet = [...new Set(keySplit)];
    console.log(keyCharSet);
    messageCharSet.forEach((mel) => {
        if (keyCharSet.includes(mel) === false) {
            console.log(`There is no "${mel}" in key!`);
        }
    });
    //under construction - remove duplicates

    messageEncrypted = [];
    messageSplit.forEach((mel, mi) => {
        stopLoop = false;
        keySplit.forEach((kel, ki) => {
            if (
                kel === mel &&
                messageEncrypted.includes(ki) === false &&
                stopLoop === false
            ) {
                messageEncrypted.push(ki);
                stopLoop = true;
            }
        });
    });
    document.getElementById('message-encrypted').value = messageEncrypted;
};

var messageDecrypted = '';
decrypteMessage = () => {
    messageEncrypted = document
        .getElementById('message-encrypted')
        .value.split(',');
    key = document.getElementById('key').value;
    keySplit = key.split('');
    messageDecrypted = '';
    messageEncrypted.forEach((mel, mi) => {
        messageDecrypted += key[mel];
    });
    document.getElementById('message-decrypted').innerText = messageDecrypted;
    document.getElementById('message-decrypted-title').style.display = 'flex';
    document.getElementById('message-decrypted').style.display = 'flex';
};

window.addEventListener('load', function() {
    var input = document.getElementById('key');

    input.addEventListener('click', function() {
        document.getElementById('caret-position').innerHTML =
            'Caret position: ' + this.selectionStart;
    });
    input.addEventListener('keyup', function() {
        document.getElementById('caret-position').innerHTML =
            'Caret position: ' + this.selectionStart;
    });
});