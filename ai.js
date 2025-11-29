async function askGPT(question, key) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + key
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant that speaks Gujarati." },
                    { role: "user", content: question }
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (e) {
        return "❌ Error: " + e.message;
    }
}

function startListening() {
    const key = document.getElementById("apikey").value;
    const output = document.getElementById("output");

    if (!key) {
        alert("API Key નાખો!");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        output.innerHTML = "❌ Voice Recognition Support નથી.";
        return;
    }

    let rec = new SpeechRecognition();
    rec.lang = "gu-IN";
    rec.start();

    output.innerHTML = "🎙️ સાંભળું છું…";

    rec.onresult = async function(e) {
        let userText = e.results[0][0].transcript;
        output.innerHTML = "📌 તમે બોલ્યા: <b>" + userText + "</b><br>";

        let aiReply = await askGPT(userText, key);

        output.innerHTML += "<br>🤖 જવાબ: <b>" + aiReply + "</b>";

        speak(aiReply);
    };
}

function speak(text) {
    let tts = new SpeechSynthesisUtterance(text);
    tts.lang = "gu-IN";
    speechSynthesis.speak(tts);
}
