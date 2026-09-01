const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Mukammal aur Sateek Islamic Knowledge Engine
function getAccurateIslamicReply(question) {
    const q = question.toLowerCase();
    
    if (q.includes('salam') || q.includes('hello') || q.includes('hey') || q.includes('hi')) {
        return "Walaikum Assalam wa Rahmatullahi wa Barakatuh! Main Ilmul Huda ka AI Islamic Tutor hoon. Aap deeni masail, dua, tajweed ya kisi bhi mauzu par sawal pooch sakte hain.";
    } 
    else if (q.includes('khana khane ki dua') || q.includes('khane ki dua')) {
        return "<b>Khana Khane ki Dua:</b><br>بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ<br><i>Tarjuma:</i> Allah ke naam ke sath aur Allah ki barkat par (hum khana shuru karte hain).<br><br><b>Agar khana shuru karte waqt dua bhool jayein toh yeh padhein:</b><br>بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ";
    }
    else if (q.includes('dua') && (q.includes('khane') || q.includes('khana'))) {
        return "<b>Khana Khane ki Dua:</b><br>بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ<br><i>Tarjuma:</i> Allah ke naam ke sath aur Allah ki barkat par.";
    }
    else if (q.includes('pani peene ki dua') || q.includes('paani ki dua')) {
        return "Paani peene ki sunnat yeh hai ki bayen (left) hath se piyein, baith kar piyein aur teen saans mein piyein. Shuru mein <b>'Bismillah'</b> kahein aur aakhir mein <b>'Alhamdulillah'</b> kahein.";
    }
    else if (q.includes('ikhfa') || q.includes('tajweed')) {
        return "<b>Tajweed - Ikhfa ke Rules:</b><br>Jab Noon Sakin (نْ) ya Tanween ke baad Ikhfa ke 15 huroof (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك) mein se koi harf aaye, toh Noon ki awaz ko naak mein chupakar (Ghunnah ke sath) 1 alif tak kheench kar padhte hain.";
    } 
    else if (q.includes('namaz') || q.includes('salah')) {
        return "<b>Namaz ki Ahmiyat:</b><br>Namaz Islam ka doosra rukan aur deen ka sutoon hai. Din mein paanch waqt ki namaz (Fajr, Zuhr, Asr, Maghrib, Isha) har baligh musalman par farz hai. Ise wudu ke sath waqt par ada karna lazim hai.";
    } 
    else if (q.includes('wudu') || q.includes('wuzu')) {
        return "<b>Wudu ke 4 Faraiz:</b><br>1. Chehre ko poori tarah dhona.<br>2. Dono haathon ko kohniyon samet dhona.<br>3. Chauthai (1/4) sar ka masah karna.<br>4. Dono paanv ko taknon samet dhona.";
    }
    else if (q.includes('roza') || q.includes('fasting')) {
        return "<b>Roze ke Ahkam:</b><br>Subh-e-Sadiq se lekar suraj dhalne tak khane, peene aur shohvani talluqat se ruka rehna roza kehlata hai. Halat-e-roze mein jaan boojh kar khane ya peene se roza toot jata hai.";
    } 
    else if (q.includes('quran') || q.includes('quraan')) {
        return "<b>Quran-e-Majeed:</b><br>Quran Allah Ta'ala ki akhri kitaab hai jo Hazrat Muhammad (PBUH) par nazil hui. Isme poori insaniyat ke liye hidayat hai.";
    }
    else if (q.includes('zakat')) {
        return "<b>Zakat:</b><br>Sahib-e-nisab musalman par saal mein ek baar apne makhsoos maal par 2.5% Zakat nikalna farz hai.";
    }
    else {
        return `Walaikum Assalam! Aapne pucha hai: "<b>${question}</b>".<br>Ilmul Huda platform par is deeni mauzu par tafseeli dars jald hi dastiyab hoga. Mazeed mukammal rahnumayi ke liye kisi mustanad alim ya Mufti se ruju karein.`;
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
                        Assalamu Alaikum! Main <b>Ilmul Huda</b> ka AI assistant hoon. Deeni masail ya dua yahan pooch sakte hain.
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

        const reply = getAccurateIslamicReply(prompt);
        res.json({ reply });

    } catch (error) {
        console.error('Error:', error);
        res.json({ reply: "Walaikum Assalam! Aapke is sawal par ghaur kiya ja raha hai." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
