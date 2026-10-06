let level = 1;
let xp = 0;
let reputasi = 50;
let kasusAktif = 0;
let hitungMundur;
let sisaWaktu = 15;

// Gelar Berdasarkan Level
const daftarGelar = ["Pengacara Magang", "Pembela Publik", "Aktivis Senior", "Pahlawan HAM"];

// SFX Generator (Menggunakan Web Audio API Bawaan Browser - Tanpa butuh file mp3!)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type = 'sine', duration = 0.1) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

function sfxClick() { playSound(400, 'sine', 0.05); }
function sfxSuccess() { playSound(600, 'triangle', 0.2); setTimeout(() => playSound(800, 'triangle', 0.3), 100); }
function sfxFail() { playSound(200, 'sawtooth', 0.3); }

// Data Kasus
const daftarKasus = [
  {
    judul: "Hutan Adat dan Buldoser",
    deskripsi: "Sebuah perusahaan tambang multinasional mengantongi izin dari pemerintah daerah untuk menggusur wilayah hutan adat milik Suku Dayak/Masyarakat Adat setempat. Perusahaan mengklaim proyek ini demi Pembangunan Ekonomi Daerah, sementara warga terancam kehilangan tempat tinggal, sumber air bersih, dan ruang hidup mereka.",
    pilihan: [
      {
        teks: "A. Dampingi warga adat mengajukan gugatan ke PTUN dan suarakan penolakan di media.",
        tambahXp: 100, tambahRep: 12,
        edukasi: "Lingkungan hidup yang sehat adalah hak asasi dasar. Pembangunan tidak boleh mengorbankan ruang hidup masyarakat adat.  Hak atas Lingkungan Hidup yang Baik & Sehat (Pasal 28H UUD 1945) & Hak Masyarakat Adat."
      },
      {
        teks: "B. Sarankan warga menerima ganti rugi dan pindah pemukiman.",
        tambahXp: 30, tambahRep: -15,
        edukasi: "Ganti rugi materil tidak serta-merta menghapus hak adat dan ikatan budaya masyarakat atas tanah leluhurnya."
      }
    ]
  },
  {
    judul: "Diskriminasi di Ruang Kerja",
    deskripsi: "Seorang karyawan perempuan berprestasi di sebuah perusahaan IT tiba-tiba dibatalkan promosi jabatannya hanya karena dia sedang hamil dan berniat mengambil hak cuti melahirkan. Pihak manajemen berdalih bahwa perempuan hamil akan merugikan produktivitas tim.",
    pilihan: [
      {
        teks: "A. Nasihati korban untuk menerima keputusan tersebut agar hubungan kerja tetap harmonis.",
        tambahXp: 0, tambahRep: -30,
        edukasi: "Membiarkan diskriminasi gender melanggengkan ketimpangan peran perempuan di dunia kerja."
      },
      {
        teks: "B. Laporkan diskriminasi gender ini ke Kementerian Ketenagakerjaan dan bantu korban menuntut hak jabatannya kembali.",
        tambahXp: 100, tambahRep: 12,
        edukasi: "Cuti melahirkan adalah hak reproduksi perempuan yang dijamin hukum, bukan alasan untuk diskriminasi karir. Hak atas Kesetaraan dan Bebas dari Diskriminasi Gender (Pasal 2 DUHAM & UU TPKS)."
      }
    ]
  },
  {
    judul: "Bangku Sekolah untuk Semua",
    deskripsi: "Sebuah sekolah negeri menolak mendaftarkan anak-anak dari kelompok minoritas/pengungsi lokal karena dianggap tidak memiliki dokumen kependudukan yang lengkap. Padahal, anak-anak tersebut berhak mendapatkan pendidikan dasar tanpa dipersulit oleh prosedur birokrasi.",
    pilihan: [
      {
        teks: "A. Mendesak Dinas Pendidikan untuk memberikan diskresi dan jaminan akses sekolah bagi anak-anak tersebut.",
        tambahXp: 100,
        tambahRep: 13,
        edukasi:"Hak atas pendidikan berlaku universal untuk semua anak tanpa memandang status sosial, suku, atau dokumen administrasi. Hak atas Pendidikan (Pasal 26 DUHAM & Pasal 31 UUD 1945)."
      },
      {
        teks: "B. Minta orang tua anak mencari sekolah swasta sendiri yang mau menerima mereka.",
        tambahXp: 20,
        tambahRep: -15,
        edukasi: "Negara bertanggung jawab memastikan seluruh anak mendapatkan akses ke pendidikan dasar."
      }
    ]
  },
  {
    judul: "Hak atas Keadilan & Bebas dari Penyiksaan",
    deskripsi: "Seorang pemuda ditangkap sebagai terduga pelaku pencurian. Di ruang tahanan, dia diintimidasi dan dianiaya oleh oknum agar mau mengaku.",
    pilihan: [
      {
        teks: "A. Sarankan keluarga untuk tidak memperpanjang masalah demi keamanan pemuda.",
        tambahXp: 0, 
        tambahRep: -30,
        edukasi: "Membiarkan praktik penyiksaan merusak pilar penegakan hukum yang adil dan membiarkan kekerasan berulang."
      },
      {
        teks: "B. Bawa bukti visum medis ke Propam dan minta perlindungan ke LPSK.",
        tambahXp: 100, 
        tambahRep: 13,
        edukasi: "Sangat Benar! Tidak seorang pun boleh disiksa atau dianiaya (Konvensi Anti-Penyiksaan/CAT). Pengakuan di bawah ancaman dinyatakan batal demi hukum."
      }
    ]
  }
];  

function mulaiTimer() {
  sisaWaktu = 15;
  document.getElementById("timer-text").innerText = sisaWaktu;
  document.getElementById("timer-bar").style.width = "100%";

  clearInterval(hitungMundur);
  hitungMundur = setInterval(() => {
    sisaWaktu--;
    document.getElementById("timer-text").innerText = sisaWaktu;
    document.getElementById("timer-bar").style.width = `${(sisaWaktu / 15) * 100}%`;

    if (sisaWaktu <= 0) {
      clearInterval(hitungMundur);
      sfxFail();
      // Opsi otomatis jika kehabisan waktu
      eksekusiPilihan({
        teks: "Waktu Habis",
        tambahXp: 0,
        tambahRep: -20,
        edukasi: "⏰ WAKTU HABIS! Menunda tindakan saat pelanggaran HAM terjadi sama saja dengan membiarkannya."
      });
    }
  }, 1000);
}

function updateUI() {
  document.getElementById("level").innerText = level;
  document.getElementById("gelar").innerText = daftarGelar[Math.min(level - 1, daftarGelar.length - 1)];
  
  document.getElementById("xp-text").innerText = `${xp}/100`;
  document.getElementById("xp-bar").style.width = `${xp}%`;

  document.getElementById("rep-text").innerText = reputasi;
  document.getElementById("rep-bar").style.width = `${reputasi}%`;
}

function muatKasus() {
  if (kasusAktif >= daftarKasus.length) {
    tampilkanEnding();
    return;
  }

  const kasus = daftarKasus[kasusAktif];
  document.getElementById("judul-kasus").innerText = kasus.judul;
  document.getElementById("deskripsi-kasus").innerText = kasus.deskripsi;
  
  const container = document.getElementById("pilihan-container");
  container.innerHTML = "";
  document.getElementById("edukasi-box").classList.add("hide");
  document.getElementById("game-play-area").style.display = "block";

  kasus.pilihan.forEach((pilih) => {
    const btn = document.createElement("button");
    btn.innerText = pilih.teks;
    btn.onclick = () => {
      sfxClick();
      eksekusiPilihan(pilih);
    };
    container.appendChild(btn);
  });

  updateUI();
  mulaiTimer(); // Jalankan timer setiap kali kasus baru dimuat
}

function eksekusiPilihan(pilihan) {
  clearInterval(hitungMundur); // Hentikan timer

  // 1. Ambil nilai XP (jika kosong/undefined, anggap 0)
  let nilaiXp = Number(pilihan.tambahXp) || 0;
  
  // 2. Ambil nilai Reputasi (bisa dari 'tambahRep' atau 'rep')
  let nilaiRep = 0;
  if (pilihan.tambahRep !== undefined) {
    nilaiRep = Number(pilihan.tambahRep);
  } else if (pilihan.rep !== undefined) {
    nilaiRep = Number(pilihan.rep);
  }

  // Jika nilaiRep masih bukan angka (NaN), paksa jadi 0
  if (isNaN(nilaiRep)) nilaiRep = 0;

  // 3. Jika variabel reputasi utama terlanjur NaN, atur ulang jadi 50
  if (isNaN(reputasi)) reputasi = 50;
  if (isNaN(xp)) xp = 0;
  
  // Tambahkan XP & Reputasi
  xp += pilihan.tambahXp;
  reputasi += pilihan.tambahRep;

  // Batasi Reputasi agar tetap di kisaran 0% - 100%
  if (reputasi > 100) reputasi = 100;
  if (reputasi < 0) reputasi = 0;

  // Cek Naik Level
  if (xp >= 100) {
    level += 1;
    xp = 0;
    sfxSuccess();
    // Efek Konfeti saat Naik Level!
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  } else if (pilihan.tambahRep < 0) {
    sfxFail();
  }

  updateUI();

  document.getElementById("game-play-area").style.display = "none";
  document.getElementById("teks-edukasi").innerText = pilihan.edukasi;
  document.getElementById("edukasi-box").classList.remove("hide");
}

function lanjutKasus() {
  sfxClick();
  kasusAktif++;
  muatKasus();
}

function tampilkanEnding() {
  clearInterval(hitungMundur);
  document.getElementById("game-play-area").style.display = "none";
  document.getElementById("edukasi-box").style.display = "none";
  document.getElementById("ending-box").classList.remove("hide");

  if (reputasi >= 60) {
    sfxSuccess();
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
  }

  let pesan = `Hasil Perjuanganmu:<br>
  - Gelar Akhir: <b>${daftarGelar[Math.min(level - 1, daftarGelar.length - 1)]}</b><br>
  - Reputasi Publik: <b>${reputasi}%</b><br><br>`;

  pesan += (reputasi >= 60) 
    ? "🏆 <b>Good Ending: Pembela HAM Sejati!</b>" 
    : "⚠️ <b>Bad Ending: Kurang Pembelaan.</b>";

  document.getElementById("pesan-ending").innerHTML = pesan;
}

// Start Game
muatKasus();