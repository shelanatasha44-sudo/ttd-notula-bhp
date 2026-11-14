// Notula awal yang dimuat otomatis ke KV saat pertama kali dibutuhkan. PDF dibundel ke Worker (tidak diakses publik).
import pdf1 from './seed/n1.pdf';
import pdf2 from './seed/n2.pdf';
import pdf3 from './seed/n3.pdf';
const PDFS = { 'n1.pdf': pdf1, 'n2.pdf': pdf2, 'n3.pdf': pdf3 };
export const SEEDS = [
 {
  "id": "notula-20261113",
  "no": 1,
  "file": "n1.pdf",
  "title": "Notula Rapat Monitoring Lanjutan Pengampuan a.n. Sdri. Ariel Ruth Agustin Aritonang",
  "subtitle": "Balai Harta Peninggalan Medan · Jumat, 13 November 2026",
  "created": "2026-11-13T03:00:00.000Z",
  "signers": [
   {
    "key": "syuhada",
    "name": "Syuhada",
    "role": "Kurator Keperdataan Ahli Madya",
    "page": 7,
    "x": 0.1729,
    "y": 0.7066,
    "w": 0.2856,
    "h": 0.0641
   },
   {
    "key": "syafriadi",
    "name": "Syafriadi Lubis",
    "role": "Kepala Balai Harta Peninggalan Medan",
    "page": 7,
    "x": 0.562,
    "y": 0.7066,
    "w": 0.2856,
    "h": 0.0641
   },
   {
    "key": "elsintha",
    "name": "Elsintha Damayanti",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.4875,
    "y": 0.1896,
    "w": 0.1898,
    "h": 0.0344
   },
   {
    "key": "shela",
    "name": "Shela Natasha",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.7059,
    "y": 0.2383,
    "w": 0.1898,
    "h": 0.0344
   },
   {
    "key": "andre",
    "name": "Andre Yosua Surbakti",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.4875,
    "y": 0.287,
    "w": 0.1898,
    "h": 0.0344
   },
   {
    "key": "annisa",
    "name": "Annisa Dwi Marina",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.7059,
    "y": 0.3357,
    "w": 0.1898,
    "h": 0.0344
   },
   {
    "key": "yusril",
    "name": "Yusril Ihza Mahendra",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.4875,
    "y": 0.3844,
    "w": 0.1898,
    "h": 0.0344
   }
  ],
  "rev": 2
 },
 {
  "id": "notula-rata-makmur-20260914",
  "no": 2,
  "file": "n2.pdf",
  "title": "Berita Acara Rapat Koordinasi dengan Hakim Pengawas Kepailitan PT Rata Makmur (Dalam Pailit)",
  "subtitle": "Balai Harta Peninggalan Medan · Rabu, 11 November 2026",
  "created": "2026-11-11T03:00:00.000Z",
  "signers": [
   {
    "key": "dartimnov-mt-harahap",
    "name": "Dartimnov M.T Harahap",
    "role": "Kurator Keperdataan Ahli Madya",
    "page": 4,
    "x": 0.1663,
    "y": 0.4894,
    "w": 0.2873,
    "h": 0.0689
   },
   {
    "key": "syafriadi-lubis",
    "name": "Syafriadi Lubis",
    "role": "Kepala Balai Harta Peninggalan Medan",
    "page": 4,
    "x": 0.5476,
    "y": 0.4894,
    "w": 0.2856,
    "h": 0.0689
   },
   {
    "key": "elsintha-damayanti",
    "name": "Elsintha Damayanti",
    "role": "Kepala Seksi Harta Peninggalan Wilayah II",
    "page": 4,
    "x": 0.4048,
    "y": 0.6022,
    "w": 0.215,
    "h": 0.0321
   },
   {
    "key": "shela-natasha",
    "name": "Shela Natasha",
    "role": "Kurator Keperdataan Ahli Muda",
    "page": 4,
    "x": 0.4048,
    "y": 0.6283,
    "w": 0.215,
    "h": 0.0333
   },
   {
    "key": "hutri-zebua",
    "name": "Hutri Zebua",
    "role": "Kurator Keperdataan Ahli Pertama",
    "page": 4,
    "x": 0.4048,
    "y": 0.6557,
    "w": 0.215,
    "h": 0.0321
   }
  ],
  "rev": 3,
  "replaceRev": 2
 },
 {
  "id": "notula-rata-makmur-20261110",
  "no": 3,
  "file": "n3.pdf",
  "title": "Notula Rapat Tim Kurator Kepailitan PT Rata Makmur (Dalam Pailit)",
  "subtitle": "Balai Harta Peninggalan Medan · Selasa, 10 November 2026",
  "created": "2026-11-10T04:00:00.000Z",
  "signers": [
   {
    "name": "Dartimnov M.T Harahap",
    "role": "Kurator Keperdataan Ahli Madya",
    "page": 6,
    "x": 0.173,
    "y": 0.253,
    "w": 0.2856,
    "h": 0.0915
   },
   {
    "name": "Syafriadi Lubis",
    "role": "Kepala Balai Harta Peninggalan Medan",
    "page": 6,
    "x": 0.5611,
    "y": 0.253,
    "w": 0.2856,
    "h": 0.0915
   },
   {
    "name": "Elsintha Damayanti",
    "role": "Anggota Tim Kurator",
    "page": 6,
    "x": 0.3796,
    "y": 0.4169,
    "w": 0.1344,
    "h": 0.0356
   },
   {
    "name": "Nanang Surya Purnama",
    "role": "Anggota Tim Kurator",
    "page": 6,
    "x": 0.7694,
    "y": 0.4169,
    "w": 0.1377,
    "h": 0.0356
   },
   {
    "name": "Joko Prabowo",
    "role": "Anggota Tim Kurator",
    "page": 6,
    "x": 0.3796,
    "y": 0.4502,
    "w": 0.1344,
    "h": 0.0356
   },
   {
    "name": "Hutri Zebua",
    "role": "Anggota Tim Kurator",
    "page": 6,
    "x": 0.7694,
    "y": 0.4502,
    "w": 0.1377,
    "h": 0.0356
   },
   {
    "name": "Shela Natasha",
    "role": "Anggota Tim Kurator",
    "page": 6,
    "x": 0.3796,
    "y": 0.4834,
    "w": 0.1344,
    "h": 0.0356
   },
   {
    "name": "Andre Yosua Surbakti",
    "role": "Anggota Tim Kurator",
    "page": 6,
    "x": 0.7694,
    "y": 0.4834,
    "w": 0.1377,
    "h": 0.0356
   },
   {
    "name": "Annisa Dwi Marina",
    "role": "Anggota Tim Kurator",
    "page": 6,
    "x": 0.3796,
    "y": 0.5167,
    "w": 0.1344,
    "h": 0.0356
   },
   {
    "name": "Yusril Ihza Mahendra",
    "role": "Anggota Tim Kurator",
    "page": 6,
    "x": 0.7694,
    "y": 0.5167,
    "w": 0.1377,
    "h": 0.0356
   }
  ]
 }
].map(s => ({ ...s, pdf: PDFS[s.file] }));
