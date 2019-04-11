const env = require("../../config");

class goodAuth {
    constructor(params){
        this.params = params;
    }

    render(params) {
        return `<!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Document</title>
                    </head>
                    <body>
                        <script>
                            document.cookie="sid=${params.sid};domain=127.0.0.1";console.log(123,document.cookie);
                            document.location.replace("${env.FRONTENT_URI}");
                        </script>
                    </body>
                </html>`;
    }
}

module.exports = new goodAuth();