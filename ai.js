async function askGPT(question, apiKey) {
    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: question }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!data || !data.candidates || !data.candidates[0]) {
            return "❌ API response error: " + JSON.stringify(data);
        }

        return data.candidates[0].content.parts[0].text;

    } catch (e) {
        return "❌ API error: " + e.message;
    }
}

function startListening() {
    const apiKey = document.getElementById("apikey").value;
    const output = document.getElementById("output");

    if (!apiKey) {
        alert("API Key નાખો!");
        return;
    }

    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = "gu-IN";
    rec.start();

    output.innerHTML = "🎙️ સાંભળું છું…";

    rec.onresult = async function (event) {
        const userText = event.results[0][0].transcript;
        output.innerHTML = "📌 તમે બોલ્યા: <b>" + userText + "</b>";

        const aiReply = await askGPT(userText, apiKey);

        output.innerHTML += "<br><br>🤖 જવાબ: <b style='color:green;'>" + aiReply + "</b>";

        speak(aiReply);
    };
}

function speak(text) {
    const tts = new SpeechSynthesisUtterance(text);
    tts.lang = "gu-IN";
    speechSynthesis.speak(tts);
}
