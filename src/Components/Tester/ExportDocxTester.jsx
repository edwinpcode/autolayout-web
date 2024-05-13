import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import PizZipUtils from "pizzip/utils/index.js"
import { saveAs } from "file-saver"
import axios from "axios"

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback)
}

const ExportDocxTester = () => {
  const generateDocument = () => {
    loadFile("/Data/sample_dokumen.docx", function (error, content) {
      if (error) {
        throw error
      }
      var zip = new PizZip(content)
      var doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      })
      doc.setData({
        apRegno: "2424124124124",
        tanggal: "Selasa tanggal 19 bulan Januari tahun 2023 (19-01-2023)",
        pihakPertama: "Dedi Sulistyo",
        namaList: [
          {
            nama: "Faris",
            alamat: "Bantul Kelurahan Bantul Utara Kecamatan Purwokerto",
            kabupaten: "Sleman",
            provinsi: "Yogyakarta",
            perusahaan: "PT Dedi Jaya",
            alamatPerusahaan: "fasfasfa",
          },
        ],
        jenisKegiatanUsaha: "Angkringan",
        penerimaPinjaman: [
          {
            nama: "Aldous",
            jabatan: "Satpam",
            ktp: "224243253534534",
            alamat: "Gombong City",
            npwp: "6666666666666",
            hp: "0838383838383",
            email: "aldous@email.com",
          },
          {
            nama: "Alfin",
            jabatan: "Striker",
            ktp: "224243253534534",
            alamat: "Tambak City",
            npwp: "1111111111",
            hp: "0869696969669",
            email: "alfin@email.com",
          },
        ],
        uangPinjaman: "Rp.10,000,000.00 (Sepuluh Juta Rupiah)",
        jangkaWaktu: "12 Bulan (365 Hari)",
        tanggalPinjam: "19, Januari, 2023",
        tanggalJatuhTempo: "19, Januari, 2024",
        besarSewaModal: "10% (Sepuluh per seratus)",
        biayaAdministrasi: "5% (Lima per seratus)",
        bulletPayment: "Rp.10,000,000.00 (sepuluh juta rupiah)",
        virtualAccount: "123456789",
        namaKadiv: "Muhaecal Dwi Khatami",
        namaPicNasabah: [
          {
            nama: "Dedi Sulistyo",
          },
          {
            nama: "Juragan Faris",
          },
          {
            nama: "Dedi Faris",
          },
        ],
      })
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
      } catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function (
              error,
              key,
            ) {
              error[key] = value[key]
              return error
            }, {})
          }
          return value
        }
        // console.log(JSON.stringify({ error: error }, replaceErrors))

        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function (error) {
              return error.properties.explanation
            })
            .join("\n")
          // console.log('errorMessages', errorMessages)
          // errorMessages is a humanly readable message looking like this :
          // 'The tag beginning with "foobar" is unopened'
        }
        throw error
      }
      var out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }) //Output the document using Data-URI
      saveAs(out, "output.docx")
    })
  }

  const generatePdf = async () => {
    await axios.get("http://localhost:4000/").then((res) => {
      window.open("data:application/pdf;base64," + res.data.file)
    })
  }

  return (
    <div className="py-2">
      <h3>Export to Docx</h3>
      <button onClick={generateDocument}>Generate document</button>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  )
}

export default ExportDocxTester
