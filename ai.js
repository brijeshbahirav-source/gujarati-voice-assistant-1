async function askGPT(question, key) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + key
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",  
                messages: [
                    { role: "system", content: "You are a helpful assistant that speaks Gujarati." },
                    { role: "user", content: question }
                ]
            })
        });

        const data = await response.json();

        if (!data || !data.choices || !data.choices[0]) {
            return "❌ API response error: " + JSON.stringify(data);
        }

        return data.choices[0].message.content;

    } catch (e) {
        return "❌ API error: " + e.message;
    }
}

function startListening() {
    const key = document.getElementById("apikey").value;
    const output = document.getElementById("output");

    if (!key) {
        alert("API Key નાખો!");
        return;
    }

    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = "gu-IN";

    rec.start();
    output.innerHTML = "🎙️ સાંભળું છું…";

    rec.onresult = async function(event) {
        const userText = event.results[0][0].transcript;
        output.innerHTML = "📌 તમે બોલ્યા: <b>" + userText + "</b>";

        const aiReply = await askGPT(userText, key);

        output.innerHTML += "<br><br>🤖 જવાબ: <b>" + aiReply + "</b>";

        speak(aiReply);
    };
}

function speak(text) {
    const tts = new SpeechSynthesisUtterance(text);
    tts.lang = "gu-IN";
    speechSynthesis.speak(tts);
}
