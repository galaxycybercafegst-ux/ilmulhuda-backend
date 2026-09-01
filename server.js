const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const apiKey = process.env.GEMINI_API_KEY;

const ISLAMIC_SYSTEM_PROMPT = "Aap ilmulhuda.com website ke official AI Islamic Tutor hain. Aapka kaam students ko Quran, Hadith, Fiqh, Seerah aur deegar Islamic courses ke mutabiq asan aur saaf zubaan mein taleem dena hai. Har jawab Quran aur Sahih Hadith ki roshni mein adab aur narmi ke sath dein.";

// Smart Local Islamic Knowledge Engine (Bina kisi error ke 24/7 chalne ke liye)
function getSmartIslamicReply(question) {
    const q = question.toLowerCase();
    
    if (q.includes('salam') || q.includes('hello') || q.includes('hey')) {
        return "Walaikum Assalam wa Rahmatullahi wa Barakatuh! Main Ilmul Huda ka AI Islamic Tutor hoon. Aaj aap deeni taleem ya kis mauzu par maloomat chahte hain?";
    } else if (q.includes('quran') || q.includes('quraan')) {
        return "Quran-e-Majeed Allah Ta'ala ki akhri kitaab hai jo Hazrat Muhammad (PBUH) par nazil hui. Isme poori insaniyat ke liye hidayat hai. Aap Quran ke kisi khas para ya surah ke mutabiq maloomat chahte hain?";
    } else if (q.includes('namaz') || q.includes('salah') || q.includes('dua')) {
        return "Namaz deen ka sutoon hai. Din mein paanch waqt ki namaz har musalman par farz hai. Namaz ko poore khushoo aur khuzoo ke sath ada karna chahiye. Kya aapko namaz ke tareeqe ya kisi masle par baat karni hai?";
    } else if (q.includes('roza') || q.includes('fasting') || q.includes('ramzan')) {
        return "Roza Islam ke buniyadi arkaan mein se ek hai. Ramzan ke mahine ke rozey har baligh musalman par farz hain jo sehatmand aur muqeem ho.";
    } else if (q.includes('hadith') || q.includes('hadees')) {
        return "Hadith Nabi-e-Kareem (PBUH) ke aqwal, af'aal aur tasweeb hain jo Sahih Sitta (jaise Sahih Bukhari aur Sahih Muslim) mein mehfooz hain.";
    } else {
        return `Walaikum Assalam! Aapne behtareen sawal pucha hai: "${question}". Ilmul Huda platform par is mauzu par tafseeli dars aur course jald hi dastiyab hoga. Mazeed deeni rahnumayi ke liye kisi mustanad alim ya Mufti se bhi ruju karein.`;
    }
}

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
                        Assalamu Alaikum! Main <b>Ilmul Huda</b> ka AI assistant hoon. Deeni masail ya sawal yahan pooch sakte hain.
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
                if (response.ok && data.reply) {
                    chatContainer.innerHTML += '<div class="flex justify-start"><div class="bg-emerald-100 text-emerald-900 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm sm:text-base shadow-sm whitespace-pre-wrap">' + data.reply + '</div></div>';
                } else {
                    throw new Error('Server error');
                }
            } catch (error) {
                loadingIndicator.classList.add('hidden');
                chatContainer.innerHTML += '<div class="flex justify-start"><div class="bg-red-100 text-red-700 p-4 rounded-2xl rounded-tr-none max-w-[85%] text-sm sm:text-base shadow-sm">Maaf kijiye, server se rabta nahi ho pa raha.</div></div>';
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

        // Agar asli AIza key maujood ho toh API call karega, warna smart engine se turant jawab dega
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

        // Smart fallback reply agar API key na chale
        const reply = getSmartIslamicReply(prompt);
        res.json({ reply });

    } catch (error) {
        console.error('Error:', error);
        res.json({ reply: "Walaikum Assalam! Aapke sawal par ghaur kiya ja raha hai. Baraye meharbani dobara koshish karein." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
