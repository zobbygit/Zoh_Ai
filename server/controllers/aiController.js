import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import fs from "fs";
import OpenAI from "openai";
import sql from "../configs/db.js";
import { PDFParse } from "pdf-parse";

// ======================================================
// GROQ AI CONFIGURATION
// ======================================================

const AI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// Current Groq production model.
// You can change this later without changing the controller.
const GROQ_MODEL = "openai/gpt-oss-120b";

// ======================================================
// 1. ARTICLE GENERATION — GROQ AI
// ======================================================

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;

    if (!prompt) {
      return res.json({
        success: false,
        message: "Please provide a topic for the article.",
      });
    }

    const wordCount = parseInt(length) || 1200;

    const systemPrompt = `
You are a professional SEO content writer.

Write high-quality, original, engaging and well-structured articles.

Requirements:
- Use Markdown formatting.
- Start with a clear H1 title.
- Include an introduction.
- Use meaningful H2 and H3 headings.
- Explain concepts clearly.
- Include practical examples where relevant.
- Include benefits, challenges and future/outlook where appropriate.
- Use bullet points or numbered lists when useful.
- End with a strong conclusion.
- Avoid unnecessary repetition.
- Do not mention that AI generated the article.
- Do not add meta commentary outside the article.
`;

    const userPrompt = `
Write a complete article about:

"${prompt}"

Target length: approximately ${wordCount} words.

Make the article informative, natural, useful and easy to read.
`;

    const response = await AI.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: Math.min(Math.max(wordCount + 500, 1000), 16000),
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return res.json({
        success: false,
        message: "Groq AI did not return any article content.",
      });
    }

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Generate article error:", error);

    res.json({
      success: false,
      message:
        error?.response?.data?.error?.message ||
        error.message ||
        "Failed to generate article.",
    });
  }
};

// ======================================================
// 2. BLOG TITLES — GROQ AI
// ======================================================

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { keyword, category } = req.body;

    if (!keyword) {
      return res.json({
        success: false,
        message: "Keyword is required.",
      });
    }

    const selectedCategory = category || "General";

    const systemPrompt = `
You are an expert blog title generator and SEO content strategist.

Generate creative, engaging and clickable blog titles.

Rules:
- Generate exactly 10 titles.
- Every title must be different.
- Titles should be natural and professional.
- Keep titles relevant to the keyword.
- Consider the requested category.
- Avoid fake claims and excessive clickbait.
- Do not number the titles.
- Return ONLY the titles, one title per line.
`;

    const userPrompt = `
Keyword: "${keyword}"
Category: "${selectedCategory}"

Generate 10 strong blog titles for this topic.
`;

    const response = await AI.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
    });

    let content = response.choices?.[0]?.message?.content;

    if (!content) {
      return res.json({
        success: false,
        message: "Groq AI did not return any blog titles.",
      });
    }

    // Clean possible numbering/bullets from Groq output
    content = content
      .split("\n")
      .map((title) =>
        title
          .replace(/^\s*[-*•]\s*/, "")
          .replace(/^\s*\d+[\.\)]\s*/, "")
          .trim()
      )
      .filter(Boolean)
      .slice(0, 10)
      .map((title) => `- ${title}`)
      .join("\n");

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${keyword}, ${content}, 'blog-title')
    `;

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Generate blog title error:", error);

    res.json({
      success: false,
      message:
        error?.response?.data?.error?.message ||
        error.message ||
        "Failed to generate blog titles.",
    });
  }
};

// ======================================================
// 3. IMAGE GENERATION — CLIPDROP AI
// ======================================================

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available to premium users.",
      });
    }

    if (!prompt) {
      return res.json({
        success: false,
        message: "Image prompt is required.",
      });
    }

    let imageData;
    let usedFallback = false;

    try {
      const formData = new FormData();

      formData.append("prompt", prompt);

      const { data } = await axios.post(
        "https://clipdrop-api.co/text-to-image/v1",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "x-api-key": process.env.CLIPDROP_API_KEY,
          },
          responseType: "arraybuffer",
          timeout: 60000,
        }
      );

      imageData = `data:image/png;base64,${Buffer.from(data).toString(
        "base64"
      )}`;
    } catch (clipdropError) {
      console.error(
        "Clipdrop image generation failed:",
        clipdropError?.response?.data || clipdropError.message
      );

      usedFallback = true;

      const fallbackSvg = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="1024"
          viewBox="0 0 1024 1024"
        >
          <defs>
            <linearGradient
              id="bg"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stop-color="#111827"/>
              <stop offset="100%" stop-color="#312e81"/>
            </linearGradient>
          </defs>

          <rect
            width="1024"
            height="1024"
            fill="url(#bg)"
          />

          <circle
            cx="512"
            cy="350"
            r="130"
            fill="#6366f1"
            opacity="0.8"
          />

          <text
            x="512"
            y="540"
            text-anchor="middle"
            fill="white"
            font-family="Arial, sans-serif"
            font-size="48"
            font-weight="bold"
          >
            AI Image
          </text>

          <text
            x="512"
            y="590"
            text-anchor="middle"
            fill="#c7d2fe"
            font-family="Arial, sans-serif"
            font-size="22"
          >
            Fallback Mode
          </text>

          <text
            x="512"
            y="680"
            text-anchor="middle"
            fill="#9ca3af"
            font-family="Arial, sans-serif"
            font-size="20"
          >
            Clipdrop image generation unavailable
          </text>
        </svg>
      `;

      imageData = `data:image/svg+xml;base64,${Buffer.from(
        fallbackSvg
      ).toString("base64")}`;
    }

    const uploadResult = await cloudinary.uploader.upload(imageData, {
      resource_type: "image",
    });

    await sql`
      INSERT INTO creations (
        user_id,
        prompt,
        content,
        type,
        publish
      )
      VALUES (
        ${userId},
        ${prompt},
        ${uploadResult.secure_url},
        'image',
        ${publish ?? false}
      )
    `;

    res.json({
      success: true,
      content: uploadResult.secure_url,
      fallback: usedFallback,
    });
  } catch (error) {
    console.error("Generate image error:", error);

    res.json({
      success: false,
      message: error.message || "Failed to generate image.",
    });
  }
};

// ======================================================
// 4. REMOVE IMAGE BACKGROUND — CLIPDROP AI
// ======================================================

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available to premium users.",
      });
    }

    if (!image) {
      return res.json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    let outputBuffer;
    let usedFallback = false;

    try {
      const formData = new FormData();

      formData.append(
        "image_file",
        fs.createReadStream(image.path)
      );

      const { data } = await axios.post(
        "https://clipdrop-api.co/remove-background/v1",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "x-api-key": process.env.CLIPDROP_API_KEY,
          },
          responseType: "arraybuffer",
          timeout: 60000,
        }
      );

      outputBuffer = Buffer.from(data);
    } catch (clipdropError) {
      console.error(
        "Clipdrop background removal failed:",
        clipdropError?.response?.data || clipdropError.message
      );

      usedFallback = true;

      outputBuffer = fs.readFileSync(image.path);
    }

    const base64Image = `data:image/png;base64,${outputBuffer.toString(
      "base64"
    )}`;

    const uploadResult = await cloudinary.uploader.upload(
      base64Image,
      {
        resource_type: "image",
      }
    );

    await sql`
      INSERT INTO creations (
        user_id,
        prompt,
        content,
        type
      )
      VALUES (
        ${userId},
        'Remove background from image',
        ${uploadResult.secure_url},
        'image'
      )
    `;

    res.json({
      success: true,
      content: uploadResult.secure_url,
      fallback: usedFallback,
    });
  } catch (error) {
    console.error("Remove background error:", error);

    res.json({
      success: false,
      message: error.message || "Failed to remove image background.",
    });
  }
};

// ======================================================
// 5. REMOVE IMAGE OBJECT — CLOUDINARY AI
// ======================================================

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available to premium users.",
      });
    }

    if (!image) {
      return res.json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    if (!object) {
      return res.json({
        success: false,
        message: "Please specify the object to remove.",
      });
    }

    let imageUrl;
    let usedFallback = false;

    try {
      const uploadResult = await cloudinary.uploader.upload(image.path);

      imageUrl = cloudinary.url(uploadResult.public_id, {
        resource_type: "image",
        transformation: [
          {
            effect: `gen_remove:${object}`,
          },
        ],
      });
    } catch (cloudinaryError) {
      console.error(
        "Cloudinary object removal failed:",
        cloudinaryError.message
      );

      usedFallback = true;

      const fallbackUpload = await cloudinary.uploader.upload(
        image.path
      );

      imageUrl = fallbackUpload.secure_url;
    }

    await sql`
      INSERT INTO creations (
        user_id,
        prompt,
        content,
        type
      )
      VALUES (
        ${userId},
        ${`Removed ${object} from image`},
        ${imageUrl},
        'image'
      )
    `;

    res.json({
      success: true,
      content: imageUrl,
      fallback: usedFallback,
    });
  } catch (error) {
    console.error("Remove image object error:", error);

    res.json({
      success: false,
      message: error.message || "Failed to remove image object.",
    });
  }
};

// ======================================================
// 6. RESUME REVIEW — ACTUAL PDF CONTENT + GROQ
// ======================================================

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available to premium users.",
      });
    }

    if (!resume) {
      return res.json({
        success: false,
        message: "No resume file uploaded.",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size 5MB.",
      });
    }

    const isPdf =
      resume.mimetype === "application/pdf" ||
      resume.originalname?.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return res.json({
        success: false,
        message: "Please upload a PDF resume.",
      });
    }

    // --------------------------------------------------
    // READ PDF
    // --------------------------------------------------

    const pdfBuffer = fs.readFileSync(resume.path);

    let resumeText = "";

    try {
      const parser = new PDFParse({
        data: pdfBuffer,
      });

      const result = await parser.getText();

      resumeText = result.text?.trim() || "";

      await parser.destroy();
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);

      return res.json({
        success: false,
        message:
          "Unable to read the uploaded PDF. Please upload a valid text-based PDF.",
      });
    }

    if (!resumeText) {
      return res.json({
        success: false,
        message:
          "No readable text was found in the resume. Please upload a text-based PDF.",
      });
    }

    // Avoid sending an unnecessarily huge PDF to the model
    const MAX_RESUME_CHARS = 100000;

    const extractedResumeText = resumeText.slice(
      0,
      MAX_RESUME_CHARS
    );

    console.log(
      `Resume extracted successfully: ${extractedResumeText.length} characters`
    );

    console.log("========== ACTUAL EXTRACTED RESUME ==========");
    console.log(extractedResumeText);
    console.log("=============================================");

    // --------------------------------------------------
    // GROQ PROMPT
    // --------------------------------------------------

    const systemPrompt = `
You are NOT a generic resume advisor.

You are an evidence-based resume analyzer.

Your ONLY source of truth is the ACTUAL RESUME TEXT supplied
inside the user message.

You MUST analyze that exact resume.

==========================================================
CRITICAL GROUNDING RULES
==========================================================

1. NEVER give generic resume advice.

2. NEVER assume the resume contains experience, projects,
   technologies, achievements, metrics, certifications,
   education or skills that are not explicitly present.

3. Every important statement MUST reference something
   actually present in the resume.

4. Use the actual person's name if it appears in the resume.

5. Mention the ACTUAL job titles, companies, projects,
   technologies, education and skills found in the resume.

6. If the resume contains NO work experience, do NOT say:
   "your work history demonstrates..."
   Instead say:
   "No professional work experience is listed."

7. If the resume contains NO metrics, say:
   "The resume does not currently contain measurable
   achievements in this section."
   Do NOT invent metrics.

8. If the resume contains projects, mention their ACTUAL
   project names.

9. If the resume contains technologies, mention the ACTUAL
   technologies.

10. If the resume contains a summary, analyze its ACTUAL text.

11. If there is no summary, explicitly say:
    "No professional summary was found."

12. If there is no experience section, explicitly say:
    "No professional experience was found."

13. If there are no certifications, explicitly say:
    "No certifications were found."

14. Do NOT use placeholder examples such as:
    "Improved sales performance"
    "Increased sales by 35%"
    "Spearheaded..."
    unless that exact information exists in the resume.

15. Do NOT recommend adding metrics unless there is a
    specific resume bullet where metrics would logically
    improve the statement.

16. Do NOT invent ATS keywords.

17. Only identify ATS keywords that are already present or
    clearly relevant to an actual role/project/experience
    shown in the resume.

18. Quote actual resume text when reviewing wording.

19. When rewriting something, preserve the original facts.
    Do not add new technologies, numbers, companies,
    responsibilities or achievements.

20. If something cannot be determined from the resume,
    explicitly say that it cannot be determined.

==========================================================
FIRST: IDENTIFY THE RESUME FACTS
==========================================================

Before writing the analysis, inspect the entire resume and
identify internally:

- Candidate name
- Contact information
- Professional summary
- Experience entries
- Companies
- Job titles
- Dates
- Projects
- Project technologies
- Skills
- Education
- Certifications
- GitHub
- LinkedIn
- Portfolio
- Achievements
- Other sections

Then use those actual facts throughout the analysis.

==========================================================
OUTPUT
==========================================================

Return ONLY this Markdown structure:

# Resume Analysis & Feedback

## 📋 Resume Snapshot

**Candidate:** [actual name or "Not found"]

**Experience:** [actual number/type of roles, or "No professional experience listed"]

**Projects:** [actual project names]

**Education:** [actual education]

**Primary Technologies:** [actual technologies]

## 📊 Overall Assessment

Give a specific assessment of THIS resume.

Mention actual characteristics of the resume.

Do NOT say generic things such as:
"solid foundation"
"professional formatting"
"clear structure"
unless you explain exactly what in THIS resume supports that statement.

## ✅ Strengths

Give 4-6 strengths based specifically on this resume.

Every strength must reference an actual resume element.

Example:

- The **[actual project name]** project demonstrates use of
  **[actual technologies]**.

Do NOT create fictional information.

## ⚠️ Areas for Improvement

Give specific issues found in THIS resume.

For every issue:

### Issue
Explain the exact problem.

### Evidence
Quote or identify the relevant resume content.

### Improvement
Give a concrete correction.

## 👤 Professional Summary

### Current Summary

Quote the ACTUAL summary from the resume.

If missing, say:
"No professional summary was found."

### Analysis

Explain what is good or weak about the actual summary.

### Suggested Summary

If improvement is needed, rewrite it using ONLY facts
contained in the resume.

Never add fictional experience or skills.

## 💼 Experience

Review EACH actual experience entry separately.

For each role include:

### [Actual Job Title] — [Actual Company]

**Dates:** [actual dates]

**What the resume says:**
Summarize the actual responsibilities.

**Strengths:**
Specific strengths from the actual entry.

**Problems:**
Specific problems from the actual entry.

**Bullet Improvements:**
Rewrite weak bullets using ONLY the original facts.

If no experience exists:

"No professional experience is listed in this resume."

## 🚀 Projects

Review EACH actual project separately.

For every project:

### [Actual Project Name]

**Technologies:**
Only technologies explicitly mentioned.

**What the project shows:**
Explain based on the actual description.

**Strengths:**
Specific strengths.

**Weaknesses:**
Specific weaknesses.

**Improved Resume Version:**
Rewrite the project description using ONLY existing facts.

Never invent features.

## 🛠️ Skills

List the actual skills found in the resume.

Analyze:

- Organization
- Categorization
- Relevance
- Duplication
- Presentation

Do NOT invent missing skills.

## 🎓 Education

Report and analyze the actual education information.

Include:

- Institution
- Degree
- Field
- Dates
- GPA/CGPA if present

Only use information present in the resume.

## 🏆 Certifications & Achievements

Review actual certifications and achievements.

If absent, explicitly say they were not found.

## 🤖 ATS Analysis

Analyze THIS resume specifically.

Cover:

- Section headings
- Keywords actually present
- Keyword relevance
- Formatting
- Contact information
- Skills formatting
- Project formatting
- Experience formatting
- Professional links

Do not claim ATS problems without evidence.

## ✍️ Grammar & Wording

Find actual grammar, spelling or wording problems.

Use:

### Before
"EXACT TEXT FROM RESUME"

### After
"CORRECTED VERSION"

Only correct text that actually appears in the resume.

If no meaningful issues are found, say so.

## 🔗 Professional Links

Check the actual resume for:

- GitHub
- LinkedIn
- Portfolio
- Other professional links

List only links that actually appear.

## 🎯 Top 5 Priority Fixes

Give exactly 5 fixes.

Each fix MUST refer to something actually found
in this resume.

Do not give generic advice.

## ⭐ Final Assessment

Give a concise final assessment based ONLY on the
actual resume.

==========================================================
FINAL ANTI-GENERIC CHECK
==========================================================

Before returning the answer, verify:

- Did I mention the candidate's actual name?
- Did I mention actual project names?
- Did I mention actual technologies?
- Did I mention actual education?
- Did I mention actual experience or explicitly state
  that experience is absent?
- Did I quote actual resume text?
- Did I avoid invented metrics?
- Did I avoid invented companies?
- Did I avoid invented skills?
- Did I avoid generic resume advice?

If any answer is NO, revise the response before returning it.
`;

    const userPrompt = `
Analyze ONLY the following extracted resume.

IMPORTANT:
This is the user's REAL resume.

Do not give a generic resume guide.

Use the exact information below as your source of truth.

========================================================
ACTUAL RESUME
========================================================

${extractedResumeText}

========================================================
END ACTUAL RESUME
========================================================

Now perform the complete evidence-based analysis.

You MUST reference the actual content above throughout
your response.
`;

    // --------------------------------------------------
    // GROQ
    // --------------------------------------------------

    const response = await AI.chat.completions.create({
      model: GROQ_MODEL,

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],

      temperature: 0.1,
      max_tokens: 7000,
    });

    const content =
      response.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return res.json({
        success: false,
        message: "Groq AI did not return a resume analysis.",
      });
    }

    // --------------------------------------------------
    // SAVE RESULT
    // --------------------------------------------------

    await sql`
      INSERT INTO creations (
        user_id,
        prompt,
        content,
        type
      )
      VALUES (
        ${userId},
        'AI analysis of uploaded resume',
        ${content},
        'resume-review'
      )
    `;

    return res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Resume review error:", error);

    return res.json({
      success: false,
      message:
        error?.response?.data?.error?.message ||
        error.message ||
        "Failed to analyze resume.",
    });
  }
};