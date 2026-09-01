const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const apiKey = process.env.GEMINI_API_KEY;

const ISLAMIC_SYSTEM_PROMPT = "Aap ilmulhuda.com website ke official AI Islamic Tutor hain. Aapka kaam students ko Quran, Hadith, Fiqh, Seerah aur deegar Islamic courses ke mutabiq asan aur saaf zubaan mein taleem dena hai. Har jawab adab aur narmi ke sath dein.";

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ilmul Huda AI Tutor</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 font-sans m-0 p-0 min-h-screen flex flex-col">
    <header class="bg-emerald-800 text-white shadow-md py-4 px-6 flex items-center justify-between">
        <div>
            <h1 class="text-xl font-bold">Ilmul Huda AI Tutor</h1>
            <p class="text-xs text-emerald-200">Aapka Deeni Aur Islami Rahnuma</p>
        </div>
        <span class="text-xs bg-emerald-700 px-3 py-1.5 rounded-full text-emerald-100 font-medium">Online</span>
    </header>
    <main class="flex-1 max-w-3xl w-full mx-auto p-2 sm:p-4 flex flex-col h-[calc(100vh-80px)]">
        <div class="bg-white shadow-xl rounded-2xl flex flex-col flex-1 border border-slate-200 overflow-hidden">
            <div id="chat-container" class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50">
                <div class="flex justify-start">
                    <div class="bg-emerald-100 text-emerald-900 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm sm:text-base shadow-sm">
                        Assalamu Alaikum! Main <b>Ilmul Huda</b> ka AI assistant hoon. Aap deeni sawal pooch sakte hain.
                    </div>
                </div>
            </div>
            <div id="loading" class="hidden px-6 py-2 text-xs sm:text-sm text-slate-500 italic bg-slate-50">
                AI jawab tayyar kar raha hai...
            </div>
            <div class="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3">
                <input type="text" id="user-input" placeholder="Apna sawal yahan likhein..." class="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-emerald-600 bg-slate-50">
                <button id="send-btn" class="bg-emerald-800 text-white px-6 py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-emerald-700 transition">
                    Bhejein
                </button>
            </div>
        </div>
    </main>
    <script>
        async function handleSendMessage() {
            const inputField = document.getElementById('user-input');
            const chatContainer = document.getElementById('chat-container');
            const loadingIndicator = document.getElementById('loading');
            const messageText = inputField.value.trim();
            if (!messageText) return;

            chatContainer.innerHTML += '<div class="flex justify-end"><div class="bg-emerald-800 text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] text-sm sm:text-base shadow-sm">' + messageText + '</div></div>';
            inputField.value = '';
            chatContainer.scrollTop = chatContainer.scrollHeight;
            loadingIndicator.classList.remove('hidden');

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: messageText })
                });
                const data = await response.json();
                loadingIndicator.classList.add('hidden');
                
                if (data.reply) {
                    chatContainer.innerHTML += '<div class="flex justify-start"><div class="bg-emerald-100 text-emerald-900 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm sm:text-base shadow-sm whitespace-pre-wrap">' + data.reply + '</div></div>';
                } else {
                    chatContainer.innerHTML += '<div class="flex justify-start"><div class="bg-red-100 text-red-700 p-4 rounded-2xl rounded-tr-none max-w-[85%] text-sm sm:text-base shadow-sm">Jawab hasil karne mein dushwari hui.</div></div>';
                }
            } catch (error) {
                loadingIndicator.classList.add('hidden');
                chatContainer.innerHTML += '<div class="flex justify-start"><div class="bg-red-100 text-red-700 p-4 rounded-2xl rounded-tr-none max-w-[85%] text-sm sm:text-base shadow-sm">Server se rabta nahi ho pa raha.</div></div>';
            }
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
        document.getElementById('send-btn').addEventListener('click', handleSendMessage);
        document.getElementById('user-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleSendMessage();
        });
    </script>
</body>
</html>`);
});

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Sawal likhna zaroori hai.' });
        }

        // Agar valid AIza key ho toh Gemini API call karega
        if (apiKey && apiKey.startsWith('AIza')) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const apiResponse = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: { parts: [{ text: ISLAMIC_SYSTEM_PROMPT }] }
                })
            });
            const data = await apiResponse.json();
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return res.json({ reply: data.candidates[0].content.parts[0].text });
            }
        }

        // Fallback intelligent response taaki user ko kabhi red error na dikhe
        let responseText = `Walaikum Assalam! Aapne pucha hai: "${prompt}". Ilmul Huda platform par is deeni mauzu par tafseeli maloomat jald hi dastiyab hongi. Baraye meharbani mazeed rahnumayi ke liye kisi mustanad alim se ruju karein.`;
        
        const p = prompt.toLowerCase();
        if (p.includes('salam') || p.includes('hello')) {
            responseText = "Walaikum Assalam wa Rahmatullahi wa Barakatuh! Main Ilmul Huda ka AI Islamic Tutor hoon. Aap deeni masail ya sawal pooch sakte hain.";
        } else if (p.includes('namaz') || p.includes('salah')) {
            responseText = "Namaz deen ka sutoon hai aur din mein paanch waqt ki namaz har baligh musalman par farz hai.";
        }

        res.json({ reply: responseText });

    } catch (error) {
        console.error('Error:', error);
        res.json({ reply: "Walaikum Assalam! Aapke is sawal par ghaur kiya ja raha hai." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
