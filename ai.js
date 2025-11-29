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
    const apiKey = document.getElementById("apikey").value.trim();
    if (!apiKey) {
        alert("⚠️ API Key દાખલ કરો!");
        return;
    }

    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    rec.lang = "gu-IN";
    rec.start();

    rec.onresult = async function(event) {
        const userText = event.results[0][0].transcript;
        const ou = document.getElementById("output");
        ou.innerHTML = "📌 તમે બોલ્યા: <b>" + userText + "</b>";

        const reply = await askGPT(userText, apiKey);
        ou.innerHTML += "<br><br>🤖 જવાબ: <b>" + reply + "</b>";

        const tts = new SpeechSynthesisUtterance(reply);
        tts.lang = "gu-IN";
        speechSynthesis.speak(tts);
    };
}
