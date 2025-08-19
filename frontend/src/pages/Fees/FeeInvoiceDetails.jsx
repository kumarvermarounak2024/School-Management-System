import React, { useState, useEffect } from "react";
import { IoMdPrint } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4100/api/feeInvoice/getById/${id}`
        );
        const data = {
          ...res.data,
          status: res.data.invoice?.status || "Unpaid",
          invoiceNumber:
            res.data.invoice?.invoiceNo ||
            `#${res.data._id.slice(-4).toUpperCase()}`,
          fine: res.data.invoice?.fine || 0,
          paid: res.data.invoice?.paid || 0,
          balance: res.data.invoice?.balance || 0,
        };
        setInvoice(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch invoice", err);
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const generatePDF = () => {
    if (!invoice) return;

    const doc = new jsPDF();

    // Set font
    doc.setFont("helvetica");

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("INVOICE", 20, 25);

    // Invoice details (top right)
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 120, 25);
    doc.text(
      `Date: ${new Date(invoice.date).toLocaleDateString() || "N/A"}`,
      120,
      32
    );
    doc.text(`Status: ${invoice.status}`, 120, 39);

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 45, 190, 45);

    // Payment Details Section
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Payment Details:", 20, 60);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Account: ${invoice.account || "N/A"}`, 20, 70);
    doc.text(`Payment Method: ${invoice.paymentMethod || "N/A"}`, 20, 77);
    doc.text(`Remark: ${invoice.remark || "N/A"}`, 20, 84);

    // Fee Details Section
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Fee Details:", 120, 60);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Fee Type: ${invoice.feeType || "N/A"}`, 120, 70);
    doc.text(`Discount: ${invoice.discount?.toFixed(2) || "0.00"}`, 120, 77);

    // Table data
    const tableData = [
      [
        "1",
        invoice.feeType || "-",
        new Date(invoice.date).toLocaleDateString() || "-",
        invoice.status,
        invoice.amount?.toFixed(2) || "0.00",
        invoice.discount?.toFixed(2) || "0.00",
        invoice.invoice?.fine?.toFixed(2) || "0.00",
        invoice.invoice?.paid?.toFixed(2) || "0.00",
        invoice.invoice?.balance?.toFixed(2) || "0.00",
      ],
    ];

    // Generate table using autoTable
    autoTable(doc, {
      startY: 95,
      head: [
        [
          "SL",
          "Fees Type",
          "Date",
          "Status",
          "Amount",
          "Discount",
          "Fine",
          "Paid",
          "Balance",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [40, 40, 40],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [60, 60, 60],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { halign: "center", cellWidth: 20 },
        4: { halign: "right", cellWidth: 20 },
        5: { halign: "right", cellWidth: 20 },
        6: { halign: "right", cellWidth: 20 },
        7: { halign: "right", cellWidth: 20 },
        8: { halign: "right", cellWidth: 25 },
      },
      margin: { left: 20, right: 20 },
    });

    // Summary section
    const finalY = doc.lastAutoTable.finalY + 20;

    // Summary box
    doc.setDrawColor(200, 200, 200);
    doc.rect(120, finalY, 70, 60);

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);

    const summaryY = finalY + 10;
    doc.text("Grand Total:", 125, summaryY);
    doc.text(`${invoice.amount?.toFixed(2) || "0.00"}`, 180, summaryY, {
      align: "right",
    });

    doc.text("Discount:", 125, summaryY + 8);
    doc.text(`${invoice.discount?.toFixed(2) || "0.00"}`, 180, summaryY + 8, {
      align: "right",
    });

    doc.text("Paid:", 125, summaryY + 16);
    doc.text(
      `${invoice.invoice?.paid?.toFixed(2) || "0.00"}`,
      180,
      summaryY + 16,
      { align: "right" }
    );

    doc.text("Fine:", 125, summaryY + 24);
    doc.text(
      `${invoice.invoice?.fine?.toFixed(2) || "0.00"}`,
      180,
      summaryY + 24,
      { align: "right" }
    );

    doc.setFont("helvetica", "bold");
    doc.text("Total Paid (With Fine):", 125, summaryY + 32);
    doc.text(
      `${
        (invoice.invoice?.paid + invoice.invoice?.fine)?.toFixed(2) || "0.00"
      }`,
      180,
      summaryY + 32,
      { align: "right" }
    );

    // Balance line
    doc.setDrawColor(40, 40, 40);
    doc.line(125, summaryY + 36, 185, summaryY + 36);

    doc.text("Balance:", 125, summaryY + 44);
    doc.text(
      `${invoice.invoice?.balance?.toFixed(2) || "0.00"}`,
      180,
      summaryY + 44,
      { align: "right" }
    );

    // Save the PDF
    const fileName = `Invoice_${invoice.invoiceNumber.replace("#", "")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!invoice) {
    return <div className="p-4">Invoice not found</div>;
  }

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back to Invoices
      </button>

      <div className="mt-6 border p-4 rounded bg-white">
        <div className="text-right">
          <p className="font-bold">Invoice No. : {invoice.invoiceNumber}</p>
          <p>Date : {new Date(invoice.date).toLocaleDateString() || "N/A"}</p>
          <p
            className={`inline-block px-2 py-1 text-xs rounded ${
              invoice.status === "Paid"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {invoice.status}
          </p>
        </div>

        <hr className="my-5" />

        <div className="flex justify-between text-sm mb-4 flex-wrap">
          <div className="min-w-[250px]">
            <p className="font-bold">Payment Details :</p>
            <p>Account: {invoice.account || "N/A"}</p>
            <p>Payment Method: {invoice.paymentMethod || "N/A"}</p>
            <p>Remark: {invoice.remark || "N/A"}</p>
          </div>
          <div className="min-w-[200px]">
            <p className="font-bold mt-2">Fee Details :</p>
            <p>Fee Type: {invoice.feeType || "N/A"}</p>
            <p>Discount: {invoice.discount?.toFixed(2) || "0.00"}</p>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2">SL</th>
                <th className="border px-2">Fees Type</th>
                <th className="border px-2">Date</th>
                <th className="border px-2">Status</th>
                <th className="border px-2">Amount</th>
                <th className="border px-2">Discount</th>
                <th className="border px-2">Fine</th>
                <th className="border px-2">Paid</th>
                <th className="border px-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 text-center">1</td>
                <td className="border px-2">{invoice.feeType || "-"}</td>
                <td className="border px-2">
                  {new Date(invoice.date).toLocaleDateString() || "-"}
                </td>
                <td className="border px-2 text-center">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="border px-2 text-right">
                  {invoice.amount?.toFixed(2) || "0.00"}
                </td>
                <td className="border px-2 text-right">
                  {invoice.discount?.toFixed(2) || "0.00"}
                </td>
                <td className="border px-2 text-right">
                  {invoice.invoice?.fine?.toFixed(2) || "0.00"}
                </td>
                <td className="border px-2 text-right">
                  {invoice.invoice?.paid?.toFixed(2) || "0.00"}
                </td>
                <td className="border px-2 text-right">
                  {invoice.invoice?.balance?.toFixed(2) || "0.00"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-sm mt-4 w-full md:w-1/3 ml-auto border p-2">
          <div className="flex justify-between">
            <span>Grand Total</span>
            <span>{invoice.amount?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>{invoice.discount?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid</span>
            <span>{invoice.invoice?.paid?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between">
            <span>Fine</span>
            <span>{invoice.invoice?.fine?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total Paid (With Fine)</span>
            <span>
              {(invoice.invoice?.paid + invoice.invoice?.fine)?.toFixed(2) ||
                "0.00"}
            </span>
          </div>
          <div className="flex justify-between font-semibold border-t mt-2 pt-2">
            <span>Balance</span>
            <span>{invoice.invoice?.balance?.toFixed(2) || "0.00"}</span>
          </div>
        </div>

        <button
          onClick={generatePDF}
          className="mt-4 flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
        >
          <IoMdPrint /> Print PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetails;
