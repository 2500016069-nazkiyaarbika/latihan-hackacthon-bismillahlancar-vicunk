// 1. DATA: daftar produk (array of object)
const produk = [
  {
    id: 1,
    nama: "Headphone Bluetooth",
    kategori: "Elektronik",
    harga: 250000,
    ikon: "🎧",
  },
  {
    id: 2,
    nama: "Power Bank 10000mAh",
    kategori: "Elektronik",
    harga: 180000,
    ikon: "🔋",
  },
  {
    id: 3,
    nama: "Mouse Wireless",
    kategori: "Elektronik",
    harga: 95000,
    ikon: `
      <svg viewBox="0 0 64 64" role="img" aria-label="Mouse wireless">
        <path d="M25 14a11 11 0 0 1 14 0M21 10a17 17 0 0 1 22 0"
          fill="none" stroke="#fd8acb" stroke-linecap="round" stroke-width="3" />
        <rect x="20" y="19" width="24" height="38" rx="12"
          fill="#e8ecf5" stroke="#8993a5" stroke-width="2" />
        <path d="M20 33h24" stroke="#8993a5" stroke-width="2" />
        <rect x="30" y="24" width="4" height="7" rx="2" fill="#8993a5" />
      </svg>`,
  },
  {
    id: 4,
    nama: "Kaos Polos",
    kategori: "Fashion",
    harga: 65000,
    ikon: "👕",
  },
  {
    id: 5,
    nama: "Topi Baseball",
    kategori: "Fashion",
    harga: 45000,
    ikon: "🧢",
  },
  {
    id: 6,
    nama: "Sepatu Sneakers",
    kategori: "Fashion",
    harga: 320000,
    ikon: "👟",
  },
  {
    id: 7,
    nama: "Buku Catatan",
    kategori: "Alat Tulis",
    harga: 25000,
    ikon: "📓",
  },
  {
    id: 8,
    nama: "Pulpen Gel (3 pcs)",
    kategori: "Alat Tulis",
    harga: 15000,
    ikon: "🖊️",
  },
];

// Keranjang: [{id, jumlah}], dibaca dari localStorage
let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

// 2. Ambil elemen DOM
const elProduk = document.getElementById("daftarProduk");
const elKeranjang = document.getElementById("daftarKeranjang");
const elTotal = document.getElementById("total");
const elJumlah = document.getElementById("jumlahItem");
const elCari = document.getElementById("cari");
const elKategori = document.getElementById("kategori");
const elCheckout = document.getElementById("checkout");
const dialogPembayaran = document.getElementById("dialogPembayaran");
const formPembayaran = document.getElementById("formPembayaran");
const elMetodePembayaran = document.getElementById("metodePembayaran");
const elTotalPembayaran = document.getElementById("totalPembayaran");

// 3. Fungsi bantu: format angka jadi Rupiah
function rupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

function simpan() {
  localStorage.setItem("keranjang", JSON.stringify(keranjang));
}

function hitungTotal() {
  return keranjang.reduce((total, item) => {
    const p = produk.find((produkItem) => produkItem.id === item.id);
    return total + (p ? p.harga * item.jumlah : 0);
  }, 0);
}

// 4. Tampilkan produk (dengan pencarian + filter)
function tampilProduk() {
  const kata = elCari.value.toLowerCase();
  const kat = elKategori.value;
  const hasil = produk.filter(
    (p) =>
      p.nama.toLowerCase().includes(kata) &&
      (kat === "Semua" || p.kategori === kat),
  );

  elProduk.innerHTML =
    hasil.length === 0
      ? '<p class="kosong">Produk tidak ditemukan.</p>'
      : "";

  hasil.forEach((p) => {
    elProduk.innerHTML += `
      <div class="kartu">
        <div class="gambar">${p.ikon}</div>
        <strong>${p.nama}</strong>
        <small>${p.kategori}</small>
        <span class="harga">${rupiah(p.harga)}</span>
        <button data-aksi="tambah" data-id="${p.id}">Tambah</button>
      </div>`;
  });
}

// 5. Tampilkan keranjang + hitung total
function tampilKeranjang() {
  elKeranjang.innerHTML =
    keranjang.length === 0
      ? '<li class="kosong">Keranjang masih kosong.</li>'
      : "";

  let total = 0;
  let jumlahItem = 0;

  keranjang.forEach((item) => {
    const p = produk.find((x) => x.id === item.id); // cari data produk
    total += p.harga * item.jumlah;
    jumlahItem += item.jumlah;

    elKeranjang.innerHTML += `
      <li>
        <span>${p.nama}<br><small>${rupiah(p.harga)}</small></span>
        <div>
          <button data-aksi="kurang" data-id="${p.id}">-</button>
          ${item.jumlah}
          <button data-aksi="tambah" data-id="${p.id}">+</button>
        </div>
      </li>`;
  });

  elTotal.textContent = rupiah(total);
  elJumlah.textContent = jumlahItem;
  elCheckout.disabled = keranjang.length === 0;
}

// 6. Logika keranjang
function tambah(id) {
  const ada = keranjang.find((i) => i.id === id);

  if (ada) {
    ada.jumlah++;
  } else {
    keranjang.push({ id: id, jumlah: 1 });
  }
}

function kurang(id) {
  const ada = keranjang.find((i) => i.id === id);
  ada.jumlah--;

  if (ada.jumlah === 0) {
    keranjang = keranjang.filter((i) => i.id !== id);
  }
}

// 7. EVENT: satu handler untuk tombol tambah/kurang (event delegation)
document.addEventListener("click", function (e) {
  const aksi = e.target.dataset.aksi;

  if (!aksi) return;

  const id = Number(e.target.dataset.id);

  if (aksi === "tambah") tambah(id);
  if (aksi === "kurang") kurang(id);

  simpan();
  tampilKeranjang();
});

document.getElementById("kosongkan").addEventListener("click", () => {
  keranjang = [];
  simpan();
  tampilKeranjang();
});

elCheckout.addEventListener("click", () => {
  if (keranjang.length === 0) return;

  elTotalPembayaran.textContent = rupiah(hitungTotal());
  dialogPembayaran.showModal();
});

document.getElementById("batalPembayaran").addEventListener("click", () => {
  dialogPembayaran.close();
});

formPembayaran.addEventListener("submit", (e) => {
  e.preventDefault();

  if (keranjang.length === 0 || !elMetodePembayaran.value) return;

  const metode = elMetodePembayaran.value;
  const total = rupiah(hitungTotal());

  dialogPembayaran.close();
  formPembayaran.reset();
  keranjang = [];
  simpan();
  tampilKeranjang();

  window.alert(
    `Simulasi pembayaran berhasil!\nMetode: ${metode}\nTotal: ${total}\n\nTidak ada transaksi sungguhan yang diproses.`,
  );
});

elCari.addEventListener("input", tampilProduk);
elKategori.addEventListener("change", tampilProduk);

// 8. Jalankan saat halaman dibuka
tampilProduk();
tampilKeranjang();
