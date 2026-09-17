import {
    FileChartPieIcon,
    FileUser,
    ListCheck,X
} from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import jsPDF from "jspdf";

const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!input) {
    toast.error("Please select a PDF resume.");
    return;
  }

  try {
    setLoading(true);
    setContent("");

    const formData = new FormData();
    formData.append("resume", input);



const apiUrl =
  `${import.meta.env.VITE_BASE_URL}/api/ai/resume-review`;

    console.log("Resume Review API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    // Don't blindly call response.json()
    const responseText = await response.text();

    console.log("Status:", response.status);
    console.log("Backend response:", responseText);

    let data = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status}).`
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          `Resume review failed with status ${response.status}`
      );
    }

    setContent(data.content);

    toast.success("Resume Reviewed Successfully!");
  } catch (error) {
    console.error("Resume review error:", error);
    toast.error(error.message || "Failed to review resume.");
  } finally {
    setLoading(false);
  }
};
const downloadPDF = () => {
  if (!content) {
    toast.error("Nothing to download.");
    return;
  }

  try {
    toast.loading("Preparing PDF...", {
      id: "pdf-download",
    });

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text("Resume Analysis & Feedback", margin, y);

    y += 12;

    // Divider
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);

    y += 10;

    // Clean Markdown
    const cleanText = content
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/^\s*[-*]\s+/gm, "• ")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/>\s?/gm, "")
      .replace(/---+/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const lines = pdf.splitTextToSize(
      cleanText,
      contentWidth
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(50, 50, 50);

    const lineHeight = 5;

    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - 15) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(line, margin, y);

      y += lineHeight;
    });

    // Page numbers
    const totalPages = pdf.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);

      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 8,
        {
          align: "right",
        }
      );
    }

    pdf.save("resume-review.pdf");

    toast.success("PDF downloaded successfully!", {
      id: "pdf-download",
    });
  } catch (error) {
    console.error("PDF generation error:", error);

    toast.error("Failed to generate PDF.", {
      id: "pdf-download",
    });
  }
};
const removeResponse = () => {
  setContent("");
  toast.success("Response removed.");
};
  return (
    <div className="min-h-screen p-6 text-slate-700 bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      {/* --------------------------------------------- */}
      {/* HEADER */}
      {/* --------------------------------------------- */}

      <div className="flex justify-center mb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-6">
            <FileUser className="w-4 h-4 text-[#d4b400]" />

            <span className="text-sm font-semibold text-[#d4b400]">
              AI-Powered Resume Review
            </span>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-[#d4b400] to-[#b89400] bg-clip-text text-transparent mb-3">
            Review Resume
          </h1>

          <p className="text-lg text-gray-600">
            Get AI-powered feedback to enhance your resume
          </p>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* MAIN */}
      {/* --------------------------------------------- */}

      <div className="flex justify-center items-start gap-6 lg:gap-10 flex-col lg:flex-row w-full">

        {/* ------------------------------------------- */}
        {/* LEFT CARD */}
        {/* ------------------------------------------- */}

        <form
          onSubmit={onSubmitHandler}
          className="w-full lg:w-1/2 lg:max-w-xl p-6 lg:p-8 bg-white rounded-2xl border border-yellow-200 shadow-xl shadow-yellow-200/50 hover:shadow-2xl hover:shadow-yellow-300/70 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <FileUser className="w-6 lg:w-7 h-6 lg:h-7 text-[#d4b400]" />
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Review Your Resume
            </h1>
          </div>

          <label className="block mt-6 text-sm font-semibold text-gray-700">
            Upload Resume
          </label>

          <input
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) {
                setInput(null);
                return;
              }

              if (file.type !== "application/pdf") {
                toast.error("Please upload a PDF file.");
                e.target.value = "";
                setInput(null);
                return;
              }

              if (file.size > 5 * 1024 * 1024) {
                toast.error("Resume must be smaller than 5MB.");
                e.target.value = "";
                setInput(null);
                return;
              }

              setInput(file);
            }}
            type="file"
            accept="application/pdf"
            required
            className="cursor-pointer w-full p-3 mt-2 text-sm rounded-lg border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-gray-700 file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-yellow-50 file:text-yellow-700 file:font-semibold hover:file:bg-yellow-100"
          />

          <p className="text-xs text-gray-500 mt-2 font-light">
            Supports PDF only • Maximum 5MB
          </p>

          {/* Selected file */}

          {input && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <div className="flex items-center gap-3">
                <FileUser className="w-5 h-5 text-[#d4b400]" />

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {input.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {(input.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !input}
            className="w-full flex justify-center items-center gap-2 mt-8 bg-gradient-to-r from-[#d4b400] to-[#b89400] hover:from-[#b89400] hover:to-[#8a6f00] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-md shadow-yellow-300/50 hover:shadow-xl hover:shadow-yellow-400/80 transition-all duration-300 transform hover:scale-[1.03] disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <ListCheck className="w-5 h-5" />
            )}

            <span>
              {loading ? "Analyzing Resume..." : "Review Resume"}
            </span>
          </button>
        </form>

        {/* ------------------------------------------- */}
        {/* RIGHT CARD */}
        {/* ------------------------------------------- */}

        <div className="w-full lg:w-1/2 lg:max-w-xl p-6 lg:p-8 bg-white rounded-2xl border border-yellow-200 shadow-xl shadow-yellow-200/50 min-h-[500px] lg:min-h-[600px] flex flex-col transition-all">
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <FileChartPieIcon className="w-6 h-6 text-[#d4b400]" />
            </div>

            <h1 className="text-xl font-bold text-gray-800">
              Generated Response
            </h1>
              {content && (
                  <div className="flex items-center gap-2">
    <button
      type="button"
      onClick={downloadPDF}
      className="px-4 py-2 rounded-lg bg-[#d4b400] hover:bg-[#b89400] text-white text-sm font-semibold transition-all"
    >
      Download PDF
    </button>

      {/* Remove Response */}
      <button
        type="button"
        onClick={removeResponse}
        title="Remove response"
        className="p-2 rounded-lg border border-red-200 bg-red-50 text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600 transition-all"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
    

    
  )}


          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center bg-gradient-to-br from-yellow-50/40 to-transparent rounded-xl border-2 border-dashed border-yellow-300">
              <div className="text-sm flex flex-col items-center gap-6 text-gray-500 p-6">
                <div className="p-5 bg-yellow-50 rounded-full border border-yellow-200">
                  <FileChartPieIcon className="w-12 h-12 text-yellow-300" />
                </div>

                <p className="font-medium text-center text-gray-600">
                  {loading ? (
                    <>
                      Analyzing your actual resume...
                      <br />
                      Please wait
                    </>
                  ) : (
                    <>
                      Select a file and click
                      <br />
                      "Review Resume"
                    </>
                  )}
                </p>
              </div>
            </div>
          ) : (
  <div
  id="resume-review-content"
  className="flex-1 overflow-y-auto pr-3"
>
              <div
                className="prose prose-sm max-w-none
                prose-headings:font-bold
                prose-headings:text-gray-800
                prose-h1:text-xl
                prose-h2:text-lg
                prose-h3:text-base
                prose-p:text-gray-700
                prose-p:leading-relaxed
                prose-li:text-gray-700
                prose-li:marker:text-[#d4b400]
                prose-strong:text-gray-800
                prose-strong:font-semibold
                prose-em:text-gray-700
                prose-a:text-[#d4b400]
                hover:prose-a:text-[#b89400]
                prose-code:bg-yellow-50
                prose-code:text-[#d4b400]
                prose-code:px-2
                prose-code:py-1
                prose-code:rounded
                prose-blockquote:border-l-4
                prose-blockquote:border-[#d4b400]
                prose-blockquote:pl-4
                space-y-3"
              >
                <Markdown>
                  {content}
                </Markdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;