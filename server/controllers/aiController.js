import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from "form-data";
import fs from 'fs';
import OpenAI from "openai";
import sql from "../configs/db.js";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
// =======================
// 1. ARTICLE GENERATION
// =======================

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

    const content = generateArticleTemplate(prompt, length);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

function generateArticleTemplate(topic, length = 1200) {
  const wordCount = parseInt(length) || 1200;
  const sectionCount = Math.max(4, Math.floor(wordCount / 250));

  const introduction = `# ${topic}

---

## 📌 Introduction

${topic} is a topic of growing importance in today's fast-changing world. Whether you are a beginner exploring this subject for the first time or someone looking to deepen your understanding, having a clear foundation is essential.

In this article, we will explore the meaning, importance, applications, challenges, and future of **${topic}**, giving you a complete and easy-to-understand overview.

---

`;

  const sections = [];

  for (let i = 1; i <= sectionCount; i++) {
    sections.push(`## 🔹 Section ${i}: Understanding ${topic}

${topic} plays a significant role in modern society. This section focuses on its practical meaning and real-world relevance.

### Key Concepts

- What ${topic} means in simple terms  
- Why ${topic} is important today  
- How it impacts individuals and businesses  
- Common misconceptions about ${topic}

### Practical Examples

In everyday life, ${topic} can be seen in:

- Education and learning environments  
- Business and professional industries  
- Technology and digital platforms  
- Social and cultural development  

Understanding these examples helps build a clearer picture of how ${topic} operates beyond theory.

### Challenges

While ${topic} offers many benefits, it also comes with challenges such as:

- Lack of awareness or training  
- Limited resources or accessibility  
- Rapid changes in technology  
- Ethical or social concerns  

Recognizing these challenges allows individuals and organizations to prepare better and adapt effectively.

---

`);
  }

  const benefitsSection = `## ✅ Benefits of ${topic}

Adopting and understanding ${topic} offers many advantages:

- Improves decision-making and problem-solving  
- Enhances productivity and efficiency  
- Encourages innovation and creativity  
- Builds long-term sustainability  
- Strengthens personal and professional growth  

These benefits explain why ${topic} continues to gain attention across industries.

---

`;

  const futureSection = `## 🚀 Future of ${topic}

The future of ${topic} looks promising. Experts predict:

- Increased integration with emerging technologies  
- Wider adoption across industries  
- New career opportunities  
- Better tools and frameworks  
- Stronger global collaboration  

Staying informed about these trends can provide a competitive advantage and open new possibilities.

---

`;

  const conclusion = `## 🏁 Conclusion

${topic} is more than just a trend — it is a powerful concept shaping the present and the future. By understanding its principles, challenges, and opportunities, you are better equipped to use it effectively in your personal or professional life.

We encourage you to continue learning, experimenting, and applying what you’ve discovered about **${topic}**.

---

✍️ *This article was generated using an automated template system. You may edit, expand, or customize it to fit your specific needs.*

`;

  return (
    introduction +
    sections.join("") +
    benefitsSection +
    futureSection +
    conclusion
  );
}

// =======================
// 2. BLOG TITLES
// =======================
export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { keyword, category } = req.body;

    if (!keyword) {
      return res.json({
        success: false,
        message: "Keyword is required",
      });
    }

    const titles = generateBlogTitles(keyword, category);

    const content = titles.map(t => `- ${t}`).join("\n");

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${keyword}, ${content}, 'blog-title')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
function generateBlogTitles(keyword, category = "General") {
  const k = keyword.trim().replace(/\b\w/g, c => c.toUpperCase());

  const templates = {
    General: [
      `10 Things You Should Know About ${k}`,
      `The Ultimate Guide to ${k}`,
      `${k}: Everything You Need to Know`,
      `Why ${k} Matters More Than Ever`,
      `Beginner’s Guide to ${k}`,
      `${k} Explained Simply`,
      `Common Mistakes People Make With ${k}`,
      `The Future of ${k}`,
    ],

    Technology: [
      `How ${k} Is Changing Technology`,
      `The Ultimate Tech Guide to ${k}`,
      `Why ${k} Is the Future of Technology`,
      `${k}: A Complete Tech Breakdown`,
      `Top Tech Trends Around ${k}`,
      `${k} in 2025: What’s Next?`,
      `Is ${k} the Next Big Tech Revolution?`,
    ],

    Business: [
      `How ${k} Is Transforming Modern Business`,
      `The Business Guide to ${k}`,
      `Why ${k} Matters for Entrepreneurs`,
      `${k}: A Smart Business Strategy`,
      `How Companies Are Using ${k}`,
      `${k} for Business Growth in 2025`,
      `Top Business Benefits of ${k}`,
    ],

    Health: [
      `How ${k} Impacts Your Health`,
      `The Complete Health Guide to ${k}`,
      `Benefits of ${k} for a Healthy Life`,
      `${k}: What Doctors Want You to Know`,
      `Is ${k} Good or Bad for You?`,
      `${k} and Mental Wellbeing`,
    ],

    Lifestyle: [
      `How ${k} Is Changing Modern Lifestyle`,
      `${k}: A Better Way to Live`,
      `Why ${k} Is Trending`,
      `${k} for a Balanced Life`,
      `Living Smarter With ${k}`,
    ],

    Education: [
      `How ${k} Is Transforming Education`,
      `${k}: A Student’s Guide`,
      `Why ${k} Matters in Learning`,
      `${k} in Modern Classrooms`,
      `The Future of Education With ${k}`,
    ],

    Travel: [
      `${k}: The Ultimate Travel Guide`,
      `Why ${k} Is Perfect for Travelers`,
      `${k}: Hidden Travel Tips`,
      `Best Places to Experience ${k}`,
      `Travel Smarter With ${k}`,
    ],

    Food: [
      `${k}: A Food Lover’s Guide`,
      `Why ${k} Is Trending in Food Culture`,
      `Best Recipes Using ${k}`,
      `Health Benefits of ${k}`,
      `How to Cook Perfect ${k}`,
    ],
  };

  const list = templates[category] || templates.General;
  const shuffled = [...list].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 8);
}




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

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

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

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

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

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

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

    const prompt = `The user uploaded a resume PDF (content not parsed on the server yet).
Give general guidance on how to improve a resume:
- common mistakes
- good formatting practices
- strong bullet points
- how to structure experience and skills`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 700,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume (generic advice)', ${content}, 'resume-review')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};











