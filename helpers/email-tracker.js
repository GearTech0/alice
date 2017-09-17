const fs = require('fs');

module.exports = {
    isFound: function (email, fileId, callback) {
        fs.readFile('./helpers/emails-to-fileIds.et','utf8', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            let info = data.split(" ");

            for (let i = 0; i < info.length; i++) {
                if (info[i].localeCompare(email) === 0 && info[i + 1].localeCompare(fileId) === 0) {
                    callback(true);
                    return;
                }
            }
            callback(false);
        });
    },
    add: function (email, fileId) {
        fs.appendFile('./helpers/emails-to-fileIds.et', `${email} ${fileId} `, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Appended email ' + email + ' to file.');
        });
    }
}