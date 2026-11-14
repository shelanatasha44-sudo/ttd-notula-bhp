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
    "page": 8,
    "x": 0.17289654132994856,
    "y": 0.21314048725191434,
    "w": 0.285568403417864,
    "h": 0.06414141362880343
   },
   {
    "key": "syafriadi",
    "name": "Syafriadi Lubis",
    "role": "Kepala Balai Harta Peninggalan Medan",
    "page": 8,
    "x": 0.5620322429168726,
    "y": 0.21314048725191434,
    "w": 0.285568403417864,
    "h": 0.06414141362880343
   },
   {
    "key": "elsintha",
    "name": "Elsintha Damayanti",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.48748208328121506,
    "y": 0.4246788456204296,
    "w": 0.18981899756599196,
    "h": 0.03444631472657962
   },
   {
    "key": "shela",
    "name": "Shela Natasha",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.7058579211889935,
    "y": 0.4733788078200767,
    "w": 0.18981899756599196,
    "h": 0.03444631472657962
   },
   {
    "key": "andre",
    "name": "Andre Yosua Surbakti",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.48748208328121506,
    "y": 0.5220787700197238,
    "w": 0.18981899756599196,
    "h": 0.03444631472657962
   },
   {
    "key": "annisa",
    "name": "Annisa Dwi Marina",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.7058579211889935,
    "y": 0.5707787322193708,
    "w": 0.18981899756599196,
    "h": 0.03444631472657962
   },
   {
    "key": "yusril",
    "name": "Yusril Ihza Mahendra",
    "role": "Tim BHP Medan",
    "page": 8,
    "x": 0.48748208328121506,
    "y": 0.6194786219212178,
    "w": 0.18981899756599196,
    "h": 0.03444631472657962
   }
  ]
 },
 {
  "id": "notula-rata-makmur-20260914",
  "no": 2,
  "file": "n2.pdf",
  "title": "Notula Rapat Pembahasan Rencana Pembayaran Utang Pajak Kepailitan PT Rata Makmur (Dalam Pailit)",
  "subtitle": "Balai Harta Peninggalan Medan · Senin, 14 September 2026",
  "created": "2026-09-14T06:00:00.000Z",
  "signers": [
   {
    "name": "Syafriadi Lubis",
    "role": "Kepala Balai Harta Peninggalan Medan",
    "page": 4,
    "x": 0.6182,
    "y": 0.3932,
    "w": 0.2217,
    "h": 0.0582
   },
   {
    "name": "Dartimnov MT Harahap",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.4906,
    "w": 0.252,
    "h": 0.0344
   },
   {
    "name": "Elsintha Damayanti",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.5214,
    "w": 0.252,
    "h": 0.0344
   },
   {
    "name": "Nanang Surya Purnama",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.5523,
    "w": 0.252,
    "h": 0.0333
   },
   {
    "name": "Joko Prabowo",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.5832,
    "w": 0.252,
    "h": 0.0333
   },
   {
    "name": "Nur Fairuz Diba Nasution",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.6141,
    "w": 0.252,
    "h": 0.0333
   },
   {
    "name": "Shela Natasha",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.6438,
    "w": 0.252,
    "h": 0.0344
   },
   {
    "name": "Hutri Zebua",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.6747,
    "w": 0.252,
    "h": 0.0344
   },
   {
    "name": "Andre Yosua Surbakti",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.7055,
    "w": 0.252,
    "h": 0.0333
   },
   {
    "name": "Yusril Ihza Mahendra",
    "role": "Tim Kurator",
    "page": 4,
    "x": 0.4704,
    "y": 0.7364,
    "w": 0.252,
    "h": 0.0333
   }
  ]
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
