async function askGPT(question, apiKey) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        { parts: [ { text: question } ] }
                    ]
                })
            }
        );

        const result = await response.json();

        if (result.error) {
            return "❌ API Error: " + result.error.message;
        }

        return result.candidates[0].content.parts[0].text;

    } catch (error) {
        return "❌ Network Error: " + error;
    }
}

function startListening() {
    let apiKey = document.getElementById("apikey").value;
    if (!apiKey) {
        alert("⚠️ API key નાખો!");
        return;
    }

    const output = document.getElementById("output");

    let recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "gu-IN";
    recognition.start();

    recognition.onresult = async function(event) {
        let speech = event.results[0][0].transcript;
        output.innerHTML = "તમે બોલ્યા: " + speech;

        let reply = await askGPT(speech, apiKey);
        output.innerHTML += "<br><br>🤖 જવાબ: " + reply;

        let utter = new SpeechSynthesisUtterance(reply);
        utter.lang = "gu-IN";
        speechSynthesis.speak(utter);
    };
}
