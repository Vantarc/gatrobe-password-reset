const express = require('express');
const app = express();
const credentials = require("./credentials")
const nodemailer = require('nodemailer');
const uuidv7 = require('uuidv7')
app.use(express.json())


const ipa = require('node-freeipa')

TIME_FOR_RESET_S = 60 * 10

var sessions = {}
// Create a transporter object
transporter = nodemailer.createTransport({
    host: credentials.SMTP_HOST,
    port: credentials.SMTP_PORT,
    secure: false, // use SSL
    auth: {
        user: credentials.SMTP_USER,
        pass: credentials.SMTP_PASSWORD,
    }
});

app.post('/changepassword', async (req, res) => {
    
    let sessionID = req.query.sessionID
    console.log(sessions[sessionID])
    try {
        await ipa.json_metadata()

        // check if session is valid
        if(!sessions[sessionID]) {res.status(403).send("Session doesn't exist!");return}
        if(Date.now() - sessions[sessionID].sessionStarted > TIME_FOR_RESET_S * 1000) {res.status(403).send("Session expired!");return}

        // change password
        let x = await ipa.user_mod([sessions[sessionID].ipaUID], {
            "userpassword": req.body.password,
            "krbpasswordexpiration": "99990924155614Z"
        }).then((e) => {
            console.log(e)
            if (e.error) throw Error(e)
        })
        console.log(x)
        fetch("https://ntfy.gatrobe.de/users", {
            method: 'POST',
            headers: {
                "prio": "low",
            },
            body: `Der Nutzer ${sessions[sessionID].ipaUID} hat sein Password geändert! `
        });

        res.status(200).send("User created!");
    } catch (e) {
        fetch("https://ntfy.gatrobe.de/users", {
            method: 'POST',
            headers: {
                "prio": "high",
            },
            body: `Es gab einen Fehler bei der Passwortänderung für den Benutzer ${sessions[sessionID].ipaUID}! \n \n ${e}`
        });
        res.status(500).send("Internal server error!");
    }

})

app.post("/requestChange", async (req, res) => {
    res.status(200).send("");
    let data;
    if (/\S+@\S+\.\S+/.test(req.body.email)) {
        console.log("Mail")
        data = await ipa.user_find([], {
            "mail": req.body.email
        })
    } else {
        console.log("Not mail")
        data = await ipa.user_find([], {
            "uid": req.body.email
        })
    }
    let user = data[0]

    // if no user was found
    if (!user) return
    console.log(user)
    // add session
    let sessionID = uuidv7.uuidv7()
    sessions[sessionID] = {
        "ipaUID": user.uid[0],
        "sessionStarted": Date.now()
    }

    // filter old sessions
    Object.keys(sessions).forEach(session => {
        if(Date.now() - sessions[session].sessionStarted > TIME_FOR_RESET_S * 1000) {
            sessions[session] = undefined
        }
    })
    // send mail
    const mailOptions = {
        from: 'noreply@gatrobe.de',
        to: user.mail,
        subject: 'Verifiziere deine Email',
        html: `Zum Zurücksetzen des Passworts, klicke <a href="https://sspc.gatrobe.de/password/?sessionID=${sessionID}">hier</a>!\n\n Dieser Link läuft in 10 min ab.`
      };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log('Error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
})
app.use("/", express.static("../../client/build"))
app.use("/*", express.static("../../client/build"))

app.listen(3002, () => {
    const opts = {
        server: "ipa.gatrobe.de",
        auth: {
            user: credentials.FREEIPA_USERNAME,
            pass: credentials.FREEIPA_PASSWORD
        }
    };
    ipa.configure(opts);
    console.log('server listening on port 3000')
})

